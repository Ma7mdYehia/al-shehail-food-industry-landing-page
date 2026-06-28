import Image from "next/image";
import Link from "next/link";
import ProductIcon from "../ProductIcon";
import type { Product } from "@/lib/products";
import {
  assets,
  hasAsset,
  getAssetAlt,
  productAssetKeyBySlug,
} from "@/lib/assets";

// Homepage-only simplified product card used by the "What We Manufacture"
// teaser. Keeps the premium media + category badge of the catalog card but
// drops use-cases, variants, and the "View Product" affordance. The whole card
// stays clickable. The /products catalog keeps its own richer ProductCard.
export default function HomeProductCard({ product }: { product: Product }) {
  const assetKey = productAssetKeyBySlug[product.slug];
  const photoPath = assetKey ? assets.products[assetKey] : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card-lift group flex flex-col overflow-hidden rounded-2xl border border-sand bg-cream transition-colors hover:border-champagne/60 hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      {/* Media */}
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-beige via-cream to-sand">
        {hasAsset(photoPath) ? (
          <Image
            src={photoPath}
            alt={getAssetAlt(assetKey!, product.name)}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <>
            {/* Soft oven glow + dotted texture */}
            <div className="oven-glow pointer-events-none absolute inset-0" aria-hidden />
            <div className="bg-dotted-gold pointer-events-none absolute inset-0 opacity-50" aria-hidden />
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-champagne/15 blur-2xl" />

            {/* Pseudo-3D icon tile */}
            <span className="tilt relative flex h-20 w-20 items-center justify-center rounded-2xl border border-sand bg-warmwhite/90 text-gold shadow-card backdrop-blur">
              <span
                className="absolute inset-0 -z-10 translate-x-1 translate-y-1 rounded-2xl bg-champagne/15"
                aria-hidden
              />
              <ProductIcon type={product.iconType} width={36} height={36} />
            </span>
          </>
        )}

        {/* Category badge */}
        <span className="absolute left-4 top-4 rounded-full border border-sand bg-warmwhite/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold backdrop-blur">
          {product.category}
        </span>
      </div>

      {/* Body — name + short description only */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-lg font-semibold text-ink">
          {product.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-stone">
          {product.shortDescription}
        </p>
      </div>
    </Link>
  );
}
