// Pure, client-safe server-action result types + helpers. Contains NO server-
// only imports (no next/headers, no Supabase), so both Client Components (for
// useFormState initial state) and server actions can import it.

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field-scoped validation messages for the form to render inline. */
  errors?: Record<string, string>;
};

export const IDLE: ActionState = { status: "idle" };

/** A generic, user-safe error. Never carries Supabase/SQL/token detail. */
export function fail(
  message = "Something went wrong. Please try again.",
  errors?: Record<string, string>
): ActionState {
  return { status: "error", message, errors };
}

export function invalid(
  errors: Record<string, string>,
  message = "Please fix the highlighted fields."
): ActionState {
  return { status: "error", message, errors };
}

export function success(message = "Saved."): ActionState {
  return { status: "success", message };
}
