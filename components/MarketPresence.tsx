import SectionHeading from "./SectionHeading";
import { retailPresence } from "@/lib/content";

export default function MarketPresence() {
  return (
    <section id="presence" className="section bg-warmwhite">
      <div className="container-x">
        <SectionHeading
          eyebrow="Market Presence"
          title="Trusted across leading UAE retail"
          description="Our products reach shoppers through major hypermarkets, cooperatives, and premium grocery chains across the UAE."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {retailPresence.map((retailer) => (
            <div
              key={retailer}
              className="flex items-center justify-center rounded-2xl border border-sand bg-cream px-4 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-champagne hover:shadow-card"
            >
              <span className="font-serif text-base font-semibold text-charcoal/80 sm:text-lg">
                {retailer}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
