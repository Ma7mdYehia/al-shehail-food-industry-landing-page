// Product detail content for Al Shehail Food Industries.
// Per-product positioning, overview, expanded use cases, and recipe options
// for the /products/[slug] solution pages, plus the generic (shared) section
// content used there (private label framing, packaging, quality, disclaimer).
// This module is only imported by the product detail page — lightweight
// catalog consumers (home, listing, cards) should never pull this in.

import type { Locale, Localized } from "@/lib/i18n";
import type { ProductDetail } from "./types";
import {
  wrapsSandwiches,
  healthyBakery,
  grabAndGo,
  wrapDetailUseCases,
  wrapRecipeOptions,
  wrapOverview,
} from "./shared";

export type { ProductDetail };

export const productDetails: Record<string, ProductDetail> = {
  "arabic-bread": {
    positioning: {
      en: "Everyday Arabic flatbread, manufactured for consistent quality across retail and institutional supply.",
      ar: "خبز عربي مسطّح يومي، يُصنَّع بجودة ثابتة عبر توريد التجزئة والمؤسسات.",
    },
    overview: [
      {
        en: "Arabic bread is one of the region's highest-demand everyday breads. As a manufacturing category, the focus is on a soft, foldable texture and dependable batch-to-batch consistency at volume.",
        ar: "الخبز العربي من أكثر أنواع الخبز اليومي طلبًا في المنطقة. وكفئة تصنيع، ينصبّ التركيز على قوام طري قابل للطي وثبات موثوق بين الدفعات على نطاق واسع.",
      },
      {
        en: "Al Shehail produces Arabic bread for retail shelves and institutional supply, with formats and recipes that can be adapted to a brand's target market and price positioning.",
        ar: "ينتج الشحيل الخبز العربي لرفوف التجزئة وتوريد المؤسسات، بأشكال ووصفات يمكن تكييفها مع السوق المستهدف والتموضع السعري للعلامة.",
      },
    ],
    detailUseCases: [
      { en: "Retail shelves", ar: "رفوف التجزئة" },
      { en: "Supermarkets / hypermarkets", ar: "أسواق / هايبرماركت" },
      { en: "Cafes / foodservice", ar: "مقاهٍ / خدمات طعام" },
      { en: "Institutional & catering supply", ar: "توريد المؤسسات والتموين" },
      { en: "Private label brands", ar: "علامات خاصة" },
    ],
    recipeOptions: [
      { en: "Standard recipe", ar: "وصفة قياسية" },
      {
        en: "Whole wheat / fiber-focused variations where suitable",
        ar: "خيارات القمح الكامل / الغنية بالألياف حيثما يناسب",
      },
      {
        en: "No preservatives where shelf life and process allow",
        ar: "بدون مواد حافظة حيثما تسمح مدة الصلاحية والعملية",
      },
      { en: "Size / weight / format customization", ar: "تخصيص الحجم / الوزن / الشكل" },
    ],
  },
  "high-protein-bread-wrap": {
    positioning: {
      en: "Functional bread wrap developed for protein-focused healthy bakery ranges.",
      ar: "لفافة خبز وظيفية مطوَّرة لتشكيلات مخبوزات صحية تركّز على البروتين.",
    },
    overview: wrapOverview({
      en: "The high-protein bread wrap is part of a functional flatbread range, developed for brands building protein-focused healthy bakery lines.",
      ar: "لفافة الخبز عالية البروتين جزء من تشكيلة خبز مسطّح وظيفية، مطوَّرة للعلامات التي تبني خطوط مخبوزات صحية تركّز على البروتين.",
    }),
    detailUseCases: wrapDetailUseCases,
    recipeOptions: wrapRecipeOptions,
  },
  "high-fiber-bread-wrap": {
    positioning: {
      en: "Functional bread wrap focused on fiber-conscious bakery positioning.",
      ar: "لفافة خبز وظيفية تركّز على تموضع مخبوزات غني بالألياف.",
    },
    overview: wrapOverview({
      en: "The high-fiber bread wrap is part of a functional flatbread range, developed for fiber-conscious bakery positioning.",
      ar: "لفافة الخبز عالية الألياف جزء من تشكيلة خبز مسطّح وظيفية، مطوَّرة لتموضع مخبوزات غني بالألياف.",
    }),
    detailUseCases: wrapDetailUseCases,
    recipeOptions: wrapRecipeOptions,
  },
  "chia-bread-wrap": {
    positioning: {
      en: "Bread wrap featuring chia as part of a health-focused flatbread range.",
      ar: "لفافة خبز بالشيا ضمن تشكيلة خبز مسطّح تركّز على الصحة.",
    },
    overview: wrapOverview({
      en: "The chia bread wrap features chia as part of a health-focused flatbread range.",
      ar: "لفافة خبز الشيا تضم الشيا ضمن تشكيلة خبز مسطّح تركّز على الصحة.",
    }),
    detailUseCases: wrapDetailUseCases,
    recipeOptions: wrapRecipeOptions,
  },
  "oats-bread-wrap": {
    positioning: {
      en: "Bread wrap featuring oats for a wholesome bakery profile.",
      ar: "لفافة خبز بالشوفان لملمح مخبوزات مغذٍّ.",
    },
    overview: wrapOverview({
      en: "The oats bread wrap features oats for a wholesome bakery profile.",
      ar: "لفافة خبز الشوفان تضم الشوفان لملمح مخبوزات مغذٍّ.",
    }),
    detailUseCases: wrapDetailUseCases,
    recipeOptions: wrapRecipeOptions,
  },
  "barley-bread-wrap": {
    positioning: {
      en: "Bread wrap featuring barley for a hearty grain-forward profile.",
      ar: "لفافة خبز بالشعير لملمح غني بالحبوب.",
    },
    overview: wrapOverview({
      en: "The barley bread wrap features barley for a hearty grain-forward profile.",
      ar: "لفافة خبز الشعير تضم الشعير لملمح غني بالحبوب.",
    }),
    detailUseCases: wrapDetailUseCases,
    recipeOptions: wrapRecipeOptions,
  },
  "black-seed-bread-wrap": {
    positioning: {
      en: "Bread wrap featuring black seed for a distinctive healthy bakery variant.",
      ar: "لفافة خبز بحبة البركة لخيار مخبوزات صحي مميّز.",
    },
    overview: wrapOverview({
      en: "The black seed bread wrap features black seed for a distinctive healthy bakery variant.",
      ar: "لفافة خبز حبة البركة تضم حبة البركة لخيار مخبوزات صحي مميّز.",
    }),
    detailUseCases: wrapDetailUseCases,
    recipeOptions: wrapRecipeOptions,
  },
  "whole-grains-bread-wrap": {
    positioning: {
      en: "Bread wrap built around whole grains for everyday healthy bakery positioning.",
      ar: "لفافة خبز قائمة على الحبوب الكاملة لتموضع مخبوزات صحي يومي.",
    },
    overview: wrapOverview({
      en: "The whole grains bread wrap is built around whole grains for everyday healthy bakery positioning.",
      ar: "لفافة خبز الحبوب الكاملة قائمة على الحبوب الكاملة لتموضع مخبوزات صحي يومي.",
    }),
    detailUseCases: wrapDetailUseCases,
    recipeOptions: wrapRecipeOptions,
  },
  toast: {
    positioning: {
      en: "Sliced sandwich bread with a soft crumb, manufactured shelf-ready for family retail packs.",
      ar: "خبز سندويتش مقطّع بقوام طري، يُصنَّع جاهزًا للرف لعبوات التجزئة العائلية.",
    },
    overview: [
      {
        en: "Toast and sandwich bread is a staple retail category where soft crumb, even slicing, and reliable shelf life are essential. As a manufacturing category, consistency across every loaf is the priority.",
        ar: "التوست وخبز السندويتش فئة تجزئة أساسية يكون فيها القوام الطري والتقطيع المتجانس ومدة الصلاحية الموثوقة أمورًا جوهرية. وكفئة تصنيع، يكون الثبات في كل رغيف هو الأولوية.",
      },
      {
        en: "Al Shehail produces sliced bread for family retail packs and sandwich use, with recipes and loaf formats that can be tailored to brand and market.",
        ar: "ينتج الشحيل الخبز المقطّع لعبوات التجزئة العائلية واستخدام السندويتش، بوصفات وأشكال أرغفة يمكن تكييفها مع العلامة والسوق.",
      },
    ],
    detailUseCases: [
      { en: "Family retail packs", ar: "عبوات تجزئة عائلية" },
      { en: "Sandwich production", ar: "إنتاج السندويتش" },
      { en: "Supermarkets / hypermarkets", ar: "أسواق / هايبرماركت" },
      { en: "Foodservice toasting", ar: "تحميص لخدمات الطعام" },
      { en: "Private label brands", ar: "علامات خاصة" },
    ],
    recipeOptions: [
      { en: "Standard recipe", ar: "وصفة قياسية" },
      {
        en: "Whole wheat / fiber-focused variations where suitable",
        ar: "خيارات القمح الكامل / الغنية بالألياف حيثما يناسب",
      },
      { en: "Reduced sugar where suitable", ar: "سكر مخفّض حيثما يناسب" },
      {
        en: "No preservatives where shelf life and process allow",
        ar: "بدون مواد حافظة حيثما تسمح مدة الصلاحية والعملية",
      },
      { en: "Loaf size / slice thickness customization", ar: "تخصيص حجم الرغيف / سماكة الشريحة" },
    ],
  },
  "burger-buns": {
    positioning: {
      en: "Burger buns built with structure and consistency for foodservice and retail.",
      ar: "خبز برجر بتماسك وثبات لخدمات الطعام والتجزئة.",
    },
    overview: [
      {
        en: "Burger buns are a foodservice and retail category where structure, soft crumb, and consistent sizing directly affect the final build. As a manufacturing category, repeatability is critical.",
        ar: "خبز البرجر فئة لخدمات الطعام والتجزئة يؤثر فيها التماسك والقوام الطري وثبات الحجم مباشرةً على التكوين النهائي. وكفئة تصنيع، تكون قابلية التكرار أمرًا حاسمًا.",
      },
      {
        en: "We manufacture burger buns in different sizes for QSR, foodservice, and retail multipacks, with topping and format options matched to the brand brief.",
        ar: "نصنّع خبز البرجر بأحجام مختلفة للمطاعم السريعة وخدمات الطعام وعبوات التجزئة المتعددة، مع خيارات أسطح وأشكال تُطابق طلب العلامة.",
      },
    ],
    detailUseCases: [
      { en: "QSR & foodservice", ar: "مطاعم سريعة وخدمات طعام" },
      { en: "Retail bun multipacks", ar: "عبوات برجر متعددة للتجزئة" },
      { en: "Catering", ar: "تموين" },
      { en: "Private label brands", ar: "علامات خاصة" },
    ],
    recipeOptions: [
      { en: "Standard recipe", ar: "وصفة قياسية" },
      { en: "Seeded & topping variations", ar: "خيارات البذور والأسطح" },
      {
        en: "Whole wheat / fiber-focused variations where suitable",
        ar: "خيارات القمح الكامل / الغنية بالألياف حيثما يناسب",
      },
      {
        en: "No preservatives where shelf life and process allow",
        ar: "بدون مواد حافظة حيثما تسمح مدة الصلاحية والعملية",
      },
      { en: "Diameter / weight / format customization", ar: "تخصيص القطر / الوزن / الشكل" },
    ],
  },
  "bread-rolls": {
    positioning: {
      en: "Soft rolls for meals and sandwiches, manufactured for foodservice, retail, and private label packs.",
      ar: "أرغفة صغيرة طرية للوجبات والسندويتشات، تُصنَّع لخدمات الطعام والتجزئة وعبوات العلامة الخاصة.",
    },
    overview: [
      {
        en: "Bread rolls are a versatile soft-bread category for meals, sliders, and sandwiches. As a manufacturing category, the focus is a tender crumb and consistent shape across formats.",
        ar: "الأرغفة الصغيرة فئة خبز طري متعددة الاستخدام للوجبات والسلايدرز والسندويتشات. وكفئة تصنيع، ينصبّ التركيز على قوام طري وشكل ثابت عبر الأشكال المختلفة.",
      },
      {
        en: "Al Shehail manufactures rolls for hospitality and foodservice as well as retail and private label packs, with size and shape options to suit the application.",
        ar: "يصنّع الشحيل الأرغفة للضيافة وخدمات الطعام وكذلك للتجزئة وعبوات العلامة الخاصة، بخيارات حجم وشكل تناسب الاستخدام.",
      },
    ],
    detailUseCases: [
      { en: "Hospitality & foodservice", ar: "ضيافة وخدمات طعام" },
      { en: "Sliders & mini sandwiches", ar: "سلايدرز وسندويتشات صغيرة" },
      { en: "Retail packs", ar: "عبوات تجزئة" },
      { en: "Private label brands", ar: "علامات خاصة" },
    ],
    recipeOptions: [
      { en: "Standard recipe", ar: "وصفة قياسية" },
      {
        en: "Whole wheat / fiber-focused variations where suitable",
        ar: "خيارات القمح الكامل / الغنية بالألياف حيثما يناسب",
      },
      { en: "Seeded & flavor variations", ar: "خيارات البذور والنكهات" },
      {
        en: "No preservatives where shelf life and process allow",
        ar: "بدون مواد حافظة حيثما تسمح مدة الصلاحية والعملية",
      },
      { en: "Size / shape / format customization", ar: "تخصيص الحجم / الشكل / الصيغة" },
    ],
  },
  croissant: {
    positioning: {
      en: "Laminated croissants, plain or filled, manufactured for retail and cafe supply.",
      ar: "كرواسان مورّق، سادة أو محشوّ، يُصنَّع لتوريد التجزئة والمقاهي.",
    },
    overview: [
      {
        en: "Croissants are a laminated bakery category defined by crisp, flaky layers and a rich crumb. As a manufacturing category, lamination consistency and bake quality are the priorities.",
        ar: "الكرواسان فئة مخبوزات مورّقة تتميّز بطبقات مقرمشة هشة وقوام غني. وكفئة تصنيع، يكون ثبات الترقيق وجودة الخَبز هما الأولوية.",
      },
      {
        en: "We manufacture plain and filled croissants for cafe, bakery, and premium retail supply, available in baked or ready-to-bake formats depending on the brief.",
        ar: "نصنّع الكرواسان السادة والمحشوّ لتوريد المقاهي والمخابز والتجزئة الراقية، متاحًا بأشكال مخبوزة أو جاهزة للخَبز بحسب الطلب.",
      },
    ],
    detailUseCases: [
      { en: "Cafes & bakery counters", ar: "مقاهٍ وأركان مخابز" },
      { en: "Hotel breakfast", ar: "إفطار الفنادق" },
      { en: "Premium retail", ar: "تجزئة راقية" },
      { en: "Private label brands", ar: "علامات خاصة" },
    ],
    recipeOptions: [
      { en: "Standard laminated recipe", ar: "وصفة ترقيق قياسية" },
      { en: "Plain or filled options", ar: "خيارات سادة أو محشوّة" },
      { en: "Reduced sugar where suitable", ar: "سكر مخفّض حيثما يناسب" },
      { en: "Size / weight / format customization", ar: "تخصيص الحجم / الوزن / الشكل" },
      {
        en: "Baked or ready-to-bake frozen format where suitable",
        ar: "شكل مخبوز أو مجمّد جاهز للخَبز حيثما يناسب",
      },
    ],
  },
  "mini-croissant": {
    positioning: {
      en: "Bite-size laminated croissants for grab-and-go, multipack, and breakfast or snack ranges.",
      ar: "كرواسان مورّق بحجم اللقمة للتجزئة السريعة والعبوات المتعددة وتشكيلات الإفطار أو التسالي.",
    },
    overview: [
      {
        en: "Mini croissants bring laminated bakery quality to smaller, snackable formats. As a manufacturing category, the focus is consistent size and lamination at higher piece counts.",
        ar: "يقدّم الكرواسان الميني جودة المخبوزات المورّقة بأشكال أصغر مناسبة للتسالي. وكفئة تصنيع، ينصبّ التركيز على ثبات الحجم والترقيق عند أعداد قطع أعلى.",
      },
      {
        en: "Al Shehail manufactures plain and filled mini croissants for grab-and-go retail, breakfast, and snacking multipacks, in baked or frozen supply formats.",
        ar: "يصنّع الشحيل الكرواسان الميني السادة والمحشوّ للتجزئة السريعة والإفطار وعبوات التسالي المتعددة، بأشكال توريد مخبوزة أو مجمّدة.",
      },
    ],
    detailUseCases: [
      grabAndGo,
      { en: "Breakfast & snack ranges", ar: "تشكيلات الإفطار والتسالي" },
      { en: "Multipacks", ar: "عبوات متعددة" },
      { en: "Private label brands", ar: "علامات خاصة" },
    ],
    recipeOptions: [
      { en: "Standard laminated recipe", ar: "وصفة ترقيق قياسية" },
      { en: "Plain or filled options", ar: "خيارات سادة أو محشوّة" },
      { en: "Reduced sugar where suitable", ar: "سكر مخفّض حيثما يناسب" },
      { en: "Multipack count / format customization", ar: "تخصيص عدد العبوة المتعددة / الشكل" },
      { en: "Baked or frozen supply where suitable", ar: "توريد مخبوز أو مجمّد حيثما يناسب" },
    ],
  },
  pate: {
    positioning: {
      en: "Layered puff pastry in savory and sweet formats, with filled options for cafe, retail, and freezer ranges where suitable.",
      ar: "معجنات ورقية طبقية بأشكال مالحة وحلوة، مع خيارات محشوّة لتشكيلات المقاهي والتجزئة والمجمّدات حيثما يناسب.",
    },
    overview: [
      {
        en: "Pate (puff pastry) is a layered bakery category spanning savory and sweet formats. As a manufacturing category, the priority is even lamination and reliable rise across shapes.",
        ar: "المعجنات الورقية فئة مخبوزات طبقية تشمل الأشكال المالحة والحلوة. وكفئة تصنيع، تكون الأولوية للترقيق المتجانس والانتفاخ الموثوق عبر الأشكال.",
      },
      {
        en: "We manufacture filled and unfilled puff pastry products for cafe, retail, and freezer ranges where suitable, with shapes and fillings matched to the product brief.",
        ar: "نصنّع منتجات معجنات ورقية محشوّة وغير محشوّة لتشكيلات المقاهي والتجزئة والمجمّدات حيثما يناسب، بأشكال وحشوات تُطابق طلب المنتج.",
      },
    ],
    detailUseCases: [
      { en: "Savory snacks", ar: "تسالي مالحة" },
      { en: "Sweet pastries", ar: "معجنات حلوة" },
      { en: "Cafes / foodservice", ar: "مقاهٍ / خدمات طعام" },
      { en: "Freezer / ready-to-bake where suitable", ar: "مجمّد / جاهز للخَبز حيثما يناسب" },
      { en: "Private label brands", ar: "علامات خاصة" },
    ],
    recipeOptions: [
      { en: "Standard puff pastry recipe", ar: "وصفة معجنات ورقية قياسية" },
      { en: "Savory or sweet fillings", ar: "حشوات مالحة أو حلوة" },
      { en: "Reduced sugar (sweet formats) where suitable", ar: "سكر مخفّض (للأشكال الحلوة) حيثما يناسب" },
      { en: "Size / shape / format customization", ar: "تخصيص الحجم / الشكل / الصيغة" },
      { en: "Frozen ready-to-bake format where suitable", ar: "شكل مجمّد جاهز للخَبز حيثما يناسب" },
    ],
  },
  maamoul: {
    positioning: {
      en: "Traditional date- and nut-filled maa'moul, manufactured for seasonal and year-round retail and premium gifting.",
      ar: "معمول تقليدي محشوّ بالتمر والمكسرات، يُصنَّع للتجزئة الموسمية وعلى مدار العام ولهدايا راقية.",
    },
    overview: [
      {
        en: "Maa'moul is a traditional filled-pastry category with strong seasonal and gifting demand. As a manufacturing category, the focus is consistent filling ratio, shape, and finish.",
        ar: "المعمول فئة معجنات محشوّة تقليدية ذات طلب موسمي وطلب هدايا قوي. وكفئة تصنيع، ينصبّ التركيز على ثبات نسبة الحشو والشكل واللمسة النهائية.",
      },
      {
        en: "Al Shehail manufactures date- and nut-filled maa'moul for retail and premium gifting, with fillings, sizes, and pack formats tailored to the brand and season.",
        ar: "يصنّع الشحيل المعمول المحشوّ بالتمر والمكسرات للتجزئة والهدايا الراقية، بحشوات وأحجام وأشكال عبوات مصمَّمة حسب العلامة والموسم.",
      },
    ],
    detailUseCases: [
      { en: "Seasonal gifting", ar: "هدايا المواسم" },
      { en: "Premium retail packs", ar: "عبوات تجزئة راقية" },
      { en: "Supermarkets / hypermarkets", ar: "أسواق / هايبرماركت" },
      { en: "Hospitality", ar: "الضيافة" },
      { en: "Private label brands", ar: "علامات خاصة" },
    ],
    recipeOptions: [
      { en: "Standard recipe", ar: "وصفة قياسية" },
      { en: "Date / pistachio / walnut fillings", ar: "حشوات التمر / الفستق / الجوز" },
      { en: "Reduced sugar where suitable", ar: "سكر مخفّض حيثما يناسب" },
      { en: "No added sugar where technically suitable", ar: "بدون سكر مضاف حيثما يناسب تقنيًا" },
      { en: "Size / format customization", ar: "تخصيص الحجم / الشكل" },
    ],
  },
  tamriya: {
    positioning: {
      en: "Date-based sweets and snacks with a health-aware, clean-ingredient direction where suitable.",
      ar: "حلويات وتسالي قائمة على التمر بتوجه صحي ومكوّنات نظيفة حيثما يناسب.",
    },
    overview: [
      {
        en: "Tamriya is a date-based sweet and snack category well suited to health-aware positioning. As a manufacturing category, the focus is wholesome ingredients and consistent format.",
        ar: "التمرية فئة حلويات وتسالي قائمة على التمر تناسب التموضع الصحي. وكفئة تصنيع، ينصبّ التركيز على المكوّنات المغذّية وثبات الشكل.",
      },
      {
        en: "We manufacture date-based snacks for retail packs and clean-label product lines, with coatings, inclusions, and pack formats developed to the brand brief.",
        ar: "نصنّع تسالي قائمة على التمر لعبوات التجزئة وخطوط منتجات نظيفة المكوّنات، بطبقات وإضافات وأشكال عبوات تُطوَّر حسب طلب العلامة.",
      },
    ],
    detailUseCases: [
      { en: "Health-aware snacking", ar: "تسالي صحية" },
      { en: "Clean-label product lines", ar: "خطوط منتجات نظيفة المكوّنات" },
      { en: "Retail packs", ar: "عبوات تجزئة" },
      { en: "On-the-go formats", ar: "أشكال للتناول السريع" },
      { en: "Private label brands", ar: "علامات خاصة" },
    ],
    recipeOptions: [
      { en: "Standard recipe", ar: "وصفة قياسية" },
      { en: "Clean label where technically suitable", ar: "مكوّنات نظيفة حيثما يناسب تقنيًا" },
      { en: "No added sugar where technically suitable", ar: "بدون سكر مضاف حيثما يناسب تقنيًا" },
      { en: "Reduced sugar where suitable", ar: "سكر مخفّض حيثما يناسب" },
      { en: "Coatings & inclusions (flavor customization)", ar: "طبقات وإضافات (تخصيص النكهة)" },
      { en: "Pack format customization", ar: "تخصيص شكل العبوة" },
    ],
  },
  cookies: {
    positioning: {
      en: "Cookies designed for bakery and retail-ready sweet ranges, with recipe and nutrition details to be confirmed by verified specification sheets.",
      ar: "كوكيز مصمَّمة لتشكيلات حلويات المخابز والجاهزة للتجزئة، مع تفاصيل الوصفة والقيم الغذائية التي تُؤكَّد عبر أوراق مواصفات موثّقة.",
    },
    overview: [
      {
        en: "Cookies are a sweet bakery category developed for retail-ready and bakery sweet ranges. As a manufacturing category, the focus is consistent format and finish across the run.",
        ar: "الكوكيز فئة حلويات مخبوزة مطوَّرة لتشكيلات الحلويات الجاهزة للتجزئة وحلويات المخابز. وكفئة تصنيع، ينصبّ التركيز على ثبات الشكل واللمسة النهائية عبر الإنتاج.",
      },
      {
        en: "Recipe direction and nutrition values are developed to the brand brief and confirmed against verified specification sheets before any nutrition claim is made.",
        ar: "يُطوَّر توجيه الوصفة والقيم الغذائية حسب طلب العلامة، وتُؤكَّد عبر أوراق مواصفات موثّقة قبل تقديم أي ادعاء غذائي.",
      },
    ],
    detailUseCases: [
      { en: "Retail sweet ranges", ar: "تشكيلات حلويات التجزئة" },
      { en: "Bakery counters", ar: "أركان المخابز" },
      { en: "Supermarkets / hypermarkets", ar: "أسواق / هايبرماركت" },
      { en: "Private label brands", ar: "علامات خاصة" },
    ],
    recipeOptions: [
      { en: "Recipe direction developed to brief", ar: "توجيه الوصفة يُطوَّر حسب الطلب" },
      {
        en: "Nutrition profile confirmed via verified specification sheet",
        ar: "تُؤكَّد القيم الغذائية عبر ورقة مواصفات موثّقة",
      },
      { en: "Pack format customization", ar: "تخصيص شكل العبوة" },
    ],
  },
};

