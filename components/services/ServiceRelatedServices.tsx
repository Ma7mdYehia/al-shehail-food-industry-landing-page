import Link from "next/link";
import SectionHeading from "../SectionHeading";

// Reusable "connects with other services" grid of linked cards, used to show
// the Al Shehail service ecosystem from each service page.
export type RelatedService = {
  title: string;
  description: string;
  href: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  items: RelatedService[];
};

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

export default function ServiceRelatedServices({
  eyebrow,
  title,
  description,
  items,
}: Props) {
  return (
    <>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card-lift group flex flex-col rounded-2xl border border-sand bg-warmwhite p-6 transition-colors hover:border-champagne/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            <h3 className="font-serif text-lg font-semibold text-ink">
              {item.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-stone">
              {item.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
              Explore
              <ArrowRight />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
