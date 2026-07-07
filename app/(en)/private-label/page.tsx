import type { Metadata } from "next";
import PrivateLabelPage from "@/components/pages/PrivateLabelPage";

export const metadata: Metadata = {
  title: {
    absolute:
      "Private Label Bakery Manufacturing UAE | Al Shehail Food Industries",
  },
  description:
    "Develop and manufacture bakery products under your brand with Al Shehail Food Industries — from product idea, recipe direction, sampling, packaging, quality control, and retail-ready supply.",
  alternates: {
    canonical: "/private-label",
    languages: { en: "/private-label", ar: "/ar/private-label" },
  },
};

export default function Page() {
  return <PrivateLabelPage locale="en" />;
}
