import type { Metadata } from "next";
import ContactPage from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: {
    absolute:
      "Contact Al Shehail Food Industries | Private Label Bakery Manufacturing UAE",
  },
  description:
    "Contact Al Shehail Food Industries to discuss private label bakery manufacturing, product development, packaging support, and retail-ready supply in the UAE.",
  alternates: { canonical: "/contact", languages: { en: "/contact", ar: "/ar/contact" } },
};

export default function Page() {
  return <ContactPage locale="en" />;
}
