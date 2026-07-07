// Company/brand info and generic reusable content data for Al Shehail Food
// Industries: company details, trust badges, private label steps,
// manufacturing partners, and general capabilities/certifications/retail
// presence/why-us data. Navigation lives in lib/navigation.ts; product data
// lives in lib/products/; this file is not a dumping ground for page-specific
// or legacy content — see docs/legacy-hero-slides.md for archived material.
//
// NOTE: No unverified figures (capacity, outlet counts, team size, factory
// size) are included. Use verified assets/data when available.
//
// Bilingual: text fields are Localized ({ en, ar }); keys/slugs/asset keys stay
// a single source of truth. Components read field[locale].

import type { PartnerAssets } from "@/lib/assets";
import type { Locale, Localized } from "@/lib/i18n";

export const company = {
  name: "Al Shehail Food Industries",
  shortName: "Al Shehail",
  positioning: {
    en: "UAE-Based Bakery Manufacturing & Private Label Partner",
    ar: "شريك تصنيع المخبوزات وحلول العلامة الخاصة في الإمارات",
  } as Localized,
  coreMessage: { en: "From idea to shelf", ar: "من الفكرة إلى الرف" } as Localized,
  location: {
    en: "New Industrial Area, Umm Al Quwain, UAE",
    ar: "المنطقة الصناعية الجديدة، أم القيوين، الإمارات العربية المتحدة",
  } as Localized,
  email: "info@alshehai.ae",
  phone: "+971 54 743 1444",
  // E.164 digits only, used for tel: and wa.me links
  phoneDigits: "971547431444",
};

// WhatsApp deep link with a prefilled B2B enquiry message, per locale.
const whatsappEnquiry: Localized = {
  en: "Hello Al Shehail, I'd like to discuss a private label bakery project.",
  ar: "مرحبًا الشحيل، أود مناقشة مشروع تصنيع مخبوزات بعلامة خاصة.",
};

export function whatsappLink(locale: Locale): string {
  return `https://wa.me/${company.phoneDigits}?text=${encodeURIComponent(
    whatsappEnquiry[locale]
  )}`;
}

export const trustBadges: Localized[] = [
  { en: "ISO Certified", ar: "معتمدون بشهادة ISO" },
  { en: "HACCP Certified", ar: "معتمدون بشهادة HACCP" },
  { en: "Organic Certified", ar: "معتمدون عضويًا" },
  { en: "Carrefour Approved", ar: "معتمدون لدى كارفور" },
];

// Manufacturing partners shown on the home + partners pages. Each entry carries
// the logo asset key and the slug of its "Single Partner Project" (see
// lib/partnerProjects.ts) so the partner card can connect to project data later.
export type ManufacturingPartner = {
  name: string;
  assetKey: keyof PartnerAssets;
  projectSlug: string;
};

export const manufacturingPartners: ManufacturingPartner[] = [
  { name: "Al Tahan", assetKey: "alTahan", projectSlug: "al-tahan" },
  { name: "HÄLSA Bake", assetKey: "halsaBake", projectSlug: "halsa-bake" },
  { name: "EKTIFA", assetKey: "ektifa", projectSlug: "ektifa" },
];

export type Step = {
  number: string;
  title: Localized;
  description: Localized;
};

export const privateLabelSteps: Step[] = [
  {
    number: "01",
    title: { en: "Product Idea", ar: "فكرة المنتج" },
    description: {
      en: "We start from your brief — category, positioning, and target shelf — and shape a manufacturable bakery concept.",
      ar: "نبدأ من طلبك التجاري — الفئة والتموضع والرف المستهدف — ونشكّلها إلى فكرة مخبوزات قابلة للتصنيع.",
    },
  },
  {
    number: "02",
    title: { en: "Recipe Development", ar: "تطوير الوصفة" },
    description: {
      en: "Our development team formulates the recipe for taste, texture, and clean, repeatable production.",
      ar: "يضبط فريق التطوير لدينا الوصفة من حيث الطعم والقوام لإنتاج نظيف وقابل للتكرار.",
    },
  },
  {
    number: "03",
    title: { en: "Sampling", ar: "العينات" },
    description: {
      en: "We produce samples and refine through feedback until the product is right for your brand.",
      ar: "ننتج عينات ونطوّرها بالملاحظات حتى يصبح المنتج مناسبًا لعلامتك التجارية.",
    },
  },
  {
    number: "04",
    title: { en: "Costing", ar: "دراسة التكلفة" },
    description: {
      en: "Transparent unit costing and specifications so the product works commercially at retail.",
      ar: "تكلفة شفافة للوحدة ومواصفات واضحة تجعل المنتج مجديًا تجاريًا عند البيع بالتجزئة.",
    },
  },
  {
    number: "05",
    title: { en: "Packaging", ar: "التغليف" },
    description: {
      en: "Private-label packaging engineered for shelf appeal, compliance, and product protection.",
      ar: "تغليف بعلامتك الخاصة مصمَّم لجاذبية الرف والامتثال وحماية المنتج.",
    },
  },
  {
    number: "06",
    title: { en: "Production", ar: "الإنتاج" },
    description: {
      en: "Scaled manufacturing on certified bakery lines with consistent output, batch after batch.",
      ar: "تصنيع موسَّع على خطوط مخبوزات معتمدة بإنتاجية ثابتة دفعة بعد دفعة.",
    },
  },
  {
    number: "07",
    title: { en: "Quality Control", ar: "مراقبة الجودة" },
    description: {
      en: "ISO- and HACCP-aligned checks safeguard food safety and quality at every stage.",
      ar: "فحوصات متوافقة مع معايير ISO وHACCP تحمي سلامة المنتج وجودته في كل مرحلة.",
    },
  },
  {
    number: "08",
    title: { en: "Retail-Ready Delivery", ar: "التسليم الجاهز للرف" },
    description: {
      en: "Finished, branded, retail-ready product supplied reliably to your distribution network.",
      ar: "منتج نهائي بعلامتك ومهيأ للرف، يُورَّد بثبات إلى شبكة التوزيع لديك.",
    },
  },
];

