"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import HomeProductCard from "./home/HomeProductCard";
import { products } from "@/lib/products";

// Homepage-only teaser filter — an underline tab strip, intentionally distinct
// from the /products catalog's rounded family pills. Featured-first, capped at
// six products. The full catalog lives on /products.
const HOME_TABS = [
  { label: "Featured", slug: "featured" },
  { label: "Flat Bread", slug: "flatbread-wraps" },
  { label: "Soft Bread", slug: "soft-bread" },
  { label: "Pastry", slug: "pastry" },
  { label: "Sweets", slug: "sweets" },
];

const HOME_MAX = 6;

export default function Products() {
  const [active, setActive] = useState("featured");

  const visible = (
    active === "featured"
      ? products.filter((p) => p.featured)
      : products.filter((p) => p.categorySlug === active)
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

        {/* Homepage teaser filter — underline tabs */}
        <div
          className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-2 border-b border-sand"
          role="group"
          aria-label="Filter featured products"
        >
          {HOME_TABS.map((tab) => {
            const isActive = active === tab.slug;
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => setActive(tab.slug)}
                aria-pressed={isActive}
                className={`relative -mb-px pb-3 text-sm font-semibold transition-colors duration-300 focus:outline-none focus-visible:text-gold ${
                  isActive ? "text-gold" : "text-charcoal/70 hover:text-ink"
                }`}
              >
                {tab.label}
                {isActive && (
                  <span
                    className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gold-gradient"
                    aria-hidden
                  />
                )}
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
