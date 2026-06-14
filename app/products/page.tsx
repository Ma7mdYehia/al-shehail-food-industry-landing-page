import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AssetHint from "@/components/AssetHint";
import ProductIcon from "@/components/ProductIcon";
import { productsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: { absolute: "Bakery Products | Al Shehail Food Industries UAE" },
  description:
    "Explore Al Shehail Food Industries’ bakery manufacturing range including Arabic bread, wraps, toast, burger buns, croissants, pate, maamoul, and tamriya for private label and retail supply.",
  alternates: { canonical: "/products" },
};

function ArrowRight() {
  return (
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
  );
}

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero */}
        <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 lg:pt-44 lg:pb-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-warmwhite via-cream to-beige/40" />
            <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />
          </div>
          <div className="container-x">
            <div className="max-w-3xl">
              <span className="eyebrow">
                <span className="h-px w-6 bg-champagne" />
                Our Manufacturing Range
              </span>
              <h1 className="heading-serif mt-6 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                Bakery Product Categories
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-stone">
                Explore Al Shehail’s bakery manufacturing range across flat
                bread, soft bread, French bakery, and date sweets — developed
                for private label, retail, and institutional supply.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Category overview */}
        <section className="section pt-4 sm:pt-6 lg:pt-8">
          <div className="container-x">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {productsByCategory.map(({ category, items }) => (
                <div
                  key={category.slug}
                  className="flex flex-col rounded-2xl border border-sand bg-warmwhite p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-champagne hover:shadow-soft"
                >
                  <h2 className="font-serif text-xl font-semibold text-ink">
                    {category.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    {category.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {items.map((p) => (
                      <li
                        key={p.slug}
                        className="rounded-full border border-sand bg-cream px-3 py-1 text-xs font-medium text-charcoal"
                      >
                        {p.name}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`#${category.slug}`}
                    className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
                  >
                    View {category.name}
                    <ArrowRight />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Product catalog grouped by category */}
        {productsByCategory.map(({ category, items }) => (
          <section
            key={category.slug}
            id={category.slug}
            className="section scroll-mt-24 border-t border-sand/60 bg-warmwhite first:border-t-0"
          >
            <div className="container-x">
              <div className="max-w-2xl">
                <span className="eyebrow">
                  <span className="h-px w-6 bg-champagne" />
                  {category.name}
                </span>
                <h2 className="heading-serif mt-4 text-3xl sm:text-4xl">
                  {category.name}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-stone sm:text-lg">
                  {category.description}
                </p>
              </div>

              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/products/${product.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-sand bg-cream transition-all duration-300 hover:-translate-y-1 hover:border-champagne hover:shadow-soft"
                  >
                    {/* Product photo placeholder */}
                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-beige via-cream to-sand">
                      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-champagne/15 blur-2xl" />
                      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warmwhite/80 text-gold shadow-card backdrop-blur">
                        <ProductIcon
                          type={product.iconType}
                          width={30}
                          height={30}
                        />
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-serif text-lg font-semibold text-ink">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-stone">
                        {product.shortDescription}
                      </p>

                      {/* Use case highlights */}
                      <ul className="mt-4 space-y-1.5">
                        {product.useCases.map((use) => (
                          <li
                            key={use}
                            className="flex items-center gap-2 text-xs text-charcoal"
                          >
                            <span className="h-1.5 w-1.5 flex-none rounded-full bg-champagne" />
                            {use}
                          </li>
                        ))}
                      </ul>

                      <AssetHint
                        label={`${product.imagePlaceholderLabel} needed`}
                        className="mt-4"
                      />
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                        View Product
                        <ArrowRight />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* 4. CTA */}
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
                  Need a Custom Bakery Product?
                </h2>
                <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
                  Al Shehail can support product development, recipe
                  customization, private label manufacturing, packaging, and
                  retail-ready supply.
                </p>
                <div className="mt-8">
                  <Link href="/contact" className="btn-primary">
                    Start a Private Label Project
                  </Link>
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
