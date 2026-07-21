"use server";

// Services + service_sections server actions. Re-authorize, validate localized
// content, RLS-protected queries, updated_at optimistic concurrency, generic
// errors, dashboard-only revalidation. The structured cta_json / items_json are
// PRESERVED untouched on edit (defaulted to {} / [] on create) so no structured
// content is silently rewritten. Hard delete is owner/admin.

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
  boundedInt,
  oneOf,
  boolean as vBool,
  toLocalizedJson,
  type FieldErrors,
  type Localized,
} from "@/lib/dashboard/validation";
import { SERVICE_SECTION_TYPES, type ServiceSectionType } from "@/lib/dashboard/service-constants";

const PATH = "/dashboard/services";
const SEED_ID_RE = /^(prod|cat|detail|media|partner|proj|svc|service)_/;
const STALE = "This record was changed by someone else. Please refresh and try again.";

function revalidate() {
  revalidatePath(PATH);
  revalidatePath("/dashboard");
}
function locFrom(formData: FormData, prefix: string, field: string, errors: FieldErrors, max = 600): Localized {
  return localized({ en: formData.get(`${prefix}_en`), ar: formData.get(`${prefix}_ar`) }, field, errors, { max });
}
// Optional localized: null when English is blank; otherwise validated.
function optLocFrom(formData: FormData, prefix: string, field: string, errors: FieldErrors, max = 600): Localized | null {
  const en = String(formData.get(`${prefix}_en`) ?? "").trim();
  if (!en) return null;
  return localized({ en: formData.get(`${prefix}_en`), ar: formData.get(`${prefix}_ar`) }, field, errors, { max });
}

// ---- services ---------------------------------------------------------------

export async function createServiceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;

  const errors: FieldErrors = {};
  const slug = vSlug(formData.get("slug"), "slug", errors);
  const metaTitle = locFrom(formData, "metaTitle", "metaTitle", errors, 200);
  const metaDescription = locFrom(formData, "metaDescription", "metaDescription", errors, 600);
  const heroEyebrow = locFrom(formData, "heroEyebrow", "heroEyebrow", errors, 200);
  const heroTitle = locFrom(formData, "heroTitle", "heroTitle", errors, 200);
  const heroSubtitle = locFrom(formData, "heroSubtitle", "heroSubtitle", errors, 600);
  if (Object.keys(errors).length) return invalid(errors);

  let newId: string;
  try {
    const { data, error } = await supabase
      .from("services")
      .insert({
        slug,
        meta_title_localized: toLocalizedJson(metaTitle),
        meta_description_localized: toLocalizedJson(metaDescription),
        hero_eyebrow_localized: toLocalizedJson(heroEyebrow),
        hero_title_localized: toLocalizedJson(heroTitle),
        hero_subtitle_localized: toLocalizedJson(heroSubtitle),
        cta_json: {}, // structured CTA is managed elsewhere; valid empty object
      })
      .select("id")
      .single();
    if (error || !data) return fail("The service could not be created. The slug may already be in use.");
    newId = data.id as string;
  } catch {
    return fail("The service could not be created. Please try again.");
  }
  revalidate();
  redirect(`${PATH}?id=${encodeURIComponent(newId)}`);
}

export async function updateServiceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;

  const id = String(formData.get("id") ?? "");
  const expectedUpdatedAt = String(formData.get("expectedUpdatedAt") ?? "");
  if (!id || !expectedUpdatedAt) return fail("Unknown service.");

  const errors: FieldErrors = {};
  const slug = vSlug(formData.get("slug"), "slug", errors);
  const metaTitle = locFrom(formData, "metaTitle", "metaTitle", errors, 200);
  const metaDescription = locFrom(formData, "metaDescription", "metaDescription", errors, 600);
  const heroEyebrow = locFrom(formData, "heroEyebrow", "heroEyebrow", errors, 200);
  const heroTitle = locFrom(formData, "heroTitle", "heroTitle", errors, 200);
  const heroSubtitle = locFrom(formData, "heroSubtitle", "heroSubtitle", errors, 600);
  const isActive = vBool(formData.get("isActive"));
  const sortOrder = boundedInt(formData.get("sortOrder"), 0, 100000, 0);
  if (Object.keys(errors).length) return invalid(errors);

  try {
    const { data, error } = await supabase
      .from("services")
      .update({
        slug,
        meta_title_localized: toLocalizedJson(metaTitle),
        meta_description_localized: toLocalizedJson(metaDescription),
        hero_eyebrow_localized: toLocalizedJson(heroEyebrow),
        hero_title_localized: toLocalizedJson(heroTitle),
        hero_subtitle_localized: toLocalizedJson(heroSubtitle),
        is_active: isActive,
        sort_order: sortOrder,
      }) // cta_json intentionally omitted → preserved
      .eq("id", id)
      .eq("updated_at", expectedUpdatedAt)
      .select("id");
    if (error) return fail("The service could not be saved. The slug may already be in use.");
    if (!data || data.length === 0) return fail(STALE);
  } catch {
    return fail("The service could not be saved. Please refresh and try again.");
  }
  revalidate();
  return success("Service saved.");
}

