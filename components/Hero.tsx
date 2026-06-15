import { trustBadges } from "@/lib/content";
import {
  DevelopIcon,
  ProductionIcon,
  PackagingIcon,
  RetailIcon,
  ShieldCheckIcon,
} from "./Icons";

const pipeline = [
  {
    label: "Develop",
    note: "Product & recipe development",
    Icon: DevelopIcon,
  },
  {
    label: "Manufacture",
    note: "Certified bakery production",
    Icon: ProductionIcon,
  },
  {
    label: "Pack",
    note: "Retail-ready private label",
    Icon: PackagingIcon,
  },
  {
    label: "Supply",
    note: "Scaled UAE retail delivery",
    Icon: RetailIcon,
  },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-36 lg:pt-44 lg:pb-28"
    >
      {/* Warm decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-warmwhite via-cream to-beige/40" />
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />
        <div className="absolute top-40 -left-24 h-96 w-96 rounded-full bg-sand/30 blur-3xl" />
      </div>

      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-up">
            <span className="eyebrow">
              <span className="h-px w-6 bg-champagne" />
              UAE-Based Bakery Manufacturing &amp; Private Label Partner
            </span>

            <h1 className="heading-serif mt-6 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              Private Label Bakery Manufacturing in the UAE
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">
              From product concept to retail-ready bakery solutions — developed,
              manufactured, packed, and scaled for modern food brands.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="/contact" className="btn-primary">
                Start a Project
              </a>
              <a href="/products" className="btn-secondary">
                Explore Products
              </a>
            </div>

            <div className="mt-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                Certified Manufacturing
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {trustBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-warmwhite/80 px-3.5 py-1.5 text-xs font-semibold text-charcoal"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-gold"
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Visual placeholder system — suggests the manufacturing pipeline.
              Swap the gradient tiles for real factory imagery later. */}
          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="relative rounded-3xl border border-sand bg-warmwhite p-3 shadow-soft">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-beige via-cream to-sand p-6 sm:p-7">
                <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-champagne/20 blur-2xl" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                      From Idea to Shelf
                    </span>
                    <p className="mt-3 max-w-xs font-serif text-xl font-semibold leading-snug text-ink sm:text-2xl">
                      One partner across the full bakery manufacturing journey.
                    </p>
                  </div>
                  <span className="hidden flex-none rounded-xl bg-warmwhite/80 p-2.5 text-gold shadow-card backdrop-blur sm:block">
                    <ShieldCheckIcon />
                  </span>
                </div>

                <div className="relative mt-6 grid grid-cols-2 gap-3">
                  {pipeline.map((stage, i) => (
                    <div
                      key={stage.label}
                      className="rounded-xl border border-white/70 bg-warmwhite/75 p-4 backdrop-blur"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient text-white shadow-card">
                          <stage.Icon width={18} height={18} />
                        </span>
                        <span className="font-serif text-sm font-bold text-champagne">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-charcoal">
                        {stage.label}
                      </p>
                      <p className="mt-0.5 text-xs leading-snug text-stone">
                        {stage.note}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Asset placeholder note (internal-facing, kept subtle) */}
                <p className="relative mt-5 border-t border-white/60 pt-4 text-[11px] leading-snug text-stone/80">
                  <span className="font-semibold text-stone">Image needed:</span>{" "}
                  real Al Shehail factory / bakery production line / packaging
                  operation.
                </p>
              </div>
            </div>

            {/* Floating proof chip — shown only at lg+, where the two-column
                layout gives it a clean anchor and avoids tablet overlap. */}
            <div className="absolute -bottom-5 left-6 hidden items-center gap-2.5 rounded-2xl border border-sand bg-warmwhite px-4 py-3 shadow-soft lg:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-beige text-gold">
                <RetailIcon width={18} height={18} />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-charcoal">
                  On UAE retail shelves
                </p>
                <p className="text-xs text-stone">Hypermarkets &amp; co-ops</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
