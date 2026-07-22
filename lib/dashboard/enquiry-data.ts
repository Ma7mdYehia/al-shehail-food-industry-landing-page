// Enquiry workflow data loading (SERVER-ONLY). Reads through the authenticated
// Supabase client; RLS restricts this to active dashboard members. Never logs
// enquiry content. Fails closed to "unavailable".

import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isEnquiryStatus, type EnquiryStatus } from "@/lib/dashboard/enquiry-constants";
import { LIMITS, pagination } from "@/lib/dashboard/validation";

export type EnquiryListItem = {
  id: string;
  fullName: string;
  company: string | null;
  email: string;
  status: string;
  assignedTo: string | null;
  handledAt: string | null;
  createdAt: string;
};

export type EnquiryDetail = EnquiryListItem & {
  updatedAt: string;
  country: string | null;
  whatsapp: string | null;
  category: string | null;
  product: string | null;
  quantity: string | null;
  targetMarket: string | null;
  existingRecipe: boolean;
  packagingSupport: boolean;
  message: string | null;
  internalNotes: string | null;
  handledBy: string | null;
  locale: string;
  sourcePath: string;
};

export type AssignableMember = { id: string; displayName: string };

export type EnquiryListResult =
  | { status: "unavailable" }
  | {
      status: "ok";
      rows: EnquiryListItem[];
      total: number;
      page: number;
      pageSize: number;
    };

export type EnquiryFilters = {
  search?: string;
  status?: string;
  assignedTo?: string;
  from?: string;
  to?: string;
  page?: string | number;
  pageSize?: string | number;
};

// Restrict free-text search to a safe token set so it can never break out of the
// PostgREST filter grammar (no commas/parentheses/wildcards from the user).
function safeSearch(raw?: string): string | null {
  if (!raw) return null;
  const s = raw.replace(/[^a-zA-Z0-9 @._-]/g, "").trim().slice(0, 80);
  return s.length ? s : null;
}
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function listEnquiries(filters: EnquiryFilters): Promise<EnquiryListResult> {
  let supabase: SupabaseClient;
  try {
    supabase = createSupabaseServerClient() as unknown as SupabaseClient;
  } catch {
    return { status: "unavailable" };
  }

  const { page, pageSize, offset } = pagination(filters.page, filters.pageSize ?? LIMITS.pageSizeDefault);

  try {
    let q = supabase
      .from("form_enquiries")
      .select(
        "id, full_name, company_name, email, status, assigned_to, handled_at, created_at",
        { count: "exact" }
      );

    if (filters.status && isEnquiryStatus(filters.status)) {
      q = q.eq("status", filters.status as EnquiryStatus);
    }
    if (filters.assignedTo && UUID_RE.test(filters.assignedTo)) {
      q = q.eq("assigned_to", filters.assignedTo);
    }
    if (filters.from && ISO_DATE.test(filters.from)) {
      q = q.gte("created_at", `${filters.from}T00:00:00Z`);
    }
    if (filters.to && ISO_DATE.test(filters.to)) {
      q = q.lte("created_at", `${filters.to}T23:59:59Z`);
    }
    const search = safeSearch(filters.search);
    if (search) {
      q = q.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`
      );
    }

    const { data, error, count } = await q
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error || !data) return { status: "unavailable" };

    return {
      status: "ok",
      rows: data.map(mapListItem),
      total: count ?? 0,
      page,
      pageSize,
    };
  } catch {
    return { status: "unavailable" };
  }
}

export async function getEnquiry(id: string): Promise<EnquiryDetail | null> {
  if (!id) return null;
  let supabase: SupabaseClient;
  try {
    supabase = createSupabaseServerClient() as unknown as SupabaseClient;
  } catch {
    return null;
  }
  try {
    const { data, error } = await supabase
      .from("form_enquiries")
      .select(
        "id, full_name, company_name, email, status, assigned_to, handled_at, handled_by, created_at, updated_at, country, whatsapp, category, product, quantity, target_market, existing_recipe, packaging_support, message, internal_notes, locale, source_path"
      )
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return {
      ...mapListItem(data),
      updatedAt: data.updated_at as string,
      country: (data.country as string | null) ?? null,
      whatsapp: (data.whatsapp as string | null) ?? null,
      category: (data.category as string | null) ?? null,
      product: (data.product as string | null) ?? null,
      quantity: (data.quantity as string | null) ?? null,
      targetMarket: (data.target_market as string | null) ?? null,
      existingRecipe: data.existing_recipe === true,
      packagingSupport: data.packaging_support === true,
      message: (data.message as string | null) ?? null,
      internalNotes: (data.internal_notes as string | null) ?? null,
      handledBy: (data.handled_by as string | null) ?? null,
      locale: (data.locale as string) ?? "en",
      sourcePath: (data.source_path as string) ?? "",
    };
  } catch {
    return null;
  }
}

export async function loadAssignableMembers(): Promise<AssignableMember[]> {
  let supabase: SupabaseClient;
  try {
    supabase = createSupabaseServerClient() as unknown as SupabaseClient;
  } catch {
    return [];
  }
  try {
    const { data, error } = await supabase.rpc("dashboard_assignable_members");
    if (error || !Array.isArray(data)) return [];
    return data.map((m) => ({ id: m.id as string, displayName: m.display_name as string }));
  } catch {
    return [];
  }
}

function mapListItem(r: Record<string, unknown>): EnquiryListItem {
  return {
    id: r.id as string,
    fullName: r.full_name as string,
    company: (r.company_name as string | null) ?? null,
    email: r.email as string,
    status: r.status as string,
    assignedTo: (r.assigned_to as string | null) ?? null,
    handledAt: (r.handled_at as string | null) ?? null,
    createdAt: r.created_at as string,
  };
}
