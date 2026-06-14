// Centralized content for Al Shehail Food Industries landing page.
// NOTE: No unverified figures (capacity, outlet counts, team size, factory
// size) are included. Use verified assets/data when available.

export const company = {
  name: "Al Shehail Food Industries",
  shortName: "Al Shehail",
  positioning: "UAE-Based Bakery Manufacturing & Private Label Partner",
  coreMessage: "From idea to shelf",
  location: "United Arab Emirates",
  email: "info@alshehailfood.com",
  phone: "+971 (placeholder)",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Private Label", href: "#private-label" },
  { label: "Quality", href: "#certifications" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Presence", href: "#presence" },
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

export type ProductCategory = {
  name: string;
  description: string;
};

export const productCategories: ProductCategory[] = [
  {
    name: "Flatbread & Arabic Bread",
    description:
      "Authentic regional flatbreads produced for everyday retail demand.",
  },
  {
    name: "Toast & Sandwich Bread",
    description: "Soft, consistent loaves engineered for shelf life and slicing.",
  },
  {
    name: "Samoon Bread",
    description: "Traditional Gulf samoon, baked for freshness and texture.",
  },
  {
    name: "Burger Buns",
    description: "Foodservice and retail buns with reliable structure and crumb.",
  },
  {
    name: "Mini Croissants",
    description: "Laminated mini croissants ideal for grab-and-go formats.",
  },
  {
    name: "Full-Size Croissants",
    description: "Premium butter-style croissants for bakery and cafe shelves.",
  },
  {
    name: "Puff Pastry Products",
    description: "Layered savory and sweet pastry lines for diverse ranges.",
  },
  {
    name: "Maamoul",
    description: "Filled date and nut maamoul for seasonal and year-round sales.",
  },
  {
    name: "Date Balls / Tamriya",
    description: "Wholesome date-based snacks built for the health-aware shopper.",
  },
];

export type Step = {
  number: string;
  title: string;
  description: string;
};

export const privateLabelSteps: Step[] = [
  {
    number: "01",
    title: "Concept & Development",
    description:
      "We translate your idea into a viable bakery product — recipe, format, and positioning aligned to your brand.",
  },
  {
    number: "02",
    title: "Recipe & Sampling",
    description:
      "Iterative sampling and refinement until taste, texture, and cost meet retail expectations.",
  },
  {
    number: "03",
    title: "Manufacturing & QA",
    description:
      "Production under certified food-safety systems with consistent quality at every batch.",
  },
  {
    number: "04",
    title: "Packing & Branding",
    description:
      "Retail-ready packaging and private-label finishing tailored to your brand identity.",
  },
  {
    number: "05",
    title: "Scale & Supply",
    description:
      "Reliable, repeatable supply scaled to your distribution and retail footprint.",
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
