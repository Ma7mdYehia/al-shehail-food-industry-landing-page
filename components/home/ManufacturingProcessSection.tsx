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
      className="section scroll-mt-24 border-t border-sand/60 bg-warmwhite"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={title[locale]}
          description={subtitle[locale]}
        />

        <ProcessJourney locale={locale} />

        {/* Careful-claims note */}
        <p className="mx-auto mt-8 max-w-3xl rounded-2xl border border-sand bg-cream px-5 py-4 text-center text-xs leading-relaxed text-stone">
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
