import type { Metadata } from "next";
import { requireDashboardMember } from "@/lib/auth/dashboard";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  // Any active dashboard member may view this section (server-enforced).
  await requireDashboardMember();
  return <ComingSoon title="Services" description="Manage service pages and their sections." />;
}
