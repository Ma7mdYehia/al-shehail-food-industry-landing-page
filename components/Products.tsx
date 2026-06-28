"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import ProductCard from "./ProductCard";
import { productCategories, products, featuredProducts } from "@/lib/products";

const filters = [
  { label: "Featured", slug: "featured" },
  ...productCategories.map((c) => ({ label: c.name, slug: c.slug })),
];

export default function Products() {
  const [active, setActive] = useState("featured");

  const visible =
    active === "featured"
      ? featuredProducts
      : products.filter((p) => p.categorySlug === active);

  return (
    <section id="products" className="section relative overflow-hidden bg-warmwhite">
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="What We Manufacture"
          title="A complete bakery product range"
          description="From flat bread and soft bread to French bakery and date sweets — manufactured to consistent, retail-ready quality."
        />

        {/* Category filter */}
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {filters.map((f) => {
            const isActive = active === f.slug;
            return (
              <button
                key={f.slug}
                type="button"
                onClick={() => setActive(f.slug)}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "border-champagne bg-gold-gradient text-white shadow-card"
                    : "border-sand bg-cream text-charcoal hover:border-champagne hover:bg-beige"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.slug} product={product} />
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
