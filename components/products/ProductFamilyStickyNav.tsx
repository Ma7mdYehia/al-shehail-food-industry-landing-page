"use client";

import { useEffect, useState } from "react";
import { productsByCategory } from "@/lib/products";

// Sticky quick-jump nav for the /products directory. It stays hidden while the
// Product Family Directory cards (#product-families) are visible, then fades in
// pinned under the header once the user scrolls past them. Uses a single
// IntersectionObserver (no scroll-event spam) and `fixed` positioning so it
// reserves no layout space while hidden.
export default function ProductFamilyStickyNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("product-families");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      // Offset the top by the fixed header height so the nav reveals exactly as
      // the family cards slide under the header.
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
      aria-label="Product families"
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
            All
          </a>
          {productsByCategory.map(({ category }) => (
            <a
              key={category.slug}
              href={`#${category.slug}`}
              className={linkClass}
              tabIndex={tabIndex}
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
