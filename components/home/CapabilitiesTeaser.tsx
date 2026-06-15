import SectionHeading from "../SectionHeading";
import TeaserLink from "../TeaserLink";
import { DevelopIcon, ProductionIcon, PackagingIcon, RetailIcon } from "../Icons";

const cards = [
  {
    title: "Product Development",
    text: "From brief to finished, shelf-ready product.",
    Icon: DevelopIcon,
  },
  {
    title: "Recipe Customization",
    text: "Formulations tailored to your target market.",
    Icon: ProductionIcon,
  },
  {
    title: "Private Label Manufacturing",
    text: "Production aligned to your brand and category.",
    Icon: PackagingIcon,
  },
  {
    title: "Retail-Ready Supply",
    text: "Consistent, scalable supply to your network.",
    Icon: RetailIcon,
  },
];

export default function CapabilitiesTeaser() {
  return (
    <section className="section bg-warmwhite">
      <div className="container-x">
        <SectionHeading
          eyebrow="Capabilities"
          title="What we bring to your brand"
          description="A full-service manufacturing partner equipped to develop, produce, and supply at retail standard."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-sand bg-cream p-6 shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-beige text-gold">
                <card.Icon width={22} height={22} />
              </span>
              <h3 className="mt-5 font-serif text-base font-semibold text-ink">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">{card.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <TeaserLink href="/capabilities" label="View Capabilities" variant="secondary" />
        </div>
      </div>
    </section>
  );
}
