"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { assets, hasAsset, getAssetAlt } from "@/lib/assets";
import {
  NEEDS_VERIFICATION,
  type PartnerProject,
} from "@/lib/partnerProjects";
import PartnerProjectProducts from "./PartnerProjectProducts";

// Nutrition dimensions surfaced for healthy / functional and organic bakery
// projects. These are UI labels only — no values are invented; until a verified
// specification sheet exists every value reads as pending.
const NUTRITION_DIMENSIONS = [
  "Protein",
  "Carbohydrates",
  "Sugar",
  "Fibre",
  "Calories",
];

const NUTRITION_HIGHLIGHT_CATEGORIES: PartnerProject["category"][] = [
  "Healthy Bakery / Functional Bread",
  "Organic / Government Food Brand Bakery Production",
];

function monogram(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** A titled section wrapper with the warm eyebrow heading style. */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-sand/70 pt-6">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Renders a string[] as a grid of soft bullet cards. */
function BulletGrid({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-2.5 rounded-xl border border-sand bg-warmwhite px-4 py-3"
        >
          <span
            className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-champagne"
            aria-hidden
          />
          <span className="text-sm leading-relaxed text-charcoal">{item}</span>
        </li>
      ))}
    </ul>
  );
}

type Props = {
  project: PartnerProject | null;
  onClose: () => void;
};

export default function PartnerProjectModal({ project, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const panel = panelRef.current;
    // Send focus into the dialog (close button) on open.
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      // Simple focus trap so keyboard users stay inside the dialog.
      if (e.key === "Tab" && panel) {
        const focusables = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [project, onClose]);

  if (!project) return null;

  const titleId = `partner-project-title-${project.slug}`;
  const logoPath = project.partnerAssetKey
    ? assets.partners[project.partnerAssetKey]
    : null;
  const highlightNutrition = NUTRITION_HIGHLIGHT_CATEGORIES.includes(
    project.category
  );
  // Until any product has verified nutrition, surface the pending note.
  const nutritionVerified = project.products.some(
    (p) =>
      p.nutritionHighlights.length > 0 &&
      !p.nutritionHighlights.includes(NEEDS_VERIFICATION)
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Warm dim backdrop — click to close */}
      <button
        type="button"
        aria-label="Close project details"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="animate-fade-up relative flex max-h-[93vh] w-[96vw] max-w-6xl flex-col overflow-hidden rounded-2xl border border-sand bg-cream shadow-lift sm:max-h-[90vh] sm:w-[90vw] sm:rounded-3xl"
      >
        {/* Header */}
        <div className="relative flex items-start gap-4 border-b border-sand bg-warmwhite px-5 py-5 sm:px-8 sm:py-6">
          <div className="oven-glow pointer-events-none absolute inset-0" aria-hidden />
          {hasAsset(logoPath) ? (
            <Image
              src={logoPath}
              alt={getAssetAlt(project.partnerAssetKey ?? "", project.partnerName)}
              width={128}
              height={64}
              className="h-12 w-24 flex-none object-contain sm:h-14 sm:w-28"
            />
          ) : (
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-sand bg-cream font-serif text-base font-bold text-gold sm:h-14 sm:w-14">
              {monogram(project.partnerName)}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2
                id={titleId}
                className="font-serif text-xl font-semibold leading-tight text-ink sm:text-2xl"
              >
                {project.partnerName}
              </h2>
              <span className="inline-flex items-center rounded-full border border-champagne/60 bg-cream px-3 py-1 text-[11px] font-semibold text-gold">
                {project.category}
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone sm:text-base">
              {project.positioning}
            </p>
          </div>

          <button
            type="button"
            data-autofocus
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-sand bg-cream text-charcoal transition-colors duration-200 hover:border-champagne hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-warmwhite"
          >
            <svg
              width="18"
              height="18"
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

        {/* Scrollable content */}
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-8 sm:py-7">
          {/* 1. Overview */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Overview
            </h3>
            <div className="mt-3 space-y-3">
              {project.overview.map((para, i) => (
                <p key={i} className="text-sm leading-relaxed text-charcoal sm:text-[15px]">
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* 2. Production Focus */}
          <Section title="Production Focus">
            <BulletGrid items={project.productionFocus} />
          </Section>

          {/* 3. Ingredient Strategy */}
          <Section title="Ingredient Strategy">
            <BulletGrid items={project.ingredientStrategy} />
          </Section>

          {/* 4. Nutrition / Product Logic */}
          <Section title="Nutrition / Product Logic">
            {highlightNutrition && (
              <div className="mb-3 flex flex-wrap gap-2">
                {NUTRITION_DIMENSIONS.map((dim) => (
                  <span
                    key={dim}
                    className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-warmwhite px-3 py-1 text-xs font-semibold text-charcoal"
                  >
                    {dim}
                    <span className="text-[10px] font-medium text-stone/70">
                      pending
                    </span>
                  </span>
                ))}
              </div>
            )}
            <BulletGrid items={project.nutritionFocus} />
            {!nutritionVerified && (
              <p className="mt-3 text-xs font-medium text-stone/80">
                Nutrition values pending verified specification sheet
              </p>
            )}
          </Section>

          {/* 5. Process & Fermentation */}
          <Section title="Process & Fermentation">
            <BulletGrid items={project.processNotes} />
          </Section>

          {/* 6. Quality / Compliance Notes */}
          <Section title="Quality / Compliance Notes">
            <BulletGrid items={project.complianceNotes} />
          </Section>

          {/* 7. Products Manufactured */}
          <Section title="Products Manufactured">
            <PartnerProjectProducts products={project.products} />
          </Section>
        </div>
      </div>
    </div>
  );
}
