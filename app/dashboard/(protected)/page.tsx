import type { Metadata } from "next";
import Link from "next/link";
import { requireDashboardMember } from "@/lib/auth/dashboard";
import { loadOverview, type Metric } from "@/lib/dashboard/overview-data";
import { formatDate } from "@/lib/dashboard/format";
import { ENQUIRY_STATUS_LABELS } from "@/lib/dashboard/enquiry-constants";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Overview" };

function StatCard({ label, result, note }: { label: string; result: Metric; note?: string }) {
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
  const overview = await loadOverview();
  const m = overview.metrics;

  return (
    <>
      <h1 className="dash-page-title">Overview</h1>
      <p className="dash-page-sub">
        Welcome, {member.displayName}. Here&apos;s a live snapshot of your content and enquiries.
      </p>

      {!overview.configured ? (
        <div className="dash-glass dash-card" role="status" style={{ marginBottom: 20 }}>
          <p className="dash-card-label">Database</p>
          <p className="dash-card-note dash-card-error">
            The content database is not available in this environment. Metrics and management will
            appear once it is configured.
          </p>
        </div>
      ) : null}

      <div className="dash-grid">
        <StatCard label="Products" result={m.products} />
        <StatCard label="Active products" result={m.activeProducts} />
        <StatCard label="Services" result={m.services} />
        <StatCard label="Partners" result={m.partners} />
        <StatCard label="Media assets" result={m.media} />
        <StatCard label="Enquiries" result={m.enquiriesTotal} />
        <StatCard label="New enquiries" result={m.enquiriesNew} note="Awaiting first contact" />
        <StatCard label="Active team" result={m.teamActive} />
      </div>

      <section className="dash-section">
        <h2>Recent enquiries</h2>
        {overview.recentEnquiries === null ? (
          <p className="dash-card-note dash-card-error" role="status">
            Enquiries are unavailable right now.
          </p>
        ) : overview.recentEnquiries.length === 0 ? (
          <p className="dash-card-note" role="status">
            No enquiries yet.
          </p>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Company</th>
                  <th scope="col">Status</th>
                  <th scope="col">Received</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentEnquiries.map((e) => (
                  <tr key={e.id}>
                    <td>{e.fullName}</td>
                    <td>{e.company ?? "—"}</td>
                    <td>
                      <span className={`dash-status dash-status-${e.status}`}>
                        {ENQUIRY_STATUS_LABELS[e.status] ?? e.status}
                      </span>
                    </td>
                    <td>{formatDate(e.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p style={{ marginTop: 10 }}>
          <Link className="dash-inline-link" href="/dashboard/enquiries">
            Manage enquiries →
          </Link>
        </p>
      </section>

      <section className="dash-section">
        <h2>Recently updated content</h2>
        {overview.recentContent.length === 0 ? (
          <p className="dash-card-note" role="status">
            No recent content changes.
          </p>
        ) : (
          <ul className="dash-recent-list">
            {overview.recentContent.map((c) => (
              <li key={c.id} className="dash-glass dash-card dash-recent-item">
                <span className="dash-recent-kind">{c.kind}</span>
                <span className="dash-recent-label">{c.label}</span>
                <span className="dash-card-note">{formatDate(c.updatedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="dash-section">
        <h2>Quick actions</h2>
        <div className="dash-grid">
          <Link className="dash-glass dash-card dash-nav-link" href="/dashboard/products">
            Manage products
          </Link>
          <Link className="dash-glass dash-card dash-nav-link" href="/dashboard/enquiries">
            Review enquiries
          </Link>
          <Link className="dash-glass dash-card dash-nav-link" href="/dashboard/media">
            Media library
          </Link>
          {member.role === "owner" ? (
            <Link className="dash-glass dash-card dash-nav-link" href="/dashboard/team">
              Manage team
            </Link>
          ) : null}
        </div>
      </section>
    </>
  );
}
