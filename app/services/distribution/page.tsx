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
    absolute: "التوزيع والوصول للتجزئة | الشحيل للصناعات الغذائية",
  },
  description:
    "دعم تنسيق توزيع منتجات المخبوزات بعد الإنتاج، من جاهزية المنتج والتعبئة إلى التخطيط للتوريد وقنوات البيع المختارة.",
  alternates: { canonical: "/services/distribution" },
};

const coverage = [
  {
    title: "حركة المنتج بعد الإنتاج",
    description:
      "تنسيق انتقال منتجات المخبوزات المعبأة بعد انتهاء الإنتاج والتجهيز.",
    Icon: PackagingIcon,
  },
  {
    title: "تنسيق قنوات البيع",
    description:
      "المساعدة في ترتيب مسار المنتج نحو قنوات التجزئة أو القنوات المتفق عليها.",
    Icon: RetailIcon,
  },
  {
    title: "تخطيط مواعيد التسليم",
    description:
      "تنسيق الكميات، الجاهزية، التوقيت، ومتطلبات كل مسار توريد.",
    Icon: CalendarIcon,
  },
  {
    title: "مراعاة طبيعة المخبوزات",
    description:
      "تعامل مبني على فهم الطزاجة، حالة التغليف، وحساسية منتجات المخبوزات.",
    Icon: ShieldCheckIcon,
  },
  {
    title: "دعم الإطلاق والتكرار",
    description:
      "مناسب لإطلاق منتجات جديدة أو لتوريد متكرر يحتاج تنظيمًا واضحًا.",
    Icon: ProductionIcon,
  },
  {
    title: "امتداد لمشاريع العلامة الخاصة",
    description:
      "خدمة توزيع مرتبطة بمسار التصنيع والتغليف للمنتجات بعلامتك.",
    Icon: DevelopIcon,
  },
];

const process = [
  {
    title: "اعتماد جاهزية المنتج",
    text: "يتم التأكد من جاهزية المنتج بعد الإنتاج والتعبئة.",
  },
  {
    title: "تخطيط الكمية والتوقيت",
    text: "نحدد الكميات المطلوبة، المواعيد، ومتطلبات التسليم.",
  },
  {
    title: "تنسيق مسار التوريد",
    text: "يُخطط المسار بناءً على الوجهة وطبيعة قناة البيع.",
  },
  {
    title: "دعم التسليم",
    text: "تتحرك المنتجات نحو نقاط البيع أو القنوات المتفق عليها.",
  },
  {
    title: "متابعة التوريد",
    text: "نحافظ على تواصل واضح حول الطلبات المتكررة واحتياجات الإطلاق.",
  },
];

const audience = [
  "علامات غذائية تطلق منتجات مخبوزات",
  "عملاء العلامة الخاصة",
  "علامات الخبز الصحي",
  "منتجات مخبوزات موجهة للتجزئة",
  "علامات حلويات التمر والمعجنات",
  "مشاريع تحتاج إنتاجًا وتوريدًا من شريك واحد",
];

const related = [
  {
    title: "تصنيع العلامة الخاصة",
    description:
      "طوّر وصنّع منتجات مخبوزات باسم علامتك، من الفكرة إلى المنتج النهائي.",
    href: "/private-label",
  },
  {
    title: "التغليف وتصميم العلامة",
    description:
      "دعم التغليف وعرض العلامة للمنتجات الجاهزة لقنوات البيع.",
    href: "/services/brand-design",
  },
  {
    title: "التسويق الرقمي الغذائي",
    description:
      "توجيه محتوى وتسويق رقمي يساعد منتجك الغذائي على الوصول بوضوح.",
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
          title="التوزيع والوصول للتجزئة"
          subtitle="بعد الإنتاج، نساعدك على تنظيم حركة المنتج الجاهز نحو قنوات البيع المختارة بطريقة واضحة ومناسبة لطبيعة المخبوزات."
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
                title="الإنتاج خطوة مهمة، لكن الوصول للسوق لا يقل أهمية"
                description="بعد تصنيع المنتج وتغليفه، تبدأ مرحلة تنظيم الحركة والتوريد. تساعد الشحيل العلامات الغذائية على ربط الإنتاج بقنوات البيع من خلال تنسيق واضح للتسليم والتوزيع."
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
              description="دعم عملي يربط المنتج الجاهز بالمسار المناسب نحو السوق."
              items={coverage}
            />
          </div>
        </section>

        {/* 4. Process */}
        <section className="section border-y border-sand/50 bg-beige/40">
          <div className="container-x">
            <ServiceProcess
              eyebrow="كيف نعمل"
              title="من جاهزية المنتج إلى قناة البيع"
              description="مسار تنسيق بسيط يحافظ على وضوح الكمية، التوقيت، والوجهة."
              steps={process}
            />
          </div>
        </section>

        {/* 5. Who this service is for */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              eyebrow="لمن هذه الخدمة"
              title="للمنتجات التي تحتاج أكثر من التصنيع"
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
              title="التوزيع جزء من منظومة الخدمة الكاملة"
              description="يتكامل التوزيع مع التصنيع والتغليف والتسويق حتى يتحرك المنتج من الفكرة إلى السوق ضمن مسار واحد."
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
                  يُحدَّد نطاق التوزيع، قنوات البيع، جدول التسليم، والتغطية لكل
                  مشروع بحسب نوع المنتج، الكمية، التغليف، ومتطلبات السوق.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Final CTA */}
        <CtaBand
          eyebrow="ما بعد الإنتاج"
          title="هل منتجك جاهز للمرحلة التالية؟"
          text="تحدّث مع الشحيل عن التصنيع، التعبئة، والتوزيع المناسب لعلامتك الغذائية."
          primary={{ label: "ابدأ مشروعك", href: "/contact" }}
          secondary={{ label: "استعرض المنتجات", href: "/products" }}
        />
      </main>
      <Footer />
    </>
  );
}
