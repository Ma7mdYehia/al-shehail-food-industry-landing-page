// Homepage service-ecosystem content map.
//
// Section B (homepageHeroSlides) drives the live hero slider; Section C
// (manufacturingProcessNarrative) drives the concept-to-production section.
// Section A is an internal planning reference and is not rendered (kept English).
//
// Wording is intentionally conservative — no guaranteed distribution, retail
// access, sales, or marketing results. Text fields are bilingual (Localized).

import type { Localized } from "@/lib/i18n";
import { generatedAssets } from "@/lib/generatedAssets";

// ── A. Homepage journey reference (not rendered) ─────────────────────────────

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
    notes: "Live: driven by homepageHeroSlides below.",
  },
  {
    key: "about",
    title: "About Al Shehail",
    purpose: "Establish who Al Shehail is and the UAE-based manufacturing base.",
    notes: "Reuse existing AboutTeaser.",
  },
  {
    key: "beyond-manufacturing",
    title: "Beyond Manufacturing Services",
    purpose:
      "Introduce the 4-service ecosystem as compact cards (ServicesEcosystem).",
    notes: "Keep the 'Beyond Manufacturing' title.",
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
    notes: "Driven by manufacturingProcessNarrative below.",
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

// ── B. Ecosystem hero slides (live) ──────────────────────────────────────────

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
  title: Localized;
  subtitle: Localized;
  primaryCta: { label: Localized; href: string };
  secondaryCta?: { label: Localized; href: string };
  /** Media path under /public, or null until the ecosystem hero asset exists. */
  media: string | null;
  /** Still image used when a video slide has no video asset. */
  poster?: string;
};

export const homepageHeroSlides: EcosystemHeroSlide[] = [
  {
    key: "ecosystem-open",
    type: "video",
    service: "ecosystem",
    title: {
      en: "From Product Idea to Retail-Ready Execution",
      ar: "من فكرة المنتج إلى تنفيذ جاهز للرف",
    },
    subtitle: {
      en: "Al Shehail supports food brands across manufacturing, packaging, distribution, and product communication.",
      ar: "يدعم الشهيل العلامات الغذائية عبر التصنيع والتغليف والتوزيع والتواصل حول المنتج.",
    },
    primaryCta: {
      label: { en: "Start a Project", ar: "ابدأ مشروعك" },
      href: "/contact",
    },
    secondaryCta: {
      label: { en: "Explore Services", ar: "استكشف الخدمات" },
      href: "/services/distribution",
    },
    media: null,
    poster: generatedAssets.homepageHero.open,
  },
  {
    key: "manufacturing",
    type: "image",
    service: "manufacturing",
    title: {
      en: "Private Label Food Manufacturing",
      ar: "تصنيع الأغذية بعلامة خاصة",
    },
    subtitle: {
      en: "Product development, sampling, production, and retail-ready bakery manufacturing for food brands.",
      ar: "تطوير المنتجات والعينات والإنتاج وتصنيع المخبوزات المهيأة للرف للعلامات الغذائية.",
    },
    primaryCta: {
      label: { en: "Explore Manufacturing", ar: "استكشف التصنيع" },
      href: "/private-label",
    },
    media: generatedAssets.homepageHero.manufacturing,
  },
  {
    key: "brand-design",
    type: "image",
    service: "brand-design",
    title: {
      en: "Packaging & Brand Design",
      ar: "التغليف وتصميم العلامة",
    },
    subtitle: {
      en: "Food-focused packaging direction and retail-ready brand presentation for your product range.",
      ar: "توجيه تغليف متخصص في الأغذية وعرض للعلامة يليق بالرف لتشكيلة منتجاتك.",
    },
    primaryCta: {
      label: { en: "Explore Brand Design", ar: "استكشف تصميم العلامة" },
      href: "/services/brand-design",
    },
    media: generatedAssets.homepageHero.brandDesign,
  },
  {
    key: "distribution",
    type: "image",
    service: "distribution",
    title: {
      en: "Distribution Fleet & Retail Reach",
      ar: "أسطول التوزيع والوصول للتجزئة",
    },
    subtitle: {
      en: "Distribution coordination for finished products moving toward selected retail channels.",
      ar: "تنسيق توزيع المنتجات الجاهزة نحو قنوات تجزئة مختارة.",
    },
    primaryCta: {
      label: { en: "Explore Distribution", ar: "استكشف التوزيع" },
      href: "/services/distribution",
    },
    media: generatedAssets.homepageHero.distribution,
  },
  {
    key: "digital-marketing",
    type: "image",
    service: "digital-marketing",
    title: {
      en: "Food Digital Marketing",
      ar: "التسويق الرقمي للأغذية",
    },
    subtitle: {
      en: "Launch content, product storytelling, and digital communication direction for food brands.",
      ar: "محتوى الإطلاق وسرد قصة المنتج وتوجيه التواصل الرقمي للعلامات الغذائية.",
    },
    primaryCta: {
      label: { en: "Explore Marketing", ar: "استكشف التسويق" },
      href: "/services/digital-marketing",
    },
    media: generatedAssets.homepageHero.digitalMarketing,
  },
  {
    key: "ecosystem-close",
    type: "video",
    service: "ecosystem",
    title: {
      en: "One Partner Beyond Manufacturing",
      ar: "شريك واحد أبعد من التصنيع",
    },
    subtitle: {
      en: "Build, package, distribute, and communicate your food product through one connected service ecosystem.",
      ar: "صنّع منتجك الغذائي وغلّفه ووزّعه وتواصل حوله عبر منظومة خدمات واحدة مترابطة.",
    },
    primaryCta: {
      label: { en: "Talk to Al Shehail", ar: "تحدّث إلى الشهيل" },
      href: "/contact",
    },
    media: null,
    poster: generatedAssets.homepageHero.close,
  },
];

