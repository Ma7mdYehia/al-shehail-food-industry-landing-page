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
  RetailIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ProductionIcon,
  DevelopIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: {
    absolute: "أسطول التوزيع والوصول للتجزئة | الشحيل للصناعات الغذائية",
  },
  description:
    "من منتجات مخبوزات جاهزة إلى حركة جاهزة للرف، تدعم الشحيل العلامات بتنسيق التوزيع بعد الإنتاج — يُحدَّد مسار الوصول للسوق وتخطيط التسليم لكل مشروع.",
  alternates: { canonical: "/services/distribution" },
};

const coverage = [
  {
    title: "حركة المنتج النهائي",
    description:
      "دعم نقل منتجات المخبوزات الجاهزة للرف بعد الإنتاج.",
    Icon: PackagingIcon,
  },
  {
    title: "تنسيق قنوات التجزئة",
    description:
      "المساعدة على تنظيم تدفق المنتج نحو قنوات التجزئة والبيع المختارة.",
    Icon: RetailIcon,
  },
  {
    title: "تخطيط التسليم",
    description:
      "تنسيق حول جاهزية المنتج، وتوقيت الشحن، ومتطلبات المسار.",
    Icon: CalendarIcon,
  },
  {
    title: "وعي بالتعامل مع المنتج",
    description:
      "تفكير توزيعي مبني حول منتجات المخبوزات، وحالة التغليف، ومتطلبات الطزاجة.",
    Icon: ShieldCheckIcon,
  },
  {
    title: "دعم الإطلاق والتزويد المتكرر",
    description:
      "مفيد لإطلاق المنتجات، والتوريد المتكرر، والانتشار المضبوط في السوق.",
    Icon: ProductionIcon,
  },
  {
    title: "مسار السوق للعلامة الخاصة",
    description:
      "دعم توزيع يتصل بمشاريع التصنيع بعلامة خاصة.",
    Icon: DevelopIcon,
  },
];

const process = [
  {
    title: "المنتج جاهز",
    text: "يُعتمَد المنتج النهائي بعد الإنتاج والتعبئة.",
  },
  {
    title: "تخطيط الشحن",
    text: "تُنظَّم الكميات والتوقيت ومتطلبات التسليم.",
  },
  {
    title: "تنسيق المسار",
    text: "يُخطَّط تحرّك التوزيع بناءً على الوجهة ومتطلبات القناة.",
  },
  {
    title: "دعم التسليم للتجزئة",
    text: "تتحرّك المنتجات نحو نقاط التجزئة المختارة أو القنوات المتفَق عليها.",
  },
  {
    title: "المتابعة",
    text: "يستمر التنسيق حول إيقاع التوريد، والتزويد المتكرر، واحتياجات الإطلاق.",
  },
];

const audience = [
  "علامات غذائية تطلق منتجات مخبوزات",
  "عملاء العلامة الخاصة",
  "علامات خبز صحي",
  "أصحاب منتجات مخبوزات للتجزئة",
  "علامات حلويات التمر والمعجنات",
  "علامات تحتاج دعم إنتاج وتوزيع من شريك واحد",
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
      "دعم التغليف وعرض العلامة للمنتجات الجاهزة للرف.",
    href: "/services/brand-design",
  },
  {
    title: "التسويق الرقمي الغذائي",
    description:
      "دعم تسويق رقمي يساعد منتجاتك الغذائية على التواصل عبر الإنترنت.",
    href: "/services/digital-marketing",
  },
];

export default function DistributionPage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero */}
        <PageHero
          eyebrow="الخدمات · التوزيع"
          title="أسطول التوزيع والوصول للتجزئة"
          subtitle="من منتجات مخبوزات جاهزة إلى حركة جاهزة للرف، تدعم الشحيل العلامات بتنسيق التوزيع بعد الإنتاج."
        >
          <a href="/contact" className="btn-primary">
            ابدأ مشروع توزيع
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
                title="الإنتاج هو البداية، لا النهاية"
                description="بعد التصنيع، يكمن التحدي التالي في تجهيز المنتجات وتنظيمها ونقلها إلى قنوات التجزئة الصحيحة. دعم التوزيع لدى الشحيل يساعد العلامات الغذائية على ربط الإنتاج بالتنفيذ في التجزئة."
              />
            </div>
          </div>
        </section>

        {/* 3. What the service covers */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <ServiceFeatureGrid
              eyebrow="ما ندعمه"
              title="دعم توزيع بعد الإنتاج"
              description="دعم عملي وتشغيلي يربط المنتجات الجاهزة بالمسار الصحيح نحو السوق."
              items={coverage}
            />
          </div>
        </section>

        {/* 4. Process */}
        <section className="section border-y border-sand/50 bg-beige/40">
          <div className="container-x">
            <ServiceProcess
              eyebrow="كيف نعمل"
              title="مسار واضح من جاهزية المنتج إلى التجزئة"
              description="مسار تنسيق بسيط يبقي المنتج الجاهز متحركًا نحو سوقه."
              steps={process}
            />
          </div>
        </section>

        {/* 5. Who this service is for */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              eyebrow="لمن هذه الخدمة"
              title="مبنية للعلامات التي تحتاج أكثر من الإنتاج"
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {audience.map((a) => (
                <div
                  key={a}
                  className="rounded-2xl border border-sand bg-cream p-5 font-serif text-base font-semibold text-charcoal"
                >
                  {a}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Integration with other services */}
        <section className="section border-y border-sand/50 bg-beige/30">
          <div className="container-x">
            <ServiceRelatedServices
              eyebrow="شريك واحد متكامل"
              title="التوزيع يتصل بمنظومة الخدمات الأوسع"
              description="يعمل التوزيع جنبًا إلى جنب مع التصنيع والتغليف والتسويق، حتى تتحرك علامتك من الفكرة إلى السوق مع شريك واحد."
              items={related}
            />
          </div>
        </section>

        {/* 7. Trust / careful claims note */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <div className="mx-auto flex max-w-3xl items-start gap-4 rounded-2xl border border-champagne/40 bg-cream p-6 sm:p-7">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-beige text-gold">
                <ShieldCheckIcon width={18} height={18} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                  كيف يُحدَّد النطاق
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone">
                  يُحدَّد نطاق التوزيع، وقنوات التجزئة، وجدول التسليم، والتغطية
                  لكل مشروع بناءً على نوع المنتج والكمية والتغليف ومتطلبات
                  السوق.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Final CTA */}
        <CtaBand
          eyebrow="ما بعد الإنتاج"
          title="جاهز لنقل منتجك إلى ما بعد الإنتاج؟"
          text="تحدّث مع الشحيل عن دعم الإنتاج والتعبئة والتوزيع لعلامتك الغذائية."
          primary={{ label: "ابدأ مشروعك", href: "/contact" }}
          secondary={{ label: "استعرض المنتجات", href: "/products" }}
        />
      </main>
      <Footer />
    </>
  );
}
