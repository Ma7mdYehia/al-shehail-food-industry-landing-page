// Public environment variables (NEXT_PUBLIC_*).
//
// These are inlined into the client bundle at build time and are therefore
// safe to read from both Server and Client Components. Only put values here
// that are genuinely safe to expose to the browser — never a secret.
//
// Validation is lazy: reading a not-yet-configured service (e.g. Supabase)
// throws a clear error only when that service is actually used, so the build
// never fails just because a future integration isn't wired up yet.
//
// IMPORTANT: NEXT_PUBLIC_* vars must be referenced as full static literals
// (process.env.NEXT_PUBLIC_FOO) for Next.js to inline them — do not access
// them via a computed key.

function required(value: string | undefined, name: string): string {
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required public environment variable "${name}". ` +
        `Set it in .env.local (local) or the Vercel project settings (deployed). ` +
        `See .env.example.`
    );
  }
  return value;
}

/** Canonical public site origin. Falls back to the production domain. */
export const siteUrl: string =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://alshehai.ae";

/**
 * Public Supabase config (project URL + anon key). Safe for the browser.
 * Throws only when called without the vars set — i.e. when Supabase is
 * actually used — so unrelated pages/builds are unaffected.
 */
export function getSupabasePublicConfig(): { url: string; anonKey: string } {
  return {
    url: required(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: required(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    ),
  };
}

/** True when the public Supabase vars are present (no throw). */
export function hasSupabasePublicConfig(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Public Cloudflare Turnstile site key (safe for the browser), or undefined. */
export const turnstileSiteKey: string | undefined =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined;
