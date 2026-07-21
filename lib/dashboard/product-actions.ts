"use server";

// Products / categories / details / options server actions. Every mutation
// re-authorizes (getUser()+active membership+role), validates and normalizes
// input, uses RLS-protected queries, applies updated_at-based optimistic
// concurrency to reject stale saves, and returns only generic errors. Editors
// may create/update; only owner/admin may hard-delete (RLS enforces this too).
// Physical deletion is refused for seed-backed or referenced rows.

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
import {
  localized,
  slug as vSlug,
  optText,
  boundedInt,
  oneOf,
  boolean as vBool,
  toLocalizedJson,
  type FieldErrors,
} from "@/lib/dashboard/validation";
import {
  PRODUCT_ICON_TYPES,
  PRODUCT_OPTION_TYPES,
  type ProductIconType,
  type ProductOptionType,
} from "@/lib/dashboard/product-constants";

const PATH = "/dashboard/products";
const SEED_ID_RE = /^(prod|cat|detail|media|partner|proj)_/;

function revalidate() {
  revalidatePath(PATH);
  revalidatePath("/dashboard");
}
function locFrom(formData: FormData, prefix: string, field: string, errors: FieldErrors, opts?: { max?: number }) {
  return localized({ en: formData.get(`${prefix}_en`), ar: formData.get(`${prefix}_ar`) }, field, errors, opts);
}
const STALE = "This record was changed by someone else. Please refresh and try again.";

// ---- products ---------------------------------------------------------------

export async function createProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;

  const errors: FieldErrors = {};
  const slug = vSlug(formData.get("slug"), "slug", errors);
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  if (!categoryId) errors.categoryId = "Choose a category.";
  const name = locFrom(formData, "name", "name", errors, { max: 200 });
  const shortDescription = locFrom(formData, "shortDescription", "shortDescription", errors, { max: 600 });
  const cardDescription = locFrom(formData, "cardDescription", "cardDescription", errors, { max: 600 });
  const iconType = oneOf<ProductIconType>(formData.get("iconType"), PRODUCT_ICON_TYPES, "iconType", errors);
  const imageAssetId = String(formData.get("imageAssetId") ?? "").trim() || null;
  const featured = vBool(formData.get("featured"));
  if (Object.keys(errors).length) return invalid(errors);

  let newId: string;
  try {
    const { data, error } = await supabase
      .from("products")
      .insert({
        category_id: categoryId,
        slug,
        name_localized: toLocalizedJson(name),
        short_description_localized: toLocalizedJson(shortDescription),
        card_description_localized: toLocalizedJson(cardDescription),
        icon_type: iconType,
        image_asset_id: imageAssetId,
        featured,
      })
      .select("id")
      .single();
    if (error || !data) {
      return fail("The product could not be created. The slug may already be in use.");
    }
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

  const id = String(formData.get("id") ?? "");
  const expectedUpdatedAt = String(formData.get("expectedUpdatedAt") ?? "");
  if (!id || !expectedUpdatedAt) return fail("Unknown product.");

  const errors: FieldErrors = {};
  const slug = vSlug(formData.get("slug"), "slug", errors);
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  if (!categoryId) errors.categoryId = "Choose a category.";
  const name = locFrom(formData, "name", "name", errors, { max: 200 });
  const shortDescription = locFrom(formData, "shortDescription", "shortDescription", errors, { max: 600 });
  const cardDescription = locFrom(formData, "cardDescription", "cardDescription", errors, { max: 600 });
  const iconType = oneOf<ProductIconType>(formData.get("iconType"), PRODUCT_ICON_TYPES, "iconType", errors);
  const imageAssetId = String(formData.get("imageAssetId") ?? "").trim() || null;
  const featured = vBool(formData.get("featured"));
  const sortOrder = boundedInt(formData.get("sortOrder"), 0, 100000, 0);
  // product_details (safe fields only; the localized ARRAY columns are preserved
  // untouched so existing Arabic list content is never silently discarded).
  const positioning = locFrom(formData, "positioning", "positioning", errors, { max: 4000 });
  const disclaimerEn = optText(formData.get("disclaimer_en"), "disclaimer.en", errors, 4000);
  const disclaimerAr = optText(formData.get("disclaimer_ar"), "disclaimer.ar", errors, 4000);
  if (Object.keys(errors).length) return invalid(errors);

  try {
    const { data, error } = await supabase
      .from("products")
      .update({
        slug,
        category_id: categoryId,
        name_localized: toLocalizedJson(name),
        short_description_localized: toLocalizedJson(shortDescription),
        card_description_localized: toLocalizedJson(cardDescription),
        icon_type: iconType,
        image_asset_id: imageAssetId,
        featured,
        sort_order: sortOrder,
      })
      .eq("id", id)
      .eq("updated_at", expectedUpdatedAt) // optimistic concurrency
      .select("id");
    if (error) return fail("The product could not be saved. The slug may already be in use.");
    if (!data || data.length === 0) return fail(STALE);

    // Upsert the 1:1 detail (positioning + optional disclaimer). Arrays untouched.
    const disclaimer = disclaimerEn ? { en: disclaimerEn, ar: disclaimerAr } : null;
    const { data: existing } = await supabase
      .from("product_details")
      .select("id")
      .eq("product_id", id)
      .maybeSingle();
    if (existing) {
      await supabase
        .from("product_details")
        .update({ positioning_localized: toLocalizedJson(positioning), disclaimer_localized: disclaimer })
        .eq("product_id", id);
    } else {
      await supabase
        .from("product_details")
        .insert({ product_id: id, positioning_localized: toLocalizedJson(positioning), disclaimer_localized: disclaimer });
    }
  } catch {
    return fail("The product could not be saved. Please refresh and try again.");
  }
  revalidate();
  return success("Product saved.");
}

