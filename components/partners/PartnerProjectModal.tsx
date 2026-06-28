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

// Short "focus type" label per project category — no new claims, just a concise
// restatement of the existing category for the quick-facts strip.
const FOCUS_LABEL: Record<PartnerProject["category"], string> = {
  "Healthy Bakery / Functional Bread": "Healthy / Functional Bakery",
  "Organic / Government Food Brand Bakery Production":
    "Organic / Private Label Bakery",
  "Date-Based Sweets / Bakery": "Date-Based Sweets",
};

function monogram(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Main-column section: divider heading + content. */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-sand/70 pt-5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Support-column section: framed card for visual separation. */
function PanelSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-sand bg-warmwhite p-5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Renders a string[] as soft bullet cards (1 or 2 columns). */
function BulletGrid({ items, cols = 2 }: { items: string[]; cols?: 1 | 2 }) {
  return (
    <ul
      className={`grid grid-cols-1 gap-2.5 ${cols === 2 ? "sm:grid-cols-2" : ""}`}
    >
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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-sand bg-warmwhite px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
        {label}
      </p>
      <p className="mt-1 font-serif text-sm font-semibold leading-tight text-ink">
        {value}
      </p>
    </div>
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
  const productCount = project.products.length;

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
        {/* Sticky header */}
        <div className="relative flex items-start gap-4 border-b border-sand bg-warmwhite px-5 py-5 sm:gap-5 sm:px-8 sm:py-6">
          <div
            className="oven-glow pointer-events-none absolute inset-0"
            aria-hidden
          />

          {/* Logo / monogram in a framed tile */}
          {hasAsset(logoPath) ? (
            <span className="flex h-14 flex-none items-center justify-center rounded-2xl border border-sand bg-cream px-3 shadow-card sm:h-16">
              <Image
                src={logoPath}
                alt={getAssetAlt(
                  project.partnerAssetKey ?? "",
                  project.partnerName
                )}
                width={120}
                height={56}
                className="h-9 w-auto max-w-[6rem] object-contain sm:h-10"
              />
            </span>
          ) : (
            <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl border border-sand bg-cream font-serif text-base font-bold text-gold shadow-card sm:h-16 sm:w-16">
              {monogram(project.partnerName)}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center rounded-full border border-champagne/60 bg-cream px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold">
              {project.category}
            </span>
            <h2
              id={titleId}
              className="mt-2 font-serif text-xl font-semibold leading-tight text-ink sm:text-2xl"
            >
              {project.partnerName}
            </h2>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-stone sm:text-[15px]">
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
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-7">
          {/* Quick facts strip */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Fact label="Focus" value={FOCUS_LABEL[project.category]} />
            <Fact label="Products" value={String(productCount)} />
            <Fact
              label="Specification data"
              value={nutritionVerified ? "Available" : "Pending"}
            />
            <Fact
              label="Nutrition data"
              value={nutritionVerified ? "Verified" : "Pending"}
            />
          </div>

          {/* Two-column body */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Main column */}
            <div className="space-y-5 lg:col-span-2">
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Overview
                </h3>
                <div className="mt-3 space-y-3">
                  {project.overview.map((para, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed text-charcoal sm:text-[15px]"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </section>

              <Section title="Production Focus">
                <BulletGrid items={project.productionFocus} />
              </Section>

              <Section title="Ingredient Strategy">
                <BulletGrid items={project.ingredientStrategy} />
              </Section>

              <Section title="Process & Fermentation">
                <BulletGrid items={project.processNotes} />
              </Section>
            </div>

            {/* Support column */}
            <div className="space-y-4">
              <PanelSection title="Nutrition / Product Logic">
                {highlightNutrition && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {NUTRITION_DIMENSIONS.map((dim) => (
                      <span
                        key={dim}
                        className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-cream px-3 py-1 text-xs font-semibold text-charcoal"
                      >
                        {dim}
                        <span className="text-[10px] font-medium text-stone/70">
                          pending
                        </span>
                      </span>
                    ))}
                  </div>
                )}
                <BulletGrid items={project.nutritionFocus} cols={1} />
                {!nutritionVerified && (
                  <p className="mt-3 text-xs font-medium text-stone/80">
                    Nutrition values pending verified specification sheet
                  </p>
                )}
              </PanelSection>

              <PanelSection title="Quality / Compliance Notes">
                <BulletGrid items={project.complianceNotes} cols={1} />
              </PanelSection>
            </div>
          </div>

          {/* Products Manufactured — full width */}
          <section className="mt-7 border-t border-sand/70 pt-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Products Manufactured
              </h3>
              <span className="text-xs font-medium text-stone">
                {productCount} {productCount === 1 ? "product" : "products"}
              </span>
            </div>
            <div className="mt-3">
              <PartnerProjectProducts products={project.products} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
