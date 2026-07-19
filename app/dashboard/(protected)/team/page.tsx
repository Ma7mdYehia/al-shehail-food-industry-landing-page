import type { Metadata } from "next";
import { requireDashboardRole } from "@/lib/auth/dashboard";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Team" };

// OWNER-ONLY, enforced server-side even though the UI is a placeholder. Admins
// and editors are sent to the forbidden page by requireDashboardRole("owner").
export default async function TeamPage() {
  await requireDashboardRole("owner");
  return (
    <ComingSoon
      title="Team"
      description="Manage dashboard members and roles. Visible to owners only."
    />
  );
}
