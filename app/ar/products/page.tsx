import type { Metadata } from "next";
import ProductsPage from "@/components/pages/ProductsPage";

export const metadata: Metadata = {
  title: { absolute: "منتجات المخبوزات | الشحيل للصناعات الغذائية" },
  description:
    "استكشف تشكيلة تصنيع المخبوزات لدى الشحيل للصناعات الغذائية بما فيها الخبز المسطّح واللفائف والخبز الطري والمعجنات وحلويات التمر للعلامة الخاصة وتوريد التجزئة.",
  alternates: { canonical: "/ar/products", languages: { en: "/products", ar: "/ar/products" } },
};

export default function Page() {
  return <ProductsPage locale="ar" />;
}
