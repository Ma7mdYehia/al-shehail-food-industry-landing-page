import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/SectionHeading";
import AssetHint from "@/components/AssetHint";
import PartnerProjectGrid from "@/components/partners/PartnerProjectGrid";
import { retailPresence } from "@/lib/content";
import { assets, hasAsset, getAssetAlt } from "@/lib/assets";
import { localeHref, type Locale } from "@/lib/i18n";

function monogram(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

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

const copy = {
  en: {
    heroEyebrow: "Partners & Presence",
    heroTitle: "Manufacturing Partners & Market Presence",
    heroSubtitle:
      "Al Shehail Food Industries supports bakery brands and retail supply through private label manufacturing, product development, and market-ready production.",
    becomePartner: "Become a Partner",
    partnerEyebrow: "Manufacturing Partner For",
    partnerTitle: "Trusted by established food brands",
    partnerDesc:
      "We develop and produce private label bakery ranges for established UAE food brands.",
    presenceEyebrow: "Market Presence",
    presenceTitle: "Available across leading UAE retail",
    presenceDesc:
      "Our products reach shoppers through major hypermarkets, cooperatives, and premium grocery chains across the UAE.",
    logoNeeded: "Retail logo needed",
    trustEyebrow: "Market Trust",
    trustTitle: "Presence built on operational discipline",
    trustDesc:
      "Reaching and staying in major retail environments takes consistency, packaging readiness, dependable quality, and operational discipline across every batch. That is the standard Al Shehail manufactures to.",
    ctaEyebrow: "Partner With Us",
    ctaTitle: "Manufacture Your Bakery Brand With Al Shehail",
    ctaText:
      "Talk to our team about private label manufacturing, product development, and retail-ready supply.",
    contactUs: "Contact Us",
  },
  ar: {
    heroEyebrow: "الشركاء والحضور",
    heroTitle: "شركاء التصنيع والحضور في السوق",
    heroSubtitle:
      "يدعم الشحيل للصناعات الغذائية العلامات الغذائية وتوريد التجزئة عبر التصنيع بعلامة خاصة وتطوير المنتجات والإنتاج المهيأ للسوق.",
    becomePartner: "كن شريكًا",
    partnerEyebrow: "شريك التصنيع لـ",
    partnerTitle: "موضع ثقة علامات غذائية راسخة",
    partnerDesc:
      "نطوّر وننتج تشكيلات مخبوزات بعلامة خاصة لعلامات غذائية راسخة في الإمارات.",
    presenceEyebrow: "الحضور في السوق",
    presenceTitle: "متوفّر عبر كبرى منافذ التجزئة في الإمارات",
    presenceDesc:
      "تصل منتجاتنا إلى المتسوقين عبر كبرى الهايبرماركت والجمعيات وسلاسل البقالة الراقية في الإمارات.",
    logoNeeded: "شعار التجزئة مطلوب",
    trustEyebrow: "ثقة السوق",
    trustTitle: "حضور مبني على انضباط تشغيلي",
    trustDesc:
      "الوصول إلى بيئات التجزئة الكبرى والبقاء فيها يتطلب ثباتًا وجاهزية تغليف وجودة موثوقة وانضباطًا تشغيليًا في كل دفعة. وهذا هو المعيار الذي يصنّع الشحيل وفقه.",
    ctaEyebrow: "اعمل معنا شريكًا",
    ctaTitle: "صنّع علامة مخبوزاتك مع الشحيل",
    ctaText:
      "تحدّث إلى فريقنا حول التصنيع بعلامة خاصة وتطوير المنتجات والتوريد الجاهز للرف.",
    contactUs: "تواصل معنا",
  },
} as const;

export default function PartnersPage({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <>
      <Header locale={locale} />
      <main>
        <PageHero
          eyebrow={t.heroEyebrow}
          title={t.heroTitle}
          subtitle={t.heroSubtitle}
        >
          <a href={localeHref("/contact", locale)} className="btn-primary">
            {t.becomePartner}
          </a>
        </PageHero>

        {/* Manufacturing partners */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              eyebrow={t.partnerEyebrow}
              title={t.partnerTitle}
              description={t.partnerDesc}
            />
            <PartnerProjectGrid className="mt-12" variant="detailed" locale={locale} />
          </div>
        </section>

        {/* Retail presence */}
        <section className="section">
          <div className="container-x">
            <SectionHeading
              eyebrow={t.presenceEyebrow}
              title={t.presenceTitle}
              description={t.presenceDesc}
            />
            <div className="mt-12 overflow-hidden rounded-3xl border border-sand bg-cream">
              <div className="grid grid-cols-2 gap-px bg-sand sm:grid-cols-3 lg:grid-cols-5">
                {retailPresence.map((retailer) => {
                  const assetKey = retailAssetKeys[retailer];
                  const logoPath = assetKey ? assets.retail[assetKey] : null;
                  return (
                    <div
                      key={retailer}
                      className="flex flex-col items-center justify-center gap-3 bg-cream px-4 py-9 text-center"
                    >
                      {hasAsset(logoPath) ? (
                        <Image
                          src={logoPath}
                          alt={getAssetAlt(assetKey!, retailer)}
                          width={48}
                          height={48}
                          className="h-12 w-auto object-contain"
                        />
                      ) : (
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-sand bg-warmwhite font-serif text-sm font-bold text-gold">
                          {monogram(retailer)}
                        </span>
                      )}
                      <span className="font-serif text-sm font-semibold leading-tight text-charcoal sm:text-base">
                        {retailer}
                      </span>
                      {!hasAsset(logoPath) && <AssetHint label={t.logoNeeded} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Market trust copy */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <div className="mx-auto max-w-3xl text-center">
              <SectionHeading
                eyebrow={t.trustEyebrow}
                title={t.trustTitle}
                description={t.trustDesc}
              />
            </div>
          </div>
        </section>

        <CtaBand
          eyebrow={t.ctaEyebrow}
          title={t.ctaTitle}
          text={t.ctaText}
          primary={{ label: t.contactUs, href: localeHref("/contact", locale) }}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
