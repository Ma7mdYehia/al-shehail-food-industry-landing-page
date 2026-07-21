// Dashboard navigation model (pure, no server imports — safe for client + tests).
// Role-aware: owner-only items are hidden for admin/editor. `implemented` marks
// which modules have real functionality in P04 (only the overview); the rest
// render "Coming next" placeholders.

import type { DashboardRole } from "@/lib/auth/roles";

export type DashboardNavItem = {
  label: string;
  href: string;
  implemented: boolean;
  ownerOnly?: boolean;
};

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard", implemented: true },
  { label: "Products", href: "/dashboard/products", implemented: false },
  { label: "Services", href: "/dashboard/services", implemented: false },
  { label: "Partners", href: "/dashboard/partners", implemented: false },
  { label: "Media", href: "/dashboard/media", implemented: false },
  { label: "Enquiries", href: "/dashboard/enquiries", implemented: false },
  { label: "Team", href: "/dashboard/team", implemented: false, ownerOnly: true },
  { label: "Settings", href: "/dashboard/settings", implemented: false },
];

/** Nav items visible to a given role. Team (owner-only) is hidden for others. */
export function navForRole(role: DashboardRole): DashboardNavItem[] {
  return DASHBOARD_NAV.filter((item) => !item.ownerOnly || role === "owner");
}

/** True when the given path is the active nav entry (exact for the overview,
 * prefix for section routes). */
export function isActiveNav(itemHref: string, pathname: string): boolean {
  const norm = (p: string) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);
  const href = norm(itemHref);
  const current = norm(pathname);
  if (href === "/dashboard") return current === "/dashboard";
  return current === href || current.startsWith(href + "/");
}
