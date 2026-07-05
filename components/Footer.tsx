import Image from "next/image";
import { company, navLinks, trustBadges, whatsappLink } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-sand bg-warmwhite">
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
                  الشحيل
                </span>
                <span className="text-[11px] font-medium uppercase text-stone">
                  للصناعات الغذائية
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-stone">
              {company.positioning}. من الفكرة إلى الرف — نطوّر ونصنّع منتجات
              مخبوزات مبنية للنجاح في الرف.
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
            <h3 className="text-xs font-semibold uppercase text-charcoal">
              الأقسام
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
            <h3 className="text-xs font-semibold uppercase text-charcoal">
              تواصل معنا
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-stone">
              <li>{company.location}</li>
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
                  dir="ltr"
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
                  واتساب
                </a>
              </li>
              <li>
                <a href="/contact" className="btn-primary mt-3">
                  ابدأ مشروعك
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-sand pt-7 text-xs text-stone sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.name}. جميع الحقوق محفوظة.
          </p>
          <p>تصنيع مخبوزات وعلامات خاصة · الإمارات العربية المتحدة</p>
        </div>
      </div>
    </footer>
  );
}
