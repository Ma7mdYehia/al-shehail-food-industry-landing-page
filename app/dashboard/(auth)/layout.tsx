import type { ReactNode } from "react";

// Centered wrapper for the unauthenticated auth pages (login, forgot/update
// password, forbidden). No app shell and no membership guard here — these pages
// must be reachable while signed out.
export default function DashboardAuthLayout({ children }: { children: ReactNode }) {
  return <main className="dash-auth-wrap">{children}</main>;
}
