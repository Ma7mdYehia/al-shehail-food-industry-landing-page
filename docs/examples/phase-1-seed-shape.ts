// docs/examples/phase-1-seed-shape.ts
//
// DOCS-ONLY EXAMPLE — NOT PART OF THE APPLICATION.
// This file is never imported by anything under app/, components/, or lib/.
// It exists purely to illustrate, in TypeScript, what normalized seed
// objects for the Phase 1 database schema (see
// docs/database-schema-phase-1.md) could look like once real seed data is
// written. It is intentionally self-contained (no imports from the app's
// lib/ modules) so it can be read on its own without pulling in runtime
// code, and so it can never accidentally become a real dependency.
//
// Do not import this file from application code. Do not add it to any
// build entry point. If it is ever wired into a real seed script, move it
// out of docs/ first and treat this file as the historical sketch it was.

// ── Shared shape (mirrors lib/i18n.ts's Locale/Localized types, redefined
// here so this example has zero dependency on the app) ──────────────────────

type Locale = "en" | "ar";
type Localized<T = string> = { en: T; ar: T };

// ── product_categories ───────────────────────────────────────────────────

type ProductCategorySeed = {
  slug: string;
  name_localized: Localized;
  description_localized: Localized;
  sort_order: number;
  is_active: boolean;
};

const productCategorySeeds: ProductCategorySeed[] = [
  {
    slug: "flatbread-wraps",
    name_localized: { en: "Flatbread & Wraps", ar: "الخبز المسطّح واللفائف" },
    description_localized: {
      en: "Arabic-style flatbread and functional bread wraps.",
      ar: "خبز مسطّح على الطريقة العربية ولفائف خبز وظيفية.",
    },
    sort_order: 0,
    is_active: true,
  },
];

// ── products ─────────────────────────────────────────────────────────────

type ProductSeed = {
  category_slug: string; // resolved to category_id at insert time
  slug: string;
  name_localized: Localized;
  short_description_localized: Localized;
  card_description_localized: Localized;
  image_asset_key: string | null; // resolved to media_assets.id at insert time
  icon_type: string;
  featured: boolean;
  sort_order: number;
  is_active: boolean;
};

const productSeeds: ProductSeed[] = [
  {
    category_slug: "flatbread-wraps",
    slug: "arabic-bread",
    name_localized: { en: "Arabic Bread", ar: "خبز عربي" },
    short_description_localized: {
      en: "Traditional round Arabic flatbread, soft and foldable.",
      ar: "خبز عربي مسطّح تقليدي مستدير، طري وقابل للطي.",
    },
    card_description_localized: {
      en: "Authentic Arabic flatbread produced for consistent texture and everyday retail demand.",
      ar: "خبز عربي أصيل يُنتَج بقوام ثابت يلبّي الطلب اليومي في التجزئة.",
    },
    image_asset_key: "arabicBread",
    icon_type: "flatbread",
    featured: true,
    sort_order: 0,
    is_active: true,
  },
];

// ── product_details ──────────────────────────────────────────────────────

type ProductDetailSeed = {
  product_slug: string; // resolved to product_id at insert time
  positioning_localized: Localized;
  overview_localized: Localized[];
  detail_use_cases_localized: Localized[];
  recipe_options_localized: Localized[];
};

const productDetailSeeds: ProductDetailSeed[] = [
  {
    product_slug: "arabic-bread",
    positioning_localized: {
      en: "Everyday Arabic flatbread, manufactured for consistent quality across retail and institutional supply.",
      ar: "خبز عربي مسطّح يومي، يُصنَّع بجودة ثابتة عبر توريد التجزئة والمؤسسات.",
    },
    overview_localized: [
      {
        en: "Arabic bread is one of the region's highest-demand everyday breads.",
        ar: "الخبز العربي من أكثر أنواع الخبز اليومي طلبًا في المنطقة.",
      },
    ],
    detail_use_cases_localized: [
      { en: "Retail shelves", ar: "رفوف التجزئة" },
      { en: "Supermarkets / hypermarkets", ar: "أسواق / هايبرماركت" },
    ],
    recipe_options_localized: [{ en: "Standard recipe", ar: "وصفة قياسية" }],
  },
];

// ── product_options ──────────────────────────────────────────────────────

type ProductOptionType =
  | "use_case"
  | "private_label_option"
  | "variant"
  | "recipe_option";

type ProductOptionSeed = {
  product_slug: string; // resolved to product_id at insert time
  type: ProductOptionType;
  label_localized: Localized;
  sort_order: number;
};

const productOptionSeeds: ProductOptionSeed[] = [
  {
    product_slug: "arabic-bread",
    type: "use_case",
    label_localized: { en: "Retail shelf packs", ar: "عبوات رفوف التجزئة" },
    sort_order: 0,
  },
  {
    product_slug: "arabic-bread",
    type: "private_label_option",
    label_localized: { en: "Branded retail packaging", ar: "تغليف تجزئة بعلامتك" },
    sort_order: 0,
  },
];

