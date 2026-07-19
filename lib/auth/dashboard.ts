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

/** Where to send unauthenticated/unauthorized callers. Kept on the public site
 * root so no public route, locale, sitemap, robots, or SEO behavior changes. */
export const DASHBOARD_SIGN_IN_PATH = "/";
export const DASHBOARD_FORBIDDEN_PATH = "/";

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
 * Guard for future dashboard routes/server actions. Redirects safely when the
 * caller is unauthenticated/inactive (to the sign-in path) or lacks the required
 * role (to the forbidden path). When called with no roles, any active member
 * passes. Returns the member so callers can use role/identity.
 */
export async function requireDashboardRole(
  ...roles: DashboardRole[]
): Promise<DashboardMember> {
  const member = await getCurrentDashboardMember();
  if (!member) redirect(DASHBOARD_SIGN_IN_PATH);
  if (roles.length > 0 && !roles.includes(member.role)) {
    redirect(DASHBOARD_FORBIDDEN_PATH);
  }
  return member;
}
