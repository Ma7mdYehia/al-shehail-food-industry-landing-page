import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/SectionHeading";
import ServiceFeatureGrid from "@/components/services/ServiceFeatureGrid";
import ServiceProcess from "@/components/services/ServiceProcess";
import ServiceRelatedServices from "@/components/services/ServiceRelatedServices";
import {
  CalendarIcon,
  RetailIcon,
  DevelopIcon,
  ProductionIcon,
  PackagingIcon,
  ShieldCheckIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: {
    absolute: "التسويق الرقمي الغذائي | الشحيل للصناعات الغذائية",
  },
  description:
    "دعم تسويق رقمي للمنتجات الغذائية، يساعد العلامات على التواصل بوضوح من إطلاق المنتج إلى الوعي الرقمي لدى العملاء — مبني على تفاصيل منتج موثّقة.",
  alternates: { canonical: "/services/digital-marketing" },
};

const coverage = [
  {
    title: "محتوى إطلاق المنتج",
    description:
      "توجيه حملات وتخطيط محتوى لإطلاق منتجات غذائية جديدة.",
    Icon: CalendarIcon,
  },
  {
    title: "تواصل عبر وسائل التواصل الاجتماعي",
    description:
      "رسائل منتج واضحة عبر إنستغرام وفيسبوك ولينكدإن وقنوات رقمية أخرى.",
    Icon: RetailIcon,
  },
  {
    title: "سرد قصة المنتج الغذائي",
    description:
      "تحويل مزايا المنتج، والمكونات، والعملية، والتغليف إلى محتوى موجَّه للعميل.",
    Icon: DevelopIcon,
  },
  {
    title: "توجيه حملات الأداء",
    description:
      "بنية تسويقية وتوجيه حملات للوعي، أو توليد العملاء المحتملين، أو دعم التجزئة.",
    Icon: ProductionIcon,
  },
  {
    title: "أصول منتج للتجزئة والإنترنت",
    description:
      "توجيه محتوى رقمي لصفحات المنتج، وقوائم المتاجر الإلكترونية، وتواصل التجزئة.",
    Icon: PackagingIcon,
  },
  {
    title: "دعم تسويق العلامة الخاصة",
    description:
      "دعم تسويقي للمنتجات المطوَّرة عبر خدمة التصنيع بعلامة خاصة لدى الشحيل.",
    Icon: ShieldCheckIcon,
  },
];

const process = [
  {
    title: "فهم المنتج",
    text: "فهم المنتج، والفئة، والمكونات، والعميل المستهدف، والتموضع في السوق.",
  },
  {
    title: "استراتيجية الرسائل",
    text: "تحديد رسائل المنتج الأساسية، والفوائد، وحالات الاستخدام، والقصة الموجَّهة للعميل.",
  },
  {
    title: "توجيه المحتوى",
    text: "تخطيط أشكال المحتوى اللازمة للإطلاق، ووسائل التواصل، والموقع، والتجزئة، أو الحملات المدفوعة.",
  },
  {
    title: "بنية الحملة",
    text: "تنظيم مسار الحملة: الوعي، أو تثقيف حول المنتج، أو دعم التجزئة، أو توليد العملاء المحتملين.",
  },
  {
    title: "توجيه المراجعة والتحسين",
    text: "مراجعة المحتوى وتوجيه الحملة بناءً على تغذية راجعة فعلية من السوق ومعلومات منتج موثّقة.",
  },
];

const deliverables = [
  "توجيه محتوى وسائل التواصل الاجتماعي",
  "تخطيط حملة الإطلاق",
  "سرد قصة المنتج",
  "توجيه نصوص صفحة المنتج",
  "توجيه محتوى قوائم المتاجر الإلكترونية",
  "بنية الحملات المدفوعة",
  "توجيه ملخص تصوير/فيديو للأغذية",
  "تواصل الترويج في التجزئة",
  "تواصل علامة للتصنيع بعلامة خاصة",
];

const categories = [
  "خبز صحي ومنتجات مخبوزات وظيفية",
  "خبز مسطح ولفائف",
  "توست، وكعك، وخبز طري",
  "كرواسان ومعجنات",
  "معمول، وتمرية، وبسكويت، وحلويات قائمة على التمر",
  "علامات غذائية بعلامة خاصة",
];

