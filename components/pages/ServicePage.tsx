import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/SectionHeading";
import ServiceFeatureGrid from "@/components/services/ServiceFeatureGrid";
import ServiceProcess from "@/components/services/ServiceProcess";
import ServiceRelatedServices from "@/components/services/ServiceRelatedServices";
import {
  PackagingIcon,
  RetailIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ProductionIcon,
  DevelopIcon,
} from "@/components/Icons";
import { services, type ServiceSlug, type ServiceIconKey } from "@/lib/services";
import { localeHref, type Locale } from "@/lib/i18n";
import { generatedAssets } from "@/lib/generatedAssets";

const iconMap: Record<
  ServiceIconKey,
  (p: { width?: number; height?: number }) => JSX.Element
> = {
  packaging: PackagingIcon,
  retail: RetailIcon,
  calendar: CalendarIcon,
  shield: ShieldCheckIcon,
  production: ProductionIcon,
  develop: DevelopIcon,
};

const exploreLabel = { en: "Explore", ar: "استكشف" };

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function ServicePage({
  slug,
  locale,
}: {
  slug: ServiceSlug;
  locale: Locale;
}) {
  const s = services[slug];

  return (
    <>
      <Header locale={locale} />
      <main>
        {/* 1. Hero */}
        <PageHero
          eyebrow={s.heroEyebrow[locale]}
          title={s.heroTitle[locale]}
          subtitle={s.heroSubtitle[locale]}
          backgroundImage={generatedAssets.pageHeaders.services[slug]}
        >
          <a href={localeHref(s.heroPrimary.href, locale)} className="btn-primary">
            {s.heroPrimary.label[locale]}
          </a>
          <a href={localeHref(s.heroSecondary.href, locale)} className="btn-secondary">
            {s.heroSecondary.label[locale]}
          </a>
        </PageHero>

        {/* 2. Intro */}
        <section className="section">
          <div className="container-x">
            <div className="max-w-3xl">
              <SectionHeading
                align="left"
                eyebrow={s.introEyebrow[locale]}
                title={s.introTitle[locale]}
                description={s.introDesc[locale]}
              />
            </div>
          </div>
        </section>

        {/* 3. What the service covers */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <ServiceFeatureGrid
              eyebrow={s.coverageEyebrow[locale]}
              title={s.coverageTitle[locale]}
              description={s.coverageDesc[locale]}
              items={s.coverage.map((c) => ({
                title: c.title[locale],
                description: c.description[locale],
                Icon: iconMap[c.icon],
              }))}
            />
          </div>
        </section>

        {/* 4. Process */}
        <section className="section border-y border-sand/50 bg-beige/40">
          <div className="container-x">
            <ServiceProcess
              eyebrow={s.processEyebrow[locale]}
              title={s.processTitle[locale]}
              description={s.processDesc[locale]}
              steps={s.process.map((p) => ({
                title: p.title[locale],
                text: p.text[locale],
              }))}
            />
          </div>
        </section>

        {/* 5a. Audience (distribution) */}
        {s.audience && (
          <section className="section border-t border-sand/60 bg-warmwhite">
            <div className="container-x">
              <SectionHeading
                eyebrow={s.audience.eyebrow[locale]}
                title={s.audience.title[locale]}
              />
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {s.audience.items.map((a) => (
                  <div
                    key={a.en}
                    className="rounded-2xl border border-sand bg-cream p-5 font-serif text-base font-semibold text-charcoal"
                  >
                    {a[locale]}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5b. Deliverables (brand-design, digital-marketing) */}
        {s.deliverables && (
          <section className="section border-t border-sand/60 bg-warmwhite">
            <div className="container-x">
              <SectionHeading
                eyebrow={s.deliverables.eyebrow[locale]}
                title={s.deliverables.title[locale]}
                description={s.deliverables.desc[locale]}
              />
              <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {s.deliverables.items.map((d) => (
                  <li
                    key={d.en}
                    className="flex items-center gap-3 rounded-xl border border-sand bg-cream px-4 py-3 text-sm font-medium text-charcoal"
                  >
                    <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-beige text-gold">
                      <CheckIcon />
                    </span>
                    {d[locale]}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* 6. Categories (brand-design, digital-marketing) */}
        {s.categories && (
          <section className="section border-y border-sand/50 bg-beige/30">
            <div className="container-x">
              <SectionHeading
                eyebrow={s.categories.eyebrow[locale]}
                title={s.categories.title[locale]}
              />
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {s.categories.items.map((c) => (
                  <div
                    key={c.en}
                    className="rounded-2xl border border-sand bg-warmwhite p-5 font-serif text-base font-semibold text-charcoal"
                  >
                    {c[locale]}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. Related services */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <ServiceRelatedServices
              eyebrow={s.relatedEyebrow[locale]}
              title={s.relatedTitle[locale]}
              description={s.relatedDesc[locale]}
              exploreLabel={exploreLabel[locale]}
              items={s.related.map((r) => ({
                title: r.title[locale],
                description: r.description[locale],
                href: localeHref(r.href, locale),
              }))}
            />
          </div>
        </section>

        {/* 8. Careful-claims note */}
        <section className="section border-y border-sand/50 bg-beige/30">
          <div className="container-x">
            <div className="mx-auto flex max-w-3xl items-start gap-4 rounded-2xl border border-champagne/40 bg-cream p-6 sm:p-7">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-beige text-gold">
                <ShieldCheckIcon width={18} height={18} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                  {s.noteLabel[locale]}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone">
                  {s.noteText[locale]}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Final CTA */}
        <CtaBand
          eyebrow={s.ctaEyebrow[locale]}
          title={s.ctaTitle[locale]}
          text={s.ctaText[locale]}
          primary={{ label: s.ctaPrimary.label[locale], href: localeHref(s.ctaPrimary.href, locale) }}
          secondary={{ label: s.ctaSecondary.label[locale], href: localeHref(s.ctaSecondary.href, locale) }}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
