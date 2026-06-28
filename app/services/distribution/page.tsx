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
  RetailIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ProductionIcon,
  DevelopIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: {
    absolute: "Distribution Fleet & Retail Reach | Al Shehail Food Industries",
  },
  description:
    "From finished bakery products to retail-ready movement, Al Shehail supports brands with distribution coordination after production — route-to-market and delivery planning confirmed per project.",
  alternates: { canonical: "/services/distribution" },
};

const coverage = [
  {
    title: "Finished Product Movement",
    description:
      "Support for moving retail-ready bakery products after production.",
    Icon: PackagingIcon,
  },
  {
    title: "Retail Channel Coordination",
    description:
      "Helping organize product flow toward selected retail and sales channels.",
    Icon: RetailIcon,
  },
  {
    title: "Delivery Planning",
    description:
      "Coordination around product readiness, dispatch timing, and route needs.",
    Icon: CalendarIcon,
  },
  {
    title: "Product Handling Awareness",
    description:
      "Distribution thinking built around bakery products, packaging condition, and freshness requirements.",
    Icon: ShieldCheckIcon,
  },
  {
    title: "Launch & Replenishment Support",
    description:
      "Useful for product launches, recurring supply, and controlled market rollout.",
    Icon: ProductionIcon,
  },
  {
    title: "Private Label Route-to-Market",
    description:
      "Distribution support that connects with private-label manufacturing projects.",
    Icon: DevelopIcon,
  },
];

const process = [
  {
    title: "Product Ready",
    text: "Finished product is confirmed after production and packing.",
  },
  {
    title: "Dispatch Planning",
    text: "Quantities, timing, and delivery requirements are organized.",
  },
  {
    title: "Route Coordination",
    text: "Distribution movement is planned based on destination and channel needs.",
  },
  {
    title: "Retail Delivery Support",
    text: "Products move toward selected retail points or agreed channels.",
  },
  {
    title: "Follow-Up",
    text: "Coordination continues around supply rhythm, replenishment, and launch needs.",
  },
];

const audience = [
  "Food brands launching bakery products",
  "Private-label clients",
  "Healthy bread brands",
  "Retail bakery product owners",
  "Date-based sweets and pastry brands",
  "Brands needing production and distribution support from one partner",
];

const related = [
  {
    title: "Private Label Manufacturing",
    description:
      "Develop and manufacture bakery products under your brand, end to end.",
    href: "/private-label",
  },
  {
    title: "Packaging & Brand Design",
    description:
      "Packaging and brand presentation support for retail-ready products.",
    href: "/services/brand-design",
  },
  {
    title: "Food Digital Marketing",
    description:
      "Digital marketing support to help food products communicate online.",
    href: "/services/digital-marketing",
  },
];

export default function DistributionPage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero */}
        <PageHero
          eyebrow="Services · Distribution"
          title="Distribution Fleet & Retail Reach"
          subtitle="From finished bakery products to retail-ready movement, Al Shehail supports brands with distribution coordination after production."
        >
          <a href="/contact" className="btn-primary">
            Start a Distribution Project
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
                title="Production is the start, not the finish"
                description="After manufacturing, the next challenge is getting products prepared, organized, and moved into the right retail channels. Al Shehail's distribution support helps food brands connect production with retail execution."
              />
            </div>
          </div>
        </section>

        {/* 3. What the service covers */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <ServiceFeatureGrid
              eyebrow="What We Support"
              title="Distribution support after production"
              description="Practical, operational support that connects finished products with the right route to market."
              items={coverage}
            />
          </div>
        </section>

        {/* 4. Process */}
        <section className="section border-y border-sand/50 bg-beige/40">
          <div className="container-x">
            <ServiceProcess
              eyebrow="How It Works"
              title="A clear path from product ready to retail"
              description="A simple coordination flow that keeps finished product moving toward its market."
              steps={process}
            />
          </div>
        </section>

        {/* 5. Who this service is for */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              eyebrow="Who It's For"
              title="Built for brands that need more than production"
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

        {/* 6. Integration with other services */}
        <section className="section border-y border-sand/50 bg-beige/30">
          <div className="container-x">
            <ServiceRelatedServices
              eyebrow="One Connected Partner"
              title="Distribution connects with the wider service ecosystem"
              description="Distribution works alongside manufacturing, packaging, and marketing so a brand can move from idea to market with one partner."
              items={related}
            />
          </div>
        </section>

        {/* 7. Trust / careful claims note */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <div className="mx-auto flex max-w-3xl items-start gap-4 rounded-2xl border border-champagne/40 bg-cream p-6 sm:p-7">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-beige text-gold">
                <ShieldCheckIcon width={18} height={18} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                  How scope is defined
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone">
                  Distribution scope, retail channels, delivery schedule, and
                  coverage are confirmed per project based on product type,
                  quantity, packaging, and market requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Final CTA */}
        <CtaBand
          eyebrow="Beyond Production"
          title="Ready to move your product beyond production?"
          text="Talk to Al Shehail about production, packing, and distribution support for your food brand."
          primary={{ label: "Start a Project", href: "/contact" }}
          secondary={{ label: "View Products", href: "/products" }}
        />
      </main>
      <Footer />
    </>
  );
}
