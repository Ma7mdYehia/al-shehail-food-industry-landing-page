import type { Metadata } from "next";
import Link from "next/link";
import { requireDashboardMember } from "@/lib/auth/dashboard";
import { canDeleteContent } from "@/lib/auth/roles";
import { listMedia, getMedia } from "@/lib/dashboard/media-data";
import { MEDIA_TYPES, MEDIA_STATUSES } from "@/lib/dashboard/media-constants";
import { MediaEditor } from "@/components/dashboard/MediaEditor";
import { formatDate } from "@/lib/dashboard/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Media" };

type SearchParams = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function MediaPage({ searchParams }: { searchParams: SearchParams }) {
  const member = await requireDashboardMember();
  const canDelete = canDeleteContent(member.role);

  const editId = str(searchParams.id);
  const isNew = str(searchParams.new) === "1";
  const filters = { search: str(searchParams.search), type: str(searchParams.type), status: str(searchParams.status), page: str(searchParams.page) || "1" };

  const [list, editMedia] = await Promise.all([
    listMedia(filters),
    editId ? getMedia(editId) : Promise.resolve(null),
  ]);

  if (isNew || editId) {
    return (
      <>
        <h1 className="dash-page-title">{isNew ? "New media asset" : "Edit media asset"}</h1>
        <p className="dash-page-sub">
          <Link className="dash-inline-link" href="/dashboard/media">← Back to media</Link>
        </p>
        <p className="dash-card-note" style={{ marginBottom: 16 }}>
          Metadata management only. Uploading binary files to storage is not part of this patch.
        </p>
        {editId && !editMedia ? (
          <div className="dash-glass dash-card" role="status"><p className="dash-card-note">That asset could not be found.</p></div>
        ) : (
          <MediaEditor mode={isNew ? "create" : "edit"} media={editMedia} canDelete={canDelete} />
        )}
      </>
    );
  }

  return (
    <>
      <h1 className="dash-page-title">Media</h1>
      <p className="dash-page-sub">Manage media asset metadata (alt text, type, status). No file upload in this patch.</p>

      <div className="dash-toolbar">
        <Link className="dash-btn dash-btn-primary" href="/dashboard/media?new=1">+ New asset</Link>
      </div>

      <form method="get" className="dash-filters" aria-label="Filter media">
        <label className="dash-field">
          <span className="dash-field-label">Search (key)</span>
          <input className="dash-input" type="search" name="search" defaultValue={filters.search} />
        </label>
        <label className="dash-field">
          <span className="dash-field-label">Type</span>
          <select className="dash-select" name="type" defaultValue={filters.type}>
            <option value="">All</option>
            {MEDIA_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </label>
        <label className="dash-field">
          <span className="dash-field-label">Status</span>
          <select className="dash-select" name="status" defaultValue={filters.status}>
            <option value="">All</option>
            {MEDIA_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </label>
        <div className="dash-field dash-filters-actions">
          <button type="submit" className="dash-btn dash-btn-primary">Apply</button>
          <Link href="/dashboard/media" className="dash-btn">Reset</Link>
        </div>
      </form>

      {list.status === "unavailable" ? (
        <div className="dash-glass dash-card" role="status"><p className="dash-card-note dash-card-error">Media is unavailable right now. Please refresh.</p></div>
      ) : list.rows.length === 0 ? (
        <div className="dash-glass dash-card" role="status"><p className="dash-card-label">No media</p><p className="dash-card-note">No assets match the current filters.</p></div>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th scope="col">Key</th>
                <th scope="col">Type</th>
                <th scope="col">Status</th>
                <th scope="col">Used</th>
                <th scope="col">Updated</th>
                <th scope="col"><span className="dash-visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {list.rows.map((m) => (
                <tr key={m.id}>
                  <td>{m.key}</td>
                  <td>{m.type}</td>
                  <td><span className={m.status === "active" ? "dash-status" : "dash-status dash-status-closed"}>{m.status}</span></td>
                  <td>{m.referenced ? "Referenced" : "—"}</td>
                  <td>{formatDate(m.updatedAt)}</td>
                  <td><Link className="dash-inline-link" href={`/dashboard/media?id=${encodeURIComponent(m.id)}`}>Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
