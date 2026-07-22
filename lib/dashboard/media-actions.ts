"use server";

// Media-asset metadata server actions — thin wrappers over pure builders. No
// binary upload (never faked). Re-authorize, reject unknown fields, validate,
// updated_at optimistic concurrency, check every result, generic errors. New
// metadata is always PENDING (a forged status is ignored). Delete is owner/admin
// AND only for dashboard-created (UUID) assets; FK-referenced assets are
// protected by the database.

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
import { buildMediaCreate, buildMediaUpdate } from "@/lib/dashboard/inputs";

const PATH = "/dashboard/media";
const STALE = "This asset was changed by someone else. Please refresh and try again.";

function revalidate() {
  revalidatePath(PATH);
  revalidatePath("/dashboard");
}

export async function createMediaAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const parsed = buildMediaCreate(formData);
  if (!parsed.ok) return invalid(parsed.errors);

  let newId: string;
  try {
    const { data, error } = await supabase.from("media_assets").insert(parsed.value).select("id").single();
    if (error || !data) return fail("The asset could not be created. The key may already be in use.");
    newId = data.id as string;
  } catch {
    return fail("The asset could not be created. Please try again.");
  }
  revalidate();
  redirect(`${PATH}?id=${encodeURIComponent(newId)}`);
}

export async function updateMediaAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;
  const parsed = buildMediaUpdate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  const { id, expectedUpdatedAt, set } = parsed.value;

  try {
    const { data, error } = await supabase
      .from("media_assets")
      .update(set)
      .eq("id", id)
      .eq("updated_at", expectedUpdatedAt)
      .select("id");
    if (error) return fail("The asset could not be saved. The key may already be in use.");
    if (!data || data.length === 0) return fail(STALE);
  } catch {
    return fail("The asset could not be saved. Please refresh and try again.");
  }
  revalidate();
  return success("Asset saved.");
}

export async function deleteMediaAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction(["owner", "admin"]);
  if (!authz.ok) return authz.state;
  const { member, supabase } = authz.authorized;
  if (!canDeleteContent(member.role)) return fail("You do not have permission to delete media.");
  const id = String(formData.get("id") ?? "");
  if (!id) return fail("Unknown asset.");
  if (!isDashboardCreatedId(id)) return fail("Seed-backed assets cannot be deleted. Set them to legacy instead.");
  try {
    const { data, error } = await supabase.from("media_assets").delete().eq("id", id).select("id");
    if (error) return fail("This asset is referenced by content and cannot be deleted.");
    if (!data || data.length === 0) return fail("The asset could not be deleted.");
  } catch {
    return fail("The asset could not be deleted.");
  }
  revalidate();
  redirect(PATH);
}
