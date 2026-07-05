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
  "سيُضاف من ورقة مواصفات موثّقة";

// ── Types ────────────────────────────────────────────────────────────────────

/** Lifecycle / data-readiness state of a single product within a project. */
export type PartnerProductStatus = "active" | "planned" | "needs-data";

export type PartnerProjectCategory =
  | "مخبوزات صحية / خبز وظيفي"
  | "إنتاج مخبوزات عضوية / لعلامة غذائية حكومية"
  | "حلويات ومخبوزات قائمة على التمر";

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
    category: "مخبوزات صحية / خبز وظيفي",
    positioning:
      "إنتاج مخبوزات صحية يركّز على مكونات نظيفة وتخمّر طويل وملف غذائي أقوى.",
    overview: [
      "HÄLSA Bake مشروع مخبوزات صحية ووظيفية: خبز مطوَّر حول مكونات نظيفة، وتخمّر طبيعي، وتوجه غذائي أقوى من خطوط المخبوزات القياسية.",
      "تمتد التشكيلة من الأساسيات الصحية اليومية — خبز مسطح، وتوست، وكعك، وصامولي — إلى خبز وظيفي مثل عالي البروتين، وعالي الألياف، والأرغفة المرشوشة بالبذور.",
    ],
    productionFocus: [
      "منتجات مخبوزات صحية للتجزئة اليومية",
      "خبز وظيفي (اتجاهات البروتين، والألياف، والبذور)",
      "خبز بالحبوب الكاملة والشوفان",
    ],
    ingredientStrategy: [
      "توجه مكونات نظيفة (Clean-Label)",
      "مكونات عضوية حيثما ينطبق ذلك ويكون موثّقًا",
      "تموضع بدون سكر مضاف / سكر منخفض فقط حيثما يكون موثّقًا لكل منتج",
    ],
    processNotes: [
      "قدرة على التخمّر الطبيعي / التخمّر الطويل",
      "يمكن أن يصل التخمّر إلى 12 ساعة، وحتى 24 ساعة كقدرة تشغيلية — يُعتمد ذلك لكل منتج مقابل ورقة مواصفات موثّقة",
    ],
    nutritionFocus: [
      "ملف البروتين",
      "ملف الكربوهيدرات",
      "ملف السكر",
      "ملف الألياف",
      "ملف السعرات الحرارية",
      `القيم لكل منتج: ${NEEDS_VERIFICATION}`,
    ],
    complianceNotes: [
      "توجه تركيبة بمكونات نظيفة",
      `الحقائق الغذائية وأي ادعاءات وظيفية: ${NEEDS_VERIFICATION}`,
    ],
    products: [
      {
        slug: "healthy-flatbread",
        name: "خبز مسطح صحي",
        category: "خبز مسطح",
        shortDescription:
          "خبز مسطح طري وسهل الطي، ننتجه بتوجه صحي ومكونات نظيفة.",
        image: null,
        keyNotes: [
          "توجه مكونات نظيفة",
          "شكل صحي للاستخدام اليومي في التجزئة",
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "healthy-toast",
        name: "توست صحي",
        category: "خبز طري",
        shortDescription:
          "رغيف توست شرائح بتموضع صحي لتشكيلة يومية أفضل.",
        image: null,
        keyNotes: ["شكل رغيف شرائح", "توجه مكونات نظيفة"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "burger-buns",
        name: "خبز برغر",
        category: "خبز طري",
        shortDescription: "خبز برغر طري بمواصفات صحية أفضل.",
        image: null,
        keyNotes: ["ثبات مقاس الخبز", "توجه مكونات نظيفة"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "samoon",
        name: "صامولي",
        category: "خبز طري",
        shortDescription: "خبز صامولي محلي بتوجه صحي.",
        image: null,
        keyNotes: ["شكل صامولي تقليدي", "توجه مكونات نظيفة"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "high-protein-bread",
        name: "خبز عالي البروتين",
        category: "خبز وظيفي",
        shortDescription:
          "خبز بتموضع حول ملف بروتين أعلى.",
        image: null,
        keyNotes: [
          "تموضع بروتين أعلى",
          `ادعاء محتوى البروتين: ${NEEDS_VERIFICATION}`,
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "high-fiber-bread",
        name: "خبز عالي الألياف",
        category: "خبز وظيفي",
        shortDescription: "خبز بتموضع حول ملف ألياف أعلى.",
        image: null,
        keyNotes: [
          "تموضع ألياف أعلى",
          `ادعاء محتوى الألياف: ${NEEDS_VERIFICATION}`,
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "whole-wheat-bread",
        name: "خبز القمح الكامل",
        category: "حبوب كاملة",
        shortDescription: "خبز قمح كامل لتشكيلة يومية صحية.",
        image: null,
        keyNotes: ["تركيبة قمح كامل", "توجه مكونات نظيفة"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "oats-bread",
        name: "خبز الشوفان",
        category: "حبوب كاملة",
        shortDescription: "خبز قائم على الشوفان بطابع صحي ومشبع.",
        image: null,
        keyNotes: ["تركيبة قائمة على الشوفان", "توجه مكونات نظيفة"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "chia-bread",
        name: "خبز الشيا",
        category: "خبز وظيفي بالبذور",
        shortDescription: "خبز مرشوش ببذور الشيا لتوجه وظيفي.",
        image: null,
        keyNotes: ["تركيبة ببذور الشيا", "تموضع وظيفي"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "black-seed-bread",
        name: "خبز الحبة السوداء",
        category: "خبز وظيفي بالبذور",
        shortDescription:
          "خبز مرشوش بالحبة السوداء لتوجه وظيفي.",
        image: null,
        keyNotes: ["تركيبة بالحبة السوداء", "تموضع وظيفي"],
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
    category: "إنتاج مخبوزات عضوية / لعلامة غذائية حكومية",
    positioning:
      "إنتاج مخبوزات باستخدام مكونات موردة من EKTIFA، مع دعم تطوير للعلامة الخاصة.",
    overview: [
      "يغطي مشروع EKTIFA إنتاج مخبوزات مبني على مكونات موردة من EKTIFA، مع تقديم الشحيل دعم التطوير والتصنيع للعلامة الخاصة.",
      "تمتد التشكيلة من المخبوزات الفرنسية، والخبز الطري، والحلويات القائمة على التمر، تُنتَج وفق مواصفات العلامة.",
    ],
    productionFocus: [
      "إنتاج مخبوزات بعلامة خاصة لعلامة EKTIFA",
      "مخبوزات فرنسية، وخبز طري، وحلويات قائمة على التمر",
      "دعم تطوير من الفكرة إلى التوريد الجاهز للرف",
    ],
    ingredientStrategy: [
      "يُنتَج باستخدام دقيق قمح، ودقيق قمح كامل، وسميد موردة من EKTIFA",
      "استخدام حليب طبيعي حيثما ينطبق ذلك",
      `نطاق المكونات العضوية وأي ادعاءات عضوية: ${NEEDS_VERIFICATION}`,
    ],
    processNotes: [
      "عمليات مخبوزات وتطبيق قياسية حسب نوع المنتج",
      `تفاصيل التخمّر / العملية لكل منتج: ${NEEDS_VERIFICATION}`,
    ],
    nutritionFocus: [
      "يختلف الملف الغذائي حسب نوع المنتج",
      `القيم الغذائية لكل منتج: ${NEEDS_VERIFICATION}`,
    ],
    complianceNotes: [
      "يُنتَج وفق مواصفات المكونات والمنتج الخاصة بالعلامة الشريكة",
      `الشهادات والتحقق من الادعاء العضوي: ${NEEDS_VERIFICATION}`,
    ],
    products: [
      {
        slug: "mini-croissant",
        name: "كرواسان صغير",
        category: "مخبوزات فرنسية",
        shortDescription: "كرواسان صغير مطبّق لرفوف المخابز والمقاهي.",
        image: null,
        keyNotes: ["مخبوزات فرنسية مطبّقة", "يُنتَج وفق مواصفات العلامة"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "burger-buns",
        name: "خبز برغر",
        category: "خبز طري",
        shortDescription: "خبز برغر طري يُنتَج وفق مواصفات العلامة.",
        image: null,
        keyNotes: ["ثبات مقاس الخبز", "دقيق موردّ من EKTIFA"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "samoon",
        name: "صامولي",
        category: "خبز طري",
        shortDescription: "خبز صامولي محلي يُنتَج وفق مواصفات العلامة.",
        image: null,
        keyNotes: ["شكل صامولي تقليدي", "دقيق موردّ من EKTIFA"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "toast",
        name: "توست",
        category: "خبز طري",
        shortDescription: "رغيف توست شرائح يُنتَج وفق مواصفات العلامة.",
        image: null,
        keyNotes: ["شكل رغيف شرائح", "دقيق موردّ من EKTIFA"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "maamoul",
        name: "معمول",
        category: "حلويات التمر",
        shortDescription: "معمول محشو بالتمر يُنتَج وفق مواصفات العلامة.",
        image: null,
        keyNotes: ["حلوى محشوة بالتمر", "شكل تقليدي"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "large-croissant",
        name: "كرواسان كبير",
        category: "مخبوزات فرنسية",
        shortDescription: "كرواسان كامل الحجم مطبّق لرفوف المخابز.",
        image: null,
        keyNotes: ["مخبوزات فرنسية مطبّقة", "يُنتَج وفق مواصفات العلامة"],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "pate",
        name: "باتيه",
        category: "مخبوزات فرنسية / معجنات",
        shortDescription: "باتيه معجنات يُنتَج وفق مواصفات العلامة.",
        image: null,
        keyNotes: [
          "شكل معجنات",
          `تفاصيل الحشو / الوصفة: ${NEEDS_VERIFICATION}`,
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "tamriya",
        name: "تمرية",
        category: "حلويات التمر",
        shortDescription:
          "حلوى قائمة على التمر مبنية على التمر والسمن والطحينة.",
        image: null,
        keyNotes: ["مصنوعة من التمر والسمن والطحينة"],
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
    category: "حلويات ومخبوزات قائمة على التمر",
    positioning:
      "حلويات مخبوزة قائمة على التمر، تركّز على الطعم التقليدي وتوجه تحلية أنظف حيثما أمكن.",
    overview: [
      "يركّز مشروع Al Tahan على الحلويات التقليدية القائمة على التمر — المعمول والتمرية — تُنتَج بطعم أصيل.",
      "حيثما أمكن، يميل التوجه نحو تحلية أنظف (مثل التحلية الطبيعية بالعسل حيثما ينطبق ذلك)، دون الادعاء بأن المنتج خالٍ من السكر.",
    ],
    productionFocus: [
      "حلويات ومخبوزات قائمة على التمر",
      "معمول وتمرية تقليديان",
    ],
    ingredientStrategy: [
      "وصفات يتصدرها التمر",
      "توجه نحو سكر أقل حيثما أمكن",
      "استبدال المحليات الاصطناعية بتوجهات تحلية طبيعية (مثل العسل) حيثما ينطبق ذلك",
      "لا يُقدَّم أي ادعاء بأن المنتج خالٍ من السكر",
    ],
    processNotes: [
      "تحضير حلويات تقليدي لكل منتج",
      `تفاصيل العملية لكل منتج: ${NEEDS_VERIFICATION}`,
    ],
    nutritionFocus: [
      "ملف سكر قائم على التمر",
      `القيم الغذائية لكل منتج: ${NEEDS_VERIFICATION}`,
    ],
    complianceNotes: [
      "ادعاءات محافِظة وموثّقة فقط",
      `الحقائق الغذائية وادعاءات التحلية: ${NEEDS_VERIFICATION}`,
    ],
    products: [
      {
        slug: "maamoul",
        name: "معمول",
        category: "حلويات التمر",
        shortDescription: "معمول تقليدي محشو بالتمر.",
        image: null,
        keyNotes: [
          "حلوى محشوة بالتمر",
          "توجه تحلية أنظف حيثما أمكن",
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "tamriya",
        name: "تمرية",
        category: "حلويات التمر",
        shortDescription:
          "حلوى قائمة على التمر مبنية على التمر والسمن والطحينة.",
        image: null,
        keyNotes: [
          "مصنوعة من التمر والسمن والطحينة",
          "توجه تحلية طبيعية حيثما ينطبق ذلك — وليست خالية من السكر",
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
  ].join(" ");

  const chips: string[] = [];

  if (
    project.category === "مخبوزات صحية / خبز وظيفي" ||
    project.category === "إنتاج مخبوزات عضوية / لعلامة غذائية حكومية"
  ) {
    chips.push("يركّز على التغذية");
  }
  if (project.category === "حلويات ومخبوزات قائمة على التمر") {
    chips.push("حلويات قائمة على التمر");
  }
  if (text.includes("عضوي")) chips.push("توجه عضوي");
  if (text.includes("تخمّر") || text.includes("تخمر")) {
    chips.push("تخمّر طويل");
  }
  if (text.includes("مكونات نظيفة")) {
    chips.push("مكونات نظيفة");
  }
  if (text.includes("سكر")) chips.push("توجه أقل سكرًا");

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
