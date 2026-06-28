import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import AssetHint from "@/components/AssetHint";
import PrivateLabelHero from "@/components/private-label/PrivateLabelHero";
import PrivateLabelSectionNav from "@/components/private-label/PrivateLabelSectionNav";
import PrivateLabelProcess from "@/components/private-label/PrivateLabelProcess";
import {
  DevelopIcon,
  ProductionIcon,
  PackagingIcon,
  RetailIcon,
  ShieldCheckIcon,
  CalendarIcon,
} from "@/components/Icons";
import { certifications } from "@/lib/content";
import { assets, hasAsset, getAssetAlt } from "@/lib/assets";

export const metadata: Metadata = {
  title: {
    absolute:
      "Private Label Bakery Manufacturing UAE | Al Shehail Food Industries",
  },
  description:
    "Develop and manufacture bakery products under your brand with Al Shehail Food Industries — from product idea, recipe direction, sampling, packaging, quality control, and retail-ready supply.",
  alternates: { canonical: "/private-label" },
};

// ── Content (local arrays — merged from Private Label, Capabilities, Quality) ──

const trustProof = [
  "UAE-based bakery manufacturer",
  "Private label support",
  "Product development",
  "Quality-controlled production",
  "Retail-ready supply",
];

const audience = [
  "Food brands",
  "Retailers",
  "Supermarkets & hypermarkets",
  "Cafes & foodservice operators",
  "Institutional buyers",
  "Healthy bakery brands",
  "Date sweets & bakery snack brands",
];

const buildScope: { title: string; description: string; tag: string }[] = [
  {
    title: "Flatbread & Wraps",
    tag: "Product range",
    description:
      "Arabic bread, functional wraps, and grain-based bread formats for retail and foodservice.",
  },
  {
    title: "Soft Bread",
    tag: "Product range",
    description:
      "Toast, buns, rolls, and everyday bakery formats built for consistent supply.",
  },
  {
    title: "Pastry",
    tag: "Product range",
    description:
      "Croissants, mini croissants, and puff pastry formats for premium bakery ranges.",
  },
  {
    title: "Sweets",
    tag: "Product range",
    description: "Maa'moul, tamriya, cookies, and date-based bakery sweets.",
  },
  {
    title: "Custom Recipe Directions",
    tag: "Service",
    description:
      "Recipe development based on market position, product testing, and feasibility.",
  },
  {
    title: "Packaging Formats",
    tag: "Service",
    description:
      "Retail-ready packaging direction based on product type, brand, and supply needs.",
  },
];

