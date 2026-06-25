// Data model for the interactive "From Idea to Shelf" hero journey.
//
// Everything here is data-driven so the hero stays CSS/SVG only (no photo or
// video media yet). The seven steps mirror Al Shehail's private-label flow as
// a focused, presentation-friendly view. No unverified figures are used — all
// proof points are qualitative.

import type { PremiumObjectName } from "@/components/visuals/PremiumObjects";

export type ProofCard = { label: string; value: string };

export type JourneyStep = {
  /** Stable id used for keys, aria, and quiz mapping. */
  id: string;
  /** 1-based position. */
  n: number;
  /** Short rail label. */
  label: string;
  /** Small narrative eyebrow shown above the dynamic title. */
  eyebrow: string;
  /** Dynamic hero title for this step. */
  title: string;
  /** Dynamic hero paragraph for this step. */
  description: string;
  /** Dynamic primary CTA label for this step. */
  ctaLabel: string;
  /** Semantic deep-link target for this step. */
  href: string;
  /** "Current Output" floating card title. */
  outputTitle: string;
  /** "Current Output" floating card supporting line. */
  outputDescription: string;
  /** Small descriptor tags shown on the active step. */
  tags: string[];
  /** Two compact proof cards shown under the hero copy. */
  proofCards: [ProofCard, ProofCard];
  /** Decorative SVG object shown on the node. */
  object: PremiumObjectName;
};

export const journeySteps: JourneyStep[] = [
  {
    id: "idea",
    n: 1,
    label: "Product Idea",
    eyebrow: "Where it starts",
    title: "From bakery idea to a real product.",
    description:
      "Shape your bakery concept into a manufacturable product with clear direction, ingredients, packaging needs, and production feasibility.",
    ctaLabel: "Discuss Your Product Idea",
    href: "/contact",
    outputTitle: "Product brief",
    outputDescription: "Concept shaped for manufacturing",
    tags: ["Product Brief", "Feasibility", "Category Direction"],
    proofCards: [
      { label: "Starting point", value: "Your idea or brief" },
      { label: "You get", value: "Feasibility & direction" },
    ],
    object: "recipe",
  },
  {
    id: "recipe",
    n: 2,
    label: "Recipe",
    eyebrow: "Development",
    title: "Recipe development with production in mind.",
    description:
      "Build recipes for taste, texture, consistency, and scalable bakery manufacturing.",
    ctaLabel: "Develop My Recipe",
    href: "/capabilities",
    outputTitle: "Recipe direction",
    outputDescription: "Formulated for repeatable quality",
    tags: ["Taste", "Texture", "Scale"],
    proofCards: [
      { label: "Developed for", value: "Taste & texture" },
      { label: "Engineered for", value: "Consistent scale" },
    ],
    object: "flour",
  },
  {
    id: "sampling",
    n: 3,
    label: "Sampling",
    eyebrow: "Validation",
    title: "Test it before you launch it.",
    description:
      "Refine taste, size, texture, filling, and presentation through sample development before production.",
    ctaLabel: "Request a Sample",
    href: "/contact",
    outputTitle: "Sample batch",
    outputDescription: "Trialled, refined, approved by you",
    tags: ["Trial Batch", "Refinement", "Approval"],
    proofCards: [
      { label: "Process", value: "Trial & refine" },
      { label: "Gate", value: "Your approval" },
    ],
    object: "croissant",
  },
  {
    id: "packaging",
    n: 4,
    label: "Packaging",
    eyebrow: "Shelf presentation",
    title: "Packaging that makes the product shelf-ready.",
    description:
      "Prepare bakery products with box format, label direction, and retail presentation in mind.",
    ctaLabel: "Plan Packaging",
    href: "/private-label",
    outputTitle: "Packaging plan",
    outputDescription: "Format, label & shelf look",
    tags: ["Box Format", "Label Direction", "Shelf Look"],
    proofCards: [
      { label: "Designed for", value: "Shelf appeal" },
      { label: "Built for", value: "Retail compliance" },
    ],
    object: "carton",
  },
  {
    id: "production",
    n: 5,
    label: "Production",
    eyebrow: "Manufacturing",
    title: "Scaled bakery manufacturing under one roof.",
    description:
      "Produce consistent bakery batches for brands, retailers, distributors, and private label partners.",
    ctaLabel: "Check Production Capacity",
    href: "/capabilities",
    outputTitle: "Production batch",
    outputDescription: "Controlled, consistent output",
    tags: ["Batch Control", "Capacity", "Consistency"],
    proofCards: [
      { label: "Run on", value: "Certified lines" },
      { label: "Held to", value: "Batch consistency" },
    ],
    object: "bun",
  },
  {
    id: "qc",
    n: 6,
    label: "QC",
    eyebrow: "Quality control",
    title: "Controlled quality before supply.",
    description:
      "Support consistency through product, packaging, and batch-level quality checks.",
    ctaLabel: "View Quality Process",
    href: "/quality",
    outputTitle: "QC check",
    outputDescription: "Standards verified & documented",
    tags: ["Checks", "Standards", "Documentation"],
    proofCards: [
      { label: "Aligned to", value: "ISO / HACCP" },
      { label: "Backed by", value: "Documentation" },
    ],
    object: "qc",
  },
  {
    id: "retail",
    n: 7,
    label: "Retail Ready",
    eyebrow: "Delivery",
    title: "Packed, supplied, and ready for market.",
    description:
      "Move from approved product to packed, supplied, retail-ready bakery output.",
    ctaLabel: "Start Private Label Project",
    href: "/private-label",
    outputTitle: "Retail-ready supply",
    outputDescription: "Packed, supplied, market ready",
    tags: ["Packed", "Supplied", "Market Ready"],
    proofCards: [
      { label: "Delivered", value: "Retail ready" },
      { label: "Through", value: "One partner" },
    ],
    object: "retail",
  },
];

