// Data model for the interactive "From Idea to Shelf" hero journey.
//
// Everything here is data-driven so the hero stays CSS/SVG only (no photo or
// video media yet). The seven steps mirror Al Shehail's private-label flow as
// a focused, presentation-friendly view. No unverified figures are used — all
// proof points are qualitative.

import type { PremiumObjectName } from "@/components/visuals/PremiumObjects";

export type JourneyProof = { label: string; value: string };

export type JourneyStep = {
  /** Stable id used for keys, aria, and quiz mapping. */
  id: string;
  /** 1-based position. */
  n: number;
  /** Short rail label. */
  label: string;
  /** Decorative SVG object shown on the node. */
  object: PremiumObjectName;
  /** Small descriptor tags shown on the active step. */
  tags: string[];
  /** Dynamic hero title for this step. */
  title: string;
  /** Dynamic hero paragraph for this step. */
  paragraph: string;
  /** Dynamic primary CTA label for this step. */
  ctaLabel: string;
  /** Expanded copy shown inside the right-side system card. */
  detail: string;
  /** "Current Output" floating card content. */
  output: { label: string; caption: string };
  /** Two compact proof cards shown under the hero copy. */
  proof: [JourneyProof, JourneyProof];
};

export const journeySteps: JourneyStep[] = [
  {
    id: "idea",
    n: 1,
    label: "Product Idea",
    object: "recipe",
    tags: ["Product Brief", "Feasibility", "Category Direction"],
    title: "Start from an idea — we shape it into a product",
    paragraph:
      "Bring a concept, a category gap, or a shelf you want to win. We turn it into a clear, manufacturable bakery brief with honest feasibility and category direction.",
    ctaLabel: "Discuss Your Product Idea",
    detail:
      "We translate your brief into a buildable product direction — category, positioning, and the practical route to a manufacturable bakery line.",
    output: { label: "Product brief", caption: "Concept shaped for manufacturing" },
    proof: [
      { label: "Starting point", value: "Your idea or brief" },
      { label: "You get", value: "Feasibility & direction" },
    ],
  },
  {
    id: "recipe",
    n: 2,
    label: "Recipe",
    object: "flour",
    tags: ["Taste", "Texture", "Scale"],
    title: "A recipe built for taste — and for scale",
    paragraph:
      "Our development team formulates for taste, texture, and clean, repeatable production — so what wins a tasting still works batch after batch at volume.",
    ctaLabel: "Develop My Recipe",
    detail:
      "Formulation tuned for flavour and texture, then engineered to hold up on a production line so quality stays consistent at scale.",
    output: { label: "Recipe direction", caption: "Formulated for repeatable quality" },
    proof: [
      { label: "Developed for", value: "Taste & texture" },
      { label: "Engineered for", value: "Consistent scale" },
    ],
  },
  {
    id: "sampling",
    n: 3,
    label: "Sampling",
    object: "croissant",
    tags: ["Trial Batch", "Refinement", "Approval"],
    title: "Taste it before you commit",
    paragraph:
      "We produce trial batches and refine through your feedback until the product is right for your brand — nothing scales before you approve it.",
    ctaLabel: "Request a Sample",
    detail:
      "Trial batches you can taste and assess, refined round by round until the sample matches the product you want on shelf.",
    output: { label: "Sample batch", caption: "Trialled, refined, approved by you" },
    proof: [
      { label: "Process", value: "Trial & refine" },
      { label: "Gate", value: "Your approval" },
    ],
  },
  {
    id: "packaging",
    n: 4,
    label: "Packaging",
    object: "carton",
    tags: ["Box Format", "Label Direction", "Shelf Look"],
    title: "Packaging that earns its place on shelf",
    paragraph:
      "Private-label packaging engineered for shelf appeal, compliance, and product protection — box format, label direction, and the look that fits your category.",
    ctaLabel: "Plan Packaging",
    detail:
      "Format, labelling, and shelf presence developed for your brand — built for retail compliance and to protect the product in transit.",
    output: { label: "Packaging plan", caption: "Format, label & shelf look" },
    proof: [
      { label: "Designed for", value: "Shelf appeal" },
      { label: "Built for", value: "Retail compliance" },
    ],
  },
  {
    id: "production",
    n: 5,
    label: "Production",
    object: "bun",
    tags: ["Batch Control", "Capacity", "Consistency"],
    title: "Scaled production, batch after batch",
    paragraph:
      "Manufacturing on certified bakery lines with batch control and consistent output — so your product stays the same whether it's the first run or the hundredth.",
    ctaLabel: "Check Production Capacity",
    detail:
      "Certified bakery lines with batch control, so output stays consistent run after run as your volumes grow.",
    output: { label: "Production batch", caption: "Controlled, consistent output" },
    proof: [
      { label: "Run on", value: "Certified lines" },
      { label: "Held to", value: "Batch consistency" },
    ],
  },
  {
    id: "qc",
    n: 6,
    label: "QC",
    object: "qc",
    tags: ["Checks", "Standards", "Documentation"],
    title: "Quality checked and documented",
    paragraph:
      "ISO- and HACCP-aligned checks safeguard food safety and quality at every stage, with the documentation retail partners expect.",
    ctaLabel: "View Quality Process",
    detail:
      "Structured checks against recognised food-safety standards, documented so your retail and distribution partners can trust every batch.",
    output: { label: "QC check", caption: "Standards verified & documented" },
    proof: [
      { label: "Aligned to", value: "ISO / HACCP" },
      { label: "Backed by", value: "Documentation" },
    ],
  },
  {
    id: "retail",
    n: 7,
    label: "Retail Ready",
    object: "retail",
    tags: ["Packed", "Supplied", "Market Ready"],
    title: "Retail-ready supply, from one partner",
    paragraph:
      "Finished, branded, retail-ready product — developed, packed, and supplied reliably to your distribution network. One connected system from concept to shelf.",
    ctaLabel: "Start Private Label Project",
    detail:
      "Packed and market-ready product supplied to your network — the end of a single connected line that began with your idea.",
    output: { label: "Retail-ready supply", caption: "Packed, supplied, market ready" },
    proof: [
      { label: "Delivered", value: "Retail ready" },
      { label: "Through", value: "One partner" },
    ],
  },
];

// ── Client type switcher ────────────────────────────────────────────────────
// A light tone adjustment — one audience line — without branching the whole UI.

export type ClientType = {
  id: string;
  label: string;
  /** Short audience line shown near the hero title. */
  angle: string;
};

export const clientTypes: ClientType[] = [
  {
    id: "brand",
    label: "Brand Owner",
    angle: "Launch your own bakery line without building a factory.",
  },
  {
    id: "retailer",
    label: "Retailer",
    angle: "Own-label bakery products developed and supplied for your shelves.",
  },
  {
    id: "distributor",
    label: "Distributor",
    angle: "A reliable manufacturing source for a consistent bakery range.",
  },
  {
    id: "cafe",
    label: "Café Chain",
    angle: "Signature bakery items made consistently across every location.",
  },
  {
    id: "horeca",
    label: "HoReCa Supplier",
    angle: "Volume bakery supply your kitchens and clients can count on.",
  },
];

// ── Before / With value message ─────────────────────────────────────────────

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

export type TrustGroup = { title: string; items: string[] };

export const trustLayer: TrustGroup[] = [
  { title: "Quality Systems", items: ["ISO", "HACCP"] },
  { title: "Retail Experience", items: ["Carrefour Approved"] },
  {
    title: "Private Label Ready",
    items: ["Product", "Packaging", "Supply"],
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
