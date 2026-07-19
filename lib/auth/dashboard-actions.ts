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

  if (!hasSupabasePublicConfig()) {
    redirect(`${DASHBOARD_FORGOT_PASSWORD_PATH}?state=unconfigured`);
  }

  // Bind the recovery PKCE flow to a high-entropy state stored in a short-lived
  // HttpOnly cookie; the callback requires a matching state before accepting the
  // recovery code. This prevents an attacker-supplied code from minting a gate.
  const state = randomToken(32);
  try {
    cookies().set(RECOVERY_STATE_COOKIE, state, flowCookieOptions(STATE_TTL_SECONDS));
  } catch {
    // Cookie store unavailable — proceed; callback will simply reject.
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
  // THIS user. This is what stops an ordinary authenticated session (or a
  // `type=recovery` query parameter) from reaching the password-set flow.
  const gate = cookies().get(FLOW_GATE_COOKIE)?.value;
  const verdict = verifyGateToken(getDashboardAuthFlowSecret(), gate, { userId: user.id });
  if (!verdict.ok) {
    clearFlowCookies();
    redirect(DASHBOARD_LOGIN_PATH);
  }

  // Server-side validation (do NOT log the password values).
  if (!validateNewPassword(password, confirm).ok) {
    redirect(`${DASHBOARD_UPDATE_PASSWORD_PATH}?error=invalid`);
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect(`${DASHBOARD_UPDATE_PASSWORD_PATH}?error=failed`);

  // Consume the gate (replay protection) and invalidate ALL sessions so a fresh
  // login is required with the new password.
  clearFlowCookies();
  try {
    await supabase.auth.signOut({ scope: "global" });
  } catch {
    // Best effort — a fresh login is still required.
  }
  redirect(`${DASHBOARD_LOGIN_PATH}?notice=updated`);
}

/** Sign out and return to the login page. */
export async function signOutAction(): Promise<void> {
  try {
    if (hasSupabasePublicConfig()) {
      const supabase = createSupabaseServerClient();
      await supabase.auth.signOut({ scope: "global" });
    }
  } catch {
    // Ignore — always land on login.
  }
  clearFlowCookies();
  redirect(DASHBOARD_LOGIN_PATH);
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
