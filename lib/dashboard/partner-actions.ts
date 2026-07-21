"use server";

// Partners + partner_projects + partner_project_products server actions.
// Re-authorize, validate, RLS-protected queries, updated_at optimistic
// concurrency, generic errors, dashboard-only revalidation. project_detail_json
// and the rich project-product fields (category / short_description / key_notes /
// nutrition_highlights / image) are PRESERVED untouched on edit so existing
// NEEDS_VERIFICATION content is never rewritten or silently removed. Null
// product_id mappings are preserved when no catalog product is chosen.

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
  reqText,
  slug as vSlug,
  boundedInt,
  oneOf,
  boolean as vBool,
  toLocalizedJson,
  type FieldErrors,
} from "@/lib/dashboard/validation";
import { PPP_STATUSES, type PppStatus } from "@/lib/dashboard/partner-constants";

const PATH = "/dashboard/partners";
const SEED_ID_RE = /^(prod|cat|detail|media|partner|proj)_/;
const STALE = "This record was changed by someone else. Please refresh and try again.";

function revalidate() {
  revalidatePath(PATH);
  revalidatePath("/dashboard");
}

// ---- partners ---------------------------------------------------------------

export async function createPartnerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const errors: FieldErrors = {};
  const slug = vSlug(formData.get("slug"), "slug", errors);
  const name = reqText(formData.get("name"), "name", errors, 200);
  const assetId = String(formData.get("assetId") ?? "").trim() || null;
  if (Object.keys(errors).length) return invalid(errors);
  let newId: string;
  try {
    const { data, error } = await supabase.from("partners").insert({ slug, name, asset_id: assetId }).select("id").single();
    if (error || !data) return fail("The partner could not be created. The slug may already be in use.");
    newId = data.id as string;
  } catch {
    return fail("The partner could not be created. Please try again.");
  }
  revalidate();
  redirect(`${PATH}?id=${encodeURIComponent(newId)}`);
}

export async function updatePartnerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const id = String(formData.get("id") ?? "");
  const expectedUpdatedAt = String(formData.get("expectedUpdatedAt") ?? "");
  if (!id || !expectedUpdatedAt) return fail("Unknown partner.");
  const errors: FieldErrors = {};
  const slug = vSlug(formData.get("slug"), "slug", errors);
  const name = reqText(formData.get("name"), "name", errors, 200);
  const assetId = String(formData.get("assetId") ?? "").trim() || null;
  const isActive = vBool(formData.get("isActive"));
  const sortOrder = boundedInt(formData.get("sortOrder"), 0, 100000, 0);
  if (Object.keys(errors).length) return invalid(errors);
  try {
    const { data, error } = await supabase
      .from("partners")
      .update({ slug, name, asset_id: assetId, is_active: isActive, sort_order: sortOrder })
      .eq("id", id)
      .eq("updated_at", expectedUpdatedAt)
      .select("id");
    if (error) return fail("The partner could not be saved. The slug may already be in use.");
    if (!data || data.length === 0) return fail(STALE);
  } catch {
    return fail("The partner could not be saved. Please refresh and try again.");
  }
  revalidate();
  return success("Partner saved.");
}

// ---- projects ---------------------------------------------------------------

export async function createProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const partnerId = String(formData.get("partnerId") ?? "");
  if (!partnerId) return fail("Unknown partner.");
  const errors: FieldErrors = {};
  const slug = vSlug(formData.get("slug"), "slug", errors);
  const title = localized({ en: formData.get("title_en"), ar: formData.get("title_ar") }, "title", errors, { max: 200 });
  const summary = localized({ en: formData.get("summary_en"), ar: formData.get("summary_ar") }, "summary", errors, { max: 600 });
  if (Object.keys(errors).length) return invalid(errors);
  let newId: string;
  try {
    const { data, error } = await supabase
      .from("partner_projects")
      .insert({
        partner_id: partnerId,
        slug,
        title_localized: toLocalizedJson(title),
        summary_localized: toLocalizedJson(summary),
        project_detail_json: {},
      })
      .select("id")
      .single();
    if (error || !data) return fail("The project could not be created. The slug may already be in use.");
    newId = data.id as string;
  } catch {
    return fail("The project could not be created. Please try again.");
  }
  revalidate();
  redirect(`${PATH}?project=${encodeURIComponent(newId)}`);
}

