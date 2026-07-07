import type { Metadata } from "next";
import AboutPage from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: { absolute: "About Al Shehail Food Industries | Bakery Manufacturing UAE" },
  description:
    "Learn about Al Shehail Food Industries, a UAE-based bakery manufacturing and private label partner supporting product development, certified production, and retail-ready bakery supply.",
  alternates: { canonical: "/about", languages: { en: "/about", ar: "/ar/about" } },
};

export default function Page() {
  return <AboutPage locale="en" />;
}
