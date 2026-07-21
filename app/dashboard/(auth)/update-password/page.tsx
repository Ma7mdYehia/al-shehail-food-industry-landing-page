import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { updatePasswordAction } from "@/lib/auth/dashboard-actions";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/password";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabasePublicConfig } from "@/lib/env/public";
import { getDashboardAuthFlowSecret, hasDashboardAuthFlowSecret } from "@/lib/env/server";
import { DASHBOARD_LOGIN_PATH } from "@/lib/auth/redirect";
import { FLOW_GATE_COOKIE, verifyGateToken } from "@/lib/auth/flow-gate";

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
  // This route is unavailable without BOTH an authenticated session AND a valid
  // recovery/invite gate bound to that user. A normal password session (no gate)
  // is redirected to login — it can never reach the password-set form.
  if (!hasSupabasePublicConfig() || !hasDashboardAuthFlowSecret()) {
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

    const gate = cookies().get(FLOW_GATE_COOKIE)?.value;
    const verdict = verifyGateToken(getDashboardAuthFlowSecret(), gate, { userId: user.id });
    if (!verdict.ok) redirect(DASHBOARD_LOGIN_PATH);
  } catch (err) {
    // Re-throw Next's redirect control-flow; otherwise fail closed to login.
    if (err && typeof err === "object" && "digest" in err && String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")) {
      throw err;
    }
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
