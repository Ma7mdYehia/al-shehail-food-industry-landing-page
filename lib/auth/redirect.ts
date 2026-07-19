// Redirect-safety helpers for the dashboard auth flows.
//
// Return paths arrive from untrusted query strings, so they are validated to be
// INTERNAL dashboard paths only. Everything else falls back to a safe default.
// Pure and dependency-free so it can be unit-tested without a build.

export const DASHBOARD_HOME = "/dashboard";
export const DASHBOARD_LOGIN_PATH = "/dashboard/login";
export const DASHBOARD_FORGOT_PASSWORD_PATH = "/dashboard/forgot-password";
export const DASHBOARD_UPDATE_PASSWORD_PATH = "/dashboard/update-password";
export const DASHBOARD_FORBIDDEN_PATH = "/dashboard/forbidden";
export const DASHBOARD_AUTH_CALLBACK_PATH = "/dashboard/auth/callback";

// Paths that must never be used as a post-login return target (they would loop
// the user back through auth). Return them → fall back to the dashboard home.
const LOOPING_PREFIXES = [
  DASHBOARD_LOGIN_PATH,
  DASHBOARD_FORGOT_PASSWORD_PATH,
  DASHBOARD_UPDATE_PASSWORD_PATH,
  DASHBOARD_FORBIDDEN_PATH,
  "/dashboard/auth",
];

// Control characters (U+0000–U+001F and U+007F) are never allowed in a path.
function hasControlChar(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code <= 0x1f || code === 0x7f) return true;
  }
  return false;
}

/**
 * Validate an untrusted return path and return a SAFE internal dashboard path.
 *
 * Accepts only paths that, after a single decode, begin with `/dashboard`.
 * Rejects: non-strings, absolute URLs (`http:`, `https:`, any `scheme:`),
 * protocol-relative URLs (`//host`, `/\host`), backslashes, whitespace/control
 * characters, encoded external targets, and auth-route loops. Query strings and
 * fragments are dropped. Anything invalid returns `fallback` (default
 * `/dashboard`).
 */
export function safeDashboardReturnPath(
  input: unknown,
  fallback: string = DASHBOARD_HOME
): string {
  if (typeof input !== "string" || input.length === 0 || input.length > 512) {
    return fallback;
  }

  // Decode once so encoded external targets (e.g. %2F%2Fevil.example) are caught.
  let decoded: string;
  try {
    decoded = decodeURIComponent(input);
  } catch {
    return fallback;
  }

  // Reject control characters, whitespace, and backslashes outright.
  if (hasControlChar(decoded) || /\s/.test(decoded) || decoded.includes("\\")) {
    return fallback;
  }

  // Must be a root-relative path, not protocol-relative and not absolute.
  if (!decoded.startsWith("/")) return fallback;
  if (decoded.startsWith("//")) return fallback; // protocol-relative
  if (decoded.includes("://")) return fallback; // absolute URL smuggled in

  // Keep only the pathname (drop query and fragment).
  const pathname = decoded.split("?")[0].split("#")[0];

  // Confirm it targets the dashboard subtree exactly.
  if (pathname !== DASHBOARD_HOME && !pathname.startsWith("/dashboard/")) {
    return fallback;
  }

  // Reject auth-route loops.
  for (const prefix of LOOPING_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) return fallback;
  }

  return pathname;
}

/**
 * Build a login URL that preserves a validated return path. The returnTo is only
 * attached when it is a safe non-default dashboard path.
 */
export function loginPathWithReturn(returnTo: unknown): string {
  const safe = safeDashboardReturnPath(returnTo, DASHBOARD_HOME);
  if (safe === DASHBOARD_HOME) return DASHBOARD_LOGIN_PATH;
  return `${DASHBOARD_LOGIN_PATH}?returnTo=${encodeURIComponent(safe)}`;
}
