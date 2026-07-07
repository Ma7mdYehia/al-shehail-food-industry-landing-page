import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { company, whatsappLink } from "@/lib/content";
import { WhatsAppIcon, PhoneIcon, MailIcon, RetailIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: {
    absolute:
      "Contact Al Shehail Food Industries | Private Label Bakery Manufacturing UAE",
  },
  description:
    "Contact Al Shehail Food Industries to discuss private label bakery manufacturing, product development, packaging support, and retail-ready supply in the UAE.",
  alternates: { canonical: "/contact" },
};

const contactCards = [
  {
    label: "WhatsApp",
    value: company.phone,
    href: whatsappLink,
    external: true,
    Icon: WhatsAppIcon,
  },
  {
    label: "Call",
    value: company.phone,
    href: `tel:+${company.phoneDigits}`,
    external: false,
    Icon: PhoneIcon,
  },
  {
    label: "Email",
    value: company.email,
    href: `mailto:${company.email}`,
    external: false,
    Icon: MailIcon,
  },
  {
    label: "Location",
    value: company.location,
    href: "https://maps.google.com/?q=New+Industrial+Area+Umm+Al+Quwain+UAE",
    external: true,
    Icon: RetailIcon,
  },
];

const nextSteps = [
  {
    number: "01",
    title: "We review your product brief",
    text: "Our team studies your product idea, category, and target market.",
  },
  {
    number: "02",
    title: "We discuss recipe and packaging needs",
    text: "We align on recipe direction, formats, and packaging requirements.",
  },
  {
    number: "03",
    title: "We align on sampling and production",
    text: "We agree on sampling, specifications, and production requirements.",
  },
  {
    number: "04",
    title: "We prepare the next step",
    text: "We map out the path to private label manufacturing and supply.",
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
                Private Label Manufacturing
              </span>
              <h1 className="heading-serif mt-6 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                Request a Manufacturing Consultation
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-stone">
                Tell us about your product idea, target market, and expected
                volume — our team will help you explore the right bakery
                manufacturing and private label solution.
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
                    <span className="mt-0.5 block text-sm leading-snug text-stone">
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
                  Start your project brief
                </h2>
                <p className="mt-3 text-base leading-relaxed text-stone">
                  Share your details below and we’ll prepare a tailored response
                  for your private label manufacturing project.
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
                The Process
              </span>
              <h2 className="heading-serif mt-4 text-3xl sm:text-4xl">
                What happens next?
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
