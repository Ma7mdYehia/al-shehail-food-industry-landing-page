// Server-only environment variables.
//
// This module must NEVER be imported by a Client Component. It reads secrets
// (Supabase service-role key, Resend API key, Turnstile secret) that must not
// reach the browser bundle. The runtime guard below throws immediately if the
// module is ever evaluated in a browser, so an accidental client import fails
// loudly instead of silently shipping a secret. (A zero-dependency guard is
// used instead of the `server-only` package to keep this foundation patch's
// dependency surface minimal.)
//
// Validation is lazy: each accessor throws a clear error only when the
// corresponding service is actually used, so the Patch 01 build succeeds even
// though Supabase, Resend, and Turnstile are not configured yet.

if (typeof window !== "undefined") {
  throw new Error(
    "lib/env/server.ts was imported into client code. It reads server-only " +
      "secrets and must only be used from Server Components, Route Handlers, " +
      "or other server-side code."
  );
}

function required(value: string | undefined, name: string): string {
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required server environment variable "${name}". ` +
        `Set it in .env.local (local) or the Vercel project settings (deployed). ` +
        `This is a server-only secret and must never be exposed to the client. ` +
        `See .env.example.`
    );
  }
  return value;
}

function splitEmails(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

/**
 * Supabase service-role key — full-access, server-only. Throws when accessed
 * without being set. Do NOT use this in the normal public server client; it
 * bypasses row-level security and is reserved for trusted server tasks.
 */
export function getSupabaseServiceRoleKey(): string {
  return required(process.env.SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY");
}

/** Resend API key (server-only). Throws when accessed without being set. */
export function getResendApiKey(): string {
  return required(process.env.RESEND_API_KEY, "RESEND_API_KEY");
}

/** Cloudflare Turnstile secret key (server-only). */
export function getTurnstileSecretKey(): string {
  return required(process.env.TURNSTILE_SECRET_KEY, "TURNSTILE_SECRET_KEY");
}

/** Contact-form "from" address, with a safe default of the official email. */
export const contactFromEmail: string =
  process.env.CONTACT_FROM_EMAIL?.trim() ||
  "Al Shehail Website <info@alshehai.ae>";

/** Contact-form notification recipients (parsed list). */
export function getContactToEmails(): string[] {
  const list = splitEmails(process.env.CONTACT_TO_EMAILS);
  if (list.length === 0) {
    throw new Error(
      `Missing required server environment variable "CONTACT_TO_EMAILS" ` +
        `(comma-separated recipients). See .env.example.`
    );
  }
  return list;
}

/** Emails allowed to access the future admin dashboard (parsed list). */
export function getAdminAllowedEmails(): string[] {
  return splitEmails(process.env.ADMIN_ALLOWED_EMAILS);
}
