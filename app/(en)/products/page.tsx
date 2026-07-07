import type { Metadata } from "next";
import ProductsPage from "@/components/pages/ProductsPage";

export const metadata: Metadata = {
  title: { absolute: "Bakery Products | Al Shehail Food Industries UAE" },
  description:
    "Explore Al Shehail Food Industries’ bakery manufacturing range including flatbread & wraps, soft bread, pastry, and date sweets for private label and retail supply.",
  alternates: { canonical: "/products", languages: { en: "/products", ar: "/ar/products" } },
};

export default function Page() {
  return <ProductsPage locale="en" />;
}