// ---- service sections -------------------------------------------------------

export async function addServiceSectionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const serviceId = String(formData.get("serviceId") ?? "");
  if (!serviceId) return fail("Unknown service.");
  const errors: FieldErrors = {};
  const sectionType = oneOf<ServiceSectionType>(formData.get("sectionType"), SERVICE_SECTION_TYPES, "sectionType", errors);
  const title = optLocFrom(formData, "title", "title", errors, 200);
  const eyebrow = optLocFrom(formData, "eyebrow", "eyebrow", errors, 200);
  const description = optLocFrom(formData, "description", "description", errors, 4000);
  const sortOrder = boundedInt(formData.get("sortOrder"), 0, 100000, 0);
  if (Object.keys(errors).length) return invalid(errors);
  try {
    const { error } = await supabase.from("service_sections").insert({
      service_id: serviceId,
      section_type: sectionType,
      title_localized: title ? toLocalizedJson(title) : null,
      eyebrow_localized: eyebrow ? toLocalizedJson(eyebrow) : null,
      description_localized: description ? toLocalizedJson(description) : null,
      items_json: [], // structured items preserved/managed elsewhere
      sort_order: sortOrder,
    });
    if (error) return fail("The section could not be added.");
  } catch {
    return fail("The section could not be added.");
  }
  revalidate();
  return success("Section added.");
}

export async function updateServiceSectionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const id = String(formData.get("sectionId") ?? "");
  const expectedUpdatedAt = String(formData.get("expectedUpdatedAt") ?? "");
  if (!id || !expectedUpdatedAt) return fail("Unknown section.");
  const errors: FieldErrors = {};
  const sectionType = oneOf<ServiceSectionType>(formData.get("sectionType"), SERVICE_SECTION_TYPES, "sectionType", errors);
  const title = optLocFrom(formData, "title", "title", errors, 200);
  const eyebrow = optLocFrom(formData, "eyebrow", "eyebrow", errors, 200);
  const description = optLocFrom(formData, "description", "description", errors, 4000);
  const isActive = vBool(formData.get("isActive"));
  const sortOrder = boundedInt(formData.get("sortOrder"), 0, 100000, 0);
  if (Object.keys(errors).length) return invalid(errors);
  try {
    const { data, error } = await supabase
      .from("service_sections")
      .update({
        section_type: sectionType,
        title_localized: title ? toLocalizedJson(title) : null,
        eyebrow_localized: eyebrow ? toLocalizedJson(eyebrow) : null,
        description_localized: description ? toLocalizedJson(description) : null,
        is_active: isActive,
        sort_order: sortOrder,
      }) // items_json preserved
      .eq("id", id)
      .eq("updated_at", expectedUpdatedAt)
      .select("id");
    if (error) return fail("The section could not be saved.");
    if (!data || data.length === 0) return fail(STALE);
  } catch {
    return fail("The section could not be saved.");
  }
  revalidate();
  return success("Section saved.");
}

export async function deleteServiceSectionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction(["owner", "admin"]);
  if (!authz.ok) return authz.state;
  const { member, supabase } = authz.authorized;
  if (!canDeleteContent(member.role)) return fail("You do not have permission to remove sections.");
  const id = String(formData.get("sectionId") ?? "");
  if (!id) return fail("Unknown section.");
  try {
    const { data, error } = await supabase.from("service_sections").delete().eq("id", id).select("id");
    if (error || !data || data.length === 0) return fail("The section could not be removed.");
  } catch {
    return fail("The section could not be removed.");
  }
  revalidate();
  return success("Section removed.");
}
