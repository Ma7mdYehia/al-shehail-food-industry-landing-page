import Image from "next/image";
import { trustBadges } from "@/lib/content";
import { assets, hasAsset, getAssetAlt } from "@/lib/assets";
import HeroSystem from "./hero/HeroSystem";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-36 lg:pt-44 lg:pb-28"
    >
      {/* Warm decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-warmwhite via-cream to-beige/40" />
        <div className="oven-glow absolute inset-x-0 top-0 h-[60%]" />
        <div className="bg-grain absolute inset-0 opacity-60" />
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
              <a href="/contact" className="btn-primary group">
                Start a Project
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

          {/* Hero visual — real factory photo when available, otherwise the
              premium CSS/SVG manufacturing-system visual. */}
          <div className="relative animate-fade-up [animation-delay:120ms]">
            {hasAsset(assets.factory.exterior) ? (
              <div className="glow-border relative overflow-hidden rounded-3xl bg-warmwhite p-3 shadow-soft">
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src={assets.factory.exterior}
                    alt={getAssetAlt("exterior")}
                    width={720}
                    height={480}
                    priority
                    className="aspect-[3/2] w-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <HeroSystem />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
