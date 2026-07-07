import Link from "next/link";
import BackgroundVideo from "./BackgroundVideo";
import { ui } from "@/lib/dictionary";
import { localeHref, type Locale } from "@/lib/i18n";

export default function FinalCTA({ locale }: { locale: Locale }) {
  const t = ui[locale].home.finalCta;

  return (
    <section id="contact" className="section">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl border border-champagne/40 bg-gradient-to-br from-warmwhite via-cream to-beige px-6 py-16 text-center shadow-soft sm:px-12 lg:py-20">
          {/* Subtle decorative background video + warm wash for readability */}
          <BackgroundVideo
            src="/assets/videos/from-idea-to-shelf-bg.mp4"
            className="opacity-40"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-warmwhite/80 via-cream/65 to-beige/80"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0">
            <div className="oven-glow absolute inset-x-0 top-0 h-1/2" />
            <div className="bg-dotted-gold absolute inset-0 opacity-25" />
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-champagne/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-sand/40 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <span className="eyebrow">
              <span className="h-px w-6 bg-champagne" />
              {t.eyebrow}
            </span>
            <h2 className="heading-serif mt-5 text-3xl sm:text-4xl lg:text-[2.75rem]">
              {t.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
              {t.description}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href={localeHref("/contact", locale)} className="btn-primary group">
                {t.primary}
                <svg
                  className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100"
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
              <Link href={localeHref("/services/distribution", locale)} className="btn-secondary">
                {t.secondary}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
