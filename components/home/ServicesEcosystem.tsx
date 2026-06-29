import Link from "next/link";
import SectionHeading from "../SectionHeading";
import {
  ProductionIcon,
  RetailIcon,
  PackagingIcon,
  DevelopIcon,
} from "../Icons";

// Homepage "Beyond Manufacturing" section — introduces the 4-service ecosystem
// in compact premium cards. Conservative copy, no claims.
const services = [
  {
    title: "Private Label Manufacturing",
    text: "Product development and bakery manufacturing support for food brands.",
    cta: "Explore Manufacturing",
    href: "/private-label",
    Icon: ProductionIcon,
  },
  {
    title: "Packaging & Brand Design",
    text: "Food-focused packaging direction and brand presentation for retail-ready products.",
    cta: "Explore Brand Design",
    href: "/services/brand-design",
    Icon: PackagingIcon,
  },
  {
    title: "Distribution Fleet & Retail Reach",
    text: "Distribution coordination for finished products moving toward selected retail channels.",
    cta: "Explore Distribution",
    href: "/services/distribution",
    Icon: RetailIcon,
  },
  {
    title: "Food Digital Marketing",
    text: "Launch content, product storytelling, and digital communication direction for food brands.",
    cta: "Explore Marketing",
    href: "/services/digital-marketing",
    Icon: DevelopIcon,
  },
];

function ArrowRight() {
  return (
    <svg
      className="transition-transform duration-300 group-hover:translate-x-0.5"
      width="15"
      height="15"
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
  );
}

export default function ServicesEcosystem() {
  return (
    <section className="section border-y border-sand/60 bg-warmwhite">
      <div className="container-x">
        <SectionHeading
          eyebrow="Beyond Manufacturing"
          title="One partner across the food product journey"
          description="Al Shehail supports food brands across production, packaging, distribution, and digital communication — helping products move from idea to retail-ready execution."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="card-lift group flex flex-col rounded-2xl border border-sand bg-cream p-6 transition-colors hover:border-champagne/60 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-beige text-gold transition-colors group-hover:bg-gold-gradient group-hover:text-white">
                <s.Icon width={20} height={20} />
              </span>
              <h3 className="mt-4 font-serif text-base font-semibold leading-tight text-ink">
                {s.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-stone">
                {s.text}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold">
                {s.cta}
                <ArrowRight />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
