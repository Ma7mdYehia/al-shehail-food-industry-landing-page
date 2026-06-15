import Image from "next/image";
import Link from "next/link";
import AssetHint from "./AssetHint";
import { assets, hasAsset, getAssetAlt } from "@/lib/assets";

// Derive a clean monogram from a partner name (e.g. "HÄLSA Bake" -> "HB").
function monogram(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const partnerEntries = [
  { name: "HÄLSA Bake", assetKey: "halsaBake" as const },
  { name: "EKTIFA",     assetKey: "ektifa"    as const },
  { name: "Al Taj",     assetKey: "alTaj"     as const },
  { name: "Al Tahan",   assetKey: "alTahan"   as const },
] satisfies { name: string; assetKey: keyof typeof assets.partners }[];

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
          {partnerEntries.map(({ name, assetKey }) => {
            const logoPath = assets.partners[assetKey];
            return (
            <div
              key={name}
              className="group flex flex-col rounded-2xl border border-sand bg-cream px-5 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne hover:bg-warmwhite hover:shadow-card"
            >
              <div className="flex items-center gap-3.5">
                {hasAsset(logoPath) ? (
                  <Image
                    src={logoPath}
                    alt={getAssetAlt(assetKey, name)}
                    width={44}
                    height={44}
                    className="h-11 w-11 flex-none rounded-xl object-contain"
                  />
                ) : (
                  /* Placeholder: monogram until the official logo is supplied */
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-sand bg-warmwhite font-serif text-sm font-bold text-gold transition-colors group-hover:border-champagne">
                    {monogram(name)}
                  </span>
                )}
                <span className="font-serif text-base font-semibold leading-tight text-charcoal transition-colors group-hover:text-ink sm:text-lg">
                  {name}
                </span>
              </div>
              {!hasAsset(logoPath) && (
                <AssetHint label="Upload official partner logo" className="mt-3" />
              )}
            </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/partners"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
          >
            View Partners
            <svg
              className="transition-transform duration-300 group-hover:translate-x-0.5"
              width="16"
              height="16"
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
          </Link>
        </div>
      </div>
    </section>
  );
}
