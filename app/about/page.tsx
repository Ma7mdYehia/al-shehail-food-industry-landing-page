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
    "تعرّف على الشحيل للصناعات الغذائية، شريك إماراتي لتصنيع المخبوزات وحلول العلامة الخاصة، يدعم تطوير المنتجات والتصنيع والتغليف والتوريد.",
  alternates: { canonical: "/about" },
};

const differentiators = [
  {
    title: "تفكير يبدأ من المنتج",
    text: "نتعامل مع كل طلب كمنتج يحتاج فهمًا وتطويرًا، وليس كأمر إنتاج فقط.",
    Icon: DevelopIcon,
  },
  {
    title: "دعم للعلامات الخاصة",
    text: "نساعد العلامات الغذائية على بناء منتجات مخبوزات تحمل اسمها وتناسب سوقها.",
    Icon: PackagingIcon,
  },
  {
    title: "جاهزية للسوق من البداية",
    text: "نراعي التغليف، العمر التخزيني، وطريقة العرض قبل الوصول إلى مرحلة الإنتاج.",
    Icon: RetailIcon,
  },
  {
    title: "مرونة في الوصفة والشكل",
    text: "نطوّر الوصفة والحجم والتغليف بما يناسب الفئة وقناة البيع المستهدفة.",
    Icon: ProductionIcon,
  },
  {
    title: "عملية تحت رقابة واضحة",
    text: "نلتزم بسير عمل منظم وفحوصات جودة خلال مراحل الإنتاج والتعبئة.",
    Icon: ShieldCheckIcon,
  },
];

const philosophyPoints = [
  "منتجات مخبوزات عصرية تناسب طلب التجزئة وقطاع المطاعم",
  "توجه نحو مكونات أنظف عندما يسمح المنتج وعملية التصنيع بذلك",
  "وصفات تُراجع وفق الطعم والقوام والعمر التخزيني المطلوب",
  "تقليل الإضافات غير الضرورية متى كان ذلك مناسبًا تقنيًا",
  "اختبار المنتج قبل التوسع للحفاظ على الثبات بين الدفعات",
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="عن الشحيل"
          title="مصنّع مخبوزات إماراتي يخدم العلامات الغذائية"
          subtitle="الشحيل للصناعات الغذائية شركة تصنيع مخبوزات في الإمارات، متخصصة في تطوير منتجات مخبوزات عصرية وحلول علامة خاصة لأسواق التجزئة والقطاع المؤسسي."
        >
          <Link href="/private-label" className="btn-primary">
            استعرض حلول العلامة الخاصة
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
              title="شريك تصنيع مبني حول احتياج العلامة"
              description="في الشحيل، نربط بين تطوير المنتج والتصنيع والتغليف ضمن مسار واحد واضح. نعمل مع علامات غذائية تبحث عن منتجات مخبوزات قابلة للتوريد، مناسبة للسوق، وجاهزة للعرض أمام العميل."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "مصنّع مخبوزات في الإمارات",
                "تطوير منتج ووصفة",
                "تصنيع وحلول علامة خاصة",
                "تركيز على التجزئة والقطاع المؤسسي",
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
              title="أكثر من خط إنتاج مخبوزات"
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
                title="مخبوزات عصرية بمنهج عملي"
                description="نركّز على منتجات مخبوزات تناسب السوق اليوم، مع مراعاة الطعم، القوام، التغليف، والعمر التخزيني. يتم تحديد كل وصفة بناءً على طلب المنتج واختبارات التصنيع المطلوبة."
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
          title="خلّينا نطوّر منتج المخبوزات القادم لعلامتك"
          text="تعرّف على كيف يمكن للشحيل مساعدتك في تطوير وتصنيع منتج مخبوزات بعلامتك الخاصة."
          primary={{ label: "استعرض حلول العلامة الخاصة", href: "/private-label" }}
          secondary={{ label: "تواصل معنا", href: "/contact" }}
        />
      </main>
      <Footer />
    </>
  );
}
