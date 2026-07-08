import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import AssetHint from "@/components/AssetHint";
import BackgroundVideo from "@/components/BackgroundVideo";
import PrivateLabelHero from "@/components/private-label/PrivateLabelHero";
import PrivateLabelSectionNav from "@/components/private-label/PrivateLabelSectionNav";
import PrivateLabelProcess from "@/components/private-label/PrivateLabelProcess";
import {
  DevelopIcon,
  ProductionIcon,
  PackagingIcon,
  RetailIcon,
  ShieldCheckIcon,
  CalendarIcon,
} from "@/components/Icons";
import { certifications } from "@/lib/content";
import { assets, hasAsset, getAssetAlt } from "@/lib/assets";
import { localeHref, type Locale } from "@/lib/i18n";

const capabilityIcons = [
  DevelopIcon,
  ProductionIcon,
  PackagingIcon,
  PackagingIcon,
  ProductionIcon,
  ShieldCheckIcon,
  CalendarIcon,
  RetailIcon,
];

const certAssetKeys: Record<string, keyof typeof assets.certifications> = {
  "ISO Certified": "iso",
  "HACCP Certified": "haccp",
  "Organic Certified": "organic",
  "Carrefour Approved": "carrefourApproved",
};

const copy: Record<
  Locale,
  {
    trustProof: string[];
    audience: string[];
    buildScope: { title: string; description: string; tag: string }[];
    capabilityCards: { title: string; text: string }[];
    recipeDirections: string[];
    packaging: string[];
    qualityProcess: string[];
    useCases: { title: string; text: string }[];
    needFromYou: string[];
    whoEyebrow: string;
    whoTitle: string;
    whoDesc: string;
    scopeEyebrow: string;
    scopeTitle: string;
    scopeDesc: string;
    capEyebrow: string;
    capTitle: string;
    capDesc: string;
    processEyebrow: string;
    processTitle: string;
    processDesc: string;
    recipeEyebrow: string;
    recipeTitle: string;
    recipeDesc: string;
    advisoryLabel: string;
    advisoryText: string;
    packEyebrow: string;
    packTitle: string;
    packDesc: string;
    qualityEyebrow: string;
    qualityTitle: string;
    qualityDesc: string;
    qualityProcessLabel: string;
    certHintApproval: string;
    certHintCertificate: string;
    useCasesEyebrow: string;
    useCasesTitle: string;
    startEyebrow: string;
    startTitle: string;
    startDesc: string;
    startShare: string;
    startBtn: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaBtn: string;
  }
