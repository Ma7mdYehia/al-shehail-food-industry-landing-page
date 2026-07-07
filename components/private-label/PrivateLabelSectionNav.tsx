"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

// Sticky in-page nav for the long /private-label page.
const NAV: { label: { en: string; ar: string }; id: string }[] = [
  { label: { en: "Overview", ar: "نظرة عامة" }, id: "overview" },
  { label: { en: "Products", ar: "المنتجات" }, id: "products" },
  { label: { en: "Capabilities", ar: "القدرات" }, id: "capabilities" },
  { label: { en: "Process", ar: "العملية" }, id: "process" },
  { label: { en: "Quality", ar: "الجودة" }, id: "quality" },
  { label: { en: "Start Project", ar: "ابدأ مشروعك" }, id: "start" },
];

const L = { en: { aria: "On this page" }, ar: { aria: "في هذه الصفحة" } } as const;

export default function PrivateLabelSectionNav({ locale }: { locale: Locale }) {
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
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label={L[locale].aria}
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
                {n.label[locale]}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
