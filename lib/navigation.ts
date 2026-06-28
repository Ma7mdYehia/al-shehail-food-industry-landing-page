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
  { label: "Private Label Manufacturing", href: "/private-label" },
  { label: "Distribution Fleet", href: "/services/distribution" },
  { label: "Packaging & Brand Design", href: "/services/brand-design" },
  { label: "Food Digital Marketing", href: "/services/digital-marketing" },
];

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Services", children: serviceLinks },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];
