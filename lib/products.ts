// Centralized product taxonomy for Al Shehail Food Industries.
// This is the single source of truth for categories and products across the
// Home product section, the /products catalog, and (Sprint 2) product detail
// pages. No unverified figures are included.

import type { ProductIconType } from "@/components/ProductIcon";

export type { ProductIconType };

export type ProductCategory = {
  name: string;
  slug: string;
  description: string;
};

export type Product = {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  shortDescription: string;
  cardDescription: string;
  useCases: string[];
  privateLabelOptions: string[];
  imagePlaceholderLabel: string;
  iconType: ProductIconType;
};

export const productCategories: ProductCategory[] = [
  {
    name: "Flat Bread",
    slug: "flat-bread",
    description:
      "Authentic regional flatbreads — soft, foldable, and produced for everyday retail and foodservice demand.",
  },
  {
    name: "Soft Bread",
    slug: "soft-bread",
    description:
      "Soft, consistent breads engineered for shelf life, slicing, and reliable sandwich and burger builds.",
  },
  {
    name: "French Bakery",
    slug: "french-bakery",
    description:
      "Laminated and layered French-style bakery — croissants and puff pastry for premium bakery and cafe shelves.",
  },
  {
    name: "Date Sweets",
    slug: "date-sweets",
    description:
      "Traditional date-based sweets and filled pastries for seasonal gifting, retail confectionery, and snacking.",
  },
];

