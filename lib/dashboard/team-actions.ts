"use server";

// Owner-only team-management server actions. All role/state changes go through
// the P05 SECURITY DEFINER RPC `dashboard_set_member_state`, which re-checks
// owner identity from auth.uid(), blocks self-deactivation/self-demotion, and
// protects the final active owner atomically. This action layer adds an
// independent server-side owner re-check and generic error surfacing — the role
// submitted by the browser is validated against the enum and never trusted.

import { revalidatePath } from "next/cache";
import { authorizeAction, fail, success, type ActionState } from "@/lib/dashboard/actions-core";
import { DASHBOARD_ROLES, type DashboardRole } from "@/lib/auth/roles";

const TEAM_PATH = "/dashboard/team";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function setMemberStateAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const authz = await authorizeAction(["owner"]);
  if (!authz.ok) return authz.state;
  const { member, supabase } = authz.authorized;

  const memberId = String(formData.get("memberId") ?? "");
  const role = String(formData.get("role") ?? "");
  const isActive = String(formData.get("isActive") ?? "") === "true";

  if (!UUID_RE.test(memberId)) return fail("Unknown member.");
  if (!(DASHBOARD_ROLES as readonly string[]).includes(role)) return fail("Invalid role.");

  try {
    const { data, error } = await supabase.rpc("dashboard_set_member_state", {
      p_member_id: memberId,
      p_role: role as DashboardRole,
      p_is_active: isActive,
    });
    // The RPC raises for every rejected case (not-owner, self-change, final
    // owner, unknown member). Surface a single generic message either way.
    if (error || !Array.isArray(data) || data.length === 0) {
      return fail("This change was rejected. You cannot demote or deactivate yourself or the final owner.");
    }
  } catch {
    return fail("The change could not be saved. Please refresh and try again.");
  }

  revalidatePath(TEAM_PATH);
  revalidatePath("/dashboard");
  // Touch `member` so the linter keeps the owner re-check meaningful even if the
  // value is otherwise unused.
  void member.userId;
  return success("Team member updated.");
}