// ── services ──────────────────────────────────────────────────────────────

type ServiceCta = { label: Localized; href: string };

type ServiceSeed = {
  slug: string;
  meta_title_localized: Localized;
  meta_description_localized: Localized;
  hero_eyebrow_localized: Localized;
  hero_title_localized: Localized;
  hero_subtitle_localized: Localized;
  cta_json: {
    heroPrimary: ServiceCta;
    heroSecondary: ServiceCta;
    ctaPrimary: ServiceCta;
    ctaSecondary: ServiceCta;
  };
  sort_order: number;
  is_active: boolean;
};

const serviceSeeds: ServiceSeed[] = [
  {
    slug: "distribution",
    meta_title_localized: {
      en: "Distribution Fleet & Retail Reach | Al Shehail Food Industries",
      ar: "أسطول التوزيع والوصول للتجزئة | الشهيل للصناعات الغذائية",
    },
    meta_description_localized: {
      en: "Distribution coordination that connects finished bakery products with the right route to market.",
      ar: "تنسيق توزيع يربط منتجات المخبوزات الجاهزة بالمسار الصحيح للسوق.",
    },
    hero_eyebrow_localized: { en: "Services · Distribution", ar: "الخدمات · التوزيع" },
    hero_title_localized: { en: "Distribution Fleet & Retail Reach", ar: "أسطول التوزيع والوصول للتجزئة" },
    hero_subtitle_localized: {
      en: "From finished bakery products to retail-ready movement.",
      ar: "من المنتجات الجاهزة إلى الحركة المهيأة للرف.",
    },
    cta_json: {
      heroPrimary: { label: { en: "Start a Distribution Project", ar: "ابدأ مشروع توزيع" }, href: "/contact" },
      heroSecondary: {
        label: { en: "Explore Private Label Manufacturing", ar: "استكشف التصنيع بعلامة خاصة" },
        href: "/private-label",
      },
      ctaPrimary: { label: { en: "Start a Project", ar: "ابدأ مشروعك" }, href: "/contact" },
      ctaSecondary: { label: { en: "View Products", ar: "عرض المنتجات" }, href: "/products" },
    },
    sort_order: 0,
    is_active: true,
  },
];

// ── service_sections ─────────────────────────────────────────────────────

type ServiceSectionType =
  | "intro"
  | "coverage"
  | "process"
  | "audience"
  | "deliverables"
  | "categories"
  | "related"
  | "note";

type ServiceSectionSeed = {
  service_slug: string; // resolved to service_id at insert time
  section_type: ServiceSectionType;
  title_localized: Localized | null;
  eyebrow_localized: Localized | null;
  description_localized: Localized | null;
  items_json: unknown[];
  sort_order: number;
};

const serviceSectionSeeds: ServiceSectionSeed[] = [
  {
    service_slug: "distribution",
    section_type: "intro",
    title_localized: { en: "Production is the start, not the finish", ar: "الإنتاج هو البداية، لا النهاية" },
    eyebrow_localized: { en: "Overview", ar: "نظرة عامة" },
    description_localized: {
      en: "After manufacturing, the next challenge is getting products moved into the right retail channels.",
      ar: "بعد التصنيع، يكون التحدي التالي هو نقل المنتجات إلى قنوات التجزئة المناسبة.",
    },
    items_json: [],
    sort_order: 0,
  },
  {
    service_slug: "distribution",
    section_type: "coverage",
    title_localized: { en: "Distribution support after production", ar: "دعم التوزيع بعد الإنتاج" },
    eyebrow_localized: { en: "What We Support", ar: "ما ندعمه" },
    description_localized: null,
    items_json: [
      {
        title: { en: "Finished Product Movement", ar: "حركة المنتج الجاهز" },
        description: {
          en: "Support for moving retail-ready bakery products after production.",
          ar: "دعم نقل منتجات المخبوزات المهيأة للرف بعد الإنتاج.",
        },
        icon: "packaging",
      },
    ],
    sort_order: 1,
  },
];

// ── partners ──────────────────────────────────────────────────────────────

type PartnerSeed = {
  slug: string;
  name: string;
  asset_key: string | null; // resolved to media_assets.id at insert time
  sort_order: number;
  is_active: boolean;
};

const partnerSeeds: PartnerSeed[] = [
  { slug: "al-tahan", name: "Al Tahan", asset_key: "alTahan", sort_order: 0, is_active: true },
  { slug: "halsa-bake", name: "HÄLSA Bake", asset_key: "halsaBake", sort_order: 1, is_active: true },
  { slug: "ektifa", name: "EKTIFA", asset_key: "ektifa", sort_order: 2, is_active: true },
  // Reserved 4th slot — asset key already exists in lib/assets.ts as LEGACY/
  // pending, no confirmed data yet, seeded inactive rather than omitted.
  { slug: "al-taj", name: "Al Taj", asset_key: "alTaj", sort_order: 3, is_active: false },
];

// ── partner_projects ─────────────────────────────────────────────────────

