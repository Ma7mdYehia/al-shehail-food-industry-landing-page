import type { ReactNode } from "react";
import { requireDashboardMember } from "@/lib/auth/dashboard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

// Server-side authorization boundary for every protected dashboard route.
// Redirects unauthenticated users to login and inactive/non-members to the
// forbidden page (RLS remains the database enforcement boundary). This never
// relies on client-side checks.
export const dynamic = "force-dynamic";

export default async function ProtectedDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const member = await requireDashboardMember();

  return (
    <DashboardShell displayName={member.displayName} role={member.role}>
      {children}
    </DashboardShell>
  );
}
