import SectionHeading from "../SectionHeading";
import TeaserLink from "../TeaserLink";
import { DevelopIcon, ProductionIcon, PackagingIcon, RetailIcon } from "../Icons";

const pillars = [
  { title: "Product idea", Icon: DevelopIcon },
  { title: "Recipe development", Icon: ProductionIcon },
  { title: "Manufacturing", Icon: PackagingIcon },
  { title: "Retail-ready delivery", Icon: RetailIcon },
];

export default function PrivateLabelTeaser() {
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Private Label Solutions"
          title="From idea to shelf, end to end"
          description="One partner across product development, manufacturing, packaging, and retail-ready supply."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className="flex flex-col rounded-2xl border border-sand bg-warmwhite p-6 shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient text-white shadow-card">
                  <pillar.Icon width={22} height={22} />
                </span>
                <span className="font-serif text-sm font-bold text-champagne">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-base font-semibold text-ink">
                {pillar.title}
              </h3>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <TeaserLink href="/private-label" label="Explore Private Label" variant="secondary" />
        </div>
      </div>
    </section>
  );
}