const capabilityCards = [
  {
    title: "Product Development",
    Icon: DevelopIcon,
    text: "From brief to a finished, manufacturable bakery product.",
  },
  {
    title: "Recipe Customization",
    Icon: ProductionIcon,
    text: "Formulations tuned for taste, texture, and positioning.",
  },
  {
    title: "Private Label Manufacturing",
    Icon: PackagingIcon,
    text: "Production under your brand, to your specification.",
  },
  {
    title: "Retail-Ready Packing",
    Icon: PackagingIcon,
    text: "Packaging formats prepared for shelf and supply.",
  },
  {
    title: "Scalable Production Planning",
    Icon: ProductionIcon,
    text: "Output planned from sample through to volume.",
  },
  {
    title: "Quality-Controlled Process",
    Icon: ShieldCheckIcon,
    text: "Checks across handling, production, and packing.",
  },
  {
    title: "Sampling and Product Iteration",
    Icon: CalendarIcon,
    text: "Samples produced and refined to your brief.",
  },
  {
    title: "Market-Ready Product Support",
    Icon: RetailIcon,
    text: "Guidance toward a retail-ready launch.",
  },
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

const packaging = [
  "Pack format planning",
  "Brand-ready packaging support",
  "Multipack and box direction",
  "Retail shelf readiness",
  "Supply preparation",
  "Launch support",
];

const qualityProcess = [
  "Ingredient handling",
  "Recipe & batch control",
  "Hygiene process",
  "Production records",
  "Quality inspection",
  "Packaging checks",
  "Retail supply standards",
];

const certAssetKeys: Record<string, keyof typeof assets.certifications> = {
  "ISO Certified": "iso",
  "HACCP Certified": "haccp",
  "Organic Certified": "organic",
  "Carrefour Approved": "carrefourApproved",
};

const useCases: { title: string; text: string }[] = [
  {
    title: "Retail private label",
    text: "Bakery products developed and manufactured under your retail brand.",
  },
  {
    title: "Supermarket supply",
    text: "Consistent bakery formats prepared for retail shelf requirements.",
  },
  {
    title: "Foodservice supply",
    text: "Reliable bakery supply for cafes, catering, and operators.",
  },
  {
    title: "Healthy bakery product lines",
    text: "Whole grain, fiber-focused, or market-specific recipe directions where suitable.",
  },
  {
    title: "Date sweets product lines",
    text: "Traditional and modern date-based sweets for retail and gifting.",
  },
  {
    title: "Cafe & institutional products",
    text: "Bakery formats planned for repeatable supply and service needs.",
  },
];

const needFromYou = [
  "Product idea",
  "Target market",
  "Expected volume",
  "Product format",
  "Packaging direction",
  "Required standards or certifications",
  "Timeline",
];

// ── Small local building blocks ──

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function CheckCard({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-sand bg-cream px-4 py-3 text-sm font-medium text-charcoal">
      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-beige text-gold">
        <CheckIcon />
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
        {/* 1. Hero */}
        <PrivateLabelHero />

        {/* 2. Trust strip / quick value proof */}
        <section className="border-y border-sand/60 bg-warmwhite py-8">
          <div className="container-x">
            <ul className="flex flex-wrap items-center justify-center gap-2.5">
              {trustProof.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-sand bg-cream px-4 py-1.5 text-xs font-semibold text-charcoal sm:text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Sticky in-page nav */}
        <PrivateLabelSectionNav />

        {/* 3. Who We Build For */}
        <section id="overview" className="section scroll-mt-36">
          <div className="container-x">
            <SectionHeading
              eyebrow="Who We Build For"
              title="Built for brands, retailers, and foodservice buyers"
              description="Whether you are launching a new bakery line or expanding an existing retail range, Al Shehail supports the manufacturing path behind your brand."
            />
            <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {audience.map((a) => (
                <CheckCard key={a} label={a} />
              ))}
            </ul>
          </div>
        </section>

        {/* 4. What We Can Build With You */}
        <section
          id="products"
          className="section scroll-mt-36 border-y border-sand/50 bg-beige/30"
        >
          <div className="container-x">
            <SectionHeading
              eyebrow="Product Scope"
              title="What we can build with you"
              description="A bakery range spanning everyday staples, premium pastry, and date-based sweets — developed and packaged to your brand."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {buildScope.map((item) => (
                <div
                  key={item.title}
                  className="card-lift group rounded-2xl border border-sand bg-warmwhite p-6 shadow-card transition-colors hover:border-champagne/60"
                >
                  <span className="inline-flex items-center rounded-full border border-champagne/50 bg-cream px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
                    {item.tag}
                  </span>
                  <h3 className="mt-3 font-serif text-lg font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Capabilities Across the Line */}
        <section
          id="capabilities"
          className="section scroll-mt-36 border-t border-sand/60 bg-warmwhite"
        >
          <div className="container-x">
            <SectionHeading
              eyebrow="Capabilities"
              title="Capabilities across the full manufacturing line"
              description="A connected support model covering product development, recipe direction, sampling, packaging, production planning, quality control, and retail-ready supply."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {capabilityCards.map((cap) => (
                <div
                  key={cap.title}
                  className="card-lift group rounded-2xl border border-sand bg-cream p-6 shadow-card transition-colors hover:border-champagne/60"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-beige text-gold transition-colors group-hover:bg-gold-gradient group-hover:text-white">
                    <cap.Icon width={22} height={22} />
                  </span>
                  <h3 className="mt-5 font-serif text-base font-semibold text-ink">
                    {cap.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone">
                    {cap.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. From Idea to Shelf Process */}
        <section
          id="process"
          className="section scroll-mt-36 border-y border-sand/50 bg-beige/40"
        >
          <div className="container-x">
            <SectionHeading
              eyebrow="From Idea to Shelf"
              title="A clear path from product idea to retail-ready supply"
              description="A practical manufacturing journey that helps move your product from early brief to production, packaging, quality checks, and market-ready supply."
            />
            <PrivateLabelProcess />
          </div>
        </section>

        {/* 7. Recipe & Product Customization */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              align="left"
              eyebrow="Recipe & Product Customization"
              title="Recipes developed to your target market"
              description="Recipe direction depends on the product brief, market positioning, shelf-life needs, ingredient availability, production feasibility, and regulatory approval."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {recipeDirections.map((r) => (
                <CheckCard key={r} label={r} />
              ))}
            </ul>
            <div className="mt-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-champagne/40 bg-cream p-5">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-beige text-gold">
                <ShieldCheckIcon width={15} height={15} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                  Advisory note
                </p>
                <p className="mt-1 text-xs leading-relaxed text-stone">
                  All custom recipes are subject to product testing, shelf-life
                  requirements, ingredient availability, production feasibility,
                  and regulatory approval.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Packaging & Retail Readiness */}
        <section className="section border-y border-sand/50 bg-beige/30">
          <div className="container-x">
            <SectionHeading
              eyebrow="Packaging & Retail Readiness"
              title="Built for shelf, supply, and brand presentation"
              description="Private label manufacturing is not only about the recipe. The product also needs the right format, packaging direction, quality checks, and supply readiness."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {packaging.map((p, i) => (
                <div
                  key={p}
                  className="flex items-center gap-4 rounded-2xl border border-sand bg-warmwhite p-5"
                >
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-beige font-serif text-sm font-bold text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-base font-semibold text-charcoal">
                    {p}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Certifications & Quality */}
        <section
          id="quality"
          className="section scroll-mt-36 border-t border-sand/60 bg-warmwhite"
        >
          <div className="container-x">
            <SectionHeading
              eyebrow="Certifications & Quality"
              title="Quality you can put your brand behind"
              description="Certified standards and a structured, quality-controlled production process help support consistent retail-ready bakery supply."
            />

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {certifications.map((cert) => {
                const assetKey = certAssetKeys[cert.title];
                const logoPath = assetKey
                  ? assets.certifications[assetKey]
                  : null;
                return (
                  <div
                    key={cert.title}
                    className="card-lift group flex flex-col items-center rounded-2xl border border-sand bg-cream p-8 text-center shadow-card hover:border-champagne/60 hover:shadow-glow"
                  >
                    <span className="relative flex h-20 w-20 items-center justify-center">
                      {hasAsset(logoPath) ? (
                        <Image
                          src={logoPath}
                          alt={getAssetAlt(assetKey!, cert.title)}
                          width={80}
                          height={80}
                          className="h-20 w-20 object-contain"
                        />
                      ) : (
                        <>
                          <span className="absolute inset-0 rounded-full border-2 border-dashed border-champagne/40" />
                          <span className="absolute inset-2 rounded-full border border-champagne/30" />
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient text-white shadow-card">
                            <ShieldCheckIcon width={22} height={22} />
                          </span>
                        </>
                      )}
                    </span>
                    <h3 className="mt-5 font-serif text-lg font-semibold text-ink">
                      {cert.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">
                      {cert.description}
                    </p>
                    {!hasAsset(logoPath) && (
                      <AssetHint
                        label={
                          cert.title === "Carrefour Approved"
                            ? "Approval proof/logo needed"
                            : "Certificate scan/logo needed"
                        }
                        className="mt-4"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-10">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Quality Process
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {qualityProcess.map((q, i) => (
                  <div
                    key={q}
                    className="flex items-center gap-3 rounded-2xl border border-sand bg-cream p-4"
                  >
                    <span className="font-serif text-lg font-bold text-champagne/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold text-charcoal">
                      {q}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 10. Use Cases */}
        <section className="section border-y border-sand/50 bg-beige/30">
          <div className="container-x">
            <SectionHeading
              eyebrow="Use Cases"
              title="Where private label manufacturing applies"
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((u) => (
                <div
                  key={u.title}
                  className="card-lift rounded-2xl border border-sand bg-warmwhite p-6 transition-colors hover:border-champagne/60"
                >
                  <h3 className="font-serif text-base font-semibold text-ink">
                    {u.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    {u.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. What We Need From You */}
        <section
          id="start"
          className="section scroll-mt-36 border-t border-sand/60 bg-warmwhite"
        >
          <div className="container-x">
            <SectionHeading
              eyebrow="Start the Conversation"
              title="What we need to understand your project"
              description="A clear brief helps our team explore the right product direction, manufacturing fit, and private label supply path."
            />
            <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-sand bg-cream p-6 sm:p-8">
              <ul className="grid gap-3 sm:grid-cols-2">
                {needFromYou.map((n) => (
                  <CheckCard key={n} label={n} />
                ))}
              </ul>
              <div className="mt-7 flex flex-col items-center gap-3 border-t border-sand/70 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
                <p className="text-sm text-stone">
                  Share what you have so far — we’ll help shape the rest.
                </p>
                <Link href="/contact" className="btn-primary">
                  Start a Private Label Project
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 12. Final CTA */}
        <section className="section">
          <div className="container-x">
            <div className="relative overflow-hidden rounded-3xl border border-champagne/40 bg-gradient-to-br from-warmwhite via-cream to-beige px-6 py-16 text-center shadow-soft sm:px-12 lg:py-20">
              {/* Subtle static process-line watermark — no blur, no animation */}
              <svg
                className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-60"
                viewBox="0 0 400 400"
                fill="none"
                preserveAspectRatio="xMaxYMid slice"
                aria-hidden
              >
                <path
                  d="M-20 120 C 150 170, 95 250, 270 280 S 205 380, 430 400"
                  stroke="#C6A664"
                  strokeOpacity="0.16"
                  strokeWidth="1.5"
                />
                <path
                  d="M-20 180 C 165 230, 115 300, 305 330 S 245 420, 445 440"
                  stroke="#C6A664"
                  strokeOpacity="0.1"
                  strokeWidth="1.5"
                />
                <circle cx="270" cy="280" r="4" fill="#C6A664" fillOpacity="0.22" />
              </svg>

              <div className="relative mx-auto max-w-2xl">
                <span className="eyebrow">
                  <span className="h-px w-6 bg-champagne" />
                  From Idea to Shelf
                </span>
                <h2 className="heading-serif mt-5 text-3xl sm:text-4xl lg:text-[2.75rem]">
                  Ready to Build a Bakery Product Under Your Brand?
                </h2>
                <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
                  Share your product idea, target market, and expected volume —
                  our team will help you explore the right private label
                  manufacturing solution.
                </p>
                <div className="mt-8">
                  <Link href="/contact" className="btn-primary">
                    Start a Private Label Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
