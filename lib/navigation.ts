// Primary header navigation. Kept separate from lib/content `navLinks` (which
// the footer uses as a flat list) because the header needs a "Services"
// dropdown grouping the service pages. Private Label Manufacturing lives under
// Services here — it reuses the existing /private-label page (no duplication).

export type NavChild = { label: string; href: string };

export type NavItem = {
  label: string;
  href?: string;
  children?: NavChild[];
};

export const serviceLinks: NavChild[] = [
  { label: "تصنيع العلامة الخاصة", href: "/private-label" },
  { label: "أسطول التوزيع", href: "/services/distribution" },
  { label: "التغليف وتصميم العلامة", href: "/services/brand-design" },
  { label: "التسويق الرقمي الغذائي", href: "/services/digital-marketing" },
];

export const primaryNav: NavItem[] = [
  { label: "الرئيسية", href: "/" },
  { label: "من نحن", href: "/about" },
  { label: "المنتجات", href: "/products" },
  { label: "الخدمات", children: serviceLinks },
  { label: "الشركاء", href: "/partners" },
  { label: "تواصل معنا", href: "/contact" },
];
