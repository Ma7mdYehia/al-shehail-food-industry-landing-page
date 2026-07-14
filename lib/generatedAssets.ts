// Central mapping for the generated WebP artwork in /public/assets/generated.
// Keeping these paths together makes it clear which generated image belongs to
// each existing UI slot without changing the content or layout of those slots.

export const generatedAssets = {
  homepageHero: {
    open: "/assets/generated/hero-ecosystem-open.webp",
    manufacturing: "/assets/generated/hero-private-label-manufacturing.webp",
    brandDesign: "/assets/generated/hero-packaging-brand-design.webp",
    distribution: "/assets/generated/hero-distribution-retail-reach.webp",
    digitalMarketing: "/assets/generated/hero-food-digital-marketing.webp",
    close: "/assets/generated/hero-ecosystem-close.webp",
  },
  pageHeaders: {
    about: "/assets/generated/header-about.webp",
    products: "/assets/generated/header-products-directory.webp",
    contact: "/assets/generated/header-contact.webp",
    privateLabel: "/assets/generated/header-private-label.webp",
    services: {
      distribution: "/assets/generated/header-distribution.webp",
      "brand-design": "/assets/generated/header-brand-design.webp",
      "digital-marketing": "/assets/generated/header-digital-marketing.webp",
    },
  },
  sectionBackgrounds: {
    about: "/assets/generated/about-al-shehail-background.webp",
    finalCta: "/assets/generated/final-cta-background.webp",
  },
} as const;

export const generatedProductHeaders: Record<string, string> = {
  "arabic-bread": "/assets/generated/header-product-arabic-bread.webp",
  "high-protein-bread-wrap": "/assets/generated/header-product-high-protein-wrap.webp",
  "high-fiber-bread-wrap": "/assets/generated/header-product-high-fiber-wrap.webp",
  "chia-bread-wrap": "/assets/generated/header-product-chia-wrap.webp",
  "oats-bread-wrap": "/assets/generated/header-product-oats-wrap.webp",
  "barley-bread-wrap": "/assets/generated/header-product-barley-wrap.webp",
  "black-seed-bread-wrap": "/assets/generated/header-product-black-seed-wrap.webp",
  "whole-grains-bread-wrap": "/assets/generated/header-product-whole-grains-wrap.webp",
  toast: "/assets/generated/header-product-toast.webp",
  "burger-buns": "/assets/generated/header-product-burger-buns.webp",
  "bread-rolls": "/assets/generated/header-product-bread-rolls.webp",
  croissant: "/assets/generated/header-product-croissant.webp",
  "mini-croissant": "/assets/generated/header-product-mini-croissant.webp",
  pate: "/assets/generated/header-product-pate.webp",
  maamoul: "/assets/generated/header-product-maamoul.webp",
  tamriya: "/assets/generated/header-product-tamriya.webp",
  cookies: "/assets/generated/header-product-cookies.webp",
};
