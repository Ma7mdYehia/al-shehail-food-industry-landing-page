// Product catalog for Al Shehail Food Industries.
// The single source of truth for categories and products across the Home
// product section, the /products catalog, and product cards. Lightweight: this
// module carries no product-detail content (see ./details), so consumers that
// only need catalog data don't pull the heavier detail copy.
//
// Bilingual: text fields are Localized ({ en, ar }); slugs/iconType/featured
// stay a single source of truth. Components read field[locale].
// No unverified figures are included.

import type { Product, ProductCategory } from "./types";
import {
  CAT_FLATBREAD,
  CAT_SOFT,
  CAT_PASTRY,
  CAT_SWEETS,
  wrapsSandwiches,
  healthyBakery,
  grabAndGo,
  wrapOptions,
} from "./shared";

export const productCategories: ProductCategory[] = [
  {
    name: CAT_FLATBREAD,
    slug: "flatbread-wraps",
    description: {
      en: "Arabic-style flatbread and functional bread wraps — produced for everyday retail, foodservice, and healthy bakery ranges.",
      ar: "خبز مسطّح على الطريقة العربية ولفائف خبز وظيفية — تُنتَج للتجزئة اليومية وخدمات الطعام وتشكيلات المخبوزات الصحية.",
    },
  },
  {
    name: CAT_SOFT,
    slug: "soft-bread",
    description: {
      en: "Soft, sliceable breads, buns, and rolls engineered for shelf life, slicing, and reliable sandwich, burger, and table builds.",
      ar: "خبز وأرغفة طرية قابلة للتقطيع، مصمَّمة لمدة صلاحية جيدة وتقطيع متقن وسندويتشات وبرجر وتقديم موثوق على المائدة.",
    },
  },
  {
    name: CAT_PASTRY,
    slug: "pastry",
    description: {
      en: "Laminated and layered French-style bakery — croissants, mini croissants, and puff pastry for premium bakery and cafe shelves.",
      ar: "مخبوزات مورّقة وطبقية على الطراز الفرنسي — كرواسان وكرواسان ميني ومعجنات ورقية لرفوف المخابز والمقاهي الراقية.",
    },
  },
  {
    name: CAT_SWEETS,
    slug: "sweets",
    description: {
      en: "Traditional date-based sweets and cookies — maa'moul, tamriya, and cookies — for seasonal gifting, retail confectionery, and snacking.",
      ar: "حلويات تقليدية بالتمر وكوكيز — معمول وتمرية وكوكيز — لهدايا المواسم وحلويات التجزئة والتسالي.",
    },
  },
];

