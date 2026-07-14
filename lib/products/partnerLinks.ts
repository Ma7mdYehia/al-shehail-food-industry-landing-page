import { getProductBySlug } from "./catalog";

// Partner-project product names are sometimes brand-specific while the public
// catalog uses the standardized manufacturing-range slug. This map connects
// every partner SKU to the closest live catalog product so cards can reuse the
// same photography and link to a real product detail page.
export const catalogSlugByPartnerProductSlug: Record<string, string> = {
  "healthy-flatbread": "arabic-bread",
  "healthy-toast": "toast",
  "burger-buns": "burger-buns",
  samoon: "bread-rolls",
  "high-protein-bread": "high-protein-bread-wrap",
  "high-fiber-bread": "high-fiber-bread-wrap",
  "whole-wheat-bread": "whole-grains-bread-wrap",
  "oats-bread": "oats-bread-wrap",
  "chia-bread": "chia-bread-wrap",
  "black-seed-bread": "black-seed-bread-wrap",
  "mini-croissant": "mini-croissant",
  toast: "toast",
  maamoul: "maamoul",
  "large-croissant": "croissant",
  pate: "pate",
  tamriya: "tamriya",
};

export function getCatalogSlugForPartnerProduct(slug: string): string | null {
  const catalogSlug = catalogSlugByPartnerProductSlug[slug] ?? slug;
  return getProductBySlug(catalogSlug) ? catalogSlug : null;
}
