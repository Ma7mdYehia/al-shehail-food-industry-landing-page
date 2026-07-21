import type { Metadata } from "next";
import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireDashboardMember } from "@/lib/auth/dashboard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Overview" };

type CountResult = { ok: true; count: number } | { ok: false };
type CountQuery = ReturnType<ReturnType<SupabaseClient["from"]>["select"]>;

// One card failing must never crash the dashboard: each count is isolated.
async function safeCount(
  supabase: SupabaseClient,
  table: string,
  apply?: (q: CountQuery) => CountQuery
): Promise<CountResult> {
  try {
    let query: CountQuery = supabase.from(table).select("id", { count: "exact", head: true });
    if (apply) query = apply(query);
    const { count, error } = await query;
    if (error) return { ok: false };
    return { ok: true, count: count ?? 0 };
  } catch {
    return { ok: false };
  }
}

function StatCard({ label, result, note }: { label: string; result: CountResult; note?: string }) {
  return (
    <div className="dash-glass dash-card">
      <p className="dash-card-label">{label}</p>
      {result.ok ? (
        <p className="dash-card-value">{result.count}</p>
      ) : (
        <p className="dash-card-value dash-card-error" aria-live="polite">
          —
        </p>
      )}
      {result.ok ? (
        note ? <p className="dash-card-note">{note}</p> : null
      ) : (
        <p className="dash-card-note dash-card-error">Unavailable</p>
      )}
    </div>
  );
}

export default async function DashboardOverviewPage() {
  const member = await requireDashboardMember();

  let supabase: SupabaseClient | null = null;
  try {
    supabase = createSupabaseServerClient() as unknown as SupabaseClient;
  } catch {
    supabase = null;
  }

  const unavailable: CountResult = { ok: false };
  const [products, services, partners, media, newEnquiries, contactedEnquiries] = supabase
    ? await Promise.all([
        safeCount(supabase, "products"),
        safeCount(supabase, "services"),
        safeCount(supabase, "partners"),
        safeCount(supabase, "media_assets"),
        safeCount(supabase, "form_enquiries", (q) => q.eq("status", "new")),
        safeCount(supabase, "form_enquiries", (q) => q.eq("status", "contacted")),
      ])
    : [unavailable, unavailable, unavailable, unavailable, unavailable, unavailable];

  const dbConnected =
    supabase !== null &&
    [products, services, partners, media].some((r) => r.ok);

  return (
    <>
      <h1 className="dash-page-title">Overview</h1>
      <p className="dash-page-sub">
        Welcome, {member.displayName}. Here&apos;s a read-only snapshot of your content.
      </p>

      <div className="dash-glass dash-card" style={{ marginBottom: 20 }}>
        <p className="dash-card-label">Signed in as</p>
        <p style={{ margin: 0, fontWeight: 600 }}>
          {member.displayName} — <span className="dash-role-badge">{member.role}</span>
        </p>
        <p className="dash-card-note">
          Database:{" "}
          {dbConnected ? (
            <span className="dash-status-ok">connected</span>
          ) : (
            <span className="dash-status-off">not available</span>
          )}
        </p>
      </div>

      <div className="dash-grid">
        <StatCard label="Products" result={products} />
        <StatCard label="Services" result={services} />
        <StatCard label="Partners" result={partners} />
        <StatCard label="Media assets" result={media} />
        <StatCard label="New enquiries" result={newEnquiries} note="Awaiting first contact" />
      </div>

      <section className="dash-section">
        <h2>Enquiries at a glance</h2>
        <div className="dash-grid">
          <StatCard label="New" result={newEnquiries} />
          <StatCard label="Contacted" result={contactedEnquiries} />
        </div>
        <p className="dash-card-note" style={{ marginTop: 10 }}>
          Enquiry management (including message contents) arrives in a later patch. Only
          aggregate counts are shown here.
        </p>
      </section>

      <section className="dash-section">
        <h2>Quick links</h2>
        <div className="dash-grid">
          <Link className="dash-glass dash-card dash-nav-link" href="/dashboard/products">
            Products
          </Link>
          <Link className="dash-glass dash-card dash-nav-link" href="/dashboard/services">
            Services
          </Link>
          <Link className="dash-glass dash-card dash-nav-link" href="/dashboard/partners">
            Partners
          </Link>
          <Link className="dash-glass dash-card dash-nav-link" href="/dashboard/enquiries">
            Enquiries
          </Link>
        </div>
      </section>
    </>
  );
}
