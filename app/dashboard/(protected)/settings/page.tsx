import type { Metadata } from "next";
import { requireDashboardMember } from "@/lib/auth/dashboard";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  // Any active dashboard member may view this section (server-enforced).
  await requireDashboardMember();
  return <ComingSoon title="Settings" description="Dashboard and account settings." />;
}
