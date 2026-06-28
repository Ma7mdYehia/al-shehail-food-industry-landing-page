// Centralized asset manifest for Al Shehail Food Industries.
//
// All paths are null until the real file is dropped into /public/assets/.
// Components check hasAsset() / getAsset() and fall back to their existing
// placeholder when the path is null — nothing breaks without the files.
//
// Folder layout:
//   /public/assets/brand/          — logo, favicon
//   /public/assets/partners/       — manufacturing partner logos
//   /public/assets/products/       — product photos (one per product slug)
//   /public/assets/factory/        — hero and production photography
//   /public/assets/certifications/ — certificate scans / certifying-body logos
//   /public/assets/retail/         — retail chain logos
//   /public/assets/og/             — Open Graph / social share image

// ── Types ──────────────────────────────────────────────────────────────────

export type AssetPath = string | null;

export type BrandAssets = {
  logoHorizontal: AssetPath; // header + footer
  logoMark: AssetPath;       // favicon / square icon
};

export type PartnerAssets = {
  halsaBake: AssetPath;
  ektifa: AssetPath;
  alTaj: AssetPath;
  alTahan: AssetPath;
};

export type ProductAssets = {
  arabicBread: AssetPath;
  breadWraps: AssetPath;
  toast: AssetPath;
  burgerBuns: AssetPath;
  breadRolls: AssetPath;
  croissant: AssetPath;
  miniCroissant: AssetPath;
  pate: AssetPath;
  maamoul: AssetPath;
  tamriya: AssetPath;
  cookies: AssetPath;
};

export type FactoryAssets = {
  exterior: AssetPath;       // hero visual
  productionLine: AssetPath;
  packagingLine: AssetPath;
  qualityControl: AssetPath;
  warehousing: AssetPath;
};

export type CertificationAssets = {
  iso: AssetPath;
  haccp: AssetPath;
  organic: AssetPath;
  carrefourApproved: AssetPath;
};

export type RetailAssets = {
  carrefour: AssetPath;
  unionCoop: AssetPath;
  abuDhabiCoop: AssetPath;
  sharjahCoop: AssetPath;
  alMayaGroup: AssetPath;
  luluHypermarket: AssetPath;
  nestoHypermarket: AssetPath;
  grandiose: AssetPath;
  spinneys: AssetPath;
  waitroseUae: AssetPath;
};

export type OgAssets = {
  default: AssetPath; // 1200×630 social share image
};

export type AssetManifest = {
  brand: BrandAssets;
  partners: PartnerAssets;
  products: ProductAssets;
  factory: FactoryAssets;
  certifications: CertificationAssets;
  retail: RetailAssets;
  og: OgAssets;
};

// ── Manifest ───────────────────────────────────────────────────────────────
// Drop the real file into /public/assets/<folder>/<filename> and update the
// path here (e.g. "/assets/brand/al-shehail-logo.svg"). The component will
// automatically use the real asset on next build.

export const assets: AssetManifest = {
  brand: {
    logoHorizontal: null, // /assets/brand/al-shehail-logo.svg
    logoMark: null,       // /assets/brand/al-shehail-mark.svg
  },

  partners: {
    halsaBake: "/assets/partners/halsa-bake.png",
    ektifa: "/assets/partners/ektifa.png",
    alTaj: null,
    alTahan: "/assets/partners/al-tahan.png",
  },

  products: {
    arabicBread: null,    // /assets/products/arabic-bread.webp (pending)
    breadWraps: null,     // /assets/products/bread-wraps.webp (pending)
    toast: "/assets/products/toast.webp",
    burgerBuns: "/assets/products/burger-buns.webp",
    breadRolls: "/assets/products/bread-rolls.webp",
    croissant: "/assets/products/croissant.webp",
    miniCroissant: "/assets/products/mini-croissant.webp",
    pate: "/assets/products/pate.webp",
    maamoul: "/assets/products/maamoul.webp",
    tamriya: "/assets/products/tamriya.webp",
    cookies: "/assets/products/cookies.webp",
  },

  factory: {
    exterior: null,       // /assets/factory/exterior.webp
    productionLine: null, // /assets/factory/production-line.webp
    packagingLine: null,  // /assets/factory/packaging-line.webp
    qualityControl: null, // /assets/factory/quality-control.webp
    warehousing: null,    // /assets/factory/warehousing.webp
  },

  certifications: {
    iso: null,              // /assets/certifications/iso.svg (or .webp)
    haccp: null,            // /assets/certifications/haccp.svg (or .webp)
    organic: null,          // /assets/certifications/organic.svg (or .webp)
    carrefourApproved: null, // /assets/certifications/carrefour-approved.svg (or .webp)
  },

  retail: {
    carrefour: "/assets/retail/carrefour.png",
    unionCoop: "/assets/retail/union-coop.png",
    abuDhabiCoop: "/assets/retail/abu-dhabi-coop.png",
    sharjahCoop: "/assets/retail/sharjah-coop.png",
    alMayaGroup: "/assets/retail/al-maya-group.png",
    luluHypermarket: "/assets/retail/lulu-hypermarket.png",
    nestoHypermarket: "/assets/retail/nesto-hypermarket.png",
    grandiose: "/assets/retail/grandiose.png",
    spinneys: "/assets/retail/spinneys.png",
    waitroseUae: "/assets/retail/waitrose-uae.png",
  },

  og: {
    default: null, // /assets/og/al-shehail-og.jpg (1200×630)
  },
};