export async function updateProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const id = String(formData.get("id") ?? "");
  const expectedUpdatedAt = String(formData.get("expectedUpdatedAt") ?? "");
  if (!id || !expectedUpdatedAt) return fail("Unknown project.");
  const errors: FieldErrors = {};
  const slug = vSlug(formData.get("slug"), "slug", errors);
  const title = localized({ en: formData.get("title_en"), ar: formData.get("title_ar") }, "title", errors, { max: 200 });
  const summary = localized({ en: formData.get("summary_en"), ar: formData.get("summary_ar") }, "summary", errors, { max: 600 });
  const isActive = vBool(formData.get("isActive"));
  const sortOrder = boundedInt(formData.get("sortOrder"), 0, 100000, 0);
  if (Object.keys(errors).length) return invalid(errors);
  try {
    const { data, error } = await supabase
      .from("partner_projects")
      .update({
        slug,
        title_localized: toLocalizedJson(title),
        summary_localized: toLocalizedJson(summary),
        is_active: isActive,
        sort_order: sortOrder,
      }) // project_detail_json preserved
      .eq("id", id)
      .eq("updated_at", expectedUpdatedAt)
      .select("id");
    if (error) return fail("The project could not be saved. The slug may already be in use.");
    if (!data || data.length === 0) return fail(STALE);
  } catch {
    return fail("The project could not be saved. Please refresh and try again.");
  }
  revalidate();
  return success("Project saved.");
}

export async function deleteProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction(["owner", "admin"]);
  if (!authz.ok) return authz.state;
  const { member, supabase } = authz.authorized;
  if (!canDeleteContent(member.role)) return fail("You do not have permission to delete projects.");
  const id = String(formData.get("id") ?? "");
  if (!id) return fail("Unknown project.");
  if (SEED_ID_RE.test(id)) return fail("Seed-backed projects cannot be deleted. Deactivate them instead.");
  try {
    const { data, error } = await supabase.from("partner_projects").delete().eq("id", id).select("id");
    if (error || !data || data.length === 0) return fail("The project could not be deleted.");
  } catch {
    return fail("The project could not be deleted.");
  }
  revalidate();
  return success("Project deleted.");
}

// ---- project products -------------------------------------------------------

export async function addProjectProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) return fail("Unknown project.");
  const errors: FieldErrors = {};
  const status = oneOf<PppStatus>(formData.get("status"), PPP_STATUSES, "status", errors);
  const productId = String(formData.get("productId") ?? "").trim() || null;
  // Product name is optional; preserve the schema's null-name meaning when blank.
  const nameEn = String(formData.get("name_en") ?? "").trim();
  const name = nameEn ? localized({ en: formData.get("name_en"), ar: formData.get("name_ar") }, "name", errors, { max: 200 }) : null;
  const sortOrder = boundedInt(formData.get("sortOrder"), 0, 100000, 0);
  if (Object.keys(errors).length) return invalid(errors);
  try {
    const { error } = await supabase.from("partner_project_products").insert({
      partner_project_id: projectId,
      product_id: productId,
      product_name_localized: name ? toLocalizedJson(name) : null,
      status,
      sort_order: sortOrder,
    });
    if (error) return fail("The mapping could not be added.");
  } catch {
    return fail("The mapping could not be added.");
  }
  revalidate();
  return success("Mapping added.");
}

export async function updateProjectProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const id = String(formData.get("mappingId") ?? "");
  const expectedUpdatedAt = String(formData.get("expectedUpdatedAt") ?? "");
  if (!id || !expectedUpdatedAt) return fail("Unknown mapping.");
  const errors: FieldErrors = {};
  const status = oneOf<PppStatus>(formData.get("status"), PPP_STATUSES, "status", errors);
  const productId = String(formData.get("productId") ?? "").trim() || null;
  const nameEn = String(formData.get("name_en") ?? "").trim();
  const name = nameEn ? localized({ en: formData.get("name_en"), ar: formData.get("name_ar") }, "name", errors, { max: 200 }) : null;
  const sortOrder = boundedInt(formData.get("sortOrder"), 0, 100000, 0);
  if (Object.keys(errors).length) return invalid(errors);
  try {
    const { data, error } = await supabase
      .from("partner_project_products")
      .update({
        product_id: productId, // null preserved when no catalog product is chosen
        product_name_localized: name ? toLocalizedJson(name) : null,
        status,
        sort_order: sortOrder,
      }) // category/short_description/key_notes/nutrition/image preserved untouched
      .eq("id", id)
      .eq("updated_at", expectedUpdatedAt)
      .select("id");
    if (error) return fail("The mapping could not be saved.");
    if (!data || data.length === 0) return fail(STALE);
  } catch {
    return fail("The mapping could not be saved.");
  }
  revalidate();
  return success("Mapping saved.");
}

export async function deleteProjectProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction(["owner", "admin"]);
  if (!authz.ok) return authz.state;
  const { member, supabase } = authz.authorized;
  if (!canDeleteContent(member.role)) return fail("You do not have permission to remove mappings.");
  const id = String(formData.get("mappingId") ?? "");
  if (!id) return fail("Unknown mapping.");
  try {
    const { data, error } = await supabase.from("partner_project_products").delete().eq("id", id).select("id");
    if (error || !data || data.length === 0) return fail("The mapping could not be removed.");
  } catch {
    return fail("The mapping could not be removed.");
  }
  revalidate();
  return success("Mapping removed.");
}
