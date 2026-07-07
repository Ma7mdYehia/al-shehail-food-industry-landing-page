import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { company, whatsappLink } from "@/lib/content";
import { WhatsAppIcon, PhoneIcon, MailIcon, RetailIcon } from "@/components/Icons";
import type { Locale } from "@/lib/i18n";

const icons = [WhatsAppIcon, PhoneIcon, MailIcon, RetailIcon];

const copy = {
  en: {
    heroEyebrow: "Private Label Manufacturing",
    heroTitle: "Request a Manufacturing Consultation",
    heroSubtitle:
      "Tell us about your product idea, target market, and expected volume — our team will help you explore the right bakery manufacturing and private label solution.",
    cards: ["WhatsApp", "Call", "Email", "Location"],
    formTitle: "Start your project brief",
    formDesc:
      "Share your details below and we’ll prepare a tailored response for your private label manufacturing project.",
    processEyebrow: "The Process",
    processTitle: "What happens next?",
    steps: [
      {
        title: "We review your product brief",
        text: "Our team studies your product idea, category, and target market.",
      },
      {
        title: "We discuss recipe and packaging needs",
        text: "We align on recipe direction, formats, and packaging requirements.",
      },
      {
        title: "We align on sampling and production",
        text: "We agree on sampling, specifications, and production requirements.",
      },
      {
        title: "We prepare the next step",
        text: "We map out the path to private label manufacturing and supply.",
      },
    ],
  },
  ar: {
    heroEyebrow: "التصنيع بعلامة خاصة",
    heroTitle: "اطلب استشارة تصنيع",
    heroSubtitle:
      "أخبرنا عن فكرة منتجك وسوقك المستهدف والكمية المتوقعة — وسيساعدك فريقنا على استكشاف الحل الأنسب لتصنيع المخبوزات والعلامة الخاصة.",
    cards: ["واتساب", "اتصال", "البريد الإلكتروني", "الموقع"],
    formTitle: "ابدأ موجز مشروعك",
    formDesc:
      "شارك تفاصيلك أدناه وسنجهّز ردًا مخصّصًا لمشروع التصنيع بعلامتك الخاصة.",
    processEyebrow: "العملية",
    processTitle: "ماذا يحدث بعد ذلك؟",
    steps: [
      {
        title: "نراجع موجز منتجك",
        text: "يدرس فريقنا فكرة منتجك وفئته وسوقك المستهدف.",
      },
      {
        title: "نناقش احتياجات الوصفة والتغليف",
        text: "نتوافق على توجه الوصفة والأشكال ومتطلبات التغليف.",
      },
      {
        title: "نتوافق على العينات والإنتاج",
        text: "نتفق على العينات والمواصفات ومتطلبات الإنتاج.",
      },
      {
        title: "نجهّز الخطوة التالية",
        text: "نرسم مسار التصنيع بعلامة خاصة والتوريد.",
      },
    ],
  },
} as const;

export default function ContactPage({ locale }: { locale: Locale }) {
  const t = copy[locale];

  const contactCards = [
    {
      label: t.cards[0],
      value: company.phone,
      href: whatsappLink(locale),
      external: true,
    },
    {
      label: t.cards[1],
      value: company.phone,
      href: `tel:+${company.phoneDigits}`,
      external: false,
    },
    {
      label: t.cards[2],
      value: company.email,
      href: `mailto:${company.email}`,
      external: false,
    },
    {
      label: t.cards[3],
      value: company.location[locale],
      href: "https://maps.google.com/?q=New+Industrial+Area+Umm+Al+Quwain+UAE",
      external: true,
    },
  ];

  const stepNumbers = ["01", "02", "03", "04"];

  return (
    <>
      <Header locale={locale} />
      <main>
        {/* 1. Contact Hero */}
        <section className="relative overflow-hidden pt-32 pb-12 sm:pt-36 lg:pt-44 lg:pb-16">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-warmwhite via-cream to-beige/40" />
            <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />
          </div>
          <div className="container-x">
            <div className="max-w-3xl">
              <span className="eyebrow">
                <span className="h-px w-6 bg-champagne" />
                {t.heroEyebrow}
              </span>
              <h1 className="heading-serif mt-6 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                {t.heroTitle}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-stone">
                {t.heroSubtitle}
              </p>
            </div>
          </div>
        </section>

        {/* 2. Contact options */}
        <section className="pb-4">
          <div className="container-x">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {contactCards.map((card, i) => {
                const Icon = icons[i];
                return (
                  <a
                    key={card.label}
                    href={card.href}
                    {...(card.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group flex items-start gap-4 rounded-2xl border border-sand bg-warmwhite p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne hover:shadow-card"
                  >
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-beige text-gold">
                      <Icon width={20} height={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-charcoal">
                        {card.label}
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-stone">
                        {card.value}
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. B2B Project Form */}
        <section className="section pt-10">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              <div className="mb-8 text-center">
                <h2 className="heading-serif text-3xl sm:text-4xl">
                  {t.formTitle}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-stone">
                  {t.formDesc}
                </p>
              </div>
              <ContactForm locale={locale} />
            </div>
          </div>
        </section>

        {/* 4. Supporting section */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">
                <span className="h-px w-6 bg-champagne" />
                {t.processEyebrow}
              </span>
              <h2 className="heading-serif mt-4 text-3xl sm:text-4xl">
                {t.processTitle}
              </h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {t.steps.map((step, i) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-sand bg-cream p-6 shadow-card"
                >
                  <span className="font-serif text-3xl font-bold text-champagne/50">
                    {stepNumbers[i]}
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
