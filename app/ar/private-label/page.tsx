import type { Metadata } from "next";
import PrivateLabelPage from "@/components/pages/PrivateLabelPage";

export const metadata: Metadata = {
  title: {
    absolute:
      "تصنيع المخبوزات بعلامة خاصة في الإمارات | الشحيل للصناعات الغذائية",
  },
  description:
    "طوّر وصنّع منتجات المخبوزات تحت علامتك مع الشحيل للصناعات الغذائية — من فكرة المنتج وتوجيه الوصفة والعينات والتغليف ومراقبة الجودة إلى التوريد الجاهز للرف.",
  alternates: {
    canonical: "/ar/private-label",
    languages: { en: "/private-label", ar: "/ar/private-label" },
  },
};

export default function Page() {
  return <PrivateLabelPage locale="ar" />;
}