export async function setProductActiveAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
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
  // Never physically delete seed-backed content — deactivate it instead.
  if (SEED_ID_RE.test(id)) {
    return fail("Seed-backed products cannot be deleted. Deactivate them instead.");
  }
  try {
    const { data, error } = await supabase.from("products").delete().eq("id", id).select("id");
    // A foreign-key reference (e.g. a partner-project product) makes the delete
    // fail at the database — surface a generic, safe message.
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
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return fail("Unknown product.");
  const errors: FieldErrors = {};
  const type = oneOf<ProductOptionType>(formData.get("type"), PRODUCT_OPTION_TYPES, "type", errors);
  const label = locFrom(formData, "label", "label", errors, { max: 200 });
  const sortOrder = boundedInt(formData.get("sortOrder"), 0, 100000, 0);
  if (Object.keys(errors).length) return invalid(errors);
  try {
    const { error } = await supabase.from("product_options").insert({
      product_id: productId,
      type,
      label_localized: toLocalizedJson(label),
      sort_order: sortOrder,
    });
    if (error) return fail("The option could not be added.");
  } catch {
    return fail("The option could not be added.");
  }
  revalidate();
  return success("Option added.");
}

export async function deleteProductOptionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  // Hard delete is owner/admin only (P03 gives editors no DELETE policy), matching
  // the content-deletion rule. Editors add/reorder options but do not hard-delete.
  const authz = await authorizeAction(["owner", "admin"]);
  if (!authz.ok) return authz.state;
  const { member, supabase } = authz.authorized;
  if (!canDeleteContent(member.role)) return fail("You do not have permission to remove options.");
  const id = String(formData.get("optionId") ?? "");
  if (!id) return fail("Unknown option.");
  try {
    // Options are always freshly created rows (no FK dependants) → safe to delete.
    const { data, error } = await supabase.from("product_options").delete().eq("id", id).select("id");
    if (error) return fail("The option could not be removed.");
    if (!data || data.length === 0) return fail("The option could not be removed.");
  } catch {
    return fail("The option could not be removed.");
  }
  revalidate();
  return success("Option removed.");
}

export async function moveProductOptionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const id = String(formData.get("optionId") ?? "");
  const sortOrder = boundedInt(formData.get("sortOrder"), 0, 100000, 0);
  if (!id) return fail("Unknown option.");
  try {
    const { data, error } = await supabase.from("product_options").update({ sort_order: sortOrder }).eq("id", id).select("id");
    if (error || !data || data.length === 0) return fail("The option could not be reordered.");
  } catch {
    return fail("The option could not be reordered.");
  }
  revalidate();
  return success("Order updated.");
}

// ---- categories -------------------------------------------------------------

export async function createCategoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const errors: FieldErrors = {};
  const slug = vSlug(formData.get("slug"), "slug", errors);
  const name = locFrom(formData, "name", "name", errors, { max: 200 });
  const description = locFrom(formData, "description", "description", errors, { max: 600 });
  const sortOrder = boundedInt(formData.get("sortOrder"), 0, 100000, 0);
  if (Object.keys(errors).length) return invalid(errors);
  try {
    const { error } = await supabase.from("product_categories").insert({
      slug,
      name_localized: toLocalizedJson(name),
      description_localized: toLocalizedJson(description),
      sort_order: sortOrder,
    });
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
  const id = String(formData.get("id") ?? "");
  const expectedUpdatedAt = String(formData.get("expectedUpdatedAt") ?? "");
  if (!id || !expectedUpdatedAt) return fail("Unknown category.");
  const errors: FieldErrors = {};
  const slug = vSlug(formData.get("slug"), "slug", errors);
  const name = locFrom(formData, "name", "name", errors, { max: 200 });
  const description = locFrom(formData, "description", "description", errors, { max: 600 });
  const isActive = vBool(formData.get("isActive"));
  const sortOrder = boundedInt(formData.get("sortOrder"), 0, 100000, 0);
  if (Object.keys(errors).length) return invalid(errors);
  try {
    const { data, error } = await supabase
      .from("product_categories")
      .update({
        slug,
        name_localized: toLocalizedJson(name),
        description_localized: toLocalizedJson(description),
        is_active: isActive,
        sort_order: sortOrder,
      })
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
