import type { Metadata } from "next";
import Link from "next/link";
import { requireDashboardMember } from "@/lib/auth/dashboard";
import { canDeleteContent } from "@/lib/auth/roles";
import {
  listPartners,
  getPartner,
  getProject,
  listMediaOptions,
  listProductOptions,
} from "@/lib/dashboard/partner-data";
import { PartnerEditor } from "@/components/dashboard/PartnerEditor";
import { ProjectEditor } from "@/components/dashboard/ProjectEditor";
import { formatDate } from "@/lib/dashboard/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Partners" };

type SearchParams = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function PartnersPage({ searchParams }: { searchParams: SearchParams }) {
  const member = await requireDashboardMember();
  const canDelete = canDeleteContent(member.role);
  const partnerId = str(searchParams.id);
  const projectId = str(searchParams.project);
  const isNew = str(searchParams.new) === "1";

  // Project editor view.
  if (projectId) {
    const [project, products] = await Promise.all([getProject(projectId), listProductOptions()]);
    return (
      <>
        <h1 className="dash-page-title">Edit project</h1>
        {!project ? (
          <div className="dash-glass dash-card" role="status"><p className="dash-card-note">That project could not be found.</p></div>
        ) : (
          <ProjectEditor project={project} products={products} canDelete={canDelete} />
        )}
      </>
    );
  }

  // Partner editor / create view.
  if (isNew || partnerId) {
    const [partner, media] = await Promise.all([
      partnerId ? getPartner(partnerId) : Promise.resolve(null),
      listMediaOptions(),
    ]);
    return (
      <>
        <h1 className="dash-page-title">{isNew ? "New partner" : "Edit partner"}</h1>
        <p className="dash-page-sub">
          <Link className="dash-inline-link" href="/dashboard/partners">← Back to partners</Link>
        </p>
        {partnerId && !partner ? (
          <div className="dash-glass dash-card" role="status"><p className="dash-card-note">That partner could not be found.</p></div>
        ) : (
          <PartnerEditor mode={isNew ? "create" : "edit"} partner={partner} media={media} />
        )}
      </>
    );
  }

  const list = await listPartners();
  return (
    <>
      <h1 className="dash-page-title">Partners</h1>
      <p className="dash-page-sub">Manage partners, their projects, and project-product mappings.</p>
      <div className="dash-toolbar">
        <Link className="dash-btn dash-btn-primary" href="/dashboard/partners?new=1">+ New partner</Link>
      </div>

      {list.status === "unavailable" ? (
        <div className="dash-glass dash-card" role="status"><p className="dash-card-note dash-card-error">Partners are unavailable right now. Please refresh.</p></div>
      ) : list.rows.length === 0 ? (
        <div className="dash-glass dash-card" role="status"><p className="dash-card-label">No partners</p><p className="dash-card-note">Create the first partner.</p></div>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">State</th>
                <th scope="col">Sort</th>
                <th scope="col">Updated</th>
                <th scope="col"><span className="dash-visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {list.rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}<span className="dash-card-note"> /{p.slug}</span></td>
                  <td><span className={p.isActive ? "dash-status" : "dash-status dash-status-closed"}>{p.isActive ? "Active" : "Inactive"}</span></td>
                  <td>{p.sortOrder}</td>
                  <td>{formatDate(p.updatedAt)}</td>
                  <td><Link className="dash-inline-link" href={`/dashboard/partners?id=${encodeURIComponent(p.id)}`}>Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
