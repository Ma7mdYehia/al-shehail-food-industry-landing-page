// Password policy for dashboard accounts. Pure and dependency-free so it can be
// unit-tested and shared by the server action and the update-password page.
// Never logs or echoes password values.

export const MIN_PASSWORD_LENGTH = 12;

export type PasswordCheck = { ok: true } | { ok: false; reason: "too-short" | "mismatch" };

export function validateNewPassword(password: unknown, confirm: unknown): PasswordCheck {
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, reason: "too-short" };
  }
  if (password !== confirm) {
    return { ok: false, reason: "mismatch" };
  }
  return { ok: true };
}
