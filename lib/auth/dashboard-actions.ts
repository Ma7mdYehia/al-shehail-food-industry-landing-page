"use server";

// Server actions for the dashboard auth flows. All run on the server with the
// request-scoped Supabase client (public anon key + cookies — never the
// service-role key). User-facing outcomes are GENERIC (never reveal whether an
// email exists, never leak raw Supabase errors), and passwords/tokens are never
// logged or placed in URLs.

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabasePublicConfig, siteUrl } from "@/lib/env/public";
import { getDashboardAuthFlowSecret, hasDashboardAuthFlowSecret } from "@/lib/env/server";
import {
  DASHBOARD_HOME,
  DASHBOARD_LOGIN_PATH,
  DASHBOARD_FORGOT_PASSWORD_PATH,
  DASHBOARD_UPDATE_PASSWORD_PATH,
  DASHBOARD_AUTH_CALLBACK_PATH,
  safeDashboardReturnPath,
} from "@/lib/auth/redirect";
import { validateNewPassword } from "@/lib/auth/password";
import {
  FLOW_GATE_COOKIE,
  RECOVERY_STATE_COOKIE,
  STATE_TTL_SECONDS,
  flowCookieOptions,
  randomToken,
  verifyGateToken,
  hashNonce,
} from "@/lib/auth/flow-gate";

function loginUrl(returnTo: unknown, error?: string): string {
  const params = new URLSearchParams();
  const safe = safeDashboardReturnPath(returnTo, DASHBOARD_HOME);
  if (safe !== DASHBOARD_HOME) params.set("returnTo", safe);
  if (error) params.set("error", error);
  const qs = params.toString();
  return qs ? `${DASHBOARD_LOGIN_PATH}?${qs}` : DASHBOARD_LOGIN_PATH;
}

/** Email/password sign-in. Generic invalid-credentials handling. */
export async function signInAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const returnTo = formData.get("returnTo");

  if (!email || !password) redirect(loginUrl(returnTo, "invalid"));
  if (!hasSupabasePublicConfig()) redirect(loginUrl(returnTo, "unconfigured"));

  let ok = false;
  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    ok = !error;
  } catch {
    redirect(loginUrl(returnTo, "unconfigured"));
  }

  // Generic: never reveal whether the email exists.
  if (!ok) redirect(loginUrl(returnTo, "invalid"));
  redirect(safeDashboardReturnPath(returnTo, DASHBOARD_HOME));
}

/** Forgot-password request. Always shows the same "sent" response regardless of
 * whether the account exists. */
export async function requestPasswordResetAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();

  // Require BOTH valid Supabase config AND a strong flow secret before sending —
  // otherwise the recovery link could never be honored. Response stays generic
  // (no account enumeration).
  if (!hasSupabasePublicConfig() || !hasDashboardAuthFlowSecret()) {
    redirect(`${DASHBOARD_FORGOT_PASSWORD_PATH}?state=unconfigured`);
  }

  // Bind the recovery PKCE flow to a high-entropy state stored in a short-lived
  // HttpOnly cookie; the callback requires a matching state before accepting the
  // recovery code. This prevents an attacker-supplied code from minting a gate.
  // If the state cookie cannot be written, FAIL CLOSED: sending a recovery email
  // whose callback can never satisfy the state check would only produce an
  // unusable link. Return the same generic response (no account enumeration).
  const state = randomToken(32);
  try {
    cookies().set(RECOVERY_STATE_COOKIE, state, flowCookieOptions(STATE_TTL_SECONDS));
  } catch {
    redirect(`${DASHBOARD_FORGOT_PASSWORD_PATH}?state=unconfigured`);
  }

  // Fire-and-forget: the outcome (including "user not found") is never surfaced.
  try {
    if (email) {
      const supabase = createSupabaseServerClient();
      const redirectTo = `${siteUrl}${DASHBOARD_AUTH_CALLBACK_PATH}?type=recovery&state=${encodeURIComponent(state)}`;
      await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    }
  } catch {
    // Swallow — do not reveal configuration/account details.
  }

  redirect(`${DASHBOARD_FORGOT_PASSWORD_PATH}?state=sent`);
}

/** Secure password update. Requires BOTH an authenticated session AND a valid,
 * server-verified recovery/invite gate bound to that same user. A normal
 * session, or a query parameter alone, is rejected. On success the gate is
 * consumed, all sessions are invalidated, and a fresh login is required. */
