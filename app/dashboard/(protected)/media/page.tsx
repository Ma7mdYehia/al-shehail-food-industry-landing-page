import type { Metadata } from "next";
import { requireDashboardMember } from "@/lib/auth/dashboard";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Media" };

export default async function MediaPage() {
  // Any active dashboard member may view this section (server-enforced).
  await requireDashboardMember();
  return <ComingSoon title="Media" description="Manage media assets and imagery." />;
}
