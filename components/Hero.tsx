import { trustBadges } from "@/lib/content";

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

            <h1 className="heading-serif mt-6 text-4xl sm:text-5xl lg:text-6xl">
              Private Label Bakery Manufacturing in the UAE
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">
              From product concept to retail-ready bakery solutions — developed,
              manufactured, packed, and scaled for modern food brands.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#contact" className="btn-primary">
                Start a Project
              </a>
              <a href="#products" className="btn-secondary">
                Explore Products
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-2.5">
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

          {/* Visual panel */}
          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="relative rounded-3xl border border-sand bg-warmwhite p-3 shadow-soft">
              <div className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-beige via-cream to-sand p-8">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-champagne/20 blur-2xl" />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                    From Idea to Shelf
                  </span>
                  <p className="mt-3 font-serif text-2xl font-semibold leading-snug text-ink">
                    We develop and manufacture bakery products built for retail
                    success.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["Develop", "Manufacture", "Pack", "Scale"].map((stage, i) => (
                    <div
                      key={stage}
                      className="rounded-xl border border-white/60 bg-warmwhite/70 px-4 py-3 backdrop-blur"
                    >
                      <span className="font-serif text-sm font-bold text-gold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-1 text-sm font-semibold text-charcoal">
                        {stage}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
