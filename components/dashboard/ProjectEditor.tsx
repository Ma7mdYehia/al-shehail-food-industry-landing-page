"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { IDLE } from "@/lib/dashboard/action-state";
import {
  updateProjectAction,
  deleteProjectAction,
  addProjectProductAction,
  updateProjectProductAction,
  deleteProjectProductAction,
} from "@/lib/dashboard/partner-actions";
import { LocalizedField, Field, FormStatus } from "@/components/dashboard/fields";
import { PPP_STATUSES } from "@/lib/dashboard/partner-constants";
import type { ProjectEditRecord, ProjectProductRow, ProductOption } from "@/lib/dashboard/partner-data";

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="dash-btn dash-btn-primary" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export function ProjectEditor({
  project,
  products,
  canDelete,
}: {
  project: ProjectEditRecord;
  products: ProductOption[];
  canDelete: boolean;
}) {
  const [state, formAction] = useFormState(updateProjectAction, IDLE);
  const [delState, delAction] = useFormState(deleteProjectAction, IDLE);
  const [addState, addAction] = useFormState(addProjectProductAction, IDLE);

  return (
    <div className="dash-editor">
      <p className="dash-page-sub">
        <Link className="dash-inline-link" href={`/dashboard/partners?id=${encodeURIComponent(project.partnerId)}`}>← Back to partner</Link>
      </p>

      <form action={formAction} className="dash-editor-form">
        <input type="hidden" name="id" value={project.id} />
        <input type="hidden" name="expectedUpdatedAt" value={project.updatedAt} />
        <Field label="Slug" error={state.errors?.slug}>
          <input className="dash-input" name="slug" defaultValue={project.slug} />
        </Field>
        <LocalizedField name="title" label="Title" value={project.title} errors={state.errors} />
        <LocalizedField name="summary" label="Summary" value={project.summary} errors={state.errors} textarea />
        <div className="dash-editor-row">
          <label className="dash-checkline">
            <input type="checkbox" name="isActive" value="true" defaultChecked={project.isActive} /> Active
          </label>
          <Field label="Sort order">
            <input className="dash-input" name="sortOrder" type="number" min={0} defaultValue={project.sortOrder} />
          </Field>
        </div>
        <p className="dash-card-note">The structured project detail is preserved as authored and is not edited here.</p>
        <div className="dash-editor-actions">
          <SaveButton label="Save project" />
          <FormStatus status={state.status} message={state.message} />
        </div>
      </form>

      <section className="dash-section" aria-label="Project products">
        <h3 className="dash-editor-heading">Project products</h3>
        {project.products.length === 0 ? (
          <p className="dash-card-note">No product mappings yet.</p>
        ) : (
          project.products.map((pp) => (
            <ProjectProductRowEditor key={pp.id} row={pp} products={products} canDelete={canDelete} />
          ))
        )}
        <form action={addAction} className="dash-option-add">
          <input type="hidden" name="projectId" value={project.id} />
          <h4 className="dash-editor-heading">Add mapping</h4>
          <Field label="Catalog product (optional)">
            <select className="dash-select" name="productId" defaultValue="">
              <option value="">None (project-specific)</option>
              {products.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
          </Field>
          <LocalizedField name="name" label="Product name" errors={addState.errors} required={false} />
          <div className="dash-editor-row">
            <Field label="Status" error={addState.errors?.status}>
              <select className="dash-select" name="status" defaultValue="needs-data">
                {PPP_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </Field>
            <Field label="Sort"><input className="dash-input" name="sortOrder" type="number" min={0} defaultValue={project.products.length} /></Field>
          </div>
          <div className="dash-option-add-actions">
            <SaveButton label="Add mapping" />
            <FormStatus status={addState.status} message={addState.message} />
          </div>
        </form>
      </section>

      {canDelete && !/^(partner|proj)_/.test(project.id) ? (
        <form action={delAction} className="dash-section">
          <input type="hidden" name="id" value={project.id} />
          <button type="submit" className="dash-btn dash-btn-danger">Delete project</button>
          <FormStatus status={delState.status} message={delState.message} />
        </form>
      ) : null}
    </div>
  );
}

function ProjectProductRowEditor({ row, products, canDelete }: { row: ProjectProductRow; products: ProductOption[]; canDelete: boolean }) {
  const [state, formAction] = useFormState(updateProjectProductAction, IDLE);
  const [delState, delAction] = useFormState(deleteProjectProductAction, IDLE);
  return (
    <div className="dash-glass dash-card dash-section-editor">
      <form action={formAction} className="dash-editor-form">
        <input type="hidden" name="mappingId" value={row.id} />
        <input type="hidden" name="expectedUpdatedAt" value={row.updatedAt} />
        <Field label="Catalog product">
          <select className="dash-select" name="productId" defaultValue={row.productId ?? ""}>
            <option value="">None (project-specific)</option>
            {products.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
        </Field>
        <LocalizedField name="name" label="Product name" value={row.name} errors={state.errors} required={false} />
        <div className="dash-editor-row">
          <Field label="Status" error={state.errors?.status}>
            <select className="dash-select" name="status" defaultValue={row.status}>
              {PPP_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </Field>
          <Field label="Sort"><input className="dash-input" name="sortOrder" type="number" min={0} defaultValue={row.sortOrder} /></Field>
        </div>
        {row.hasRichData ? (
          <p className="dash-card-note">
            This mapping has authored detail (category / description / notes) that is preserved and
            not edited here.
          </p>
        ) : null}
        <div className="dash-editor-actions">
          <SaveButton label="Save mapping" />
          <FormStatus status={state.status} message={state.message} />
        </div>
      </form>
      {canDelete ? (
        <form action={delAction}>
          <input type="hidden" name="mappingId" value={row.id} />
          <button type="submit" className="dash-btn dash-btn-danger">Remove mapping</button>
          <FormStatus status={delState.status} message={delState.message} />
        </form>
      ) : null}
    </div>
  );
}
