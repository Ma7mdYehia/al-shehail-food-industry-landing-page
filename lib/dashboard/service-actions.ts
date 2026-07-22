"use server";

// Services + service_sections server actions — thin wrappers over pure builders.
// New services/sections are created INACTIVE. Structured cta_json/items_json are
// preserved untouched. Re-authorize, reject unknown fields, validate, updated_at
// optimistic concurrency, check every result, generic errors. Hard delete is
// owner/admin AND only for dashboard-created (UUID) sections.

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
import { isDashboardCreatedId } from "@/lib/dashboard/validation";
import {
  buildServiceCreate,
  buildServiceUpdate,
  buildSectionCreate,
  buildSectionUpdate,
} from "@/lib/dashboard/inputs";

const PATH = "/dashboard/services";
const STALE = "This record was changed by someone else. Please refresh and try again.";

function revalidate() {
  revalidatePath(PATH);
  revalidatePath("/dashboard");
}

// ---- services ---------------------------------------------------------------

export async function createServiceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const parsed = buildServiceCreate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  let newId: string;
  try {
    const { data, error } = await supabase.from("services").insert(parsed.value).select("id").single();
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
  const parsed = buildServiceUpdate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  const { id, expectedUpdatedAt, set } = parsed.value;
  try {
    const { data, error } = await supabase
      .from("services")
      .update(set)
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
  const parsed = buildSectionCreate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  try {
    const { error } = await supabase.from("service_sections").insert(parsed.value.insert);
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
  const parsed = buildSectionUpdate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  const { id, expectedUpdatedAt, set } = parsed.value;
  try {
    const { data, error } = await supabase
      .from("service_sections")
      .update(set)
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
  if (!isDashboardCreatedId(id)) return fail("Seed-backed sections cannot be removed. Deactivate them instead.");
  try {
    const { data, error } = await supabase.from("service_sections").delete().eq("id", id).select("id");
    if (error || !data || data.length === 0) return fail("The section could not be removed.");
  } catch {
    return fail("The section could not be removed.");
  }
  revalidate();
  return success("Section removed.");
}
