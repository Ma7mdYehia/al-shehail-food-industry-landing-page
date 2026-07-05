import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    absolute:
      "تصنيع مخبوزات بعلامة خاصة في الإمارات | الشحيل للصناعات الغذائية",
  },
  description:
    "طوّر وصنّع منتجات مخبوزات بعلامتك مع الشحيل للصناعات الغذائية — من فكرة المنتج، وتوجيه الوصفة، والعينات، والتغليف، ومراقبة الجودة، إلى التوريد الجاهز للرف.",
  alternates: { canonical: "/private-label" },
};

// ── Content (local arrays — merged from Private Label, Capabilities, Quality) ──

const trustProof = [
  "مصنّع مخبوزات مقرّه الإمارات",
  "دعم العلامة الخاصة",
  "تطوير المنتجات",
  "إنتاج خاضع لرقابة الجودة",
  "توريد جاهز للرف",
];

const audience = [
  "العلامات الغذائية",
  "متاجر التجزئة",
  "السوبرماركت والهايبرماركت",
  "المقاهي ومشغّلو قطاع المطاعم",
  "المشترون المؤسسيون",
  "علامات المخبوزات الصحية",
  "علامات حلويات التمر والوجبات الخفيفة",
];

const buildScope: { title: string; description: string; tag: string }[] = [
  {
    title: "الخبز المسطح واللفائف",
    tag: "تشكيلة منتجات",
    description:
      "خبز عربي، ولفائف وظيفية، وأشكال خبز قائمة على الحبوب للتجزئة وقطاع المطاعم.",
  },
  {
    title: "الخبز الطري",
    tag: "تشكيلة منتجات",
    description:
      "توست، وكعك، وأرغفة، وأشكال مخبوزات يومية مبنية لتوريد ثابت.",
  },
  {
    title: "المعجنات",
    tag: "تشكيلة منتجات",
    description:
      "كرواسان، وكرواسان صغير، وعجين مورّق لتشكيلات المخابز الراقية.",
  },
  {
    title: "الحلويات",
    tag: "تشكيلة منتجات",
    description: "معمول، وتمرية، وبسكويت، وحلويات مخبوزة قائمة على التمر.",
  },
  {
    title: "توجيهات وصفة مخصَّصة",
    tag: "خدمة",
    description:
      "تطوير الوصفة بناءً على التموضع في السوق، واختبار المنتج، وقابلية التنفيذ.",
  },
  {
    title: "أشكال التغليف",
    tag: "خدمة",
    description:
      "توجيه تغليف جاهز للرف بناءً على نوع المنتج والعلامة واحتياجات التوريد.",
  },
];

const capabilityCards = [
  {
    title: "تطوير المنتجات",
    Icon: DevelopIcon,
    text: "من الطلب الأولي إلى منتج مخبوزات نهائي وقابل للتصنيع.",
  },
  {
    title: "تخصيص الوصفات",
    Icon: ProductionIcon,
    text: "تركيبات مضبوطة للطعم والقوام والتموضع.",
  },
  {
    title: "تصنيع العلامة الخاصة",
    Icon: PackagingIcon,
    text: "إنتاج بعلامتك، وفق مواصفاتك.",
  },
  {
    title: "تعبئة جاهزة للرف",
    Icon: PackagingIcon,
    text: "أشكال تغليف مجهَّزة للعرض والتوريد.",
  },
  {
    title: "تخطيط إنتاج قابل للتوسّع",
    Icon: ProductionIcon,
    text: "إنتاجية مخطَّطة من العينة وحتى الكميات الكبيرة.",
  },
  {
    title: "عملية خاضعة لرقابة الجودة",
    Icon: ShieldCheckIcon,
    text: "فحوصات عبر التعامل مع المكونات والإنتاج والتعبئة.",
  },
  {
    title: "العينات وتطوير المنتج",
    Icon: CalendarIcon,
    text: "عينات تُنتَج وتُطوَّر وفق طلبك.",
  },
  {
    title: "دعم المنتج الجاهز للسوق",
    Icon: RetailIcon,
    text: "إرشاد نحو إطلاق جاهز للرف.",
  },
];

