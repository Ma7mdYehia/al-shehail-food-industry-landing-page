import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/SectionHeading";
import { company } from "@/lib/content";
import { localeHref, type Locale } from "@/lib/i18n";
import { generatedAssets } from "@/lib/generatedAssets";
import {
  DevelopIcon,
  PackagingIcon,
  RetailIcon,
  ProductionIcon,
  ShieldCheckIcon,
} from "@/components/Icons";

const icons = [
  DevelopIcon,
  PackagingIcon,
  RetailIcon,
  ProductionIcon,
  ShieldCheckIcon,
];

const copy = {
  en: {
    heroEyebrow: "About Al Shehail",
    heroTitle: "UAE-Based Bakery Manufacturing Partner",
    heroSubtitle:
      "Al Shehail Food Industries is a UAE-based bakery manufacturing company specialized in modern bakery products, private label production, and product development for retail and institutional markets.",
    explorePl: "Explore Private Label",
    contactUs: "Contact Us",
    whoEyebrow: "Who We Are",
    whoTitle: "A bakery manufacturer built around brands",
    whoDesc:
      "Al Shehail Food Industries is a UAE-based bakery manufacturer with a modern, healthy-leaning production direction. We combine product development, manufacturing, and private label support under one partner — serving retail and institutional markets.",
    whoCards: [
      "UAE-based bakery manufacturer",
      "Modern & healthy manufacturing direction",
      "Development + production + private label",
      "Retail & institutional market focus",
    ],
    diffEyebrow: "What Makes Us Different",
    diffTitle: "More than a bakery production line",
    differentiators: [
      {
        title: "Product development mindset",
        text: "We approach every brief as a product to be developed, not just an order to be filled.",
      },
      {
        title: "Private label manufacturing support",
        text: "Dedicated support for brands building bakery ranges under their own label.",
      },
      {
        title: "Retail-ready production thinking",
        text: "Products engineered for shelf life, packaging, and merchandising from the start.",
      },
      {
        title: "Flexible product customization",
        text: "Recipes, formats, and packaging adapted to the target market and brand brief.",
      },
      {
        title: "Quality-controlled process",
        text: "A structured, hygiene-controlled process with checks across production.",
      },
    ],
    philEyebrow: "Manufacturing Philosophy",
    philTitle: "Modern bakery, made with intent",
    philDesc:
      "We focus on modern bakery products with a cleaner ingredient direction where suitable. Specific formulations depend on the product brief and are subject to recipe testing and shelf-life requirements.",
    philosophyPoints: [
      "Modern bakery products built for today’s retail and foodservice demand",
      "A cleaner ingredient direction where suitable",
      "Natural ingredients where suitable for the product and process",
      "Reduced unnecessary additives where suitable",
      "Recipe testing for quality and batch-to-batch consistency",
    ],
    locationLabel: "Location",
    ctaEyebrow: "Work With Us",
    ctaTitle: "Let’s build your bakery product",
    ctaText:
      "Explore how Al Shehail can develop and manufacture your product under your own brand.",
  },
  ar: {
    heroEyebrow: "عن الشهيل",
    heroTitle: "شريك تصنيع مخبوزات مقره الإمارات",
    heroSubtitle:
      "الشهيل للصناعات الغذائية شركة تصنيع مخبوزات مقرها الإمارات، متخصصة في المخبوزات الحديثة وإنتاج العلامة الخاصة وتطوير المنتجات لأسواق التجزئة والمؤسسات.",
    explorePl: "استكشف العلامة الخاصة",
    contactUs: "تواصل معنا",
    whoEyebrow: "من نحن",
    whoTitle: "مصنّع مخبوزات مبني حول العلامات التجارية",
    whoDesc:
      "الشهيل للصناعات الغذائية مصنّع مخبوزات مقره الإمارات بتوجه إنتاج حديث يميل إلى الصحة. نجمع بين تطوير المنتجات والتصنيع ودعم العلامة الخاصة تحت شريك واحد — لخدمة أسواق التجزئة والمؤسسات.",
    whoCards: [
      "مصنّع مخبوزات مقره الإمارات",
      "توجه تصنيع حديث وصحي",
      "تطوير + إنتاج + علامة خاصة",
      "تركيز على أسواق التجزئة والمؤسسات",
    ],
    diffEyebrow: "ما الذي يميّزنا",
    diffTitle: "أكثر من مجرد خط إنتاج مخبوزات",
    differentiators: [
      {
        title: "عقلية تطوير المنتج",
        text: "نتعامل مع كل طلب كمنتج يُطوَّر، لا كمجرد أمر يُنفَّذ.",
      },
      {
        title: "دعم التصنيع بعلامة خاصة",
        text: "دعم مخصّص للعلامات التي تبني تشكيلات مخبوزات تحت علامتها الخاصة.",
      },
      {
        title: "تفكير إنتاجي مهيأ للرف",
        text: "منتجات مصمَّمة لمدة الصلاحية والتغليف والعرض منذ البداية.",
      },
      {
        title: "تخصيص مرن للمنتجات",
        text: "وصفات وأشكال وتغليف تُكيَّف حسب السوق المستهدف وطلب العلامة.",
      },
      {
        title: "عملية محكومة الجودة",
        text: "عملية منظّمة محكومة النظافة مع فحوصات عبر مراحل الإنتاج.",
      },
    ],
    philEyebrow: "فلسفة التصنيع",
    philTitle: "مخبوزات حديثة، مصنوعة بقصد",
    philDesc:
      "نركّز على المخبوزات الحديثة بتوجه مكوّنات أنظف حيثما يناسب. تعتمد التركيبات المحددة على طلب المنتج وتخضع لاختبار الوصفة ومتطلبات مدة الصلاحية.",
    philosophyPoints: [
      "مخبوزات حديثة مصممة لطلب التجزئة وخدمات الطعام اليوم",
      "توجه مكوّنات أنظف حيثما يناسب",
      "مكوّنات طبيعية حيثما تناسب المنتج والعملية",
      "تقليل الإضافات غير الضرورية حيثما يناسب",
      "اختبار الوصفة لضمان الجودة والثبات بين الدفعات",
    ],
    locationLabel: "الموقع",
    ctaEyebrow: "اعمل معنا",
    ctaTitle: "لنبنِ منتجك من المخبوزات",
    ctaText:
      "اكتشف كيف يمكن للشحيل تطوير وتصنيع منتجك تحت علامتك الخاصة.",
  },
} as const;

