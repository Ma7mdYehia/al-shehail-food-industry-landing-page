// Centralized content for Al Shehail Food Industries landing page.
// NOTE: No unverified figures (capacity, outlet counts, team size, factory
// size) are included. Use verified assets/data when available.

export const company = {
  name: "Al Shehail Food Industries",
  shortName: "Al Shehail",
  positioning: "UAE-Based Bakery Manufacturing & Private Label Partner",
  coreMessage: "From idea to shelf",
  location: "New Industrial Area, Umm Al Quwain, UAE",
  email: "info@alshehai.ae",
  phone: "+971 54 743 1444",
  // E.164 digits only, used for tel: and wa.me links
  phoneDigits: "971547431444",
};

// WhatsApp deep link with a prefilled B2B enquiry message.
export const whatsappLink = `https://wa.me/${company.phoneDigits}?text=${encodeURIComponent(
  "Hello Al Shehail, I'd like to discuss a private label bakery project."
)}`;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Private Label", href: "/private-label" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Quality", href: "/quality" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

export const trustBadges = [
  "ISO Certified",
  "HACCP Certified",
  "Organic Certified",
  "Carrefour Approved",
];

export const manufacturingPartners = [
  "HÄLSA Bake",
  "EKTIFA",
  "Al Taj",
  "Al Tahan",
];

export type Step = {
  number: string;
  title: string;
  description: string;
};

export const privateLabelSteps: Step[] = [
  {
    number: "01",
    title: "Product Idea",
    description:
      "We start from your brief — category, positioning, and target shelf — and shape a manufacturable bakery concept.",
  },
  {
    number: "02",
    title: "Recipe Development",
    description:
      "Our development team formulates the recipe for taste, texture, and clean, repeatable production.",
  },
  {
    number: "03",
    title: "Sampling",
    description:
      "We produce samples and refine through feedback until the product is right for your brand.",
  },
  {
    number: "04",
    title: "Costing",
    description:
      "Transparent unit costing and specifications so the product works commercially at retail.",
  },
  {
    number: "05",
    title: "Packaging",
    description:
      "Private-label packaging engineered for shelf appeal, compliance, and product protection.",
  },
  {
    number: "06",
    title: "Production",
    description:
      "Scaled manufacturing on certified bakery lines with consistent output, batch after batch.",
  },
  {
    number: "07",
    title: "Quality Control",
    description:
      "ISO- and HACCP-aligned checks safeguard food safety and quality at every stage.",
  },
  {
    number: "08",
    title: "Retail-Ready Delivery",
    description:
      "Finished, branded, retail-ready product supplied reliably to your distribution network.",
  },
];

// ── Hero slider ──────────────────────────────────────────────────────────────
// Clean content variants for the hero, mapped 1:1 to the seven right-side
// manufacturing stages (index 0–6). Each variant can selectively show or hide
// the eyebrow, CTA, and trust points — not every slide shows every element.
// The first slide stays very close to the original hero (full layout).

export type HeroTrustIcon = "shield-check" | "label" | "truck";

export type HeroTrustPoint = {
  label: string;
  icon: HeroTrustIcon;
};

export type HeroSlide = {
  /** Index (0–6) of the highlighted stage in the right-side system. */
  step: number;
  eyebrow?: string;
  title: string;
  description: string;
  /** Omit to hide the CTA on this slide. */
  ctaLabel?: string;
  ctaHref?: string;
  /** Omit to hide the trust points on this slide. */
  trustPoints?: HeroTrustPoint[];
};

const heroPrimaryTrust: HeroTrustPoint[] = [
  { label: "ISO / HACCP Systems", icon: "shield-check" },
  { label: "Private Label Ready", icon: "label" },
  { label: "Retail Supply Support", icon: "truck" },
];