export function getProductDetail(slug: string): ProductDetail | undefined {
  return productDetails[slug];
}

// Safe-language disclaimer shown under the recipe section on every product page.
export const recipeDisclaimer: Localized = {
  en: "All recipe directions can be developed depending on the product brief and are subject to recipe testing, shelf-life requirements, and regulatory approval. Options are offered where technically suitable for the product and process.",
  ar: "يمكن تطوير جميع توجيهات الوصفات بحسب طلب المنتج، وتخضع لاختبار الوصفة ومتطلبات مدة الصلاحية والموافقة التنظيمية. وتُقدَّم الخيارات حيثما تكون مناسبة تقنيًا للمنتج والعملية.",
};

// Generic (shared) section content, framed for B2B private label manufacturing.
export const privateLabelPoints: Localized[] = [
  { en: "Brand-specific recipe development", ar: "تطوير وصفة خاصة بالعلامة" },
  { en: "Packaging-ready product", ar: "منتج جاهز للتغليف" },
  { en: "Labeling & compliance support", ar: "دعم البطاقات والامتثال" },
  { en: "Retail positioning guidance", ar: "إرشاد للتموضع في التجزئة" },
  { en: "Scaling from sample to production", ar: "التوسّع من العينة إلى الإنتاج" },
  { en: "Category-specific customization", ar: "تخصيص حسب الفئة" },
];

