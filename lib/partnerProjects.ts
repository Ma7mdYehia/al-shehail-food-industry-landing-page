// Centralized "Single Partner Project" data model for Al Shehail Food Industries.
//
// This is the single source of truth for the partner-project system: each entry
// describes one manufacturing partner's project (positioning, production focus,
// ingredient strategy, process notes, nutrition focus, compliance notes) and the
// products produced under it. It is data only — the popup / detail UI is built in
// a later stage and consumes these structures + helpers.
//
// Guardrails (important):
//   • No unverified numbers, nutrition values, certifications, or claims.
//   • Anything not yet verified uses NEEDS_VERIFICATION as a clear placeholder.
//   • Process / nutrition language is phrased as capability, not a per-SKU claim,
//     until a verified specification sheet confirms it.

import type { PartnerAssets, AssetPath } from "@/lib/assets";
import { assets } from "@/lib/assets";

// ── Placeholder marker ───────────────────────────────────────────────────────
// Use this anywhere a verified figure or claim is still missing, so the UI and
// future editors can clearly see what still needs real data.
export const NEEDS_VERIFICATION =
  "To be added from verified specification sheet";

// ── Types ────────────────────────────────────────────────────────────────────

/** Lifecycle / data-readiness state of a single product within a project. */
export type PartnerProductStatus = "active" | "planned" | "needs-data";

export type PartnerProjectCategory =
  | "Healthy Bakery / Functional Bread"
  | "Organic / Government Food Brand Bakery Production"
  | "Date-Based Sweets / Bakery";

/**
 * A single product produced under a partner project. Kept intentionally light
 * for now; richer per-product detail (full nutrition tables, formats, packaging)
 * can be layered on later without breaking this shape.
 */
export type PartnerProjectProduct = {
  /** Unique within its project; used for future product-detail routing. */
  slug: string;
  name: string;
  /** Free-text product category label (e.g. "Soft Bread", "Date Sweets"). */
  category: string;
  shortDescription: string;
  /** Image path under /public, or null to fall back to a placeholder in the UI. */
  image: string | null;
  /** Conservative, verified-safe product notes. */
  keyNotes: string[];
  /**
   * Nutrition highlights. Until a verified spec sheet exists these stay as a
   * single NEEDS_VERIFICATION placeholder rather than invented values.
   */
  nutritionHighlights: string[];
  status: PartnerProductStatus;
};

/** One manufacturing partner's project. */
export type PartnerProject = {
  /** URL/lookup slug for the project. */
  slug: string;
  partnerName: string;
  /** Key into assets.partners for the official logo (or null if none). */
  partnerAssetKey: keyof PartnerAssets | null;
  /** Resolved logo path from the asset manifest (null until a file is supplied). */
  logoPath: AssetPath;
  category: PartnerProjectCategory;
  /** One-line positioning statement. */
  positioning: string;
  /** Longer-form overview paragraphs. */
  overview: string[];
  /** What the project produces / specializes in. */
  productionFocus: string[];
  /** Ingredient sourcing & formulation direction. */
  ingredientStrategy: string[];
  /** Fermentation / process capability notes. */
  processNotes: string[];
  /** Nutrition dimensions the project is built around (not numeric claims). */
  nutritionFocus: string[];
  /** Quality / compliance / clean-label direction. */
  complianceNotes: string[];
  products: PartnerProjectProduct[];
};

// ── Data ─────────────────────────────────────────────────────────────────────

