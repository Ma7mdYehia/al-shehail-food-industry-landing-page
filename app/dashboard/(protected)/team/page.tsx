import type { Metadata } from "next";
import { requireDashboardRole } from "@/lib/auth/dashboard";
import { loadTeam } from "@/lib/dashboard/team-data";
import { TeamManager } from "@/components/dashboard/TeamManager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Team" };

// OWNER-ONLY, enforced server-side. Admins/editors are sent to the forbidden
// page by requireDashboardRole("owner"); RLS + the P05 RPC enforce the same at
// the database. Editors therefore receive no team-management data at all.
export default async function TeamPage() {
  const member = await requireDashboardRole("owner");
  const team = await loadTeam(member.userId);

  return (
    <>
      <h1 className="dash-page-title">Team</h1>
      <p className="dash-page-sub">
        Manage dashboard member roles and access. Owner-only. Changes are applied through a
        protected server action that prevents you from demoting yourself or removing the final
        owner.
      </p>

      {team.status === "unavailable" ? (
        <div className="dash-glass dash-card" role="status">
          <p className="dash-card-label">Team</p>
          <p className="dash-card-note dash-card-error">
            Member data is currently unavailable. Please refresh.
          </p>
        </div>
      ) : (
        <TeamManager members={team.members} activeOwners={team.activeOwners} />
      )}

      <div className="dash-glass dash-card" style={{ marginTop: 20, maxWidth: 640 }}>
        <p className="dash-card-label">Inviting a new member</p>
        <p className="dash-card-note">
          Adding or inviting a brand-new sign-in requires the later authorized remote activation
          phase (Supabase Auth configuration). The three confirmed members are managed here; new
          Auth invitations are intentionally not available yet.
        </p>
      </div>
    </>
  );
}
