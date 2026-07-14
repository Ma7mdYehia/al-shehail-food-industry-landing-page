import Link from "next/link";
import SectionHeading from "../SectionHeading";
import {
  ProductionIcon,
  RetailIcon,
  PackagingIcon,
  DevelopIcon,
} from "../Icons";
import { ui } from "@/lib/dictionary";
import { localeHref, type Locale } from "@/lib/i18n";

// Homepage "Beyond Manufacturing" section — introduces the 4-service ecosystem
// in compact premium cards. Copy comes from the dictionary; icons are matched by
// index to the dictionary's service items (same order in both locales).
const icons = [ProductionIcon, PackagingIcon, RetailIcon, DevelopIcon];

function ArrowRight() {
  return (
    <svg
      className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100"
      width="15"
      height="15"
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
  );
}

export default function ServicesEcosystem({ locale }: { locale: Locale }) {
  const t = ui[locale].home.services;

  return (
    <section className="section relative overflow-hidden border-y border-sand/60 bg-cream">
      {/* Warm ambient wash so the glass cards have depth to refract */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-champagne/12 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-sand/30 blur-3xl" />
        <div className="bg-dotted-gold absolute inset-0 opacity-25" />
      </div>
      <div className="container-x relative">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((s, i) => {
            const Icon = icons[i];
            return (
              <Link
                key={s.href}
                href={localeHref(s.href, locale)}
                className="glass-card group flex flex-col p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-beige text-gold transition-colors group-hover:bg-gold-gradient group-hover:text-white">
                  <Icon width={20} height={20} />
                </span>
                <h3 className="mt-4 font-serif text-base font-semibold leading-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone">
                  {s.text}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold">
                  {s.cta}
                  <ArrowRight />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
