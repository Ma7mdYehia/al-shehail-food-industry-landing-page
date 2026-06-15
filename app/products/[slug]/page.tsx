import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AssetHint from "@/components/AssetHint";
import ProductIcon from "@/components/ProductIcon";
import { WhatsAppIcon } from "@/components/Icons";
import { assets, hasAsset, getAssetAlt } from "@/lib/assets";
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
  const title = `${product.name} Manufacturing UAE | Al Shehail Food Industries`;
  const description = `Private label ${product.name} manufacturing in the UAE with recipe development, packaging support, certified production, and retail-ready supply.`;
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

const productAssetKeys: Record<string, keyof typeof assets.products> = {
  "arabic-bread":   "arabicBread",
  "bread-wraps":    "breadWraps",
  "toast":          "toast",
  "burger-buns":    "burgerBuns",
  "bread-rolls":    "breadRolls",
  "croissant":      "croissant",
  "mini-croissant": "miniCroissant",
  "pate":           "pate",
  "maamoul":        "maamoul",
  "tamriya":        "tamriya",
};

export default function ProductDetailPage({ params }: Params) {
  const product = getProductBySlug(params.slug);
  const detail = getProductDetail(params.slug);
  if (!product || !detail) notFound();

  const waLink = whatsappForProduct(product.name);
  const related = getRelatedProducts(product.slug, 3);
  const assetKey = productAssetKeys[product.slug];
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
            <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-stone" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-gold">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-gold">Products</Link>
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
                    Request This Product
                  </a>
                  <Link href="/contact" className="btn-secondary">
                    Discuss Private Label Options
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
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-champagne/20 blur-2xl" />
                    <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-warmwhite/80 text-gold shadow-card backdrop-blur">
                      <ProductIcon type={product.iconType} width={38} height={38} />
                    </span>
                    <AssetHint label="Product photo needed" className="mt-5" />
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
            <SectionTitle eyebrow="Overview" title="A manufacturing category, built for your brand" />
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
            <SectionTitle eyebrow="Use Cases" title="Where this product fits" />
            <div className="mt-8">
              <CheckList items={detail.detailUseCases} />
            </div>
          </div>
        </section>

        {/* 4. Custom Recipe Solutions */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionTitle
              eyebrow="Custom Recipe Solutions"
              title="Recipes developed to your target market"
            />
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-stone sm:text-lg">
              Al Shehail can develop different recipes based on your target
              market and the purpose of the product. Depending on the product
              brief, the following directions can be explored:
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
              eyebrow="Private Label Possibilities"
              title="Manufactured under your brand"
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
            <SectionTitle eyebrow="Packaging & Formats" title="Flexible, retail-ready formats" />
            <div className="mt-8">
              <CheckList items={packagingOptions} />
            </div>
          </div>
        </section>

        {/* 7. Quality Note */}
        <section className="section">
          <div className="container-x">
            <SectionTitle eyebrow="Quality" title="Produced under controlled conditions" />
            <div className="mt-8">
              <CheckList items={qualityPoints} />
            </div>
          </div>
        </section>

        {/* 3 (Part). Related products */}
        {related.length > 0 && (
          <section className="section border-t border-sand/60 bg-warmwhite">
            <div className="container-x">
              <SectionTitle eyebrow="Related Products" title="Explore more of our range" />
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/products/${rel.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-sand bg-cream transition-all duration-300 hover:-translate-y-1 hover:border-champagne hover:shadow-soft"
                  >
                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-beige via-cream to-sand">
                      <span className="absolute left-4 top-4 rounded-full border border-sand bg-warmwhite/80 px-3 py-1 text-[11px] font-semibold text-gold backdrop-blur">
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
                        View Product
                        <svg
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
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
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-champagne/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-sand/40 blur-3xl" />
              </div>
              <div className="relative mx-auto max-w-2xl">
                <span className="eyebrow">
                  <span className="h-px w-6 bg-champagne" />
                  Private Label
                </span>
                <h2 className="heading-serif mt-5 text-3xl sm:text-4xl lg:text-[2.75rem]">
                  Build This Product Under Your Brand
                </h2>
                <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
                  Partner with Al Shehail for {product.name.toLowerCase()} —
                  from recipe development and packaging to certified production
                  and retail-ready supply.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link href="/contact" className="btn-primary">
                    Request Manufacturing Consultation
                  </Link>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <WhatsAppIcon width={16} height={16} />
                    WhatsApp Us
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
