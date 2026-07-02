"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import HomeProductCard from "./home/HomeProductCard";
import { featuredProducts, productCategories, products } from "@/lib/products";

// Homepage "What We Manufacture" teaser — filtered views stay concise and capped
// at six products. The full catalog lives on /products.
const HOME_MAX = 6;

const filters = [
  { label: "Featured", slug: "featured" },
  ...productCategories.map((category) => ({
    label: category.name,
    slug: category.slug,
  })),
];

export default function Products() {
  const [active, setActive] = useState("featured");

  const visible = (
    active === "featured"
      ? featuredProducts
      : products.filter((product) => product.categorySlug === active)
  ).slice(0, HOME_MAX);

  return (
    <section id="products" className="section relative overflow-hidden bg-warmwhite">
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="What We Manufacture"
          title="A complete bakery product range"
          description="A featured selection from our range — flatbread and wraps, soft bread, pastry, and sweets — manufactured to consistent, retail-ready quality."
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
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "border-champagne bg-gold-gradient text-white shadow-card"
                    : "border-sand bg-cream text-charcoal hover:border-champagne hover:bg-beige"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <HomeProductCard key={product.slug} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/products" className="btn-secondary">
            View Full Product Catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