> = {
  en: {
    trustProof: [
      "UAE-based bakery manufacturer",
      "Private label support",
      "Product development",
      "Quality-controlled production",
      "Retail-ready supply",
    ],
    audience: [
      "Food brands",
      "Retailers",
      "Supermarkets & hypermarkets",
      "Cafes & foodservice operators",
      "Institutional buyers",
      "Healthy bakery brands",
      "Date sweets & bakery snack brands",
    ],
    buildScope: [
      { title: "Flatbread & Wraps", tag: "Product range", description: "Arabic bread, functional wraps, and grain-based bread formats for retail and foodservice." },
      { title: "Soft Bread", tag: "Product range", description: "Toast, buns, rolls, and everyday bakery formats built for consistent supply." },
      { title: "Pastry", tag: "Product range", description: "Croissants, mini croissants, and puff pastry formats for premium bakery ranges." },
      { title: "Sweets", tag: "Product range", description: "Maa'moul, tamriya, cookies, and date-based bakery sweets." },
      { title: "Custom Recipe Directions", tag: "Service", description: "Recipe development based on market position, product testing, and feasibility." },
      { title: "Packaging Formats", tag: "Service", description: "Retail-ready packaging direction based on product type, brand, and supply needs." },
    ],
    capabilityCards: [
      { title: "Product Development", text: "From brief to a finished, manufacturable bakery product." },
      { title: "Recipe Customization", text: "Formulations tuned for taste, texture, and positioning." },
      { title: "Private Label Manufacturing", text: "Production under your brand, to your specification." },
      { title: "Retail-Ready Packing", text: "Packaging formats prepared for shelf and supply." },
      { title: "Scalable Production Planning", text: "Output planned from sample through to volume." },
      { title: "Quality-Controlled Process", text: "Checks across handling, production, and packing." },
      { title: "Sampling and Product Iteration", text: "Samples produced and refined to your brief." },
      { title: "Market-Ready Product Support", text: "Guidance toward a retail-ready launch." },
    ],
    recipeDirections: [
      "Standard recipes",
      "Health-focused recipes",
      "Clean label direction",
      "No added sugar where technically suitable",
      "Reduced sugar where suitable",
      "No preservatives where shelf life and process allow",
      "Whole wheat / fiber-focused directions where suitable",
      "Size, format, flavor, and filling customization",
    ],
    packaging: [
      "Pack format planning",
      "Brand-ready packaging support",
      "Multipack and box direction",
      "Retail shelf readiness",
      "Supply preparation",
      "Launch support",
    ],
    qualityProcess: [
      "Ingredient handling",
      "Recipe & batch control",
      "Hygiene process",
      "Production records",
      "Quality inspection",
      "Packaging checks",
      "Retail supply standards",
    ],
    useCases: [
      { title: "Retail private label", text: "Bakery products developed and manufactured under your retail brand." },
      { title: "Supermarket supply", text: "Consistent bakery formats prepared for retail shelf requirements." },
      { title: "Foodservice supply", text: "Reliable bakery supply for cafes, catering, and operators." },
      { title: "Healthy bakery product lines", text: "Whole grain, fiber-focused, or market-specific recipe directions where suitable." },
      { title: "Date sweets product lines", text: "Traditional and modern date-based sweets for retail and gifting." },
      { title: "Cafe & institutional products", text: "Bakery formats planned for repeatable supply and service needs." },
    ],
    needFromYou: [
      "Product idea",
      "Target market",
      "Expected volume",
      "Product format",
      "Packaging direction",
      "Required standards or certifications",
      "Timeline",
    ],
    whoEyebrow: "Who We Build For",
    whoTitle: "Built for brands, retailers, and foodservice buyers",
    whoDesc:
      "Whether you are launching a new bakery line or expanding an existing retail range, Al Shehail supports the manufacturing path behind your brand.",
    scopeEyebrow: "Product Scope",
    scopeTitle: "What we can build with you",
    scopeDesc:
      "A bakery range spanning everyday staples, premium pastry, and date-based sweets — developed and packaged to your brand.",
    capEyebrow: "Capabilities",
    capTitle: "Capabilities across the full manufacturing line",
    capDesc:
      "A connected support model covering product development, recipe direction, sampling, packaging, production planning, quality control, and retail-ready supply.",
    processEyebrow: "From Idea to Shelf",
    processTitle: "A clear path from product idea to retail-ready supply",
    processDesc:
      "A practical manufacturing journey that helps move your product from early brief to production, packaging, quality checks, and market-ready supply.",
    recipeEyebrow: "Recipe & Product Customization",
    recipeTitle: "Recipes developed to your target market",
    recipeDesc:
      "Recipe direction depends on the product brief, market positioning, shelf-life needs, ingredient availability, production feasibility, and regulatory approval.",
    advisoryLabel: "Advisory note",
    advisoryText:
      "All custom recipes are subject to product testing, shelf-life requirements, ingredient availability, production feasibility, and regulatory approval.",
    packEyebrow: "Packaging & Retail Readiness",
    packTitle: "Built for shelf, supply, and brand presentation",
    packDesc:
      "Private label manufacturing is not only about the recipe. The product also needs the right format, packaging direction, quality checks, and supply readiness.",
    qualityEyebrow: "Certifications & Quality",
    qualityTitle: "Quality you can put your brand behind",
    qualityDesc:
      "Certified standards and a structured, quality-controlled production process help support consistent retail-ready bakery supply.",
    qualityProcessLabel: "Quality Process",
    certHintApproval: "Approval proof/logo needed",
    certHintCertificate: "Certificate scan/logo needed",
    useCasesEyebrow: "Use Cases",
    useCasesTitle: "Where private label manufacturing applies",
    startEyebrow: "Start the Conversation",
    startTitle: "What we need to understand your project",
    startDesc:
      "A clear brief helps our team explore the right product direction, manufacturing fit, and private label supply path.",
    startShare: "Share what you have so far — we’ll help shape the rest.",
    startBtn: "Start a Private Label Project",
    ctaEyebrow: "From Idea to Shelf",
    ctaTitle: "Ready to Build a Bakery Product Under Your Brand?",
    ctaDesc:
      "Share your product idea, target market, and expected volume — our team will help you explore the right private label manufacturing solution.",
    ctaBtn: "Start a Private Label Project",
  },
  ar: {
    trustProof: [
      "مصنّع مخبوزات مقره الإمارات",
      "دعم العلامة الخاصة",
      "تطوير المنتجات",
      "إنتاج محكوم الجودة",
      "توريد جاهز للرف",
    ],
    audience: [
      "العلامات الغذائية",
      "تجار التجزئة",
      "الأسواق والهايبرماركت",
      "المقاهي ومشغّلو خدمات الطعام",
      "المشترون المؤسسيون",
      "علامات المخبوزات الصحية",
      "علامات حلويات التمر وتسالي المخبوزات",
    ],
    buildScope: [
      { title: "الخبز المسطّح واللفائف", tag: "تشكيلة منتجات", description: "خبز عربي ولفائف وظيفية وأشكال خبز قائمة على الحبوب للتجزئة وخدمات الطعام." },
      { title: "الخبز الطري", tag: "تشكيلة منتجات", description: "توست وأرغفة وأرغفة صغيرة وأشكال مخبوزات يومية مبنية لتوريد ثابت." },
      { title: "المعجنات", tag: "تشكيلة منتجات", description: "كرواسان وكرواسان ميني ومعجنات ورقية لتشكيلات مخبوزات راقية." },
      { title: "الحلويات", tag: "تشكيلة منتجات", description: "معمول وتمرية وكوكيز وحلويات مخبوزة قائمة على التمر." },
      { title: "توجهات وصفات مخصّصة", tag: "خدمة", description: "تطوير وصفات بناءً على التموضع في السوق واختبار المنتج والجدوى." },
      { title: "أشكال التغليف", tag: "خدمة", description: "توجيه تغليف مهيأ للرف بناءً على نوع المنتج والعلامة واحتياجات التوريد." },
    ],
    capabilityCards: [
      { title: "تطوير المنتجات", text: "من الموجز إلى منتج مخبوزات نهائي قابل للتصنيع." },
      { title: "تخصيص الوصفات", text: "تركيبات مضبوطة للطعم والقوام والتموضع." },
      { title: "التصنيع بعلامة خاصة", text: "إنتاج تحت علامتك ووفق مواصفتك." },
      { title: "تعبئة جاهزة للرف", text: "أشكال تغليف مهيأة للرف والتوريد." },
      { title: "تخطيط إنتاج قابل للتوسّع", text: "إنتاجية مخطَّطة من العينة حتى الحجم الكبير." },
      { title: "عملية محكومة الجودة", text: "فحوصات عبر المناولة والإنتاج والتعبئة." },
      { title: "العينات وتحسين المنتج", text: "عينات تُنتَج وتُطوَّر حسب موجزك." },
      { title: "دعم منتج جاهز للسوق", text: "إرشاد نحو إطلاق مهيأ للرف." },
    ],
    recipeDirections: [
      "وصفات قياسية",
      "وصفات تركّز على الصحة",
      "توجه نظيف المكوّنات",
      "بدون سكر مضاف حيثما يناسب تقنيًا",
      "سكر مخفّض حيثما يناسب",
      "بدون مواد حافظة حيثما تسمح مدة الصلاحية والعملية",
      "توجهات القمح الكامل / الغنية بالألياف حيثما يناسب",
      "تخصيص الحجم والشكل والنكهة والحشو",
    ],
    packaging: [
      "تخطيط شكل العبوة",
      "دعم تغليف جاهز للعلامة",
      "توجيه العبوات المتعددة والعلب",
      "جاهزية رف التجزئة",
      "تجهيز التوريد",
      "دعم الإطلاق",
    ],
    qualityProcess: [
      "مناولة المكوّنات",
      "ضبط الوصفة والدفعات",
      "عملية النظافة",
      "سجلات الإنتاج",
      "فحص الجودة",
      "فحوصات التغليف",
      "معايير توريد التجزئة",
    ],
    useCases: [
      { title: "علامة خاصة للتجزئة", text: "منتجات مخبوزات مطوَّرة ومُصنَّعة تحت علامة التجزئة الخاصة بك." },
      { title: "توريد الأسواق", text: "أشكال مخبوزات ثابتة مهيأة لمتطلبات رف التجزئة." },
      { title: "توريد خدمات الطعام", text: "توريد مخبوزات موثوق للمقاهي والتموين والمشغّلين." },
      { title: "خطوط مخبوزات صحية", text: "توجهات وصفات بالحبوب الكاملة أو الغنية بالألياف أو خاصة بالسوق حيثما يناسب." },
      { title: "خطوط حلويات التمر", text: "حلويات تمر تقليدية وحديثة للتجزئة والهدايا." },
      { title: "منتجات المقاهي والمؤسسات", text: "أشكال مخبوزات مخطَّطة لتوريد متكرّر واحتياجات الخدمة." },
    ],
    needFromYou: [
      "فكرة المنتج",
      "السوق المستهدف",
      "الكمية المتوقعة",
      "شكل المنتج",
      "توجيه التغليف",
      "المعايير أو الشهادات المطلوبة",
      "الجدول الزمني",
    ],
    whoEyebrow: "لمن نصنّع",
    whoTitle: "مبني للعلامات وتجار التجزئة ومشتري خدمات الطعام",
    whoDesc:
      "سواء كنت تطلق خط مخبوزات جديدًا أو توسّع تشكيلة تجزئة قائمة، يدعم الشهيل مسار التصنيع خلف علامتك.",
    scopeEyebrow: "نطاق المنتجات",
    scopeTitle: "ما الذي يمكننا بناؤه معك",
    scopeDesc:
      "تشكيلة مخبوزات تمتد من الأساسيات اليومية إلى المعجنات الراقية وحلويات التمر — مطوَّرة ومغلَّفة لعلامتك.",
    capEyebrow: "القدرات",
    capTitle: "قدرات عبر خط التصنيع الكامل",
    capDesc:
      "نموذج دعم مترابط يغطي تطوير المنتجات وتوجيه الوصفة والعينات والتغليف وتخطيط الإنتاج ومراقبة الجودة والتوريد الجاهز للرف.",
    processEyebrow: "من الفكرة إلى الرف",
    processTitle: "مسار واضح من فكرة المنتج إلى توريد جاهز للرف",
    processDesc:
      "رحلة تصنيع عملية تساعد على نقل منتجك من الموجز الأولي إلى الإنتاج والتغليف وفحوصات الجودة والتوريد الجاهز للسوق.",
    recipeEyebrow: "تخصيص الوصفة والمنتج",
    recipeTitle: "وصفات مطوَّرة لسوقك المستهدف",
    recipeDesc:
      "يعتمد توجيه الوصفة على موجز المنتج والتموضع في السوق واحتياجات مدة الصلاحية وتوفّر المكوّنات وجدوى الإنتاج والموافقة التنظيمية.",
    advisoryLabel: "ملاحظة إرشادية",
    advisoryText:
      "تخضع جميع الوصفات المخصّصة لاختبار المنتج ومتطلبات مدة الصلاحية وتوفّر المكوّنات وجدوى الإنتاج والموافقة التنظيمية.",
    packEyebrow: "التغليف والجاهزية للرف",
    packTitle: "مبني للرف والتوريد وعرض العلامة",
    packDesc:
      "التصنيع بعلامة خاصة ليس فقط الوصفة. يحتاج المنتج أيضًا إلى الشكل المناسب وتوجيه التغليف وفحوصات الجودة وجاهزية التوريد.",
    qualityEyebrow: "الشهادات والجودة",
    qualityTitle: "جودة تضع علامتك خلفها بثقة",
    qualityDesc:
      "معايير معتمدة وعملية إنتاج منظّمة محكومة الجودة تساعد على دعم توريد مخبوزات ثابت ومهيأ للرف.",
    qualityProcessLabel: "عملية الجودة",
    certHintApproval: "إثبات/شعار الاعتماد مطلوب",
    certHintCertificate: "نسخة/شعار الشهادة مطلوب",
    useCasesEyebrow: "حالات الاستخدام",
    useCasesTitle: "أين ينطبق التصنيع بعلامة خاصة",
    startEyebrow: "ابدأ المحادثة",
    startTitle: "ما نحتاجه لفهم مشروعك",
    startDesc:
      "موجز واضح يساعد فريقنا على استكشاف توجه المنتج المناسب والملاءمة التصنيعية ومسار توريد العلامة الخاصة.",
    startShare: "شارك ما لديك حتى الآن — وسنساعدك على تشكيل الباقي.",
    startBtn: "ابدأ مشروع علامة خاصة",
    ctaEyebrow: "من الفكرة إلى الرف",
    ctaTitle: "جاهز لبناء منتج مخبوزات تحت علامتك؟",
    ctaDesc:
      "شارك فكرة منتجك وسوقك المستهدف والكمية المتوقعة — وسيساعدك فريقنا على استكشاف الحل الأنسب للتصنيع بعلامة خاصة.",
    ctaBtn: "ابدأ مشروع علامة خاصة",
  },
};

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function CheckCard({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-sand bg-cream px-4 py-3 text-sm font-medium text-charcoal">
      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-beige text-gold">
        <CheckIcon />
      </span>
      {label}
    </li>
  );
}

