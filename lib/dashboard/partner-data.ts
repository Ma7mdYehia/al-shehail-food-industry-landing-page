// Partners + partner_projects + partner_project_products data (SERVER-ONLY).
// RLS: members read all. Fails closed to "unavailable".

import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Localized = { en: string; ar: string };

export { PPP_STATUSES, isPppStatus, type PppStatus } from "@/lib/dashboard/partner-constants";

export type PartnerListItem = { id: string; slug: string; name: string; isActive: boolean; sortOrder: number; updatedAt: string };
export type MediaOption = { id: string; key: string };
export type ProductOption = { id: string; slug: string; name: string };

export type ProjectProductRow = {
  id: string;
  productId: string | null;
  name: Localized | null;
  status: string;
  sortOrder: number;
  updatedAt: string;
  hasRichData: boolean;
};

export type ProjectRow = {
  id: string;
  slug: string;
  title: Localized;
  isActive: boolean;
  sortOrder: number;
  updatedAt: string;
};

export type PartnerEditRecord = {
  id: string;
  slug: string;
  name: string;
  assetId: string | null;
  isActive: boolean;
  sortOrder: number;
  updatedAt: string;
  isSeedBacked: boolean;
  projects: ProjectRow[];
};

export type ProjectEditRecord = {
  id: string;
  partnerId: string;
  slug: string;
  title: Localized;
  summary: Localized;
  isActive: boolean;
  sortOrder: number;
  updatedAt: string;
  products: ProjectProductRow[];
};

const SEED_ID_RE = /^(prod|cat|detail|media|partner|proj)_/;
function loc(v: unknown): Localized {
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return { en: typeof o.en === "string" ? o.en : "", ar: typeof o.ar === "string" ? o.ar : "" };
  }
  return { en: "", ar: "" };
}
function locOrNull(v: unknown): Localized | null {
  return v == null ? null : loc(v);
}
function client(): SupabaseClient | null {
  try {
    return createSupabaseServerClient() as unknown as SupabaseClient;
  } catch {
    return null;
  }
}

export async function listPartners(): Promise<{ status: "unavailable" } | { status: "ok"; rows: PartnerListItem[] }> {
  const supabase = client();
  if (!supabase) return { status: "unavailable" };
  try {
    const { data, error } = await supabase
      .from("partners")
      .select("id, slug, name, is_active, sort_order, updated_at")
      .order("sort_order", { ascending: true });
    if (error || !data) return { status: "unavailable" };
    return {
      status: "ok",
      rows: data.map((p) => ({
        id: p.id as string,
        slug: p.slug as string,
        name: p.name as string,
        isActive: p.is_active === true,
        sortOrder: (p.sort_order as number) ?? 0,
        updatedAt: p.updated_at as string,
      })),
    };
  } catch {
    return { status: "unavailable" };
  }
}

export async function listMediaOptions(): Promise<MediaOption[]> {
  const supabase = client();
  if (!supabase) return [];
  try {
    const { data } = await supabase.from("media_assets").select("id, key").order("key").limit(500);
    return (data ?? []).map((m) => ({ id: m.id as string, key: m.key as string }));
  } catch {
    return [];
  }
}

export async function listProductOptions(): Promise<ProductOption[]> {
  const supabase = client();
  if (!supabase) return [];
  try {
    const { data } = await supabase.from("products").select("id, slug, name_localized").order("slug").limit(500);
    return (data ?? []).map((p) => ({ id: p.id as string, slug: p.slug as string, name: loc(p.name_localized).en || (p.slug as string) }));
  } catch {
    return [];
  }
}

export async function getPartner(id: string): Promise<PartnerEditRecord | null> {
  if (!id) return null;
  const supabase = client();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("partners")
      .select("id, slug, name, asset_id, is_active, sort_order, updated_at")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    const projects = await supabase
      .from("partner_projects")
      .select("id, slug, title_localized, is_active, sort_order, updated_at")
      .eq("partner_id", id)
      .order("sort_order", { ascending: true });
    return {
      id: data.id as string,
      slug: data.slug as string,
      name: data.name as string,
      assetId: (data.asset_id as string | null) ?? null,
      isActive: data.is_active === true,
      sortOrder: (data.sort_order as number) ?? 0,
      updatedAt: data.updated_at as string,
      isSeedBacked: SEED_ID_RE.test(data.id as string),
      projects: (projects.data ?? []).map((p) => ({
        id: p.id as string,
        slug: p.slug as string,
        title: loc(p.title_localized),
        isActive: p.is_active === true,
        sortOrder: (p.sort_order as number) ?? 0,
        updatedAt: p.updated_at as string,
      })),
    };
  } catch {
    return null;
  }
}

export async function getProject(id: string): Promise<ProjectEditRecord | null> {
  if (!id) return null;
  const supabase = client();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("partner_projects")
      .select("id, partner_id, slug, title_localized, summary_localized, is_active, sort_order, updated_at")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    const products = await supabase
      .from("partner_project_products")
      .select("id, product_id, product_name_localized, category_localized, short_description_localized, key_notes_localized, status, sort_order, updated_at")
      .eq("partner_project_id", id)
      .order("sort_order", { ascending: true });
    return {
      id: data.id as string,
      partnerId: data.partner_id as string,
      slug: data.slug as string,
      title: loc(data.title_localized),
      summary: loc(data.summary_localized),
      isActive: data.is_active === true,
      sortOrder: (data.sort_order as number) ?? 0,
      updatedAt: data.updated_at as string,
      products: (products.data ?? []).map((pp) => {
        const keyNotes = Array.isArray(pp.key_notes_localized) ? pp.key_notes_localized : [];
        const hasRich =
          pp.category_localized != null ||
          pp.short_description_localized != null ||
          keyNotes.length > 0;
        return {
          id: pp.id as string,
          productId: (pp.product_id as string | null) ?? null,
          name: locOrNull(pp.product_name_localized),
          status: pp.status as string,
          sortOrder: (pp.sort_order as number) ?? 0,
          updatedAt: pp.updated_at as string,
          hasRichData: hasRich,
        };
      }),
    };
  } catch {
    return null;
  }
}
