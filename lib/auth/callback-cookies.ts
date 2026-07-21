// Fail-closed cookie handling for FAILED dashboard recovery/invite callbacks.
//
// This module is intentionally framework-agnostic and pure (it imports only the
// flow-cookie constants/options), so it can be executed directly in tests and
// applied to a real NextResponse in the route. It NEVER reads cookie values and
// never logs anything.
//
// The security rule it enforces: an error response must not carry a non-empty
// Supabase authentication/session cookie. Auth succeeding (exchangeCodeForSession
// / verifyOtp writes a session cookie) followed by a later failure (e.g. nonce
// registration) must still land the browser with NO session. We do not depend on
// signOut producing deletion mutations — every relevant Supabase auth cookie is
// turned into an explicit deletion here, whether it was (re)written during this
// request or was merely already present on the incoming request.

import { FLOW_GATE_COOKIE, RECOVERY_STATE_COOKIE, flowCookieOptions } from "./flow-gate";

export type CookieMutation = {
  name: string;
  value: string;
  options: Record<string, unknown>;
};

// A Supabase auth/session cookie. `@supabase/ssr` names them `sb-<ref>-auth-token`
// and splits large payloads into chunks `sb-<ref>-auth-token.0`, `.1`, …; the PKCE
// verifier is `sb-<ref>-auth-token-code-verifier`. We match by NAME only (values
// are never inspected) and deliberately scope to the `auth-token` family so
// unrelated `sb-` cookies are left alone.
export function isSupabaseAuthCookieName(name: string): boolean {
  return /^sb-.*auth-token/.test(name);
}

// Build the complete set of cookie mutations for a FAILED callback response.
// Returns ONLY deletions (empty value + Max-Age=0 + expired date):
//   * every Supabase auth cookie seen in `recordedWrites` OR `requestCookieNames`
//     (covering chunked variants and the PKCE verifier), each deleted at the path
//     it was written with (default "/"), and
//   * our own single-use flow gate + one-time recovery state.
// Unrelated application cookies are never touched. No non-empty value is emitted.
export function buildCallbackErrorCookies(input: {
  recordedWrites: CookieMutation[];
  requestCookieNames: string[];
}): CookieMutation[] {
  const { recordedWrites, requestCookieNames } = input;

  // Delete each Supabase cookie at the same path it was set with, otherwise the
  // browser would keep the original. Recorded writes carry their path; cookies we
  // only know from the request default to "/" (the Supabase ssr default).
  const pathByName = new Map<string, string>();
  const names = new Set<string>();
  for (const w of recordedWrites) {
    if (!isSupabaseAuthCookieName(w.name)) continue;
    names.add(w.name);
    const p = typeof w.options?.path === "string" ? (w.options.path as string) : "/";
    pathByName.set(w.name, p);
  }
  for (const name of requestCookieNames) {
    if (isSupabaseAuthCookieName(name)) names.add(name);
  }

  const expired = new Date(0);
  const deletions: CookieMutation[] = [];
  for (const name of Array.from(names)) {
    deletions.push({
      name,
      value: "",
      options: {
        path: pathByName.get(name) ?? "/",
        maxAge: 0,
        expires: expired,
        httpOnly: true,
        sameSite: "lax",
        secure: true,
      },
    });
  }

  // Always clear our own single-use flow cookies (scoped to /dashboard).
  deletions.push({
    name: FLOW_GATE_COOKIE,
    value: "",
    options: { ...flowCookieOptions(0), maxAge: 0, expires: expired },
  });
  deletions.push({
    name: RECOVERY_STATE_COOKIE,
    value: "",
    options: { ...flowCookieOptions(0), maxAge: 0, expires: expired },
  });

  return deletions;
}
