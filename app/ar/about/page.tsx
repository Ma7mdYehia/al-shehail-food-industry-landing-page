import type { Metadata } from "next";
import AboutPage from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: { absolute: "عن الشحيل للصناعات الغذائية | تصنيع مخبوزات في الإمارات" },
  description:
    "تعرّف على الشحيل للصناعات الغذائية، شريك تصنيع مخبوزات وعلامات خاصة مقره الإمارات يدعم تطوير المنتجات والإنتاج المعتمد وتوريد المخبوزات المهيأة للرف.",
  alternates: { canonical: "/ar/about", languages: { en: "/about", ar: "/ar/about" } },
};

export default function Page() {
  return <AboutPage locale="ar" />;
}
