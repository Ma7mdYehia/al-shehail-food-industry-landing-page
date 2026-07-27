"use server";

// Owner-only team-management server actions. All role/state changes go through
// the P05 SECURITY DEFINER RPC `dashboard_set_member_state`, which re-checks
// owner identity from auth.uid(), blocks self-deactivation/self-demotion, and
// protects the final active owner atomically. This action layer adds an
// independent server-side owner re-check and generic error surfacing — the role
// submitted by the browser is validated against the enum and never trusted.

import { revalidatePath } from "next/cache";
import { authorizeAction, fail, invalid, success, type ActionState } from "@/lib/dashboard/actions-core";
import { buildMemberState } from "@/lib/dashboard/inputs";
import type { DashboardRole } from "@/lib/auth/roles";

const TEAM_PATH = "/dashboard/team";

export async function setMemberStateAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const authz = await authorizeAction(["owner"]);
  if (!authz.ok) return authz.state;
  const { member, supabase } = authz.authorized;

  // Rejects unknown fields, a non-UUID member id, and any role not in the enum
  // (the browser is never trusted for the role).
  const parsed = buildMemberState(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  const { memberId, role, isActive } = parsed.value;

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
