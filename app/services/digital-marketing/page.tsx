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
  CalendarIcon,
  RetailIcon,
  DevelopIcon,
  ProductionIcon,
  PackagingIcon,
  ShieldCheckIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: {
    absolute: "Food Digital Marketing | Al Shehail Food Industries",
  },
  description:
    "Digital marketing support for food products, helping brands communicate clearly from product launch to online customer awareness — built on verified product details.",
  alternates: { canonical: "/services/digital-marketing" },
};

const coverage = [
  {
    title: "Product Launch Content",
    description:
      "Campaign direction and content planning for new food product launches.",
    Icon: CalendarIcon,
  },
  {
    title: "Social Media Communication",
    description:
      "Clear product messaging for Instagram, Facebook, LinkedIn, and other online channels.",
    Icon: RetailIcon,
  },
  {
    title: "Food Product Storytelling",
    description:
      "Turning product features, ingredients, process, and packaging into customer-facing content.",
    Icon: DevelopIcon,
  },
  {
    title: "Performance Campaign Direction",
    description:
      "Marketing structure and campaign direction for awareness, lead generation, or retail support.",
    Icon: ProductionIcon,
  },
  {
    title: "Retail & Online Product Assets",
    description:
      "Digital content direction for product pages, marketplace listings, and retail communication.",
    Icon: PackagingIcon,
  },
  {
    title: "Private Label Marketing Support",
    description:
      "Marketing support for products developed through Al Shehail's private-label manufacturing service.",
    Icon: ShieldCheckIcon,
  },
];

const process = [
  {
    title: "Product Understanding",
    text: "Understand the product, category, ingredients, target customer, and market positioning.",
  },
  {
    title: "Message Strategy",
    text: "Define the key product messages, benefits, use cases, and customer-facing story.",
  },
  {
    title: "Content Direction",
    text: "Plan the content formats needed for launch, social media, website, retail, or paid campaigns.",
  },
  {
    title: "Campaign Structure",
    text: "Organize the campaign flow: awareness, product education, retail support, or lead generation.",
  },
  {
    title: "Review & Optimization Direction",
    text: "Review content and campaign direction based on actual market feedback and verified product information.",
  },
];

const deliverables = [
  "Social media content direction",
  "Launch campaign planning",
  "Product storytelling",
  "Product page copy direction",
  "Marketplace listing content direction",
  "Paid campaign structure",
  "Food photography/video brief direction",
  "Retail promotion communication",
  "Private-label brand communication",
];

const categories = [
  "Healthy bread and functional bakery products",
  "Flatbread and wraps",
  "Toast, buns, and soft bread",
  "Croissants and pastry",
  "Maa'moul, tamriya, cookies, and date-based sweets",
  "Private-label food brands",
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
      "Food-focused packaging direction and brand presentation for retail.",
    href: "/services/brand-design",
  },
  {
    title: "Distribution Fleet & Retail Reach",
    description:
      "Distribution coordination that moves finished products toward retail.",
    href: "/services/distribution",
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

export default function DigitalMarketingPage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero */}
        <PageHero
          eyebrow="Services · Digital Marketing"
          title="Food Digital Marketing"
          subtitle="Digital marketing support for food products, helping brands communicate clearly from product launch to online customer awareness."
        >
          <a href="/contact" className="btn-primary">
            Start a Marketing Project
          </a>
          <a href="/services/brand-design" className="btn-secondary">
            Explore Brand Design
          </a>
        </PageHero>

        {/* 2. Intro */}
        <section className="section">
          <div className="container-x">
            <div className="max-w-3xl">
              <SectionHeading
                align="left"
                eyebrow="Overview"
                title="From production story to customer-facing content"
                description="Al Shehail supports food brands with digital marketing direction built around real product details, packaging communication, and retail readiness — helping products move from production story to customer-facing content."
              />
            </div>
          </div>
        </section>

        {/* 3. What the service covers */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <ServiceFeatureGrid
              eyebrow="What We Support"
              title="Food-product digital marketing support"
              description="Marketing direction built around real products, packaging, and retail readiness — not generic content."
              items={coverage}
            />
          </div>
        </section>

        {/* 4. Digital marketing process */}
        <section className="section border-y border-sand/50 bg-beige/40">
          <div className="container-x">
            <ServiceProcess
              eyebrow="How It Works"
              title="A clear path from product to campaign"
              description="A simple, direction-led flow from understanding the product to a structured campaign."
              steps={process}
            />
          </div>
        </section>

        {/* 5. Marketing deliverables */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              eyebrow="Deliverables"
              title="Where we can support"
              description="Direction, planning, and content structure across launch and online communication."
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
              title="Marketing connects with the wider service ecosystem"
              description="Digital marketing works alongside manufacturing, packaging, and distribution so a product is communicated as clearly as it is made."
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
                  Before public communication
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone">
                  Marketing messages, nutrition statements, product claims, and
                  ingredient callouts should be based on verified product
                  specifications before use in campaigns or public
                  communication.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Final CTA */}
        <CtaBand
          eyebrow="Launch Online"
          title="Ready to launch your food product online?"
          text="Talk to Al Shehail about product communication, launch content, and digital marketing support for your food brand."
          primary={{ label: "Start a Marketing Project", href: "/contact" }}
          secondary={{ label: "Explore Products", href: "/products" }}
        />
      </main>
      <Footer />
    </>
  );
}
