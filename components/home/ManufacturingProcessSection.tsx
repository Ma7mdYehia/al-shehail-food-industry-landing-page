import Image from "next/image";
import Link from "next/link";
import SectionHeading from "../SectionHeading";
import {
  DevelopIcon,
  ProductionIcon,
  CalendarIcon,
  PackagingIcon,
  ShieldCheckIcon,
  RetailIcon,
} from "../Icons";
import { manufacturingProcessNarrative } from "@/lib/homepageEcosystem";

// Homepage "From Concept to Production" section — the single, detailed 8-step
// manufacturing workflow (the hero no longer repeats it). Reuses the existing
// /images/hero-journey visuals where available, with a premium icon fallback.
const FALLBACK_ICONS = [
  DevelopIcon,
  ProductionIcon,
  CalendarIcon,
  PackagingIcon,
  CalendarIcon,
  ProductionIcon,
  ShieldCheckIcon,
  RetailIcon,
];

export default function ManufacturingProcessSection() {
  const { title, subtitle, note, steps } = manufacturingProcessNarrative;

  return (
    <section
      id="manufacturing-process"
      className="section scroll-mt-24 border-t border-sand/60 bg-warmwhite"
    >
      <div className="container-x">
        <SectionHeading eyebrow="Manufacturing Process" title={title} description={subtitle} />

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = FALLBACK_ICONS[i];
            return (
              <li
                key={step.title}
                className="card-lift group flex flex-col overflow-hidden rounded-2xl border border-sand bg-cream transition-colors hover:border-champagne/60"
              >
                {/* Media — existing process visual, or warm icon fallback */}
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-sand bg-gradient-to-br from-beige via-cream to-sand">
                  {step.possibleAssetKey ? (
                    <Image
                      src={step.possibleAssetKey}
                      alt={step.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <div className="bg-dotted-gold pointer-events-none absolute inset-0 opacity-40" aria-hidden />
                      <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-champagne/40 bg-warmwhite text-gold shadow-card">
                        <Icon width={26} height={26} />
                      </span>
                    </>
                  )}
                  <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gold-gradient font-serif text-xs font-bold text-white shadow-card">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-base font-semibold leading-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Careful-claims note */}
        <p className="mx-auto mt-8 max-w-3xl rounded-2xl border border-sand bg-cream px-5 py-4 text-center text-xs leading-relaxed text-stone">
          {note}
        </p>

        <div className="mt-10 text-center">
          <Link
            href="/private-label"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
          >
            Explore Private Label Manufacturing
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
          </Link>
        </div>
      </div>
    </section>
  );
}
