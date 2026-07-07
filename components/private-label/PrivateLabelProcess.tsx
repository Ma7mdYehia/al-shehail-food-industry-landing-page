import type { Locale } from "@/lib/i18n";

// Page-specific "From Idea to Shelf" process — a clean vertical timeline.
const steps: { title: { en: string; ar: string }; text: { en: string; ar: string } }[] = [
  {
    title: { en: "Product Brief", ar: "موجز المنتج" },
    text: {
      en: "We understand the product idea, market, format, and business goal.",
      ar: "نفهم فكرة المنتج والسوق والشكل والهدف التجاري.",
    },
  },
  {
    title: { en: "Recipe Direction", ar: "توجيه الوصفة" },
    text: {
      en: "We define the recipe route based on positioning and feasibility.",
      ar: "نحدّد مسار الوصفة بناءً على التموضع والجدوى.",
    },
  },
  {
    title: { en: "Sample Development", ar: "تطوير العينة" },
    text: {
      en: "Initial samples are prepared, reviewed, and refined.",
      ar: "تُحضَّر العينات الأولية وتُراجَع وتُطوَّر.",
    },
  },
  {
    title: { en: "Costing", ar: "دراسة التكلفة" },
    text: {
      en: "The product direction is evaluated against cost, format, and volume.",
      ar: "يُقيَّم توجه المنتج مقابل التكلفة والشكل والكمية.",
    },
  },
  {
    title: { en: "Packaging Planning", ar: "تخطيط التغليف" },
    text: {
      en: "Packaging direction is aligned with product type and supply needs.",
      ar: "يُواءَم توجه التغليف مع نوع المنتج واحتياجات التوريد.",
    },
  },
  {
    title: { en: "Production Setup", ar: "إعداد الإنتاج" },
    text: {
      en: "The product moves into a controlled production plan.",
      ar: "ينتقل المنتج إلى خطة إنتاج محكومة.",
    },
  },
  {
    title: { en: "Quality Control", ar: "مراقبة الجودة" },
    text: {
      en: "Checks are applied across handling, production, and packing.",
      ar: "تُطبَّق الفحوصات عبر المناولة والإنتاج والتعبئة.",
    },
  },
  {
    title: { en: "Retail-Ready Supply", ar: "توريد جاهز للرف" },
    text: {
      en: "The final product is prepared for market-ready supply.",
      ar: "يُجهَّز المنتج النهائي لتوريد جاهز للسوق.",
    },
  },
];

export default function PrivateLabelProcess({ locale }: { locale: Locale }) {
  return (
    <div className="relative mx-auto mt-12 max-w-3xl">
      {/* Connecting line behind the number nodes */}
      <span
        className="absolute bottom-3 left-5 top-3 w-px bg-sand sm:left-6 rtl:left-auto rtl:right-5 rtl:sm:right-6"
        aria-hidden
      />
      <ol className="space-y-4">
        {steps.map((s, i) => (
          <li key={s.title.en} className="relative flex gap-4 sm:gap-5">
            <span className="relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-champagne/50 bg-warmwhite font-serif text-sm font-bold text-gold shadow-card sm:h-12 sm:w-12">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="card-lift flex-1 rounded-2xl border border-sand bg-warmwhite p-4 transition-colors hover:border-champagne/60 sm:p-5">
              <h3 className="font-serif text-base font-semibold text-ink sm:text-lg">
                {s.title[locale]}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-stone">
                {s.text[locale]}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
