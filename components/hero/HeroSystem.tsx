"use client";

import MouseGlow from "../ui/MouseGlow";
import FlourParticles from "../visuals/FlourParticles";
import { PremiumObject, type PremiumObjectName } from "../visuals/PremiumObjects";

// Premium "Bakery Manufacturing System — From Idea to Shelf" hero visual.
// Pure CSS/SVG: a soft production workflow line connects seven process nodes,
// with a warm oven glow, flour-dust particles, floating accents, and a
// cursor-following champagne glow. Shown when no real factory image exists.
//
// These seven labels are a visual abstraction of the private-label flow
// (a shortened, presentation-only view of lib/content privateLabelSteps).
const FLOW: { label: string; object: PremiumObjectName }[] = [
  { label: "Product Idea", object: "recipe" },
  { label: "Recipe", object: "flour" },
  { label: "Sampling", object: "croissant" },
  { label: "Packaging", object: "carton" },
  { label: "Production", object: "bun" },
  { label: "QC", object: "qc" },
  { label: "Retail Ready", object: "retail" },
];

export default function HeroSystem() {
  return (
    <MouseGlow className="mouse-glow mouse-glow-border relative rounded-3xl">
      <div className="glow-border relative overflow-hidden rounded-3xl bg-warmwhite p-3 shadow-soft">
        {/* Layered premium background */}
        <div className="oven-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="bg-grain pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <FlourParticles />

        <div className="bg-dotted-gold relative overflow-hidden rounded-2xl border border-sand/70 p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                Manufacturing System
              </span>
              <p className="mt-2 max-w-[15rem] font-serif text-lg font-semibold leading-snug text-ink sm:text-xl">
                From idea to shelf — one connected line.
              </p>
            </div>
            <span className="flex h-11 w-11 flex-none animate-float-slow items-center justify-center rounded-2xl bg-gold-gradient text-white shadow-card">
              <PremiumObject name="qc" size={26} />
            </span>
          </div>

          {/* Workflow line + nodes */}
          <div className="relative mt-6">
            {/* The connecting production line */}
            <div className="absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-champagne/70 via-champagne/40 to-transparent" aria-hidden />
            {/* Travelling pulse along the line */}
            <div className="pointer-events-none absolute bottom-0 left-[27px] top-0 w-1.5 -translate-x-1/2" aria-hidden>
              <span className="animate-line-pulse absolute left-1/2 h-10 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-gold/60 to-transparent" />
            </div>

            <ul className="relative space-y-2.5">
              {FLOW.map((step, i) => (
                <li
                  key={step.label}
                  className="group flex items-center gap-3.5"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <span className="relative z-10 flex h-14 w-14 flex-none items-center justify-center rounded-2xl border border-sand bg-warmwhite shadow-card transition-transform duration-300 group-hover:-translate-y-0.5">
                    <PremiumObject name={step.object} size={34} />
                  </span>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl border border-sand/70 bg-cream/70 px-3.5 py-2.5 backdrop-blur-sm transition-colors duration-300 group-hover:border-champagne/60">
                    <span className="truncate font-serif text-sm font-semibold text-charcoal">
                      {step.label}
                    </span>
                    <span className="font-serif text-xs font-bold text-champagne">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Floating accent chip */}
      <div className="absolute -bottom-5 -left-3 hidden animate-float items-center gap-2.5 rounded-2xl border border-sand bg-warmwhite px-4 py-3 shadow-soft sm:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-beige">
          <PremiumObject name="retail" size={22} />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-charcoal">Retail-ready output</p>
          <p className="text-xs text-stone">Developed, packed &amp; supplied</p>
        </div>
      </div>
    </MouseGlow>
  );
}
