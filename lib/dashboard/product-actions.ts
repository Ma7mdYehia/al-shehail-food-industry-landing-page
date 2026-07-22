"use server";

// Products / categories / details / options server actions — thin wrappers over
// the pure builders in ./inputs (which reject unknown fields, validate, and set
// the security defaults: new content is INACTIVE). Every mutation re-authorizes
// (getUser()+active membership+role), uses RLS-protected queries, applies
// updated_at optimistic concurrency, checks EVERY { data, error }, and returns
// only generic errors. Hard delete is owner/admin AND only for dashboard-created
// (UUID) records — seed-backed content is edit/deactivate only. FK references
// are protected by the database.

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  authorizeAction,
  fail,
  invalid,
  success,
  type ActionState,
} from "@/lib/dashboard/actions-core";
import { canDeleteContent } from "@/lib/auth/roles";
import { isDashboardCreatedId, rejectUnknownFormData, type FieldErrors } from "@/lib/dashboard/validation";
import {
  buildProductCreate,
  buildProductUpdate,
  buildProductDetail,
  buildOptionCreate,
  buildOptionUpdate,
  buildCategoryCreate,
  buildCategoryUpdate,
} from "@/lib/dashboard/inputs";

const PATH = "/dashboard/products";
const STALE = "This record was changed by someone else. Please refresh and try again.";
const SEED_DEL = "Seed-backed records cannot be deleted. Deactivate them instead.";

function revalidate() {
  revalidatePath(PATH);
  revalidatePath("/dashboard");
}

// ---- products ---------------------------------------------------------------

export async function createProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const parsed = buildProductCreate(formData);
  if (!parsed.ok) return invalid(parsed.errors);

  let newId: string;
  try {
    const { data, error } = await supabase.from("products").insert(parsed.value).select("id").single();
    if (error || !data) return fail("The product could not be created. The slug may already be in use.");
    newId = data.id as string;
  } catch {
    return fail("The product could not be created. Please try again.");
  }
  revalidate();
  redirect(`${PATH}?id=${encodeURIComponent(newId)}`);
}

export async function updateProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const parsed = buildProductUpdate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  const { id, expectedUpdatedAt, set } = parsed.value;

  try {
    const { data, error } = await supabase
      .from("products")
      .update(set)
      .eq("id", id)
      .eq("updated_at", expectedUpdatedAt) // optimistic concurrency
      .select("id");
    if (error) return fail("The product could not be saved. The slug may already be in use.");
    if (!data || data.length === 0) return fail(STALE);
  } catch {
    return fail("The product could not be saved. Please refresh and try again.");
  }
  revalidate();
  return success("Product saved.");
}

// Independent detail save (positioning + disclaimer only; the localized array
// columns are preserved untouched). Split from the core save so a partial
// failure is explicit and can never yield a false "saved". EVERY result checked.
export async function updateProductDetailAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const parsed = buildProductDetail(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  const { productId, expectedUpdatedAt, set } = parsed.value;

  try {
    if (expectedUpdatedAt) {
      // A detail row exists → optimistic update.
      const { data, error } = await supabase
        .from("product_details")
        .update(set)
        .eq("product_id", productId)
        .eq("updated_at", expectedUpdatedAt)
        .select("id");
      if (error) return fail("The product detail could not be saved. Please retry.");
      if (!data || data.length === 0) return fail(STALE);
    } else {
      // No detail row yet → insert. A concurrent insert (unique product_id) makes
      // this error, which is surfaced rather than reported as success.
      const { data, error } = await supabase
        .from("product_details")
        .insert({ product_id: productId, ...set })
        .select("id");
      if (error || !data || data.length === 0) return fail("The product detail could not be saved. Please refresh and retry.");
    }
  } catch {
    return fail("The product detail could not be saved. Please refresh and retry.");
  }
  revalidate();
  return success("Product detail saved.");
}

