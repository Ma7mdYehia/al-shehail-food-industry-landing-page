import { manufacturingPartners } from "@/lib/content";
import AssetHint from "./AssetHint";

// Derive a clean monogram from a partner name (e.g. "HÄLSA Bake" -> "HB").
function monogram(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Partners() {
  return (
    <section className="border-y border-sand/60 bg-warmwhite py-14 sm:py-16">
      <div className="container-x">
        <div className="flex flex-col items-center text-center">
          <span className="eyebrow">
            <span className="h-px w-6 bg-champagne" />
            Manufacturing Partner For
          </span>
          <p className="mt-3 max-w-xl text-sm text-stone">
            Trusted to develop and produce private label bakery ranges for
            established UAE food brands.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {manufacturingPartners.map((partner) => (
            <div
              key={partner}
              className="group flex flex-col rounded-2xl border border-sand bg-cream px-5 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne hover:bg-warmwhite hover:shadow-card"
            >
              <div className="flex items-center gap-3.5">
                {/* Placeholder logo: shows brand monogram until the official
                    partner logo asset is supplied. */}
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-sand bg-warmwhite font-serif text-sm font-bold text-gold transition-colors group-hover:border-champagne">
                  {monogram(partner)}
                </span>
                <span className="font-serif text-base font-semibold leading-tight text-charcoal transition-colors group-hover:text-ink sm:text-lg">
                  {partner}
                </span>
              </div>
              <AssetHint label="Upload official partner logo" className="mt-3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