export default function AboutPage({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <>
      <Header locale={locale} />
      <main>
        <PageHero
          eyebrow={t.heroEyebrow}
          title={t.heroTitle}
          subtitle={t.heroSubtitle}
          backgroundImage={generatedAssets.pageHeaders.about}
        >
          <Link href={localeHref("/private-label", locale)} className="btn-primary">
            {t.explorePl}
          </Link>
          <Link href={localeHref("/contact", locale)} className="btn-secondary">
            {t.contactUs}
          </Link>
        </PageHero>

        {/* About */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              align="left"
              eyebrow={t.whoEyebrow}
              title={t.whoTitle}
              description={t.whoDesc}
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.whoCards.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-sand bg-cream p-5 text-sm font-medium text-charcoal"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Differentiators */}
        <section className="section">
          <div className="container-x">
            <SectionHeading eyebrow={t.diffEyebrow} title={t.diffTitle} />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {t.differentiators.map((d, i) => {
                const Icon = icons[i];
                return (
                  <div
                    key={d.title}
                    className="rounded-2xl border border-sand bg-warmwhite p-6 shadow-card"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-beige text-gold">
                      <Icon width={22} height={22} />
                    </span>
                    <h3 className="mt-5 font-serif text-lg font-semibold text-ink">
                      {d.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">
                      {d.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Manufacturing philosophy */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <SectionHeading
                align="left"
                eyebrow={t.philEyebrow}
                title={t.philTitle}
                description={t.philDesc}
              />
              <ul className="space-y-3">
                {t.philosophyPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 rounded-2xl border border-sand bg-cream p-4 text-sm text-charcoal"
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-beige text-gold">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="section">
          <div className="container-x">
            <div className="flex flex-col items-start gap-4 rounded-2xl border border-sand bg-cream p-7 sm:flex-row sm:items-center sm:gap-6">
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gold-gradient text-white shadow-card">
                <RetailIcon width={22} height={22} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  {t.locationLabel}
                </p>
                <p className="mt-1 font-serif text-lg font-semibold text-ink">
                  {company.location[locale]}
                </p>
              </div>
            </div>
          </div>
        </section>

        <CtaBand
          eyebrow={t.ctaEyebrow}
          title={t.ctaTitle}
          text={t.ctaText}
          primary={{ label: t.explorePl, href: localeHref("/private-label", locale) }}
          secondary={{ label: t.contactUs, href: localeHref("/contact", locale) }}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