export async function updatePasswordAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  // Fail closed with a generic config message if Supabase or the gate secret is
  // not configured.
  if (!hasSupabasePublicConfig() || !hasDashboardAuthFlowSecret()) {
    redirect(`${DASHBOARD_UPDATE_PASSWORD_PATH}?error=unconfigured`);
  }

  let supabase;
  try {
    supabase = createSupabaseServerClient();
  } catch {
    redirect(`${DASHBOARD_UPDATE_PASSWORD_PATH}?error=unconfigured`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(DASHBOARD_LOGIN_PATH);

  // The recovery/invite gate must be present, valid, unexpired, and bound to
  // THIS user. This stops an ordinary authenticated session (or a
  // `type=recovery` query parameter) from reaching the password-set flow.
  const gate = cookies().get(FLOW_GATE_COOKIE)?.value;
  const verdict = verifyGateToken(getDashboardAuthFlowSecret(), gate, { userId: user.id });
  if (!verdict.ok) {
    clearFlowCookies();
    redirect(DASHBOARD_LOGIN_PATH);
  }

  // Validate password INPUT before consuming the nonce, so a simple typo does
  // not burn the one-time gate (no security dependency yet — nothing changed).
  if (!validateNewPassword(password, confirm).ok) {
    redirect(`${DASHBOARD_UPDATE_PASSWORD_PATH}?error=invalid`);
  }

  // Atomically CONSUME the durable single-use nonce. Concurrent requests with the
  // same gate result in exactly one successful consume; an already-consumed,
  // expired, missing, or cross-user nonce returns false → reject generically.
  let consumed = false;
  try {
    const { data, error } = await supabase.rpc("consume_dashboard_flow_nonce", {
      p_nonce_hash: hashNonce(verdict.nonce),
      p_purpose: verdict.purpose,
    });
    consumed = !error && data === true;
  } catch {
    consumed = false;
  }
  if (!consumed) {
    clearFlowCookies();
    redirect(DASHBOARD_LOGIN_PATH);
  }

  // Update the password ONLY after successful consumption. Inspect the returned
  // error explicitly (Supabase returns { error }, it does not always throw). On
  // failure the nonce is NOT restored — a new recovery flow must be started.
  const { error: updateError } = await supabase.auth.updateUser({ password });
  if (updateError) {
    clearFlowCookies();
    redirect(`${DASHBOARD_LOGIN_PATH}?error=auth`);
  }

  // Password changed. Invalidate refresh sessions globally; fall back to a local
  // sign-out if the global call returns an error, so the local session/cookies
  // are cleared regardless. (Global sign-out revokes refresh sessions; existing
  // access tokens may remain valid until their JWT expiry — the consumed nonce
  // prevents this gate from being replayed in the meantime.)
  clearFlowCookies();
  const { error: signOutError } = await safeSignOut(supabase, "global");
  const notice = signOutError ? "updated-partial" : "updated";
  redirect(`${DASHBOARD_LOGIN_PATH}?notice=${notice}`);
}

/** Sign out and return to the login page. Explicitly inspects the result and
 * falls back to a local sign-out so the local session is always cleared. */
export async function signOutAction(): Promise<void> {
  try {
    if (hasSupabasePublicConfig()) {
      const supabase = createSupabaseServerClient();
      await safeSignOut(supabase, "global");
    }
  } catch {
    // Ignore — always land on login.
  }
  clearFlowCookies();
  redirect(DASHBOARD_LOGIN_PATH);
}

// Attempt a global sign-out; if it returns an error, fall back to a local
// sign-out so the current session/cookies are cleared regardless. Returns the
// remaining error (null when at least the local sign-out succeeded).
async function safeSignOut(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  scope: "global" | "local"
): Promise<{ error: unknown | null }> {
  try {
    const { error } = await supabase.auth.signOut({ scope });
    if (!error) return { error: null };
    if (scope === "global") {
      const { error: localError } = await supabase.auth.signOut({ scope: "local" });
      // Report the ORIGINAL (global) failure so the caller can show a partial
      // notice, but the local session is now cleared.
      return { error: localError ?? error };
    }
    return { error };
  } catch (err) {
    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      /* best effort */
    }
    return { error: err };
  }
}

function clearFlowCookies(): void {
  try {
    const store = cookies();
    store.delete(FLOW_GATE_COOKIE);
    store.delete(RECOVERY_STATE_COOKIE);
  } catch {
    // Ignore.
  }
}
