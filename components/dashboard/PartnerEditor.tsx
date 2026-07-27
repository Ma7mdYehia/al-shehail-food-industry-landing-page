"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { IDLE } from "@/lib/dashboard/action-state";
import {
  createPartnerAction,
  updatePartnerAction,
  createProjectAction,
} from "@/lib/dashboard/partner-actions";
import { LocalizedField, Field, FormStatus } from "@/components/dashboard/fields";
import type { PartnerEditRecord, MediaOption } from "@/lib/dashboard/partner-data";

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="dash-btn dash-btn-primary" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export function PartnerEditor({
  mode,
  partner,
  media,
}: {
  mode: "create" | "edit";
  partner: PartnerEditRecord | null;
  media: MediaOption[];
}) {
  const action = mode === "create" ? createPartnerAction : updatePartnerAction;
  const [state, formAction] = useFormState(action, IDLE);
  const [createState, createAction] = useFormState(createProjectAction, IDLE);

  return (
    <div className="dash-editor">
      <form action={formAction} className="dash-editor-form">
        {mode === "edit" && partner ? (
          <>
            <input type="hidden" name="id" value={partner.id} />
            <input type="hidden" name="expectedUpdatedAt" value={partner.updatedAt} />
          </>
        ) : null}
        <Field label="Slug" error={state.errors?.slug}>
          <input className="dash-input" name="slug" defaultValue={partner?.slug ?? ""} placeholder="ektifa" />
        </Field>
        <Field label="Name" error={state.errors?.name}>
          <input className="dash-input" name="name" defaultValue={partner?.name ?? ""} />
        </Field>
        <Field label="Logo asset">
          <select className="dash-select" name="assetId" defaultValue={partner?.assetId ?? ""}>
            <option value="">None</option>
            {media.map((m) => (<option key={m.id} value={m.id}>{m.key}</option>))}
          </select>
        </Field>
        {mode === "edit" ? (
          <div className="dash-editor-row">
            <label className="dash-checkline">
              <input type="checkbox" name="isActive" value="true" defaultChecked={partner?.isActive ?? true} /> Active
            </label>
            <Field label="Sort order">
              <input className="dash-input" name="sortOrder" type="number" min={0} defaultValue={partner?.sortOrder ?? 0} />
            </Field>
          </div>
        ) : null}
        <div className="dash-editor-actions">
          <SaveButton label={mode === "create" ? "Create partner" : "Save changes"} />
          <FormStatus status={state.status} message={state.message} />
        </div>
      </form>

      {mode === "edit" && partner ? (
        <section className="dash-section" aria-label="Projects">
          <h3 className="dash-editor-heading">Projects</h3>
          {partner.projects.length === 0 ? (
            <p className="dash-card-note">No projects yet.</p>
          ) : (
            <ul className="dash-option-list">
              {partner.projects.map((p) => (
                <li key={p.id} className="dash-glass dash-card dash-option-row">
                  <span className="dash-option-label">{p.title.en || p.slug}</span>
                  <span className={p.isActive ? "dash-status" : "dash-status dash-status-closed"}>{p.isActive ? "Active" : "Inactive"}</span>
                  <Link className="dash-inline-link" href={`/dashboard/partners?project=${encodeURIComponent(p.id)}`}>Edit project</Link>
                </li>
              ))}
            </ul>
          )}
          <form action={createAction} className="dash-option-add">
            <input type="hidden" name="partnerId" value={partner.id} />
            <h4 className="dash-editor-heading">New project</h4>
            <Field label="Slug" error={createState.errors?.slug}>
              <input className="dash-input" name="slug" placeholder="halsa-bake" />
            </Field>
            <LocalizedField name="title" label="Title" errors={createState.errors} />
            <LocalizedField name="summary" label="Summary" errors={createState.errors} textarea />
            <div className="dash-option-add-actions">
              <SaveButton label="Create project" />
              <FormStatus status={createState.status} message={createState.message} />
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
}
