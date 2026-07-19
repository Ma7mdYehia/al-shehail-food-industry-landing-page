import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./dashboard.css";

// Isolated root layout for the entire /dashboard subtree (auth + protected).
// Deliberately separate from the public site's (en)/ and ar/ route-group
// layouts, so the public design, content, navigation, locale, sitemap, robots,
// and SEO are entirely unaffected. Every dashboard/auth page is noindex.
export const metadata: Metadata = {
  title: { default: "Dashboard — Al Shehail", template: "%s — Al Shehail Dashboard" },
  robots: { index: false, follow: false, nocache: true },
};

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className="dash-body">{children}</body>
    </html>
  );
}