const related = [
  {
    title: "تصنيع العلامة الخاصة",
    description:
      "طوّر وصنّع منتجات مخبوزات تحت علامتك، من الفكرة إلى الرف.",
    href: "/private-label",
  },
  {
    title: "التغليف وتصميم العلامة",
    description:
      "توجيه تغليف مخصَّص للأغذية وعرض علامة للتجزئة.",
    href: "/services/brand-design",
  },
  {
    title: "أسطول التوزيع والوصول للتجزئة",
    description:
      "تنسيق توزيع ينقل المنتجات الجاهزة نحو التجزئة.",
    href: "/services/distribution",
  },
];

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function DigitalMarketingPage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero */}
        <PageHero
          eyebrow="الخدمات · التسويق الرقمي"
          title="التسويق الرقمي الغذائي"
          subtitle="دعم تسويق رقمي للمنتجات الغذائية، يساعد العلامات على التواصل بوضوح من إطلاق المنتج إلى الوعي الرقمي لدى العملاء."
        >
          <a href="/contact" className="btn-primary">
            ابدأ مشروع تسويق
          </a>
          <a href="/services/brand-design" className="btn-secondary">
            استعرض تصميم العلامة
          </a>
        </PageHero>

        {/* 2. Intro */}
        <section className="section">
          <div className="container-x">
            <div className="max-w-3xl">
              <SectionHeading
                align="left"
                eyebrow="نظرة عامة"
                title="من قصة الإنتاج إلى محتوى موجَّه للعميل"
                description="تدعم الشحيل العلامات الغذائية بتوجيه تسويق رقمي مبني حول تفاصيل منتج حقيقية، وتواصل تغليف، وجاهزية للتجزئة — لمرافقة المنتج من قصة الإنتاج إلى محتوى موجَّه للعميل."
              />
            </div>
          </div>
        </section>

        {/* 3. What the service covers */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <ServiceFeatureGrid
              eyebrow="ما ندعمه"
              title="دعم تسويق رقمي للمنتجات الغذائية"
              description="توجيه تسويقي مبني حول منتجات حقيقية وتغليف وجاهزية للتجزئة — لا محتوى عام."
              items={coverage}
            />
          </div>
        </section>

        {/* 4. Digital marketing process */}
        <section className="section border-y border-sand/50 bg-beige/40">
          <div className="container-x">
            <ServiceProcess
              eyebrow="كيف نعمل"
              title="مسار واضح من المنتج إلى الحملة"
              description="مسار بسيط مبني على التوجيه، من فهم المنتج إلى حملة منظَّمة."
              steps={process}
            />
          </div>
        </section>

        {/* 5. Marketing deliverables */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              eyebrow="المخرجات"
              title="أين يمكننا الدعم"
              description="توجيه، وتخطيط، وبنية محتوى عبر الإطلاق والتواصل الرقمي."
            />
            <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {deliverables.map((d) => (
                <li
                  key={d}
                  className="flex items-center gap-3 rounded-xl border border-sand bg-cream px-4 py-3 text-sm font-medium text-charcoal"
                >
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-beige text-gold">
                    <CheckIcon />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 6. Food categories this fits */}
        <section className="section border-y border-sand/50 bg-beige/30">
          <div className="container-x">
            <SectionHeading
              eyebrow="ملاءمة الفئة"
              title="الفئات الغذائية التي تناسبها هذه الخدمة"
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <div
                  key={c}
                  className="rounded-2xl border border-sand bg-warmwhite p-5 font-serif text-base font-semibold text-charcoal"
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Integration with other services */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <ServiceRelatedServices
              eyebrow="شريك واحد متكامل"
              title="التسويق يتصل بمنظومة الخدمات الأوسع"
              description="يعمل التسويق الرقمي جنبًا إلى جنب مع التصنيع والتغليف والتوزيع، حتى يُروى المنتج بوضوح بقدر ما يُصنع بإتقان."
              items={related}
            />
          </div>
        </section>

        {/* 8. Trust / careful claims note */}
        <section className="section border-y border-sand/50 bg-beige/30">
          <div className="container-x">
            <div className="mx-auto flex max-w-3xl items-start gap-4 rounded-2xl border border-champagne/40 bg-cream p-6 sm:p-7">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-beige text-gold">
                <ShieldCheckIcon width={18} height={18} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                  قبل التواصل العلني
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone">
                  يجب أن تستند الرسائل التسويقية، والبيانات الغذائية، وادعاءات
                  المنتج، والإشارات إلى المكونات، إلى مواصفات منتج موثّقة قبل
                  استخدامها في الحملات أو التواصل العلني.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Final CTA */}
        <CtaBand
          eyebrow="أطلق عبر الإنترنت"
          title="جاهز لإطلاق منتجك الغذائي عبر الإنترنت؟"
          text="تحدّث مع الشحيل عن تواصل المنتج، ومحتوى الإطلاق، ودعم التسويق الرقمي لعلامتك الغذائية."
          primary={{ label: "ابدأ مشروع تسويق", href: "/contact" }}
          secondary={{ label: "استعرض المنتجات", href: "/products" }}
        />
      </main>
      <Footer />
    </>
  );
}
