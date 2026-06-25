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
    <section className="section relative overflow-hidden">
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Certifications & Quality"
          title="Quality you can put your brand behind"
          description="Certified standards and a structured, quality-controlled production process."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-8">
          {/* Certification seals */}
          <div className="grid grid-cols-2 gap-4">
            {trustBadges.map((badge) => (
              <div
                key={badge}
                className="card-lift group flex items-center gap-3 rounded-2xl border border-sand bg-warmwhite p-4 shadow-card hover:border-champagne/60 hover:shadow-glow"
              >
                {/* Premium seal */}
                <span className="relative flex h-12 w-12 flex-none items-center justify-center">
                  <span className="absolute inset-0 rounded-full border border-dashed border-champagne/45 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient text-white shadow-card">
                    <ShieldCheckIcon width={17} height={17} />
                  </span>
                </span>
                <span className="font-serif text-sm font-semibold text-ink">
                  {badge}
                </span>
              </div>
            ))}
          </div>

          {/* Process summary panel */}
          <div className="glow-border relative overflow-hidden rounded-2xl bg-cream p-6">
            <div className="oven-glow pointer-events-none absolute inset-0" aria-hidden />
            <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Quality Process
            </p>
            <ul className="relative mt-4 grid grid-cols-2 gap-3">
              {processSummary.map((step) => (
                <li key={step} className="flex items-center gap-2 text-sm text-charcoal">
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-champagne" />
                  {step}
                </li>
              ))}
            </ul>
            <TeaserLink href="/quality" label="View Quality Standards" className="relative mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
