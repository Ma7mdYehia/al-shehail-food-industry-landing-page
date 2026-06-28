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
  /** Optional flavor/functional variants shown as chips (e.g. flatbread range). */
  variants?: string[];
  /** Included in the homepage "Featured" filter when true. */
  featured?: boolean;
};

export const productCategories: ProductCategory[] = [
  {
    name: "Flatbread & Wraps",
    slug: "flatbread-wraps",
    description:
      "Arabic flatbread and pliable wraps — including functional and flavored flatbread directions — produced for everyday retail and foodservice demand.",
  },
  {
    name: "Bread & Toast",
    slug: "bread-toast",
    description:
      "Soft, sliceable loaves engineered for shelf life, slicing, and reliable sandwich and breakfast builds.",
  },
  {
    name: "Buns & Rolls",
    slug: "buns-rolls",
    description:
      "Structured buns and soft rolls for foodservice, retail multipacks, and hospitality table service.",
  },
  {
    name: "Pastry",
    slug: "pastry",
    description:
      "Laminated and layered French-style bakery — croissants, mini croissants, and puff pastry for premium bakery and cafe shelves.",
  },
  {
    name: "Sweets",
    slug: "sweets",
    description:
      "Traditional date-based sweets — maa'moul and tamriya — for seasonal gifting, retail confectionery, and snacking.",
  },
];

