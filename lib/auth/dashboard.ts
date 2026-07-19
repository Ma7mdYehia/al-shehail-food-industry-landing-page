// Server-side dashboard authorization utilities.
//
// SERVER-ONLY. This module reads the request's Supabase session (via the
// PUBLIC anon key + cookies — never the service-role key) and derives the
// caller's dashboard membership from the database. Authorization is ALWAYS
// derived from auth.uid() + the dashboard_members row, never from client
// metadata, JWT user_metadata, cookies, or email text.
//
// It contains no service-role key and must not be imported into a Client
// Component; the guard below throws loudly if it ever reaches the browser.

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DashboardRole } from "@/lib/auth/roles";
import { isDashboardRole } from "@/lib/auth/roles";
import {
  DASHBOARD_LOGIN_PATH,
  DASHBOARD_FORBIDDEN_PATH as REDIRECT_FORBIDDEN_PATH,
  loginPathWithReturn,
} from "@/lib/auth/redirect";

if (typeof window !== "undefined") {
  throw new Error(
    "lib/auth/dashboard.ts is server-only and was imported into client code."
  );
}

export type DashboardMember = {
  userId: string;
  email: string;
  displayName: string;
  role: DashboardRole;
  isActive: boolean;
};

/** Where to send unauthenticated / unauthorized callers (P04: the dashboard
 * auth pages, not the public homepage). */
export const DASHBOARD_SIGN_IN_PATH = DASHBOARD_LOGIN_PATH;
export const DASHBOARD_FORBIDDEN_PATH = REDIRECT_FORBIDDEN_PATH;

/** Distinguishes the three access outcomes so the shell can send unauthenticated
 * users to login and inactive/non-members to the forbidden page (without
 * revealing whether an email is a configured member). */
export type DashboardAuthState =
  | { status: "unauthenticated" }
  | { status: "forbidden" }
  | { status: "ok"; member: DashboardMember };

/**
 * Returns the current caller's ACTIVE dashboard membership, or null when the
 * caller is unauthenticated, has no membership, is inactive, or when Supabase
 * is not configured. Fails closed: any error resolves to null (no access).
 */
export async function getCurrentDashboardMember(): Promise<DashboardMember | null> {
  try {
    const supabase = createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return null;

    const { data, error } = await supabase
      .from("dashboard_members")
      .select("user_id, email, display_name, role, is_active")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data) return null;
    if (data.is_active !== true) return null;
    if (!isDashboardRole(data.role)) return null;

    return {
      userId: data.user_id,
      email: data.email,
      displayName: data.display_name,
      role: data.role,
      isActive: true,
    };
  } catch {
    // Supabase not configured, network error, etc. — deny by default.
    return null;
  }
}

/**
 * Resolve the caller's dashboard access outcome, distinguishing unauthenticated
 * from forbidden. Fails CLOSED: a missing/broken Supabase config resolves to
 * `unauthenticated` (→ login), and a membership/role problem to `forbidden`.
 * Never reveals whether a given email is a configured member.
 */
export async function getDashboardAuthState(): Promise<DashboardAuthState> {
  let supabase;
  try {
    supabase = createSupabaseServerClient();
  } catch {
    // Supabase not configured — no one is authenticated.
    return { status: "unauthenticated" };
  }

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return { status: "unauthenticated" };

    const { data, error } = await supabase
      .from("dashboard_members")
      .select("user_id, email, display_name, role, is_active")
      .eq("user_id", user.id)
      .maybeSingle();

    // Any query failure, missing/inactive membership, or invalid role → forbidden
    // (the user IS authenticated but has no dashboard access).
    if (error || !data || data.is_active !== true || !isDashboardRole(data.role)) {
      return { status: "forbidden" };
    }

    return {
      status: "ok",
      member: {
        userId: data.user_id,
        email: data.email,
        displayName: data.display_name,
        role: data.role,
        isActive: true,
      },
    };
  } catch {
    // A verified session is required; on any unexpected failure, fail closed to
    // login rather than granting access.
    return { status: "unauthenticated" };
  }
}

/**
 * Protected-layout guard. Redirects unauthenticated callers to login (preserving
 * an optional safe return path) and authenticated non-members/inactive members
 * to the forbidden page. Returns the validated active member.
 */
export async function requireDashboardMember(
  returnTo?: string
): Promise<DashboardMember> {
  const state = await getDashboardAuthState();
  if (state.status === "unauthenticated") redirect(loginPathWithReturn(returnTo));
  if (state.status === "forbidden") redirect(DASHBOARD_FORBIDDEN_PATH);
  return state.member;
}

/**
 * Role guard on top of {@link requireDashboardMember}. Active members lacking one
 * of `roles` are sent to the forbidden page. Enforced server-side.
 */
export async function requireDashboardRole(
  ...roles: DashboardRole[]
): Promise<DashboardMember> {
  const member = await requireDashboardMember();
  if (roles.length > 0 && !roles.includes(member.role)) {
    redirect(DASHBOARD_FORBIDDEN_PATH);
  }
  return member;
}
