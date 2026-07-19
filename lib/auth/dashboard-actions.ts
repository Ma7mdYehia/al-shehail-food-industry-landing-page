"use server";

// Server actions for the dashboard auth flows. All run on the server with the
// request-scoped Supabase client (public anon key + cookies — never the
// service-role key). User-facing outcomes are GENERIC (never reveal whether an
// email exists, never leak raw Supabase errors), and passwords/tokens are never
// logged or placed in URLs.

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabasePublicConfig, siteUrl } from "@/lib/env/public";
import {
  DASHBOARD_HOME,
  DASHBOARD_LOGIN_PATH,
  DASHBOARD_FORGOT_PASSWORD_PATH,
  DASHBOARD_UPDATE_PASSWORD_PATH,
  DASHBOARD_AUTH_CALLBACK_PATH,
  safeDashboardReturnPath,
} from "@/lib/auth/redirect";
import { validateNewPassword } from "@/lib/auth/password";

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

  // Fire-and-forget: the outcome (including "user not found") is never surfaced.
  try {
    if (email) {
      const supabase = createSupabaseServerClient();
      const redirectTo = `${siteUrl}${DASHBOARD_AUTH_CALLBACK_PATH}?type=recovery`;
      await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    }
  } catch {
    // Swallow — do not reveal configuration/account details.
  }

  redirect(`${DASHBOARD_FORGOT_PASSWORD_PATH}?state=sent`);
}

/** Secure password update. Requires an authenticated (recovery/invite) session;
 * server-side validation; generic failures; redirects safely to /dashboard. */
export async function updatePasswordAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!hasSupabasePublicConfig()) {
    redirect(`${DASHBOARD_UPDATE_PASSWORD_PATH}?error=unconfigured`);
  }

  let supabase;
  try {
    supabase = createSupabaseServerClient();
  } catch {
    redirect(`${DASHBOARD_UPDATE_PASSWORD_PATH}?error=unconfigured`);
  }

  // Must have a valid session (from the recovery/invite callback).
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(DASHBOARD_LOGIN_PATH);

  // Server-side validation (do NOT log the password values).
  if (!validateNewPassword(password, confirm).ok) {
    redirect(`${DASHBOARD_UPDATE_PASSWORD_PATH}?error=invalid`);
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect(`${DASHBOARD_UPDATE_PASSWORD_PATH}?error=failed`);

  redirect(DASHBOARD_HOME);
}

/** Sign out and return to the login page. */
export async function signOutAction(): Promise<void> {
  try {
    if (hasSupabasePublicConfig()) {
      const supabase = createSupabaseServerClient();
      await supabase.auth.signOut();
    }
  } catch {
    // Ignore — always land on login.
  }
  redirect(DASHBOARD_LOGIN_PATH);
}
