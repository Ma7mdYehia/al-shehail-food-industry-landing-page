// Reused bilingual text fragments shared between the product catalog and the
// product-detail content. Kept in one place so the same category labels,
// use-case phrases, and wrap-range copy stay identical wherever they appear.

import type { Localized } from "@/lib/i18n";

// Category display labels reused across products.
export const CAT_FLATBREAD: Localized = { en: "Flatbread & Wraps", ar: "الخبز المسطّح واللفائف" };
export const CAT_SOFT: Localized = { en: "Soft Bread", ar: "الخبز الطري" };
export const CAT_PASTRY: Localized = { en: "Pastry", ar: "المعجنات" };
export const CAT_SWEETS: Localized = { en: "Sweets", ar: "الحلويات" };

// Repeated use-case / option phrases.
export const wrapsSandwiches: Localized = { en: "Wraps & sandwiches", ar: "لفائف وسندويتشات" };
export const healthyBakery: Localized = { en: "Healthy bakery ranges", ar: "تشكيلات مخبوزات صحية" };
export const grabAndGo: Localized = { en: "Grab-and-go retail", ar: "تجزئة سريعة للأخذ" };
export const wrapOptions: Localized[] = [
  { en: "Multiple diameters", ar: "أقطار متعددة" },
  { en: "Branded film packaging", ar: "تغليف فيلم بعلامتك" },
  { en: "Recipe & format customization", ar: "تخصيص الوصفة والشكل" },
];

// Shared detail phrases reused across the functional bread-wrap range.
export const wrapDetailUseCases: Localized[] = [
  wrapsSandwiches,
  healthyBakery,
  { en: "Cafes / foodservice", ar: "مقاهٍ / خدمات طعام" },
  grabAndGo,
  { en: "Private label brands", ar: "علامات خاصة" },
];
export const wrapRecipeOptions: Localized[] = [
  { en: "Recipe direction developed to brief", ar: "توجيه الوصفة يُطوَّر حسب الطلب" },
  {
    en: "Nutrition profile confirmed via verified specification sheet",
    ar: "تُؤكَّد القيم الغذائية عبر ورقة مواصفات موثّقة",
  },
  {
    en: "No preservatives where shelf life and process allow",
    ar: "بدون مواد حافظة حيثما تسمح مدة الصلاحية والعملية",
  },
  { en: "Size / diameter / format customization", ar: "تخصيص الحجم / القطر / الشكل" },
];
export function wrapOverview(feature: Localized): Localized[] {
  return [
    {
      en: `${feature.en} As a manufacturing category, the focus is a pliable wrap with consistent diameter and clean folding performance.`,
      ar: `${feature.ar} كفئة تصنيع، ينصبّ التركيز على لفافة مرنة بقطر ثابت وأداء طي نظيف.`,
    },
    {
      en: "Recipe direction and nutrition values are developed to the brand brief and confirmed against verified specification sheets before any nutrition claim is made.",
      ar: "يُطوَّر توجيه الوصفة والقيم الغذائية حسب طلب العلامة، وتُؤكَّد عبر أوراق مواصفات موثّقة قبل تقديم أي ادعاء غذائي.",
    },
  ];
}