const recipeDirections = [
  "وصفات قياسية",
  "وصفات بتوجه صحي",
  "توجه مكونات نظيفة",
  "بدون سكر مضاف حيثما يكون ذلك ممكنًا تقنيًا",
  "تخفيض السكر حيثما يكون ذلك مناسبًا",
  "بدون مواد حافظة حيثما يسمح العمر التخزيني والعملية الإنتاجية",
  "توجهات بالقمح الكامل أو تركّز على الألياف حيثما يكون ذلك مناسبًا",
  "تخصيص الحجم والشكل والنكهة والحشو",
];

const packaging = [
  "تخطيط شكل العبوة",
  "دعم تغليف جاهز للعلامة",
  "توجيه العبوات المتعددة والصناديق",
  "جاهزية رفوف التجزئة",
  "تجهيز التوريد",
  "دعم الإطلاق",
];

const qualityProcess = [
  "التعامل مع المكونات",
  "ضبط الوصفة والدفعات",
  "عملية النظافة",
  "سجلات الإنتاج",
  "فحص الجودة",
  "فحوصات التغليف",
  "معايير التوريد للتجزئة",
];

const certAssetKeys: Record<string, keyof typeof assets.certifications> = {
  "معتمدون بشهادة ISO": "iso",
  "معتمدون بشهادة HACCP": "haccp",
  "معتمدون عضويًا": "organic",
  "معتمدون لدى كارفور": "carrefourApproved",
};

const useCases: { title: string; text: string }[] = [
  {
    title: "علامة خاصة للتجزئة",
    text: "منتجات مخبوزات تُطوَّر وتُصنَّع تحت علامة التجزئة الخاصة بك.",
  },
  {
    title: "توريد للسوبرماركت",
    text: "أشكال مخبوزات ثابتة الجودة مجهَّزة لمتطلبات رفوف التجزئة.",
  },
  {
    title: "توريد لقطاع المطاعم",
    text: "توريد مخبوزات موثوق للمقاهي والتموين والمشغّلين.",
  },
  {
    title: "خطوط منتجات مخبوزات صحية",
    text: "توجهات وصفة بالحبوب الكاملة، أو تركّز على الألياف، أو خاصة بالسوق حيثما يكون ذلك مناسبًا.",
  },
  {
    title: "خطوط منتجات حلويات التمر",
    text: "حلويات قائمة على التمر بطابع تقليدي وعصري للتجزئة والهدايا.",
  },
  {
    title: "منتجات المقاهي والقطاع المؤسسي",
    text: "أشكال مخبوزات مخطَّطة لتوريد قابل للتكرار واحتياجات الخدمة.",
  },
];

const needFromYou = [
  "فكرة المنتج",
  "السوق المستهدف",
  "الكمية المتوقعة",
  "شكل المنتج",
  "توجيه التغليف",
  "المعايير أو الشهادات المطلوبة",
  "الجدول الزمني",
];

// ── Small local building blocks ──

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

