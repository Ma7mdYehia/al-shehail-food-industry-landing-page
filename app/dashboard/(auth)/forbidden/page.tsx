import type { Metadata } from "next";
import { signOutAction } from "@/lib/auth/dashboard-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "No access", robots: { index: false, follow: false } };

// Shown to an authenticated user who is not an active dashboard member. It does
// NOT reveal whether their email is configured as a member — the message is the
// same for a non-member and an inactive member.
export default function ForbiddenPage() {
  return (
    <section className="dash-glass dash-auth-card">
      <h1>No dashboard access</h1>
      <p className="dash-auth-sub">
        Your account doesn&apos;t currently have access to the Al Shehail dashboard. If you
        believe this is a mistake, please contact your dashboard administrator.
      </p>
      <form action={signOutAction}>
        <button type="submit" className="dash-btn dash-btn-primary">
          Sign out
        </button>
      </form>
    </section>
  );
}
