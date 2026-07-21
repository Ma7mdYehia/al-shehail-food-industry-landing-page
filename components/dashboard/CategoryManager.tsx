"use client";

import { useFormState } from "react-dom";
import { IDLE } from "@/lib/dashboard/action-state";
import { createCategoryAction } from "@/lib/dashboard/product-actions";
import { LocalizedField, Field, FormStatus } from "@/components/dashboard/fields";
import type { CategoryOption } from "@/lib/dashboard/product-data";

// Lightweight category management: list current categories (with active state)
// and create a new one. Editing existing categories (localized fields, active
// state, ordering, optimistic concurrency) is handled by updateCategoryAction
// and can be surfaced per-row in a later pass; creation + visibility here keep
// the products area self-sufficient without a separate route.
export function CategoryManager({ categories }: { categories: CategoryOption[] }) {
  const [state, formAction] = useFormState(createCategoryAction, IDLE);
  return (
    <details className="dash-glass dash-card dash-disclosure">
      <summary className="dash-disclosure-summary">Categories ({categories.length})</summary>
      <ul className="dash-tag-list">
        {categories.map((c) => (
          <li key={c.id} className={c.isActive ? "dash-tag" : "dash-tag dash-tag-off"}>
            {c.name} <span className="dash-card-note">/{c.slug}</span>
          </li>
        ))}
      </ul>
      <form action={formAction} className="dash-editor-form">
        <h3 className="dash-editor-heading">New category</h3>
        <Field label="Slug" error={state.errors?.slug}>
          <input className="dash-input" name="slug" placeholder="flatbread-wraps" />
        </Field>
        <LocalizedField name="name" label="Name" errors={state.errors} />
        <LocalizedField name="description" label="Description" errors={state.errors} textarea />
        <div className="dash-editor-actions">
          <button type="submit" className="dash-btn dash-btn-primary">Create category</button>
          <FormStatus status={state.status} message={state.message} />
        </div>
      </form>
    </details>
  );
}