// ── Client type switcher ────────────────────────────────────────────────────
// A light tone adjustment — one supporting line — without branching the whole UI.

export type ClientType = {
  id: string;
  label: string;
  /** Short supporting microcopy shown near the proof area. */
  support: string;
};

export const clientTypes: ClientType[] = [
  {
    id: "brand",
    label: "Brand Owner",
    support: "Build your bakery brand without building a factory.",
  },
  {
    id: "retailer",
    label: "Retailer",
    support: "Create retail-ready bakery products for your shelves.",
  },
  {
    id: "distributor",
    label: "Distributor",
    support: "Supply consistent bakery products across multiple outlets.",
  },
  {
    id: "cafe",
    label: "Café Chain",
    support: "Develop bakery products that can scale across branches.",
  },
  {
    id: "horeca",
    label: "HoReCa Supplier",
    support:
      "Support hospitality and foodservice clients with reliable bakery supply.",
  },
];

// ── Before / With value strip ───────────────────────────────────────────────

export const beforeWith = {
  before: {
    title: "Before Al Shehail",
    body: "Idea, recipe, packaging, supplier, and production all managed separately.",
  },
  with: {
    title: "With Al Shehail",
    body: "One connected manufacturing system from concept to retail-ready supply.",
  },
};

// ── Trust layer ─────────────────────────────────────────────────────────────

export type TrustGroup = { title: string; body: string };

export const trustLayer: TrustGroup[] = [
  {
    title: "Quality Systems",
    body: "ISO / HACCP certified manufacturing mindset.",
  },
  {
    title: "Retail Experience",
    body: "Built for supermarket and retail-ready expectations.",
  },
  {
    title: "Private Label Ready",
    body: "Product, packaging, production, and supply in one flow.",
  },
];

// ── Project readiness quiz ──────────────────────────────────────────────────

export const quiz = {
  q1: {
    question: "What do you need?",
    options: [
      { id: "idea", label: "I have an idea" },
      { id: "recipe", label: "I have a recipe" },
      { id: "private-label", label: "I need private label production" },
      { id: "pack-prod", label: "I need packaging + production" },
      { id: "retail", label: "I need retail-ready bakery products" },
    ],
  },
  q2: {
    question: "Product category",
    options: [
      { id: "croissant", label: "Croissant" },
      { id: "bread", label: "Bread" },
      { id: "buns", label: "Buns" },
      { id: "pastry", label: "Pastry" },
      { id: "maamoul", label: "Maamoul" },
      { id: "custom", label: "Custom" },
    ],
  },
};

export const CONTACT_HREF = "/contact";
