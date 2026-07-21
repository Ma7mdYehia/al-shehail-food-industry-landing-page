// Dashboard overview data loading (SERVER-ONLY). Reads through the authenticated
// Supabase client (RLS applies). Every metric is isolated so one failure cannot
// crash the page, and a missing Supabase configuration resolves to a safe
// "unavailable" state without exposing any environment detail.

import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Metric = { ok: true; count: number } | { ok: false };

export type RecentEnquiry = {
  id: string;
  fullName: string;
  company: string | null;
  status: string;
  createdAt: string;
};

export type RecentContent = {
  id: string;
  label: string;
  kind: string;
  updatedAt: string;
};

export type Overview = {
  configured: boolean;
  metrics: {
    products: Metric;
    activeProducts: Metric;
    services: Metric;
    partners: Metric;
    media: Metric;
    enquiriesTotal: Metric;
    enquiriesNew: Metric;
    teamActive: Metric;
  };
  recentEnquiries: RecentEnquiry[] | null;
  recentContent: RecentContent[];
};

type CountQuery = ReturnType<ReturnType<SupabaseClient["from"]>["select"]>;

async function count(
  supabase: SupabaseClient,
  table: string,
  apply?: (q: CountQuery) => CountQuery
): Promise<Metric> {
  try {
    let q: CountQuery = supabase.from(table).select("id", { count: "exact", head: true });
    if (apply) q = apply(q);
    const { count: c, error } = await q;
    if (error) return { ok: false };
    return { ok: true, count: c ?? 0 };
  } catch {
    return { ok: false };
  }
}

async function activeMemberCount(supabase: SupabaseClient): Promise<Metric> {
  try {
    // Uses the P05 SECURITY DEFINER RPC so the total is accurate for any role
    // without exposing the member list to admins/editors.
    const { data, error } = await supabase.rpc("dashboard_active_member_count");
    if (error || typeof data !== "number") return { ok: false };
    return { ok: true, count: data };
  } catch {
    return { ok: false };
  }
}

const UNAVAILABLE: Metric = { ok: false };

export async function loadOverview(): Promise<Overview> {
  let supabase: SupabaseClient | null = null;
  try {
    supabase = createSupabaseServerClient() as unknown as SupabaseClient;
  } catch {
    supabase = null;
  }

  if (!supabase) {
    return {
      configured: false,
      metrics: {
        products: UNAVAILABLE,
        activeProducts: UNAVAILABLE,
        services: UNAVAILABLE,
        partners: UNAVAILABLE,
        media: UNAVAILABLE,
        enquiriesTotal: UNAVAILABLE,
        enquiriesNew: UNAVAILABLE,
        teamActive: UNAVAILABLE,
      },
      recentEnquiries: null,
      recentContent: [],
    };
  }

  const [
    products,
    activeProducts,
    services,
    partners,
    media,
    enquiriesTotal,
    enquiriesNew,
    teamActive,
    recentEnquiries,
    recentProducts,
  ] = await Promise.all([
    count(supabase, "products"),
    count(supabase, "products", (q) => q.eq("is_active", true)),
    count(supabase, "services"),
    count(supabase, "partners"),
    count(supabase, "media_assets"),
    count(supabase, "form_enquiries"),
    count(supabase, "form_enquiries", (q) => q.eq("status", "new")),
    activeMemberCount(supabase),
    loadRecentEnquiries(supabase),
    loadRecentProducts(supabase),
  ]);

  return {
    configured: true,
    metrics: {
      products,
      activeProducts,
      services,
      partners,
      media,
      enquiriesTotal,
      enquiriesNew,
      teamActive,
    },
    recentEnquiries,
    recentContent: recentProducts,
  };
}

async function loadRecentEnquiries(supabase: SupabaseClient): Promise<RecentEnquiry[] | null> {
  try {
    const { data, error } = await supabase
      .from("form_enquiries")
      .select("id, full_name, company_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (error || !data) return null;
    return data.map((r) => ({
      id: r.id as string,
      fullName: r.full_name as string,
      company: (r.company_name as string | null) ?? null,
      status: r.status as string,
      createdAt: r.created_at as string,
    }));
  } catch {
    return null;
  }
}

async function loadRecentProducts(supabase: SupabaseClient): Promise<RecentContent[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name_localized, updated_at")
      .order("updated_at", { ascending: false })
      .limit(5);
    if (error || !data) return [];
    return data.map((r) => {
      const nl = r.name_localized as { en?: string } | null;
      return {
        id: r.id as string,
        label: nl?.en ?? (r.id as string),
        kind: "Product",
        updatedAt: r.updated_at as string,
      };
    });
  } catch {
    return [];
  }
}
