import { privateLabelSteps } from "@/lib/content";
import {
  PremiumObject,
  type PremiumObjectName,
} from "./visuals/PremiumObjects";

// Signature "From idea to shelf" process journey — a premium production-belt
// timeline rendered from the shared privateLabelSteps (lib/content). A central
// gold line with a travelling pulse connects eight nodes; cards alternate sides
// on desktop and stack into a clean left-rail timeline on mobile. CSS-only
// motion, reduced-motion safe.

// Presentation-only mapping of each step to an abstract manufacturing object.
const STEP_OBJECTS: PremiumObjectName[] = [
  "recipe", // 01 Product Idea
  "flour", // 02 Recipe Development
  "croissant", // 03 Sampling
  "toast", // 04 Costing
  "carton", // 05 Packaging
  "bun", // 06 Production
  "qc", // 07 Quality Control
  "retail", // 08 Retail-Ready Delivery
];

type Props = {
  /** Optional id for in-page anchoring. */
  id?: string;
};

export default function ProcessJourney({ id }: Props) {
  return (
    <div id={id} className="relative mt-14">
      {/* Central / left production line */}
      <div
        className="pointer-events-none absolute bottom-0 top-0 w-px bg-gradient-to-b from-champagne/40 via-champagne/25 to-transparent max-lg:left-[27px] lg:left-1/2 lg:-translate-x-1/2"
        aria-hidden
      >
        {/* Travelling pulse */}
        <span className="animate-line-pulse absolute left-1/2 h-16 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-gold/70 to-transparent" />
      </div>

      <ol className="relative space-y-6 lg:space-y-10">
        {privateLabelSteps.map((step, i) => {
          const leftSide = i % 2 === 0;
          return (
            <li
              key={step.number}
              className="relative flex items-start gap-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-0"
            >
              {/* Left card (desktop) */}
              <div
                className={`hidden lg:block ${
                  leftSide ? "lg:pr-12 lg:text-right" : "lg:order-3 lg:pl-12"
                }`}
              >
                {leftSide && <StepCard step={step} object={STEP_OBJECTS[i]} align="right" />}
                {!leftSide && <StepCard step={step} object={STEP_OBJECTS[i]} align="left" />}
              </div>

              {/* Node marker on the line */}
              <div className="relative z-10 flex-none lg:order-2 lg:px-0">
                <span className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-sand bg-warmwhite shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne/60 hover:shadow-glow">
                  <span className="absolute -left-px -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-gradient font-serif text-[11px] font-bold text-white shadow-card lg:-left-2 lg:-top-2">
                    {step.number}
                  </span>
                  <PremiumObject name={STEP_OBJECTS[i]} size={34} />
                </span>
              </div>

              {/* Mobile card / desktop empty balancer */}
              <div className="flex-1 lg:order-1 lg:hidden">
                <StepCard step={step} object={STEP_OBJECTS[i]} align="left" />
              </div>
              {/* Desktop empty side balancer */}
              <div
                className={`hidden lg:block ${leftSide ? "lg:order-3" : "lg:order-1"}`}
                aria-hidden
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StepCard({
  step,
  object,
  align,
}: {
  step: { number: string; title: string; description: string };
  object: PremiumObjectName;
  align: "left" | "right";
}) {
  return (
    <div
      className={`group rounded-2xl border border-sand bg-warmwhite p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-champagne/60 hover:shadow-glow focus-within:-translate-y-1 focus-within:border-champagne/60 focus-within:shadow-glow ${
        align === "right" ? "lg:ml-auto" : ""
      } max-w-md`}
    >
      <div
        className={`flex items-center gap-3 ${
          align === "right" ? "lg:flex-row-reverse lg:text-right" : ""
        }`}
      >
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-beige">
          <PremiumObject name={object} size={26} />
        </span>
        <h3 className="font-serif text-base font-semibold text-ink">
          {step.title}
        </h3>
      </div>
      <p
        className={`mt-3 text-sm leading-relaxed text-stone ${
          align === "right" ? "lg:text-right" : ""
        }`}
      >
        {step.description}
      </p>
    </div>
  );
}
