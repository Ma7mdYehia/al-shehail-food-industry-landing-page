import Image from "next/image";
import { company, trustBadges, whatsappLink } from "@/lib/content";
import { footerNav } from "@/lib/navigation";
import { ui } from "@/lib/dictionary";
import { localeHref, type Locale } from "@/lib/i18n";

export default function Footer({ locale }: { locale: Locale }) {
  const t = ui[locale];

  return (
    <footer className="bg-warm-ambient border-t border-white/60">
      <div className="container-x py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/assets/brand/al-shehail-icon.svg"
                alt={company.name}
                width={40}
                height={40}
                className="h-10 w-10 flex-none object-contain"
              />
              <span className="flex flex-col leading-none">
                <span className="font-serif text-base font-semibold text-ink">
                  {t.brand.line1}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone">
                  {t.brand.line2}
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-stone">
              {company.positioning[locale]}. {t.footer.tagline}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {trustBadges.map((badge) => (
                <span
                  key={badge.en}
                  className="glass-chip rounded-full px-3 py-1 text-[11px] font-semibold text-charcoal"
                >
                  {badge[locale]}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal">
              {t.footer.explore}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <a
                    href={localeHref(link.href, locale)}
                    className="text-sm text-stone transition-colors hover:text-gold"
                  >
                    {link.label[locale]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal">
              {t.footer.getInTouch}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-stone">
              <li>{company.location[locale]}</li>
              <li>
                <a
                  href={`tel:+${company.phoneDigits}`}
                  className="transition-colors hover:text-gold"
                  dir="ltr"
                >
                  {company.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="transition-colors hover:text-gold"
                >
                  {company.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold"
                >
                  {t.footer.whatsapp}
                </a>
              </li>
              <li>
                <a href={localeHref("/contact", locale)} className="btn-primary mt-3">
                  {t.footer.startProject}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-sand pt-7 text-xs text-stone sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.name}. {t.footer.rights}
          </p>
          <p>{t.footer.strip}</p>
        </div>
      </div>
    </footer>
  );
}
