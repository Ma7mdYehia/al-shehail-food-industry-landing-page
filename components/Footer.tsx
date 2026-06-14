import { company, navLinks, trustBadges, whatsappLink } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-sand bg-warmwhite">
      <div className="container-x py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-gradient font-serif text-lg font-bold text-white">
                AS
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-serif text-base font-semibold text-ink">
                  Al Shehail
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone">
                  Food Industries
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-stone">
              {company.positioning}. From idea to shelf — developing and
              manufacturing bakery products built for retail success.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-sand bg-cream px-3 py-1 text-[11px] font-semibold text-charcoal"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-stone transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-stone">
              <li>{company.location}</li>
              <li>
                <a
                  href={`tel:+${company.phoneDigits}`}
                  className="transition-colors hover:text-gold"
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
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="#contact" className="btn-primary mt-3">
                  Start a Project
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-sand pt-7 text-xs text-stone sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p>Bakery Manufacturing &amp; Private Label · United Arab Emirates</p>
        </div>
      </div>
    </footer>
  );
}
