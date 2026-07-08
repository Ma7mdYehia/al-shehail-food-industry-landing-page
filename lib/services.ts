// Bilingual content for the three service pages (distribution, brand-design,
// digital-marketing). Rendered by components/pages/ServicePage. Icon components
// are referenced by key and resolved in the page component.

import type { Localized } from "@/lib/i18n";

export type ServiceIconKey =
  | "packaging"
  | "retail"
  | "calendar"
  | "shield"
  | "production"
  | "develop";

export type ServiceSlug =
  | "distribution"
  | "brand-design"
  | "digital-marketing";

type Feature = { title: Localized; description: Localized; icon: ServiceIconKey };
type Step = { title: Localized; text: Localized };
type Related = { title: Localized; description: Localized; href: string };
type Cta = { label: Localized; href: string };

export type ServiceContent = {
  slug: ServiceSlug;
  metaTitle: Localized;
  metaDescription: Localized;
  heroEyebrow: Localized;
  heroTitle: Localized;
  heroSubtitle: Localized;
  heroPrimary: Cta;
  heroSecondary: Cta;
  introEyebrow: Localized;
  introTitle: Localized;
  introDesc: Localized;
  coverageEyebrow: Localized;
  coverageTitle: Localized;
  coverageDesc: Localized;
  coverage: Feature[];
  processEyebrow: Localized;
  processTitle: Localized;
  processDesc: Localized;
  process: Step[];
  /** Distribution uses this simple "who it's for" grid. */
  audience?: { eyebrow: Localized; title: Localized; items: Localized[] };
  /** Brand-design & digital-marketing use these two blocks. */
  deliverables?: {
    eyebrow: Localized;
    title: Localized;
    desc: Localized;
    items: Localized[];
  };
  categories?: { eyebrow: Localized; title: Localized; items: Localized[] };
  relatedEyebrow: Localized;
  relatedTitle: Localized;
  relatedDesc: Localized;
  related: Related[];
  noteLabel: Localized;
  noteText: Localized;
  ctaEyebrow: Localized;
  ctaTitle: Localized;
  ctaText: Localized;
  ctaPrimary: Cta;
  ctaSecondary: Cta;
};

const relPrivateLabel: Related = {
  title: { en: "Private Label Manufacturing", ar: "التصنيع بعلامة خاصة" },
  description: {
    en: "Develop and manufacture bakery products under your brand, end to end.",
    ar: "طوّر وصنّع منتجات المخبوزات تحت علامتك من البداية إلى النهاية.",
  },
  href: "/private-label",
};
const relBrandDesign: Related = {
  title: { en: "Packaging & Brand Design", ar: "التغليف وتصميم العلامة" },
  description: {
    en: "Food-focused packaging direction and brand presentation for retail.",
    ar: "توجيه تغليف متخصص في الأغذية وعرض للعلامة للتجزئة.",
  },
  href: "/services/brand-design",
};
const relDistribution: Related = {
  title: { en: "Distribution Fleet & Retail Reach", ar: "أسطول التوزيع والوصول للتجزئة" },
  description: {
    en: "Distribution coordination that moves finished products toward retail.",
    ar: "تنسيق توزيع ينقل المنتجات الجاهزة نحو التجزئة.",
  },
  href: "/services/distribution",
};
const relDigital: Related = {
  title: { en: "Food Digital Marketing", ar: "التسويق الرقمي للأغذية" },
  description: {
    en: "Digital marketing support to help food products communicate online.",
    ar: "دعم تسويق رقمي يساعد المنتجات الغذائية على التواصل عبر الإنترنت.",
  },
  href: "/services/digital-marketing",
};

const foodCategories: Localized[] = [
  { en: "Healthy bread and functional bakery products", ar: "خبز صحي ومنتجات مخبوزات وظيفية" },
  { en: "Flatbread and wraps", ar: "خبز مسطّح ولفائف" },
  { en: "Toast, buns, and soft bread", ar: "توست وأرغفة وخبز طري" },
  { en: "Croissants and pastry", ar: "كرواسان ومعجنات" },
  { en: "Maa'moul, tamriya, cookies, and date-based sweets", ar: "معمول وتمرية وكوكيز وحلويات بالتمر" },
];

