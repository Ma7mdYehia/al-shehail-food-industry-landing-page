import Image from "next/image";
import SectionHeading from "../SectionHeading";
import TeaserLink from "../TeaserLink";
import { retailPresence } from "@/lib/content";
import { assets, hasAsset, getAssetAlt } from "@/lib/assets";

// Maps retailer display name → asset key in the manifest
const retailAssetKeys: Record<string, keyof typeof assets.retail> = {
  "Carrefour":            "carrefour",
  "Union Coop":           "unionCoop",
  "Abu Dhabi Coop":       "abuDhabiCoop",
  "Sharjah Coop":         "sharjahCoop",
  "Al Maya Group":        "alMayaGroup",
  "Lulu Hypermarket":     "luluHypermarket",
  "Nesto Hypermarket":    "nestoHypermarket",
  "Grandiose Supermarket":"grandiose",
  "Spinneys":             "spinneys",
  "Waitrose UAE":         "waitroseUae",
};

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
          {retailPresence.map((retailer) => {
            const assetKey = retailAssetKeys[retailer];
            const logoPath = assetKey ? assets.retail[assetKey] : null;
            return (
            <span
              key={retailer}
              className="inline-flex items-center gap-2.5 rounded-full border border-sand bg-cream px-5 py-2.5 font-serif text-sm font-semibold text-charcoal"
            >
              {hasAsset(logoPath) && (
                <Image
                  src={logoPath}
                  alt={getAssetAlt(assetKey!, retailer)}
                  width={20}
                  height={20}
                  className="h-5 w-auto object-contain"
                />
              )}
              {retailer}
            </span>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <TeaserLink href="/partners" label="View Market Presence" variant="secondary" />
        </div>
      </div>
    </section>
  );
}
