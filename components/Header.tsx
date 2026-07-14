"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { company } from "@/lib/content";
import { primaryNav } from "@/lib/navigation";
import { ui } from "@/lib/dictionary";
import { localeHref, localizedPath, otherLocale, type Locale } from "@/lib/i18n";

function Chevron() {
  return (
    <svg
      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 flex-none"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.7 3.8 6.2 3.8 9s-1.4 6.3-3.8 9c-2.4-2.7-3.8-6.2-3.8-9s1.4-6.3 3.8-9z" />
    </svg>
  );
}

export default function Header({ locale }: { locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = ui[locale];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const homeHref = localeHref("/", locale);
  const contactHref = localeHref("/contact", locale);
  const switchHref = localizedPath(pathname || "/", otherLocale(locale));

  const LangSwitch = ({ onClick }: { onClick?: () => void }) => (
    <a
      href={switchHref}
      onClick={onClick}
      aria-label={t.langSwitch.aria}
      title={t.langSwitch.aria}
      className="glass-chip inline-flex h-9 flex-none items-center gap-1 rounded-full px-2.5 text-xs font-semibold text-charcoal/70 transition-colors hover:text-gold"
    >
      <GlobeIcon />
      {t.langSwitch.label}
    </a>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={`mx-auto flex h-16 w-full max-w-7xl items-center justify-between rounded-full px-4 transition-all duration-300 sm:h-[4.25rem] sm:px-6 ${
          scrolled
            ? "glass-nav"
            : "border border-transparent bg-transparent"
        }`}
      >
        <a href={homeHref} className="flex items-center gap-3" aria-label={company.name}>
          <Image
            src="/assets/brand/al-shehail-icon.svg"
            alt={company.name}
            width={40}
            height={40}
            priority
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
        </a>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label={t.header.primaryAria}>
          {primaryNav.map((item) =>
            item.children ? (
              <div key={item.label.en} className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-charcoal/80 transition-colors hover:text-gold group-hover:text-gold"
                  aria-haspopup="true"
                >
                  {item.label[locale]}
                  <Chevron />
                </button>
                {/* Premium flyout — opens on hover and keyboard focus */}
                <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 rtl:left-auto rtl:right-0">
                  <div className="glass-dropdown w-64 rounded-2xl p-2">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={localeHref(child.href, locale)}
                        className="block rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-white/60 hover:text-gold"
                      >
                        {child.label[locale]}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={item.href}
                href={localeHref(item.href!, locale)}
                className="whitespace-nowrap text-sm font-medium text-charcoal/80 transition-colors hover:text-gold"
              >
                {item.label[locale]}
              </a>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={contactHref} className="btn-primary">
            {t.header.startProject}
          </a>
          <LangSwitch />
        </div>

        <div className="flex items-center gap-2.5 lg:hidden">
          <LangSwitch />
          <button
            type="button"
            className="glass-chip inline-flex h-10 w-10 items-center justify-center rounded-xl text-charcoal"
            aria-label={t.header.toggleMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="glass-dropdown mx-auto mt-2 w-full max-w-7xl rounded-3xl lg:hidden">
          <nav className="flex flex-col gap-1 p-4" aria-label={t.header.mobileAria}>
            {primaryNav.map((item) =>
              item.children ? (
                <div key={item.label.en} className="py-1">
                  <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                    {item.label[locale]}
                  </p>
                  {item.children.map((child) => (
                    <a
                      key={child.href}
                      href={localeHref(child.href, locale)}
                      className="block rounded-lg py-2.5 pl-6 pr-3 text-sm font-medium text-charcoal hover:bg-white/60 rtl:pl-3 rtl:pr-6"
                      onClick={() => setOpen(false)}
                    >
                      {child.label[locale]}
                    </a>
                  ))}
                </div>
              ) : (
                <a
                  key={item.href}
                  href={localeHref(item.href!, locale)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal hover:bg-white/60"
                  onClick={() => setOpen(false)}
                >
                  {item.label[locale]}
                </a>
              )
            )}
            <a
              href={contactHref}
              className="btn-primary mt-2"
              onClick={() => setOpen(false)}
            >
              {t.header.startProject}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
