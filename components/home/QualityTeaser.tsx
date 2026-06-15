import SectionHeading from "../SectionHeading";
import TeaserLink from "../TeaserLink";
import { ShieldCheckIcon } from "../Icons";
import { trustBadges } from "@/lib/content";

const processSummary = [
  "Ingredient handling",
  "Batch control",
  "Hygiene process",
  "Quality inspection",
];

export default function QualityTeaser() {
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Certifications & Quality"
          title="Quality you can put your brand behind"
          description="Certified standards and a structured, quality-controlled production process."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-8">
          {/* Certifications */}
          <div className="grid grid-cols-2 gap-4">
            {trustBadges.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-3 rounded-2xl border border-sand bg-warmwhite p-4 shadow-card"
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gold-gradient text-white">
                  <ShieldCheckIcon width={18} height={18} />
                </span>
                <span className="font-serif text-sm font-semibold text-ink">
                  {badge}
                </span>
              </div>
            ))}
          </div>

          {/* Process summary */}
          <div className="rounded-2xl border border-sand bg-cream p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Quality Process
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {processSummary.map((step) => (
                <li key={step} className="flex items-center gap-2 text-sm text-charcoal">
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-champagne" />
                  {step}
                </li>
              ))}
            </ul>
            <TeaserLink href="/quality" label="View Quality Standards" className="mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
