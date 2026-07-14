import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AssetHint from "@/components/AssetHint";
import ProductIcon from "@/components/ProductIcon";
import ProductCard from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/Icons";
import {
  assets,
  hasAsset,
  getAssetAlt,
  productAssetKeyBySlug,
} from "@/lib/assets";
import { getProductBySlug, getRelatedProducts } from "@/lib/products/catalog";
import {
  getProductDetail,
  whatsappForProduct,
  recipeDisclaimer,
  privateLabelPoints,
  packagingOptions,
  qualityPoints,
} from "@/lib/products/details";
import { localeHref, type Locale } from "@/lib/i18n";
import { generatedProductHeaders } from "@/lib/generatedAssets";
import BackgroundVideo from "@/components/BackgroundVideo";
import { ctaMedia } from "@/lib/ctaMedia";

const L = {
  en: {
    home: "Home",
    products: "Products",
    requestThis: "Request This Product",
    discussOptions: "Discuss Private Label Options",
    overviewEyebrow: "Overview",
    overviewTitle: "A manufacturing category, built for your brand",
    useCasesEyebrow: "Use Cases",
    useCasesTitle: "Where this product fits",
    recipeEyebrow: "Custom Recipe Solutions",
    recipeTitle: "Recipes developed to your target market",
    recipeIntro:
      "Al Shehail can develop different recipes based on your target market and the purpose of the product. Depending on the product brief, the following directions can be explored:",
    plEyebrow: "Private Label Possibilities",
    plTitle: "Manufactured under your brand",
    packagingEyebrow: "Packaging & Formats",
    packagingTitle: "Flexible, retail-ready formats",
    qualityEyebrow: "Quality",
    qualityTitle: "Produced under controlled conditions",
    relatedEyebrow: "Related Products",
    relatedTitle: "Explore more of our range",
    viewProduct: "View Product",
    photoNeeded: "Product photo needed",
    ctaEyebrow: "Private Label",
    ctaTitle: "Build This Product Under Your Brand",
    requestConsult: "Request Manufacturing Consultation",
    whatsappUs: "WhatsApp Us",
    ctaText: (name: string) =>
      `Partner with Al Shehail for ${name.toLowerCase()} — from recipe development and packaging to certified production and retail-ready supply.`,
    breadcrumbAria: "Breadcrumb",
  },
  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    requestThis: "اطلب هذا المنتج",
    discussOptions: "ناقش خيارات العلامة الخاصة",
    overviewEyebrow: "نظرة عامة",
    overviewTitle: "فئة تصنيع، مبنية لعلامتك",
    useCasesEyebrow: "حالات الاستخدام",
    useCasesTitle: "أين يناسب هذا المنتج",
    recipeEyebrow: "حلول وصفات مخصّصة",
    recipeTitle: "وصفات مطوَّرة لسوقك المستهدف",
    recipeIntro:
      "يمكن للشحيل تطوير وصفات مختلفة بحسب سوقك المستهدف والغرض من المنتج. وبحسب موجز المنتج، يمكن استكشاف التوجهات التالية:",
    plEyebrow: "إمكانات العلامة الخاصة",
    plTitle: "مُصنَّع تحت علامتك",
    packagingEyebrow: "التغليف والأشكال",
    packagingTitle: "أشكال مرنة مهيأة للرف",
    qualityEyebrow: "الجودة",
    qualityTitle: "مُنتَج تحت ظروف محكومة",
    relatedEyebrow: "منتجات ذات صلة",
    relatedTitle: "استكشف المزيد من تشكيلتنا",
    viewProduct: "عرض المنتج",
    photoNeeded: "صورة المنتج مطلوبة",
    ctaEyebrow: "العلامة الخاصة",
    ctaTitle: "ابنِ هذا المنتج تحت علامتك",
    requestConsult: "اطلب استشارة تصنيع",
    whatsappUs: "راسلنا على واتساب",
    ctaText: (name: string) =>
      `اعمل مع الشهيل على ${name} — من تطوير الوصفة والتغليف إلى الإنتاج المعتمد والتوريد الجاهز للرف.`,
    breadcrumbAria: "مسار التنقل",
  },
} as const;

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

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
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

