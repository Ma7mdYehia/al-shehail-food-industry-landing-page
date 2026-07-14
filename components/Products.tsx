"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import HomeProductCard from "./home/HomeProductCard";
import { featuredProducts, productCategories, products } from "@/lib/products/catalog";
import { ui } from "@/lib/dictionary";
import { localeHref, type Locale } from "@/lib/i18n";

// Homepage "What We Manufacture" teaser — filtered views stay concise and capped
// at six products. The full catalog lives on /products.
const HOME_MAX = 6;

export default function Products({ locale }: { locale: Locale }) {
  const [active, setActive] = useState("featured");
  const t = ui[locale].home.products;

  const filters = [
    { label: t.featured, slug: "featured" },
    ...productCategories.map((category) => ({
      label: category.name[locale],
      slug: category.slug,
    })),
  ];

  const visible = (
    active === "featured"
      ? featuredProducts
      : products.filter((product) => product.categorySlug === active)
  ).slice(0, HOME_MAX);

  return (
    <section id="products" className="section relative overflow-hidden bg-cream">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="bg-grain absolute inset-0 opacity-40" />
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-champagne/10 blur-3xl" />
        <div className="absolute -left-24 bottom-24 h-80 w-80 rounded-full bg-sand/25 blur-3xl" />
      </div>
      <div className="container-x relative">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {filters.map((filter) => {
            const isActive = active === filter.slug;

            return (
              <button
                key={filter.slug}
                type="button"
                onClick={() => setActive(filter.slug)}
                aria-pressed={isActive}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "border border-champagne bg-gold-gradient text-white shadow-card"
                    : "glass-chip text-charcoal hover:text-gold"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <HomeProductCard key={product.slug} product={product} locale={locale} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href={localeHref("/products", locale)} className="btn-secondary">
            {t.viewCatalog}
          </Link>
        </div>
      </div>
    </section>
  );
}