// ── C. Manufacturing process narrative (8-step section) ──────────────────────

export type ManufacturingProcessStep = {
  title: Localized;
  description: Localized;
  possibleAssetKey: string | null;
};

export const manufacturingProcessNarrative: {
  title: Localized;
  subtitle: Localized;
  note: Localized;
  steps: ManufacturingProcessStep[];
} = {
  title: { en: "From Concept to Production", ar: "من الفكرة إلى الإنتاج" },
  subtitle: {
    en: "A clear manufacturing workflow that helps food brands move from product idea to controlled production and retail-ready handoff.",
    ar: "مسار تصنيع واضح يساعد العلامات الغذائية على الانتقال من فكرة المنتج إلى إنتاج محكوم وتسليم مهيأ للرف.",
  },
  note: {
    en: "Each workflow is confirmed per project based on product type, recipe, packaging, quantity, and market requirements.",
    ar: "يُحدَّد كل مسار عمل لكل مشروع بحسب نوع المنتج والوصفة والتغليف والكمية ومتطلبات السوق.",
  },
  steps: [
    {
      title: { en: "Product Idea", ar: "فكرة المنتج" },
      description: {
        en: "Understand the product concept, category, target buyer, and intended retail use.",
        ar: "فهم فكرة المنتج وفئته والمشتري المستهدف والاستخدام المقصود في التجزئة.",
      },
      possibleAssetKey: "/images/hero-journey/product-idea.webp",
    },
    {
      title: { en: "Recipe Direction", ar: "توجيه الوصفة" },
      description: {
        en: "Shape the product formula direction around taste, texture, ingredients, and product positioning.",
        ar: "تشكيل توجه تركيبة المنتج حول الطعم والقوام والمكوّنات وتموضع المنتج.",
      },
      possibleAssetKey: "/images/hero-journey/recipe.webp",
    },
    {
      title: { en: "Sampling", ar: "العينات" },
      description: {
        en: "Develop and review samples before moving toward production planning.",
        ar: "تطوير العينات ومراجعتها قبل الانتقال إلى تخطيط الإنتاج.",
      },
      possibleAssetKey: "/images/hero-journey/sampling.webp",
    },
    {
      title: { en: "Packaging Direction", ar: "توجيه التغليف" },
      description: {
        en: "Align pack format, presentation needs, and retail communication before launch.",
        ar: "مواءمة شكل العبوة ومتطلبات العرض والتواصل في التجزئة قبل الإطلاق.",
      },
      possibleAssetKey: "/images/hero-journey/packaging.webp",
    },
    {
      title: { en: "Production Planning", ar: "تخطيط الإنتاج" },
      description: {
        en: "Organize production requirements, quantities, timing, and operational readiness.",
        ar: "تنظيم متطلبات الإنتاج والكميات والتوقيت والجاهزية التشغيلية.",
      },
      possibleAssetKey: null,
    },
    {
      title: { en: "Manufacturing", ar: "التصنيع" },
      description: {
        en: "Produce the product through a controlled bakery manufacturing workflow.",
        ar: "إنتاج المنتج عبر مسار تصنيع مخبوزات محكوم.",
      },
      possibleAssetKey: "/images/hero-journey/production.webp",
    },
    {
      title: { en: "Quality Control", ar: "مراقبة الجودة" },
      description: {
        en: "Review product consistency, handling needs, and specification alignment.",
        ar: "مراجعة ثبات المنتج ومتطلبات المناولة والتوافق مع المواصفات.",
      },
      possibleAssetKey: "/images/hero-journey/qc.webp",
    },
    {
      title: { en: "Retail-Ready Handoff", ar: "تسليم مهيأ للرف" },
      description: {
        en: "Prepare the product for next steps such as packing, distribution coordination, or launch support.",
        ar: "تجهيز المنتج للخطوات التالية مثل التعبئة وتنسيق التوزيع أو دعم الإطلاق.",
      },
      possibleAssetKey: "/images/hero-journey/retail-ready.webp",
    },
  ],
};