export default function PrivateLabelPage({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <>
      <Header locale={locale} />
      <main>
        {/* 1. Hero */}
        <PrivateLabelHero locale={locale} />

        {/* 2. Trust strip */}
        <section className="border-y border-sand/60 bg-warmwhite py-8">
          <div className="container-x">
            <ul className="flex flex-wrap items-center justify-center gap-2.5">
              {t.trustProof.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-sand bg-cream px-4 py-1.5 text-xs font-semibold text-charcoal sm:text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Sticky in-page nav */}
        <PrivateLabelSectionNav locale={locale} />

        {/* 3. Who We Build For */}
        <section id="overview" className="section scroll-mt-36">
          <div className="container-x">
            <SectionHeading eyebrow={t.whoEyebrow} title={t.whoTitle} description={t.whoDesc} />
            <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {t.audience.map((a) => (
                <CheckCard key={a} label={a} />
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Product Scope */}
        <section id="products" className="section scroll-mt-36 border-y border-sand/50 bg-beige/30">
          <div className="container-x">
            <SectionHeading eyebrow={t.scopeEyebrow} title={t.scopeTitle} description={t.scopeDesc} />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {t.buildScope.map((item) => (
                <div
                  key={item.title}
                  className="card-lift group rounded-2xl border border-sand bg-warmwhite p-6 shadow-card transition-colors hover:border-champagne/60"
                >
                  <span className="inline-flex items-center rounded-full border border-champagne/50 bg-cream px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
                    {item.tag}
                  </span>
                  <h3 className="mt-3 font-serif text-lg font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Capabilities */}
        <section id="capabilities" className="section scroll-mt-36 border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading eyebrow={t.capEyebrow} title={t.capTitle} description={t.capDesc} />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {t.capabilityCards.map((cap, i) => {
                const Icon = capabilityIcons[i];
                return (
                  <div
                    key={cap.title}
                    className="card-lift group rounded-2xl border border-sand bg-cream p-6 shadow-card transition-colors hover:border-champagne/60"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-beige text-gold transition-colors group-hover:bg-gold-gradient group-hover:text-white">
                      <Icon width={22} height={22} />
                    </span>
                    <h3 className="mt-5 font-serif text-base font-semibold text-ink">
                      {cap.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-stone">
                      {cap.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Process */}
        <section id="process" className="section scroll-mt-36 border-y border-sand/50 bg-beige/40">
          <div className="container-x">
            <SectionHeading eyebrow={t.processEyebrow} title={t.processTitle} description={t.processDesc} />
            <PrivateLabelProcess locale={locale} />
          </div>
        </section>

        {/* 7. Recipe & Product Customization */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading align="left" eyebrow={t.recipeEyebrow} title={t.recipeTitle} description={t.recipeDesc} />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {t.recipeDirections.map((r) => (
                <CheckCard key={r} label={r} />
              ))}
            </ul>
            <div className="mt-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-champagne/40 bg-cream p-5">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-beige text-gold">
                <ShieldCheckIcon width={15} height={15} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                  {t.advisoryLabel}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-stone">
                  {t.advisoryText}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Packaging & Retail Readiness */}
        <section className="section border-y border-sand/50 bg-beige/30">
          <div className="container-x">
            <SectionHeading eyebrow={t.packEyebrow} title={t.packTitle} description={t.packDesc} />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.packaging.map((p, i) => (
                <div
                  key={p}
                  className="flex items-center gap-4 rounded-2xl border border-sand bg-warmwhite p-5"
                >
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-beige font-serif text-sm font-bold text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-base font-semibold text-charcoal">
                    {p}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Certifications & Quality */}
        <section id="quality" className="section scroll-mt-36 border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <div className="relative overflow-hidden rounded-3xl border border-sand bg-cream px-6 py-12 sm:px-10 sm:py-14">
              <BackgroundVideo
                src="/assets/videos/quality-certifications-bg.mp4"
                className="hidden opacity-30 sm:block"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-warmwhite/95 via-cream/85 to-cream/70" aria-hidden />
              <div className="relative">
                <SectionHeading eyebrow={t.qualityEyebrow} title={t.qualityTitle} description={t.qualityDesc} />
              </div>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {certifications.map((cert) => {
                const assetKey = certAssetKeys[cert.title.en];
                const logoPath = assetKey ? assets.certifications[assetKey] : null;
                return (
                  <div
                    key={cert.title.en}
                    className="card-lift group flex flex-col items-center rounded-2xl border border-sand bg-cream p-8 text-center shadow-card hover:border-champagne/60 hover:shadow-glow"
                  >
                    <span className="relative flex h-20 w-20 items-center justify-center">
                      {hasAsset(logoPath) ? (
                        <Image
                          src={logoPath}
                          alt={getAssetAlt(assetKey!, cert.title[locale])}
                          width={80}
                          height={80}
                          className="h-20 w-20 object-contain"
                        />
                      ) : (
                        <>
                          <span className="absolute inset-0 rounded-full border-2 border-dashed border-champagne/40" />
                          <span className="absolute inset-2 rounded-full border border-champagne/30" />
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient text-white shadow-card">
                            <ShieldCheckIcon width={22} height={22} />
                          </span>
                        </>
                      )}
                    </span>
                    <h3 className="mt-5 font-serif text-lg font-semibold text-ink">
                      {cert.title[locale]}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">
                      {cert.description[locale]}
                    </p>
                    {!hasAsset(logoPath) && (
                      <AssetHint
                        label={
                          cert.title.en === "Carrefour Approved"
                            ? t.certHintApproval
                            : t.certHintCertificate
                        }
                        className="mt-4"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-10">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {t.qualityProcessLabel}
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {t.qualityProcess.map((q, i) => (
                  <div
                    key={q}
                    className="flex items-center gap-3 rounded-2xl border border-sand bg-cream p-4"
                  >
                    <span className="font-serif text-lg font-bold text-champagne/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold text-charcoal">{q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 10. Use Cases */}
        <section className="section border-y border-sand/50 bg-beige/30">
          <div className="container-x">
            <SectionHeading eyebrow={t.useCasesEyebrow} title={t.useCasesTitle} />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {t.useCases.map((u) => (
                <div
                  key={u.title}
                  className="card-lift rounded-2xl border border-sand bg-warmwhite p-6 transition-colors hover:border-champagne/60"
                >
                  <h3 className="font-serif text-base font-semibold text-ink">
                    {u.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    {u.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. What We Need From You */}
        <section id="start" className="section scroll-mt-36 border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading eyebrow={t.startEyebrow} title={t.startTitle} description={t.startDesc} />
            <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-sand bg-cream p-6 sm:p-8">
              <ul className="grid gap-3 sm:grid-cols-2">
                {t.needFromYou.map((n) => (
                  <CheckCard key={n} label={n} />
                ))}
              </ul>
              <div className="mt-7 flex flex-col items-center gap-3 border-t border-sand/70 pt-6 text-center sm:flex-row sm:justify-between sm:text-left rtl:sm:text-right">
                <p className="text-sm text-stone">{t.startShare}</p>
                <Link href={localeHref("/contact", locale)} className="btn-primary">
                  {t.startBtn}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 12. Final CTA */}
        <section className="section">
          <div className="container-x">
            <div className="relative overflow-hidden rounded-3xl border border-champagne/40 bg-gradient-to-br from-warmwhite via-cream to-beige px-6 py-16 text-center shadow-soft sm:px-12 lg:py-20">
              <BackgroundVideo
                src="/assets/videos/from-idea-to-shelf-bg.mp4"
                className="hidden opacity-35 sm:block"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-warmwhite/95 via-cream/85 to-beige/75" aria-hidden />

              <div className="relative mx-auto max-w-2xl">
                <span className="eyebrow">
                  <span className="h-px w-6 bg-champagne" />
                  {t.ctaEyebrow}
                </span>
                <h2 className="heading-serif mt-5 text-3xl sm:text-4xl lg:text-[2.75rem]">
                  {t.ctaTitle}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
                  {t.ctaDesc}
                </p>
                <div className="mt-8">
                  <Link href={localeHref("/contact", locale)} className="btn-primary">
                    {t.ctaBtn}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
