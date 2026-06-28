"use client";

import MouseGlow from "../ui/MouseGlow";
import FlourParticles from "../visuals/FlourParticles";
import { PremiumObject, type PremiumObjectName } from "../visuals/PremiumObjects";

// Premium "Bakery Manufacturing System — From Idea to Shelf" hero visual.
// A compact, control-panel style carousel: seven process stages the visitor can
// click to switch the hero copy, with the current stage highlighted. Pure
// CSS/SVG with a warm oven glow and flour-dust particles. Shown when no real
// factory image exists.
//
// These seven labels are a visual abstraction of the private-label flow
// (a shortened, presentation-only view of lib/content privateLabelSteps) and
// map 1:1 to lib/content heroSlides.
const FLOW: { label: string; object: PremiumObjectName }[] = [
  { label: "Product Idea", object: "recipe" },
  { label: "Recipe", object: "flour" },
  { label: "Sampling", object: "croissant" },
  { label: "Packaging", object: "carton" },
  { label: "Production", object: "bun" },
  { label: "QC", object: "qc" },
  { label: "Retail Ready", object: "retail" },
];

type Props = {
  /** Index (0–6) of the currently highlighted stage. */
  active: number;
  /** Called when the visitor selects a stage. */
  onSelect: (index: number) => void;
};

export default function HeroSystem({ active, onSelect }: Props) {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Mobile / tablet: a compact, horizontally scrollable stage rail.     */}
      {/* No boxed card or header — just lightweight tabs under the copy.     */}
      {/* ------------------------------------------------------------------ */}
      <ul
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
        aria-label="Manufacturing stages"
      >
        {FLOW.map((step, i) => {
          const isActive = i === active;
          return (
            <li key={step.label} className="snap-start">
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Stage ${i + 1}: ${step.label}`}
                className={`group flex items-center gap-2 whitespace-nowrap rounded-2xl border px-2.5 py-1.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-1 focus-visible:ring-offset-cream ${
                  isActive
                    ? "border-champagne/70 bg-cream shadow-card"
                    : "border-sand/70 bg-warmwhite/70"
                }`}
              >
                <span
                  className={`flex h-7 w-7 flex-none items-center justify-center rounded-xl border transition-colors duration-300 ${
                    isActive
                      ? "border-champagne bg-warmwhite shadow-card"
                      : "border-sand bg-warmwhite/80"
                  }`}
                >
                  <PremiumObject name={step.object} size={16} />
                </span>
                <span className="flex flex-col items-start leading-none">
                  <span
                    className={`font-serif text-[9px] font-bold leading-none transition-colors duration-300 ${
                      isActive ? "text-gold" : "text-champagne/70"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`mt-1 font-serif text-[13px] font-semibold leading-none transition-colors duration-300 ${
                      isActive ? "text-ink" : "text-charcoal"
                    }`}
                  >
                    {step.label}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* ------------------------------------------------------------------ */}
      {/* Desktop (lg+): the existing boxed Manufacturing System card.        */}
      {/* Hidden below lg so mobile shows only the rail above.                */}
      {/* ------------------------------------------------------------------ */}
      <MouseGlow className="mouse-glow mouse-glow-border relative mx-auto hidden w-full max-w-[17rem] rounded-3xl lg:mr-0 lg:ml-auto lg:block lg:max-h-[calc(100vh-9rem)] xl:max-w-[18rem]">
      <div className="glow-border relative overflow-hidden rounded-3xl bg-warmwhite/90 p-1.5 shadow-soft backdrop-blur-md sm:p-2">
        {/* Layered premium background */}
        <div className="oven-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="bg-grain pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <FlourParticles />

        <div className="bg-dotted-gold relative overflow-hidden rounded-2xl border border-sand/70 p-2.5 sm:p-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold sm:text-[10px]">
                Manufacturing System
              </span>
              <p className="mt-0.5 font-serif text-sm font-semibold leading-tight text-ink">
                From idea to shelf
              </p>
            </div>
            <span className="flex h-7 w-7 flex-none items-center justify-center rounded-xl bg-gold-gradient font-serif text-xs font-bold text-white shadow-card">
              {String(active + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Stage list — compact enough for all 7 tabs to stay visible in the hero */}
          <ul className="relative mt-2 space-y-1">
            {FLOW.map((step, i) => {
              const isActive = i === active;
              return (
                <li key={step.label}>
                  <button
                    type="button"
                    onClick={() => onSelect(i)}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`Stage ${i + 1}: ${step.label}`}
                    className={`group flex min-h-[2rem] w-full items-center gap-2.5 rounded-xl border px-2 py-0.5 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-1 focus-visible:ring-offset-warmwhite ${
                      isActive
                        ? "border-champagne/70 bg-cream shadow-card"
                        : "border-transparent hover:border-sand/70 hover:bg-cream/60"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 flex-none items-center justify-center rounded-xl border transition-colors duration-300 ${
                        isActive
                          ? "border-champagne bg-warmwhite shadow-card"
                          : "border-sand bg-warmwhite/80"
                      }`}
                    >
                      <PremiumObject name={step.object} size={18} />
                    </span>
                    <span
                      className={`flex-1 truncate font-serif text-[13px] font-semibold leading-none transition-colors duration-300 sm:text-sm ${
                        isActive ? "text-ink" : "text-charcoal"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span
                      className={`font-serif text-[11px] font-bold leading-none transition-colors duration-300 ${
                        isActive ? "text-gold" : "text-champagne/70"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      </MouseGlow>
    </>
  );
}
