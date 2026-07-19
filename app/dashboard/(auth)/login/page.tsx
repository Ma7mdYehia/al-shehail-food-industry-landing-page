import type { Metadata } from "next";
import Link from "next/link";
import { signInAction } from "@/lib/auth/dashboard-actions";
import { safeDashboardReturnPath, DASHBOARD_HOME } from "@/lib/auth/redirect";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

const ERRORS: Record<string, string> = {
  invalid: "Invalid email or password.",
  unconfigured: "Dashboard authentication is not configured yet. Please try again later.",
  auth: "That sign-in link is invalid or has expired. Please sign in again.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; returnTo?: string };
}) {
  const message = searchParams.error ? ERRORS[searchParams.error] ?? ERRORS.invalid : null;
  const returnTo = safeDashboardReturnPath(searchParams.returnTo, DASHBOARD_HOME);

  return (
    <section className="dash-glass dash-auth-card">
      <h1>Al Shehail Dashboard</h1>
      <p className="dash-auth-sub">Sign in with your dashboard account.</p>

      {message ? (
        <div className="dash-alert dash-alert-error" role="alert">
          {message}
        </div>
      ) : null}

      <form action={signInAction}>
        <input type="hidden" name="returnTo" value={returnTo} />
        <div className="dash-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="username" required />
        </div>
        <div className="dash-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" className="dash-btn dash-btn-primary">
          Sign in
        </button>
      </form>

      <div className="dash-auth-links">
        <Link href="/dashboard/forgot-password">Forgot password?</Link>
      </div>
    </section>
  );
}
