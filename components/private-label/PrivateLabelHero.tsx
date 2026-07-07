import { localeHref, type Locale } from "@/lib/i18n";

// Page-specific hero for /private-label. Two-column on desktop, stacked mobile.
const heroFlow: { en: string; ar: string }[] = [
  { en: "Idea", ar: "الفكرة" },
  { en: "Recipe", ar: "الوصفة" },
  { en: "Sample", ar: "العينة" },
  { en: "Costing", ar: "التكلفة" },
  { en: "Packaging", ar: "التغليف" },
  { en: "Production", ar: "الإنتاج" },
  { en: "QC", ar: "الجودة" },
  { en: "Supply", ar: "التوريد" },
];

const L = {
  en: {
    eyebrow: "Private Label Bakery Manufacturing",
    title: "Your Bakery Product, Built From Idea to Shelf",
    subtitle:
      "Develop, manufacture, package, and supply bakery products under your brand — with certified quality and retail-ready execution.",
    startProject: "Start a Private Label Project",
    exploreProcess: "Explore the Process",
    system: "Manufacturing System",
    fromIdea: "From idea to shelf",
    note: "One connected line — product development to retail-ready supply.",
  },
  ar: {
    eyebrow: "تصنيع المخبوزات بعلامة خاصة",
    title: "منتجك من المخبوزات، مبني من الفكرة إلى الرف",
    subtitle:
      "طوّر وصنّع وغلّف ووزّع منتجات المخبوزات تحت علامتك — بجودة معتمدة وتنفيذ مهيأ للرف.",
    startProject: "ابدأ مشروع علامة خاصة",
    exploreProcess: "استكشف العملية",
    system: "نظام التصنيع",
    fromIdea: "من الفكرة إلى الرف",
    note: "خط واحد مترابط — من تطوير المنتج إلى توريد جاهز للرف.",
  },
} as const;

export default function PrivateLabelHero({ locale }: { locale: Locale }) {
  const t = L[locale];

  return (
    <section className="relative overflow-hidden pt-32 pb-14 sm:pt-36 lg:pt-44 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-warmwhite via-cream to-beige/40" />
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />
        <div className="absolute top-40 -left-24 h-96 w-96 rounded-full bg-sand/30 blur-3xl" />
      </div>

      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          {/* Left — copy + CTAs */}
          <div className="max-w-xl">
            <span className="eyebrow">
              <span className="h-px w-6 bg-champagne" />
              {t.eyebrow}
            </span>
            <h1 className="heading-serif mt-6 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              {t.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-stone">{t.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={localeHref("/contact", locale)} className="btn-primary">
                {t.startProject}
              </a>
              <a href="#process" className="btn-secondary">
                {t.exploreProcess}
              </a>
            </div>
          </div>

          {/* Right — static operating card */}
          <div className="lg:justify-self-end">
            <div className="relative w-full max-w-md rounded-3xl border border-sand bg-warmwhite/90 p-5 shadow-soft sm:p-6">
              <div className="oven-glow pointer-events-none absolute inset-0 rounded-3xl" aria-hidden />
              <div className="relative flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                    {t.system}
                  </span>
                  <p className="mt-1 font-serif text-base font-semibold text-ink">
                    {t.fromIdea}
                  </p>
                </div>
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-gold-gradient font-serif text-xs font-bold text-white shadow-card">
                  08
                </span>
              </div>

              <div className="relative mt-5 grid grid-cols-2 gap-2.5">
                {heroFlow.map((step, i) => (
                  <div
                    key={step.en}
                    className="flex items-center gap-2.5 rounded-xl border border-sand/80 bg-cream px-3 py-2.5"
                  >
                    <span className="font-serif text-[11px] font-bold text-champagne">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold text-charcoal">
                      {step[locale]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative mt-4 flex items-center gap-2 rounded-xl border border-champagne/40 bg-beige/50 px-3 py-2.5 text-xs font-medium text-charcoal">
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-gold" aria-hidden />
                {t.note}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
