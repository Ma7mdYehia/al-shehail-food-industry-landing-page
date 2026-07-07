import SectionHeading from "../SectionHeading";
import TeaserLink from "../TeaserLink";
import { ui } from "@/lib/dictionary";
import { localeHref, type Locale } from "@/lib/i18n";

export default function AboutTeaser({ locale }: { locale: Locale }) {
  const t = ui[locale].home.about;

  return (
    <section className="section relative overflow-hidden">
      {/* Subtle warm background video — muted, looping, no controls. Warm light
          overlays keep it gentle and the copy fully readable. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover opacity-45"
        >
          <source src="/assets/videos/about-al-shehail-bg.mp4" type="video/mp4" />
        </video>
        {/* Stronger cream wash on the left for the copy, lighter on the right. */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/85 to-cream/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream/70 via-transparent to-warmwhite/40" />
      </div>

      <div className="container-x relative z-10">
        {/* One clean left-aligned content block: eyebrow, title, description,
            then the learn-more link directly under the copy. */}
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
      </div>
    </section>
  );
}
