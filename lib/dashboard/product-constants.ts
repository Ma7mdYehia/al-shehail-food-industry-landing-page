// Product enum constants — mirror the P02 CHECK constraints EXACTLY. The
// database is the enforcement boundary; these drive UI + validation.

export const PRODUCT_ICON_TYPES = [
  "flatbread", "loaf", "samoon", "bun", "croissant",
  "croissantLarge", "puff", "maamoul", "date",
] as const;
export type ProductIconType = (typeof PRODUCT_ICON_TYPES)[number];

export const PRODUCT_OPTION_TYPES = [
  "use_case", "private_label_option", "variant", "recipe_option",
] as const;
export type ProductOptionType = (typeof PRODUCT_OPTION_TYPES)[number];

export const PRODUCT_OPTION_TYPE_LABELS: Record<string, string> = {
  use_case: "Use case",
  private_label_option: "Private-label option",
  variant: "Variant",
  recipe_option: "Recipe option",
};

export function isProductIconType(v: unknown): v is ProductIconType {
  return typeof v === "string" && (PRODUCT_ICON_TYPES as readonly string[]).includes(v);
}
export function isProductOptionType(v: unknown): v is ProductOptionType {
  return typeof v === "string" && (PRODUCT_OPTION_TYPES as readonly string[]).includes(v);
}
