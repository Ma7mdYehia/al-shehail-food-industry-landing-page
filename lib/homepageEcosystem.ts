// Homepage restructure content map (Stage 01 — data only).
//
// This file is a centralized reference for the upcoming homepage "service
// ecosystem" direction. Nothing here is wired into the live homepage yet; it is
// the planned structure + copy for Stage 02 (hero slider refactor, 8-step
// process rebuild, and final service-section placement).
//
// Wording is intentionally conservative — no guaranteed distribution, retail
// access, sales, or marketing results.

// ── A. Recommended homepage journey ─────────────────────────────────────────

export type HomepageJourneySection = {
  key: string;
  title: string;
  purpose: string;
  notes: string;
};

export const homepageJourneySections: HomepageJourneySection[] = [
  {
    key: "hero-ecosystem",
    title: "Hero Ecosystem Slider",
    purpose:
      "Open with the wider Al Shehail ecosystem (manufacturing, packaging, distribution, marketing) instead of a manufacturing-only message.",
    notes:
      "Stage 02: replace the manufacturing-only hero slides with homepageHeroSlides below.",
  },
  {
    key: "about",
    title: "About Al Shehail",
    purpose: "Establish who Al Shehail is and the UAE-based manufacturing base.",
    notes: "Reuse existing AboutTeaser; no redesign in this stage.",
  },
  {
    key: "beyond-manufacturing",
    title: "Beyond Manufacturing Services",
    purpose:
      "Introduce the 4-service ecosystem as compact cards (already added as ServicesEcosystem).",
    notes:
      "Keep the 'Beyond Manufacturing' title. Stage 02 may adjust placement.",
  },
  {
    key: "products",
    title: "What We Manufacture",
    purpose: "Show the bakery product range (featured teaser).",
    notes: "Reuse existing Products teaser; do not change product taxonomy.",
  },
  {
    key: "manufacturing-process",
    title: "Manufacturing Process",
    purpose:
      "Keep the detailed concept-to-production workflow later in the page (not in the hero).",
    notes:
      "Stage 02: rebuild around manufacturingProcessNarrative below; reuse existing process visuals.",
  },
  {
    key: "partner-projects",
    title: "Partner Projects",
    purpose: "Show real partner/private-label projects and credibility.",
    notes: "Reuse existing partner content; no fake claims.",
  },
  {
    key: "retail-distribution-partners",
    title: "Retail & Distribution Partners",
    purpose: "Show market presence across retail channels.",
    notes: "Reuse existing MarketPresenceTeaser / retail partner content.",
  },
  {
    key: "final-cta",
    title: "Final CTA",
    purpose: "Convert: invite the visitor to start a project.",
    notes: "Reuse existing FinalCTA.",
  },
];

// ── B. Planned 6-slide ecosystem hero ───────────────────────────────────────

export type HeroSlideType = "video" | "image";

export type EcosystemHeroService =
  | "ecosystem"
  | "manufacturing"
  | "brand-design"
  | "distribution"
  | "digital-marketing";

export type EcosystemHeroSlide = {
  key: string;
  type: HeroSlideType;
  service: EcosystemHeroService;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Media path under /public, or null until the ecosystem hero asset exists. */
  media: string | null;
};

export const homepageHeroSlides: EcosystemHeroSlide[] = [
  {
    key: "ecosystem-open",
    type: "video",
    service: "ecosystem",
    title: "From Product Idea to Retail-Ready Execution",
    subtitle:
      "Al Shehail supports food brands across manufacturing, packaging, distribution, and product communication.",
    primaryCta: { label: "Start a Project", href: "/contact" },
    secondaryCta: { label: "Explore Services", href: "/services/distribution" },
    media: null,
  },
  {
    key: "manufacturing",
    type: "image",
    service: "manufacturing",
    title: "Private Label Food Manufacturing",
    subtitle:
      "Product development, sampling, production, and retail-ready bakery manufacturing for food brands.",
    primaryCta: { label: "Explore Manufacturing", href: "/private-label" },
    media: null,
  },
  {
    key: "brand-design",
    type: "image",
    service: "brand-design",
    title: "Packaging & Brand Design",
    subtitle:
      "Food-focused packaging direction and retail-ready brand presentation for your product range.",
    primaryCta: { label: "Explore Brand Design", href: "/services/brand-design" },
    media: null,
  },
  {
    key: "distribution",
    type: "image",
    service: "distribution",
    title: "Distribution Fleet & Retail Reach",
    subtitle:
      "Distribution coordination for finished products moving toward selected retail channels.",
    primaryCta: { label: "Explore Distribution", href: "/services/distribution" },
    media: null,
  },
  {
    key: "digital-marketing",
    type: "image",
    service: "digital-marketing",
    title: "Food Digital Marketing",
    subtitle:
      "Launch content, product storytelling, and digital communication direction for food brands.",
    primaryCta: {
      label: "Explore Marketing",
      href: "/services/digital-marketing",
    },
    media: null,
  },
  {
    key: "ecosystem-close",
    type: "video",
    service: "ecosystem",
    title: "One Partner Beyond Manufacturing",
    subtitle:
      "Build, package, distribute, and communicate your food product through one connected service ecosystem.",
    primaryCta: { label: "Talk to Al Shehail", href: "/contact" },
    media: null,
  },
];

// ── C. Manufacturing process narrative (8-step section) ──────────────────────
// Cleaner content direction for the concept-to-production section that stays
// later in the homepage. `possibleAssetKey` references existing images in
// /public where one fits; null where a placeholder is still needed. No files
// are moved in this stage.

export type ManufacturingProcessStep = {
  title: string;
  description: string;
  possibleAssetKey: string | null;
};

export const manufacturingProcessNarrative: {
  title: string;
  subtitle: string;
  steps: ManufacturingProcessStep[];
} = {
  title: "From Concept to Production",
  subtitle:
    "A clear manufacturing workflow that helps food brands move from product idea to controlled production and retail-ready handoff.",
  steps: [
    {
      title: "Product Idea",
      description:
        "We start from your brief — category, positioning, and target shelf.",
      possibleAssetKey: "/images/hero-journey/product-idea.webp",
    },
    {
      title: "Recipe Direction",
      description:
        "The recipe route is defined for taste, texture, and production feasibility.",
      possibleAssetKey: "/images/hero-journey/recipe.webp",
    },
    {
      title: "Sampling",
      description: "Samples are produced and refined through feedback.",
      possibleAssetKey: "/images/hero-journey/sampling.webp",
    },
    {
      title: "Packaging Direction",
      description:
        "Packaging format and presentation are aligned to the product and shelf.",
      possibleAssetKey: "/images/hero-journey/packaging.webp",
    },
    {
      title: "Production Planning",
      description: "Output is planned from sample through to volume.",
      possibleAssetKey: null,
    },
    {
      title: "Manufacturing",
      description: "Scaled production on certified bakery lines.",
      possibleAssetKey: "/images/hero-journey/production.webp",
    },
    {
      title: "Quality Control",
      description: "Checks are applied across handling, production, and packing.",
      possibleAssetKey: "/images/hero-journey/qc.webp",
    },
    {
      title: "Retail-Ready Handoff",
      description: "The finished product is prepared for retail-ready supply.",
      possibleAssetKey: "/images/hero-journey/retail-ready.webp",
    },
  ],
};
