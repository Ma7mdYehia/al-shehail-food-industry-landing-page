import type { Metadata } from "next";
import { requireDashboardMember } from "@/lib/auth/dashboard";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Enquiries" };

export default async function EnquiriesPage() {
  // Any active dashboard member may view this section (server-enforced).
  await requireDashboardMember();
  return <ComingSoon title="Enquiries" description="Review and handle contact-form enquiries." />;
}
