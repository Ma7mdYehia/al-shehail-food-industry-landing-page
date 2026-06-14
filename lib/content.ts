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
