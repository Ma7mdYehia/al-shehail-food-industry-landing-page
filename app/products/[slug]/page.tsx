import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AssetHint from "@/components/AssetHint";
import ProductIcon from "@/components/ProductIcon";
import { WhatsAppIcon } from "@/components/Icons";
import {
  assets,
  hasAsset,
  getAssetAlt,
  productAssetKeyBySlug,
} from "@/lib/assets";
import {
  products,
  getProductBySlug,
  getProductDetail,
  getRelatedProducts,
  whatsappForProduct,
  recipeDisclaimer,
  privateLabelPoints,
  packagingOptions,
  qualityPoints,
} from "@/lib/products";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  const title = `تصنيع ${product.name} في الإمارات | الشحيل للصناعات الغذائية`;
  const description = `تصنيع ${product.name} بعلامة خاصة في الإمارات، مع تطوير الوصفة، ودعم التغليف، والإنتاج المعتمد، والتوريد الجاهز للرف.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal">
          <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-beige text-gold">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="max-w-2xl">
      <span className="eyebrow">
        <span className="h-px w-6 bg-champagne" />
        {eyebrow}
      </span>
      <h2 className="heading-serif mt-4 text-2xl sm:text-3xl">{title}</h2>
    </div>
  );
}

export default function ProductDetailPage({ params }: Params) {
  const product = getProductBySlug(params.slug);
  const detail = getProductDetail(params.slug);
  if (!product || !detail) notFound();

  const waLink = whatsappForProduct(product.name);
  const related = getRelatedProducts(product.slug, 3);
  const assetKey = productAssetKeyBySlug[product.slug];
  const photoPath = assetKey ? assets.products[assetKey] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    category: product.category,
    description: detail.positioning,
    brand: { "@type": "Brand", name: "Al Shehail Food Industries" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        {/* 1. Product Hero */}
        <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 lg:pt-44 lg:pb-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-warmwhite via-cream to-beige/40" />
            <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />
          </div>
          <div className="container-x">
            {/* Breadcrumb */}
            <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-stone" aria-label="مسار التصفح">
              <Link href="/" className="hover:text-gold">الرئيسية</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-gold">المنتجات</Link>
              <span>/</span>
              <span className="font-medium text-charcoal">{product.name}</span>
            </nav>

            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <span className="inline-flex rounded-full border border-sand bg-warmwhite px-3.5 py-1.5 text-xs font-semibold text-gold">
                  {product.category}
                </span>
                <h1 className="heading-serif mt-5 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                  {product.name}
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone">
                  {detail.positioning}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    اطلب هذا المنتج
                  </a>
                  <Link href="/contact" className="btn-secondary">
                    ناقش خيارات العلامة الخاصة
                  </Link>
                </div>
              </div>

              {/* Product photo */}
              <div className="relative">
                <div className="relative rounded-3xl border border-sand bg-warmwhite p-3 shadow-soft">
                  {hasAsset(photoPath) ? (
                    <div className="relative overflow-hidden rounded-2xl">
                      <Image
                        src={photoPath}
                        alt={getAssetAlt(assetKey!, product.name)}
                        width={720}
                        height={540}
                        priority
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </div>
                  ) : (
                  <div className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-beige via-cream to-sand">
                    <div className="pointer-events-none absolute -end-10 -top-10 h-40 w-40 rounded-full bg-champagne/20 blur-2xl" />
                    <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-warmwhite/80 text-gold shadow-card backdrop-blur">
                      <ProductIcon type={product.iconType} width={38} height={38} />
                    </span>
                    <AssetHint label="صورة المنتج مطلوبة" className="mt-5" />
                  </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Product Overview */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionTitle eyebrow="نظرة عامة" title="فئة تصنيع مبنية لعلامتك" />
            <div className="mt-6 max-w-3xl space-y-4">
              {detail.overview.map((para) => (
                <p key={para} className="text-base leading-relaxed text-stone sm:text-lg">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Use Cases */}
        <section className="section">
          <div className="container-x">
            <SectionTitle eyebrow="حالات الاستخدام" title="أين يُستخدم هذا المنتج" />
            <div className="mt-8">
              <CheckList items={detail.detailUseCases} />
            </div>
          </div>
        </section>

        {/* 4. Custom Recipe Solutions */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionTitle
              eyebrow="حلول وصفة مخصَّصة"
              title="وصفات تُطوَّر لسوقك المستهدف"
            />
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-stone sm:text-lg">
              يمكن للشحيل تطوير وصفات مختلفة بناءً على سوقك المستهدف والغرض من
              المنتج. وبحسب طلب المنتج، يمكن استكشاف التوجهات التالية:
            </p>
            <div className="mt-8 rounded-2xl border border-sand bg-cream p-6 sm:p-8">
              <CheckList items={detail.recipeOptions} />
              <p className="mt-6 border-t border-sand pt-5 text-xs leading-relaxed text-stone">
                {recipeDisclaimer}
              </p>
            </div>
          </div>
        </section>

        {/* 5. Private Label Possibilities */}
        <section className="section">
          <div className="container-x">
            <SectionTitle
              eyebrow="إمكانيات العلامة الخاصة"
              title="مصنَّع تحت علامتك"
            />
            <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
              <CheckList items={privateLabelPoints} />
              <CheckList items={product.privateLabelOptions} />
            </div>
          </div>
        </section>

        {/* 6. Packaging & Formats */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionTitle eyebrow="التغليف والأشكال" title="أشكال مرنة وجاهزة للرف" />
            <div className="mt-8">
              <CheckList items={packagingOptions} />
            </div>
          </div>
        </section>

        {/* 7. Quality Note */}
        <section className="section">
          <div className="container-x">
            <SectionTitle eyebrow="الجودة" title="يُنتَج ضمن ظروف مضبوطة" />
            <div className="mt-8">
              <CheckList items={qualityPoints} />
            </div>
          </div>
        </section>

        {/* 3 (Part). Related products */}
        {related.length > 0 && (
          <section className="section border-t border-sand/60 bg-warmwhite">
            <div className="container-x">
              <SectionTitle eyebrow="منتجات ذات صلة" title="استعرض المزيد من تشكيلتنا" />
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/products/${rel.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-sand bg-cream transition-all duration-300 hover:-translate-y-1 hover:border-champagne hover:shadow-soft"
                  >
                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-beige via-cream to-sand">
                      <span className="absolute start-4 top-4 rounded-full border border-sand bg-warmwhite/80 px-3 py-1 text-[11px] font-semibold text-gold backdrop-blur">
                        {rel.category}
                      </span>
                      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warmwhite/80 text-gold shadow-card backdrop-blur">
                        <ProductIcon type={rel.iconType} width={30} height={30} />
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-serif text-lg font-semibold text-ink">
                        {rel.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-stone">
                        {rel.shortDescription}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                        استعرض المنتج
                        <svg
                          className="rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 8. Final CTA */}
        <section className="section">
          <div className="container-x">
            <div className="relative overflow-hidden rounded-3xl border border-champagne/40 bg-gradient-to-br from-warmwhite via-cream to-beige px-6 py-16 text-center shadow-soft sm:px-12 lg:py-20">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -end-24 -top-24 h-72 w-72 rounded-full bg-champagne/20 blur-3xl" />
                <div className="absolute -bottom-24 -start-20 h-72 w-72 rounded-full bg-sand/40 blur-3xl" />
              </div>
              <div className="relative mx-auto max-w-2xl">
                <span className="eyebrow">
                  <span className="h-px w-6 bg-champagne" />
                  العلامة الخاصة
                </span>
                <h2 className="heading-serif mt-5 text-3xl sm:text-4xl lg:text-[2.75rem]">
                  صنّع هذا المنتج تحت علامتك
                </h2>
                <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
                  تعاون مع الشحيل لتصنيع {product.name} — من تطوير الوصفة
                  والتغليف إلى الإنتاج المعتمد والتوريد الجاهز للرف.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link href="/contact" className="btn-primary">
                    اطلب استشارة تصنيع
                  </Link>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <WhatsAppIcon width={16} height={16} />
                    تواصل عبر واتساب
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
