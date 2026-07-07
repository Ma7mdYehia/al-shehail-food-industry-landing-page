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
  PackagingIcon,
  DevelopIcon,
  RetailIcon,
  ProductionIcon,
  CalendarIcon,
  ShieldCheckIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: {
    absolute: "التغليف وتصميم العلامة | الشحيل للصناعات الغذائية",
  },
  description:
    "دعم تغليف وتصميم علامة للمنتجات الغذائية، يساعد المنتج على الظهور بوضوح في قنوات البيع مع رسائل مناسبة للعميل والسوق.",
  alternates: { canonical: "/services/brand-design" },
};

const coverage = [
  {
    title: "توجيه بصري للتغليف",
    description:
      "توجيه شكل العبوة بما يناسب فئة المنتج، طبيعة العميل، وبيئة البيع.",
    Icon: PackagingIcon,
  },
  {
    title: "تسمية المنتج وتنظيم التشكيلة",
    description:
      "تنظيم أسماء المنتجات والأصناف بطريقة سهلة الفهم على الرف أو في المتجر الإلكتروني.",
    Icon: DevelopIcon,
  },
  {
    title: "رسائل واجهة العبوة",
    description:
      "تحديد أهم الرسائل التي يجب أن تظهر للعميل بوضوح دون ازدحام في التصميم.",
    Icon: RetailIcon,
  },
  {
    title: "جاهزية الرف",
    description:
      "توجيه تصميم يراعي وضوح المنتج، تمييز النكهات، وسهولة التعرف على العلامة.",
    Icon: ProductionIcon,
  },
  {
    title: "دعم العلامة الخاصة",
    description:
      "تغليف متصل بمسار التصنيع، بحيث يخدم المنتج والعلامة في نفس الوقت.",
    Icon: CalendarIcon,
  },
  {
    title: "مراجعة قصة المنتج",
    description:
      "توجيه رسائل محافظة وواضحة حتى لا تُستخدم ادعاءات غير دقيقة أو غير موثقة.",
    Icon: ShieldCheckIcon,
  },
];

const process = [
  {
    title: "فهم المنتج",
    text: "نفهم نوع المنتج، الفئة، العميل المستهدف، وحالة الاستخدام في السوق.",
  },
  {
    title: "تحديد التموضع",
    text: "نحدد كيف يجب أن يظهر المنتج: عائلي، صحي، فاخر، تقليدي، أو عملي للاستخدام اليومي.",
  },
  {
    title: "بناء رسائل العبوة",
    text: "ننظم المعلومات الأساسية مثل اسم المنتج، النوع، النكهة، الاستخدام، والبيانات المطلوبة.",
  },
  {
    title: "توجيه الشكل البصري",
    text: "نحدد اتجاه الألوان، الصور، الخطوط، وترتيب العناصر بما يخدم المنتج والرف.",
  },
  {
    title: "تجهيز العرض النهائي",
    text: "نجهز توجيهًا واضحًا يساعد في الطباعة، الإنتاج، والعرض في قنوات البيع.",
  },
];

const deliverables = [
  "توجيه تغليف المنتج",
  "بنية رسائل العبوة",
  "تنظيم تشكيلة المنتجات",
  "تسمية الأصناف وتمييز النكهات",
  "توجيه واجهة العبوة",
  "توجيه مرئيات الإطلاق",
  "أصول عرض مناسبة للتجزئة",
  "عرض علامة مناسب للتصنيع بعلامة خاصة",
];

const categories = [
  "خبز صحي ومنتجات مخبوزات وظيفية",
  "خبز مسطح ولفائف",
  "توست، كعك، وخبز طري",
  "كرواسان ومعجنات",
  "معمول، تمرية، وبسكويت قائم على التمر",
  "منتجات تجزئة بعلامة خاصة",
];

const related = [
  {
    title: "تصنيع العلامة الخاصة",
    description:
      "طوّر وصنّع منتجات مخبوزات باسم علامتك، من الفكرة إلى المنتج النهائي.",
    href: "/private-label",
  },
  {
    title: "التوزيع والوصول للتجزئة",
    description:
      "تنسيق حركة المنتج الجاهز نحو قنوات البيع المختارة.",
    href: "/services/distribution",
  },
  {
    title: "التسويق الرقمي الغذائي",
    description:
      "توجيه محتوى ورسائل إطلاق تساعد منتجك الغذائي على الوصول بوضوح.",
    href: "/services/digital-marketing",
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

export default function BrandDesignPage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero */}
        <PageHero
          eyebrow="الخدمات · التغليف"
          title="التغليف وتصميم العلامة"
          subtitle="نساعدك على تحويل المنتج إلى عبوة واضحة ومناسبة للسوق، من الرسائل الأساسية إلى الشكل الذي يظهر أمام العميل."
        >
          <a href="/contact" className="btn-primary">
            ابدأ مشروع تغليف
          </a>
          <a href="/private-label" className="btn-secondary">
            استعرض تصنيع العلامة الخاصة
          </a>
        </PageHero>

        {/* 2. Intro */}
        <section className="section">
          <div className="container-x">
            <div className="max-w-3xl">
              <SectionHeading
                align="left"
                eyebrow="نظرة عامة"
                title="التغليف ليس شكلًا فقط — هو طريقة تقديم المنتج"
                description="من تموضع المنتج إلى رسائل العبوة، تدعم الشحيل العلامات الغذائية في تجهيز تغليف واضح يساعد العميل على فهم المنتج ويخدم حضوره في قنوات البيع."
              />
            </div>
          </div>
        </section>

        {/* 3. What the service covers */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <ServiceFeatureGrid
              eyebrow="ما ندعمه"
              title="دعم التغليف وعرض العلامة"
              description="توجيه عملي مبني حول المنتج الغذائي، العميل، وقناة البيع."
              items={coverage}
            />
          </div>
        </section>

        {/* 4. Brand design process */}
        <section className="section border-y border-sand/50 bg-beige/40">
          <div className="container-x">
            <ServiceProcess
              eyebrow="كيف نعمل"
              title="من فهم المنتج إلى عبوة جاهزة للعرض"
              description="مسار واضح يساعد على تنظيم الفكرة، الرسائل، والشكل البصري قبل التنفيذ."
              steps={process}
            />
          </div>
        </section>

        {/* 5. What we can help design */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              eyebrow="المخرجات"
              title="أين يمكننا المساعدة"
              description="دعم في تنظيم التغليف، رسائل المنتج، وطريقة عرض العلامة."
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
              title="فئات غذائية تناسبها هذه الخدمة"
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
              title="التغليف يتصل بباقي رحلة المنتج"
              description="يتكامل التغليف مع التصنيع والتوزيع والتسويق حتى يظهر المنتج بشكل مناسب من خط الإنتاج إلى العميل النهائي."
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
                  قبل الطباعة النهائية
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone">
                  يجب اعتماد ادعاءات التغليف، البيانات الغذائية، الإشارات إلى
                  المكونات، وتفاصيل الامتثال بناءً على مواصفات منتج موثقة
                  ومتطلبات السوق قبل الطباعة.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Final CTA */}
        <CtaBand
          eyebrow="جاهز للعرض"
          title="تحتاج تغليفًا يشرح المنتج بوضوح؟"
          text="تحدّث مع الشحيل عن توجيه التغليف، عرض العلامة، ورسائل المنتج الغذائي."
          primary={{ label: "ابدأ مشروع تغليف", href: "/contact" }}
          secondary={{ label: "استعرض المنتجات", href: "/products" }}
        />
      </main>
      <Footer />
    </>
  );
}
