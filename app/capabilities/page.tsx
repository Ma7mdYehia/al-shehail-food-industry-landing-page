import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/SectionHeading";
import {
  DevelopIcon,
  ProductionIcon,
  PackagingIcon,
  RetailIcon,
  ShieldCheckIcon,
  CalendarIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: {
    absolute: "Bakery Manufacturing Capabilities UAE | Al Shehail Food Industries",
  },
  description:
    "Explore Al Shehail Food Industries’ bakery manufacturing capabilities including product development, private label production, recipe customization, packaging support, and retail-ready supply.",
  alternates: { canonical: "/capabilities" },
};

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

const flow = [
  "Brief",
  "Recipe",
  "Sample",
  "Costing",
  "Packaging",
  "Production",
  "QC",
  "Supply",
];

const useCases = [
  "Retail private label",
  "Supermarket supply",
  "Foodservice supply",
  "Healthy bakery product lines",
  "Date sweets product lines",
  "Cafe & institutional products",
];

export default function CapabilitiesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Capabilities"
          title="Bakery Manufacturing Capabilities Built for Product Growth"
          subtitle="Flexible bakery manufacturing, recipe customization, packaging support, and retail-ready supply for brands and institutional buyers."
        >
          <a href="/contact" className="btn-primary">
            Discuss Your Project
          </a>
        </PageHero>

        {/* Capability cards */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading eyebrow="What We Do" title="Capabilities across the line" />
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

        {/* Process flow */}
        <section className="section">
          <div className="container-x">
            <SectionHeading
              eyebrow="From Concept to Supply"
              title="A clear path for every product"
            />
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {flow.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="flex items-center gap-2.5 rounded-full border border-sand bg-warmwhite px-4 py-2.5 shadow-card">
                    <span className="font-serif text-sm font-bold text-champagne">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold text-charcoal">
                      {step}
                    </span>
                  </span>
                  {i < flow.length - 1 && (
                    <svg
                      className="text-champagne"
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
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading eyebrow="Use Cases" title="Where our capabilities apply" />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((u) => (
                <div
                  key={u}
                  className="rounded-2xl border border-sand bg-cream p-5 font-serif text-base font-semibold text-charcoal"
                >
                  {u}
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaBand
          eyebrow="Let's Talk"
          title="Put Our Capabilities Behind Your Brand"
          text="From product development to retail-ready supply, we’ll help you bring your bakery product to market."
          primary={{ label: "Request a Consultation", href: "/contact" }}
        />
      </main>
      <Footer />
    </>
  );
}
