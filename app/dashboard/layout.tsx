import type { Metadata } from "next";
import type { ReactNode } from "react";

// Isolated root layout for the future dashboard. Deliberately separate from the
// public site's (en)/ and ar/ route-group layouts so the public design,
// content, navigation, and locale behavior are entirely unaffected. Not indexed.
export const metadata: Metadata = {
  title: "Dashboard — Al Shehail",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
