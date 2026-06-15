import SectionHeading from "../SectionHeading";
import TeaserLink from "../TeaserLink";
import { retailPresence } from "@/lib/content";

export default function MarketPresenceTeaser() {
  return (
    <section className="section bg-warmwhite">
      <div className="container-x">
        <SectionHeading
          eyebrow="Market Presence"
          title="Trusted across leading UAE retail"
          description="Our products reach shoppers through major hypermarkets, cooperatives, and premium grocery chains across the UAE."
        />

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {retailPresence.map((retailer) => (
            <span
              key={retailer}
              className="rounded-full border border-sand bg-cream px-5 py-2.5 font-serif text-sm font-semibold text-charcoal"
            >
              {retailer}
            </span>
          ))}
        </div>

        <div className="mt-10 text-center">
          <TeaserLink href="/partners" label="View Market Presence" variant="secondary" />
        </div>
      </div>
    </section>
  );
}
