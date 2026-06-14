import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/SectionHeading";
import AssetHint from "@/components/AssetHint";
import { manufacturingPartners, retailPresence } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Partners & Market Presence | Al Shehail Food Industries UAE" },
  description:
    "See Al Shehail Food Industries’ manufacturing partners and market presence across leading UAE retail chains, supporting bakery brands with private label and retail-ready production.",
  alternates: { canonical: "/partners" },
};

function monogram(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function PartnersPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Partners & Presence"
          title="Manufacturing Partners & Market Presence"
          subtitle="Al Shehail Food Industries supports bakery brands and retail supply through private label manufacturing, product development, and market-ready production."
        >
          <a href="/contact" className="btn-primary">
            Become a Partner
          </a>
        </PageHero>

        {/* Manufacturing partners */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              eyebrow="Manufacturing Partner For"
              title="Trusted by established food brands"
              description="We develop and produce private label bakery ranges for established UAE food brands."
            />
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {manufacturingPartners.map((partner) => (
                <div
                  key={partner}
                  className="flex flex-col rounded-2xl border border-sand bg-cream px-5 py-5"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-sand bg-warmwhite font-serif text-sm font-bold text-gold">
                      {monogram(partner)}
                    </span>
                    <span className="font-serif text-base font-semibold leading-tight text-charcoal sm:text-lg">
                      {partner}
                    </span>
                  </div>
                  <AssetHint label="Upload official partner logo" className="mt-3" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Retail presence */}
        <section className="section">
          <div className="container-x">
            <SectionHeading
              eyebrow="Market Presence"
              title="Available across leading UAE retail"
              description="Our products reach shoppers through major hypermarkets, cooperatives, and premium grocery chains across the UAE."
            />
            <div className="mt-12 overflow-hidden rounded-3xl border border-sand bg-cream">
              <div className="grid grid-cols-2 gap-px bg-sand sm:grid-cols-3 lg:grid-cols-5">
                {retailPresence.map((retailer) => (
                  <div
                    key={retailer}
                    className="flex flex-col items-center justify-center gap-3 bg-cream px-4 py-9 text-center"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-sand bg-warmwhite font-serif text-sm font-bold text-gold">
                      {monogram(retailer)}
                    </span>
                    <span className="font-serif text-sm font-semibold leading-tight text-charcoal sm:text-base">
                      {retailer}
                    </span>
                    <AssetHint label="Retail logo needed" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Market trust copy */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <div className="mx-auto max-w-3xl text-center">
              <SectionHeading
                eyebrow="Market Trust"
                title="Presence built on operational discipline"
                description="Reaching and staying in major retail environments takes consistency, packaging readiness, dependable quality, and operational discipline across every batch. That is the standard Al Shehail manufactures to."
              />
            </div>
          </div>
        </section>

        <CtaBand
          eyebrow="Partner With Us"
          title="Manufacture Your Bakery Brand With Al Shehail"
          text="Talk to our team about private label manufacturing, product development, and retail-ready supply."
          primary={{ label: "Contact Us", href: "/contact" }}
        />
      </main>
      <Footer />
    </>
  );
}
