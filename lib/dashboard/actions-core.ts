// Shared server-action authorization helpers (SERVER-ONLY).
//
// Every dashboard mutation MUST start by calling authorizeAction(). It re-checks
// the caller from scratch on every request — getUser() (a verified token, never
// getSession()), then the ACTIVE dashboard_members row, then the required role —
// so a stale cookie, a demoted member, or a client-forged role can never pass.
// The database RLS/RPCs remain the real boundary; this is defense in depth plus
// friendly, generic error surfacing. No service-role key is ever used here.
//
// Pure result types/helpers live in ./action-state (client-safe) and are
// re-exported here so server actions can import everything from one place.

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentDashboardMember, type DashboardMember } from "@/lib/auth/dashboard";
import type { DashboardRole } from "@/lib/auth/roles";
import type { SupabaseClient } from "@supabase/supabase-js";
import { fail, type ActionState } from "@/lib/dashboard/action-state";

export { IDLE, fail, invalid, success, type ActionState } from "@/lib/dashboard/action-state";

if (typeof window !== "undefined") {
  throw new Error("lib/dashboard/actions-core.ts is server-only and was imported into client code.");
}

export type Authorized = {
  member: DashboardMember;
  supabase: SupabaseClient;
};

export type AuthzResult =
  | { ok: true; authorized: Authorized }
  | { ok: false; state: ActionState };

/**
 * Re-authorize the caller inside a server action. Resolves the active member via
 * getUser()+membership (fails closed), enforces `minRoles` when provided, and
 * returns a request-scoped Supabase client bound to the caller's session (RLS
 * applies). Returns a generic error state on any failure — never a raw error.
 */
export async function authorizeAction(minRoles?: DashboardRole[]): Promise<AuthzResult> {
  let supabase: SupabaseClient;
  try {
    supabase = createSupabaseServerClient() as unknown as SupabaseClient;
  } catch {
    return { ok: false, state: fail("The dashboard is not configured.") };
  }

  const member = await getCurrentDashboardMember();
  if (!member) {
    return { ok: false, state: fail("Your session is not authorized. Please sign in again.") };
  }
  if (minRoles && minRoles.length > 0 && !minRoles.includes(member.role)) {
    return { ok: false, state: fail("You do not have permission to perform this action.") };
  }
  return { ok: true, authorized: { member, supabase } };
}
