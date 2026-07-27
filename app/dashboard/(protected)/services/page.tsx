import type { Metadata } from "next";
import Link from "next/link";
import { requireDashboardMember } from "@/lib/auth/dashboard";
import { canDeleteContent } from "@/lib/auth/roles";
import { listServices, getService } from "@/lib/dashboard/service-data";
import { ServiceEditor } from "@/components/dashboard/ServiceEditor";
import { formatDate } from "@/lib/dashboard/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Services" };

type SearchParams = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function ServicesPage({ searchParams }: { searchParams: SearchParams }) {
  const member = await requireDashboardMember();
  const canDelete = canDeleteContent(member.role);
  const editId = str(searchParams.id);
  const isNew = str(searchParams.new) === "1";

  const [list, editService] = await Promise.all([
    listServices(),
    editId ? getService(editId) : Promise.resolve(null),
  ]);

  if (isNew || editId) {
    return (
      <>
        <h1 className="dash-page-title">{isNew ? "New service" : "Edit service"}</h1>
        <p className="dash-page-sub">
          <Link className="dash-inline-link" href="/dashboard/services">← Back to services</Link>
        </p>
        {editId && !editService ? (
          <div className="dash-glass dash-card" role="status"><p className="dash-card-note">That service could not be found.</p></div>
        ) : (
          <ServiceEditor mode={isNew ? "create" : "edit"} service={editService} canDelete={canDelete} />
        )}
      </>
    );
  }

  return (
    <>
      <h1 className="dash-page-title">Services</h1>
      <p className="dash-page-sub">Manage services and their sections.</p>
      <div className="dash-toolbar">
        <Link className="dash-btn dash-btn-primary" href="/dashboard/services?new=1">+ New service</Link>
      </div>

      {list.status === "unavailable" ? (
        <div className="dash-glass dash-card" role="status"><p className="dash-card-note dash-card-error">Services are unavailable right now. Please refresh.</p></div>
      ) : list.rows.length === 0 ? (
        <div className="dash-glass dash-card" role="status"><p className="dash-card-label">No services</p><p className="dash-card-note">Create the first service.</p></div>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">State</th>
                <th scope="col">Sort</th>
                <th scope="col">Updated</th>
                <th scope="col"><span className="dash-visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {list.rows.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}<span className="dash-card-note"> /{s.slug}</span></td>
                  <td><span className={s.isActive ? "dash-status" : "dash-status dash-status-closed"}>{s.isActive ? "Active" : "Inactive"}</span></td>
                  <td>{s.sortOrder}</td>
                  <td>{formatDate(s.updatedAt)}</td>
                  <td><Link className="dash-inline-link" href={`/dashboard/services?id=${encodeURIComponent(s.id)}`}>Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
