"use client";

import { useEffect, useState } from "react";

// Sticky in-page nav for the long /private-label page. Pins under the fixed
// header and highlights the section currently in view via a single
// IntersectionObserver (no scroll listeners). Horizontally scrollable on mobile.
const NAV = [
  { label: "Overview", id: "overview" },
  { label: "Products", id: "products" },
  { label: "Capabilities", id: "capabilities" },
  { label: "Process", id: "process" },
  { label: "Quality", id: "quality" },
  { label: "Start Project", id: "start" },
];

export default function PrivateLabelSectionNav() {
  const [active, setActive] = useState<string>(NAV[0].id);

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Top offset clears the header (80) + this nav (~52); bottom margin makes a
      // section "active" while its top sits in the upper part of the viewport.
      { rootMargin: "-140px 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-20 z-30 border-y border-sand/60 bg-cream/90 backdrop-blur"
    >
      <div className="container-x">
        <div className="flex gap-2 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((n) => {
            const isActive = active === n.id;
            return (
              <a
                key={n.id}
                href={`#${n.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`flex-none whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors duration-300 ${
                  isActive
                    ? "border-champagne bg-gold-gradient text-white shadow-card"
                    : "border-sand bg-warmwhite text-charcoal hover:border-champagne hover:text-gold"
                }`}
              >
                {n.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
