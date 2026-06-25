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
    <MouseGlow className="mouse-glow mouse-glow-border relative mx-auto max-w-sm rounded-3xl lg:mr-0 lg:ml-auto">
      <div className="glow-border relative overflow-hidden rounded-3xl bg-warmwhite/85 p-2.5 shadow-soft backdrop-blur-md">
        {/* Layered premium background */}
        <div className="oven-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="bg-grain pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <FlourParticles />

        <div className="bg-dotted-gold relative overflow-hidden rounded-2xl border border-sand/70 p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                Manufacturing System
              </span>
              <p className="mt-1.5 font-serif text-base font-semibold leading-snug text-ink">
                From idea to shelf
              </p>
            </div>
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-gold-gradient font-serif text-sm font-bold text-white shadow-card">
              {String(active + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Stage list — a compact control panel */}
          <ul className="relative mt-4 space-y-1.5">
            {FLOW.map((step, i) => {
              const isActive = i === active;
              return (
                <li key={step.label}>
                  <button
                    type="button"
                    onClick={() => onSelect(i)}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`Stage ${i + 1}: ${step.label}`}
                    className={`group flex w-full items-center gap-3 rounded-xl border px-2 py-1.5 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-1 focus-visible:ring-offset-warmwhite ${
                      isActive
                        ? "border-champagne/70 bg-cream shadow-card"
                        : "border-transparent hover:border-sand/70 hover:bg-cream/60"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl border transition-colors duration-300 ${
                        isActive
                          ? "border-champagne bg-warmwhite shadow-card"
                          : "border-sand bg-warmwhite/80"
                      }`}
                    >
                      <PremiumObject name={step.object} size={26} />
                    </span>
                    <span
                      className={`flex-1 truncate font-serif text-sm font-semibold transition-colors duration-300 ${
                        isActive ? "text-ink" : "text-charcoal"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span
                      className={`font-serif text-xs font-bold transition-colors duration-300 ${
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
  );
}
