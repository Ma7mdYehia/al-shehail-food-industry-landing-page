"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { DashboardRole } from "@/lib/auth/roles";
import { navForRole, isActiveNav } from "@/lib/auth/dashboard-nav";
import { signOutAction } from "@/lib/auth/dashboard-actions";

const NAV_ID = "dashboard-nav";
const MOBILE_QUERY = "(max-width: 860px)";

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
  const [isMobile, setIsMobile] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const items = navForRole(role);

  // Track viewport so the sidebar is only made inert/modal on mobile. The
  // desktop sidebar is always visible and focusable.
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Leaving mobile width closes the drawer state.
  useEffect(() => {
    if (!isMobile && open) setOpen(false);
  }, [isMobile, open]);

  const close = useCallback(() => {
    setOpen(false);
    // Return focus to the toggle after closing.
    toggleRef.current?.focus();
  }, []);

  // When the mobile drawer opens: focus the first nav link and enable Escape.
  useEffect(() => {
    if (!open || !isMobile) return;
    const first = sidebarRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, isMobile, close]);

  // The closed mobile drawer is genuinely inert (removed from tab order and the
  // a11y tree). When open on mobile, the background (header + main) is inert so
  // focus can't move behind the drawer — a dialog-style focus containment.
  const drawerInert = isMobile && !open;
  const backgroundInert = isMobile && open;
  // Only spread `inert` when active so the attribute is absent (not `false`)
  // otherwise. `inert` removes the subtree from tab order and the a11y tree.
  const inertProp = (v: boolean) => (v ? { inert: true } : {});

  return (
    <div className="dash-shell">
      <button
        type="button"
        className="dash-scrim"
        data-open={open ? "true" : "false"}
        aria-hidden="true"
        tabIndex={-1}
        onClick={close}
      />

      <aside
        id={NAV_ID}
        ref={sidebarRef}
        className="dash-sidebar"
        data-open={open ? "true" : "false"}
        aria-label="Dashboard navigation"
        aria-hidden={drawerInert ? true : undefined}
        {...inertProp(drawerInert)}
      >
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

      <header className="dash-header" {...inertProp(backgroundInert)}>
        <button
          ref={toggleRef}
          type="button"
          className="dash-iconbtn"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-controls={NAV_ID}
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

      <main className="dash-main" id="dashboard-main" {...inertProp(backgroundInert)}>
        {children}
      </main>
    </div>
  );
}