export default function PrivateLabelPage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero */}
        <PrivateLabelHero />

        {/* 2. Trust strip / quick value proof */}
        <section className="border-y border-sand/60 bg-warmwhite py-8">
          <div className="container-x">
            <ul className="flex flex-wrap items-center justify-center gap-2.5">
              {trustProof.map((item) => (
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
        <PrivateLabelSectionNav />

        {/* 3. Who We Build For */}
        <section id="overview" className="section scroll-mt-36">
          <div className="container-x">
            <SectionHeading
              eyebrow="لمن نصنّع"
              title="مبني للعلامات وتجار التجزئة ومشتري قطاع المطاعم"
              description="سواء كنت تطلق خط مخبوزات جديدًا أو توسّع تشكيلة تجزئة قائمة، تدعم الشحيل مسار التصنيع خلف علامتك."
            />
            <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {audience.map((a) => (
                <CheckCard key={a} label={a} />
              ))}
            </ul>
          </div>
        </section>

        {/* 4. What We Can Build With You */}
        <section
          id="products"
          className="section scroll-mt-36 border-y border-sand/50 bg-beige/30"
        >
          <div className="container-x">
            <SectionHeading
              eyebrow="نطاق المنتجات"
              title="ما يمكننا بناؤه معك"
              description="تشكيلة مخبوزات تمتد من الأساسيات اليومية إلى المعجنات الراقية وحلويات التمر — تُطوَّر وتُغلَّف بعلامتك."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {buildScope.map((item) => (
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

        {/* 5. Capabilities Across the Line */}
        <section
          id="capabilities"
          className="section scroll-mt-36 border-t border-sand/60 bg-warmwhite"
        >
          <div className="container-x">
            <SectionHeading
              eyebrow="القدرات"
              title="قدرات تمتد عبر خط التصنيع بالكامل"
              description="نموذج دعم متكامل يغطي تطوير المنتج، وتوجيه الوصفة، والعينات، والتغليف، وتخطيط الإنتاج، ومراقبة الجودة، والتوريد الجاهز للرف."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {capabilityCards.map((cap) => (
                <div
                  key={cap.title}
                  className="card-lift group rounded-2xl border border-sand bg-cream p-6 shadow-card transition-colors hover:border-champagne/60"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-beige text-gold transition-colors group-hover:bg-gold-gradient group-hover:text-white">
                    <cap.Icon width={22} height={22} />
                  </span>
                  <h3 className="mt-5 font-serif text-base font-semibold text-ink">
                    {cap.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone">
                    {cap.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. From Idea to Shelf Process */}
        <section
          id="process"
          className="section scroll-mt-36 border-y border-sand/50 bg-beige/40"
        >
          <div className="container-x">
            <SectionHeading
              eyebrow="من الفكرة إلى الرف"
              title="مسار واضح من فكرة المنتج إلى التوريد الجاهز للرف"
              description="رحلة تصنيع عملية تساعد على نقل منتجك من الطلب الأولي إلى الإنتاج والتغليف وفحوصات الجودة والتوريد الجاهز للسوق."
            />
            <PrivateLabelProcess />
          </div>
        </section>

        {/* 7. Recipe & Product Customization */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              align="left"
              eyebrow="تخصيص الوصفة والمنتج"
              title="وصفات تُطوَّر لسوقك المستهدف"
              description="يعتمد توجيه الوصفة على طلب المنتج، والتموضع في السوق، واحتياجات العمر التخزيني، وتوفر المكونات، وقابلية التنفيذ الإنتاجي، والموافقة التنظيمية."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {recipeDirections.map((r) => (
                <CheckCard key={r} label={r} />
              ))}
            </ul>
            <div className="mt-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-champagne/40 bg-cream p-5">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-beige text-gold">
                <ShieldCheckIcon width={15} height={15} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                  ملاحظة استشارية
                </p>
                <p className="mt-1 text-xs leading-relaxed text-stone">
                  تخضع جميع الوصفات المخصَّصة لاختبار المنتج، ومتطلبات العمر
                  التخزيني، وتوفر المكونات، وقابلية التنفيذ الإنتاجي، والموافقة
                  التنظيمية.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Packaging & Retail Readiness */}
        <section className="section border-y border-sand/50 bg-beige/30">
          <div className="container-x">
            <SectionHeading
              eyebrow="التغليف والجاهزية للتجزئة"
              title="مصمَّم للرف والتوريد وعرض العلامة"
              description="التصنيع بعلامة خاصة لا يقتصر على الوصفة وحدها. المنتج يحتاج أيضًا إلى الشكل المناسب، وتوجيه التغليف، وفحوصات الجودة، وجاهزية التوريد."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {packaging.map((p, i) => (
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
        <section
          id="quality"
          className="section scroll-mt-36 border-t border-sand/60 bg-warmwhite"
        >
          <div className="container-x">
            {/* Premium quality intro banner — subtle decorative video kept only
                inside this rounded card, behind a warm overlay (video hidden on
                small screens, gradient fallback remains). */}
            <div className="relative overflow-hidden rounded-3xl border border-sand bg-cream px-6 py-12 sm:px-10 sm:py-14">
              <BackgroundVideo
                src="/assets/videos/quality-certifications-bg.mp4"
                className="hidden opacity-30 sm:block"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-warmwhite/95 via-cream/85 to-cream/70"
                aria-hidden
              />
              <div className="relative">
                <SectionHeading
                  eyebrow="الشهادات والجودة"
                  title="جودة تثق بها علامتك"
                  description="معايير معتمدة وعملية إنتاج منظمة وخاضعة لرقابة الجودة تدعم توريد مخبوزات ثابت وجاهز للرف."
                />
              </div>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {certifications.map((cert) => {
                const assetKey = certAssetKeys[cert.title];
                const logoPath = assetKey
                  ? assets.certifications[assetKey]
                  : null;
                return (
                  <div
                    key={cert.title}
                    className="card-lift group flex flex-col items-center rounded-2xl border border-sand bg-cream p-8 text-center shadow-card hover:border-champagne/60 hover:shadow-glow"
                  >
                    <span className="relative flex h-20 w-20 items-center justify-center">
                      {hasAsset(logoPath) ? (
                        <Image
                          src={logoPath}
                          alt={getAssetAlt(assetKey!, cert.title)}
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
                      {cert.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">
                      {cert.description}
                    </p>
                    {!hasAsset(logoPath) && (
                      <AssetHint
                        label={
                          cert.title === "معتمدون لدى كارفور"
                            ? "إثبات الاعتماد / الشعار مطلوب"
                            : "مسح الشهادة / الشعار مطلوب"
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
                عملية الجودة
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {qualityProcess.map((q, i) => (
                  <div
                    key={q}
                    className="flex items-center gap-3 rounded-2xl border border-sand bg-cream p-4"
                  >
                    <span className="font-serif text-lg font-bold text-champagne/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold text-charcoal">
                      {q}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 10. Use Cases */}
        <section className="section border-y border-sand/50 bg-beige/30">
          <div className="container-x">
            <SectionHeading
              eyebrow="حالات الاستخدام"
              title="أين يُستخدم التصنيع بعلامة خاصة"
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((u) => (
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
        <section
          id="start"
          className="section scroll-mt-36 border-t border-sand/60 bg-warmwhite"
        >
          <div className="container-x">
            <SectionHeading
              eyebrow="ابدأ الحديث"
              title="ما نحتاج لفهمه عن مشروعك"
              description="طلب واضح يساعد فريقنا على استكشاف توجيه المنتج المناسب، والتوافق التصنيعي، ومسار التوريد بعلامة خاصة."
            />
            <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-sand bg-cream p-6 sm:p-8">
              <ul className="grid gap-3 sm:grid-cols-2">
                {needFromYou.map((n) => (
                  <CheckCard key={n} label={n} />
                ))}
              </ul>
              <div className="mt-7 flex flex-col items-center gap-3 border-t border-sand/70 pt-6 text-center sm:flex-row sm:justify-between sm:text-start">
                <p className="text-sm text-stone">
                  شارك ما لديك حتى الآن — وسنساعدك في تحديد الباقي.
                </p>
                <Link href="/contact" className="btn-primary">
                  ابدأ مشروع علامة خاصة
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 12. Final CTA */}
        <section className="section">
          <div className="container-x">
            <div className="relative overflow-hidden rounded-3xl border border-champagne/40 bg-gradient-to-br from-warmwhite via-cream to-beige px-6 py-16 text-center shadow-soft sm:px-12 lg:py-20">
              {/* Subtle decorative video behind the CTA (hidden on small screens,
                  gradient fallback remains), under a warm readability overlay. */}
              <BackgroundVideo
                src="/assets/videos/from-idea-to-shelf-bg.mp4"
                className="hidden opacity-35 sm:block"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-warmwhite/95 via-cream/85 to-beige/75"
                aria-hidden
              />

              <div className="relative mx-auto max-w-2xl">
                <span className="eyebrow">
                  <span className="h-px w-6 bg-champagne" />
                  من الفكرة إلى الرف
                </span>
                <h2 className="heading-serif mt-5 text-3xl sm:text-4xl lg:text-[2.75rem]">
                  جاهز لبناء منتج مخبوزات بعلامتك؟
                </h2>
                <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
                  شارك فكرة منتجك، وسوقك المستهدف، والكمية المتوقعة — وسيساعدك
                  فريقنا في استكشاف حل التصنيع بعلامة خاصة الأنسب.
                </p>
                <div className="mt-8">
                  <Link href="/contact" className="btn-primary">
                    ابدأ مشروع علامة خاصة
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