export const products: Product[] = [
  // 1. Flatbread & Wraps
  {
    name: { en: "Arabic Bread", ar: "خبز عربي" },
    slug: "arabic-bread",
    category: CAT_FLATBREAD,
    categorySlug: "flatbread-wraps",
    featured: true,
    shortDescription: {
      en: "Traditional round Arabic flatbread, soft and foldable.",
      ar: "خبز عربي مسطّح تقليدي مستدير، طري وقابل للطي.",
    },
    cardDescription: {
      en: "Authentic Arabic flatbread produced for consistent texture and everyday retail demand.",
      ar: "خبز عربي أصيل يُنتَج بقوام ثابت يلبّي الطلب اليومي في التجزئة.",
    },
    useCases: [
      { en: "Retail shelf packs", ar: "عبوات رفوف التجزئة" },
      { en: "Shawarma & foodservice", ar: "شاورما وخدمات طعام" },
      { en: "Institutional catering", ar: "تموين المؤسسات" },
    ],
    privateLabelOptions: [
      { en: "Branded retail packaging", ar: "تغليف تجزئة بعلامتك" },
      { en: "Pack count & size options", ar: "خيارات العدد والحجم" },
      { en: "Recipe & size customization", ar: "تخصيص الوصفة والحجم" },
    ],
    imagePlaceholderLabel: { en: "Arabic bread photo", ar: "صورة خبز عربي" },
    iconType: "flatbread",
  },
  {
    name: { en: "High-Protein Bread Wrap", ar: "لفافة خبز عالية البروتين" },
    slug: "high-protein-bread-wrap",
    category: CAT_FLATBREAD,
    categorySlug: "flatbread-wraps",
    featured: true,
    shortDescription: {
      en: "Functional bread wrap developed for protein-focused healthy bakery ranges.",
      ar: "لفافة خبز وظيفية مطوَّرة لتشكيلات مخبوزات صحية تركّز على البروتين.",
    },
    cardDescription: {
      en: "Functional bread wrap developed for protein-focused healthy bakery ranges.",
      ar: "لفافة خبز وظيفية مطوَّرة لتشكيلات مخبوزات صحية تركّز على البروتين.",
    },
    useCases: [wrapsSandwiches, healthyBakery, grabAndGo],
    privateLabelOptions: wrapOptions,
    imagePlaceholderLabel: {
      en: "High-protein bread wrap photo",
      ar: "صورة لفافة خبز عالية البروتين",
    },
    iconType: "flatbread",
  },
  {
    name: { en: "High-Fiber Bread Wrap", ar: "لفافة خبز عالية الألياف" },
    slug: "high-fiber-bread-wrap",
    category: CAT_FLATBREAD,
    categorySlug: "flatbread-wraps",
    shortDescription: {
      en: "Functional bread wrap focused on fiber-conscious bakery positioning.",
      ar: "لفافة خبز وظيفية تركّز على تموضع مخبوزات غني بالألياف.",
    },
    cardDescription: {
      en: "Functional bread wrap focused on fiber-conscious bakery positioning.",
      ar: "لفافة خبز وظيفية تركّز على تموضع مخبوزات غني بالألياف.",
    },
    useCases: [wrapsSandwiches, healthyBakery, grabAndGo],
    privateLabelOptions: wrapOptions,
    imagePlaceholderLabel: {
      en: "High-fiber bread wrap photo",
      ar: "صورة لفافة خبز عالية الألياف",
    },
    iconType: "flatbread",
  },
  {
    name: { en: "Chia Bread Wrap", ar: "لفافة خبز بالشيا" },
    slug: "chia-bread-wrap",
    category: CAT_FLATBREAD,
    categorySlug: "flatbread-wraps",
    shortDescription: {
      en: "Bread wrap featuring chia as part of a health-focused flatbread range.",
      ar: "لفافة خبز بالشيا ضمن تشكيلة خبز مسطّح تركّز على الصحة.",
    },
    cardDescription: {
      en: "Bread wrap featuring chia as part of a health-focused flatbread range.",
      ar: "لفافة خبز بالشيا ضمن تشكيلة خبز مسطّح تركّز على الصحة.",
    },
    useCases: [wrapsSandwiches, healthyBakery, grabAndGo],
    privateLabelOptions: wrapOptions,
    imagePlaceholderLabel: {
      en: "Chia bread wrap photo",
      ar: "صورة لفافة خبز بالشيا",
    },
    iconType: "flatbread",
  },
  {
    name: { en: "Oats Bread Wrap", ar: "لفافة خبز بالشوفان" },
    slug: "oats-bread-wrap",
    category: CAT_FLATBREAD,
    categorySlug: "flatbread-wraps",
    shortDescription: {
      en: "Bread wrap featuring oats for a wholesome bakery profile.",
      ar: "لفافة خبز بالشوفان لملمح مخبوزات مغذٍّ.",
    },
    cardDescription: {
      en: "Bread wrap featuring oats for a wholesome bakery profile.",
      ar: "لفافة خبز بالشوفان لملمح مخبوزات مغذٍّ.",
    },
    useCases: [wrapsSandwiches, healthyBakery, grabAndGo],
    privateLabelOptions: wrapOptions,
    imagePlaceholderLabel: {
      en: "Oats bread wrap photo",
      ar: "صورة لفافة خبز بالشوفان",
    },
    iconType: "flatbread",
  },
  {
    name: { en: "Barley Bread Wrap", ar: "لفافة خبز بالشعير" },
    slug: "barley-bread-wrap",
    category: CAT_FLATBREAD,
    categorySlug: "flatbread-wraps",
    shortDescription: {
      en: "Bread wrap featuring barley for a hearty grain-forward profile.",
      ar: "لفافة خبز بالشعير لملمح غني بالحبوب.",
    },
    cardDescription: {
      en: "Bread wrap featuring barley for a hearty grain-forward profile.",
      ar: "لفافة خبز بالشعير لملمح غني بالحبوب.",
    },
    useCases: [wrapsSandwiches, healthyBakery, grabAndGo],
    privateLabelOptions: wrapOptions,
    imagePlaceholderLabel: {
      en: "Barley bread wrap photo",
      ar: "صورة لفافة خبز بالشعير",
    },
    iconType: "flatbread",
  },
  {
    name: { en: "Black Seed Bread Wrap", ar: "لفافة خبز بحبة البركة" },
    slug: "black-seed-bread-wrap",
    category: CAT_FLATBREAD,
    categorySlug: "flatbread-wraps",
    shortDescription: {
      en: "Bread wrap featuring black seed for a distinctive healthy bakery variant.",
      ar: "لفافة خبز بحبة البركة لخيار مخبوزات صحي مميّز.",
    },
    cardDescription: {
      en: "Bread wrap featuring black seed for a distinctive healthy bakery variant.",
      ar: "لفافة خبز بحبة البركة لخيار مخبوزات صحي مميّز.",
    },
    useCases: [wrapsSandwiches, healthyBakery, grabAndGo],
    privateLabelOptions: wrapOptions,
    imagePlaceholderLabel: {
      en: "Black seed bread wrap photo",
      ar: "صورة لفافة خبز بحبة البركة",
    },
    iconType: "flatbread",
  },
  {
    name: { en: "Whole Grains Bread Wrap", ar: "لفافة خبز بالحبوب الكاملة" },
    slug: "whole-grains-bread-wrap",
    category: CAT_FLATBREAD,
    categorySlug: "flatbread-wraps",
    shortDescription: {
      en: "Bread wrap built around whole grains for everyday healthy bakery positioning.",
      ar: "لفافة خبز قائمة على الحبوب الكاملة لتموضع مخبوزات صحي يومي.",
    },
    cardDescription: {
      en: "Bread wrap built around whole grains for everyday healthy bakery positioning.",
      ar: "لفافة خبز قائمة على الحبوب الكاملة لتموضع مخبوزات صحي يومي.",
    },
    useCases: [wrapsSandwiches, healthyBakery, grabAndGo],
    privateLabelOptions: wrapOptions,
    imagePlaceholderLabel: {
      en: "Whole grains bread wrap photo",
      ar: "صورة لفافة خبز بالحبوب الكاملة",
    },
    iconType: "flatbread",
  },

  // 2. Soft Bread
  {
    name: { en: "Toast", ar: "توست" },
    slug: "toast",
    category: CAT_SOFT,
    categorySlug: "soft-bread",
    featured: true,
    shortDescription: {
      en: "Soft sandwich loaves with an even, sliceable crumb.",
      ar: "أرغفة سندويتش طرية بقوام متجانس قابل للتقطيع.",
    },
    cardDescription: {
      en: "Consistent toast loaves engineered for shelf life, slicing, and sandwich builds.",
      ar: "أرغفة توست ثابتة الجودة مصمَّمة لمدة صلاحية جيدة وتقطيع متقن وسندويتشات.",
    },
    useCases: [
      { en: "Retail sandwich bread", ar: "خبز سندويتش للتجزئة" },
      { en: "Foodservice toasting", ar: "تحميص لخدمات الطعام" },
      { en: "Breakfast ranges", ar: "تشكيلات الإفطار" },
    ],
    privateLabelOptions: [
      { en: "White, brown & milk variants", ar: "خيارات أبيض وأسمر وبالحليب" },
      { en: "Loaf size & slice thickness", ar: "حجم الرغيف وسماكة الشريحة" },
      { en: "Branded bag packaging", ar: "تغليف أكياس بعلامتك" },
    ],
    imagePlaceholderLabel: { en: "Toast loaf photo", ar: "صورة رغيف توست" },
    iconType: "loaf",
  },
  {
    name: { en: "Burger Buns", ar: "خبز برجر" },
    slug: "burger-buns",
    category: CAT_SOFT,
    categorySlug: "soft-bread",
    featured: true,
    shortDescription: {
      en: "Structured buns with a soft crumb for foodservice and retail.",
      ar: "خبز برجر متماسك بقوام طري لخدمات الطعام والتجزئة.",
    },
    cardDescription: {
      en: "Reliable burger buns with the structure to hold builds and a soft, even crumb.",
      ar: "خبز برجر موثوق بتماسك يحمل المكوّنات وقوام طري متجانس.",
    },
    useCases: [
      { en: "QSR & foodservice", ar: "مطاعم سريعة وخدمات طعام" },
      { en: "Retail bun multipacks", ar: "عبوات برجر متعددة للتجزئة" },
      { en: "Catering", ar: "تموين" },
    ],
    privateLabelOptions: [
      { en: "Seeded & plain tops", ar: "أسطح بالبذور أو سادة" },
      { en: "Diameter & weight options", ar: "خيارات القطر والوزن" },
      { en: "Branded multipacks", ar: "عبوات متعددة بعلامتك" },
    ],
    imagePlaceholderLabel: { en: "Burger buns photo", ar: "صورة خبز برجر" },
    iconType: "bun",
  },
  {
    name: { en: "Bread Rolls", ar: "أرغفة صغيرة" },
    slug: "bread-rolls",
    category: CAT_SOFT,
    categorySlug: "soft-bread",
    shortDescription: {
      en: "Soft dinner and sandwich rolls in versatile formats.",
      ar: "أرغفة صغيرة طرية للعشاء والسندويتشات بأشكال متعددة.",
    },
    cardDescription: {
      en: "Versatile soft rolls for sandwiches, sliders, and hospitality table service.",
      ar: "أرغفة صغيرة طرية متعددة الاستخدام للسندويتشات والسلايدرز وتقديم الضيافة.",
    },
    useCases: [
      { en: "Sliders & mini sandwiches", ar: "سلايدرز وسندويتشات صغيرة" },
      { en: "Hospitality table service", ar: "تقديم الضيافة على المائدة" },
      { en: "Retail packs", ar: "عبوات تجزئة" },
    ],
    privateLabelOptions: [
      { en: "Plain, seeded & milk variants", ar: "خيارات سادة وبالبذور وبالحليب" },
      { en: "Roll size & shape", ar: "حجم الرغيف وشكله" },
      { en: "Branded packaging", ar: "تغليف بعلامتك" },
    ],
    imagePlaceholderLabel: { en: "Bread rolls photo", ar: "صورة أرغفة صغيرة" },
    iconType: "samoon",
  },

  // 3. Pastry
  {
    name: { en: "Croissant", ar: "كرواسان" },
    slug: "croissant",
    category: CAT_PASTRY,
    categorySlug: "pastry",
    shortDescription: {
      en: "Laminated butter-style croissants with flaky layers.",
      ar: "كرواسان مورّق على طراز الزبدة بطبقات هشة.",
    },
    cardDescription: {
      en: "Premium laminated croissants with crisp, flaky layers for bakery and cafe shelves.",
      ar: "كرواسان مورّق فاخر بطبقات مقرمشة هشة لرفوف المخابز والمقاهي.",
    },
    useCases: [
      { en: "Cafe & bakery counters", ar: "مقاهٍ وأركان مخابز" },
      { en: "Hotel breakfast", ar: "إفطار الفنادق" },
      { en: "Premium retail", ar: "تجزئة راقية" },
    ],
    privateLabelOptions: [
      { en: "Plain & filled variants", ar: "خيارات سادة ومحشوّة" },
      { en: "Baked or ready-to-bake frozen", ar: "مخبوز أو مجمّد جاهز للخَبز" },
      { en: "Branded packaging", ar: "تغليف بعلامتك" },
    ],
    imagePlaceholderLabel: { en: "Croissant photo", ar: "صورة كرواسان" },
    iconType: "croissantLarge",
  },
  {
    name: { en: "Mini Croissant", ar: "كرواسان ميني" },
    slug: "mini-croissant",
    category: CAT_PASTRY,
    categorySlug: "pastry",
    featured: true,
    shortDescription: {
      en: "Bite-size laminated croissants for grab-and-go.",
      ar: "كرواسان مورّق بحجم اللقمة للتجزئة السريعة.",
    },
    cardDescription: {
      en: "Laminated mini croissants ideal for grab-and-go, breakfast packs, and platters.",
      ar: "كرواسان ميني مورّق مثالي للتجزئة السريعة وعبوات الإفطار وأطباق التقديم.",
    },
    useCases: [
      grabAndGo,
      { en: "Breakfast buffets", ar: "بوفيهات الإفطار" },
      { en: "Snacking multipacks", ar: "عبوات تسالي متعددة" },
    ],
    privateLabelOptions: [
      { en: "Plain & filled", ar: "سادة ومحشوّ" },
      { en: "Multipack counts", ar: "أعداد العبوات المتعددة" },
      { en: "Frozen or baked supply", ar: "توريد مجمّد أو مخبوز" },
    ],
    imagePlaceholderLabel: { en: "Mini croissant photo", ar: "صورة كرواسان ميني" },
    iconType: "croissant",
  },
  {
    name: { en: "Pate", ar: "معجنات ورقية" },
    slug: "pate",
    category: CAT_PASTRY,
    categorySlug: "pastry",
    shortDescription: {
      en: "Layered puff pastry products, sweet and savory.",
      ar: "منتجات معجنات ورقية طبقية، حلوة ومالحة.",
    },
    cardDescription: {
      en: "Layered puff pastry products across sweet and savory formats for varied ranges.",
      ar: "منتجات معجنات ورقية طبقية بأشكال حلوة ومالحة لتشكيلات متنوعة.",
    },
    useCases: [
      { en: "Savory snacks", ar: "تسالي مالحة" },
      { en: "Sweet pastries", ar: "معجنات حلوة" },
      { en: "Cafe & retail ranges", ar: "تشكيلات المقاهي والتجزئة" },
    ],
    privateLabelOptions: [
      { en: "Sweet & savory fillings", ar: "حشوات حلوة ومالحة" },
      { en: "Shape & size options", ar: "خيارات الشكل والحجم" },
      { en: "Frozen ready-to-bake", ar: "مجمّد جاهز للخَبز" },
    ],
    imagePlaceholderLabel: {
      en: "Pate / puff pastry photo",
      ar: "صورة معجنات ورقية",
    },
    iconType: "puff",
  },

  // 4. Sweets
  {
    name: { en: "Maa'moul", ar: "معمول" },
    slug: "maamoul",
    category: CAT_SWEETS,
    categorySlug: "sweets",
    featured: true,
    shortDescription: {
      en: "Filled semolina pastries with date and nut centers.",
      ar: "معجنات سميد محشوّة بمركز التمر والمكسرات.",
    },
    cardDescription: {
      en: "Traditional filled maa'moul with date and nut centers for seasonal and year-round sales.",
      ar: "معمول تقليدي محشوّ بالتمر والمكسرات للمبيعات الموسمية وعلى مدار العام.",
    },
    useCases: [
      { en: "Seasonal gifting", ar: "هدايا المواسم" },
      { en: "Retail confectionery", ar: "حلويات التجزئة" },
      { en: "Hospitality", ar: "الضيافة" },
    ],
    privateLabelOptions: [
      { en: "Date, pistachio & walnut fills", ar: "حشوات التمر والفستق والجوز" },
      { en: "Gift & retail packaging", ar: "تغليف هدايا وتجزئة" },
      { en: "Assorted boxes", ar: "علب متنوعة" },
    ],
    imagePlaceholderLabel: { en: "Maa'moul photo", ar: "صورة معمول" },
    iconType: "maamoul",
  },
  {
    name: { en: "Tamriya", ar: "تمرية" },
    slug: "tamriya",
    category: CAT_SWEETS,
    categorySlug: "sweets",
    shortDescription: {
      en: "Wholesome date-based sweets and balls.",
      ar: "حلويات وكرات مغذّية قائمة على التمر.",
    },
    cardDescription: {
      en: "Date-based tamriya sweets built for the health-aware shopper and snacking ranges.",
      ar: "حلويات تمرية قائمة على التمر مصمَّمة للمتسوق المهتم بالصحة وتشكيلات التسالي.",
    },
    useCases: [
      { en: "Healthy snacking", ar: "تسالي صحية" },
      { en: "Retail confectionery", ar: "حلويات التجزئة" },
      { en: "On-the-go formats", ar: "أشكال للتناول السريع" },
    ],
    privateLabelOptions: [
      { en: "Coatings & inclusions", ar: "طبقات وإضافات" },
      { en: "Pack formats", ar: "أشكال العبوات" },
      { en: "Branded retail packaging", ar: "تغليف تجزئة بعلامتك" },
    ],
    imagePlaceholderLabel: { en: "Tamriya photo", ar: "صورة تمرية" },
    iconType: "date",
  },
  {
    name: { en: "Cookies", ar: "كوكيز" },
    slug: "cookies",
    category: CAT_SWEETS,
    categorySlug: "sweets",
    shortDescription: {
      en: "Cookies designed for bakery and retail-ready sweet ranges, with recipe and nutrition details to be confirmed by verified specification sheets.",
      ar: "كوكيز مصمَّمة لتشكيلات حلويات المخابز والجاهزة للتجزئة، مع تفاصيل الوصفة والقيم الغذائية التي تُؤكَّد عبر أوراق مواصفات موثّقة.",
    },
    cardDescription: {
      en: "Cookies designed for bakery and retail-ready sweet ranges, with recipe and nutrition details to be confirmed by verified specification sheets.",
      ar: "كوكيز مصمَّمة لتشكيلات حلويات المخابز والجاهزة للتجزئة، مع تفاصيل الوصفة والقيم الغذائية التي تُؤكَّد عبر أوراق مواصفات موثّقة.",
    },
    useCases: [
      { en: "Retail sweet ranges", ar: "تشكيلات حلويات التجزئة" },
      { en: "Bakery counters", ar: "أركان المخابز" },
      { en: "Private label brands", ar: "علامات خاصة" },
    ],
    privateLabelOptions: [
      { en: "Pack format customization", ar: "تخصيص شكل العبوة" },
      { en: "Branded retail packaging", ar: "تغليف تجزئة بعلامتك" },
      { en: "Recipe direction developed to brief", ar: "توجيه الوصفة يُطوَّر حسب الطلب" },
    ],
    imagePlaceholderLabel: { en: "Cookies photo", ar: "صورة كوكيز" },
    iconType: "maamoul",
  },
];

// Convenience: products grouped by category, preserving category order.
export const productsByCategory = productCategories.map((category) => ({
  category,
  items: products.filter((p) => p.categorySlug === category.slug),
}));

// Curated highlight set for the homepage "What We Manufacture" teaser.
export const featuredProducts = products.filter((p) => p.featured);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
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
