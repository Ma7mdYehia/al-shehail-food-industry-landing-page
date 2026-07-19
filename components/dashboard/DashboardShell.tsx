"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { DashboardRole } from "@/lib/auth/roles";
import { navForRole, isActiveNav } from "@/lib/auth/dashboard-nav";
import { signOutAction } from "@/lib/auth/dashboard-actions";

// Responsive, keyboard-accessible dashboard chrome. Client component only for
// the mobile-nav toggle and active-route highlighting; all authorization is
// enforced on the server (protected layout + RLS). It receives only the
// non-sensitive member fields it renders.
export function DashboardShell({
  displayName,
  role,
  children,
}: {
  displayName: string;
  role: DashboardRole;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = navForRole(role);

  return (
    <div className="dash-shell">
      <button
        type="button"
        className="dash-scrim"
        data-open={open ? "true" : "false"}
        aria-hidden={!open}
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />

      <aside className="dash-sidebar" data-open={open ? "true" : "false"} aria-label="Dashboard">
        <div className="dash-brand">
          <span className="dash-brand-mark" aria-hidden="true">
            AS
          </span>
          Al Shehail
        </div>
        <nav className="dash-nav" aria-label="Dashboard sections">
          {items.map((item) => {
            const active = isActiveNav(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="dash-nav-link"
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span>{item.label}</span>
                {!item.implemented ? <span className="dash-soon">Soon</span> : null}
              </Link>
            );
          })}
        </nav>
      </aside>

      <header className="dash-header">
        <button
          type="button"
          className="dash-iconbtn"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
        <div className="dash-header-user">
          <span className="dash-user-name">{displayName}</span>
          <span className="dash-role-badge">{role}</span>
          <form action={signOutAction}>
            <button type="submit" className="dash-btn">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="dash-main" id="dashboard-main">
        {children}
      </main>
    </div>
  );
}
