import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { company, whatsappLink } from "@/lib/content";
import { WhatsAppIcon, PhoneIcon, MailIcon, RetailIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: {
    absolute:
      "تواصل مع الشحيل للصناعات الغذائية | تصنيع مخبوزات بعلامة خاصة في الإمارات",
  },
  description:
    "تواصل مع الشحيل للصناعات الغذائية لمناقشة تصنيع مخبوزات بعلامة خاصة، وتطوير المنتجات، ودعم التغليف، والتوريد الجاهز للرف في الإمارات.",
  alternates: { canonical: "/contact" },
};

const contactCards = [
  {
    label: "واتساب",
    value: company.phone,
    href: whatsappLink,
    external: true,
    Icon: WhatsAppIcon,
  },
  {
    label: "اتصال",
    value: company.phone,
    href: `tel:+${company.phoneDigits}`,
    external: false,
    Icon: PhoneIcon,
  },
  {
    label: "البريد الإلكتروني",
    value: company.email,
    href: `mailto:${company.email}`,
    external: false,
    Icon: MailIcon,
  },
  {
    label: "الموقع",
    value: company.location,
    href: "https://maps.google.com/?q=New+Industrial+Area+Umm+Al+Quwain+UAE",
    external: true,
    Icon: RetailIcon,
  },
];

const nextSteps = [
  {
    number: "01",
    title: "نراجع طلب منتجك",
    text: "يدرس فريقنا فكرة منتجك وفئته والسوق المستهدف.",
  },
  {
    number: "02",
    title: "نناقش احتياجات الوصفة والتغليف",
    text: "نتفق على توجيه الوصفة والأشكال ومتطلبات التغليف.",
  },
  {
    number: "03",
    title: "نتفق على العينات والإنتاج",
    text: "نتفق على العينات والمواصفات ومتطلبات الإنتاج.",
  },
  {
    number: "04",
    title: "نجهّز الخطوة التالية",
    text: "نرسم مسار التصنيع بعلامة خاصة والتوريد.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
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
                تصنيع بعلامة خاصة
              </span>
              <h1 className="heading-serif mt-6 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                اطلب استشارة تصنيع
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-stone">
                أخبرنا عن فكرة منتجك، وسوقك المستهدف، والكمية المتوقعة —
                وسيساعدك فريقنا في استكشاف حل التصنيع والعلامة الخاصة الأنسب.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Contact options */}
        <section className="pb-4">
          <div className="container-x">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {contactCards.map((card) => (
                <a
                  key={card.label}
                  href={card.href}
                  {...(card.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex items-start gap-4 rounded-2xl border border-sand bg-warmwhite p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne hover:shadow-card"
                >
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-beige text-gold">
                    <card.Icon width={20} height={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-charcoal">
                      {card.label}
                    </span>
                    <span
                      className="mt-0.5 block text-sm leading-snug text-stone"
                      dir={card.label === "الموقع" ? undefined : "ltr"}
                    >
                      {card.value}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 3. B2B Project Form */}
        <section className="section pt-10">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              <div className="mb-8 text-center">
                <h2 className="heading-serif text-3xl sm:text-4xl">
                  ابدأ ملخص مشروعك
                </h2>
                <p className="mt-3 text-base leading-relaxed text-stone">
                  شارك بياناتك أدناه وسنجهّز ردًا مخصَّصًا لمشروع تصنيعك بعلامة
                  خاصة.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* 4. Supporting section */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">
                <span className="h-px w-6 bg-champagne" />
                المسار
              </span>
              <h2 className="heading-serif mt-4 text-3xl sm:text-4xl">
                ما الخطوة التالية؟
              </h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {nextSteps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-sand bg-cream p-6 shadow-card"
                >
                  <span className="font-serif text-3xl font-bold text-champagne/50">
                    {step.number}
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
      <Footer />
    </>
  );
}
