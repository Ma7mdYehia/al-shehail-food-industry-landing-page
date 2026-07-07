"use client";

import Image from "next/image";
import { useId, useState } from "react";
import {
  NEEDS_VERIFICATION,
  type PartnerProjectProduct,
  type PartnerProductStatus,
} from "@/lib/partnerProjects";
import type { Locale } from "@/lib/i18n";

// Local UI strings for this component's chrome.
const L = {
  en: {
    status: { active: "Active", planned: "Planned", "needs-data": "Spec pending" },
    photoPending: "Product photography pending",
    hide: "Hide details",
    preview: "Preview details",
    closePreview: "Close product preview",
    keyNotes: "Key product notes",
    nutrition: "Nutrition highlights",
    nutritionPending: "Nutrition values pending verified specification sheet",
  },
  ar: {
    status: { active: "نشط", planned: "مُخطَّط", "needs-data": "المواصفات قيد التأكيد" },
    photoPending: "تصوير المنتج قيد الإعداد",
    hide: "إخفاء التفاصيل",
    preview: "معاينة التفاصيل",
    closePreview: "إغلاق معاينة المنتج",
    keyNotes: "ملاحظات المنتج الرئيسية",
    nutrition: "أبرز القيم الغذائية",
    nutritionPending: "القيم الغذائية قيد التأكيد من ورقة مواصفات موثّقة",
  },
} as const;

function monogram(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const STATUS_CLASS: Record<PartnerProductStatus, string> = {
  active: "bg-gold-gradient text-white",
  planned: "border border-champagne bg-warmwhite text-gold",
  "needs-data": "border border-sand bg-beige text-stone",
};

function StatusBadge({
  status,
  locale,
}: {
  status: PartnerProductStatus;
  locale: Locale;
}) {
  return (
    <span
      className={`inline-flex flex-none items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_CLASS[status]}`}
    >
      {L[locale].status[status]}
    </span>
  );
}

/** True when nutrition highlights are still placeholder-only. */
function nutritionPending(product: PartnerProjectProduct) {
  return (
    product.nutritionHighlights.length === 0 ||
    product.nutritionHighlights.every((v) => v.en.includes(NEEDS_VERIFICATION.en))
  );
}

function CategoryChip({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-sand bg-cream px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold">
      {category}
    </span>
  );
}

function ImagePlaceholder({
  name,
  caption,
  captionText,
}: {
  name: string;
  caption?: boolean;
  captionText: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-sand bg-warmwhite font-serif text-base font-bold text-gold">
        {monogram(name)}
      </span>
      {caption && (
        <span className="text-[11px] font-medium text-stone/70">{captionText}</span>
      )}
    </div>
  );
}

export default function PartnerProjectProducts({
  products,
  locale,
}: {
  products: PartnerProjectProduct[];
  locale: Locale;
}) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const baseId = useId();
  const previewId = `${baseId}-preview`;
  const selected = products.find((p) => p.slug === selectedSlug) ?? null;
  const s = L[locale];

  return (
    <div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const isSelected = product.slug === selectedSlug;
          const name = product.name[locale];
          const chips = product.keyNotes
            .filter((n) => !n.en.includes(NEEDS_VERIFICATION.en))
            .slice(0, 2);
          return (
            <li key={product.slug}>
              <button
                type="button"
                onClick={() =>
                  setSelectedSlug(isSelected ? null : product.slug)
                }
                aria-expanded={isSelected}
                aria-controls={previewId}
                className={`group flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-warmwhite text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-cream rtl:text-right ${
                  isSelected
                    ? "border-champagne shadow-card ring-1 ring-champagne"
                    : "border-sand"
                }`}
              >
                <div className="relative flex aspect-[3/2] items-center justify-center border-b border-sand bg-beige bg-dotted-gold">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={name}
                      fill
                      sizes="(max-width: 640px) 100vw, 280px"
                      className="object-cover"
                    />
                  ) : (
                    <ImagePlaceholder name={name} captionText={s.photoPending} />
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif text-base font-semibold leading-tight text-ink">
                      {name}
                    </h4>
                    <StatusBadge status={product.status} locale={locale} />
                  </div>
                  <div>
                    <CategoryChip category={product.category[locale]} />
                  </div>
                  <p className="text-sm leading-relaxed text-stone">
                    {product.shortDescription[locale]}
                  </p>
                  {chips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {chips.map((chip) => (
                        <span
                          key={chip.en}
                          className="inline-flex max-w-full items-center truncate rounded-md bg-cream px-2 py-0.5 text-[11px] font-medium text-charcoal"
                        >
                          {chip[locale]}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold text-gold">
                    {isSelected ? s.hide : s.preview}
                    <svg
                      className={`transition-transform duration-300 rtl:-scale-x-100 ${
                        isSelected ? "rotate-90" : "group-hover:translate-x-0.5"
                      }`}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Inline lightweight preview — no routing, no nested dialog */}
      {selected && (
        <div
          id={previewId}
          key={selected.slug}
          className="animate-fade-up mt-4 overflow-hidden rounded-2xl border border-champagne/60 bg-cream shadow-card"
        >
          <div className="grid gap-0 sm:grid-cols-[15rem_1fr]">
            <div className="relative flex aspect-[3/2] items-center justify-center border-b border-sand bg-beige bg-dotted-gold sm:aspect-auto sm:border-b-0 sm:border-r">
              {selected.image ? (
                <Image
                  src={selected.image}
                  alt={selected.name[locale]}
                  fill
                  sizes="(max-width: 640px) 100vw, 240px"
                  className="object-cover"
                />
              ) : (
                <ImagePlaceholder
                  name={selected.name[locale]}
                  caption
                  captionText={s.photoPending}
                />
              )}
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-serif text-lg font-semibold leading-tight text-ink">
                    {selected.name[locale]}
                  </h4>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <CategoryChip category={selected.category[locale]} />
                    <StatusBadge status={selected.status} locale={locale} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSlug(null)}
                  aria-label={s.closePreview}
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-sand bg-warmwhite text-charcoal transition-colors duration-200 hover:border-champagne hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                >
                  <svg
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
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-charcoal">
                {selected.shortDescription[locale]}
              </p>

              <h5 className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                {s.keyNotes}
              </h5>
              <ul className="mt-2 space-y-1.5">
                {selected.keyNotes.map((note, i) => (
                  <li key={i} className="flex gap-2 text-sm text-charcoal">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-champagne"
                      aria-hidden
                    />
                    <span className="leading-relaxed">{note[locale]}</span>
                  </li>
                ))}
              </ul>

              <h5 className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                {s.nutrition}
              </h5>
              {nutritionPending(selected) ? (
                <p className="mt-2 text-sm font-medium text-stone/80">
                  {s.nutritionPending}
                </p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {selected.nutritionHighlights.map((n, i) => (
                    <li key={i} className="flex gap-2 text-sm text-charcoal">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-champagne"
                        aria-hidden
                      />
                      <span className="leading-relaxed">{n[locale]}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
