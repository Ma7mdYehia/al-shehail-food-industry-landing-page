"use server";

// Media-asset metadata server actions. Metadata only — there is NO binary upload
// (that requires Supabase Storage and is out of scope here; we never fake an
// upload success). Every mutation re-authorizes, validates + normalizes input,
// uses RLS-protected queries, applies updated_at optimistic concurrency, and
// returns only generic errors. Deletion is owner/admin, refused for seed-backed
// or referenced assets.

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
  optText,
  oneOf,
  boundedInt,
  toLocalizedJson,
  type FieldErrors,
} from "@/lib/dashboard/validation";
import { MEDIA_TYPES, MEDIA_STATUSES, type MediaType, type MediaStatus } from "@/lib/dashboard/media-constants";

const PATH = "/dashboard/media";
const SEED_ID_RE = /^(prod|cat|detail|media|partner|proj)_/;
const STALE = "This asset was changed by someone else. Please refresh and try again.";

function revalidate() {
  revalidatePath(PATH);
  revalidatePath("/dashboard");
}
function optInt(formData: FormData, field: string): number | null {
  const raw = formData.get(field);
  if (raw === null || String(raw).trim() === "") return null;
  return boundedInt(raw, 1, 100000, 1);
}

export async function createMediaAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;

  const errors: FieldErrors = {};
  const key = reqText(formData.get("key"), "key", errors, 200);
  const path = optText(formData.get("path"), "path", errors, 600);
  const type = oneOf<MediaType>(formData.get("type"), MEDIA_TYPES, "type", errors);
  const status = oneOf<MediaStatus>(formData.get("status"), MEDIA_STATUSES, "status", errors);
  // Alt text: English required, Arabic optional (matches the DB is_localized rule
  // where media `ar` may be present-but-empty until authored).
  const alt = localized({ en: formData.get("alt_en"), ar: formData.get("alt_ar") }, "alt", errors, { max: 600 });
  const width = optInt(formData, "width");
  const height = optInt(formData, "height");
  if (Object.keys(errors).length) return invalid(errors);

  let newId: string;
  try {
    const { data, error } = await supabase
      .from("media_assets")
      .insert({
        key,
        path: path || null,
        type,
        status,
        alt_localized: toLocalizedJson(alt),
        width,
        height,
      })
      .select("id")
      .single();
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

  const id = String(formData.get("id") ?? "");
  const expectedUpdatedAt = String(formData.get("expectedUpdatedAt") ?? "");
  if (!id || !expectedUpdatedAt) return fail("Unknown asset.");

  const errors: FieldErrors = {};
  const key = reqText(formData.get("key"), "key", errors, 200);
  const path = optText(formData.get("path"), "path", errors, 600);
  const type = oneOf<MediaType>(formData.get("type"), MEDIA_TYPES, "type", errors);
  const status = oneOf<MediaStatus>(formData.get("status"), MEDIA_STATUSES, "status", errors);
  const alt = localized({ en: formData.get("alt_en"), ar: formData.get("alt_ar") }, "alt", errors, { max: 600 });
  const width = optInt(formData, "width");
  const height = optInt(formData, "height");
  if (Object.keys(errors).length) return invalid(errors);

  try {
    const { data, error } = await supabase
      .from("media_assets")
      .update({
        key,
        path: path || null,
        type,
        status,
        alt_localized: toLocalizedJson(alt),
        width,
        height,
      })
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
  if (SEED_ID_RE.test(id)) return fail("Seed-backed assets cannot be deleted. Set them to legacy instead.");
  try {
    const { data, error } = await supabase.from("media_assets").delete().eq("id", id).select("id");
    // A foreign-key reference makes the delete fail at the database.
    if (error) return fail("This asset is referenced by content and cannot be deleted.");
    if (!data || data.length === 0) return fail("The asset could not be deleted.");
  } catch {
    return fail("The asset could not be deleted.");
  }
  revalidate();
  redirect(PATH);
}
