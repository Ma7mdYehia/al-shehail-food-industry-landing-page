"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IDLE } from "@/lib/dashboard/action-state";
import { createMediaAction, updateMediaAction, deleteMediaAction } from "@/lib/dashboard/media-actions";
import { LocalizedField, Field, FormStatus } from "@/components/dashboard/fields";
import { isDashboardCreatedId } from "@/lib/dashboard/validation";
import { MEDIA_TYPES, MEDIA_STATUSES } from "@/lib/dashboard/media-constants";
import type { MediaEditRecord } from "@/lib/dashboard/media-data";

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="dash-btn dash-btn-primary" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

// Only preview a path that is unambiguously a same-origin or https URL, so we
// never render an attacker-controllable scheme (javascript:, data:, etc.).
function safePreview(path: string | null | undefined): string | null {
  if (!path) return null;
  return /^(https:\/\/|\/)/.test(path) ? path : null;
}

export function MediaEditor({
  mode,
  media,
  canDelete,
}: {
  mode: "create" | "edit";
  media: MediaEditRecord | null;
  canDelete: boolean;
}) {
  const action = mode === "create" ? createMediaAction : updateMediaAction;
  const [state, formAction] = useFormState(action, IDLE);
  const [path, setPath] = useState(media?.path ?? "");
  const preview = safePreview(path);

  return (
    <div className="dash-editor">
      <form action={formAction} className="dash-editor-form">
        {mode === "edit" && media ? (
          <>
            <input type="hidden" name="id" value={media.id} />
            <input type="hidden" name="expectedUpdatedAt" value={media.updatedAt} />
          </>
        ) : null}

        <Field label="Key (unique)" error={state.errors?.key}>
          <input className="dash-input" name="key" defaultValue={media?.key ?? ""} placeholder="product_arabic_bread" />
        </Field>
        <Field label="Path / URL" error={state.errors?.path}>
          <input className="dash-input" name="path" defaultValue={media?.path ?? ""} onChange={(e) => setPath(e.target.value)} placeholder="/images/… or https://…" />
        </Field>

        <div className="dash-editor-row">
          <Field label="Type" error={state.errors?.type}>
            <select className="dash-select" name="type" defaultValue={media?.type ?? "products"}>
              {MEDIA_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Status" error={state.errors?.status}>
            <select className="dash-select" name="status" defaultValue={media?.status ?? "pending"}>
              {MEDIA_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>

        <LocalizedField name="alt" label="Alt text" value={media?.alt} errors={state.errors} required={false} />

        <div className="dash-editor-row">
          <Field label="Width" error={state.errors?.width}>
            <input className="dash-input" name="width" type="number" min={1} defaultValue={media?.width ?? ""} />
          </Field>
          <Field label="Height" error={state.errors?.height}>
            <input className="dash-input" name="height" type="number" min={1} defaultValue={media?.height ?? ""} />
          </Field>
        </div>

        {preview ? (
          <figure className="dash-media-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={media?.alt.en || "Preview"} loading="lazy" />
            <figcaption className="dash-card-note">Preview of the referenced path.</figcaption>
          </figure>
        ) : path ? (
          <p className="dash-card-note">No inline preview for this path type.</p>
        ) : null}

        <div className="dash-editor-actions">
          <SaveButton label={mode === "create" ? "Create asset" : "Save changes"} />
          <FormStatus status={state.status} message={state.message} />
        </div>
      </form>

      {mode === "edit" && media ? (
        media.referenced ? (
          <p className="dash-card-note">This asset is referenced by content and cannot be deleted. Set it to legacy instead.</p>
        ) : !isDashboardCreatedId(media.id) ? (
          <p className="dash-card-note">Seed-backed asset — it can be set to legacy but not permanently deleted.</p>
        ) : canDelete ? (
          <DeleteMedia id={media.id} />
        ) : null
      ) : null}
    </div>
  );
}

function DeleteMedia({ id }: { id: string }) {
  const [state, formAction] = useFormState(deleteMediaAction, IDLE);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.status === "success") dialogRef.current?.close();
  }, [state.status]);
  return (
    <section className="dash-section" aria-label="Danger zone">
      <h3 className="dash-editor-heading">Delete</h3>
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="id" value={id} />
        <button type="button" className="dash-btn dash-btn-danger" onClick={() => dialogRef.current?.showModal()}>
          Delete asset
        </button>
        <FormStatus status={state.status} message={state.message} />
        <dialog ref={dialogRef} className="dash-dialog" aria-labelledby="del-media">
          <h2 id="del-media" className="dash-dialog-title">Delete this asset?</h2>
          <p className="dash-dialog-body">This cannot be undone. Referenced assets are protected by the database.</p>
          <div className="dash-dialog-actions">
            <button type="button" className="dash-btn" onClick={() => dialogRef.current?.close()}>Cancel</button>
            <button type="button" className="dash-btn dash-btn-danger" onClick={() => { dialogRef.current?.close(); formRef.current?.requestSubmit(); }}>Delete</button>
          </div>
        </dialog>
      </form>
    </section>
  );
}
