import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/SectionHeading";
import ServiceFeatureGrid from "@/components/services/ServiceFeatureGrid";
import ServiceProcess from "@/components/services/ServiceProcess";
import ServiceRelatedServices from "@/components/services/ServiceRelatedServices";
import {
  PackagingIcon,
  DevelopIcon,
  RetailIcon,
  ProductionIcon,
  CalendarIcon,
  ShieldCheckIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: {
    absolute: "Packaging & Brand Design | Al Shehail Food Industries",
  },
  description:
    "Food-focused packaging and brand presentation support for products moving from production to retail shelves — packaging direction connected to private-label manufacturing.",
  alternates: { canonical: "/services/brand-design" },
};

const coverage = [
  {
    title: "Packaging Visual Direction",
    description:
      "Visual direction for food packaging that fits the product category, audience, and retail environment.",
    Icon: PackagingIcon,
  },
  {
    title: "Product Naming & Range Structure",
    description:
      "Support for organizing product names, variants, and range logic in a clear customer-facing way.",
    Icon: DevelopIcon,
  },
  {
    title: "Front-of-Pack Communication",
    description:
      "Helping define the key messages that should appear clearly on the pack without overloading the design.",
    Icon: RetailIcon,
  },
  {
    title: "Retail-Ready Pack Layout",
    description:
      "Design direction that considers shelf presence, readability, hierarchy, and product recognition.",
    Icon: ProductionIcon,
  },
  {
    title: "Private Label Packaging Support",
    description:
      "Packaging support for brands developing products with Al Shehail's manufacturing team.",
    Icon: CalendarIcon,
  },
  {
    title: "Product Story & Claims Review",
    description:
      "Conservative communication guidance to avoid unclear or unsupported product claims.",
    Icon: ShieldCheckIcon,
  },
];

const process = [
  {
    title: "Product Understanding",
    text: "Understand the product type, target customer, category, and retail use case.",
  },
  {
    title: "Positioning Direction",
    text: "Define how the product should be presented: healthy, premium, traditional, family, functional, date-based, or pastry.",
  },
  {
    title: "Packaging Structure",
    text: "Organize the pack hierarchy: product name, variant, benefits, flavor/type, usage, and required information.",
  },
  {
    title: "Visual Design Direction",
    text: "Develop the visual look and feel for the packaging, including color direction, typography, imagery, and layout system.",
  },
  {
    title: "Retail-Ready Handoff",
    text: "Prepare design direction and communication logic to support printing, production, and retail presentation.",
  },
];

const deliverables = [
  "Product packaging direction",
  "Label and pack communication hierarchy",
  "Product range system",
  "Variant naming and visual coding",
  "Front-of-pack message structure",
  "Social launch visuals direction",
  "Retail presentation assets direction",
  "Private label brand presentation",
];

const categories = [
  "Healthy bread and functional bakery products",
  "Flatbread and wraps",
  "Toast, buns, and soft bread",
  "Croissants and pastry",
  "Maa'moul, tamriya, cookies, and date-based sweets",
  "Private-label retail products",
];

const related = [
  {
    title: "Private Label Manufacturing",
    description:
      "Develop and manufacture bakery products under your brand, end to end.",
    href: "/private-label",
  },
  {
    title: "Distribution Fleet & Retail Reach",
    description:
      "Distribution coordination that moves finished products toward retail.",
    href: "/services/distribution",
  },
  {
    title: "Food Digital Marketing",
    description:
      "Digital marketing support to help food products communicate online.",
    href: "/services/digital-marketing",
  },
];

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

export default function BrandDesignPage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero */}
        <PageHero
          eyebrow="Services · Brand Design"
          title="Packaging & Brand Design"
          subtitle="Food-focused packaging and brand presentation support for products moving from production to retail shelves."
        >
          <a href="/contact" className="btn-primary">
            Start a Packaging Project
          </a>
          <a href="/private-label" className="btn-secondary">
            Explore Private Label Manufacturing
          </a>
        </PageHero>

        {/* 2. Intro */}
        <section className="section">
          <div className="container-x">
            <div className="max-w-3xl">
              <SectionHeading
                align="left"
                eyebrow="Overview"
                title="More than a logo — packaging that communicates"
                description="From product positioning to pack communication, Al Shehail supports food brands with packaging and brand design direction that connects manufacturing, retail presentation, and customer understanding."
              />
            </div>
          </div>
        </section>

        {/* 3. What the service covers */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <ServiceFeatureGrid
              eyebrow="What We Support"
              title="Packaging and brand presentation support"
              description="Design direction built around food products, retail shelves, and clear customer communication."
              items={coverage}
            />
          </div>
        </section>

        {/* 4. Brand design process */}
        <section className="section border-y border-sand/50 bg-beige/40">
          <div className="container-x">
            <ServiceProcess
              eyebrow="How It Works"
              title="A clear path from product to pack"
              description="A simple direction-led flow from understanding the product to a retail-ready handoff."
              steps={process}
            />
          </div>
        </section>

        {/* 5. What we can help design */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              eyebrow="Deliverables"
              title="What we can help design"
              description="Support, direction, and design preparation across packaging and brand presentation."
            />
            <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {deliverables.map((d) => (
                <li
                  key={d}
                  className="flex items-center gap-3 rounded-xl border border-sand bg-cream px-4 py-3 text-sm font-medium text-charcoal"
                >
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-beige text-gold">
                    <CheckIcon />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 6. Food categories this fits */}
        <section className="section border-y border-sand/50 bg-beige/30">
          <div className="container-x">
            <SectionHeading
              eyebrow="Category Fit"
              title="Food categories this fits"
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <div
                  key={c}
                  className="rounded-2xl border border-sand bg-warmwhite p-5 font-serif text-base font-semibold text-charcoal"
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Integration with other services */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <ServiceRelatedServices
              eyebrow="One Connected Partner"
              title="Brand design connects with the wider service ecosystem"
              description="Packaging and brand design work alongside manufacturing, distribution, and marketing so a product is ready for production and the shelf."
              items={related}
            />
          </div>
        </section>

        {/* 8. Trust / careful claims note */}
        <section className="section border-y border-sand/50 bg-beige/30">
          <div className="container-x">
            <div className="mx-auto flex max-w-3xl items-start gap-4 rounded-2xl border border-champagne/40 bg-cream p-6 sm:p-7">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-beige text-gold">
                <ShieldCheckIcon width={18} height={18} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                  Before final printing
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone">
                  Packaging claims, nutrition statements, ingredient callouts,
                  and compliance details should be confirmed against verified
                  product specifications and market requirements before final
                  printing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Final CTA */}
        <CtaBand
          eyebrow="Built for the Shelf"
          title="Need packaging that fits the product and the shelf?"
          text="Talk to Al Shehail about packaging direction, private-label presentation, and retail-ready food product communication."
          primary={{ label: "Start a Packaging Project", href: "/contact" }}
          secondary={{ label: "View Products", href: "/products" }}
        />
      </main>
      <Footer />
    </>
  );
}