export const services: Record<ServiceSlug, ServiceContent> = {
  distribution: {
    slug: "distribution",
    metaTitle: {
      en: "Distribution Fleet & Retail Reach | Al Shehail Food Industries",
      ar: "أسطول التوزيع والوصول للتجزئة | الشهيل للصناعات الغذائية",
    },
    metaDescription: {
      en: "From finished bakery products to retail-ready movement, Al Shehail supports brands with distribution coordination after production — route-to-market and delivery planning confirmed per project.",
      ar: "من المنتجات الجاهزة إلى الحركة المهيأة للرف، يدعم الشهيل العلامات بتنسيق التوزيع بعد الإنتاج — يُحدَّد مسار السوق وتخطيط التسليم لكل مشروع.",
    },
    heroEyebrow: { en: "Services · Distribution", ar: "الخدمات · التوزيع" },
    heroTitle: { en: "Distribution Fleet & Retail Reach", ar: "أسطول التوزيع والوصول للتجزئة" },
    heroSubtitle: {
      en: "From finished bakery products to retail-ready movement, Al Shehail supports brands with distribution coordination after production.",
      ar: "من المنتجات الجاهزة إلى الحركة المهيأة للرف، يدعم الشهيل العلامات بتنسيق التوزيع بعد الإنتاج.",
    },
    heroPrimary: { label: { en: "Start a Distribution Project", ar: "ابدأ مشروع توزيع" }, href: "/contact" },
    heroSecondary: {
      label: { en: "Explore Private Label Manufacturing", ar: "استكشف التصنيع بعلامة خاصة" },
      href: "/private-label",
    },
    introEyebrow: { en: "Overview", ar: "نظرة عامة" },
    introTitle: { en: "Production is the start, not the finish", ar: "الإنتاج هو البداية، لا النهاية" },
    introDesc: {
      en: "After manufacturing, the next challenge is getting products prepared, organized, and moved into the right retail channels. Al Shehail's distribution support helps food brands connect production with retail execution.",
      ar: "بعد التصنيع، يكون التحدي التالي هو تجهيز المنتجات وتنظيمها ونقلها إلى قنوات التجزئة المناسبة. يساعد دعم التوزيع لدى الشهيل العلامات الغذائية على ربط الإنتاج بتنفيذ التجزئة.",
    },
    coverageEyebrow: { en: "What We Support", ar: "ما ندعمه" },
    coverageTitle: { en: "Distribution support after production", ar: "دعم التوزيع بعد الإنتاج" },
    coverageDesc: {
      en: "Practical, operational support that connects finished products with the right route to market.",
      ar: "دعم عملي وتشغيلي يربط المنتجات الجاهزة بالمسار الصحيح للسوق.",
    },
    coverage: [
      {
        title: { en: "Finished Product Movement", ar: "حركة المنتج الجاهز" },
        description: { en: "Support for moving retail-ready bakery products after production.", ar: "دعم نقل منتجات المخبوزات المهيأة للرف بعد الإنتاج." },
        icon: "packaging",
      },
      {
        title: { en: "Retail Channel Coordination", ar: "تنسيق قنوات التجزئة" },
        description: { en: "Helping organize product flow toward selected retail and sales channels.", ar: "المساعدة في تنظيم تدفق المنتج نحو قنوات تجزئة ومبيعات مختارة." },
        icon: "retail",
      },
      {
        title: { en: "Delivery Planning", ar: "تخطيط التسليم" },
        description: { en: "Coordination around product readiness, dispatch timing, and route needs.", ar: "تنسيق حول جاهزية المنتج وتوقيت الإرسال واحتياجات المسار." },
        icon: "calendar",
      },
      {
        title: { en: "Product Handling Awareness", ar: "وعي بمناولة المنتج" },
        description: { en: "Distribution thinking built around bakery products, packaging condition, and freshness requirements.", ar: "تفكير توزيعي مبني حول منتجات المخبوزات وحالة التغليف ومتطلبات الطزاجة." },
        icon: "shield",
      },
      {
        title: { en: "Launch & Replenishment Support", ar: "دعم الإطلاق وإعادة التزويد" },
        description: { en: "Useful for product launches, recurring supply, and controlled market rollout.", ar: "مفيد لإطلاق المنتجات والتوريد المتكرّر والطرح المحكوم في السوق." },
        icon: "production",
      },
      {
        title: { en: "Private Label Route-to-Market", ar: "مسار سوق للعلامة الخاصة" },
        description: { en: "Distribution support that connects with private-label manufacturing projects.", ar: "دعم توزيع يتصل بمشاريع التصنيع بعلامة خاصة." },
        icon: "develop",
      },
    ],
    processEyebrow: { en: "How It Works", ar: "كيف تعمل" },
    processTitle: { en: "A clear path from product ready to retail", ar: "مسار واضح من جاهزية المنتج إلى التجزئة" },
    processDesc: {
      en: "A simple coordination flow that keeps finished product moving toward its market.",
      ar: "تدفق تنسيق بسيط يُبقي المنتج الجاهز متحركًا نحو سوقه.",
    },
    process: [
      { title: { en: "Product Ready", ar: "المنتج جاهز" }, text: { en: "Finished product is confirmed after production and packing.", ar: "يُؤكَّد المنتج النهائي بعد الإنتاج والتعبئة." } },
      { title: { en: "Dispatch Planning", ar: "تخطيط الإرسال" }, text: { en: "Quantities, timing, and delivery requirements are organized.", ar: "تُنظَّم الكميات والتوقيت ومتطلبات التسليم." } },
      { title: { en: "Route Coordination", ar: "تنسيق المسار" }, text: { en: "Distribution movement is planned based on destination and channel needs.", ar: "تُخطَّط حركة التوزيع بناءً على الوجهة واحتياجات القناة." } },
      { title: { en: "Retail Delivery Support", ar: "دعم تسليم التجزئة" }, text: { en: "Products move toward selected retail points or agreed channels.", ar: "تتحرك المنتجات نحو نقاط تجزئة مختارة أو قنوات متفق عليها." } },
      { title: { en: "Follow-Up", ar: "المتابعة" }, text: { en: "Coordination continues around supply rhythm, replenishment, and launch needs.", ar: "يستمر التنسيق حول إيقاع التوريد وإعادة التزويد واحتياجات الإطلاق." } },
    ],
    audience: {
      eyebrow: { en: "Who It's For", ar: "لمن هذه الخدمة" },
      title: { en: "Built for brands that need more than production", ar: "مبنية للعلامات التي تحتاج أكثر من الإنتاج" },
      items: [
        { en: "Food brands launching bakery products", ar: "علامات غذائية تطلق منتجات مخبوزات" },
        { en: "Private-label clients", ar: "عملاء العلامة الخاصة" },
        { en: "Healthy bread brands", ar: "علامات خبز صحي" },
        { en: "Retail bakery product owners", ar: "أصحاب منتجات مخبوزات التجزئة" },
        { en: "Date-based sweets and pastry brands", ar: "علامات حلويات التمر والمعجنات" },
        { en: "Brands needing production and distribution support from one partner", ar: "علامات تحتاج دعم الإنتاج والتوزيع من شريك واحد" },
      ],
    },
    relatedEyebrow: { en: "One Connected Partner", ar: "شريك واحد مترابط" },
    relatedTitle: { en: "Distribution connects with the wider service ecosystem", ar: "يتصل التوزيع بمنظومة الخدمات الأوسع" },
    relatedDesc: {
      en: "Distribution works alongside manufacturing, packaging, and marketing so a brand can move from idea to market with one partner.",
      ar: "يعمل التوزيع جنبًا إلى جنب مع التصنيع والتغليف والتسويق لتنتقل العلامة من الفكرة إلى السوق مع شريك واحد.",
    },
    related: [relPrivateLabel, relBrandDesign, relDigital],
    noteLabel: { en: "How scope is defined", ar: "كيف يُحدَّد النطاق" },
    noteText: {
      en: "Distribution scope, retail channels, delivery schedule, and coverage are confirmed per project based on product type, quantity, packaging, and market requirements.",
      ar: "يُحدَّد نطاق التوزيع وقنوات التجزئة وجدول التسليم والتغطية لكل مشروع بناءً على نوع المنتج والكمية والتغليف ومتطلبات السوق.",
    },
    ctaEyebrow: { en: "Beyond Production", ar: "أبعد من الإنتاج" },
    ctaTitle: { en: "Ready to move your product beyond production?", ar: "جاهز لنقل منتجك أبعد من الإنتاج؟" },
    ctaText: {
      en: "Talk to Al Shehail about production, packing, and distribution support for your food brand.",
      ar: "تحدّث إلى الشهيل حول دعم الإنتاج والتعبئة والتوزيع لعلامتك الغذائية.",
    },
    ctaPrimary: { label: { en: "Start a Project", ar: "ابدأ مشروعك" }, href: "/contact" },
    ctaSecondary: { label: { en: "View Products", ar: "عرض المنتجات" }, href: "/products" },
  },

  "brand-design": {
    slug: "brand-design",
    metaTitle: {
      en: "Packaging & Brand Design | Al Shehail Food Industries",
      ar: "التغليف وتصميم العلامة | الشهيل للصناعات الغذائية",
    },
    metaDescription: {
      en: "Food-focused packaging and brand presentation support for products moving from production to retail shelves — packaging direction connected to private-label manufacturing.",
      ar: "دعم تغليف وعرض علامة متخصص في الأغذية للمنتجات المنتقلة من الإنتاج إلى رفوف التجزئة — توجيه تغليف متصل بالتصنيع بعلامة خاصة.",
    },
    heroEyebrow: { en: "Services · Brand Design", ar: "الخدمات · تصميم العلامة" },
    heroTitle: { en: "Packaging & Brand Design", ar: "التغليف وتصميم العلامة" },
    heroSubtitle: {
      en: "Food-focused packaging and brand presentation support for products moving from production to retail shelves.",
      ar: "دعم تغليف وعرض علامة متخصص في الأغذية للمنتجات المنتقلة من الإنتاج إلى رفوف التجزئة.",
    },
    heroPrimary: { label: { en: "Start a Packaging Project", ar: "ابدأ مشروع تغليف" }, href: "/contact" },
    heroSecondary: {
      label: { en: "Explore Private Label Manufacturing", ar: "استكشف التصنيع بعلامة خاصة" },
      href: "/private-label",
    },
    introEyebrow: { en: "Overview", ar: "نظرة عامة" },
    introTitle: { en: "More than a logo — packaging that communicates", ar: "أكثر من شعار — تغليف يتواصل" },
    introDesc: {
      en: "From product positioning to pack communication, Al Shehail supports food brands with packaging and brand design direction that connects manufacturing, retail presentation, and customer understanding.",
      ar: "من تموضع المنتج إلى تواصل العبوة، يدعم الشهيل العلامات الغذائية بتوجيه تغليف وتصميم علامة يربط التصنيع وعرض التجزئة وفهم العميل.",
    },
    coverageEyebrow: { en: "What We Support", ar: "ما ندعمه" },
    coverageTitle: { en: "Packaging and brand presentation support", ar: "دعم التغليف وعرض العلامة" },
    coverageDesc: {
      en: "Design direction built around food products, retail shelves, and clear customer communication.",
      ar: "توجيه تصميم مبني حول المنتجات الغذائية ورفوف التجزئة والتواصل الواضح مع العميل.",
    },
    coverage: [
      {
        title: { en: "Packaging Visual Direction", ar: "توجيه بصري للتغليف" },
        description: { en: "Visual direction for food packaging that fits the product category, audience, and retail environment.", ar: "توجيه بصري لتغليف الأغذية يناسب فئة المنتج والجمهور وبيئة التجزئة." },
        icon: "packaging",
      },
      {
        title: { en: "Product Naming & Range Structure", ar: "تسمية المنتج وبنية التشكيلة" },
        description: { en: "Support for organizing product names, variants, and range logic in a clear customer-facing way.", ar: "دعم تنظيم أسماء المنتجات والأنواع ومنطق التشكيلة بطريقة واضحة للعميل." },
        icon: "develop",
      },
      {
        title: { en: "Front-of-Pack Communication", ar: "تواصل واجهة العبوة" },
        description: { en: "Helping define the key messages that should appear clearly on the pack without overloading the design.", ar: "المساعدة في تحديد الرسائل الأساسية التي يجب أن تظهر بوضوح على العبوة دون إثقال التصميم." },
        icon: "retail",
      },
      {
        title: { en: "Retail-Ready Pack Layout", ar: "تخطيط عبوة مهيأ للرف" },
        description: { en: "Design direction that considers shelf presence, readability, hierarchy, and product recognition.", ar: "توجيه تصميم يراعي الحضور على الرف والقراءة والتسلسل والتعرّف على المنتج." },
        icon: "production",
      },
      {
        title: { en: "Private Label Packaging Support", ar: "دعم تغليف العلامة الخاصة" },
        description: { en: "Packaging support for brands developing products with Al Shehail's manufacturing team.", ar: "دعم تغليف للعلامات التي تطوّر منتجات مع فريق التصنيع لدى الشهيل." },
        icon: "calendar",
      },
      {
        title: { en: "Product Story & Claims Review", ar: "قصة المنتج ومراجعة الادعاءات" },
        description: { en: "Conservative communication guidance to avoid unclear or unsupported product claims.", ar: "إرشاد تواصل متحفّظ لتجنّب ادعاءات المنتج غير الواضحة أو غير المدعومة." },
        icon: "shield",
      },
    ],
    processEyebrow: { en: "How It Works", ar: "كيف تعمل" },
    processTitle: { en: "A clear path from product to pack", ar: "مسار واضح من المنتج إلى العبوة" },
    processDesc: {
      en: "A simple direction-led flow from understanding the product to a retail-ready handoff.",
      ar: "تدفق بسيط بقيادة التوجيه من فهم المنتج إلى تسليم مهيأ للرف.",
    },
    process: [
      { title: { en: "Product Understanding", ar: "فهم المنتج" }, text: { en: "Understand the product type, target customer, category, and retail use case.", ar: "فهم نوع المنتج والعميل المستهدف والفئة وحالة استخدام التجزئة." } },
      { title: { en: "Positioning Direction", ar: "توجيه التموضع" }, text: { en: "Define how the product should be presented: healthy, premium, traditional, family, functional, date-based, or pastry.", ar: "تحديد كيفية تقديم المنتج: صحي، راقٍ، تقليدي، عائلي، وظيفي، قائم على التمر، أو معجنات." } },
      { title: { en: "Packaging Structure", ar: "بنية التغليف" }, text: { en: "Organize the pack hierarchy: product name, variant, benefits, flavor/type, usage, and required information.", ar: "تنظيم تسلسل العبوة: اسم المنتج والنوع والفوائد والنكهة والاستخدام والمعلومات المطلوبة." } },
      { title: { en: "Visual Design Direction", ar: "توجيه التصميم البصري" }, text: { en: "Develop the visual look and feel for the packaging, including color direction, typography, imagery, and layout system.", ar: "تطوير الشكل والإحساس البصري للتغليف، بما في ذلك توجيه الألوان والخطوط والصور ونظام التخطيط." } },
      { title: { en: "Retail-Ready Handoff", ar: "تسليم مهيأ للرف" }, text: { en: "Prepare design direction and communication logic to support printing, production, and retail presentation.", ar: "تجهيز توجيه التصميم ومنطق التواصل لدعم الطباعة والإنتاج وعرض التجزئة." } },
    ],
    deliverables: {
      eyebrow: { en: "Deliverables", ar: "المخرجات" },
      title: { en: "What we can help design", ar: "ما يمكننا المساعدة في تصميمه" },
      desc: { en: "Support, direction, and design preparation across packaging and brand presentation.", ar: "دعم وتوجيه وتجهيز تصميم عبر التغليف وعرض العلامة." },
      items: [
        { en: "Product packaging direction", ar: "توجيه تغليف المنتج" },
        { en: "Label and pack communication hierarchy", ar: "تسلسل تواصل البطاقة والعبوة" },
        { en: "Product range system", ar: "نظام تشكيلة المنتجات" },
        { en: "Variant naming and visual coding", ar: "تسمية الأنواع والترميز البصري" },
        { en: "Front-of-pack message structure", ar: "بنية رسالة واجهة العبوة" },
        { en: "Social launch visuals direction", ar: "توجيه بصريات الإطلاق الاجتماعي" },
        { en: "Retail presentation assets direction", ar: "توجيه أصول عرض التجزئة" },
        { en: "Private label brand presentation", ar: "عرض علامة العلامة الخاصة" },
      ],
    },
    categories: {
      eyebrow: { en: "Category Fit", ar: "ملاءمة الفئة" },
      title: { en: "Food categories this fits", ar: "الفئات الغذائية التي تناسبها" },
      items: [...foodCategories, { en: "Private-label retail products", ar: "منتجات تجزئة بعلامة خاصة" }],
    },
    relatedEyebrow: { en: "One Connected Partner", ar: "شريك واحد مترابط" },
    relatedTitle: { en: "Brand design connects with the wider service ecosystem", ar: "يتصل تصميم العلامة بمنظومة الخدمات الأوسع" },
    relatedDesc: {
      en: "Packaging and brand design work alongside manufacturing, distribution, and marketing so a product is ready for production and the shelf.",
      ar: "يعمل التغليف وتصميم العلامة جنبًا إلى جنب مع التصنيع والتوزيع والتسويق ليكون المنتج جاهزًا للإنتاج وللرف.",
    },
    related: [relPrivateLabel, relDistribution, relDigital],
    noteLabel: { en: "Before final printing", ar: "قبل الطباعة النهائية" },
    noteText: {
      en: "Packaging claims, nutrition statements, ingredient callouts, and compliance details should be confirmed against verified product specifications and market requirements before final printing.",
      ar: "يجب تأكيد ادعاءات التغليف والبيانات الغذائية وإبرازات المكوّنات وتفاصيل الامتثال مقابل مواصفات المنتج الموثّقة ومتطلبات السوق قبل الطباعة النهائية.",
    },
    ctaEyebrow: { en: "Built for the Shelf", ar: "مبني للرف" },
    ctaTitle: { en: "Need packaging that fits the product and the shelf?", ar: "تحتاج تغليفًا يناسب المنتج والرف؟" },
    ctaText: {
      en: "Talk to Al Shehail about packaging direction, private-label presentation, and retail-ready food product communication.",
      ar: "تحدّث إلى الشهيل حول توجيه التغليف وعرض العلامة الخاصة وتواصل المنتج الغذائي المهيأ للرف.",
    },
    ctaPrimary: { label: { en: "Start a Packaging Project", ar: "ابدأ مشروع تغليف" }, href: "/contact" },
    ctaSecondary: { label: { en: "View Products", ar: "عرض المنتجات" }, href: "/products" },
  },

  "digital-marketing": {
    slug: "digital-marketing",
    metaTitle: {
      en: "Food Digital Marketing | Al Shehail Food Industries",
      ar: "التسويق الرقمي للأغذية | الشهيل للصناعات الغذائية",
    },
    metaDescription: {
      en: "Digital marketing support for food products, helping brands communicate clearly from product launch to online customer awareness — built on verified product details.",
      ar: "دعم تسويق رقمي للمنتجات الغذائية يساعد العلامات على التواصل بوضوح من إطلاق المنتج إلى وعي العميل عبر الإنترنت — مبني على تفاصيل منتج موثّقة.",
    },
    heroEyebrow: { en: "Services · Digital Marketing", ar: "الخدمات · التسويق الرقمي" },
    heroTitle: { en: "Food Digital Marketing", ar: "التسويق الرقمي للأغذية" },
    heroSubtitle: {
      en: "Digital marketing support for food products, helping brands communicate clearly from product launch to online customer awareness.",
      ar: "دعم تسويق رقمي للمنتجات الغذائية يساعد العلامات على التواصل بوضوح من إطلاق المنتج إلى وعي العميل عبر الإنترنت.",
    },
    heroPrimary: { label: { en: "Start a Marketing Project", ar: "ابدأ مشروع تسويق" }, href: "/contact" },
    heroSecondary: {
      label: { en: "Explore Brand Design", ar: "استكشف تصميم العلامة" },
      href: "/services/brand-design",
    },
    introEyebrow: { en: "Overview", ar: "نظرة عامة" },
    introTitle: { en: "From production story to customer-facing content", ar: "من قصة الإنتاج إلى محتوى يواجه العميل" },
    introDesc: {
      en: "Al Shehail supports food brands with digital marketing direction built around real product details, packaging communication, and retail readiness — helping products move from production story to customer-facing content.",
      ar: "يدعم الشهيل العلامات الغذائية بتوجيه تسويق رقمي مبني حول تفاصيل منتج حقيقية وتواصل التغليف والجاهزية للتجزئة — لينتقل المنتج من قصة الإنتاج إلى محتوى يواجه العميل.",
    },
    coverageEyebrow: { en: "What We Support", ar: "ما ندعمه" },
    coverageTitle: { en: "Food-product digital marketing support", ar: "دعم تسويق رقمي للمنتج الغذائي" },
    coverageDesc: {
      en: "Marketing direction built around real products, packaging, and retail readiness — not generic content.",
      ar: "توجيه تسويقي مبني حول منتجات حقيقية وتغليف وجاهزية للتجزئة — لا محتوى عام.",
    },
    coverage: [
      {
        title: { en: "Product Launch Content", ar: "محتوى إطلاق المنتج" },
        description: { en: "Campaign direction and content planning for new food product launches.", ar: "توجيه حملات وتخطيط محتوى لإطلاق منتجات غذائية جديدة." },
        icon: "calendar",
      },
      {
        title: { en: "Social Media Communication", ar: "التواصل عبر وسائل التواصل" },
        description: { en: "Clear product messaging for Instagram, Facebook, LinkedIn, and other online channels.", ar: "رسائل منتج واضحة لإنستغرام وفيسبوك ولينكدإن والقنوات الأخرى." },
        icon: "retail",
      },
      {
        title: { en: "Food Product Storytelling", ar: "سرد قصة المنتج الغذائي" },
        description: { en: "Turning product features, ingredients, process, and packaging into customer-facing content.", ar: "تحويل مزايا المنتج والمكوّنات والعملية والتغليف إلى محتوى يواجه العميل." },
        icon: "develop",
      },
      {
        title: { en: "Performance Campaign Direction", ar: "توجيه حملات الأداء" },
        description: { en: "Marketing structure and campaign direction for awareness, lead generation, or retail support.", ar: "بنية تسويقية وتوجيه حملات للوعي أو جذب العملاء أو دعم التجزئة." },
        icon: "production",
      },
      {
        title: { en: "Retail & Online Product Assets", ar: "أصول منتج للتجزئة وعبر الإنترنت" },
        description: { en: "Digital content direction for product pages, marketplace listings, and retail communication.", ar: "توجيه محتوى رقمي لصفحات المنتجات وقوائم الأسواق وتواصل التجزئة." },
        icon: "packaging",
      },
      {
        title: { en: "Private Label Marketing Support", ar: "دعم تسويق العلامة الخاصة" },
        description: { en: "Marketing support for products developed through Al Shehail's private-label manufacturing service.", ar: "دعم تسويقي للمنتجات المطوَّرة عبر خدمة التصنيع بعلامة خاصة لدى الشهيل." },
        icon: "shield",
      },
    ],
    processEyebrow: { en: "How It Works", ar: "كيف تعمل" },
    processTitle: { en: "A clear path from product to campaign", ar: "مسار واضح من المنتج إلى الحملة" },
    processDesc: {
      en: "A simple, direction-led flow from understanding the product to a structured campaign.",
      ar: "تدفق بسيط بقيادة التوجيه من فهم المنتج إلى حملة منظّمة.",
    },
    process: [
      { title: { en: "Product Understanding", ar: "فهم المنتج" }, text: { en: "Understand the product, category, ingredients, target customer, and market positioning.", ar: "فهم المنتج والفئة والمكوّنات والعميل المستهدف والتموضع في السوق." } },
      { title: { en: "Message Strategy", ar: "استراتيجية الرسالة" }, text: { en: "Define the key product messages, benefits, use cases, and customer-facing story.", ar: "تحديد رسائل المنتج الأساسية والفوائد وحالات الاستخدام والقصة التي تواجه العميل." } },
      { title: { en: "Content Direction", ar: "توجيه المحتوى" }, text: { en: "Plan the content formats needed for launch, social media, website, retail, or paid campaigns.", ar: "تخطيط أشكال المحتوى اللازمة للإطلاق ووسائل التواصل والموقع والتجزئة أو الحملات المدفوعة." } },
      { title: { en: "Campaign Structure", ar: "بنية الحملة" }, text: { en: "Organize the campaign flow: awareness, product education, retail support, or lead generation.", ar: "تنظيم تدفق الحملة: الوعي وتثقيف المنتج ودعم التجزئة أو جذب العملاء." } },
      { title: { en: "Review & Optimization Direction", ar: "توجيه المراجعة والتحسين" }, text: { en: "Review content and campaign direction based on actual market feedback and verified product information.", ar: "مراجعة المحتوى وتوجيه الحملة بناءً على ملاحظات السوق الفعلية ومعلومات المنتج الموثّقة." } },
    ],
    deliverables: {
      eyebrow: { en: "Deliverables", ar: "المخرجات" },
      title: { en: "Where we can support", ar: "أين يمكننا الدعم" },
      desc: { en: "Direction, planning, and content structure across launch and online communication.", ar: "توجيه وتخطيط وبنية محتوى عبر الإطلاق والتواصل عبر الإنترنت." },
      items: [
        { en: "Social media content direction", ar: "توجيه محتوى وسائل التواصل" },
        { en: "Launch campaign planning", ar: "تخطيط حملة الإطلاق" },
        { en: "Product storytelling", ar: "سرد قصة المنتج" },
        { en: "Product page copy direction", ar: "توجيه نصوص صفحة المنتج" },
        { en: "Marketplace listing content direction", ar: "توجيه محتوى قوائم الأسواق" },
        { en: "Paid campaign structure", ar: "بنية الحملة المدفوعة" },
        { en: "Food photography/video brief direction", ar: "توجيه موجز تصوير/فيديو الأغذية" },
        { en: "Retail promotion communication", ar: "تواصل ترويج التجزئة" },
        { en: "Private-label brand communication", ar: "تواصل علامة العلامة الخاصة" },
      ],
    },
    categories: {
      eyebrow: { en: "Category Fit", ar: "ملاءمة الفئة" },
      title: { en: "Food categories this fits", ar: "الفئات الغذائية التي تناسبها" },
      items: [...foodCategories, { en: "Private-label food brands", ar: "علامات غذائية بعلامة خاصة" }],
    },
    relatedEyebrow: { en: "One Connected Partner", ar: "شريك واحد مترابط" },
    relatedTitle: { en: "Marketing connects with the wider service ecosystem", ar: "يتصل التسويق بمنظومة الخدمات الأوسع" },
    relatedDesc: {
      en: "Digital marketing works alongside manufacturing, packaging, and distribution so a product is communicated as clearly as it is made.",
      ar: "يعمل التسويق الرقمي جنبًا إلى جنب مع التصنيع والتغليف والتوزيع ليُقدَّم المنتج بوضوح كما يُصنَع.",
    },
    related: [relPrivateLabel, relBrandDesign, relDistribution],
    noteLabel: { en: "Before public communication", ar: "قبل التواصل العام" },
    noteText: {
      en: "Marketing messages, nutrition statements, product claims, and ingredient callouts should be based on verified product specifications before use in campaigns or public communication.",
      ar: "يجب أن تستند الرسائل التسويقية والبيانات الغذائية وادعاءات المنتج وإبرازات المكوّنات إلى مواصفات منتج موثّقة قبل استخدامها في الحملات أو التواصل العام.",
    },
    ctaEyebrow: { en: "Launch Online", ar: "أطلق عبر الإنترنت" },
    ctaTitle: { en: "Ready to launch your food product online?", ar: "جاهز لإطلاق منتجك الغذائي عبر الإنترنت؟" },
    ctaText: {
      en: "Talk to Al Shehail about product communication, launch content, and digital marketing support for your food brand.",
      ar: "تحدّث إلى الشهيل حول تواصل المنتج ومحتوى الإطلاق ودعم التسويق الرقمي لعلامتك الغذائية.",
    },
    ctaPrimary: { label: { en: "Start a Marketing Project", ar: "ابدأ مشروع تسويق" }, href: "/contact" },
    ctaSecondary: { label: { en: "Explore Products", ar: "استكشف المنتجات" }, href: "/products" },
  },
};