export const products: Product[] = [
  // 1. Flatbread & Wraps
  {
    name: "Arabic Bread",
    slug: "arabic-bread",
    category: "Flatbread & Wraps",
    categorySlug: "flatbread-wraps",
    featured: true,
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
    category: "Flatbread & Wraps",
    categorySlug: "flatbread-wraps",
    featured: true,
    shortDescription: "Thin, pliable wraps and flatbread across functional, flavored directions.",
    cardDescription:
      "Soft, flexible wraps and flatbread engineered to hold fillings without tearing, with functional and flavored variants.",
    useCases: ["Wraps & sandwiches", "Foodservice chains", "Grab-and-go retail"],
    privateLabelOptions: [
      "Multiple diameters",
      "Plain & flavored variants",
      "Branded film packaging",
    ],
    // Flatbread flavor / functional variants — represented as chips, not as
    // separate product cards in the grid.
    variants: [
      "Turmeric",
      "High Protein",
      "High Fiber",
      "Whole Wheat",
      "Oats",
      "Barley",
      "Black Seed",
      "Chia",
    ],
    imagePlaceholderLabel: "Bread wraps photo",
    iconType: "flatbread",
  },

  // 2. Bread & Toast
  {
    name: "Toast",
    slug: "toast",
    category: "Bread & Toast",
    categorySlug: "bread-toast",
    featured: true,
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
    category: "Buns & Rolls",
    categorySlug: "buns-rolls",
    featured: true,
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
    category: "Buns & Rolls",
    categorySlug: "buns-rolls",
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

  // 3. Pastry
  {
    name: "Croissant",
    slug: "croissant",
    category: "Pastry",
    categorySlug: "pastry",
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
    category: "Pastry",
    categorySlug: "pastry",
    featured: true,
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
    category: "Pastry",
    categorySlug: "pastry",
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

  // 4. Sweets
  {
    name: "Maa'moul",
    slug: "maamoul",
    category: "Sweets",
    categorySlug: "sweets",
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
    category: "Sweets",
    categorySlug: "sweets",
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

// Hand-picked highlight set for the homepage "Featured" filter.
export const featuredProducts = products.filter((p) => p.featured);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/* ---------------------------------------------------------------------------
 * Product detail content
 * Per-product positioning, overview, expanded use cases, and recipe options
 * for the /products/[slug] solution pages. Generic section content (private
 * label framing, packaging, quality, disclaimer) is shared below.
 * ------------------------------------------------------------------------- */

export type ProductDetail = {
  positioning: string;
  overview: string[];
  detailUseCases: string[];
  recipeOptions: string[];
};

export const productDetails: Record<string, ProductDetail> = {
  "arabic-bread": {
    positioning:
      "Everyday Arabic flatbread, manufactured for consistent quality across retail and institutional supply.",
    overview: [
      "Arabic bread is one of the region's highest-demand everyday breads. As a manufacturing category, the focus is on a soft, foldable texture and dependable batch-to-batch consistency at volume.",
      "Al Shehail produces Arabic bread for retail shelves and institutional supply, with formats and recipes that can be adapted to a brand's target market and price positioning.",
    ],
    detailUseCases: [
      "Retail shelves",
      "Supermarkets / hypermarkets",
      "Cafes / foodservice",
      "Institutional & catering supply",
      "Private label brands",
    ],
    recipeOptions: [
      "Standard recipe",
      "Whole wheat / fiber-focused variations where suitable",
      "No preservatives where shelf life and process allow",
      "Size / weight / format customization",
    ],
  },
  "bread-wraps": {
    positioning:
      "Soft, flexible wraps manufactured for sandwiches, cafes, foodservice, and retail packs.",
    overview: [
      "Bread wraps are a flexible flatbread format built to hold fillings without tearing. As a manufacturing category, the priority is pliability, consistent diameter, and clean folding performance.",
      "We manufacture wraps for sandwich and foodservice operators as well as retail packs, with flexible sizing to match different applications and brand briefs.",
    ],
    detailUseCases: [
      "Wraps & sandwiches",
      "Cafes / foodservice",
      "Retail packs",
      "Grab-and-go ranges",
      "Private label brands",
    ],
    recipeOptions: [
      "Standard recipe",
      "Whole wheat / fiber-focused variations where suitable",
      "Flavored variations where relevant",
      "No preservatives where shelf life and process allow",
      "Size / diameter / format customization",
    ],
  },
  toast: {
    positioning:
      "Sliced sandwich bread with a soft crumb, manufactured shelf-ready for family retail packs.",
    overview: [
      "Toast and sandwich bread is a staple retail category where soft crumb, even slicing, and reliable shelf life are essential. As a manufacturing category, consistency across every loaf is the priority.",
      "Al Shehail produces sliced bread for family retail packs and sandwich use, with recipes and loaf formats that can be tailored to brand and market.",
    ],
    detailUseCases: [
      "Family retail packs",
      "Sandwich production",
      "Supermarkets / hypermarkets",
      "Foodservice toasting",
      "Private label brands",
    ],
    recipeOptions: [
      "Standard recipe",
      "Whole wheat / fiber-focused variations where suitable",
      "Reduced sugar where suitable",
      "No preservatives where shelf life and process allow",
      "Loaf size / slice thickness customization",
    ],
  },
  "burger-buns": {
    positioning:
      "Burger buns built with structure and consistency for foodservice and retail.",
    overview: [
      "Burger buns are a foodservice and retail category where structure, soft crumb, and consistent sizing directly affect the final build. As a manufacturing category, repeatability is critical.",
      "We manufacture burger buns in different sizes for QSR, foodservice, and retail multipacks, with topping and format options matched to the brand brief.",
    ],
    detailUseCases: [
      "QSR & foodservice",
      "Retail bun multipacks",
      "Catering",
      "Private label brands",
    ],
    recipeOptions: [
      "Standard recipe",
      "Seeded & topping variations",
      "Whole wheat / fiber-focused variations where suitable",
      "No preservatives where shelf life and process allow",
      "Diameter / weight / format customization",
    ],
  },
  "bread-rolls": {
    positioning:
      "Soft rolls for meals and sandwiches, manufactured for foodservice, retail, and private label packs.",
    overview: [
      "Bread rolls are a versatile soft-bread category for meals, sliders, and sandwiches. As a manufacturing category, the focus is a tender crumb and consistent shape across formats.",
      "Al Shehail manufactures rolls for hospitality and foodservice as well as retail and private label packs, with size and shape options to suit the application.",
    ],
    detailUseCases: [
      "Hospitality & foodservice",
      "Sliders & mini sandwiches",
      "Retail packs",
      "Private label brands",
    ],
    recipeOptions: [
      "Standard recipe",
      "Whole wheat / fiber-focused variations where suitable",
      "Seeded & flavor variations",
      "No preservatives where shelf life and process allow",
      "Size / shape / format customization",
    ],
  },
  croissant: {
    positioning:
      "Laminated croissants, plain or filled, manufactured for retail and cafe supply.",
    overview: [
      "Croissants are a laminated bakery category defined by crisp, flaky layers and a rich crumb. As a manufacturing category, lamination consistency and bake quality are the priorities.",
      "We manufacture plain and filled croissants for cafe, bakery, and premium retail supply, available in baked or ready-to-bake formats depending on the brief.",
    ],
    detailUseCases: [
      "Cafes & bakery counters",
      "Hotel breakfast",
      "Premium retail",
      "Private label brands",
    ],
    recipeOptions: [
      "Standard laminated recipe",
      "Plain or filled options",
      "Reduced sugar where suitable",
      "Size / weight / format customization",
      "Baked or ready-to-bake frozen format where suitable",
    ],
  },
  "mini-croissant": {
    positioning:
      "Bite-size laminated croissants for grab-and-go, multipack, and breakfast or snack ranges.",
    overview: [
      "Mini croissants bring laminated bakery quality to smaller, snackable formats. As a manufacturing category, the focus is consistent size and lamination at higher piece counts.",
      "Al Shehail manufactures plain and filled mini croissants for grab-and-go retail, breakfast, and snacking multipacks, in baked or frozen supply formats.",
    ],
    detailUseCases: [
      "Grab-and-go retail",
      "Breakfast & snack ranges",
      "Multipacks",
      "Private label brands",
    ],
    recipeOptions: [
      "Standard laminated recipe",
      "Plain or filled options",
      "Reduced sugar where suitable",
      "Multipack count / format customization",
      "Baked or frozen supply where suitable",
    ],
  },
  pate: {
    positioning:
      "Layered puff pastry in savory and sweet formats, with filled options for cafe, retail, and freezer ranges where suitable.",
    overview: [
      "Pate (puff pastry) is a layered bakery category spanning savory and sweet formats. As a manufacturing category, the priority is even lamination and reliable rise across shapes.",
      "We manufacture filled and unfilled puff pastry products for cafe, retail, and freezer ranges where suitable, with shapes and fillings matched to the product brief.",
    ],
    detailUseCases: [
      "Savory snacks",
      "Sweet pastries",
      "Cafes / foodservice",
      "Freezer / ready-to-bake where suitable",
      "Private label brands",
    ],
    recipeOptions: [
      "Standard puff pastry recipe",
      "Savory or sweet fillings",
      "Reduced sugar (sweet formats) where suitable",
      "Size / shape / format customization",
      "Frozen ready-to-bake format where suitable",
    ],
  },
  maamoul: {
    positioning:
      "Traditional date- and nut-filled maa'moul, manufactured for seasonal and year-round retail and premium gifting.",
    overview: [
      "Maa'moul is a traditional filled-pastry category with strong seasonal and gifting demand. As a manufacturing category, the focus is consistent filling ratio, shape, and finish.",
      "Al Shehail manufactures date- and nut-filled maa'moul for retail and premium gifting, with fillings, sizes, and pack formats tailored to the brand and season.",
    ],
    detailUseCases: [
      "Seasonal gifting",
      "Premium retail packs",
      "Supermarkets / hypermarkets",
      "Hospitality",
      "Private label brands",
    ],
    recipeOptions: [
      "Standard recipe",
      "Date / pistachio / walnut fillings",
      "Reduced sugar where suitable",
      "No added sugar where technically suitable",
      "Size / format customization",
    ],
  },
  tamriya: {
    positioning:
      "Date-based sweets and snacks with a health-aware, clean-ingredient direction where suitable.",
    overview: [
      "Tamriya is a date-based sweet and snack category well suited to health-aware positioning. As a manufacturing category, the focus is wholesome ingredients and consistent format.",
      "We manufacture date-based snacks for retail packs and clean-label product lines, with coatings, inclusions, and pack formats developed to the brand brief.",
    ],
    detailUseCases: [
      "Health-aware snacking",
      "Clean-label product lines",
      "Retail packs",
      "On-the-go formats",
      "Private label brands",
    ],
    recipeOptions: [
      "Standard recipe",
      "Clean label where technically suitable",
      "No added sugar where technically suitable",
      "Reduced sugar where suitable",
      "Coatings & inclusions (flavor customization)",
      "Pack format customization",
    ],
  },
};

export function getProductDetail(slug: string): ProductDetail | undefined {
  return productDetails[slug];
}

// Safe-language disclaimer shown under the recipe section on every product page.
export const recipeDisclaimer =
  "All recipe directions can be developed depending on the product brief and are subject to recipe testing, shelf-life requirements, and regulatory approval. Options are offered where technically suitable for the product and process.";

// Generic (shared) section content, framed for B2B private label manufacturing.
export const privateLabelPoints = [
  "Brand-specific recipe development",
  "Packaging-ready product",
  "Labeling & compliance support",
  "Retail positioning guidance",
  "Scaling from sample to production",
  "Category-specific customization",
];

export const packagingOptions = [
  "Retail packs",
  "Foodservice packs",
  "Multi-packs",
  "Individually packed options where suitable",
  "Custom packaging support",
];

export const qualityPoints = [
  "Careful ingredient handling",
  "Batch control & traceability",
  "Hygiene-controlled process",
  "In-process quality inspection",
  "Certified production environment (ISO & HACCP-aligned)",
];

// Prefilled WhatsApp enquiry for a specific product.
export function whatsappForProduct(productName: string): string {
  const message = `Hello Al Shehail team, I am interested in private label manufacturing for ${productName}. Please contact me to discuss product development, recipe options, packaging, and supply.`;
  return `https://wa.me/971547431444?text=${encodeURIComponent(message)}`;
}

// Up to `count` related products: same category first (excluding self),
// then filled from adjacent categories in taxonomy order.
export function getRelatedProducts(slug: string, count = 3): Product[] {
  const current = getProductBySlug(slug);
  if (!current) return [];

  const sameCategory = products.filter(
    (p) => p.categorySlug === current.categorySlug && p.slug !== slug
  );
  const others = products.filter(
    (p) => p.categorySlug !== current.categorySlug && p.slug !== slug
  );

  return [...sameCategory, ...others].slice(0, count);
}
