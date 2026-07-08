// Centralized "Single Partner Project" data model for Al Shehail Food Industries.
//
// Single source of truth for the partner-project system. Data only — the popup /
// detail UI consumes these structures + helpers.
//
// Guardrails (important):
//   • No unverified numbers, nutrition values, certifications, or claims.
//   • Anything not yet verified uses NEEDS_VERIFICATION as a clear placeholder.
//   • Process / nutrition language is phrased as capability, not a per-SKU claim.
//
// Bilingual: display text fields are Localized ({ en, ar }). `category` stays an
// English union key used for logic; `categoryLabel` carries the display text.

import type { PartnerAssets, AssetPath } from "@/lib/assets";
import { assets } from "@/lib/assets";
import type { Localized } from "@/lib/i18n";

// ── Placeholder marker ───────────────────────────────────────────────────────
export const NEEDS_VERIFICATION: Localized = {
  en: "To be added from verified specification sheet",
  ar: "يُضاف من ورقة مواصفات موثّقة",
};

/** Build a "<label>: <needs verification>" Localized line. */
function nv(en: string, ar: string): Localized {
  return {
    en: `${en}: ${NEEDS_VERIFICATION.en}`,
    ar: `${ar}: ${NEEDS_VERIFICATION.ar}`,
  };
}

// ── Types ────────────────────────────────────────────────────────────────────

export type PartnerProductStatus = "active" | "planned" | "needs-data";

export type PartnerProjectCategory =
  | "Healthy Bakery / Functional Bread"
  | "Organic / Government Food Brand Bakery Production"
  | "Date-Based Sweets / Bakery";

export type PartnerProjectProduct = {
  slug: string;
  name: Localized;
  category: Localized;
  shortDescription: Localized;
  image: string | null;
  keyNotes: Localized[];
  nutritionHighlights: Localized[];
  status: PartnerProductStatus;
};