export const capabilities: { title: Localized; description: Localized }[] = [
  {
    title: { en: "Product Development", ar: "تطوير المنتجات" },
    description: {
      en: "In-house development to take your concept from brief to finished, shelf-ready product.",
      ar: "تطوير داخلي يأخذ فكرتك من الطلب الأولي إلى منتج نهائي جاهز للرف.",
    },
  },
  {
    title: { en: "Private Label Manufacturing", ar: "تصنيع العلامة الخاصة" },
    description: {
      en: "Dedicated private label production aligned to your brand and category strategy.",
      ar: "إنتاج مخصص للعلامة الخاصة يتماشى مع استراتيجية علامتك وفئتك.",
    },
  },
  {
    title: { en: "Recipe Customization", ar: "تخصيص الوصفات" },
    description: {
      en: "Tailored formulations for taste, texture, dietary, and cost requirements.",
      ar: "تركيبات مصمَّمة حسب الطعم والقوام والمتطلبات الغذائية والتكلفة.",
    },
  },
  {
    title: { en: "Retail-Ready Packing", ar: "تعبئة جاهزة للرف" },
    description: {
      en: "Packaging formats designed for retail merchandising and shelf appeal.",
      ar: "أشكال تغليف مصمَّمة لعرض المنتج في التجزئة وجاذبية الرف.",
    },
  },
  {
    title: { en: "Food Safety Systems", ar: "أنظمة سلامة الغذاء" },
    description: {
      en: "Operations governed by recognized food-safety and quality frameworks.",
      ar: "عمليات تشغيل محكومة بأطر معترف بها لسلامة الغذاء والجودة.",
    },
  },
  {
    title: { en: "Scalable Supply", ar: "توريد قابل للتوسّع" },
    description: {
      en: "Consistent, repeatable supply to support growing distribution networks.",
      ar: "توريد ثابت وقابل للتكرار يدعم شبكات توزيع متنامية.",
    },
  },
];

export const certifications: { title: Localized; description: Localized }[] = [
  {
    title: { en: "ISO Certified", ar: "معتمدون بشهادة ISO" },
    description: {
      en: "Quality management systems aligned to international standards.",
      ar: "أنظمة إدارة جودة متوافقة مع المعايير الدولية.",
    },
  },
  {
    title: { en: "HACCP Certified", ar: "معتمدون بشهادة HACCP" },
    description: {
      en: "Hazard analysis and food-safety controls across production.",
      ar: "تحليل مخاطر وضوابط سلامة غذاء عبر خطوط الإنتاج.",
    },
  },
  {
    title: { en: "Organic Certified", ar: "معتمدون عضويًا" },
    description: {
      en: "Certified capability for organic product lines.",
      ar: "قدرة معتمدة لإنتاج خطوط منتجات عضوية.",
    },
  },
  {
    title: { en: "Carrefour Approved", ar: "معتمدون لدى كارفور" },
    description: {
      en: "Approved supplier credentials for major retail.",
      ar: "اعتماد كمورّد لدى إحدى كبرى سلاسل التجزئة.",
    },
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

export const whyUsPoints: { title: Localized; description: Localized }[] = [
  {
    title: { en: "End-to-End Partner", ar: "شريك من الفكرة إلى الرف" },
    description: {
      en: "One partner from product concept through manufacturing, packing, and supply.",
      ar: "شريك واحد من فكرة المنتج وحتى التصنيع والتعبئة والتوريد.",
    },
  },
  {
    title: { en: "Certified Quality", ar: "جودة معتمدة" },
    description: {
      en: "Production backed by ISO and HACCP food-safety credentials.",
      ar: "إنتاج مدعوم بشهادات سلامة غذاء ISO وHACCP.",
    },
  },
  {
    title: { en: "Retail Proven", ar: "حضور مثبت في التجزئة" },
    description: {
      en: "Products present across leading UAE retail and hypermarket chains.",
      ar: "منتجات حاضرة في كبرى سلاسل التجزئة والهايبرماركت في الإمارات.",
    },
  },
  {
    title: { en: "Built for Brands", ar: "مصمَّم للعلامات التجارية" },
    description: {
      en: "Private label expertise focused on helping your brand win on shelf.",
      ar: "خبرة في العلامة الخاصة تركّز على مساعدة علامتك على التميّز في الرف.",
    },
  },
];
