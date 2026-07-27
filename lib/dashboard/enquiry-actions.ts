"use server";

// Enquiry workflow server action. Active members may update ONLY the workflow
// columns (status, internal_notes, assigned_to). handled_by/handled_at are NEVER
// accepted from the browser — the P03 trigger stamps them. Unknown fields are
// rejected by the builder. The assignee validation + optimistic-concurrency +
// affected-row branching lives in the pure saveEnquiry executor (injected deps),
// so it is executed in tests without a database.

import { revalidatePath } from "next/cache";
import { authorizeAction, invalid, type ActionState } from "@/lib/dashboard/actions-core";
import { buildEnquiryUpdate } from "@/lib/dashboard/inputs";
import { saveEnquiry } from "@/lib/dashboard/executors";

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

  const res = await saveEnquiry(
    {
      assignableMembers: async () => {
        const { data, error } = await supabase.rpc("dashboard_assignable_members");
        return { data: (data as unknown[]) ?? null, error };
      },
      updateEnquiry: async (eid, exp, s) => {
        const { data, error } = await supabase
          .from("form_enquiries")
          .update(s)
          .eq("id", eid)
          .eq("updated_at", exp)
          .select("id");
        return { data, error };
      },
    },
    { id, expectedUpdatedAt, assignedTo, set }
  );

  if (res.status === "success") {
    revalidatePath(ENQUIRIES_PATH);
    revalidatePath("/dashboard");
  }
  return res;
}
