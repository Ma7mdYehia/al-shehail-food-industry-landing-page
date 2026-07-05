// Centralized content for Al Shehail Food Industries landing page.
// NOTE: No unverified figures (capacity, outlet counts, team size, factory
// size) are included. Use verified assets/data when available.

import type { PartnerAssets } from "@/lib/assets";

export const company = {
  name: "Al Shehail Food Industries",
  shortName: "الشحيل",
  positioning: "شريك تصنيع المخبوزات وحلول العلامة الخاصة في الإمارات",
  coreMessage: "من الفكرة إلى الرف",
  location: "المنطقة الصناعية الجديدة، أم القيوين، الإمارات العربية المتحدة",
  email: "info@alshehai.ae",
  phone: "+971 54 743 1444",
  // E.164 digits only, used for tel: and wa.me links
  phoneDigits: "971547431444",
};

// WhatsApp deep link with a prefilled B2B enquiry message.
export const whatsappLink = `https://wa.me/${company.phoneDigits}?text=${encodeURIComponent(
  "مرحبًا الشحيل، أود مناقشة مشروع تصنيع مخبوزات بعلامة خاصة."
)}`;

// Capabilities and Quality now live inside the merged /private-label page
// (sections #capabilities and #quality), so they are no longer separate nav
// items. The old routes redirect there.
export const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "من نحن", href: "/about" },
  { label: "المنتجات", href: "/products" },
  { label: "العلامة الخاصة", href: "/private-label" },
  { label: "الشركاء", href: "/partners" },
  { label: "تواصل معنا", href: "/contact" },
];

export const trustBadges = [
  "معتمدون بشهادة ISO",
  "معتمدون بشهادة HACCP",
  "معتمدون عضويًا",
  "معتمدون لدى كارفور",
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
  title: string;
  description: string;
};

export const privateLabelSteps: Step[] = [
  {
    number: "01",
    title: "فكرة المنتج",
    description:
      "نبدأ من طلبك التجاري — الفئة، التموضع، والرف المستهدف — ونشكّلها إلى فكرة مخبوزات قابلة للتصنيع.",
  },
  {
    number: "02",
    title: "تطوير الوصفة",
    description:
      "فريق التطوير لدينا يضبط الوصفة من حيث الطعم والقوام لإنتاج نظيف وقابل للتكرار.",
  },
  {
    number: "03",
    title: "العينات",
    description:
      "ننتج عينات ونطوّرها بالتغذية الراجعة حتى يصبح المنتج مناسبًا لعلامتك التجارية.",
  },
  {
    number: "04",
    title: "دراسة التكلفة",
    description:
      "تكلفة شفافة للوحدة ومواصفات واضحة تجعل المنتج مجديًا تجاريًا عند البيع بالتجزئة.",
  },
  {
    number: "05",
    title: "التغليف",
    description:
      "تغليف بعلامتك الخاصة، مصمَّم لجذب الرف والامتثال وحماية المنتج.",
  },
  {
    number: "06",
    title: "الإنتاج",
    description:
      "تصنيع موسَّع على خطوط مخبوزات معتمدة، بإنتاجية ثابتة دفعة بعد دفعة.",
  },
  {
    number: "07",
    title: "مراقبة الجودة",
    description:
      "فحوصات متوافقة مع معايير ISO وHACCP تحمي سلامة المنتج وجودته في كل مرحلة.",
  },
  {
    number: "08",
    title: "التسليم الجاهز للرف",
    description:
      "منتج جاهز ومعبأ بعلامتك، يُسلَّم بثبات إلى شبكة التوزيع لديك.",
  },
];

// ── Hero slider ──────────────────────────────────────────────────────────────
// Clean content variants for the hero, mapped 1:1 to the seven right-side
// manufacturing stages (index 0–6). Each variant can selectively show or hide
// the eyebrow, CTA, and trust points — not every slide shows every element.
// The first slide stays very close to the original hero (full layout).

export type HeroTrustIcon = "shield-check" | "label" | "truck";

export type HeroTrustPoint = {
  label: string;
  icon: HeroTrustIcon;
};

export type HeroSlide = {
  /** Index (0–6) of the highlighted stage in the right-side system. */
  step: number;
  eyebrow?: string;
  title: string;
  description: string;
  /** Omit to hide the CTA on this slide. */
  ctaLabel?: string;
  ctaHref?: string;
  /** Omit to hide the trust points on this slide. */
  trustPoints?: HeroTrustPoint[];
  /** Banner image for this manufacturing stage (in /public). */
  image: string;
  /** Alt text for the stage banner image. */
  imageAlt: string;
};

const heroPrimaryTrust: HeroTrustPoint[] = [
  { label: "أنظمة ISO / HACCP", icon: "shield-check" },
  { label: "جاهزون للعلامة الخاصة", icon: "label" },
  { label: "دعم التوريد للتجزئة", icon: "truck" },
];

