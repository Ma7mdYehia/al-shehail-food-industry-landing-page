import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/SectionHeading";
import AssetHint from "@/components/AssetHint";
import { ShieldCheckIcon } from "@/components/Icons";
import { certifications } from "@/lib/content";
import { assets, hasAsset, getAssetAlt } from "@/lib/assets";

const certAssetKeys: Record<string, keyof typeof assets.certifications> = {
  "ISO Certified":      "iso",
  "HACCP Certified":    "haccp",
  "Organic Certified":  "organic",
  "Carrefour Approved": "carrefourApproved",
};

export const metadata: Metadata = {
  title: { absolute: "Quality & Certifications | Al Shehail Food Industries UAE" },
  description:
    "Al Shehail Food Industries follows certified bakery manufacturing and quality-control processes, supporting ISO, HACCP, Organic, and Carrefour-approved production requirements.",
  alternates: { canonical: "/quality" },
};

const qualityProcess = [
  "Ingredient handling",
  "Recipe & batch control",
  "Hygiene process",
  "Production records",
  "Quality inspection",
  "Packaging checks",
  "Retail supply standards",
];

export default function QualityPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Quality & Certifications"
          title="Certified, Quality-Controlled Bakery Manufacturing"
          subtitle="A structured production approach supported by certified standards, quality checks, and retail supply readiness."
        >
          <a href="/contact" className="btn-primary">
            Request a Consultation
          </a>
        </PageHero>

        {/* Certifications */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              eyebrow="Certifications"
              title="Standards we build around"
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {certifications.map((cert) => {
                const assetKey = certAssetKeys[cert.title];
                const logoPath = assetKey ? assets.certifications[assetKey] : null;
                return (
                <div
                  key={cert.title}
                  className="flex flex-col items-center rounded-2xl border border-sand bg-cream p-8 text-center shadow-card"
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
                  <span className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-champagne">
                    Quality Mark
                  </span>
                  <h3 className="mt-1.5 font-serif text-lg font-semibold text-ink">
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
          </div>
        </section>

        {/* Quality process */}
        <section className="section">
          <div className="container-x">
            <SectionHeading
              eyebrow="Quality Process"
              title="Controlled at every stage"
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </section>

        {/* Certified production note */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <div className="mx-auto max-w-3xl rounded-2xl border border-sand bg-cream p-7 text-center">
              <h2 className="font-serif text-xl font-semibold text-ink">
                Certified production
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone">
                Certifications and approvals should be displayed with official
                documents/logos once final assets are provided.
              </p>
            </div>
          </div>
        </section>

        <CtaBand
          eyebrow="Quality You Can Trust"
          title="Manufacture to a Standard You Can Stand Behind"
          text="Talk to our team about certified, quality-controlled production for your bakery product."
          primary={{ label: "Request a Consultation", href: "/contact" }}
        />
      </main>
      <Footer />
    </>
  );
}
