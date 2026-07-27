"use server";

// Shared-content (settings) server action. Edits ONLY the localized recipe
// disclaimer; the three structured localized point-lists are PRESERVED untouched
// (never rewritten) to avoid discarding authored bilingual content. Re-authorize,
// validate, updated_at optimistic concurrency, generic errors, dashboard
// revalidation only.

import { revalidatePath } from "next/cache";
import { authorizeAction, fail, invalid, success, type ActionState } from "@/lib/dashboard/actions-core";
import { buildSharedUpdate } from "@/lib/dashboard/inputs";

export async function updateSharedContentAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;

  const parsed = buildSharedUpdate(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  const { id, expectedUpdatedAt, set } = parsed.value;

  try {
    const { data, error } = await supabase
      .from("shared_content")
      .update(set)
      .eq("id", id)
      .eq("updated_at", expectedUpdatedAt)
      .select("id");
    if (error) return fail("The content could not be saved. Please try again.");
    if (!data || data.length === 0) return fail("This content was changed by someone else. Please refresh and try again.");
  } catch {
    return fail("The content could not be saved. Please refresh and try again.");
  }
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return success("Shared content saved.");
}
