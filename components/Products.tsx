"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import AssetHint from "./AssetHint";
import ProductIcon from "./ProductIcon";
import { productCategories, products } from "@/lib/products";

const filters = [
  { label: "All", slug: "all" },
  ...productCategories.map((c) => ({ label: c.name, slug: c.slug })),
];

export default function Products() {
  const [active, setActive] = useState("all");

  const visible =
    active === "all"
      ? products
      : products.filter((p) => p.categorySlug === active);

  return (
    <section id="products" className="section bg-warmwhite">
      <div className="container-x">
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
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-sand bg-cream transition-all duration-300 hover:-translate-y-1 hover:border-champagne hover:shadow-soft"
            >
              {/* Product photo placeholder */}
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-beige via-cream to-sand">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-champagne/15 blur-2xl" />
                <span className="absolute left-4 top-4 rounded-full border border-sand bg-warmwhite/80 px-3 py-1 text-[11px] font-semibold text-gold backdrop-blur">
                  {product.category}
                </span>
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warmwhite/80 text-gold shadow-card backdrop-blur">
                  <ProductIcon type={product.iconType} width={30} height={30} />
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-serif text-lg font-semibold text-ink">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">
                  {product.shortDescription}
                </p>
                <AssetHint label="Product photo needed" className="mt-4" />
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

        <div className="mt-12 text-center">
          <Link href="/products" className="btn-secondary">
            View All Product Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