export const heroSlides: HeroSlide[] = [
  {
    step: 0,
    eyebrow: "UAE-Based Bakery Manufacturing & Private Label Partner",
    title: "Private Label Bakery Manufacturing in the UAE",
    description:
      "From product concept to retail-ready bakery — developed, manufactured, packed, and scaled for modern food brands.",
    ctaLabel: "Start a Project",
    ctaHref: "/contact",
    trustPoints: heroPrimaryTrust,
  },
  {
    step: 1,
    eyebrow: "Recipe Development",
    title: "Recipes engineered for taste and scale",
    description:
      "Formulated for flavour, texture, and clean, repeatable production on certified lines.",
    ctaLabel: "Start a Project",
    ctaHref: "/contact",
  },
  {
    step: 2,
    eyebrow: "Sampling",
    title: "Samples refined until they're right",
    description:
      "We produce and tune samples with your team until the product is ready for your brand.",
  },
  {
    step: 3,
    eyebrow: "Packaging",
    title: "Retail packaging built for the shelf",
    description:
      "Private-label packaging designed for shelf appeal, compliance, and product protection.",
    ctaLabel: "Start a Project",
    ctaHref: "/contact",
  },
  {
    step: 4,
    eyebrow: "Production",
    title: "Scaled production, batch after batch",
    description:
      "Consistent output on certified bakery lines, ready to grow with your brand.",
    trustPoints: heroPrimaryTrust,
  },
  {
    step: 5,
    eyebrow: "Quality Control",
    title: "Quality assured at every stage",
    description:
      "ISO- and HACCP-aligned checks safeguard food safety from line to delivery.",
    trustPoints: heroPrimaryTrust,
  },
  {
    step: 6,
    eyebrow: "Retail Ready",
    title: "Finished, branded, retail-ready",
    description:
      "Packed and supplied reliably to your distribution network across the UAE.",
    ctaLabel: "Start a Project",
    ctaHref: "/contact",
    trustPoints: heroPrimaryTrust,
  },
];

export const capabilities = [
  {
    title: "Product Development",
    description:
      "In-house development to take your concept from brief to finished, shelf-ready product.",
  },
  {
    title: "Private Label Manufacturing",
    description:
      "Dedicated private label production aligned to your brand and category strategy.",
  },
  {
    title: "Recipe Customization",
    description:
      "Tailored formulations for taste, texture, dietary, and cost requirements.",
  },
  {
    title: "Retail-Ready Packing",
    description:
      "Packaging formats designed for retail merchandising and shelf appeal.",
  },
  {
    title: "Food Safety Systems",
    description:
      "Operations governed by recognized food-safety and quality frameworks.",
  },
  {
    title: "Scalable Supply",
    description:
      "Consistent, repeatable supply to support growing distribution networks.",
  },
];

export const certifications = [
  {
    title: "ISO Certified",
    description: "Quality management systems aligned to international standards.",
  },
  {
    title: "HACCP Certified",
    description: "Hazard analysis and food-safety controls across production.",
  },
  {
    title: "Organic Certified",
    description: "Certified capability for organic product lines.",
  },
  {
    title: "Carrefour Approved",
    description: "Approved supplier credentials for major retail.",
  },
];

export const retailPresence = [
  "Carrefour",
  "Union Coop",
  "Abu Dhabi Coop",
  "Sharjah Coop",
  "Al Maya Group",
  "Lulu Hypermarket",
  "Nesto Hypermarket",
  "Grandiose Supermarket",
  "Spinneys",
  "Waitrose UAE",
];

export const whyUsPoints = [
  {
    title: "End-to-End Partner",
    description:
      "One partner from product concept through manufacturing, packing, and supply.",
  },
  {
    title: "Certified Quality",
    description:
      "Production backed by ISO and HACCP food-safety credentials.",
  },
  {
    title: "Retail Proven",
    description:
      "Products present across leading UAE retail and hypermarket chains.",
  },
  {
    title: "Built for Brands",
    description:
      "Private label expertise focused on helping your brand win on shelf.",
  },
];
