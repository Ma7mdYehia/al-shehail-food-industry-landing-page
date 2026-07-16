import { requireDashboardRole } from "@/lib/auth/dashboard";

// Minimal PROTECTED placeholder that proves the auth guard works end-to-end.
// It is NOT the dashboard UI (deferred to a later patch). Rendered on demand so
// the build never invokes Supabase; unauthenticated/inactive/unauthorized
// callers are redirected to the public root by requireDashboardRole().
export const dynamic = "force-dynamic";

export default async function DashboardPlaceholderPage() {
  // Any active dashboard member may view this placeholder. A non-member,
  // inactive member, or unauthenticated caller is redirected to "/".
  const member = await requireDashboardRole();

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: "40rem" }}>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Dashboard (foundation)</h1>
      <p style={{ marginTop: "0.75rem", color: "#444" }}>
        Signed in as <strong>{member.displayName}</strong> — role{" "}
        <strong>{member.role}</strong>.
      </p>
      <p style={{ marginTop: "0.75rem", color: "#666" }}>
        Authorization is enforced by Supabase RLS and this server-side guard. The
        content-management UI is delivered in a later patch.
      </p>
    </main>
  );
}
