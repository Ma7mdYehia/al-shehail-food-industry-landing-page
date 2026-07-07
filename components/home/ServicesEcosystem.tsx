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
    <section className="section border-y border-sand/60 bg-warmwhite">
      <div className="container-x">
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
                className="card-lift group flex flex-col rounded-2xl border border-sand bg-cream p-6 transition-colors hover:border-champagne/60 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
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
