import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordResetAction } from "@/lib/auth/dashboard-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Reset password", robots: { index: false, follow: false } };

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { state?: string };
}) {
  const sent = searchParams.state === "sent";
  const unconfigured = searchParams.state === "unconfigured";

  return (
    <section className="dash-glass dash-auth-card">
      <h1>Reset your password</h1>
      <p className="dash-auth-sub">
        Enter your dashboard email and we&apos;ll send a recovery link if an account exists.
      </p>

      {sent ? (
        <div className="dash-alert dash-alert-ok" role="status">
          If an account exists for that email, a password recovery link has been sent. Please
          check your inbox.
        </div>
      ) : null}
      {unconfigured ? (
        <div className="dash-alert dash-alert-error" role="alert">
          Dashboard authentication is not configured yet. Please try again later.
        </div>
      ) : null}

      {!sent ? (
        <form action={requestPasswordResetAction}>
          <div className="dash-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="username" required />
          </div>
          <button type="submit" className="dash-btn dash-btn-primary">
            Send recovery link
          </button>
        </form>
      ) : null}

      <div className="dash-auth-links">
        <Link href="/dashboard/login">Back to sign in</Link>
      </div>
    </section>
  );
}
