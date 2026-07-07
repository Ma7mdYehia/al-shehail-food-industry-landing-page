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
  const name = product.name.ar;
  const title = `تصنيع ${name} في الإمارات | الشحيل للصناعات الغذائية`;
  const description = `تصنيع ${name} بعلامة خاصة في الإمارات مع تطوير الوصفة ودعم التغليف والإنتاج المعتمد والتوريد الجاهز للرف.`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/ar/products/${product.slug}`,
      languages: {
        en: `/products/${product.slug}`,
        ar: `/ar/products/${product.slug}`,
      },
    },
    openGraph: { title, description, type: "website", locale: "ar_AE" },
  };
}

export default function Page({ params }: Params) {
  return <ProductDetailPage slug={params.slug} locale="ar" />;
}