export type PartnerProject = {
  slug: string;
  partnerName: string;
  partnerAssetKey: keyof PartnerAssets | null;
  logoPath: AssetPath;
  category: PartnerProjectCategory;
  categoryLabel: Localized;
  positioning: Localized;
  overview: Localized[];
  productionFocus: Localized[];
  ingredientStrategy: Localized[];
  processNotes: Localized[];
  nutritionFocus: Localized[];
  complianceNotes: Localized[];
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
    categoryLabel: {
      en: "Healthy Bakery / Functional Bread",
      ar: "مخبوزات صحية / خبز وظيفي",
    },
    positioning: {
      en: "Healthy bakery production focused on clean ingredients, long fermentation, and stronger nutrition profiles.",
      ar: "إنتاج مخبوزات صحية يركّز على المكوّنات النظيفة والتخمير الطويل وملامح تغذية أقوى.",
    },
    overview: [
      {
        en: "HÄLSA Bake is a healthy and functional bakery project: breads developed around clean-label ingredients, natural fermentation, and a stronger nutrition direction than standard bakery lines.",
        ar: "مشروع HÄLSA Bake مشروع مخبوزات صحية ووظيفية: أنواع خبز مطوَّرة حول مكوّنات نظيفة وتخمير طبيعي وتوجه تغذية أقوى من خطوط المخبوزات الاعتيادية.",
      },
      {
        en: "The range spans everyday healthy staples — flatbread, toast, buns, and samoon — alongside functional breads such as high-protein, high-fibre, and seeded loaves.",
        ar: "تمتد التشكيلة عبر الأساسيات الصحية اليومية — خبز مسطّح وتوست وأرغفة وصمون — إلى جانب أنواع خبز وظيفية مثل عالي البروتين وعالي الألياف والأرغفة بالبذور.",
      },
    ],
    productionFocus: [
      { en: "Healthy bakery products for everyday retail", ar: "منتجات مخبوزات صحية للتجزئة اليومية" },
      { en: "Functional breads (protein, fibre, seeded directions)", ar: "أنواع خبز وظيفية (توجهات البروتين والألياف والبذور)" },
      { en: "Whole-grain and oats-based breads", ar: "أنواع خبز بالحبوب الكاملة والشوفان" },
    ],
    ingredientStrategy: [
      { en: "Clean-label ingredient direction", ar: "توجه مكوّنات نظيفة" },
      { en: "Organic ingredients where applicable and verified", ar: "مكوّنات عضوية حيثما ينطبق ويُوثَّق" },
      { en: "No added sugar / low sugar positioning only where verified per SKU", ar: "تموضع بدون سكر مضاف / قليل السكر فقط حيثما يُوثَّق لكل صنف" },
    ],
    processNotes: [
      { en: "Natural sourdough / long-fermentation process capability", ar: "قدرة عملية على العجين المخمّر الطبيعي / التخمير الطويل" },
      {
        en: "Fermentation can reach 12 hours, and up to 24 hours, as a process capability — confirmed per SKU against a verified specification sheet",
        ar: "قد يصل التخمير إلى 12 ساعة، وحتى 24 ساعة، كقدرة عملية — يُؤكَّد لكل صنف مقابل ورقة مواصفات موثّقة",
      },
    ],
    nutritionFocus: [
      { en: "Protein profile", ar: "ملمح البروتين" },
      { en: "Carbohydrate profile", ar: "ملمح الكربوهيدرات" },
      { en: "Sugar profile", ar: "ملمح السكر" },
      { en: "Fibre profile", ar: "ملمح الألياف" },
      { en: "Calorie profile", ar: "ملمح السعرات" },
      nv("Per-product values", "قيم كل منتج"),
    ],
    complianceNotes: [
      { en: "Clean-label formulation direction", ar: "توجه تركيبة نظيفة المكوّنات" },
      nv("Nutrition facts and any functional claims", "الحقائق الغذائية وأي ادعاءات وظيفية"),
    ],
    products: [
      {
        slug: "healthy-flatbread",
        name: { en: "Healthy Flatbread", ar: "خبز مسطّح صحي" },
        category: { en: "Flat Bread", ar: "خبز مسطّح" },
        shortDescription: {
          en: "Soft, foldable flatbread produced with a clean-label, healthy direction.",
          ar: "خبز مسطّح طري قابل للطي يُنتَج بتوجه صحي نظيف المكوّنات.",
        },
        image: null,
        keyNotes: [
          { en: "Clean-label ingredient direction", ar: "توجه مكوّنات نظيفة" },
          { en: "Everyday healthy retail format", ar: "شكل تجزئة صحي يومي" },
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "healthy-toast",
        name: { en: "Healthy Toast", ar: "توست صحي" },
        category: { en: "Soft Bread", ar: "خبز طري" },
        shortDescription: {
          en: "Sliced toast loaf positioned for a healthier everyday range.",
          ar: "رغيف توست مقطّع مموضَع لتشكيلة يومية أكثر صحة.",
        },
        image: null,
        keyNotes: [
          { en: "Sliced loaf format", ar: "شكل رغيف مقطّع" },
          { en: "Clean-label direction", ar: "توجه نظيف المكوّنات" },
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "burger-buns",
        name: { en: "Burger Buns", ar: "خبز برجر" },
        category: { en: "Soft Bread", ar: "خبز طري" },
        shortDescription: {
          en: "Soft burger buns produced to a healthier specification.",
          ar: "خبز برجر طري يُنتَج وفق مواصفة أكثر صحة.",
        },
        image: null,
        keyNotes: [
          { en: "Consistent bun sizing", ar: "ثبات حجم الأرغفة" },
          { en: "Clean-label direction", ar: "توجه نظيف المكوّنات" },
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "samoon",
        name: { en: "Samoon", ar: "صمون" },
        category: { en: "Soft Bread", ar: "خبز طري" },
        shortDescription: {
          en: "Regional samoon bread produced with a healthy direction.",
          ar: "خبز صمون محلي يُنتَج بتوجه صحي.",
        },
        image: null,
        keyNotes: [
          { en: "Traditional samoon format", ar: "شكل صمون تقليدي" },
          { en: "Clean-label direction", ar: "توجه نظيف المكوّنات" },
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "high-protein-bread",
        name: { en: "High-Protein Bread", ar: "خبز عالي البروتين" },
        category: { en: "Functional Bread", ar: "خبز وظيفي" },
        shortDescription: {
          en: "Bread positioned around a higher-protein profile.",
          ar: "خبز مموضَع حول ملمح بروتين أعلى.",
        },
        image: null,
        keyNotes: [
          { en: "Higher-protein positioning", ar: "تموضع أعلى بالبروتين" },
          nv("Protein content claim", "ادعاء محتوى البروتين"),
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "high-fiber-bread",
        name: { en: "High-Fibre Bread", ar: "خبز عالي الألياف" },
        category: { en: "Functional Bread", ar: "خبز وظيفي" },
        shortDescription: {
          en: "Bread positioned around a higher-fibre profile.",
          ar: "خبز مموضَع حول ملمح ألياف أعلى.",
        },
        image: null,
        keyNotes: [
          { en: "Higher-fibre positioning", ar: "تموضع أعلى بالألياف" },
          nv("Fibre content claim", "ادعاء محتوى الألياف"),
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "whole-wheat-bread",
        name: { en: "Whole Wheat Bread", ar: "خبز القمح الكامل" },
        category: { en: "Whole Grain", ar: "حبوب كاملة" },
        shortDescription: {
          en: "Whole wheat bread for a wholesome everyday range.",
          ar: "خبز قمح كامل لتشكيلة يومية مغذّية.",
        },
        image: null,
        keyNotes: [
          { en: "Whole wheat formulation", ar: "تركيبة قمح كامل" },
          { en: "Clean-label direction", ar: "توجه نظيف المكوّنات" },
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "oats-bread",
        name: { en: "Oats Bread", ar: "خبز الشوفان" },
        category: { en: "Whole Grain", ar: "حبوب كاملة" },
        shortDescription: {
          en: "Oats-based bread for a wholesome, hearty profile.",
          ar: "خبز قائم على الشوفان لملمح مغذٍّ وشهي.",
        },
        image: null,
        keyNotes: [
          { en: "Oats-based formulation", ar: "تركيبة قائمة على الشوفان" },
          { en: "Clean-label direction", ar: "توجه نظيف المكوّنات" },
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "chia-bread",
        name: { en: "Chia Bread", ar: "خبز الشيا" },
        category: { en: "Functional / Seeded Bread", ar: "خبز وظيفي / بالبذور" },
        shortDescription: {
          en: "Seeded bread made with chia for a functional direction.",
          ar: "خبز بالبذور مصنوع بالشيا لتوجه وظيفي.",
        },
        image: null,
        keyNotes: [
          { en: "Chia-seeded formulation", ar: "تركيبة بذور الشيا" },
          { en: "Functional positioning", ar: "تموضع وظيفي" },
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "black-seed-bread",
        name: { en: "Black Seed Bread", ar: "خبز حبة البركة" },
        category: { en: "Functional / Seeded Bread", ar: "خبز وظيفي / بالبذور" },
        shortDescription: {
          en: "Seeded bread made with black seed for a functional direction.",
          ar: "خبز بالبذور مصنوع بحبة البركة لتوجه وظيفي.",
        },
        image: null,
        keyNotes: [
          { en: "Black-seed formulation", ar: "تركيبة حبة البركة" },
          { en: "Functional positioning", ar: "تموضع وظيفي" },
        ],
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
    categoryLabel: {
      en: "Organic / Government Food Brand Bakery Production",
      ar: "إنتاج مخبوزات لعلامة غذائية عضوية / حكومية",
    },
    positioning: {
      en: "Bakery production using EKTIFA supplied ingredients and private-label development support.",
      ar: "إنتاج مخبوزات باستخدام مكوّنات مورَّدة من EKTIFA مع دعم تطوير العلامة الخاصة.",
    },
    overview: [
      {
        en: "The EKTIFA project covers bakery production built on EKTIFA-supplied ingredients, with Al Shehail providing private-label development and manufacturing support.",
        ar: "يغطي مشروع EKTIFA إنتاج مخبوزات قائم على مكوّنات مورَّدة من EKTIFA، مع توفير الشهيل لدعم تطوير العلامة الخاصة والتصنيع.",
      },
      {
        en: "The range spans French bakery, soft breads, and date-based sweets, produced to the brand's specification.",
        ar: "تمتد التشكيلة عبر المخبوزات الفرنسية والخبز الطري والحلويات بالتمر، مُنتَجة وفق مواصفة العلامة.",
      },
    ],
    productionFocus: [
      { en: "Private-label bakery production for the EKTIFA brand", ar: "إنتاج مخبوزات بعلامة خاصة لعلامة EKTIFA" },
      { en: "French bakery, soft breads, and date-based sweets", ar: "مخبوزات فرنسية وخبز طري وحلويات بالتمر" },
      { en: "Development support from concept to retail-ready supply", ar: "دعم التطوير من الفكرة إلى توريد جاهز للرف" },
    ],
    ingredientStrategy: [
      { en: "Produced with EKTIFA-supplied wheat flour, whole-wheat flour, and semolina", ar: "مُنتَج بدقيق القمح ودقيق القمح الكامل والسميد المورَّد من EKTIFA" },
      { en: "Natural milk used where applicable", ar: "يُستخدم الحليب الطبيعي حيثما ينطبق" },
      nv("Organic ingredient scope and any organic claims", "نطاق المكوّنات العضوية وأي ادعاءات عضوية"),
    ],
    processNotes: [
      { en: "Standard bakery and lamination processes per product type", ar: "عمليات مخبوزات وترقيق قياسية حسب نوع المنتج" },
      nv("Fermentation / process specifics per SKU", "تفاصيل التخمير / العملية لكل صنف"),
    ],
    nutritionFocus: [
      { en: "Profile varies by product type", ar: "يختلف الملمح حسب نوع المنتج" },
      nv("Per-product nutrition values", "القيم الغذائية لكل منتج"),
    ],
    complianceNotes: [
      { en: "Produced to the partner brand's ingredient and product specification", ar: "مُنتَج وفق مواصفة مكوّنات ومنتج العلامة الشريكة" },
      nv("Certifications and organic verification", "الشهادات والتوثيق العضوي"),
    ],
    products: [
      {
        slug: "mini-croissant",
        name: { en: "Mini Croissant", ar: "كرواسان ميني" },
        category: { en: "French Bakery", ar: "مخبوزات فرنسية" },
        shortDescription: {
          en: "Laminated mini croissant for bakery and cafe shelves.",
          ar: "كرواسان ميني مورّق لرفوف المخابز والمقاهي.",
        },
        image: null,
        keyNotes: [
          { en: "Laminated French bakery", ar: "مخبوزات فرنسية مورّقة" },
          { en: "Produced to brand specification", ar: "مُنتَج وفق مواصفة العلامة" },
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "burger-buns",
        name: { en: "Burger Buns", ar: "خبز برجر" },
        category: { en: "Soft Bread", ar: "خبز طري" },
        shortDescription: {
          en: "Soft burger buns produced to brand specification.",
          ar: "خبز برجر طري مُنتَج وفق مواصفة العلامة.",
        },
        image: null,
        keyNotes: [
          { en: "Consistent bun sizing", ar: "ثبات حجم الأرغفة" },
          { en: "EKTIFA-supplied flour", ar: "دقيق مورَّد من EKTIFA" },
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "samoon",
        name: { en: "Samoon", ar: "صمون" },
        category: { en: "Soft Bread", ar: "خبز طري" },
        shortDescription: {
          en: "Regional samoon bread produced to brand specification.",
          ar: "خبز صمون محلي مُنتَج وفق مواصفة العلامة.",
        },
        image: null,
        keyNotes: [
          { en: "Traditional samoon format", ar: "شكل صمون تقليدي" },
          { en: "EKTIFA-supplied flour", ar: "دقيق مورَّد من EKTIFA" },
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "toast",
        name: { en: "Toast", ar: "توست" },
        category: { en: "Soft Bread", ar: "خبز طري" },
        shortDescription: {
          en: "Sliced toast loaf produced to brand specification.",
          ar: "رغيف توست مقطّع مُنتَج وفق مواصفة العلامة.",
        },
        image: null,
        keyNotes: [
          { en: "Sliced loaf format", ar: "شكل رغيف مقطّع" },
          { en: "EKTIFA-supplied flour", ar: "دقيق مورَّد من EKTIFA" },
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "maamoul",
        name: { en: "Maamoul", ar: "معمول" },
        category: { en: "Date Sweets", ar: "حلويات بالتمر" },
        shortDescription: {
          en: "Filled date maamoul produced to brand specification.",
          ar: "معمول محشوّ بالتمر مُنتَج وفق مواصفة العلامة.",
        },
        image: null,
        keyNotes: [
          { en: "Date-filled sweet", ar: "حلوى محشوّة بالتمر" },
          { en: "Traditional format", ar: "شكل تقليدي" },
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "large-croissant",
        name: { en: "Large Croissant", ar: "كرواسان كبير" },
        category: { en: "French Bakery", ar: "مخبوزات فرنسية" },
        shortDescription: {
          en: "Full-size laminated croissant for bakery shelves.",
          ar: "كرواسان مورّق بالحجم الكامل لرفوف المخابز.",
        },
        image: null,
        keyNotes: [
          { en: "Laminated French bakery", ar: "مخبوزات فرنسية مورّقة" },
          { en: "Produced to brand specification", ar: "مُنتَج وفق مواصفة العلامة" },
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "pate",
        name: { en: "Pâté", ar: "باتيه" },
        category: { en: "French Bakery / Pastry", ar: "مخبوزات فرنسية / معجنات" },
        shortDescription: {
          en: "Pastry pâté produced to brand specification.",
          ar: "معجنات باتيه مُنتَجة وفق مواصفة العلامة.",
        },
        image: null,
        keyNotes: [
          { en: "Pastry format", ar: "شكل معجنات" },
          nv("Filling / recipe details", "تفاصيل الحشو / الوصفة"),
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "tamriya",
        name: { en: "Tamriya", ar: "تمرية" },
        category: { en: "Date Sweets", ar: "حلويات بالتمر" },
        shortDescription: {
          en: "Date-based sweet built around dates, ghee, and sesame tahini.",
          ar: "حلوى قائمة على التمر مبنية على التمر والسمن وطحينة السمسم.",
        },
        image: null,
        keyNotes: [
          { en: "Made with dates, ghee, and sesame tahini", ar: "مصنوعة من التمر والسمن وطحينة السمسم" },
        ],
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
    categoryLabel: {
      en: "Date-Based Sweets / Bakery",
      ar: "حلويات ومخبوزات بالتمر",
    },
    positioning: {
      en: "Date-based bakery sweets with a focus on traditional taste and cleaner sweetening direction where possible.",
      ar: "حلويات مخبوزة قائمة على التمر تركّز على الطعم التقليدي وتوجه تحلية أنظف حيثما أمكن.",
    },
    overview: [
      {
        en: "The Al Tahan project focuses on traditional date-based sweets — maamoul and tamriya — produced for authentic taste.",
        ar: "يركّز مشروع الطحان على الحلويات التقليدية القائمة على التمر — المعمول والتمرية — المُنتَجة لطعم أصيل.",
      },
      {
        en: "Where possible, the direction leans toward cleaner sweetening (such as natural sweetening with honey where applicable), without claiming a sugar-free product.",
        ar: "حيثما أمكن، يميل التوجه نحو تحلية أنظف (مثل التحلية الطبيعية بالعسل حيثما ينطبق)، دون ادعاء منتج خالٍ من السكر.",
      },
    ],
    productionFocus: [
      { en: "Date-based sweets and bakery", ar: "حلويات ومخبوزات قائمة على التمر" },
      { en: "Traditional maamoul and tamriya", ar: "معمول وتمرية تقليديان" },
    ],
    ingredientStrategy: [
      { en: "Date-forward recipes", ar: "وصفات يتصدّرها التمر" },
      { en: "Lower-sugar direction where possible", ar: "توجه أقل سكرًا حيثما أمكن" },
      { en: "Replacing artificial sweeteners with natural sweetening directions (e.g. honey) where applicable", ar: "استبدال المحلّيات الصناعية بتوجهات تحلية طبيعية (مثل العسل) حيثما ينطبق" },
      { en: "No sugar-free claim is made", ar: "لا يُقدَّم ادعاء خلوّ من السكر" },
    ],
    processNotes: [
      { en: "Traditional sweets preparation per product", ar: "تحضير حلويات تقليدي لكل منتج" },
      nv("Process specifics per SKU", "تفاصيل العملية لكل صنف"),
    ],
    nutritionFocus: [
      { en: "Date-based sugar profile", ar: "ملمح سكر قائم على التمر" },
      nv("Per-product nutrition values", "القيم الغذائية لكل منتج"),
    ],
    complianceNotes: [
      { en: "Conservative, verified claims only", ar: "ادعاءات متحفّظة وموثّقة فقط" },
      nv("Nutrition facts and sweetening claims", "الحقائق الغذائية وادعاءات التحلية"),
    ],
    products: [
      {
        slug: "maamoul",
        name: { en: "Maamoul", ar: "معمول" },
        category: { en: "Date Sweets", ar: "حلويات بالتمر" },
        shortDescription: {
          en: "Traditional filled date maamoul.",
          ar: "معمول تمر محشوّ تقليدي.",
        },
        image: null,
        keyNotes: [
          { en: "Date-filled sweet", ar: "حلوى محشوّة بالتمر" },
          { en: "Cleaner sweetening direction where possible", ar: "توجه تحلية أنظف حيثما أمكن" },
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
      {
        slug: "tamriya",
        name: { en: "Tamriya", ar: "تمرية" },
        category: { en: "Date Sweets", ar: "حلويات بالتمر" },
        shortDescription: {
          en: "Date-based sweet built around dates, ghee, and sesame tahini.",
          ar: "حلوى قائمة على التمر مبنية على التمر والسمن وطحينة السمسم.",
        },
        image: null,
        keyNotes: [
          { en: "Made with dates, ghee, and sesame tahini", ar: "مصنوعة من التمر والسمن وطحينة السمسم" },
          { en: "Natural sweetening direction where applicable — not sugar-free", ar: "توجه تحلية طبيعية حيثما ينطبق — وليست خالية من السكر" },
        ],
        nutritionHighlights: [NEEDS_VERIFICATION],
        status: "needs-data",
      },
    ],
  },
];

// ── Lookup helpers ───────────────────────────────────────────────────────────

export const partnerProjectBySlug: Record<string, PartnerProject> =
  Object.fromEntries(partnerProjects.map((p) => [p.slug, p]));

export const partnerProjectByPartnerName: Record<string, PartnerProject> =
  Object.fromEntries(partnerProjects.map((p) => [p.partnerName, p]));

export function getPartnerProjectBySlug(
  slug: string
): PartnerProject | undefined {
  return partnerProjectBySlug[slug];
}

export function getPartnerProjectByPartnerName(
  name: string
): PartnerProject | undefined {
  return partnerProjectByPartnerName[name];
}

/**
 * Conservative "strength" chips for partner cards, derived only from the
 * existing project wording — no new claims are introduced. Matching runs on the
 * English source text; chips are returned bilingual.
 */
export function getProjectStrengthChips(project: PartnerProject): Localized[] {
  const text = [
    project.positioning.en,
    project.category,
    ...project.productionFocus.map((x) => x.en),
    ...project.ingredientStrategy.map((x) => x.en),
    ...project.processNotes.map((x) => x.en),
    ...project.nutritionFocus.map((x) => x.en),
    ...project.complianceNotes.map((x) => x.en),
  ]
    .join(" ")
    .toLowerCase();

  const chips: Localized[] = [];

  if (
    project.category === "Healthy Bakery / Functional Bread" ||
    project.category === "Organic / Government Food Brand Bakery Production"
  ) {
    chips.push({ en: "Nutrition-Focused", ar: "تركيز على التغذية" });
  }
  if (project.category === "Date-Based Sweets / Bakery") {
    chips.push({ en: "Date-Based Sweets", ar: "حلويات بالتمر" });
  }
  if (text.includes("organic")) chips.push({ en: "Organic Direction", ar: "توجه عضوي" });
  if (
    text.includes("long-fermentation") ||
    text.includes("long fermentation") ||
    text.includes("sourdough")
  ) {
    chips.push({ en: "Long Fermentation", ar: "تخمير طويل" });
  }
  if (text.includes("clean-label") || text.includes("clean label")) {
    chips.push({ en: "Clean Label Direction", ar: "توجه نظيف المكوّنات" });
  }
  if (text.includes("sugar")) chips.push({ en: "Sugar-Conscious", ar: "واعٍ بالسكر" });

  return chips;
}

export function getPartnerProjectProduct(
  projectSlug: string,
  productSlug: string
): PartnerProjectProduct | undefined {
  return getPartnerProjectBySlug(projectSlug)?.products.find(
    (product) => product.slug === productSlug
  );
}

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
