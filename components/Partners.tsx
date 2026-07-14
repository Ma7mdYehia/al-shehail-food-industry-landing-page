import Link from "next/link";
import PartnerProjectGrid from "./partners/PartnerProjectGrid";
import { ui } from "@/lib/dictionary";
import { localeHref, type Locale } from "@/lib/i18n";

export default function Partners({ locale }: { locale: Locale }) {
  const t = ui[locale].home.partners;

  return (
    <section className="relative overflow-hidden border-y border-sand/60 bg-cream py-14 sm:py-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="oven-glow absolute inset-x-0 top-0 h-1/2 opacity-60" />
      </div>
      <div className="container-x relative">
        <div className="flex flex-col items-center text-center">
          <span className="eyebrow">
            <span className="h-px w-6 bg-champagne" />
            {t.eyebrow}
          </span>
          <p className="mt-3 max-w-xl text-sm text-stone">{t.blurb}</p>
        </div>

        {/* Clickable partner cards — clean logo + name, open the project modal */}
        <PartnerProjectGrid className="mt-10" variant="compact" locale={locale} />

        <div className="mt-10 text-center">
          <Link
            href={localeHref("/partners", locale)}
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
