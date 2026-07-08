import type { Metadata } from "next";
import PartnersPage from "@/components/pages/PartnersPage";

export const metadata: Metadata = {
  title: { absolute: "الشركاء والحضور في السوق | الشهيل للصناعات الغذائية" },
  description:
    "تعرّف على شركاء التصنيع لدى الشهيل للصناعات الغذائية وحضورها عبر كبرى سلاسل التجزئة في الإمارات، بدعم العلامات الغذائية بالتصنيع بعلامة خاصة والإنتاج المهيأ للرف.",
  alternates: { canonical: "/ar/partners", languages: { en: "/partners", ar: "/ar/partners" } },
};

export default function Page() {
  return <PartnersPage locale="ar" />;
}
