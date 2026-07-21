import type { Metadata } from "next";
import { requireDashboardMember } from "@/lib/auth/dashboard";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  // Any active dashboard member may view this section (server-enforced).
  await requireDashboardMember();
  return <ComingSoon title="Products" description="Create and manage the product catalog." />;
}
