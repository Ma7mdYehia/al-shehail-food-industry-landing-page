import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { updatePasswordAction } from "@/lib/auth/dashboard-actions";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/password";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabasePublicConfig } from "@/lib/env/public";
import { DASHBOARD_LOGIN_PATH } from "@/lib/auth/redirect";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Set a new password", robots: { index: false, follow: false } };

const ERRORS: Record<string, string> = {
  invalid: `Password must be at least ${MIN_PASSWORD_LENGTH} characters and match the confirmation.`,
  failed: "We couldn't update your password. Your link may have expired — request a new one.",
  unconfigured: "Dashboard authentication is not configured yet. Please try again later.",
};

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  // This route is unavailable without an authenticated recovery/invite session.
  if (!hasSupabasePublicConfig()) {
    return (
      <section className="dash-glass dash-auth-card">
        <h1>Set a new password</h1>
        <div className="dash-alert dash-alert-error" role="alert">
          {ERRORS.unconfigured}
        </div>
      </section>
    );
  }

  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(DASHBOARD_LOGIN_PATH);
  } catch {
    redirect(DASHBOARD_LOGIN_PATH);
  }

  const message = searchParams.error ? ERRORS[searchParams.error] ?? ERRORS.invalid : null;

  return (
    <section className="dash-glass dash-auth-card">
      <h1>Set a new password</h1>
      <p className="dash-auth-sub">Choose a strong password for your dashboard account.</p>

      {message ? (
        <div className="dash-alert dash-alert-error" role="alert">
          {message}
        </div>
      ) : null}

      <form action={updatePasswordAction}>
        <div className="dash-field">
          <label htmlFor="password">New password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
          <span className="dash-help">At least {MIN_PASSWORD_LENGTH} characters.</span>
        </div>
        <div className="dash-field">
          <label htmlFor="confirm">Confirm password</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
        </div>
        <button type="submit" className="dash-btn dash-btn-primary">
          Update password
        </button>
      </form>
    </section>
  );
}
