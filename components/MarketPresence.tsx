import SectionHeading from "./SectionHeading";
import AssetHint from "./AssetHint";
import { retailPresence } from "@/lib/content";

// Monogram for each retailer (e.g. "Lulu Hypermarket" -> "LH").
function monogram(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function MarketPresence() {
  return (
    <section id="presence" className="section bg-warmwhite">
      <div className="container-x">
        <SectionHeading
          eyebrow="Market Presence"
          title="Trusted across leading UAE retail"
          description="Our products reach shoppers through major hypermarkets, cooperatives, and premium grocery chains across the UAE."
        />

        <div className="mt-14 overflow-hidden rounded-3xl border border-sand bg-cream">
          <div className="grid grid-cols-2 gap-px bg-sand sm:grid-cols-3 lg:grid-cols-5">
            {retailPresence.map((retailer) => (
              <div
                key={retailer}
                className="group flex flex-col items-center justify-center gap-3 bg-cream px-4 py-9 text-center transition-colors duration-300 hover:bg-warmwhite"
              >
                {/* Placeholder logo: brand monogram until the real retail
                    logo asset is supplied. */}
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-sand bg-warmwhite font-serif text-sm font-bold text-gold transition-colors group-hover:border-champagne">
                  {monogram(retailer)}
                </span>
                <span className="font-serif text-sm font-semibold leading-tight text-charcoal transition-colors group-hover:text-ink sm:text-base">
                  {retailer}
                </span>
                <AssetHint label="Retail logo needed" />
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-stone">
          Available through leading UAE hypermarkets, cooperatives, and premium
          grocers.
        </p>
      </div>
    </section>
  );
}
