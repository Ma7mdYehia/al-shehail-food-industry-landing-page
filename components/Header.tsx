"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { company } from "@/lib/content";
import { primaryNav } from "@/lib/navigation";

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
              Al Shehail
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone">
              Food Industries
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Primary">
          {primaryNav.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-charcoal/80 transition-colors hover:text-gold group-hover:text-gold"
                  aria-haspopup="true"
                >
                  {item.label}
                  <Chevron />
                </button>
                {/* Premium flyout — opens on hover and keyboard focus */}
                <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="w-64 rounded-2xl border border-sand bg-warmwhite p-2 shadow-soft">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        className="block rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-beige hover:text-gold"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-sm font-medium text-charcoal/80 transition-colors hover:text-gold"
              >
                {item.label}
              </a>
            )
          )}
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
            {primaryNav.map((item) =>
              item.children ? (
                <div key={item.label} className="py-1">
                  <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                    {item.label}
                  </p>
                  {item.children.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      className="block rounded-lg py-2.5 pl-6 pr-3 text-sm font-medium text-charcoal hover:bg-beige"
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal hover:bg-beige"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              )
            )}
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
