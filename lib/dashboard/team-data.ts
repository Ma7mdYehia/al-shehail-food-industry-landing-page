// Team-page data loading (SERVER-ONLY). Owner-only reads are enforced by the
// page guard (requireDashboardRole("owner")) AND by RLS (dashboard_members
// owner-read policy). Fails closed to an empty/unavailable result.

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isDashboardRole, type DashboardRole } from "@/lib/auth/roles";

export type TeamMemberRow = {
  id: string;
  email: string;
  displayName: string;
  role: DashboardRole;
  isActive: boolean;
  isSelf: boolean;
};

export type TeamData =
  | { status: "unavailable" }
  | { status: "ok"; members: TeamMemberRow[]; activeOwners: number };

export async function loadTeam(currentUserId: string): Promise<TeamData> {
  let supabase;
  try {
    supabase = createSupabaseServerClient();
  } catch {
    return { status: "unavailable" };
  }

  try {
    const { data, error } = await supabase
      .from("dashboard_members")
      .select("id, user_id, email, display_name, role, is_active")
      .order("is_active", { ascending: false })
      .order("role", { ascending: true })
      .order("display_name", { ascending: true });

    if (error || !data) return { status: "unavailable" };

    const members: TeamMemberRow[] = data
      .filter((m) => isDashboardRole(m.role))
      .map((m) => ({
        id: m.id as string,
        email: m.email as string,
        displayName: m.display_name as string,
        role: m.role as DashboardRole,
        isActive: m.is_active === true,
        isSelf: m.user_id === currentUserId,
      }));

    const activeOwners = members.filter((m) => m.isActive && m.role === "owner").length;
    return { status: "ok", members, activeOwners };
  } catch {
    return { status: "unavailable" };
  }
}
