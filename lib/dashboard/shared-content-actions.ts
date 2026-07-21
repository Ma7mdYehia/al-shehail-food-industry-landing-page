"use server";

// Shared-content (settings) server action. Edits ONLY the localized recipe
// disclaimer; the three structured localized point-lists are PRESERVED untouched
// (never rewritten) to avoid discarding authored bilingual content. Re-authorize,
// validate, updated_at optimistic concurrency, generic errors, dashboard
// revalidation only.

import { revalidatePath } from "next/cache";
import {
  authorizeAction,
  fail,
  invalid,
  success,
  type ActionState,
} from "@/lib/dashboard/actions-core";
import { localized, toLocalizedJson, type FieldErrors } from "@/lib/dashboard/validation";

export async function updateSharedContentAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const authz = await authorizeAction();
  if (!authz.ok) return authz.state;
  const { supabase } = authz.authorized;

  const id = String(formData.get("id") ?? "default");
  const expectedUpdatedAt = String(formData.get("expectedUpdatedAt") ?? "");
  if (!expectedUpdatedAt) return fail("Unknown record.");

  const errors: FieldErrors = {};
  const disclaimer = localized(
    { en: formData.get("recipeDisclaimer_en"), ar: formData.get("recipeDisclaimer_ar") },
    "recipeDisclaimer",
    errors,
    { max: 4000 }
  );
  if (Object.keys(errors).length) return invalid(errors);

  try {
    const { data, error } = await supabase
      .from("shared_content")
      .update({ recipe_disclaimer_localized: toLocalizedJson(disclaimer) })
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
