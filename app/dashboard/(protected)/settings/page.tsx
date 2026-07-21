import type { Metadata } from "next";
import { requireDashboardMember } from "@/lib/auth/dashboard";
import { getSharedContent } from "@/lib/dashboard/shared-content";
import { SharedContentEditor } from "@/components/dashboard/SharedContentEditor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireDashboardMember();
  const content = await getSharedContent();

  return (
    <>
      <h1 className="dash-page-title">Settings</h1>
      <p className="dash-page-sub">Shared content used across the public site (managed here; public reads migrate in a later patch).</p>

      {!content ? (
        <div className="dash-glass dash-card" role="status">
          <p className="dash-card-label">Shared content</p>
          <p className="dash-card-note dash-card-error">Shared content is unavailable right now. Please refresh.</p>
        </div>
      ) : (
        <SharedContentEditor content={content} />
      )}
    </>
  );
}
