// Products data loading (SERVER-ONLY). Reads through the authenticated Supabase
// client; RLS lets active dashboard members read every row (incl. drafts).
// Fails closed to "unavailable". Never logs content.

import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { pagination, LIMITS } from "@/lib/dashboard/validation";

export type Localized = { en: string; ar: string };

export type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  featured: boolean;
  updatedAt: string;
};

export type CategoryOption = { id: string; slug: string; name: string; isActive: boolean };
export type MediaOption = { id: string; key: string; type: string };

export type ProductOptionRow = {
  id: string;
  type: string;
  label: Localized;
  sortOrder: number;
  isActive: boolean;
};

export type ProductDetail = {
  id: string;
  positioning: Localized;
  disclaimer: Localized | null;
  overview: string[];
  useCases: string[];
  recipeOptions: string[];
  updatedAt: string;
};

export type ProductEditRecord = {
  id: string;
  slug: string;
  categoryId: string;
  name: Localized;
  shortDescription: Localized;
  cardDescription: Localized;
  iconType: string;
  imageAssetId: string | null;
  featured: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  detail: ProductDetail | null;
  options: ProductOptionRow[];
  // A product created after the seed export has no deterministic seed id — those
  // are the only ones eligible for physical deletion (when unreferenced).
  isSeedBacked: boolean;
};

export type ProductListResult =
  | { status: "unavailable" }
  | { status: "ok"; rows: ProductListItem[]; total: number; page: number; pageSize: number };

const SEED_ID_RE = /^(prod|cat|detail|media|partner|proj)_/;
function loc(v: unknown): Localized {
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return { en: typeof o.en === "string" ? o.en : "", ar: typeof o.ar === "string" ? o.ar : "" };
  }
  return { en: "", ar: "" };
}
function locOrNull(v: unknown): Localized | null {
  if (v == null) return null;
  return loc(v);
}
function strArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
}
function safeSearch(raw?: string): string | null {
  if (!raw) return null;
  const s = raw.replace(/[^a-zA-Z0-9 @._-]/g, "").trim().slice(0, 80);
  return s.length ? s : null;
}

function client(): SupabaseClient | null {
  try {
    return createSupabaseServerClient() as unknown as SupabaseClient;
  } catch {
    return null;
  }
}

export async function listProducts(filters: {
  search?: string;
  categoryId?: string;
  active?: string;
  page?: string | number;
}): Promise<ProductListResult> {
  const supabase = client();
  if (!supabase) return { status: "unavailable" };
  const { page, pageSize, offset } = pagination(filters.page, LIMITS.pageSizeDefault);
  try {
    let q = supabase
      .from("products")
      .select("id, slug, name_localized, category_id, is_active, featured, updated_at", { count: "exact" });
    if (filters.categoryId) q = q.eq("category_id", filters.categoryId);
    if (filters.active === "true") q = q.eq("is_active", true);
    if (filters.active === "false") q = q.eq("is_active", false);
    const search = safeSearch(filters.search);
    if (search) q = q.ilike("slug", `%${search}%`);

    const { data, error, count } = await q
      .order("updated_at", { ascending: false })
      .range(offset, offset + pageSize - 1);
    if (error || !data) return { status: "unavailable" };

    const cats = await loadCategoryMap(supabase);
    return {
      status: "ok",
      rows: data.map((r) => ({
        id: r.id as string,
        slug: r.slug as string,
        name: loc(r.name_localized).en || (r.slug as string),
        categoryId: r.category_id as string,
        categoryName: cats.get(r.category_id as string) ?? (r.category_id as string),
        isActive: r.is_active === true,
        featured: r.featured === true,
        updatedAt: r.updated_at as string,
      })),
      total: count ?? 0,
      page,
      pageSize,
    };
  } catch {
    return { status: "unavailable" };
  }
}

async function loadCategoryMap(supabase: SupabaseClient): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const { data } = await supabase.from("product_categories").select("id, name_localized");
    for (const c of data ?? []) map.set(c.id as string, loc(c.name_localized).en);
  } catch {
    /* empty */
  }
  return map;
}

export async function listCategories(): Promise<CategoryOption[]> {
  const supabase = client();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("product_categories")
      .select("id, slug, name_localized, is_active")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data.map((c) => ({
      id: c.id as string,
      slug: c.slug as string,
      name: loc(c.name_localized).en || (c.slug as string),
      isActive: c.is_active === true,
    }));
  } catch {
    return [];
  }
}

export async function listMediaOptions(): Promise<MediaOption[]> {
  const supabase = client();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("media_assets")
      .select("id, key, type")
      .order("key", { ascending: true })
      .limit(500);
    if (error || !data) return [];
    return data.map((m) => ({ id: m.id as string, key: m.key as string, type: m.type as string }));
  } catch {
    return [];
  }
}

export async function getProduct(id: string): Promise<ProductEditRecord | null> {
  if (!id) return null;
  const supabase = client();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, slug, category_id, name_localized, short_description_localized, card_description_localized, icon_type, image_asset_id, featured, sort_order, is_active, created_at, updated_at"
      )
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;

    const [detailRes, optionsRes] = await Promise.all([
      supabase
        .from("product_details")
        .select("id, positioning_localized, disclaimer_localized, overview_localized, detail_use_cases_localized, recipe_options_localized, updated_at")
        .eq("product_id", id)
        .maybeSingle(),
      supabase
        .from("product_options")
        .select("id, type, label_localized, sort_order, is_active")
        .eq("product_id", id)
        .order("sort_order", { ascending: true }),
    ]);

    const d = detailRes.data;
    return {
      id: data.id as string,
      slug: data.slug as string,
      categoryId: data.category_id as string,
      name: loc(data.name_localized),
      shortDescription: loc(data.short_description_localized),
      cardDescription: loc(data.card_description_localized),
      iconType: data.icon_type as string,
      imageAssetId: (data.image_asset_id as string | null) ?? null,
      featured: data.featured === true,
      sortOrder: (data.sort_order as number) ?? 0,
      isActive: data.is_active === true,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
      isSeedBacked: SEED_ID_RE.test(data.id as string),
      detail: d
        ? {
            id: d.id as string,
            positioning: loc(d.positioning_localized),
            disclaimer: locOrNull(d.disclaimer_localized),
            overview: strArrayLocalized(d.overview_localized),
            useCases: strArrayLocalized(d.detail_use_cases_localized),
            recipeOptions: strArrayLocalized(d.recipe_options_localized),
            updatedAt: d.updated_at as string,
          }
        : null,
      options: (optionsRes.data ?? []).map((o) => ({
        id: o.id as string,
        type: o.type as string,
        label: loc(o.label_localized),
        sortOrder: (o.sort_order as number) ?? 0,
        isActive: o.is_active === true,
      })),
    };
  } catch {
    return null;
  }
}

// The three ordered-list columns hold arrays of localized objects in the seed;
// for the editor we surface the English entries as newline-editable lines.
function strArrayLocalized(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (typeof x === "string") return x;
      if (x && typeof x === "object") return loc(x).en;
      return "";
    })
    .filter((s) => s.length > 0);
}

export { strArray };
