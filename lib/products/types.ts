// Product taxonomy types for Al Shehail Food Industries.
// Shared type definitions for the catalog and product-detail modules.
//
// Bilingual: text fields are Localized ({ en, ar }); slugs/iconType/featured
// stay a single source of truth. Components read field[locale].

import type { ProductIconType } from "@/components/ProductIcon";
import type { Localized } from "@/lib/i18n";

export type { ProductIconType };

export type ProductCategory = {
  name: Localized;
  slug: string;
  description: Localized;
};

export type Product = {
  name: Localized;
  slug: string;
  category: Localized;
  categorySlug: string;
  shortDescription: Localized;
  cardDescription: Localized;
  useCases: Localized[];
  privateLabelOptions: Localized[];
  imagePlaceholderLabel: Localized;
  iconType: ProductIconType;
  /** Optional flavor/functional variants shown as chips. */
  variants?: Localized[];
  /** Included in the homepage "Featured" filter when true. */
  featured?: boolean;
};

export type ProductDetail = {
  positioning: Localized;
  overview: Localized[];
  detailUseCases: Localized[];
  recipeOptions: Localized[];
};