export const products: Product[] = [
  // 1. Flat Bread
  {
    name: "Arabic Bread",
    slug: "arabic-bread",
    category: "Flat Bread",
    categorySlug: "flat-bread",
    shortDescription: "Traditional round Arabic flatbread, soft and foldable.",
    cardDescription:
      "Authentic Arabic flatbread produced for consistent texture and everyday retail demand.",
    useCases: ["Retail shelf packs", "Shawarma & foodservice", "Institutional catering"],
    privateLabelOptions: [
      "Branded retail packaging",
      "Pack count & size options",
      "Recipe & size customization",
    ],
    imagePlaceholderLabel: "Arabic bread photo",
    iconType: "flatbread",
  },
  {
    name: "Bread Wraps",
    slug: "bread-wraps",
    category: "Flat Bread",
    categorySlug: "flat-bread",
    shortDescription: "Thin, pliable wraps for sandwiches and rolls.",
    cardDescription:
      "Soft, flexible wraps engineered to hold fillings without tearing.",
    useCases: ["Wraps & sandwiches", "Foodservice chains", "Grab-and-go retail"],
    privateLabelOptions: [
      "Multiple diameters",
      "Plain & flavored variants",
      "Branded film packaging",
    ],
    imagePlaceholderLabel: "Bread wraps photo",
    iconType: "flatbread",
  },

  // 2. Soft Bread
  {
    name: "Toast",
    slug: "toast",
    category: "Soft Bread",
    categorySlug: "soft-bread",
    shortDescription: "Soft sandwich loaves with an even, sliceable crumb.",
    cardDescription:
      "Consistent toast loaves engineered for shelf life, slicing, and sandwich builds.",
    useCases: ["Retail sandwich bread", "Foodservice toasting", "Breakfast ranges"],
    privateLabelOptions: [
      "White, brown & milk variants",
      "Loaf size & slice thickness",
      "Branded bag packaging",
    ],
    imagePlaceholderLabel: "Toast loaf photo",
    iconType: "loaf",
  },
  {
    name: "Burger Buns",
    slug: "burger-buns",
    category: "Soft Bread",
    categorySlug: "soft-bread",
    shortDescription: "Structured buns with a soft crumb for foodservice and retail.",
    cardDescription:
      "Reliable burger buns with the structure to hold builds and a soft, even crumb.",
    useCases: ["QSR & foodservice", "Retail bun multipacks", "Catering"],
    privateLabelOptions: [
      "Seeded & plain tops",
      "Diameter & weight options",
      "Branded multipacks",
    ],
    imagePlaceholderLabel: "Burger buns photo",
    iconType: "bun",
  },
  {
    name: "Bread Rolls",
    slug: "bread-rolls",
    category: "Soft Bread",
    categorySlug: "soft-bread",
    shortDescription: "Soft dinner and sandwich rolls in versatile formats.",
    cardDescription:
      "Versatile soft rolls for sandwiches, sliders, and hospitality table service.",
    useCases: ["Sliders & mini sandwiches", "Hospitality table service", "Retail packs"],
    privateLabelOptions: [
      "Plain, seeded & milk variants",
      "Roll size & shape",
      "Branded packaging",
    ],
    imagePlaceholderLabel: "Bread rolls photo",
    iconType: "samoon",
  },

  // 3. French Bakery
  {
    name: "Croissant",
    slug: "croissant",
    category: "French Bakery",
    categorySlug: "french-bakery",
    shortDescription: "Laminated butter-style croissants with flaky layers.",
    cardDescription:
      "Premium laminated croissants with crisp, flaky layers for bakery and cafe shelves.",
    useCases: ["Cafe & bakery counters", "Hotel breakfast", "Premium retail"],
    privateLabelOptions: [
      "Plain & filled variants",
      "Baked or ready-to-bake frozen",
      "Branded packaging",
    ],
    imagePlaceholderLabel: "Croissant photo",
    iconType: "croissantLarge",
  },
  {
    name: "Mini Croissant",
    slug: "mini-croissant",
    category: "French Bakery",
    categorySlug: "french-bakery",
    shortDescription: "Bite-size laminated croissants for grab-and-go.",
    cardDescription:
      "Laminated mini croissants ideal for grab-and-go, breakfast packs, and platters.",
    useCases: ["Grab-and-go retail", "Breakfast buffets", "Snacking multipacks"],
    privateLabelOptions: [
      "Plain & filled",
      "Multipack counts",
      "Frozen or baked supply",
    ],
    imagePlaceholderLabel: "Mini croissant photo",
    iconType: "croissant",
  },
  {
    name: "Pate",
    slug: "pate",
    category: "French Bakery",
    categorySlug: "french-bakery",
    shortDescription: "Layered puff pastry products, sweet and savory.",
    cardDescription:
      "Layered puff pastry products across sweet and savory formats for varied ranges.",
    useCases: ["Savory snacks", "Sweet pastries", "Cafe & retail ranges"],
    privateLabelOptions: [
      "Sweet & savory fillings",
      "Shape & size options",
      "Frozen ready-to-bake",
    ],
    imagePlaceholderLabel: "Pate / puff pastry photo",
    iconType: "puff",
  },

  // 4. Date Sweets
  {
    name: "Maa'moul",
    slug: "maamoul",
    category: "Date Sweets",
    categorySlug: "date-sweets",
    shortDescription: "Filled semolina pastries with date and nut centers.",
    cardDescription:
      "Traditional filled maa'moul with date and nut centers for seasonal and year-round sales.",
    useCases: ["Seasonal gifting", "Retail confectionery", "Hospitality"],
    privateLabelOptions: [
      "Date, pistachio & walnut fills",
      "Gift & retail packaging",
      "Assorted boxes",
    ],
    imagePlaceholderLabel: "Maa'moul photo",
    iconType: "maamoul",
  },
  {
    name: "Tamriya",
    slug: "tamriya",
    category: "Date Sweets",
    categorySlug: "date-sweets",
    shortDescription: "Wholesome date-based sweets and balls.",
    cardDescription:
      "Date-based tamriya sweets built for the health-aware shopper and snacking ranges.",
    useCases: ["Healthy snacking", "Retail confectionery", "On-the-go formats"],
    privateLabelOptions: [
      "Coatings & inclusions",
      "Pack formats",
      "Branded retail packaging",
    ],
    imagePlaceholderLabel: "Tamriya photo",
    iconType: "date",
  },
];

// Convenience: products grouped by category, preserving category order.
export const productsByCategory = productCategories.map((category) => ({
  category,
  items: products.filter((p) => p.categorySlug === category.slug),
}));

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
