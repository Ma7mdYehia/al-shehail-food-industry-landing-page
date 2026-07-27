// Shared-content (settings) data loading (SERVER-ONLY, not a server-action file).
// The shared_content singleton holds a localized recipe disclaimer plus three
// structured localized point-lists. Fails closed to null.

import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Localized = { en: string; ar: string };

export type SharedContent = {
  id: string;
  recipeDisclaimer: Localized;
  privateLabelCount: number;
  packagingCount: number;
  qualityCount: number;
  updatedAt: string;
};

function loc(v: unknown): Localized {
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return { en: typeof o.en === "string" ? o.en : "", ar: typeof o.ar === "string" ? o.ar : "" };
  }
  return { en: "", ar: "" };
}
function count(v: unknown): number {
  return Array.isArray(v) ? v.length : 0;
}

export async function getSharedContent(): Promise<SharedContent | null> {
  let supabase: SupabaseClient;
  try {
    supabase = createSupabaseServerClient() as unknown as SupabaseClient;
  } catch {
    return null;
  }
  try {
    const { data, error } = await supabase
      .from("shared_content")
      .select("id, recipe_disclaimer_localized, private_label_points_localized, packaging_options_localized, quality_points_localized, updated_at")
      .eq("id", "default")
      .maybeSingle();
    if (error || !data) return null;
    return {
      id: data.id as string,
      recipeDisclaimer: loc(data.recipe_disclaimer_localized),
      privateLabelCount: count(data.private_label_points_localized),
      packagingCount: count(data.packaging_options_localized),
      qualityCount: count(data.quality_points_localized),
      updatedAt: data.updated_at as string,
    };
  } catch {
    return null;
  }
}
