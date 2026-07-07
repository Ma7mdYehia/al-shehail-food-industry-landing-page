// Primary header navigation. Kept separate from lib/content `navLinks` (which
// the footer uses as a flat list) because the header needs a "Services"
// dropdown grouping the service pages. Private Label Manufacturing lives under
// Services here — it reuses the existing /private-label page (no duplication).
//
// Labels are bilingual; hrefs are stored canonically (English, unprefixed) and
// the Header prefixes `/ar` per locale via localeHref().

import type { Localized } from "@/lib/i18n";

export type NavChild = { label: Localized; href: string };

export type NavItem = {
  label: Localized;
  href?: string;
  children?: NavChild[];
};

export const serviceLinks: NavChild[] = [
  {
    label: { en: "Private Label Manufacturing", ar: "التصنيع بعلامة خاصة" },
    href: "/private-label",
  },
  {
    label: { en: "Distribution Fleet", ar: "أسطول التوزيع" },
    href: "/services/distribution",
  },
  {
    label: { en: "Packaging & Brand Design", ar: "التغليف وتصميم العلامة" },
    href: "/services/brand-design",
  },
  {
    label: { en: "Food Digital Marketing", ar: "التسويق الرقمي للأغذية" },
    href: "/services/digital-marketing",
  },
];

export const primaryNav: NavItem[] = [
  { label: { en: "Home", ar: "الرئيسية" }, href: "/" },
  { label: { en: "About", ar: "من نحن" }, href: "/about" },
  { label: { en: "Products", ar: "المنتجات" }, href: "/products" },
  { label: { en: "Services", ar: "خدماتنا" }, children: serviceLinks },
  { label: { en: "Partners", ar: "الشركاء" }, href: "/partners" },
  { label: { en: "Contact", ar: "تواصل معنا" }, href: "/contact" },
];