export async function setProductActiveAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const errors: FieldErrors = {};
  rejectUnknownFormData(formData, ["id", "isActive"], errors);
  if (errors._form) return fail(errors._form);
  const id = String(formData.get("id") ?? "");
  const isActive = String(formData.get("isActive") ?? "") === "true";
  if (!id) return fail("Unknown product.");
  try {
    const { data, error } = await supabase.from("products").update({ is_active: isActive }).eq("id", id).select("id");
    if (error || !data || data.length === 0) return fail("The product could not be updated.");
  } catch {
    return fail("The product could not be updated.");
  }
  revalidate();
  return success(isActive ? "Product activated." : "Product deactivated.");
}

export async function deleteProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction(["owner", "admin"]);
  if (!authz.ok) return authz.state;
  const { member, supabase } = authz.authorized;
  if (!canDeleteContent(member.role)) return fail("You do not have permission to delete content.");
  const id = String(formData.get("id") ?? "");
  if (!id) return fail("Unknown product.");
  if (!isDashboardCreatedId(id)) return fail(SEED_DEL);
  try {
    const { data, error } = await supabase.from("products").delete().eq("id", id).select("id");
    if (error) return fail("This product is referenced elsewhere and cannot be deleted. Deactivate it instead.");
    if (!data || data.length === 0) return fail("The product could not be deleted.");
  } catch {
    return fail("The product could not be deleted.");
  }
  revalidate();
  redirect(PATH);
}

// ---- product options --------------------------------------------------------

export async function addProductOptionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const parsed = buildOptionCreate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  try {
    const { error } = await supabase.from("product_options").insert(parsed.value.insert);
    if (error) return fail("The option could not be added.");
  } catch {
    return fail("The option could not be added.");
  }
  revalidate();
  return success("Option added.");
}

// Full option editing (type, EN/AR label, sort) with optimistic concurrency.
export async function updateProductOptionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const parsed = buildOptionUpdate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  const { id, expectedUpdatedAt, set } = parsed.value;
  try {
    const { data, error } = await supabase
      .from("product_options")
      .update(set)
      .eq("id", id)
      .eq("updated_at", expectedUpdatedAt)
      .select("id");
    if (error) return fail("The option could not be saved.");
    if (!data || data.length === 0) return fail(STALE);
  } catch {
    return fail("The option could not be saved.");
  }
  revalidate();
  return success("Option saved.");
}

export async function deleteProductOptionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  // Hard delete is owner/admin only (P03 gives editors no DELETE policy) AND only
  // for dashboard-created (UUID) options — seeded options are edit-only.
  const authz = await authorizeAction(["owner", "admin"]);
  if (!authz.ok) return authz.state;
  const { member, supabase } = authz.authorized;
  if (!canDeleteContent(member.role)) return fail("You do not have permission to remove options.");
  const id = String(formData.get("optionId") ?? "");
  if (!id) return fail("Unknown option.");
  if (!isDashboardCreatedId(id)) return fail("Seed-backed options cannot be removed. Deactivate them instead.");
  try {
    const { data, error } = await supabase.from("product_options").delete().eq("id", id).select("id");
    if (error || !data || data.length === 0) return fail("The option could not be removed.");
  } catch {
    return fail("The option could not be removed.");
  }
  revalidate();
  return success("Option removed.");
}

// ---- categories -------------------------------------------------------------

export async function createCategoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const parsed = buildCategoryCreate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  try {
    const { error } = await supabase.from("product_categories").insert(parsed.value);
    if (error) return fail("The category could not be created. The slug may already be in use.");
  } catch {
    return fail("The category could not be created.");
  }
  revalidate();
  return success("Category created.");
}

export async function updateCategoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const parsed = buildCategoryUpdate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  const { id, expectedUpdatedAt, set } = parsed.value;
  try {
    const { data, error } = await supabase
      .from("product_categories")
      .update(set)
      .eq("id", id)
      .eq("updated_at", expectedUpdatedAt)
      .select("id");
    if (error) return fail("The category could not be saved. The slug may already be in use.");
    if (!data || data.length === 0) return fail(STALE);
  } catch {
    return fail("The category could not be saved.");
  }
  revalidate();
  return success("Category saved.");
}