export default function ProductDetailPage({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const product = getProductBySlug(slug);
  const detail = getProductDetail(slug);
  if (!product || !detail) notFound();

  const t = L[locale];
  const name = product.name[locale];
  const waLink = whatsappForProduct(name, locale);
  const related = getRelatedProducts(product.slug, 3);
  const assetKey = productAssetKeyBySlug[product.slug];
  const photoPath = assetKey ? assets.products[assetKey] : null;
  const headerImage = generatedProductHeaders[product.slug];
  const ctaVideo =
    product.categorySlug === "soft-bread" || product.categorySlug === "sweets"
      ? ctaMedia.quality
      : ctaMedia.ideaToShelf;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    category: product.category[locale],
    description: detail.positioning[locale],
    inLanguage: locale,
    brand: { "@type": "Brand", name: "Al Shehail Food Industries" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header locale={locale} />
      <main>
        {/* 1. Product Hero */}
        <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 lg:pt-44 lg:pb-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            {headerImage && (
              <Image
                src={headerImage}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
                aria-hidden
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-warmwhite/95 via-cream/88 to-cream/50 rtl:bg-gradient-to-l" />
            <div className="absolute inset-0 bg-gradient-to-b from-warmwhite/35 via-transparent to-beige/45" />
            <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />
          </div>
          <div className="container-x">
            {/* Breadcrumb */}
            <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-stone" aria-label={t.breadcrumbAria}>
              <Link href={localeHref("/", locale)} className="hover:text-gold">{t.home}</Link>
              <span>/</span>
              <Link href={localeHref("/products", locale)} className="hover:text-gold">{t.products}</Link>
              <span>/</span>
              <span className="font-medium text-charcoal">{name}</span>
            </nav>

            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <span className="inline-flex rounded-full border border-sand bg-warmwhite px-3.5 py-1.5 text-xs font-semibold text-gold">
                  {product.category[locale]}
                </span>
                <h1 className="heading-serif mt-5 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                  {name}
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone">
                  {detail.positioning[locale]}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    {t.requestThis}
                  </a>
                  <Link href={localeHref("/contact", locale)} className="btn-secondary">
                    {t.discussOptions}
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
                        alt={getAssetAlt(assetKey!, name)}
                        width={720}
                        height={540}
                        priority
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-beige via-cream to-sand">
                      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-champagne/20 blur-2xl" />
                      <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-warmwhite/80 text-gold shadow-card backdrop-blur">
                        <ProductIcon type={product.iconType} width={38} height={38} />
                      </span>
                      <AssetHint label={t.photoNeeded} className="mt-5" />
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
            <SectionTitle eyebrow={t.overviewEyebrow} title={t.overviewTitle} />
            <div className="mt-6 max-w-3xl space-y-4">
              {detail.overview.map((para) => (
                <p key={para.en} className="text-base leading-relaxed text-stone sm:text-lg">
                  {para[locale]}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Use Cases */}
        <section className="section">
          <div className="container-x">
            <SectionTitle eyebrow={t.useCasesEyebrow} title={t.useCasesTitle} />
            <div className="mt-8">
              <CheckList items={detail.detailUseCases.map((x) => x[locale])} />
            </div>
          </div>
        </section>

        {/* 4. Custom Recipe Solutions */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionTitle eyebrow={t.recipeEyebrow} title={t.recipeTitle} />
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-stone sm:text-lg">
              {t.recipeIntro}
            </p>
            <div className="mt-8 rounded-2xl border border-sand bg-cream p-6 sm:p-8">
              <CheckList items={detail.recipeOptions.map((x) => x[locale])} />
              <p className="mt-6 border-t border-sand pt-5 text-xs leading-relaxed text-stone">
                {recipeDisclaimer[locale]}
              </p>
            </div>
          </div>
        </section>

        {/* 5. Private Label Possibilities */}
        <section className="section">
          <div className="container-x">
            <SectionTitle eyebrow={t.plEyebrow} title={t.plTitle} />
            <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
              <CheckList items={privateLabelPoints.map((x) => x[locale])} />
              <CheckList items={product.privateLabelOptions.map((x) => x[locale])} />
            </div>
          </div>
        </section>

        {/* 6. Packaging & Formats */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionTitle eyebrow={t.packagingEyebrow} title={t.packagingTitle} />
            <div className="mt-8">
              <CheckList items={packagingOptions.map((x) => x[locale])} />
            </div>
          </div>
        </section>

        {/* 7. Quality Note */}
        <section className="section">
          <div className="container-x">
            <SectionTitle eyebrow={t.qualityEyebrow} title={t.qualityTitle} />
            <div className="mt-8">
              <CheckList items={qualityPoints.map((x) => x[locale])} />
            </div>
          </div>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section className="section border-t border-sand/60 bg-warmwhite">
            <div className="container-x">
              <SectionTitle eyebrow={t.relatedEyebrow} title={t.relatedTitle} />
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rel) => (
                  <ProductCard
                    key={rel.slug}
                    product={rel}
                    locale={locale}
                    showUseCases={false}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 8. Final CTA */}
        <section className="section">
          <div className="container-x">
            <div className="relative overflow-hidden rounded-3xl border border-champagne/40 bg-gradient-to-br from-warmwhite via-cream to-beige px-6 py-16 text-center shadow-soft sm:px-12 lg:py-20">
              <BackgroundVideo
                src={ctaVideo.video}
                poster={ctaVideo.poster}
                className="opacity-55"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-warmwhite/80 via-cream/65 to-beige/55"
                aria-hidden
              />
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-champagne/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-sand/40 blur-3xl" />
              </div>
              <div className="relative mx-auto max-w-2xl">
                <span className="eyebrow">
                  <span className="h-px w-6 bg-champagne" />
                  {t.ctaEyebrow}
                </span>
                <h2 className="heading-serif mt-5 text-3xl sm:text-4xl lg:text-[2.75rem]">
                  {t.ctaTitle}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
                  {t.ctaText(name)}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link href={localeHref("/contact", locale)} className="btn-primary">
                    {t.requestConsult}
                  </Link>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    <WhatsAppIcon width={16} height={16} />
                    {t.whatsappUs}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
