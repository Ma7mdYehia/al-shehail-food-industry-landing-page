import type { Metadata } from "next";
import ServicePage from "@/components/pages/ServicePage";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: { absolute: services.distribution.metaTitle.ar },
  description: services.distribution.metaDescription.ar,
  alternates: {
    canonical: "/ar/services/distribution",
    languages: { en: "/services/distribution", ar: "/ar/services/distribution" },
  },
};

export default function Page() {
  return <ServicePage slug="distribution" locale="ar" />;
}
