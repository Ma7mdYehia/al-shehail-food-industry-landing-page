import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/SectionHeading";
import { privateLabelSteps } from "@/lib/content";

export const metadata: Metadata = {
  title: {
    absolute:
      "Private Label Bakery Manufacturing UAE | Al Shehail Food Industries",
  },
  description:
    "Develop and manufacture bakery products under your own brand with Al Shehail Food Industries, including recipe development, packaging support, certified production, and retail-ready supply.",
  alternates: { canonical: "/private-label" },
};

const audience = [
  "Food brands",
  "Retailers",
  "Supermarkets & hypermarkets",
  "Cafes & foodservice operators",
  "Institutional buyers",
  "Healthy bakery brands",
  "Date sweets & bakery snack brands",
];

const support = [
  "Product development",
  "Recipe customization",
  "Private label manufacturing",
  "Packaging support",
  "Quality control",
  "Retail-ready supply",
  "Scaling from sample to production",
];

const recipeDirections = [
  "Standard recipes",
  "Health-focused recipes",
  "Clean label direction",
  "No added sugar where technically suitable",
  "Reduced sugar where suitable",
  "No preservatives where shelf life and process allow",
  "Whole wheat / fiber-focused directions where suitable",
  "Size, format, flavor, and filling customization",
];

function Bullet({ label }: { label: string }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl border border-sand bg-cream p-4 text-sm font-medium text-charcoal">
      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-beige text-gold">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
      {label}
    </li>
  );
}

export default function PrivateLabelPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Private Label Solutions"
          title="Your Bakery Brand, Manufactured End-to-End"
          subtitle="From product idea and recipe development to packaging, production, quality control, and retail-ready supply."
        >
          <a href="/contact" className="btn-primary">
            Start a Private Label Project
          </a>
        </PageHero>

        {/* Who this is for */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading eyebrow="Who It's For" title="Built for brands and buyers" />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {audience.map((a) => (
                <div
                  key={a}
                  className="rounded-2xl border border-sand bg-cream p-5 font-serif text-base font-semibold text-charcoal"
                >
                  {a}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8-step process */}
        <section className="section">
          <div className="container-x">
            <SectionHeading
              eyebrow="The Process"
              title="From idea to shelf, in eight steps"
              description="A clear, proven manufacturing path that takes your concept all the way to a certified, retail-ready, branded bakery product."
            />
            <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {privateLabelSteps.map((step) => (
                <li
                  key={step.number}
                  className="flex flex-col rounded-2xl border border-sand bg-warmwhite p-6 shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gold-gradient font-serif text-base font-bold text-white shadow-card">
                      {step.number}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-champagne/50 to-transparent" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* What we support */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              eyebrow="What We Support"
              title="End-to-end manufacturing support"
            />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {support.map((s) => (
                <Bullet key={s} label={s} />
              ))}
            </ul>
          </div>
        </section>

        {/* Custom recipe direction */}
        <section className="section">
          <div className="container-x">
            <SectionHeading
              align="left"
              eyebrow="Custom Recipe Direction"
              title="Recipes developed to your target market"
              description="Depending on the product brief, recipes can be developed in a range of directions:"
            />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {recipeDirections.map((r) => (
                <Bullet key={r} label={r} />
              ))}
            </ul>
            <p className="mt-8 max-w-3xl rounded-2xl border border-sand bg-cream p-5 text-xs leading-relaxed text-stone">
              All custom recipes are subject to product testing, shelf-life
              requirements, ingredient availability, production feasibility, and
              regulatory approval.
            </p>
          </div>
        </section>

        <CtaBand
          title="Build Your Bakery Brand With Al Shehail"
          text="Tell us about your product idea and target market — we’ll help you take it from concept to retail-ready supply."
          primary={{ label: "Start a Private Label Project", href: "/contact" }}
        />
      </main>
      <Footer />
    </>
  );
}
