import type { ComponentType } from "react";
import SectionHeading from "../SectionHeading";

// Reusable "what the service covers" grid of premium icon cards. Shared by the
// services pages (distribution, brand design, digital marketing).
export type ServiceFeature = {
  title: string;
  description: string;
  Icon?: ComponentType<{ width?: number; height?: number }>;
};

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  items: ServiceFeature[];
};

export default function ServiceFeatureGrid({
  eyebrow,
  title,
  description,
  items,
}: Props) {
  return (
    <>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="card-lift group rounded-2xl border border-sand bg-warmwhite p-6 shadow-card transition-colors hover:border-champagne/60"
          >
            {item.Icon && (
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-beige text-gold transition-colors group-hover:bg-gold-gradient group-hover:text-white">
                <item.Icon width={22} height={22} />
              </span>
            )}
            <h3 className="mt-5 font-serif text-lg font-semibold text-ink">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
