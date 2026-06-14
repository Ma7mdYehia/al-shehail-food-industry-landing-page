"use client";

import { useEffect, useState } from "react";
import { company, navLinks } from "@/lib/content";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-sand/70 bg-warmwhite/90 backdrop-blur-md shadow-card"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between py-4">
        <a href="/" className="flex items-center gap-3" aria-label={company.name}>
          {/* Required asset: Al Shehail Food Industries official logo —
              transparent PNG or SVG, horizontal version preferred.
              Replace this monogram + wordmark with the logo when available. */}
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-gradient font-serif text-lg font-bold text-white shadow-soft">
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
        </a>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-charcoal/80 transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a href="/contact" className="btn-primary">
            Start a Project
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-sand bg-warmwhite text-charcoal lg:hidden"
          aria-label="Toggle menu"
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

      {open && (
        <div className="border-t border-sand/70 bg-warmwhite lg:hidden">
          <nav className="container-x flex flex-col gap-1 py-4" aria-label="Mobile">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal hover:bg-beige"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/contact"
              className="btn-primary mt-2"
              onClick={() => setOpen(false)}
            >
              Start a Project
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