export const packagingOptions: Localized[] = [
  { en: "Retail packs", ar: "عبوات تجزئة" },
  { en: "Foodservice packs", ar: "عبوات خدمات طعام" },
  { en: "Multi-packs", ar: "عبوات متعددة" },
  { en: "Individually packed options where suitable", ar: "خيارات معبأة فرديًا حيثما يناسب" },
  { en: "Custom packaging support", ar: "دعم تغليف مخصّص" },
];

export const qualityPoints: Localized[] = [
  { en: "Careful ingredient handling", ar: "مناولة دقيقة للمكوّنات" },
  { en: "Batch control & traceability", ar: "ضبط الدفعات وإمكانية التتبّع" },
  { en: "Hygiene-controlled process", ar: "عملية محكومة النظافة" },
  { en: "In-process quality inspection", ar: "فحص جودة أثناء العملية" },
  {
    en: "Certified production environment (ISO & HACCP-aligned)",
    ar: "بيئة إنتاج معتمدة (متوافقة مع ISO وHACCP)",
  },
];

// Prefilled WhatsApp enquiry for a specific product, per locale.
export function whatsappForProduct(productName: string, locale: Locale): string {
  const message =
    locale === "ar"
      ? `مرحبًا فريق الشحيل، أنا مهتم بالتصنيع بعلامة خاصة لمنتج ${productName}. يرجى التواصل معي لمناقشة تطوير المنتج وخيارات الوصفة والتغليف والتوريد.`
      : `Hello Al Shehail team, I am interested in private label manufacturing for ${productName}. Please contact me to discuss product development, recipe options, packaging, and supply.`;
  return `https://wa.me/971547431444?text=${encodeURIComponent(message)}`;
}
