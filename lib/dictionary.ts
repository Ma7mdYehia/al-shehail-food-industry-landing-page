// Central UI-string dictionary for scattered chrome that isn't part of the
// structured content modules (lib/content, lib/products, etc.). Keyed by locale.
// Components accept a `locale` prop and read ui[locale].<area>.<key>.
//
// Copy rules: professional, human, UAE-market-appropriate. No invented numbers,
// certifications, capacity, or outlet-count claims.

import type { Locale } from "@/lib/i18n";

type Dict = {
  brand: {
    line1: string; // "Al Shehail"
    line2: string; // "Food Industries"
  };
  langSwitch: {
    label: string; // switch-to label shown on the toggle
    aria: string;
  };
  header: {
    primaryAria: string;
    mobileAria: string;
    toggleMenu: string;
    startProject: string;
    servicesLabel: string;
  };
  footer: {
    tagline: string;
    explore: string;
    getInTouch: string;
    whatsapp: string;
    startProject: string;
    rights: string;
    strip: string;
  };
  home: {
    partners: { eyebrow: string; blurb: string; cta: string };
    about: { eyebrow: string; title: string; description: string; cta: string };
    services: {
      eyebrow: string;
      title: string;
      description: string;
      items: { title: string; text: string; cta: string; href: string }[];
    };
    products: {
      eyebrow: string;
      title: string;
      description: string;
      featured: string;
      viewCatalog: string;
    };
    process: { eyebrow: string; cta: string };
    market: { eyebrow: string; title: string; description: string; cta: string };
    finalCta: {
      eyebrow: string;
      title: string;
      description: string;
      primary: string;
      secondary: string;
    };
  };
  partners: {
    viewProjectAria: string; // "View {name} project details"
    exploreProject: string;
    productWord: string;
    productsWord: string;
    overview: string;
    productionFocus: string;
    ingredientStrategy: string;
    processNotes: string;
    nutritionFocus: string;
    compliance: string;
    products: string;
    close: string;
    awaitingData: string;
  };
  common: {
    startProject: string;
    exploreServices: string;
    learnMore: string;
  };
};

const en: Dict = {
  brand: { line1: "Al Shehail", line2: "Food Industries" },
  langSwitch: { label: "العربية", aria: "التبديل إلى العربية" },
  header: {
    primaryAria: "Primary",
    mobileAria: "Mobile",
    toggleMenu: "Toggle menu",
    startProject: "Start a Project",
    servicesLabel: "Services",
  },
  footer: {
    tagline:
      "From idea to shelf — developing and manufacturing bakery products built for retail success.",
    explore: "Explore",
    getInTouch: "Get in Touch",
    whatsapp: "WhatsApp",
    startProject: "Start a Project",
    rights: "All rights reserved.",
    strip: "Bakery Manufacturing & Private Label · United Arab Emirates",
  },
  home: {
    partners: {
      eyebrow: "Manufacturing Partner For",
      blurb:
        "Trusted to develop and produce private label bakery ranges for established UAE food brands.",
      cta: "View Partners",
    },
    about: {
      eyebrow: "About Al Shehail",
      title: "UAE-Based Bakery Manufacturing Partner",
      description:
        "Al Shehail Food Industries is a UAE-based bakery manufacturer specialized in modern bakery products, private label production, and product development for retail and institutional markets.",
      cta: "Learn About Al Shehail",
    },
    services: {
      eyebrow: "Beyond Manufacturing",
      title: "One partner across the food product journey",
      description:
        "Al Shehail supports food brands across production, packaging, distribution, and digital communication — helping products move from idea to retail-ready execution.",
      items: [
        {
          title: "Private Label Manufacturing",
          text: "Product development and bakery manufacturing support for food brands.",
          cta: "Explore Manufacturing",
          href: "/private-label",
        },
        {
          title: "Packaging & Brand Design",
          text: "Food-focused packaging direction and brand presentation for retail-ready products.",
          cta: "Explore Brand Design",
          href: "/services/brand-design",
        },
        {
          title: "Distribution Fleet & Retail Reach",
          text: "Distribution coordination for finished products moving toward selected retail channels.",
          cta: "Explore Distribution",
          href: "/services/distribution",
        },
        {
          title: "Food Digital Marketing",
          text: "Launch content, product storytelling, and digital communication direction for food brands.",
          cta: "Explore Marketing",
          href: "/services/digital-marketing",
        },
      ],
    },
    products: {
      eyebrow: "What We Manufacture",
      title: "A complete bakery product range",
      description:
        "A featured selection from our range — flatbread and wraps, soft bread, pastry, and sweets — manufactured to consistent, retail-ready quality.",
      featured: "Featured",
      viewCatalog: "View Full Product Catalog",
    },
    process: {
      eyebrow: "Manufacturing Process",
      cta: "Explore Private Label Manufacturing",
    },
    market: {
      eyebrow: "Retail & Distribution Partners",
      title: "Selected retail and distribution relationships",
      description:
        "Retail partners and channel relationships vary by project and market requirements.",
      cta: "View Market Presence",
    },
    finalCta: {
      eyebrow: "From Idea to Shelf",
      title: "Ready to Build Your Food Product?",
      description:
        "Talk to Al Shehail about manufacturing, packaging, distribution, and product communication support for your food brand.",
      primary: "Start a Project",
      secondary: "Explore Services",
    },
  },
  partners: {
    viewProjectAria: "View project details",
    exploreProject: "Explore project",
    productWord: "product",
    productsWord: "products",
    overview: "Overview",
    productionFocus: "Production Focus",
    ingredientStrategy: "Ingredient Strategy",
    processNotes: "Process Notes",
    nutritionFocus: "Nutrition Focus",
    compliance: "Quality & Compliance",
    products: "Products",
    close: "Close",
    awaitingData: "Details to be confirmed from verified specification sheets.",
  },
  common: {
    startProject: "Start a Project",
    exploreServices: "Explore Services",
    learnMore: "Learn More",
  },
};

