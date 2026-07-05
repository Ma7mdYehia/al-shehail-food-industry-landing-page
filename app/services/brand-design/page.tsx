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
    "دعم تغليف وعرض علامة مخصَّص للأغذية، للمنتجات المتحرّكة من الإنتاج إلى رفوف التجزئة — توجيه تغليف متصل بمشاريع التصنيع بعلامة خاصة.",
  alternates: { canonical: "/services/brand-design" },
};

const coverage = [
  {
    title: "توجيه بصري للتغليف",
    description:
      "توجيه بصري لتغليف الأغذية يتناسب مع فئة المنتج والجمهور وبيئة التجزئة.",
    Icon: PackagingIcon,
  },
  {
    title: "تسمية المنتج وبنية التشكيلة",
    description:
      "دعم تنظيم أسماء المنتجات والأصناف ومنطق التشكيلة بطريقة واضحة للعميل.",
    Icon: DevelopIcon,
  },
  {
    title: "تواصل واجهة العبوة",
    description:
      "المساعدة على تحديد الرسائل الأساسية التي يجب أن تظهر بوضوح على العبوة دون إثقال التصميم.",
    Icon: RetailIcon,
  },
  {
    title: "تصميم عبوة جاهز للرف",
    description:
      "توجيه تصميم يراعي الحضور على الرف، والوضوح، والتسلسل، وسهولة التعرّف على المنتج.",
    Icon: ProductionIcon,
  },
  {
    title: "دعم تغليف العلامة الخاصة",
    description:
      "دعم تغليف للعلامات التي تطوّر منتجاتها مع فريق التصنيع لدى الشحيل.",
    Icon: CalendarIcon,
  },
  {
    title: "مراجعة قصة المنتج وادعاءاته",
    description:
      "إرشاد تواصل محافظ لتجنّب ادعاءات منتج غير واضحة أو غير مدعومة.",
    Icon: ShieldCheckIcon,
  },
];

const process = [
  {
    title: "فهم المنتج",
    text: "فهم نوع المنتج، والعميل المستهدف، والفئة، وحالة الاستخدام في التجزئة.",
  },
  {
    title: "توجيه التموضع",
    text: "تحديد كيفية عرض المنتج: صحي، راقٍ، تقليدي، عائلي، وظيفي، قائم على التمر، أو معجنات.",
  },
  {
    title: "بنية العبوة",
    text: "تنظيم تسلسل العبوة: اسم المنتج، الصنف، الفوائد، النكهة/النوع، الاستخدام، والمعلومات المطلوبة.",
  },
  {
    title: "توجيه التصميم البصري",
    text: "تطوير الشكل والطابع البصري للتغليف، بما يشمل الألوان، والخطوط، والصور، ونظام التخطيط.",
  },
  {
    title: "التسليم الجاهز للرف",
    text: "تجهيز توجيه التصميم ومنطق التواصل لدعم الطباعة والإنتاج والعرض في التجزئة.",
  },
];

const deliverables = [
  "توجيه تغليف المنتج",
  "تسلسل تواصل الملصق والعبوة",
  "نظام تشكيلة المنتج",
  "تسمية الأصناف والترميز البصري",
  "بنية رسائل واجهة العبوة",
  "توجيه مرئيات الإطلاق على وسائل التواصل",
  "توجيه أصول العرض في التجزئة",
  "عرض علامة للتصنيع بعلامة خاصة",
];

const categories = [
  "خبز صحي ومنتجات مخبوزات وظيفية",
  "خبز مسطح ولفائف",
  "توست، وكعك، وخبز طري",
  "كرواسان ومعجنات",
  "معمول، وتمرية، وبسكويت، وحلويات قائمة على التمر",
  "منتجات تجزئة بعلامة خاصة",
];

const related = [
  {
    title: "تصنيع العلامة الخاصة",
    description:
      "طوّر وصنّع منتجات مخبوزات تحت علامتك، من الفكرة إلى الرف.",
    href: "/private-label",
  },
  {
    title: "أسطول التوزيع والوصول للتجزئة",
    description:
      "تنسيق توزيع ينقل المنتجات الجاهزة نحو التجزئة.",
    href: "/services/distribution",
  },
  {
    title: "التسويق الرقمي الغذائي",
    description:
      "دعم تسويق رقمي يساعد منتجاتك الغذائية على التواصل عبر الإنترنت.",
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
          eyebrow="الخدمات · تصميم العلامة"
          title="التغليف وتصميم العلامة"
          subtitle="دعم تغليف وعرض علامة مخصَّص للأغذية، للمنتجات المتحرّكة من الإنتاج إلى رفوف التجزئة."
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
                title="أكثر من شعار — تغليف يتحدّث"
                description="من تموضع المنتج إلى تواصل العبوة، تدعم الشحيل العلامات الغذائية بتوجيه تغليف وتصميم علامة يربط بين التصنيع، والعرض في التجزئة، وفهم العميل."
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
              description="توجيه تصميم مبني حول المنتجات الغذائية، ورفوف التجزئة، والتواصل الواضح مع العميل."
              items={coverage}
            />
          </div>
        </section>

        {/* 4. Brand design process */}
        <section className="section border-y border-sand/50 bg-beige/40">
          <div className="container-x">
            <ServiceProcess
              eyebrow="كيف نعمل"
              title="مسار واضح من المنتج إلى العبوة"
              description="مسار بسيط مبني على التوجيه، من فهم المنتج إلى التسليم الجاهز للرف."
              steps={process}
            />
          </div>
        </section>

        {/* 5. What we can help design */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              eyebrow="المخرجات"
              title="ما يمكننا المساعدة في تصميمه"
              description="دعم وتوجيه وتجهيز تصميم عبر التغليف وعرض العلامة."
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
              title="تصميم العلامة يتصل بمنظومة الخدمات الأوسع"
              description="يعمل التغليف وتصميم العلامة جنبًا إلى جنب مع التصنيع والتوزيع والتسويق، حتى يصبح المنتج جاهزًا للإنتاج والرف."
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
                  يجب اعتماد ادعاءات التغليف، والبيانات الغذائية، والإشارات إلى
                  المكونات، وتفاصيل الامتثال مقابل مواصفات منتج موثّقة ومتطلبات
                  السوق قبل الطباعة النهائية.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Final CTA */}
        <CtaBand
          eyebrow="مصمَّم للرف"
          title="تحتاج تغليفًا يناسب المنتج والرف؟"
          text="تحدّث مع الشحيل عن توجيه التغليف، وعرض العلامة الخاصة، وتواصل المنتج الغذائي الجاهز للرف."
          primary={{ label: "ابدأ مشروع تغليف", href: "/contact" }}
          secondary={{ label: "استعرض المنتجات", href: "/products" }}
        />
      </main>
      <Footer />
    </>
  );
}
