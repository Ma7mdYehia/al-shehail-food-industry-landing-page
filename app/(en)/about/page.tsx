import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/SectionHeading";
import { company } from "@/lib/content";
import {
  DevelopIcon,
  PackagingIcon,
  RetailIcon,
  ProductionIcon,
  ShieldCheckIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: { absolute: "About Al Shehail Food Industries | Bakery Manufacturing UAE" },
  description:
    "Learn about Al Shehail Food Industries, a UAE-based bakery manufacturing and private label partner supporting product development, certified production, and retail-ready bakery supply.",
  alternates: { canonical: "/about" },
};

const differentiators = [
  {
    title: "Product development mindset",
    text: "We approach every brief as a product to be developed, not just an order to be filled.",
    Icon: DevelopIcon,
  },
  {
    title: "Private label manufacturing support",
    text: "Dedicated support for brands building bakery ranges under their own label.",
    Icon: PackagingIcon,
  },
  {
    title: "Retail-ready production thinking",
    text: "Products engineered for shelf life, packaging, and merchandising from the start.",
    Icon: RetailIcon,
  },
  {
    title: "Flexible product customization",
    text: "Recipes, formats, and packaging adapted to the target market and brand brief.",
    Icon: ProductionIcon,
  },
  {
    title: "Quality-controlled process",
    text: "A structured, hygiene-controlled process with checks across production.",
    Icon: ShieldCheckIcon,
  },
];

const philosophyPoints = [
  "Modern bakery products built for today’s retail and foodservice demand",
  "A cleaner ingredient direction where suitable",
  "Natural ingredients where suitable for the product and process",
  "Reduced unnecessary additives where suitable",
  "Recipe testing for quality and batch-to-batch consistency",
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="About Al Shehail"
          title="UAE-Based Bakery Manufacturing Partner"
          subtitle="Al Shehail Food Industries is a UAE-based bakery manufacturing company specialized in modern bakery products, private label production, and product development for retail and institutional markets."
        >
          <Link href="/private-label" className="btn-primary">
            Explore Private Label
          </Link>
          <Link href="/contact" className="btn-secondary">
            Contact Us
          </Link>
        </PageHero>

        {/* About */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              align="left"
              eyebrow="Who We Are"
              title="A bakery manufacturer built around brands"
              description="Al Shehail Food Industries is a UAE-based bakery manufacturer with a modern, healthy-leaning production direction. We combine product development, manufacturing, and private label support under one partner — serving retail and institutional markets."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "UAE-based bakery manufacturer",
                "Modern & healthy manufacturing direction",
                "Development + production + private label",
                "Retail & institutional market focus",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-sand bg-cream p-5 text-sm font-medium text-charcoal"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Differentiators */}
        <section className="section">
          <div className="container-x">
            <SectionHeading
              eyebrow="What Makes Us Different"
              title="More than a bakery production line"
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {differentiators.map((d) => (
                <div
                  key={d.title}
                  className="rounded-2xl border border-sand bg-warmwhite p-6 shadow-card"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-beige text-gold">
                    <d.Icon width={22} height={22} />
                  </span>
                  <h3 className="mt-5 font-serif text-lg font-semibold text-ink">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    {d.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Manufacturing philosophy */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <SectionHeading
                align="left"
                eyebrow="Manufacturing Philosophy"
                title="Modern bakery, made with intent"
                description="We focus on modern bakery products with a cleaner ingredient direction where suitable. Specific formulations depend on the product brief and are subject to recipe testing and shelf-life requirements."
              />
              <ul className="space-y-3">
                {philosophyPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 rounded-2xl border border-sand bg-cream p-4 text-sm text-charcoal"
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-beige text-gold">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="section">
          <div className="container-x">
            <div className="flex flex-col items-start gap-4 rounded-2xl border border-sand bg-cream p-7 sm:flex-row sm:items-center sm:gap-6">
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gold-gradient text-white shadow-card">
                <RetailIcon width={22} height={22} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  Location
                </p>
                <p className="mt-1 font-serif text-lg font-semibold text-ink">
                  {company.location}
                </p>
              </div>
            </div>
          </div>
        </section>

        <CtaBand
          eyebrow="Work With Us"
          title="Let’s build your bakery product"
          text="Explore how Al Shehail can develop and manufacture your product under your own brand."
          primary={{ label: "Explore Private Label", href: "/private-label" }}
          secondary={{ label: "Contact Us", href: "/contact" }}
        />
      </main>
      <Footer />
    </>
  );
}
