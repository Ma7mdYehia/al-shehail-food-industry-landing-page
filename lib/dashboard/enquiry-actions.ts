"use server";

// Enquiry workflow server action. Active dashboard members may update ONLY the
// workflow columns (status, internal_notes, assigned_to). handled_by/handled_at
// are NEVER accepted from the browser — the P03 database trigger stamps them
// from auth.uid(). The original submission fields are immutable (column grant).

import { revalidatePath } from "next/cache";
import { authorizeAction, fail, success, invalid, type ActionState } from "@/lib/dashboard/actions-core";
import { isEnquiryStatus } from "@/lib/dashboard/enquiry-constants";
import { LIMITS } from "@/lib/dashboard/validation";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ENQUIRIES_PATH = "/dashboard/enquiries";

export async function updateEnquiryAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const authz = await authorizeAction(); // any active member
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const notesRaw = formData.get("internalNotes");
  const assignedRaw = String(formData.get("assignedTo") ?? "");

  if (!id) return fail("Unknown enquiry.");

  const errors: Record<string, string> = {};
  if (!isEnquiryStatus(status)) errors.status = "Choose a valid status.";
  const notes = typeof notesRaw === "string" ? notesRaw.trim() : "";
  if (notes.length > LIMITS.long) errors.internalNotes = `Notes must be ${LIMITS.long} characters or fewer.`;
  const assignedTo = assignedRaw === "" ? null : assignedRaw;
  if (assignedTo !== null && !UUID_RE.test(assignedTo)) errors.assignedTo = "Invalid assignee.";
  if (Object.keys(errors).length) return invalid(errors);

  try {
    // Column-scoped update only. handled_by/handled_at are intentionally absent;
    // the database stamps them. Any RLS/permission failure → generic error.
    const { error } = await supabase
      .from("form_enquiries")
      .update({ status, internal_notes: notes.length ? notes : null, assigned_to: assignedTo })
      .eq("id", id);
    if (error) return fail("The enquiry could not be updated. Please refresh and try again.");
  } catch {
    return fail("The enquiry could not be updated. Please refresh and try again.");
  }

  revalidatePath(ENQUIRIES_PATH);
  revalidatePath("/dashboard");
  return success("Enquiry updated.");
}
