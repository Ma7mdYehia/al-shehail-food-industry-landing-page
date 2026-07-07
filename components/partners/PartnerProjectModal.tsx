"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { assets, hasAsset, getAssetAlt } from "@/lib/assets";
import {
  NEEDS_VERIFICATION,
  type PartnerProject,
} from "@/lib/partnerProjects";
import type { Locale, Localized } from "@/lib/i18n";
import PartnerProjectProducts from "./PartnerProjectProducts";

// Modal-internal UI strings (chrome). Shared partner strings live in
// lib/dictionary; these are specific to this dialog.
const L = {
  en: {
    close: "Close project details",
    focus: "Focus",
    products: "Products",
    specData: "Specification data",
    nutritionData: "Nutrition data",
    available: "Available",
    pending: "Pending",
    verified: "Verified",
    pendingWord: "pending",
    overview: "Overview",
    productionFocus: "Production Focus",
    ingredientStrategy: "Ingredient Strategy",
    processFermentation: "Process & Fermentation",
    nutritionLogic: "Nutrition / Product Logic",
    qualityCompliance: "Quality / Compliance Notes",
    productsManufactured: "Products Manufactured",
    nutritionPending: "Nutrition values pending verified specification sheet",
    productWord: "product",
    productsWord: "products",
  },
  ar: {
    close: "إغلاق تفاصيل المشروع",
    focus: "التركيز",
    products: "المنتجات",
    specData: "بيانات المواصفات",
    nutritionData: "البيانات الغذائية",
    available: "متوفّرة",
    pending: "قيد التأكيد",
    verified: "موثّقة",
    pendingWord: "قيد التأكيد",
    overview: "نظرة عامة",
    productionFocus: "تركيز الإنتاج",
    ingredientStrategy: "استراتيجية المكوّنات",
    processFermentation: "العملية والتخمير",
    nutritionLogic: "منطق التغذية / المنتج",
    qualityCompliance: "ملاحظات الجودة / الامتثال",
    productsManufactured: "المنتجات المُصنَّعة",
    nutritionPending: "القيم الغذائية قيد التأكيد من ورقة مواصفات موثّقة",
    productWord: "منتج",
    productsWord: "منتجات",
  },
} as const;

// Nutrition dimension labels — UI only, no invented values.
const NUTRITION_DIMENSIONS: Localized[] = [
  { en: "Protein", ar: "بروتين" },
  { en: "Carbohydrates", ar: "كربوهيدرات" },
  { en: "Sugar", ar: "سكر" },
  { en: "Fibre", ar: "ألياف" },
  { en: "Calories", ar: "سعرات" },
];

const NUTRITION_HIGHLIGHT_CATEGORIES: PartnerProject["category"][] = [
  "Healthy Bakery / Functional Bread",
  "Organic / Government Food Brand Bakery Production",
];

const FOCUS_LABEL: Record<PartnerProject["category"], Localized> = {
  "Healthy Bakery / Functional Bread": {
    en: "Healthy / Functional Bakery",
    ar: "مخبوزات صحية / وظيفية",
  },
  "Organic / Government Food Brand Bakery Production": {
    en: "Organic / Private Label Bakery",
    ar: "مخبوزات عضوية / علامة خاصة",
  },
  "Date-Based Sweets / Bakery": {
    en: "Date-Based Sweets",
    ar: "حلويات بالتمر",
  },
};

function monogram(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

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
  locale: Locale;
};

export default function PartnerProjectModal({ project, onClose, locale }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const s = L[locale];

  useEffect(() => {
    if (!project) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
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
      <button
        type="button"
        aria-label={s.close}
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/60 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        className="animate-fade-up relative flex max-h-[93vh] w-[96vw] max-w-6xl flex-col overflow-hidden rounded-2xl border border-sand bg-cream shadow-lift sm:max-h-[90vh] sm:w-[90vw] sm:rounded-3xl"
      >
        <div className="relative flex items-start gap-4 border-b border-sand bg-warmwhite px-5 py-5 sm:gap-5 sm:px-8 sm:py-6">
          <div className="oven-glow pointer-events-none absolute inset-0" aria-hidden />

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
              {project.categoryLabel[locale]}
            </span>
            <h2
              id={titleId}
              className="mt-2 font-serif text-xl font-semibold leading-tight text-ink sm:text-2xl"
            >
              {project.partnerName}
            </h2>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-stone sm:text-[15px]">
              {project.positioning[locale]}
            </p>
          </div>

          <button
            type="button"
            data-autofocus
            onClick={onClose}
            aria-label={s.close}
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

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-7">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Fact label={s.focus} value={FOCUS_LABEL[project.category][locale]} />
            <Fact label={s.products} value={String(productCount)} />
            <Fact
              label={s.specData}
              value={nutritionVerified ? s.available : s.pending}
            />
            <Fact
              label={s.nutritionData}
              value={nutritionVerified ? s.verified : s.pending}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  {s.overview}
                </h3>
                <div className="mt-3 space-y-3">
                  {project.overview.map((para, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed text-charcoal sm:text-[15px]"
                    >
                      {para[locale]}
                    </p>
                  ))}
                </div>
              </section>

              <Section title={s.productionFocus}>
                <BulletGrid items={project.productionFocus.map((x) => x[locale])} />
              </Section>

              <Section title={s.ingredientStrategy}>
                <BulletGrid items={project.ingredientStrategy.map((x) => x[locale])} />
              </Section>

              <Section title={s.processFermentation}>
                <BulletGrid items={project.processNotes.map((x) => x[locale])} />
              </Section>
            </div>

            <div className="space-y-4">
              <PanelSection title={s.nutritionLogic}>
                {highlightNutrition && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {NUTRITION_DIMENSIONS.map((dim) => (
                      <span
                        key={dim.en}
                        className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-cream px-3 py-1 text-xs font-semibold text-charcoal"
                      >
                        {dim[locale]}
                        <span className="text-[10px] font-medium text-stone/70">
                          {s.pendingWord}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
                <BulletGrid items={project.nutritionFocus.map((x) => x[locale])} cols={1} />
                {!nutritionVerified && (
                  <p className="mt-3 text-xs font-medium text-stone/80">
                    {s.nutritionPending}
                  </p>
                )}
              </PanelSection>

              <PanelSection title={s.qualityCompliance}>
                <BulletGrid items={project.complianceNotes.map((x) => x[locale])} cols={1} />
              </PanelSection>
            </div>
          </div>

          <section className="mt-7 border-t border-sand/70 pt-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {s.productsManufactured}
              </h3>
              <span className="text-xs font-medium text-stone">
                {productCount}{" "}
                {productCount === 1 ? s.productWord : s.productsWord}
              </span>
            </div>
            <div className="mt-3">
              <PartnerProjectProducts products={project.products} locale={locale} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
