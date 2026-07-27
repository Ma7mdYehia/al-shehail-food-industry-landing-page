"use client";

import { useFormState, useFormStatus } from "react-dom";
import { IDLE } from "@/lib/dashboard/action-state";
import {
  createServiceAction,
  updateServiceAction,
  addServiceSectionAction,
  updateServiceSectionAction,
  deleteServiceSectionAction,
} from "@/lib/dashboard/service-actions";
import { LocalizedField, Field, FormStatus } from "@/components/dashboard/fields";
import { isDashboardCreatedId } from "@/lib/dashboard/validation";
import { SERVICE_SECTION_TYPES } from "@/lib/dashboard/service-constants";
import type { ServiceEditRecord, ServiceSectionRow } from "@/lib/dashboard/service-data";

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="dash-btn dash-btn-primary" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export function ServiceEditor({
  mode,
  service,
  canDelete,
}: {
  mode: "create" | "edit";
  service: ServiceEditRecord | null;
  canDelete: boolean;
}) {
  const action = mode === "create" ? createServiceAction : updateServiceAction;
  const [state, formAction] = useFormState(action, IDLE);
  return (
    <div className="dash-editor">
      <form action={formAction} className="dash-editor-form">
        {mode === "edit" && service ? (
          <>
            <input type="hidden" name="id" value={service.id} />
            <input type="hidden" name="expectedUpdatedAt" value={service.updatedAt} />
          </>
        ) : null}
        <Field label="Slug" error={state.errors?.slug}>
          <input className="dash-input" name="slug" defaultValue={service?.slug ?? ""} placeholder="brand-design" />
        </Field>
        <LocalizedField name="metaTitle" label="Meta title" value={service?.metaTitle} errors={state.errors} />
        <LocalizedField name="metaDescription" label="Meta description" value={service?.metaDescription} errors={state.errors} textarea />
        <LocalizedField name="heroEyebrow" label="Hero eyebrow" value={service?.heroEyebrow} errors={state.errors} />
        <LocalizedField name="heroTitle" label="Hero title" value={service?.heroTitle} errors={state.errors} />
        <LocalizedField name="heroSubtitle" label="Hero subtitle" value={service?.heroSubtitle} errors={state.errors} textarea />
        {mode === "edit" ? (
          <div className="dash-editor-row">
            <label className="dash-checkline">
              <input type="checkbox" name="isActive" value="true" defaultChecked={service?.isActive ?? true} /> Active
            </label>
            <Field label="Sort order">
              <input className="dash-input" name="sortOrder" type="number" min={0} defaultValue={service?.sortOrder ?? 0} />
            </Field>
          </div>
        ) : null}
        <p className="dash-card-note">The structured CTA is preserved as authored and is not edited here.</p>
        <div className="dash-editor-actions">
          <SaveButton label={mode === "create" ? "Create service" : "Save changes"} />
          <FormStatus status={state.status} message={state.message} />
        </div>
      </form>

      {mode === "edit" && service ? (
        <ServiceSections serviceId={service.id} sections={service.sections} canDelete={canDelete} />
      ) : null}
    </div>
  );
}

function ServiceSections({ serviceId, sections, canDelete }: { serviceId: string; sections: ServiceSectionRow[]; canDelete: boolean }) {
  const [addState, addAction] = useFormState(addServiceSectionAction, IDLE);
  return (
    <section className="dash-section" aria-label="Service sections">
      <h3 className="dash-editor-heading">Sections</h3>
      {sections.length === 0 ? <p className="dash-card-note">No sections yet.</p> : sections.map((s) => (
        <SectionRow key={s.id} section={s} canDelete={canDelete} />
      ))}
      <form action={addAction} className="dash-option-add">
        <input type="hidden" name="serviceId" value={serviceId} />
        <Field label="Section type" error={addState.errors?.sectionType}>
          <select className="dash-select" name="sectionType" defaultValue="intro">
            {SERVICE_SECTION_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </Field>
        <LocalizedField name="title" label="Title" errors={addState.errors} required={false} />
        <LocalizedField name="description" label="Description" errors={addState.errors} textarea required={false} />
        <Field label="Sort"><input className="dash-input" name="sortOrder" type="number" min={0} defaultValue={sections.length} /></Field>
        <div className="dash-option-add-actions">
          <SaveButton label="Add section" />
          <FormStatus status={addState.status} message={addState.message} />
        </div>
      </form>
    </section>
  );
}

function SectionRow({ section, canDelete }: { section: ServiceSectionRow; canDelete: boolean }) {
  const [state, formAction] = useFormState(updateServiceSectionAction, IDLE);
  const [delState, delAction] = useFormState(deleteServiceSectionAction, IDLE);
  return (
    <div className="dash-glass dash-card dash-section-editor">
      <form action={formAction} className="dash-editor-form">
        <input type="hidden" name="sectionId" value={section.id} />
        <input type="hidden" name="expectedUpdatedAt" value={section.updatedAt} />
        <Field label="Type" error={state.errors?.sectionType}>
          <select className="dash-select" name="sectionType" defaultValue={section.sectionType}>
            {SERVICE_SECTION_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </Field>
        <LocalizedField name="title" label="Title" value={section.title} errors={state.errors} required={false} />
        <LocalizedField name="eyebrow" label="Eyebrow" value={section.eyebrow} errors={state.errors} required={false} />
        <LocalizedField name="description" label="Description" value={section.description} errors={state.errors} textarea required={false} />
        <div className="dash-editor-row">
          <label className="dash-checkline">
            <input type="checkbox" name="isActive" value="true" defaultChecked={section.isActive} /> Active
          </label>
          <Field label="Sort"><input className="dash-input" name="sortOrder" type="number" min={0} defaultValue={section.sortOrder} /></Field>
        </div>
        <p className="dash-card-note">Structured items for this section are preserved as authored.</p>
        <div className="dash-editor-actions">
          <SaveButton label="Save section" />
          <FormStatus status={state.status} message={state.message} />
        </div>
      </form>
      {canDelete && isDashboardCreatedId(section.id) ? (
        <form action={delAction} className="dash-section-remove">
          <input type="hidden" name="sectionId" value={section.id} />
          <button type="submit" className="dash-btn dash-btn-danger">Remove section</button>
          <FormStatus status={delState.status} message={delState.message} />
        </form>
      ) : (
        <p className="dash-card-note">Seed-backed section — editable but not removable.</p>
      )}
    </div>
  );
}
