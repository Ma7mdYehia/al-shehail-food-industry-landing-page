import Image from "next/image";
import SectionHeading from "../SectionHeading";
import TeaserLink from "../TeaserLink";
import { whyUsPoints } from "@/lib/content";
import { ui } from "@/lib/dictionary";
import { localeHref, type Locale } from "@/lib/i18n";
import { generatedAssets } from "@/lib/generatedAssets";
import {
  ProductionIcon,
  ShieldCheckIcon,
  RetailIcon,
  PackagingIcon,
} from "@/components/Icons";

const aboutCardIcons = [
  ProductionIcon,
  ShieldCheckIcon,
  RetailIcon,
  PackagingIcon,
];

export default function AboutTeaser({ locale }: { locale: Locale }) {
  const t = ui[locale].home.about;

  return (
    <section className="section relative overflow-hidden">
      {/* Subtle warm background image. Warm light
          overlays keep it gentle and the copy fully readable. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <Image
          src={generatedAssets.sectionBackgrounds.about}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-45"
          aria-hidden
        />
        {/* Stronger cream wash on the left for the copy, lighter on the right. */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/85 to-cream/50 rtl:bg-gradient-to-l" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream/70 via-transparent to-warmwhite/40" />
      </div>

      <div className="container-x relative z-10">
        {/* Editorial split: copy block on one side, layered glass pillars panel
            on the other. Pillars use verified whyUsPoints content only. */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="max-w-2xl">
            <SectionHeading
              align="left"
              eyebrow={t.eyebrow}
              title={t.title}
              description={t.description}
            />
            <TeaserLink
              href={localeHref("/about", locale)}
              label={t.cta}
              className="mt-6"
            />
          </div>

          <div className="glass-panel p-6 sm:p-8">
            <ul className="grid gap-4 sm:grid-cols-2">
              {whyUsPoints.map((point, index) => {
                const Icon = aboutCardIcons[index];
                return (
                  <li
                    key={point.title.en}
                    className="glass-card flex flex-col gap-2 p-5"
                  >
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-gold-gradient text-white shadow-card">
                      <Icon width={17} height={17} />
                    </span>
                    <h3 className="font-serif text-base font-semibold leading-tight text-ink">
                      {point.title[locale]}
                    </h3>
                    <p className="text-sm leading-relaxed text-stone">
                      {point.description[locale]}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