// TODO (Stage 02): replace these manufacturing-only hero slides with
// homepageHeroSlides from lib/homepageEcosystem.ts (6-slide service ecosystem).
export const heroSlides: HeroSlide[] = [
  {
    step: 0,
    eyebrow: "شريك تصنيع مخبوزات وعلامات خاصة في الإمارات",
    title: "تصنيع مخبوزات بعلامتك الخاصة في الإمارات",
    description:
      "من فكرة المنتج إلى مخبوزات جاهزة للرف — نطوّر، نصنّع، نغلّف، ونوسّع الإنتاج لعلامات غذائية طموحة.",
    ctaLabel: "ابدأ مشروعك",
    ctaHref: "/contact",
    trustPoints: heroPrimaryTrust,
    image: "/images/hero-journey/product-idea.webp",
    imageAlt: "تشكيل فكرة منتج مخبوزات جديد",
  },
  {
    step: 1,
    eyebrow: "تطوير الوصفة",
    title: "وصفات مصمَّمة للطعم وقابلة للتوسّع",
    description:
      "نضبط النكهة والقوام لإنتاج نظيف وقابل للتكرار على خطوط معتمدة.",
    ctaLabel: "ابدأ مشروعك",
    ctaHref: "/contact",
    image: "/images/hero-journey/recipe.webp",
    imageAlt: "تطوير وصفة مخبوزات في المطبخ",
  },
  {
    step: 2,
    eyebrow: "العينات",
    title: "عينات نطوّرها حتى تصبح جاهزة",
    description:
      "ننتج العينات ونضبطها مع فريقك حتى يصبح المنتج جاهزًا لعلامتك.",
    image: "/images/hero-journey/sampling.webp",
    imageAlt: "تذوق ومراجعة عينات مخبوزات طازجة",
  },
  {
    step: 3,
    eyebrow: "التغليف",
    title: "تغليف مصمَّم لجذب الرف",
    description:
      "تغليف بعلامتك الخاصة مصمَّم لجذب الرف والامتثال وحماية المنتج.",
    ctaLabel: "ابدأ مشروعك",
    ctaHref: "/contact",
    image: "/images/hero-journey/packaging.webp",
    imageAlt: "تغليف تجزئة بعلامة خاصة لمنتجات مخبوزات",
  },
  {
    step: 4,
    eyebrow: "الإنتاج",
    title: "إنتاج موسَّع، دفعة بعد دفعة",
    description:
      "إنتاجية ثابتة على خطوط مخبوزات معتمدة، جاهزة للنمو مع علامتك.",
    trustPoints: heroPrimaryTrust,
    image: "/images/hero-journey/production.webp",
    imageAlt: "خط إنتاج مخبوزات موسَّع أثناء التشغيل",
  },
  {
    step: 5,
    eyebrow: "مراقبة الجودة",
    title: "جودة مضمونة في كل مرحلة",
    description:
      "فحوصات متوافقة مع ISO وHACCP تحمي سلامة الغذاء من خط الإنتاج حتى التسليم.",
    trustPoints: heroPrimaryTrust,
    image: "/images/hero-journey/qc.webp",
    imageAlt: "فحوصات مراقبة الجودة على منتجات المخبوزات",
  },
  {
    step: 6,
    eyebrow: "جاهز للرف",
    title: "منتج جاهز، معبأ، وجاهز للتوريد",
    description:
      "معبأ ومورَّد بثبات إلى شبكة التوزيع لديك في أنحاء الإمارات.",
    ctaLabel: "ابدأ مشروعك",
    ctaHref: "/contact",
    trustPoints: heroPrimaryTrust,
    image: "/images/hero-journey/retail-ready.webp",
    imageAlt: "منتجات مخبوزات جاهزة للرف",
  },
];

export const capabilities = [
  {
    title: "تطوير المنتجات",
    description:
      "تطوير داخلي يأخذ فكرتك من الطلب الأولي إلى منتج نهائي جاهز للرف.",
  },
  {
    title: "تصنيع العلامة الخاصة",
    description:
      "إنتاج مخصص للعلامة الخاصة يتماشى مع استراتيجية علامتك وفئتك.",
  },
  {
    title: "تخصيص الوصفات",
    description:
      "تركيبات مصمَّمة حسب الطعم والقوام والمتطلبات الغذائية والتكلفة.",
  },
  {
    title: "تعبئة جاهزة للرف",
    description:
      "أشكال تغليف مصمَّمة لعرض المنتج في التجزئة وجذب الرف.",
  },
  {
    title: "أنظمة سلامة الغذاء",
    description:
      "عمليات تشغيل محكومة بأطر سلامة غذاء وجودة معتمدة.",
  },
  {
    title: "توريد قابل للتوسّع",
    description:
      "توريد ثابت وقابل للتكرار يدعم شبكات توزيع متنامية.",
  },
];

export const certifications = [
  {
    title: "معتمدون بشهادة ISO",
    description: "أنظمة إدارة جودة متوافقة مع المعايير الدولية.",
  },
  {
    title: "معتمدون بشهادة HACCP",
    description: "تحليل مخاطر وضوابط سلامة غذاء عبر خطوط الإنتاج.",
  },
  {
    title: "معتمدون عضويًا",
    description: "قدرة معتمدة لإنتاج خطوط منتجات عضوية.",
  },
  {
    title: "معتمدون لدى كارفور",
    description: "اعتماد كمورّد لدى إحدى كبرى سلاسل التجزئة.",
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

export const whyUsPoints = [
  {
    title: "شريك من الفكرة إلى الرف",
    description:
      "شريك واحد من فكرة المنتج وحتى التصنيع والتعبئة والتوريد.",
  },
  {
    title: "جودة معتمدة",
    description:
      "إنتاج مدعوم بشهادات سلامة غذاء ISO وHACCP.",
  },
  {
    title: "حضور مثبت في التجزئة",
    description:
      "منتجات حاضرة في كبرى سلاسل التجزئة والهايبرماركت في الإمارات.",
  },
  {
    title: "مصمَّم للعلامات التجارية",
    description:
      "خبرة في العلامة الخاصة تركّز على مساعدة علامتك على التميّز في الرف.",
  },
];
