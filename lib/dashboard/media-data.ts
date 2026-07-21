// Media assets data loading (SERVER-ONLY). Reads through the authenticated
// Supabase client (RLS: members read all). Fails closed to "unavailable".

import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { pagination, LIMITS } from "@/lib/dashboard/validation";
import { isMediaType, isMediaStatus } from "@/lib/dashboard/media-constants";

type Localized = { en: string; ar: string };

export type MediaListItem = {
  id: string;
  key: string;
  path: string | null;
  type: string;
  status: string;
  altEn: string;
  updatedAt: string;
  referenced: boolean;
};

export type MediaEditRecord = {
  id: string;
  key: string;
  path: string | null;
  type: string;
  status: string;
  alt: Localized;
  width: number | null;
  height: number | null;
  updatedAt: string;
  referenced: boolean;
  isSeedBacked: boolean;
};

export type MediaListResult =
  | { status: "unavailable" }
  | { status: "ok"; rows: MediaListItem[]; total: number; page: number; pageSize: number };

const SEED_ID_RE = /^(prod|cat|detail|media|partner|proj)_/;
function loc(v: unknown): Localized {
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return { en: typeof o.en === "string" ? o.en : "", ar: typeof o.ar === "string" ? o.ar : "" };
  }
  return { en: "", ar: "" };
}
function safeSearch(raw?: string): string | null {
  if (!raw) return null;
  const s = raw.replace(/[^a-zA-Z0-9 @._/-]/g, "").trim().slice(0, 80);
  return s.length ? s : null;
}
function client(): SupabaseClient | null {
  try {
    return createSupabaseServerClient() as unknown as SupabaseClient;
  } catch {
    return null;
  }
}

// A media asset is "referenced" if any content row points at it. Best-effort:
// checks the FK sources (products.image_asset_id, partners.asset_id,
// partner_project_products.image_asset_id).
async function referencedIds(supabase: SupabaseClient, ids: string[]): Promise<Set<string>> {
  const set = new Set<string>();
  if (ids.length === 0) return set;
  try {
    const [p, pt, ppp] = await Promise.all([
      supabase.from("products").select("image_asset_id").in("image_asset_id", ids),
      supabase.from("partners").select("asset_id").in("asset_id", ids),
      supabase.from("partner_project_products").select("image_asset_id").in("image_asset_id", ids),
    ]);
    for (const r of p.data ?? []) if (r.image_asset_id) set.add(r.image_asset_id as string);
    for (const r of pt.data ?? []) if (r.asset_id) set.add(r.asset_id as string);
    for (const r of ppp.data ?? []) if (r.image_asset_id) set.add(r.image_asset_id as string);
  } catch {
    /* best effort */
  }
  return set;
}

export async function listMedia(filters: {
  search?: string;
  type?: string;
  status?: string;
  page?: string | number;
}): Promise<MediaListResult> {
  const supabase = client();
  if (!supabase) return { status: "unavailable" };
  const { page, pageSize, offset } = pagination(filters.page, LIMITS.pageSizeDefault);
  try {
    let q = supabase
      .from("media_assets")
      .select("id, key, path, alt_localized, type, status, updated_at", { count: "exact" });
    if (filters.type && isMediaType(filters.type)) q = q.eq("type", filters.type);
    if (filters.status && isMediaStatus(filters.status)) q = q.eq("status", filters.status);
    const search = safeSearch(filters.search);
    if (search) q = q.ilike("key", `%${search}%`);

    const { data, error, count } = await q
      .order("key", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error || !data) return { status: "unavailable" };

    const refs = await referencedIds(supabase, data.map((r) => r.id as string));
    return {
      status: "ok",
      rows: data.map((r) => ({
        id: r.id as string,
        key: r.key as string,
        path: (r.path as string | null) ?? null,
        type: r.type as string,
        status: r.status as string,
        altEn: loc(r.alt_localized).en,
        updatedAt: r.updated_at as string,
        referenced: refs.has(r.id as string),
      })),
      total: count ?? 0,
      page,
      pageSize,
    };
  } catch {
    return { status: "unavailable" };
  }
}

export async function getMedia(id: string): Promise<MediaEditRecord | null> {
  if (!id) return null;
  const supabase = client();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("media_assets")
      .select("id, key, path, alt_localized, type, status, width, height, updated_at")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    const refs = await referencedIds(supabase, [data.id as string]);
    return {
      id: data.id as string,
      key: data.key as string,
      path: (data.path as string | null) ?? null,
      type: data.type as string,
      status: data.status as string,
      alt: loc(data.alt_localized),
      width: (data.width as number | null) ?? null,
      height: (data.height as number | null) ?? null,
      updatedAt: data.updated_at as string,
      referenced: refs.has(data.id as string),
      isSeedBacked: SEED_ID_RE.test(data.id as string),
    };
  } catch {
    return null;
  }
}
