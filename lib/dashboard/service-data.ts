// Services + service_sections data loading (SERVER-ONLY). RLS: members read all.
// Fails closed to "unavailable".

import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Localized = { en: string; ar: string };

export type ServiceListItem = {
  id: string;
  slug: string;
  title: string;
  isActive: boolean;
  sortOrder: number;
  updatedAt: string;
};

export type ServiceSectionRow = {
  id: string;
  sectionType: string;
  title: Localized | null;
  eyebrow: Localized | null;
  description: Localized | null;
  sortOrder: number;
  isActive: boolean;
  updatedAt: string;
};

export type ServiceEditRecord = {
  id: string;
  slug: string;
  metaTitle: Localized;
  metaDescription: Localized;
  heroEyebrow: Localized;
  heroTitle: Localized;
  heroSubtitle: Localized;
  sortOrder: number;
  isActive: boolean;
  updatedAt: string;
  isSeedBacked: boolean;
  sections: ServiceSectionRow[];
};

const SEED_ID_RE = /^(prod|cat|detail|media|partner|proj|svc|service)_/;
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

export async function listServices(): Promise<{ status: "unavailable" } | { status: "ok"; rows: ServiceListItem[] }> {
  const supabase = client();
  if (!supabase) return { status: "unavailable" };
  try {
    const { data, error } = await supabase
      .from("services")
      .select("id, slug, hero_title_localized, is_active, sort_order, updated_at")
      .order("sort_order", { ascending: true });
    if (error || !data) return { status: "unavailable" };
    return {
      status: "ok",
      rows: data.map((s) => ({
        id: s.id as string,
        slug: s.slug as string,
        title: loc(s.hero_title_localized).en || (s.slug as string),
        isActive: s.is_active === true,
        sortOrder: (s.sort_order as number) ?? 0,
        updatedAt: s.updated_at as string,
      })),
    };
  } catch {
    return { status: "unavailable" };
  }
}

export async function getService(id: string): Promise<ServiceEditRecord | null> {
  if (!id) return null;
  const supabase = client();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("services")
      .select("id, slug, meta_title_localized, meta_description_localized, hero_eyebrow_localized, hero_title_localized, hero_subtitle_localized, sort_order, is_active, updated_at")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    const sections = await supabase
      .from("service_sections")
      .select("id, section_type, title_localized, eyebrow_localized, description_localized, sort_order, is_active, updated_at")
      .eq("service_id", id)
      .order("sort_order", { ascending: true });
    return {
      id: data.id as string,
      slug: data.slug as string,
      metaTitle: loc(data.meta_title_localized),
      metaDescription: loc(data.meta_description_localized),
      heroEyebrow: loc(data.hero_eyebrow_localized),
      heroTitle: loc(data.hero_title_localized),
      heroSubtitle: loc(data.hero_subtitle_localized),
      sortOrder: (data.sort_order as number) ?? 0,
      isActive: data.is_active === true,
      updatedAt: data.updated_at as string,
      isSeedBacked: SEED_ID_RE.test(data.id as string),
      sections: (sections.data ?? []).map((s) => ({
        id: s.id as string,
        sectionType: s.section_type as string,
        title: locOrNull(s.title_localized),
        eyebrow: locOrNull(s.eyebrow_localized),
        description: locOrNull(s.description_localized),
        sortOrder: (s.sort_order as number) ?? 0,
        isActive: s.is_active === true,
        updatedAt: s.updated_at as string,
      })),
    };
  } catch {
    return null;
  }
}