// Single source of truth mapping a product slug → its key in assets.products.
// Used by every product card / detail view so the slug→asset wiring lives in
// one place.
export const productAssetKeyBySlug: Record<string, keyof ProductAssets> = {
  "arabic-bread": "arabicBread",
  "bread-wraps": "breadWraps",
  toast: "toast",
  "burger-buns": "burgerBuns",
  "bread-rolls": "breadRolls",
  croissant: "croissant",
  "mini-croissant": "miniCroissant",
  pate: "pate",
  maamoul: "maamoul",
  tamriya: "tamriya",
  cookies: "cookies",
};

// ── Helpers ────────────────────────────────────────────────────────────────

/** Returns true only when a real file path is registered. */
export function hasAsset(path: AssetPath): path is string {
  return typeof path === "string" && path.length > 0;
}

/** Resolves a product slug to its registered photo path (or null). */
export function getProductAsset(slug: string): AssetPath {
  const key = productAssetKeyBySlug[slug];
  return key ? assets.products[key] : null;
}

/**
 * Returns the asset path when present, or the provided fallback string.
 * Use the fallback for an existing placeholder value, e.g. a monogram string
 * or a data-URI, so the UI stays intact when the real file isn't yet supplied.
 */
export function getAsset(path: AssetPath, fallback: string): string;
export function getAsset(path: AssetPath): string | null;
export function getAsset(path: AssetPath, fallback?: string): string | null {
  if (hasAsset(path)) return path;
  return fallback ?? null;
}

/** Alt-text map for every asset key. */
const altTexts: Record<string, string> = {
  // brand
  logoHorizontal: "Al Shehail Food Industries",
  logoMark: "Al Shehail Food Industries mark",

  // partners
  halsaBake: "HÄLSA Bake",
  ektifa: "EKTIFA",
  alTaj: "Al Taj",
  alTahan: "Al Tahan",

  // products
  arabicBread: "Arabic bread",
  breadWraps: "Bread wraps",
  toast: "Toast loaf",
  burgerBuns: "Burger buns",
  breadRolls: "Bread rolls",
  croissant: "Croissant",
  miniCroissant: "Mini croissant",
  pate: "Pâte / puff pastry",
  maamoul: "Maa'moul",
  tamriya: "Tamriya",
  cookies: "Cookies",

  // factory
  exterior: "Al Shehail factory exterior",
  productionLine: "Bakery production line",
  packagingLine: "Private label packaging line",
  qualityControl: "Quality control",
  warehousing: "Warehousing and dispatch",

  // certifications
  iso: "ISO Certified",
  haccp: "HACCP Certified",
  organic: "Organic Certified",
  carrefourApproved: "Carrefour Approved",

  // retail
  carrefour: "Carrefour",
  unionCoop: "Union Coop",
  abuDhabiCoop: "Abu Dhabi Coop",
  sharjahCoop: "Sharjah Coop",
  alMayaGroup: "Al Maya Group",
  luluHypermarket: "Lulu Hypermarket",
  nestoHypermarket: "Nesto Hypermarket",
  grandiose: "Grandiose Supermarket",
  spinneys: "Spinneys",
  waitroseUae: "Waitrose UAE",

  // og
  default: "Al Shehail Food Industries — UAE Bakery Manufacturing & Private Label Partner",
};

/** Returns the alt text for an asset key, with an optional fallback. */
export function getAssetAlt(key: string, fallback = ""): string {
  return altTexts[key] ?? fallback;
}