const ar: Dict = {
  brand: { line1: "الشحيل", line2: "للصناعات الغذائية" },
  langSwitch: { label: "EN", aria: "Switch to English" },
  header: {
    primaryAria: "التنقل الرئيسي",
    mobileAria: "قائمة الجوال",
    toggleMenu: "فتح القائمة",
    startProject: "ابدأ مشروعك",
    servicesLabel: "خدماتنا",
  },
  footer: {
    tagline:
      "من الفكرة إلى الرف — نطوّر ونصنّع منتجات مخبوزات مهيأة للنجاح في التجزئة.",
    explore: "استكشف",
    getInTouch: "تواصل معنا",
    whatsapp: "واتساب",
    startProject: "ابدأ مشروعك",
    rights: "جميع الحقوق محفوظة.",
    strip: "تصنيع مخبوزات وعلامات خاصة · الإمارات العربية المتحدة",
  },
  home: {
    partners: {
      eyebrow: "شريك التصنيع لـ",
      blurb:
        "موضع ثقة لتطوير وإنتاج تشكيلات مخبوزات بعلامة خاصة لعلامات غذائية راسخة في الإمارات.",
      cta: "عرض الشركاء",
    },
    about: {
      eyebrow: "عن الشحيل",
      title: "شريك تصنيع مخبوزات مقره الإمارات",
      description:
        "الشحيل للصناعات الغذائية مصنّع مخبوزات مقره الإمارات، متخصص في المخبوزات الحديثة وإنتاج العلامة الخاصة وتطوير المنتجات لأسواق التجزئة والمؤسسات.",
      cta: "تعرّف على الشحيل",
    },
    services: {
      eyebrow: "أبعد من التصنيع",
      title: "شريك واحد عبر رحلة المنتج الغذائي",
      description:
        "يدعم الشحيل العلامات الغذائية عبر الإنتاج والتغليف والتوزيع والتواصل الرقمي — لينتقل المنتج من الفكرة إلى تنفيذ جاهز للتجزئة.",
      items: [
        {
          title: "التصنيع بعلامة خاصة",
          text: "تطوير المنتجات ودعم تصنيع المخبوزات للعلامات الغذائية.",
          cta: "استكشف التصنيع",
          href: "/private-label",
        },
        {
          title: "التغليف وتصميم العلامة",
          text: "توجيه تغليف متخصص في الأغذية وعرض للعلامة يليق بالرف.",
          cta: "استكشف تصميم العلامة",
          href: "/services/brand-design",
        },
        {
          title: "أسطول التوزيع والوصول للتجزئة",
          text: "تنسيق توزيع المنتجات الجاهزة نحو قنوات تجزئة مختارة.",
          cta: "استكشف التوزيع",
          href: "/services/distribution",
        },
        {
          title: "التسويق الرقمي للأغذية",
          text: "محتوى الإطلاق وسرد قصة المنتج وتوجيه التواصل الرقمي للعلامات الغذائية.",
          cta: "استكشف التسويق",
          href: "/services/digital-marketing",
        },
      ],
    },
    products: {
      eyebrow: "ماذا نصنّع",
      title: "تشكيلة مخبوزات متكاملة",
      description:
        "مجموعة مختارة من تشكيلتنا — خبز مسطّح ولفائف، وخبز طري، ومعجنات، وحلويات — مصنّعة بجودة ثابتة ومهيأة للتجزئة.",
      featured: "مختارات",
      viewCatalog: "عرض كامل كتالوج المنتجات",
    },
    process: {
      eyebrow: "عملية التصنيع",
      cta: "استكشف التصنيع بعلامة خاصة",
    },
    market: {
      eyebrow: "شركاء التجزئة والتوزيع",
      title: "علاقات مختارة في التجزئة والتوزيع",
      description:
        "تختلف علاقات شركاء التجزئة والقنوات حسب المشروع ومتطلبات السوق.",
      cta: "عرض الحضور في السوق",
    },
    finalCta: {
      eyebrow: "من الفكرة إلى الرف",
      title: "جاهز لبناء منتجك الغذائي؟",
      description:
        "تحدّث إلى الشحيل حول دعم التصنيع والتغليف والتوزيع والتواصل حول المنتج لعلامتك الغذائية.",
      primary: "ابدأ مشروعك",
      secondary: "استكشف الخدمات",
    },
  },
  partners: {
    viewProjectAria: "عرض تفاصيل المشروع",
    exploreProject: "استكشف المشروع",
    productWord: "منتج",
    productsWord: "منتجات",
    overview: "نظرة عامة",
    productionFocus: "تركيز الإنتاج",
    ingredientStrategy: "استراتيجية المكوّنات",
    processNotes: "ملاحظات العملية",
    nutritionFocus: "التركيز الغذائي",
    compliance: "الجودة والامتثال",
    products: "المنتجات",
    close: "إغلاق",
    awaitingData: "تُؤكَّد التفاصيل من أوراق مواصفات موثّقة.",
  },
  common: {
    startProject: "ابدأ مشروعك",
    exploreServices: "استكشف الخدمات",
    learnMore: "اعرف المزيد",
  },
};

export const ui: Record<Locale, Dict> = { en, ar };
