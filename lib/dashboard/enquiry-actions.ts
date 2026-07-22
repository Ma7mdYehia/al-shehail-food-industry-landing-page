"use server";

// Enquiry workflow server action. Active members may update ONLY the workflow
// columns (status, internal_notes, assigned_to). handled_by/handled_at are NEVER
// accepted from the browser — the P03 trigger stamps them. The assignee is
// validated server-side against the ACTIVE-member set (the assignable-members
// RPC), not the select options the browser sent. updated_at optimistic
// concurrency prevents two members from silently overwriting each other, and a
// zero-row result is a generic failure — never a false "updated".

import { revalidatePath } from "next/cache";
import { authorizeAction, fail, invalid, success, type ActionState } from "@/lib/dashboard/actions-core";
import { buildEnquiryUpdate } from "@/lib/dashboard/inputs";

const ENQUIRIES_PATH = "/dashboard/enquiries";

export async function updateEnquiryAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const authz = await authorizeAction(); // any active member
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;

  const parsed = buildEnquiryUpdate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  const { id, expectedUpdatedAt, assignedTo, set } = parsed.value;

  // Server-side assignee validation: the target must currently be an ACTIVE
  // dashboard member. We never trust the browser's select options. Null/
  // unassigned is always allowed.
  if (assignedTo !== null) {
    try {
      const { data, error } = await supabase.rpc("dashboard_assignable_members");
      const active = Array.isArray(data) ? data.some((m) => (m as { id: string }).id === assignedTo) : false;
      if (error || !active) {
        return fail("The selected assignee is not an active team member.");
      }
    } catch {
      return fail("The enquiry could not be updated. Please refresh and try again.");
    }
  }

  try {
    // Column-scoped update, guarded by updated_at (optimistic concurrency), and
    // returning the affected id so a zero-row result is treated as a failure.
    const { data, error } = await supabase
      .from("form_enquiries")
      .update(set)
      .eq("id", id)
      .eq("updated_at", expectedUpdatedAt)
      .select("id");
    if (error) return fail("The enquiry could not be updated. Please refresh and try again.");
    if (!data || data.length === 0) {
      return fail("This enquiry was changed by someone else. Please refresh and try again.");
    }
  } catch {
    return fail("The enquiry could not be updated. Please refresh and try again.");
  }

  revalidatePath(ENQUIRIES_PATH);
  revalidatePath("/dashboard");
  return success("Enquiry updated.");
}
