import type { Metadata } from "next";
import ServicePage from "@/components/pages/ServicePage";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: { absolute: services["brand-design"].metaTitle.en },
  description: services["brand-design"].metaDescription.en,
  alternates: {
    canonical: "/services/brand-design",
    languages: { en: "/services/brand-design", ar: "/ar/services/brand-design" },
  },
};

export default function Page() {
  return <ServicePage slug="brand-design" locale="en" />;
}
