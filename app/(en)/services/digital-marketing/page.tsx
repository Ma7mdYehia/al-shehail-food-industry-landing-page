import type { Metadata } from "next";
import ServicePage from "@/components/pages/ServicePage";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: { absolute: services["digital-marketing"].metaTitle.en },
  description: services["digital-marketing"].metaDescription.en,
  alternates: {
    canonical: "/services/digital-marketing",
    languages: {
      en: "/services/digital-marketing",
      ar: "/ar/services/digital-marketing",
    },
  },
};

export default function Page() {
  return <ServicePage slug="digital-marketing" locale="en" />;
}