type PartnerProjectSeed = {
  partner_slug: string; // resolved to partner_id at insert time
  slug: string;
  title_localized: Localized;
  summary_localized: Localized;
  project_detail_json: {
    categoryLabel: Localized;
    overview: Localized[];
    productionFocus: Localized[];
    ingredientStrategy: Localized[];
    processNotes: Localized[];
    nutritionFocus: Localized[];
    complianceNotes: Localized[];
  };
  sort_order: number;
  is_active: boolean;
};

const partnerProjectSeeds: PartnerProjectSeed[] = [
  {
    partner_slug: "halsa-bake",
    slug: "halsa-bake",
    title_localized: { en: "HÄLSA Bake — Healthy Bakery Production", ar: "HÄLSA Bake — إنتاج مخبوزات صحية" },
    summary_localized: {
      en: "Healthy bakery production focused on clean ingredients, long fermentation, and stronger nutrition profiles.",
      ar: "إنتاج مخبوزات صحية يركّز على المكوّنات النظيفة والتخمير الطويل وملامح تغذية أقوى.",
    },
    project_detail_json: {
      categoryLabel: { en: "Healthy Bakery / Functional Bread", ar: "مخبوزات صحية / خبز وظيفي" },
      overview: [
        {
          en: "HÄLSA Bake is a healthy and functional bakery project: breads developed around clean-label ingredients and natural fermentation.",
          ar: "مشروع HÄLSA Bake مشروع مخبوزات صحية ووظيفية: أنواع خبز مطوَّرة حول مكوّنات نظيفة وتخمير طبيعي.",
        },
      ],
      productionFocus: [],
      ingredientStrategy: [],
      processNotes: [],
      nutritionFocus: [],
      complianceNotes: [],
    },
    sort_order: 0,
    is_active: true,
  },
];

// ── partner_project_products ─────────────────────────────────────────────

type PartnerProductStatus = "active" | "planned" | "needs-data";

type PartnerProjectProductSeed = {
  partner_project_slug: string; // resolved to partner_project_id at insert time
  product_slug: string | null; // resolved to product_id when it matches a real catalog product
  product_name_localized: Localized | null; // used only when product_slug is null
  category_localized: Localized | null;
  short_description_localized: Localized | null;
  key_notes_localized: Localized[];
  nutrition_highlights_localized: Localized[];
  image_asset_key: string | null;
  status: PartnerProductStatus;
  sort_order: number;
};

const partnerProjectProductSeeds: PartnerProjectProductSeed[] = [
  {
    partner_project_slug: "halsa-bake",
    product_slug: null,
    product_name_localized: { en: "HÄLSA Sourdough Loaf", ar: "رغيف HÄLSA بالخميرة الطبيعية" },
    category_localized: { en: "Sourdough Bread", ar: "خبز بالخميرة الطبيعية" },
    short_description_localized: null,
    key_notes_localized: [],
    // Example of the NEEDS_VERIFICATION placeholder convention from
    // lib/partnerProjects.ts carrying over into seed data unresolved —
    // never silently invent a number here.
    nutrition_highlights_localized: [
      {
        en: "Protein per serving: To be added from verified specification sheet",
        ar: "البروتين لكل حصة: يُضاف من ورقة مواصفات موثّقة",
      },
    ],
    image_asset_key: null,
    status: "needs-data",
    sort_order: 0,
  },
];

// ── media_assets ──────────────────────────────────────────────────────────

type MediaAssetType =
  | "brand"
  | "partner"
  | "product"
  | "factory"
  | "certification"
  | "retail"
  | "og";

type MediaAssetStatus = "active" | "pending" | "legacy";

type MediaAssetSeed = {
  key: string;
  path: string | null;
  alt_localized: Localized;
  type: MediaAssetType;
  status: MediaAssetStatus;
  width: number | null;
  height: number | null;
};

const mediaAssetSeeds: MediaAssetSeed[] = [
  {
    key: "arabicBread",
    path: "/assets/products/arabic-bread.webp",
    // English alt text migrated as-is from lib/assets.ts; Arabic alt text
    // does not exist in the current codebase and must be authored fresh —
    // this placeholder illustrates the shape only, not a real translation.
    alt_localized: { en: "Arabic bread", ar: "خبز عربي" },
    type: "product",
    status: "active",
    width: null,
    height: null,
  },
  {
    key: "alTaj",
    path: null,
    alt_localized: { en: "Al Taj", ar: "الطاج" },
    type: "partner",
    status: "legacy",
    width: null,
    height: null,
  },
];

// Re-exported together only so a reader (or an editor's "unused variable"
// lint) can see every seed group is intentionally used somewhere in this
// file, not because anything imports this module.
export const phase1SeedShapeExample = {
  productCategorySeeds,
  productSeeds,
  productDetailSeeds,
  productOptionSeeds,
  serviceSeeds,
  serviceSectionSeeds,
  partnerSeeds,
  partnerProjectSeeds,
  partnerProjectProductSeeds,
  mediaAssetSeeds,
};
