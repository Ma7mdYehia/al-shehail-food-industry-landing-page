import Link from "next/link";
import SectionHeading from "../SectionHeading";
import ProcessJourney from "../ProcessJourney";
import { manufacturingProcessNarrative } from "@/lib/homepageEcosystem";
import { ui } from "@/lib/dictionary";
import { localeHref, type Locale } from "@/lib/i18n";

// Homepage "From Concept to Production" section — premium timeline journey.
export default function ManufacturingProcessSection({
  locale,
}: {
  locale: Locale;
}) {
  const { title, subtitle, note } = manufacturingProcessNarrative;
  const t = ui[locale].home.process;

  return (
    <section
      id="manufacturing-process"
      className="section relative overflow-hidden scroll-mt-24 border-t border-sand/60 bg-cream"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-champagne/10 blur-3xl" />
        <div className="bg-grain absolute inset-0 opacity-30" />
      </div>
      <div className="container-x relative">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={title[locale]}
          description={subtitle[locale]}
        />

        <ProcessJourney locale={locale} />

        {/* Careful-claims note */}
        <p className="glass-chip mx-auto mt-8 max-w-3xl rounded-2xl px-5 py-4 text-center text-xs leading-relaxed text-stone">
          {note[locale]}
        </p>

        <div className="mt-10 text-center">
          <Link
            href={localeHref("/private-label", locale)}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
          >
            {t.cta}
            <svg
              className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100"
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
          </Link>
        </div>
      </div>
    </section>
  );
}
