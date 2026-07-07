import type { Metadata } from "next";
import ProductDetailPage from "@/components/pages/ProductDetailPage";
import { products, getProductBySlug } from "@/lib/products/catalog";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  const name = product.name.en;
  const title = `${name} Manufacturing UAE | Al Shehail Food Industries`;
  const description = `Private label ${name} manufacturing in the UAE with recipe development, packaging support, certified production, and retail-ready supply.`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/products/${product.slug}`,
      languages: {
        en: `/products/${product.slug}`,
        ar: `/ar/products/${product.slug}`,
      },
    },
    openGraph: { title, description, type: "website" },
  };
}

export default function Page({ params }: Params) {
  return <ProductDetailPage slug={params.slug} locale="en" />;
}
