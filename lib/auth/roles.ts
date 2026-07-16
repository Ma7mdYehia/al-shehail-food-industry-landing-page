// Dashboard role model (shared, no secrets, safe to import anywhere).
//
// These capability helpers MIRROR the database RLS policies added in
// Production Patch 03 — the database is the real enforcement boundary; these
// are for server-side UI/route decisions only. They must never be the sole
// authorization check.

export type DashboardRole = "owner" | "admin" | "editor";

export const DASHBOARD_ROLES: readonly DashboardRole[] = ["owner", "admin", "editor"];

export function isDashboardRole(value: unknown): value is DashboardRole {
  return typeof value === "string" && (DASHBOARD_ROLES as readonly string[]).includes(value);
}

/** owner/admin/editor may create and update content (INSERT/UPDATE). */
export function canWriteContent(role: DashboardRole): boolean {
  return role === "owner" || role === "admin" || role === "editor";
}

/** Only owner/admin may hard-DELETE content. Editors cannot. */
export function canDeleteContent(role: DashboardRole): boolean {
  return role === "owner" || role === "admin";
}

/** Only an owner may manage dashboard memberships/roles. */
export function canManageMembers(role: DashboardRole): boolean {
  return role === "owner";
}

/** Any dashboard role may read and update workflow fields on enquiries. */
export function canHandleEnquiries(role: DashboardRole): boolean {
  return role === "owner" || role === "admin" || role === "editor";
}
