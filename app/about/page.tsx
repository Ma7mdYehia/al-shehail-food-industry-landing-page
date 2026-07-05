import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/SectionHeading";
import { company } from "@/lib/content";
import {
  DevelopIcon,
  PackagingIcon,
  RetailIcon,
  ProductionIcon,
  ShieldCheckIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: { absolute: "عن الشحيل للصناعات الغذائية | تصنيع مخبوزات في الإمارات" },
  description:
    "تعرّف على الشحيل للصناعات الغذائية، شريك تصنيع مخبوزات وعلامات خاصة مقرّه الإمارات، يدعم تطوير المنتجات والإنتاج المعتمد والتوريد الجاهز للرف.",
  alternates: { canonical: "/about" },
};

const differentiators = [
  {
    title: "عقلية تطوير المنتجات",
    text: "نتعامل مع كل طلب باعتباره منتجًا نطوّره، لا مجرد أمر ننفّذه.",
    Icon: DevelopIcon,
  },
  {
    title: "دعم تصنيع العلامة الخاصة",
    text: "دعم مخصَّص للعلامات التي تبني تشكيلات مخبوزات تحت اسمها الخاص.",
    Icon: PackagingIcon,
  },
  {
    title: "تفكير إنتاجي جاهز للرف",
    text: "منتجات مصمَّمة منذ البداية للعمر التخزيني والتغليف والعرض في التجزئة.",
    Icon: RetailIcon,
  },
  {
    title: "تخصيص مرن للمنتج",
    text: "وصفات وأشكال وتغليف تتكيّف مع السوق المستهدف وطلب العلامة.",
    Icon: ProductionIcon,
  },
  {
    title: "عملية خاضعة لرقابة الجودة",
    text: "عملية منظمة وخاضعة لمعايير النظافة، مع فحوصات عبر مراحل الإنتاج.",
    Icon: ShieldCheckIcon,
  },
];

const philosophyPoints = [
  "منتجات مخبوزات عصرية مبنية لتلبية طلب التجزئة وقطاع المطاعم اليوم",
  "توجه نحو مكونات أنظف حيثما يكون ذلك مناسبًا",
  "مكونات طبيعية حيثما يكون ذلك مناسبًا للمنتج والعملية",
  "تقليل الإضافات غير الضرورية حيثما يكون ذلك مناسبًا",
  "اختبار الوصفات لضمان الجودة والثبات بين الدفعات",
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="عن الشحيل"
          title="شريك تصنيع مخبوزات مقرّه الإمارات"
          subtitle="الشحيل للصناعات الغذائية شركة تصنيع مخبوزات مقرّها الإمارات، متخصصة في منتجات مخبوزات عصرية، وإنتاج بعلامة خاصة، وتطوير منتجات لأسواق التجزئة والقطاع المؤسسي."
        >
          <Link href="/private-label" className="btn-primary">
            استعرض العلامة الخاصة
          </Link>
          <Link href="/contact" className="btn-secondary">
            تواصل معنا
          </Link>
        </PageHero>

        {/* About */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              align="left"
              eyebrow="من نحن"
              title="مصنّع مخبوزات مبني حول العلامات التجارية"
              description="الشحيل للصناعات الغذائية مصنّع مخبوزات مقرّه الإمارات، بتوجه إنتاجي عصري يميل نحو الصحة. نجمع بين تطوير المنتج والتصنيع ودعم العلامة الخاصة تحت شريك واحد — نخدم أسواق التجزئة والقطاع المؤسسي."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "مصنّع مخبوزات مقرّه الإمارات",
                "توجه تصنيع عصري وصحي",
                "تطوير + إنتاج + علامة خاصة",
                "تركيز على أسواق التجزئة والقطاع المؤسسي",
              ].map((item) => (
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
            <SectionHeading
              eyebrow="ما يميّزنا"
              title="أكثر من مجرد خط إنتاج مخبوزات"
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {differentiators.map((d) => (
                <div
                  key={d.title}
                  className="rounded-2xl border border-sand bg-warmwhite p-6 shadow-card"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-beige text-gold">
                    <d.Icon width={22} height={22} />
                  </span>
                  <h3 className="mt-5 font-serif text-lg font-semibold text-ink">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    {d.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Manufacturing philosophy */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <SectionHeading
                align="left"
                eyebrow="فلسفة التصنيع"
                title="مخبوزات عصرية، بنيّة واضحة"
                description="نركّز على منتجات مخبوزات عصرية بتوجه مكونات أنظف حيثما يكون ذلك مناسبًا. تعتمد التركيبات المحددة على طلب المنتج وتخضع لاختبار الوصفة ومتطلبات العمر التخزيني."
              />
              <ul className="space-y-3">
                {philosophyPoints.map((point) => (
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
                  الموقع
                </p>
                <p className="mt-1 font-serif text-lg font-semibold text-ink">
                  {company.location}
                </p>
              </div>
            </div>
          </div>
        </section>

        <CtaBand
          eyebrow="اعمل معنا"
          title="لنبنِ منتجك من المخبوزات"
          text="اكتشف كيف يمكن للشحيل تطوير وتصنيع منتجك تحت علامتك الخاصة."
          primary={{ label: "استعرض العلامة الخاصة", href: "/private-label" }}
          secondary={{ label: "تواصل معنا", href: "/contact" }}
        />
      </main>
      <Footer />
    </>
  );
}
