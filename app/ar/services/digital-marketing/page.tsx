import type { Metadata } from "next";
import ServicePage from "@/components/pages/ServicePage";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: { absolute: services["digital-marketing"].metaTitle.ar },
  description: services["digital-marketing"].metaDescription.ar,
  alternates: {
    canonical: "/ar/services/digital-marketing",
    languages: {
      en: "/services/digital-marketing",
      ar: "/ar/services/digital-marketing",
    },
  },
};

export default function Page() {
  return <ServicePage slug="digital-marketing" locale="ar" />;
}
