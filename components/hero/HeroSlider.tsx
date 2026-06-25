"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroSlides, type HeroTrustIcon } from "@/lib/content";
import { assets, hasAsset, getAssetAlt } from "@/lib/assets";
import HeroSystem from "./HeroSystem";

// Calm autoplay cadence — slow enough to read each stage.
const AUTOPLAY_MS = 5500;

/** Small premium trust-point icon set, matching the warm gold identity. */
function TrustIcon({ name }: { name: HeroTrustIcon }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "shield-check":
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" />
          <path d="M9 12l2 2 4-4.5" />
        </svg>
      );
    case "label":
      return (
        <svg {...common}>
          <path d="M3 8a2 2 0 012-2h7l9 6-9 6H5a2 2 0 01-2-2V8z" />
          <circle cx="7.5" cy="12" r="1.1" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <path d="M3 7h11v8H3z" />
          <path d="M14 10h4l3 3v2h-7z" />
          <circle cx="7" cy="17" r="1.6" />
          <circle cx="17" cy="17" r="1.6" />
        </svg>
      );
  }
}

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

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  // The interactive system only renders when no real factory photo exists.
  const showSystem = !hasAsset(assets.factory.exterior);

  // Slow, calm autoplay — paused on hover/focus and under reduced-motion.
  useEffect(() => {
    if (!showSystem || paused || reducedMotion) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % heroSlides.length),
      AUTOPLAY_MS
    );
    return () => window.clearInterval(id);
  }, [showSystem, paused, reducedMotion]);

  const slide = heroSlides[active];

  return (
    <div
      className="relative flex min-h-[88vh] items-center overflow-hidden pt-32 pb-20 sm:pt-36 lg:min-h-[44rem] lg:pt-44 lg:pb-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Active stage banner — a full-bleed cinematic layer that fills the whole
          hero area beneath the header, all the way to the bottom edge. Warm
          gradient overlays keep the left copy very readable while letting more
          of the image breathe on the right. All stage images are stacked and
          cross-faded by opacity to avoid layout shift and re-mounting. */}
      <div className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden">
        {heroSlides.map((s, i) => (
          <Image
            key={s.image}
            src={s.image}
            alt={s.imageAlt}
            fill
            sizes="100vw"
            priority={i === 0}
            aria-hidden={i !== active}
            className={`object-cover object-center transition-opacity duration-700 ease-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Warm readability overlays — stronger cream wash on the left for the
            copy, more image visibility kept on the right. */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/85 to-cream/20 sm:via-cream/70 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream/70 via-transparent to-warmwhite/35" />
        {/* Stronger wash on mobile where copy sits over the image */}
        <div className="absolute inset-0 bg-cream/55 sm:bg-transparent" />
      </div>

      <div className="container-x relative">
      <div className="max-w-xl animate-fade-up">
        {slide.eyebrow && (
          <span className="eyebrow">
            <span className="h-px w-6 bg-champagne" />
            {slide.eyebrow}
          </span>
        )}

        {/* key re-triggers the subtle fade between slide variants */}
        <h1
          key={`t-${active}`}
          className="heading-serif mt-6 max-w-xl animate-fade-up text-4xl leading-[1.12] sm:text-[2.4rem] lg:text-[2.75rem] lg:leading-[1.12]"
        >
          {slide.title}
        </h1>

        <p
          key={`d-${active}`}
          className="mt-5 max-w-lg animate-fade-up text-base leading-relaxed text-stone sm:text-lg"
        >
          {slide.description}
        </p>

        {slide.ctaLabel && (
          <div className="mt-8">
            <a href={slide.ctaHref ?? "/contact"} className="btn-primary group">
              {slide.ctaLabel}
              <svg
                className="transition-transform duration-300 group-hover:translate-x-0.5"
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
            </a>
          </div>
        )}

        {slide.trustPoints && slide.trustPoints.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2.5">
            {slide.trustPoints.map((point) => (
              <span
                key={point.label}
                className="inline-flex items-center gap-2 rounded-full border border-sand bg-warmwhite/80 px-3.5 py-1.5 text-xs font-semibold text-charcoal"
              >
                <span className="text-gold">
                  <TrustIcon name={point.icon} />
                </span>
                {point.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Hero visual — a compact floating control panel layered over the image.
          On large screens it floats toward the center-/lower-right with plenty
          of breathing room from the copy; on mobile it sits in normal flow
          beneath the text. Real factory photo replaces it when available. */}
      <div className="mt-12 animate-fade-up [animation-delay:120ms] sm:max-w-xs lg:mt-0 lg:absolute lg:right-0 lg:top-1/2 lg:max-w-none lg:-translate-y-[42%]">
        {showSystem ? (
          <HeroSystem active={slide.step} onSelect={setActive} />
        ) : (
          <div className="glow-border relative overflow-hidden rounded-3xl bg-warmwhite p-3 shadow-soft lg:w-72">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src={assets.factory.exterior as string}
                alt={getAssetAlt("exterior")}
                width={720}
                height={480}
                priority
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
