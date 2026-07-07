"use client";

import { useEffect, useState } from "react";
import { productsByCategory } from "@/lib/products/catalog";
import type { Locale } from "@/lib/i18n";

const L = {
  en: { aria: "Product families", all: "All" },
  ar: { aria: "عائلات المنتجات", all: "الكل" },
} as const;

// Sticky quick-jump nav for the /products directory.
export default function ProductFamilyStickyNav({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const t = L[locale];

  useEffect(() => {
    const target = document.getElementById("product-families");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const linkClass =
    "flex-none whitespace-nowrap rounded-full border border-sand bg-warmwhite px-4 py-1.5 text-sm font-semibold text-charcoal transition-colors hover:border-champagne hover:text-gold";
  const tabIndex = visible ? 0 : -1;

  return (
    <nav
      aria-label={t.aria}
      aria-hidden={!visible}
      className={`fixed inset-x-0 top-20 z-40 border-y border-sand/60 bg-cream/90 backdrop-blur transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <div className="container-x">
        <div className="flex gap-2 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <a href="#product-directory" className={linkClass} tabIndex={tabIndex}>
            {t.all}
          </a>
          {productsByCategory.map(({ category }) => (
            <a
              key={category.slug}
              href={`#${category.slug}`}
              className={linkClass}
              tabIndex={tabIndex}
            >
              {category.name[locale]}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
