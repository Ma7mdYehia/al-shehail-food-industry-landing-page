import type { Metadata } from "next";
import PartnersPage from "@/components/pages/PartnersPage";

export const metadata: Metadata = {
  title: { absolute: "Partners & Market Presence | Al Shehail Food Industries UAE" },
  description:
    "See Al Shehail Food Industries’ manufacturing partners and market presence across leading UAE retail chains, supporting bakery brands with private label and retail-ready production.",
  alternates: { canonical: "/partners", languages: { en: "/partners", ar: "/ar/partners" } },
};

export default function Page() {
  return <PartnersPage locale="en" />;
}