export const partnerProjects: PartnerProject[] = [
  // 1. HÄLSA Bake ─────────────────────────────────────────────────────────────
  {
    slug: "halsa-bake",
    partnerName: "HÄLSA Bake",
    partnerAssetKey: "halsaBake",
    logoPath: assets.partners.halsaBake,
    category: "Healthy Bakery / Functional Bread",
    positioning:
      "Healthy bakery production focused on clean ingredients, long fermentation, and stronger nutrition profiles.",
    overview: [
      "HÄLSA Bake is a healthy and functional bakery project: breads developed around clean-label ingredients, natural fermentation, and a stronger nutrition direction than standard bakery lines.",
      "The range spans everyday healthy staples — flatbread, toast, buns, and samoon — alongside functional breads such as high-protein, high-fibre, and seeded loaves.",
    ],
    productionFocus: [
      "Healthy bakery products for everyday retail",
      "Functional breads (protein, fibre, seeded directions)",
      "Whole-grain and oats-based breads",
    ],
    ingredientStrategy: [
      "Clean-label ingredient direction",
      "Organic ingredients where applicable and verified",
      "No added sugar / low sugar positioning only where verified per SKU",
    ],
    processNotes: [
      "Natural sourdough / long-fermentation process capability",
      "Fermentation can reach 12 hours, and up to 24 hours, as a process capability — confirmed per SKU against a verified specification sheet",
    ],
    nutritionFocus: [
      "Protein profile",
      "Carbohydrate profile",
      "Sugar profile",
      "Fibre profile",
      "Calorie profile",
      `Per-product values: ${NEEDS_VERIFICATION}`,
    ],
    complianceNotes: [
      "Clean-label formulation direction",
      `Nutrition facts and any functional claims: ${NEEDS_VERIFICATION}`,
    ],
    products: [
      {
        slug: "healthy-flatbread",
        name: "Healthy Flatbread",
        category: "Flat Bread",
        shortDescription:
          "Soft, foldable flatbread produced with a clean-label, healthy direction.",
        image: null,
        keyNotes: [
          "Clean-label ingredient direction",
          "Everyday healthy retail format",
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "healthy-toast",
        name: "Healthy Toast",
        category: "Soft Bread",
        shortDescription:
          "Sliced toast loaf positioned for a healthier everyday range.",
        image: null,
        keyNotes: ["Sliced loaf format", "Clean-label direction"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "burger-buns",
        name: "Burger Buns",
        category: "Soft Bread",
        shortDescription: "Soft burger buns produced to a healthier specification.",
        image: null,
        keyNotes: ["Consistent bun sizing", "Clean-label direction"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "samoon",
        name: "Samoon",
        category: "Soft Bread",
        shortDescription: "Regional samoon bread produced with a healthy direction.",
        image: null,
        keyNotes: ["Traditional samoon format", "Clean-label direction"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "high-protein-bread",
        name: "High-Protein Bread",
        category: "Functional Bread",
        shortDescription:
          "Bread positioned around a higher-protein profile.",
        image: null,
        keyNotes: [
          "Higher-protein positioning",
          `Protein content claim: ${NEEDS_VERIFICATION}`,
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "high-fiber-bread",
        name: "High-Fibre Bread",
        category: "Functional Bread",
        shortDescription: "Bread positioned around a higher-fibre profile.",
        image: null,
        keyNotes: [
          "Higher-fibre positioning",
          `Fibre content claim: ${NEEDS_VERIFICATION}`,
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "whole-wheat-bread",
        name: "Whole Wheat Bread",
        category: "Whole Grain",
        shortDescription: "Whole wheat bread for a wholesome everyday range.",
        image: null,
        keyNotes: ["Whole wheat formulation", "Clean-label direction"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "oats-bread",
        name: "Oats Bread",
        category: "Whole Grain",
        shortDescription: "Oats-based bread for a wholesome, hearty profile.",
        image: null,
        keyNotes: ["Oats-based formulation", "Clean-label direction"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "chia-bread",
        name: "Chia Bread",
        category: "Functional / Seeded Bread",
        shortDescription: "Seeded bread made with chia for a functional direction.",
        image: null,
        keyNotes: ["Chia-seeded formulation", "Functional positioning"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "black-seed-bread",
        name: "Black Seed Bread",
        category: "Functional / Seeded Bread",
        shortDescription:
          "Seeded bread made with black seed for a functional direction.",
        image: null,
        keyNotes: ["Black-seed formulation", "Functional positioning"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
    ],
  },

  // 2. EKTIFA ──────────────────────────────────────────────────────────────────
  {
    slug: "ektifa",
    partnerName: "EKTIFA",
    partnerAssetKey: "ektifa",
    logoPath: assets.partners.ektifa,
    category: "Organic / Government Food Brand Bakery Production",
    positioning:
      "Bakery production using EKTIFA supplied ingredients and private-label development support.",
    overview: [
      "The EKTIFA project covers bakery production built on EKTIFA-supplied ingredients, with Al Shehail providing private-label development and manufacturing support.",
      "The range spans French bakery, soft breads, and date-based sweets, produced to the brand's specification.",
    ],
    productionFocus: [
      "Private-label bakery production for the EKTIFA brand",
      "French bakery, soft breads, and date-based sweets",
      "Development support from concept to retail-ready supply",
    ],
    ingredientStrategy: [
      "Produced with EKTIFA-supplied wheat flour, whole-wheat flour, and semolina",
      "Natural milk used where applicable",
      `Organic ingredient scope and any organic claims: ${NEEDS_VERIFICATION}`,
    ],
    processNotes: [
      "Standard bakery and lamination processes per product type",
      `Fermentation / process specifics per SKU: ${NEEDS_VERIFICATION}`,
    ],
    nutritionFocus: [
      "Profile varies by product type",
      `Per-product nutrition values: ${NEEDS_VERIFICATION}`,
    ],
    complianceNotes: [
      "Produced to the partner brand's ingredient and product specification",
      `Certifications and organic verification: ${NEEDS_VERIFICATION}`,
    ],
    products: [
      {
        slug: "mini-croissant",
        name: "Mini Croissant",
        category: "French Bakery",
        shortDescription: "Laminated mini croissant for bakery and cafe shelves.",
        image: null,
        keyNotes: ["Laminated French bakery", "Produced to brand specification"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "burger-buns",
        name: "Burger Buns",
        category: "Soft Bread",
        shortDescription: "Soft burger buns produced to brand specification.",
        image: null,
        keyNotes: ["Consistent bun sizing", "EKTIFA-supplied flour"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "samoon",
        name: "Samoon",
        category: "Soft Bread",
        shortDescription: "Regional samoon bread produced to brand specification.",
        image: null,
        keyNotes: ["Traditional samoon format", "EKTIFA-supplied flour"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "toast",
        name: "Toast",
        category: "Soft Bread",
        shortDescription: "Sliced toast loaf produced to brand specification.",
        image: null,
        keyNotes: ["Sliced loaf format", "EKTIFA-supplied flour"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "maamoul",
        name: "Maamoul",
        category: "Date Sweets",
        shortDescription: "Filled date maamoul produced to brand specification.",
        image: null,
        keyNotes: ["Date-filled sweet", "Traditional format"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "large-croissant",
        name: "Large Croissant",
        category: "French Bakery",
        shortDescription: "Full-size laminated croissant for bakery shelves.",
        image: null,
        keyNotes: ["Laminated French bakery", "Produced to brand specification"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "pate",
        name: "Pâté",
        category: "French Bakery / Pastry",
        shortDescription: "Pastry pâté produced to brand specification.",
        image: null,
        keyNotes: [
          "Pastry format",
          `Filling / recipe details: ${NEEDS_VERIFICATION}`,
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "tamriya",
        name: "Tamriya",
        category: "Date Sweets",
        shortDescription:
          "Date-based sweet built around dates, ghee, and sesame tahini.",
        image: null,
        keyNotes: ["Made with dates, ghee, and sesame tahini"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
    ],
  },

  // 3. Al Tahan ─────────────────────────────────────────────────────────────────
  {
    slug: "al-tahan",
    partnerName: "Al Tahan",
    partnerAssetKey: "alTahan",
    logoPath: assets.partners.alTahan,
    category: "Date-Based Sweets / Bakery",
    positioning:
      "Date-based bakery sweets with a focus on traditional taste and cleaner sweetening direction where possible.",
    overview: [
      "The Al Tahan project focuses on traditional date-based sweets — maamoul and tamriya — produced for authentic taste.",
      "Where possible, the direction leans toward cleaner sweetening (such as natural sweetening with honey where applicable), without claiming a sugar-free product.",
    ],
    productionFocus: [
      "Date-based sweets and bakery",
      "Traditional maamoul and tamriya",
    ],
    ingredientStrategy: [
      "Date-forward recipes",
      "Lower-sugar direction where possible",
      "Replacing artificial sweeteners with natural sweetening directions (e.g. honey) where applicable",
      "No sugar-free claim is made",
    ],
    processNotes: [
      "Traditional sweets preparation per product",
      `Process specifics per SKU: ${NEEDS_VERIFICATION}`,
    ],
    nutritionFocus: [
      "Date-based sugar profile",
      `Per-product nutrition values: ${NEEDS_VERIFICATION}`,
    ],
    complianceNotes: [
      "Conservative, verified claims only",
      `Nutrition facts and sweetening claims: ${NEEDS_VERIFICATION}`,
    ],
    products: [
      {
        slug: "maamoul",
        name: "Maamoul",
        category: "Date Sweets",
        shortDescription: "Traditional filled date maamoul.",
        image: null,
        keyNotes: [
          "Date-filled sweet",
          "Cleaner sweetening direction where possible",
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "tamriya",
        name: "Tamriya",
        category: "Date Sweets",
        shortDescription:
          "Date-based sweet built around dates, ghee, and sesame tahini.",
        image: null,
        keyNotes: [
          "Made with dates, ghee, and sesame tahini",
          "Natural sweetening direction where applicable — not sugar-free",
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
    ],
  },
];

// ── Lookup helpers ───────────────────────────────────────────────────────────

/** Map of project slug → project, for O(1) lookups. */
export const partnerProjectBySlug: Record<string, PartnerProject> =
  Object.fromEntries(partnerProjects.map((p) => [p.slug, p]));

/** Map of partner name → project, for connecting existing partner entries. */
export const partnerProjectByPartnerName: Record<string, PartnerProject> =
  Object.fromEntries(partnerProjects.map((p) => [p.partnerName, p]));

/** Returns the project for a slug, or undefined if none exists. */
export function getPartnerProjectBySlug(
  slug: string
): PartnerProject | undefined {
  return partnerProjectBySlug[slug];
}

/** Returns the project for a partner name, or undefined if none exists. */
export function getPartnerProjectByPartnerName(
  name: string
): PartnerProject | undefined {
  return partnerProjectByPartnerName[name];
}

/**
 * Conservative "strength" chips for partner cards, derived only from the
 * existing project wording — no new claims are introduced. Sugar wording maps to
 * the softer "Sugar-Conscious" rather than a hard "Sugar Free"; preservative /
 * clean-label wording maps to "Clean Label Direction".
 */
export function getProjectStrengthChips(project: PartnerProject): string[] {
  const text = [
    project.positioning,
    project.category,
    ...project.productionFocus,
    ...project.ingredientStrategy,
    ...project.processNotes,
    ...project.nutritionFocus,
    ...project.complianceNotes,
  ]
    .join(" ")
    .toLowerCase();

  const chips: string[] = [];

  if (
    project.category === "Healthy Bakery / Functional Bread" ||
    project.category === "Organic / Government Food Brand Bakery Production"
  ) {
    chips.push("Nutrition-Focused");
  }
  if (project.category === "Date-Based Sweets / Bakery") {
    chips.push("Date-Based Sweets");
  }
  if (text.includes("organic")) chips.push("Organic Direction");
  if (
    text.includes("long-fermentation") ||
    text.includes("long fermentation") ||
    text.includes("sourdough")
  ) {
    chips.push("Long Fermentation");
  }
  if (text.includes("clean-label") || text.includes("clean label")) {
    chips.push("Clean Label Direction");
  }
  if (text.includes("sugar")) chips.push("Sugar-Conscious");

  return chips;
}

/** Finds a single product within a project by both slugs. */
export function getPartnerProjectProduct(
  projectSlug: string,
  productSlug: string
): PartnerProjectProduct | undefined {
  return getPartnerProjectBySlug(projectSlug)?.products.find(
    (product) => product.slug === productSlug
  );
}

/** All product entries still awaiting verified data, across every project. */
export function getProductsNeedingData(): {
  projectSlug: string;
  product: PartnerProjectProduct;
}[] {
  return partnerProjects.flatMap((project) =>
    project.products
      .filter((product) => product.status === "needs-data")
      .map((product) => ({ projectSlug: project.slug, product }))
  );
}
