import type { Metadata } from "next";
import ContactPage from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: {
    absolute:
      "تواصل مع الشهيل للصناعات الغذائية | تصنيع مخبوزات بعلامة خاصة في الإمارات",
  },
  description:
    "تواصل مع الشهيل للصناعات الغذائية لمناقشة تصنيع المخبوزات بعلامة خاصة وتطوير المنتجات ودعم التغليف والتوريد الجاهز للرف في الإمارات.",
  alternates: { canonical: "/ar/contact", languages: { en: "/contact", ar: "/ar/contact" } },
};

export default function Page() {
  return <ContactPage locale="ar" />;
}
