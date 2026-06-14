import SectionHeading from "./SectionHeading";
import AssetHint from "./AssetHint";
import { productCategories, type ProductIconKey } from "@/lib/content";
import {
  FlatbreadIcon,
  LoafIcon,
  SamoonIcon,
  BunIcon,
  CroissantIcon,
  CroissantLargeIcon,
  PuffPastryIcon,
  MaamoulIcon,
  DateBallIcon,
} from "./Icons";

const iconMap: Record<ProductIconKey, (p: { width?: number; height?: number }) => JSX.Element> = {
  flatbread: FlatbreadIcon,
  loaf: LoafIcon,
  samoon: SamoonIcon,
  bun: BunIcon,
  croissant: CroissantIcon,
  croissantLarge: CroissantLargeIcon,
  puff: PuffPastryIcon,
  maamoul: MaamoulIcon,
  date: DateBallIcon,
};

export default function Products() {
  return (
    <section id="products" className="section bg-warmwhite">
      <div className="container-x">
        <SectionHeading
          eyebrow="What We Manufacture"
          title="A complete bakery product range"
          description="From everyday breads to laminated pastries and date-based snacks — manufactured to consistent, retail-ready quality."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {productCategories.map((product, i) => {
            const Icon = iconMap[product.icon];
            return (
              <div
                key={product.name}
                className="group relative overflow-hidden rounded-2xl border border-sand bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:border-champagne hover:shadow-soft"
              >
                {/* Soft category wash on hover */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-champagne/0 blur-2xl transition-colors duration-300 group-hover:bg-champagne/15" />

                <div className="relative flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient text-white shadow-card">
                    <Icon width={22} height={22} />
                  </span>
                  <span className="font-serif text-sm font-bold text-champagne/60 transition-colors group-hover:text-champagne">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="relative mt-5 font-serif text-lg font-semibold text-ink">
                  {product.name}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-stone">
                  {product.description}
                </p>
                {/* Placeholder cue: replace with a real product photo. */}
                <AssetHint label="Product photo needed" className="relative mt-4" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
