import type { Metadata } from "next";
import Link from "next/link";
import { requireDashboardMember } from "@/lib/auth/dashboard";
import {
  listEnquiries,
  getEnquiry,
  loadAssignableMembers,
} from "@/lib/dashboard/enquiry-data";
import { EnquiryWorkflow } from "@/components/dashboard/EnquiryWorkflow";
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS } from "@/lib/dashboard/enquiry-constants";
import { formatDate, formatDateTime } from "@/lib/dashboard/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Enquiries" };

type SearchParams = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireDashboardMember();

  const filters = {
    search: str(searchParams.search),
    status: str(searchParams.status),
    assignedTo: str(searchParams.assignedTo),
    from: str(searchParams.from),
    to: str(searchParams.to),
    page: str(searchParams.page) || "1",
  };
  const selectedId = str(searchParams.id);

  const [list, members, detail] = await Promise.all([
    listEnquiries(filters),
    loadAssignableMembers(),
    selectedId ? getEnquiry(selectedId) : Promise.resolve(null),
  ]);
  const memberName = (id: string | null) =>
    id ? members.find((mbr) => mbr.id === id)?.displayName ?? "—" : "—";

  return (
    <>
      <h1 className="dash-page-title">Enquiries</h1>
      <p className="dash-page-sub">
        Review and handle contact-form enquiries. Assignment and audit stamping are recorded by
        the database.
      </p>

      <form method="get" className="dash-filters" aria-label="Filter enquiries">
        <label className="dash-field">
          <span className="dash-field-label">Search</span>
          <input
            className="dash-input"
            type="search"
            name="search"
            defaultValue={filters.search}
            placeholder="Name, email or company"
          />
        </label>
        <label className="dash-field">
          <span className="dash-field-label">Status</span>
          <select className="dash-select" name="status" defaultValue={filters.status}>
            <option value="">All</option>
            {ENQUIRY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {ENQUIRY_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="dash-field">
          <span className="dash-field-label">Assigned to</span>
          <select className="dash-select" name="assignedTo" defaultValue={filters.assignedTo}>
            <option value="">Anyone</option>
            {members.map((mbr) => (
              <option key={mbr.id} value={mbr.id}>
                {mbr.displayName}
              </option>
            ))}
          </select>
        </label>
        <label className="dash-field">
          <span className="dash-field-label">From</span>
          <input className="dash-input" type="date" name="from" defaultValue={filters.from} />
        </label>
        <label className="dash-field">
          <span className="dash-field-label">To</span>
          <input className="dash-input" type="date" name="to" defaultValue={filters.to} />
        </label>
        <div className="dash-field dash-filters-actions">
          <button type="submit" className="dash-btn dash-btn-primary">
            Apply
          </button>
          <Link href="/dashboard/enquiries" className="dash-btn">
            Reset
          </Link>
        </div>
      </form>

      {list.status === "unavailable" ? (
        <div className="dash-glass dash-card" role="status">
          <p className="dash-card-note dash-card-error">
            Enquiries are unavailable right now. Please refresh.
          </p>
        </div>
      ) : list.rows.length === 0 ? (
        <div className="dash-glass dash-card" role="status">
          <p className="dash-card-label">No enquiries</p>
          <p className="dash-card-note">No enquiries match the current filters.</p>
        </div>
      ) : (
        <>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Company</th>
                  <th scope="col">Status</th>
                  <th scope="col">Assigned</th>
                  <th scope="col">Received</th>
                  <th scope="col">
                    <span className="dash-visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.rows.map((e) => (
                  <tr key={e.id} aria-current={e.id === selectedId ? "true" : undefined}>
                    <td>{e.fullName}</td>
                    <td>{e.company ?? "—"}</td>
                    <td>
                      <span className={`dash-status dash-status-${e.status}`}>
                        {ENQUIRY_STATUS_LABELS[e.status] ?? e.status}
                      </span>
                    </td>
                    <td>{memberName(e.assignedTo)}</td>
                    <td>{formatDate(e.createdAt)}</td>
                    <td>
                      <Link
                        className="dash-inline-link"
                        href={`/dashboard/enquiries?id=${encodeURIComponent(e.id)}`}
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={list.page} pageSize={list.pageSize} total={list.total} filters={filters} />
        </>
      )}

      {detail ? (
        <section className="dash-section dash-detail" aria-label="Enquiry detail">
          <h2>
            {detail.fullName}
            {detail.company ? ` — ${detail.company}` : ""}
          </h2>
          <div className="dash-detail-grid">
            <dl className="dash-detail-facts">
              <div><dt>Email</dt><dd>{detail.email}</dd></div>
              <div><dt>WhatsApp</dt><dd>{detail.whatsapp ?? "—"}</dd></div>
              <div><dt>Country</dt><dd>{detail.country ?? "—"}</dd></div>
              <div><dt>Category</dt><dd>{detail.category ?? "—"}</dd></div>
              <div><dt>Product</dt><dd>{detail.product ?? "—"}</dd></div>
              <div><dt>Quantity</dt><dd>{detail.quantity ?? "—"}</dd></div>
              <div><dt>Target market</dt><dd>{detail.targetMarket ?? "—"}</dd></div>
              <div><dt>Existing recipe</dt><dd>{detail.existingRecipe ? "Yes" : "No"}</dd></div>
              <div><dt>Packaging support</dt><dd>{detail.packagingSupport ? "Yes" : "No"}</dd></div>
              <div><dt>Locale</dt><dd>{detail.locale}</dd></div>
              <div><dt>Received</dt><dd>{formatDateTime(detail.createdAt)}</dd></div>
              <div>
                <dt>Last handled</dt>
                <dd>
                  {detail.handledAt
                    ? `${formatDateTime(detail.handledAt)} · ${memberName(detail.handledBy)}`
                    : "Not yet handled"}
                </dd>
              </div>
            </dl>
            {detail.message ? (
              <div className="dash-detail-message">
                <h3>Message</h3>
                <p>{detail.message}</p>
              </div>
            ) : null}
          </div>

          <EnquiryWorkflow enquiry={detail} members={members} />
          <p style={{ marginTop: 12 }}>
            <Link className="dash-inline-link" href="/dashboard/enquiries">
              ← Back to list
            </Link>
          </p>
        </section>
      ) : selectedId ? (
        <div className="dash-glass dash-card" role="status" style={{ marginTop: 16 }}>
          <p className="dash-card-note">That enquiry could not be found.</p>
        </div>
      ) : null}
    </>
  );
}

function Pagination({
  page,
  pageSize,
  total,
  filters,
}: {
  page: number;
  pageSize: number;
  total: number;
  filters: Record<string, string>;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const qp = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) if (v && k !== "page") params.set(k, v);
    params.set("page", String(p));
    return `/dashboard/enquiries?${params.toString()}`;
  };
  return (
    <nav className="dash-pagination" aria-label="Enquiry pages">
      {page > 1 ? (
        <Link className="dash-btn" href={qp(page - 1)}>
          ← Previous
        </Link>
      ) : (
        <span className="dash-btn dash-btn-disabled" aria-disabled="true">← Previous</span>
      )}
      <span className="dash-pagination-status">
        Page {page} of {pages}
      </span>
      {page < pages ? (
        <Link className="dash-btn" href={qp(page + 1)}>
          Next →
        </Link>
      ) : (
        <span className="dash-btn dash-btn-disabled" aria-disabled="true">Next →</span>
      )}
    </nav>
  );
}
