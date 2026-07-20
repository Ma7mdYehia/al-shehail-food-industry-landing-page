"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { DashboardRole } from "@/lib/auth/roles";
import { navForRole, isActiveNav } from "@/lib/auth/dashboard-nav";
import { signOutAction } from "@/lib/auth/dashboard-actions";
import { createDrawerController, type DrawerController } from "@/lib/auth/drawer-controller";

const NAV_ID = "dashboard-nav";
const MOBILE_QUERY = "(max-width: 860px)";

// Responsive, keyboard-accessible dashboard chrome. The a11y-critical mobile
// drawer behavior (inert, Escape, focus restoration) lives in a framework-
// agnostic controller (lib/auth/drawer-controller.ts) that is covered by a real
// browser test; this component is a thin adapter that wires refs to it. All
// authorization is enforced on the server (protected layout + RLS).
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
  const items = navForRole(role);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const scrimRef = useRef<HTMLButtonElement>(null);
  const controllerRef = useRef<DrawerController | null>(null);

  useEffect(() => {
    if (!toggleRef.current || !closeRef.current || !sidebarRef.current || !headerRef.current || !mainRef.current) {
      return;
    }
    const mql = window.matchMedia(MOBILE_QUERY);
    const controller = createDrawerController(
      {
        drawer: sidebarRef.current,
        toggle: toggleRef.current,
        closeButton: closeRef.current,
        background: [headerRef.current, mainRef.current],
      },
      { isMobile: mql.matches }
    );
    controllerRef.current = controller;

    const onMedia = () => controller.setMobile(mql.matches);
    mql.addEventListener("change", onMedia);
    const scrim = scrimRef.current;
    const onScrim = () => controller.close();
    scrim?.addEventListener("click", onScrim);

    return () => {
      mql.removeEventListener("change", onMedia);
      scrim?.removeEventListener("click", onScrim);
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  return (
    <div className="dash-shell">
      {/* Controller owns aria-expanded / inert / data-open on the elements below;
          they are intentionally NOT declared in JSX so React re-renders (e.g. on
          route change) cannot clobber the controller's state. */}
      <button
        ref={scrimRef}
        type="button"
        className="dash-scrim"
        aria-hidden="true"
        tabIndex={-1}
      />

      <aside id={NAV_ID} ref={sidebarRef} className="dash-sidebar" aria-label="Dashboard navigation">
        <div className="dash-sidebar-top">
          <div className="dash-brand">
            <span className="dash-brand-mark" aria-hidden="true">
              AS
            </span>
            Al Shehail
          </div>
          <button ref={closeRef} type="button" className="dash-iconbtn dash-drawer-close" aria-label="Close navigation">
            ✕
          </button>
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
                onClick={() => controllerRef.current?.close()}
              >
                <span>{item.label}</span>
                {!item.implemented ? <span className="dash-soon">Soon</span> : null}
              </Link>
            );
          })}
        </nav>
      </aside>

      <header className="dash-header" ref={headerRef}>
        <button
          ref={toggleRef}
          type="button"
          className="dash-iconbtn"
          aria-label="Open navigation"
          aria-controls={NAV_ID}
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

      <main className="dash-main" id="dashboard-main" ref={mainRef}>
        {children}
      </main>
    </div>
  );
}
