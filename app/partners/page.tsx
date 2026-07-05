import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: { absolute: "الشركاء والحضور في السوق | الشحيل للصناعات الغذائية الإمارات" },
  description:
    "تعرّف على شركاء التصنيع لدى الشحيل للصناعات الغذائية وحضورها في كبرى سلاسل التجزئة بالإمارات، عبر دعم العلامات الغذائية بتصنيع بعلامة خاصة وإنتاج جاهز للرف.",
  alternates: { canonical: "/partners" },
};

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

export default function PartnersPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="الشركاء والحضور"
          title="شركاء التصنيع والحضور في السوق"
          subtitle="تدعم الشحيل للصناعات الغذائية العلامات الغذائية وتوريد التجزئة عبر تصنيع بعلامة خاصة، وتطوير المنتجات، وإنتاج جاهز للسوق."
        >
          <a href="/contact" className="btn-primary">
            كن شريكًا
          </a>
        </PageHero>

        {/* Manufacturing partners */}
        <section className="section border-t border-sand/60 bg-warmwhite">
          <div className="container-x">
            <SectionHeading
              eyebrow="شركاء وثقوا في تصنيع منتجاتهم"
              title="موثوقون لدى علامات غذائية راسخة"
              description="نطوّر وننتج تشكيلات مخبوزات بعلامة خاصة لعلامات غذائية راسخة في الإمارات."
            />
            {/* Clickable partner cards — each opens its project detail modal */}
            <PartnerProjectGrid className="mt-12" variant="detailed" />
          </div>
        </section>

        {/* Retail presence */}
        <section className="section">
          <div className="container-x">
            <SectionHeading
              eyebrow="الحضور في السوق"
              title="متوفرون في كبرى منافذ التجزئة بالإمارات"
              description="تصل منتجاتنا إلى المتسوقين عبر كبرى الهايبرماركت، والجمعيات التعاونية، وسلاسل البقالة الراقية في جميع أنحاء الإمارات."
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
                    {!hasAsset(logoPath) && <AssetHint label="شعار التجزئة مطلوب" />}
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
                eyebrow="ثقة السوق"
                title="حضور مبني على انضباط تشغيلي"
                description="الوصول إلى بيئات التجزئة الكبرى والبقاء فيها يتطلب ثباتًا، وجاهزية تغليف، وجودة موثوقة، وانضباطًا تشغيليًا في كل دفعة. هذا هو المعيار الذي تصنّع الشحيل وفقه."
              />
            </div>
          </div>
        </section>

        <CtaBand
          eyebrow="كن شريكًا معنا"
          title="صنّع علامتك من المخبوزات مع الشحيل"
          text="تحدّث مع فريقنا عن التصنيع بعلامة خاصة، وتطوير المنتجات، والتوريد الجاهز للرف."
          primary={{ label: "تواصل معنا", href: "/contact" }}
        />
      </main>
      <Footer />
    </>
  );
}
