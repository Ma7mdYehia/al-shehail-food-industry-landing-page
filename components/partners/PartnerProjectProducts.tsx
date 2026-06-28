import Image from "next/image";
import AssetHint from "@/components/AssetHint";
import type {
  PartnerProjectProduct,
  PartnerProductStatus,
} from "@/lib/partnerProjects";

// Derive a clean monogram from a product name (e.g. "Healthy Toast" -> "HT").
function monogram(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Public-facing, conservative status labels. "needs-data" maps to "Spec pending"
// to stay honest about the verified-specification-sheet placeholder state.
const STATUS_LABEL: Record<PartnerProductStatus, string> = {
  active: "Active",
  planned: "Planned",
  "needs-data": "Spec pending",
};

const STATUS_CLASS: Record<PartnerProductStatus, string> = {
  active: "bg-gold-gradient text-white",
  planned: "border border-champagne bg-warmwhite text-gold",
  "needs-data": "border border-sand bg-beige text-stone",
};

function StatusBadge({ status }: { status: PartnerProductStatus }) {
  return (
    <span
      className={`inline-flex flex-none items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export default function PartnerProjectProducts({
  products,
}: {
  products: PartnerProjectProduct[];
}) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li
          key={product.slug}
          className="flex flex-col overflow-hidden rounded-2xl border border-sand bg-warmwhite"
        >
          {/* Image, or a warm placeholder until product photography is supplied */}
          <div className="relative flex aspect-[3/2] items-center justify-center border-b border-sand bg-beige bg-dotted-gold">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 280px"
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-sand bg-warmwhite font-serif text-base font-bold text-gold">
                  {monogram(product.name)}
                </span>
                <AssetHint label="Product photo pending" />
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-1.5 p-4">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-serif text-base font-semibold leading-tight text-ink">
                {product.name}
              </h4>
              <StatusBadge status={product.status} />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gold">
              {product.category}
            </span>
            <p className="text-sm leading-relaxed text-stone">
              {product.shortDescription}
            </p>
            <span className="mt-auto pt-2 text-[11px] font-medium text-stone/70">
              Details coming soon
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
