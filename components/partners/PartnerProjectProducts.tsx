"use client";

import Image from "next/image";
import { useId, useState } from "react";
import {
  NEEDS_VERIFICATION,
  type PartnerProjectProduct,
  type PartnerProductStatus,
} from "@/lib/partnerProjects";

// Derive a clean monogram from a product name (e.g. "Healthy Toast" -> "HT").
function monogram(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Public-facing, conservative status labels. "needs-data" maps to "Spec pending"
// to stay honest about the verified-specification-sheet placeholder state.
const STATUS_LABEL: Record<PartnerProductStatus, string> = {
  active: "Active",
  planned: "Planned",
  "needs-data": "Spec pending",
};

// Warm premium badge colors — no harsh red, even for the pending state.
const STATUS_CLASS: Record<PartnerProductStatus, string> = {
  active: "bg-gold-gradient text-white",
  planned: "border border-champagne bg-warmwhite text-gold",
  "needs-data": "border border-sand bg-beige text-stone",
};

function StatusBadge({ status }: { status: PartnerProductStatus }) {
  return (
    <span
      className={`inline-flex flex-none items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

/** True when nutrition highlights are still placeholder-only. */
function nutritionPending(product: PartnerProjectProduct) {
  return (
    product.nutritionHighlights.length === 0 ||
    product.nutritionHighlights.every((v) => v.includes(NEEDS_VERIFICATION))
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
  caption = false,
}: {
  name: string;
  caption?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-sand bg-warmwhite font-serif text-base font-bold text-gold">
        {monogram(name)}
      </span>
      {caption && (
        <span className="text-[11px] font-medium text-stone/70">
          Product photography pending
        </span>
      )}
    </div>
  );
}

export default function PartnerProjectProducts({
  products,
}: {
  products: PartnerProjectProduct[];
}) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const baseId = useId();
  const previewId = `${baseId}-preview`;
  const selected = products.find((p) => p.slug === selectedSlug) ?? null;

  return (
    <div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const isSelected = product.slug === selectedSlug;
          const chips = product.keyNotes
            .filter((n) => !n.includes(NEEDS_VERIFICATION))
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
                className={`group flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-warmwhite text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
                  isSelected
                    ? "border-champagne shadow-card ring-1 ring-champagne"
                    : "border-sand"
                }`}
              >
                {/* Image, or a warm placeholder until photography is supplied */}
                <div className="relative flex aspect-[3/2] items-center justify-center border-b border-sand bg-beige bg-dotted-gold">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 280px"
                      className="object-cover"
                    />
                  ) : (
                    <ImagePlaceholder name={product.name} />
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif text-base font-semibold leading-tight text-ink">
                      {product.name}
                    </h4>
                    <StatusBadge status={product.status} />
                  </div>
                  <div>
                    <CategoryChip category={product.category} />
                  </div>
                  <p className="text-sm leading-relaxed text-stone">
                    {product.shortDescription}
                  </p>
                  {chips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {chips.map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex max-w-full items-center truncate rounded-md bg-cream px-2 py-0.5 text-[11px] font-medium text-charcoal"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold text-gold">
                    {isSelected ? "Hide details" : "Preview details"}
                    <svg
                      className={`transition-transform duration-300 ${
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
                  alt={selected.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 240px"
                  className="object-cover"
                />
              ) : (
                <ImagePlaceholder name={selected.name} caption />
              )}
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-serif text-lg font-semibold leading-tight text-ink">
                    {selected.name}
                  </h4>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <CategoryChip category={selected.category} />
                    <StatusBadge status={selected.status} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSlug(null)}
                  aria-label="Close product preview"
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
                {selected.shortDescription}
              </p>

              <h5 className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                Key product notes
              </h5>
              <ul className="mt-2 space-y-1.5">
                {selected.keyNotes.map((note, i) => (
                  <li key={i} className="flex gap-2 text-sm text-charcoal">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-champagne"
                      aria-hidden
                    />
                    <span className="leading-relaxed">{note}</span>
                  </li>
                ))}
              </ul>

              <h5 className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                Nutrition highlights
              </h5>
              {nutritionPending(selected) ? (
                <p className="mt-2 text-sm font-medium text-stone/80">
                  Nutrition values pending verified specification sheet
                </p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {selected.nutritionHighlights.map((n, i) => (
                    <li key={i} className="flex gap-2 text-sm text-charcoal">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-champagne"
                        aria-hidden
                      />
                      <span className="leading-relaxed">{n}</span>
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
