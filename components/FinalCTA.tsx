import { company, whatsappLink } from "@/lib/content";
import {
  CalendarIcon,
  WhatsAppIcon,
  PhoneIcon,
  MailIcon,
} from "./Icons";

const contactOptions = [
  {
    label: "Request Consultation",
    value: "Discuss your private label brief",
    href: `mailto:${company.email}?subject=${encodeURIComponent(
      "Private Label Consultation Request"
    )}`,
    Icon: CalendarIcon,
    external: false,
    featured: true,
  },
  {
    label: "WhatsApp",
    value: "Chat with our team",
    href: whatsappLink,
    Icon: WhatsAppIcon,
    external: true,
    featured: false,
  },
  {
    label: "Call Us",
    value: company.phone,
    href: `tel:+${company.phoneDigits}`,
    Icon: PhoneIcon,
    external: false,
    featured: false,
  },
  {
    label: "Email",
    value: company.email,
    href: `mailto:${company.email}`,
    Icon: MailIcon,
    external: false,
    featured: false,
  },
];

export default function FinalCTA() {
  return (
    <section id="contact" className="section">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl border border-champagne/40 bg-gradient-to-br from-warmwhite via-cream to-beige px-6 py-16 shadow-soft sm:px-10 lg:px-14 lg:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-champagne/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-sand/40 blur-3xl" />
          </div>

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
            <div className="text-center lg:text-left">
              <span className="eyebrow">
                <span className="h-px w-6 bg-champagne" />
                From Idea to Shelf
              </span>
              <h2 className="heading-serif mt-5 text-3xl sm:text-4xl lg:text-[2.75rem]">
                Let&apos;s manufacture your next bakery product
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-stone sm:text-lg lg:mx-0">
                Share your product concept, category, or private label brief.
                Our team will help you develop, certify, manufacture, and supply
                it retail-ready across the UAE.
              </p>
              <p className="mt-6 text-sm text-stone">
                <span className="font-semibold text-charcoal">
                  {company.location}
                </span>
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {contactOptions.map((opt) => (
                <a
                  key={opt.label}
                  href={opt.href}
                  {...(opt.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card ${
                    opt.featured
                      ? "border-champagne bg-gold-gradient text-white shadow-soft sm:col-span-2"
                      : "border-sand bg-warmwhite text-charcoal hover:border-champagne"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${
                      opt.featured
                        ? "bg-white/20 text-white"
                        : "bg-beige text-gold"
                    }`}
                  >
                    <opt.Icon width={20} height={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">
                      {opt.label}
                    </span>
                    <span
                      className={`block truncate text-xs ${
                        opt.featured ? "text-white/85" : "text-stone"
                      }`}
                    >
                      {opt.value}
                    </span>
                  </span>
                  <svg
                    className={`ml-auto flex-none transition-transform duration-300 group-hover:translate-x-0.5 ${
                      opt.featured ? "text-white/90" : "text-champagne"
                    }`}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
