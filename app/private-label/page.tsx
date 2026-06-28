import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/SectionHeading";
import ProcessJourney from "@/components/ProcessJourney";
import AssetHint from "@/components/AssetHint";
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

const buildScope: { title: string; description: string }[] = [
  {
    title: "Flatbread & Wraps",
    description:
      "Arabic bread, functional wraps, and grain-based bread formats for retail and foodservice.",
  },
  {
    title: "Soft Bread",
    description:
      "Toast, buns, rolls, and everyday bakery formats built for consistent supply.",
  },
  {
    title: "Pastry",
    description:
      "Croissants, mini croissants, and puff pastry formats for premium bakery ranges.",
  },
  {
    title: "Sweets",
    description: "Maa'moul, tamriya, cookies, and date-based bakery sweets.",
  },
  {
    title: "Custom Recipe Directions",
    description:
      "Recipe development based on market position, product testing, and feasibility.",
  },
  {
    title: "Packaging Formats",
    description:
      "Retail-ready packaging direction based on product type, brand, and supply needs.",
  },
];

const capabilityCards = [
  { title: "Product Development", Icon: DevelopIcon },
  { title: "Recipe Customization", Icon: ProductionIcon },
  { title: "Private Label Manufacturing", Icon: PackagingIcon },
  { title: "Retail-Ready Packing", Icon: PackagingIcon },
  { title: "Scalable Production Planning", Icon: ProductionIcon },
  { title: "Quality-Controlled Process", Icon: ShieldCheckIcon },
  { title: "Sampling and Product Iteration", Icon: CalendarIcon },
  { title: "Market-Ready Product Support", Icon: RetailIcon },
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

function Bullet({ label }: { label: string }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl border border-sand bg-cream p-4 text-sm font-medium text-charcoal">
      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-beige text-gold">
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
        <PageHero
          eyebrow="Private Label Bakery Manufacturing"
          title="Your Bakery Product, Built From Idea to Shelf"
          subtitle="Develop, manufacture, package, and supply bakery products under your brand — with certified quality and retail-ready execution."
        >
          <a href="/contact" className="btn-primary">
            Start a Private Label Project
          </a>
          <a href="#process" className="btn-secondary">
            Explore the Process
          </a>
        </PageHero>

        {/* 2. Trust strip / quick value proof */}
        <section className="border-y border-sand/60 bg-warmwhite py-8">
          <div className="container-x">
            <ul className="flex flex-wrap items-center justify-center gap-2.5">
              {trustProof.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-sand bg-cream px-4 py-1.5 text-xs font-semibold text-charcoal sm:text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. Who We Build For */}
        <section id="overview" className="section scroll-mt-24">
          <div className="container-x">
            <SectionHeading
              eyebrow="Who We Build For"
              title="Built for brands, retailers, and foodservice buyers"
              description="Whether you are launching a new bakery line or expanding an existing retail range, Al Shehail supports the manufacturing path behind your brand."
            />
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

        {/* 4. What We Can Build With You */}
        <section
          id="products"
          className="section scroll-mt-24 border-t border-sand/60 bg-warmwhite"
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
                  className="rounded-2xl border border-sand bg-cream p-6"
                >
                  <h3 className="font-serif text-lg font-semibold text-ink">
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
        <section id="capabilities" className="section scroll-mt-24">
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
                  className="rounded-2xl border border-sand bg-cream p-6 shadow-card"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-beige text-gold">
                    <cap.Icon width={22} height={22} />
                  </span>
                  <h3 className="mt-5 font-serif text-base font-semibold text-ink">
                    {cap.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. From Idea to Shelf Process */}
        <section
          id="process"
          className="section scroll-mt-24 border-t border-sand/60 bg-warmwhite"
        >
          <div className="container-x">
            <SectionHeading
              eyebrow="From Idea to Shelf"
              title="A clear path from product idea to retail-ready supply"
              description="A practical manufacturing journey that helps move your product from early brief to production, packaging, quality checks, and market-ready supply."
            />
            <ProcessJourney />
          </div>
        </section>

        {/* 7. Recipe & Product Customization */}
        <section className="section">
          <div className="container-x">
            <SectionHeading
              align="left"
              eyebrow="Recipe & Product Customization"
              title="Recipes developed to your target market"
              description="Recipe direction depends on the product brief, market positioning, shelf-life needs, ingredient availability, production feasibility, and regulatory approval."
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

        {/* 8. Packaging & Retail Readiness */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              eyebrow="Packaging & Retail Readiness"
              title="Built for shelf, supply, and brand presentation"
              description="Private label manufacturing is not only about the recipe. The product also needs the right format, packaging direction, quality checks, and supply readiness."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {packaging.map((p) => (
                <div
                  key={p}
                  className="rounded-2xl border border-sand bg-cream p-5 font-serif text-base font-semibold text-charcoal"
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Certifications & Quality */}
        <section id="quality" className="section scroll-mt-24">
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
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {qualityProcess.map((q, i) => (
                  <div
                    key={q}
                    className="flex items-center gap-4 rounded-2xl border border-sand bg-cream p-5"
                  >
                    <span className="font-serif text-2xl font-bold text-champagne/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-base font-semibold text-charcoal">
                      {q}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 10. Use Cases */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              eyebrow="Use Cases"
              title="Where private label manufacturing applies"
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((u) => (
                <div
                  key={u.title}
                  className="rounded-2xl border border-sand bg-cream p-6"
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
        <section id="start" className="section scroll-mt-24">
          <div className="container-x">
            <SectionHeading
              eyebrow="Start the Conversation"
              title="What we need to understand your project"
              description="A clear brief helps our team explore the right product direction, manufacturing fit, and private label supply path."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {needFromYou.map((n, i) => (
                <div
                  key={n}
                  className="flex items-center gap-4 rounded-2xl border border-sand bg-cream p-5"
                >
                  <span className="font-serif text-2xl font-bold text-champagne/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-base font-semibold text-charcoal">
                    {n}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 12. Final CTA */}
        <CtaBand
          eyebrow="From Idea to Shelf"
          title="Ready to Build a Bakery Product Under Your Brand?"
          text="Share your product idea, target market, and expected volume — our team will help you explore the right private label manufacturing solution."
          primary={{ label: "Start a Private Label Project", href: "/contact" }}
        />
      </main>
      <Footer />
    </>
  );
}
