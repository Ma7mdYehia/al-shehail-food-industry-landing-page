"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  homepageHeroSlides,
  type EcosystemHeroService,
} from "@/lib/homepageEcosystem";
import {
  ProductionIcon,
  PackagingIcon,
  RetailIcon,
  DevelopIcon,
} from "@/components/Icons";
import { localeHref, type Locale, type Localized } from "@/lib/i18n";

// Calm autoplay cadence — slow enough to read each slide.
const AUTOPLAY_MS = 6000;

/** Small ecosystem glyph (four connected nodes) for the opening/closing slides. */
function EcosystemIcon({ width = 22, height = 22 }: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

const SERVICE: Record<
  EcosystemHeroService,
  { label: Localized; Icon: (p: { width?: number; height?: number }) => JSX.Element }
> = {
  ecosystem: {
    label: { en: "Al Shehail Ecosystem", ar: "منظومة الشهيل" },
    Icon: EcosystemIcon,
  },
  manufacturing: {
    label: { en: "Private Label Manufacturing", ar: "التصنيع بعلامة خاصة" },
    Icon: ProductionIcon,
  },
  "brand-design": {
    label: { en: "Packaging & Brand Design", ar: "التغليف وتصميم العلامة" },
    Icon: PackagingIcon,
  },
  distribution: {
    label: { en: "Distribution & Retail Reach", ar: "التوزيع والوصول للتجزئة" },
    Icon: RetailIcon,
  },
  "digital-marketing": {
    label: { en: "Food Digital Marketing", ar: "التسويق الرقمي للأغذية" },
    Icon: DevelopIcon,
  },
};

const SLIDER_LABELS: Record<Locale, { prev: string; next: string; tablist: string }> = {
  en: { prev: "Previous slide", next: "Next slide", tablist: "Hero slides" },
  ar: { prev: "الشريحة السابقة", next: "الشريحة التالية", tablist: "شرائح الصفحة الرئيسية" },
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function ArrowIcon() {
  return (
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
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function HeroSlider({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const count = homepageHeroSlides.length;
  const slide = homepageHeroSlides[active];
  const service = SERVICE[slide.service];
  const backgroundImage = slide.poster ?? slide.media;

  const go = (i: number) => setActive(((i % count) + count) % count);
  const t = SLIDER_LABELS[locale];

  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % count),
      AUTOPLAY_MS
    );
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, count]);

  return (
    <div
      className="relative flex items-center pt-32 pb-16 sm:pt-36 lg:min-h-[40rem] lg:pt-44 lg:pb-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {backgroundImage && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            key={`hero-bg-${slide.key}`}
            src={backgroundImage}
            alt=""
            fill
            priority={active === 0}
            sizes="100vw"
            className="object-cover object-center rtl:-scale-x-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-warmwhite/90 via-cream/55 to-transparent rtl:bg-gradient-to-l" />
          <div className="absolute inset-0 bg-gradient-to-b from-warmwhite/25 via-transparent to-cream/60" />
        </div>
      )}

      <div className="container-x relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Copy */}
          <div className="max-w-xl rtl:text-right">
            <span className="eyebrow">
              <span className="h-px w-6 bg-champagne" />
              {service.label[locale]}
            </span>

            <h1
              key={`t-${active}`}
              className="heading-serif mt-6 max-w-xl animate-fade-up text-4xl leading-[1.12] sm:text-[2.4rem] lg:text-[2.85rem] lg:leading-[1.1] rtl:text-[2rem] rtl:leading-[1.3] rtl:sm:text-[2.15rem] rtl:lg:text-[2.5rem] rtl:lg:leading-[1.25]"
            >
              {slide.title[locale]}
            </h1>

            <p
              key={`d-${active}`}
              className="mt-5 max-w-lg animate-fade-up text-base leading-relaxed text-stone sm:text-lg"
            >
              {slide.subtitle[locale]}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href={localeHref(slide.primaryCta.href, locale)} className="btn-primary group">
                {slide.primaryCta.label[locale]}
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100">
                  <ArrowIcon />
                </span>
              </a>
              {slide.secondaryCta && (
                <a href={localeHref(slide.secondaryCta.href, locale)} className="btn-secondary">
                  {slide.secondaryCta.label[locale]}
                </a>
              )}
            </div>

            {/* Slider controls */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex items-center gap-2" role="tablist" aria-label={t.tablist}>
                {homepageHeroSlides.map((s, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`${i + 1}: ${SERVICE[s.service].label[locale]}`}
                      onClick={() => go(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? "w-7 bg-gold-gradient"
                          : "w-2 bg-sand hover:bg-champagne/70"
                      }`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(active - 1)}
                  aria-label={t.prev}
                  className="glass-chip flex h-9 w-9 items-center justify-center rounded-full text-charcoal transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                >
                  <span className="rotate-180 rtl:rotate-0">
                    <ArrowIcon />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => go(active + 1)}
                  aria-label={t.next}
                  className="glass-chip flex h-9 w-9 items-center justify-center rounded-full text-charcoal transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                >
                  <span className="rtl:rotate-180">
                    <ArrowIcon />
                  </span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
