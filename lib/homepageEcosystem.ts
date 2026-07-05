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
    title: "من فكرة المنتج إلى التنفيذ الجاهز للرف",
    subtitle:
      "تدعم الشحيل العلامات الغذائية عبر التصنيع، والتغليف، والتوزيع، والتواصل حول المنتج.",
    primaryCta: { label: "ابدأ مشروعك", href: "/contact" },
    secondaryCta: { label: "استعرض خدماتنا", href: "/services/distribution" },
    media: null,
  },
  {
    key: "manufacturing",
    type: "image",
    service: "manufacturing",
    title: "تصنيع غذائي بعلامة خاصة",
    subtitle:
      "تطوير المنتج، والعينات، والإنتاج، وتصنيع مخبوزات جاهزة للرف لعلامات غذائية.",
    primaryCta: { label: "اكتشف حلول التصنيع", href: "/private-label" },
    media: null,
  },
  {
    key: "brand-design",
    type: "image",
    service: "brand-design",
    title: "التغليف وتصميم العلامة",
    subtitle:
      "توجيه تغليف مخصَّص للأغذية وعرض علامة جاهز للرف لتشكيلة منتجاتك.",
    primaryCta: { label: "استعرض تصميم العلامة", href: "/services/brand-design" },
    media: null,
  },
  {
    key: "distribution",
    type: "image",
    service: "distribution",
    title: "أسطول التوزيع والوصول للتجزئة",
    subtitle:
      "تنسيق توزيع المنتجات النهائية نحو قنوات التجزئة المختارة.",
    primaryCta: { label: "استعرض التوزيع", href: "/services/distribution" },
    media: null,
  },
  {
    key: "digital-marketing",
    type: "image",
    service: "digital-marketing",
    title: "التسويق الرقمي الغذائي",
    subtitle:
      "محتوى إطلاق، وسرد قصة المنتج، وتوجيه تواصل رقمي للعلامات الغذائية.",
    primaryCta: {
      label: "استعرض التسويق",
      href: "/services/digital-marketing",
    },
    media: null,
  },
  {
    key: "ecosystem-close",
    type: "video",
    service: "ecosystem",
    title: "شريك واحد يتجاوز التصنيع",
    subtitle:
      "طوّر، وغلّف، ووزّع، وتواصل حول منتجك الغذائي من خلال منظومة خدمات متكاملة واحدة.",
    primaryCta: { label: "تواصل مع الشحيل", href: "/contact" },
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
  note: string;
  steps: ManufacturingProcessStep[];
} = {
  title: "من الفكرة إلى الإنتاج",
  subtitle:
    "مسار تصنيع واضح يساعد العلامات الغذائية على الانتقال من فكرة المنتج إلى إنتاج مضبوط وتسليم جاهز للرف.",
  note: "يُحدَّد مسار العمل لكل مشروع بناءً على نوع المنتج والوصفة والتغليف والكمية ومتطلبات السوق.",
  steps: [
    {
      title: "فكرة المنتج",
      description:
        "نفهم فكرة المنتج، وفئته، والمشتري المستهدف، والاستخدام المقصود له في التجزئة.",
      possibleAssetKey: "/images/hero-journey/product-idea.webp",
    },
    {
      title: "توجيه الوصفة",
      description:
        "نحدّد اتجاه الوصفة بما يناسب الطعم والقوام والمكونات وتموضع المنتج.",
      possibleAssetKey: "/images/hero-journey/recipe.webp",
    },
    {
      title: "العينات",
      description:
        "نجهّز العينات ونراجعها معك قبل الانتقال إلى تخطيط الإنتاج.",
      possibleAssetKey: "/images/hero-journey/sampling.webp",
    },
    {
      title: "توجيه التغليف",
      description:
        "نحدّد شكل التغليف واحتياجات العرض قبل الإطلاق.",
      possibleAssetKey: "/images/hero-journey/packaging.webp",
    },
    {
      title: "تخطيط الإنتاج",
      description:
        "ننظّم الكميات والتوقيت ومتطلبات التشغيل قبل بدء التصنيع.",
      possibleAssetKey: null,
    },
    {
      title: "التصنيع",
      description:
        "ننفّذ الإنتاج ضمن سير عمل مخبوزات مضبوط.",
      possibleAssetKey: "/images/hero-journey/production.webp",
    },
    {
      title: "مراقبة الجودة",
      description:
        "نراجع جودة المنتج وثباته ومطابقته للمواصفات.",
      possibleAssetKey: "/images/hero-journey/qc.webp",
    },
    {
      title: "التسليم الجاهز للرف",
      description:
        "نسلّم منتجًا جاهزًا للمرحلة التالية، سواء التوزيع أو الإطلاق.",
      possibleAssetKey: "/images/hero-journey/retail-ready.webp",
    },
  ],
};
