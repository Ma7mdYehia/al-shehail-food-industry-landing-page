import Image from "next/image";
import SectionHeading from "../SectionHeading";
import TeaserLink from "../TeaserLink";
import { retailPresence } from "@/lib/content";
import { assets, hasAsset, getAssetAlt } from "@/lib/assets";
import { ui } from "@/lib/dictionary";
import { localeHref, type Locale } from "@/lib/i18n";

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

export default function MarketPresenceTeaser({ locale }: { locale: Locale }) {
  const t = ui[locale].home.market;

  return (
    <section className="section relative overflow-hidden bg-cream">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="bg-dotted-gold absolute inset-0 opacity-25" />
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-champagne/10 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-sand/25 blur-3xl" />
      </div>
      <div className="container-x relative">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
        />

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {retailPresence.map((retailer) => {
            const assetKey = retailAssetKeys[retailer];
            const logoPath = assetKey ? assets.retail[assetKey] : null;
            return (
            <span
              key={retailer}
              className="glass-chip inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 font-serif text-sm font-semibold text-charcoal transition-all duration-300 hover:-translate-y-0.5 hover:text-gold"
            >
              {hasAsset(logoPath) ? (
                <Image
                  src={logoPath}
                  alt={getAssetAlt(assetKey!, retailer)}
                  width={20}
                  height={20}
                  className="h-5 w-auto object-contain"
                />
              ) : (
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-champagne" aria-hidden />
              )}
              {retailer}
            </span>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <TeaserLink href={localeHref("/partners", locale)} label={t.cta} variant="secondary" />
        </div>
      </div>
    </section>
  );
}
