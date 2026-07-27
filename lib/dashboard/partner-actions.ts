"use server";

// Partners + partner_projects + partner_project_products server actions — thin
// wrappers over pure builders. New partners/projects are created INACTIVE.
// project_detail_json and the rich project-product fields are preserved
// untouched (NEEDS_VERIFICATION content never rewritten); null product_id
// mappings are preserved. Re-authorize, reject unknown fields, validate,
// updated_at optimistic concurrency, check every result, generic errors. Hard
// delete is owner/admin AND only for dashboard-created (UUID) records.

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
  buildPartnerCreate,
  buildPartnerUpdate,
  buildProjectCreate,
  buildProjectUpdate,
  buildProjectProductCreate,
  buildProjectProductUpdate,
  buildDeleteInput,
} from "@/lib/dashboard/inputs";

const PATH = "/dashboard/partners";
const STALE = "This record was changed by someone else. Please refresh and try again.";
const SEED_DEL = "Seed-backed records cannot be deleted. Deactivate them instead.";

function revalidate() {
  revalidatePath(PATH);
  revalidatePath("/dashboard");
}

// ---- partners ---------------------------------------------------------------

export async function createPartnerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const parsed = buildPartnerCreate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  let newId: string;
  try {
    const { data, error } = await supabase.from("partners").insert(parsed.value).select("id").single();
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
  const parsed = buildPartnerUpdate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  const { id, expectedUpdatedAt, set } = parsed.value;
  try {
    const { data, error } = await supabase
      .from("partners")
      .update(set)
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
  const parsed = buildProjectCreate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  let newId: string;
  try {
    const { data, error } = await supabase.from("partner_projects").insert(parsed.value.insert).select("id").single();
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
  const parsed = buildProjectUpdate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  const { id, expectedUpdatedAt, set } = parsed.value;
  try {
    const { data, error } = await supabase
      .from("partner_projects")
      .update(set)
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
  const parsed = buildDeleteInput(formData, "id");
  if (!parsed.ok) return invalid(parsed.errors);
  const { id } = parsed.value;
  if (!isDashboardCreatedId(id)) return fail(SEED_DEL);
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
  const parsed = buildProjectProductCreate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  try {
    const { error } = await supabase.from("partner_project_products").insert(parsed.value.insert);
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
  const parsed = buildProjectProductUpdate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  const { id, expectedUpdatedAt, set } = parsed.value;
  try {
    const { data, error } = await supabase
      .from("partner_project_products")
      .update(set)
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
  const parsed = buildDeleteInput(formData, "mappingId");
  if (!parsed.ok) return invalid(parsed.errors);
  const { id } = parsed.value;
  if (!isDashboardCreatedId(id)) return fail("Seed-backed mappings cannot be removed.");
  try {
    const { data, error } = await supabase.from("partner_project_products").delete().eq("id", id).select("id");
    if (error || !data || data.length === 0) return fail("The mapping could not be removed.");
  } catch {
    return fail("The mapping could not be removed.");
  }
  revalidate();
  return success("Mapping removed.");
}
