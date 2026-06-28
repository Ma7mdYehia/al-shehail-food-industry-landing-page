"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import ProductCard from "./ProductCard";
import ProductIcon, { type ProductIconType } from "./ProductIcon";
import { productCategories, products } from "@/lib/products";

// "All" + the real categories — a product-family menu, default-selected on All.
const ALL_SLUG = "all";

const categoryFilters = [
  { label: "All", slug: ALL_SLUG },
  ...productCategories.map((c) => ({ label: c.name, slug: c.slug })),
];

// Per-category icon for the circular selector.
const iconBySlug: Record<string, ProductIconType> = {
  "flatbread-wraps": "flatbread",
  "soft-bread": "loaf",
  pastry: "croissant",
  sweets: "maamoul",
};

function countFor(slug: string) {
  return slug === ALL_SLUG
    ? products.length
    : products.filter((p) => p.categorySlug === slug).length;
}

/** Simple grid glyph used for the "All" circle. */
function AllIcon({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </svg>
  );
}

export default function Products() {
  const [active, setActive] = useState(ALL_SLUG);

  const visible =
    active === ALL_SLUG
      ? products
      : products.filter((p) => p.categorySlug === active);

  return (
    <section id="products" className="section relative overflow-hidden bg-warmwhite">
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="What We Manufacture"
          title="A complete bakery product range"
          description="From flatbread and wraps to soft bread, pastry, and sweets — manufactured to consistent, retail-ready quality."
        />

        {/* Circular category selector — a premium product-family menu */}
        <div
          className="mt-10 flex snap-x gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center sm:gap-6 [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Filter products by category"
        >
          {categoryFilters.map((f) => {
            const isActive = active === f.slug;
            const count = countFor(f.slug);
            return (
              <button
                key={f.slug}
                type="button"
                onClick={() => setActive(f.slug)}
                aria-pressed={isActive}
                className="group flex flex-none snap-start flex-col items-center gap-2.5 focus:outline-none"
              >
                <span
                  className={`flex h-[76px] w-[76px] items-center justify-center rounded-full border transition-all duration-300 sm:h-24 sm:w-24 ${
                    isActive
                      ? "border-champagne bg-cream text-gold shadow-card ring-1 ring-champagne/40"
                      : "border-sand bg-warmwhite text-charcoal/70 group-hover:-translate-y-0.5 group-hover:border-champagne group-hover:bg-cream group-hover:text-gold group-hover:shadow-card"
                  } group-focus-visible:ring-2 group-focus-visible:ring-champagne group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-warmwhite`}
                >
                  {f.slug === ALL_SLUG ? (
                    <AllIcon size={30} />
                  ) : (
                    <ProductIcon type={iconBySlug[f.slug]} width={34} height={34} />
                  )}
                </span>
                <span className="flex flex-col items-center text-center">
                  <span
                    className={`text-xs font-semibold leading-tight sm:text-sm ${
                      isActive ? "text-ink" : "text-charcoal"
                    }`}
                  >
                    {f.label}
                  </span>
                  <span className="mt-0.5 text-[11px] font-medium text-stone/70">
                    {count} {count === 1 ? "item" : "items"}
                  </span>
                </span>
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
