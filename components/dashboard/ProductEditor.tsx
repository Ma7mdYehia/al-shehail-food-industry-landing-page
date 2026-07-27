"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IDLE } from "@/lib/dashboard/action-state";
import { isDashboardCreatedId } from "@/lib/dashboard/validation";
import {
  createProductAction,
  updateProductAction,
  updateProductDetailAction,
  deleteProductAction,
  addProductOptionAction,
  updateProductOptionAction,
  deleteProductOptionAction,
} from "@/lib/dashboard/product-actions";
import { LocalizedField, Field, FormStatus } from "@/components/dashboard/fields";
import { PRODUCT_ICON_TYPES } from "@/lib/dashboard/product-constants";
import {
  PRODUCT_OPTION_TYPES,
  PRODUCT_OPTION_TYPE_LABELS,
} from "@/lib/dashboard/product-constants";
import type {
  ProductEditRecord,
  CategoryOption,
  MediaOption,
  ProductOptionRow,
} from "@/lib/dashboard/product-data";

function SaveButton({ label = "Save" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="dash-btn dash-btn-primary" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export function ProductEditor({
  mode,
  product,
  categories,
  media,
  canDelete,
}: {
  mode: "create" | "edit";
  product: ProductEditRecord | null;
  categories: CategoryOption[];
  media: MediaOption[];
  canDelete: boolean;
}) {
  const action = mode === "create" ? createProductAction : updateProductAction;
  const [state, formAction] = useFormState(action, IDLE);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  return (
    <div className="dash-editor">
      <form action={formAction} className="dash-editor-form" onChange={() => setDirty(true)} onSubmit={() => setDirty(false)}>
        {mode === "edit" && product ? (
          <>
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="expectedUpdatedAt" value={product.updatedAt} />
          </>
        ) : null}

        <Field label="Slug" error={state.errors?.slug}>
          <input className="dash-input" name="slug" defaultValue={product?.slug ?? ""} placeholder="arabic-bread" />
        </Field>

        <Field label="Category" error={state.errors?.categoryId}>
          <select className="dash-select" name="categoryId" defaultValue={product?.categoryId ?? ""}>
            <option value="">Choose a category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.isActive ? "" : " (inactive)"}
              </option>
            ))}
          </select>
        </Field>

        <LocalizedField name="name" label="Name" value={product?.name} errors={state.errors} />
        <LocalizedField name="shortDescription" label="Short description" value={product?.shortDescription} errors={state.errors} textarea />
        <LocalizedField name="cardDescription" label="Card description" value={product?.cardDescription} errors={state.errors} textarea />

        <div className="dash-editor-row">
          <Field label="Icon" error={state.errors?.iconType}>
            <select className="dash-select" name="iconType" defaultValue={product?.iconType ?? "loaf"}>
              {PRODUCT_ICON_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Image">
            <select className="dash-select" name="imageAssetId" defaultValue={product?.imageAssetId ?? ""}>
              <option value="">None</option>
              {media.map((m) => (
                <option key={m.id} value={m.id}>{m.key}</option>
              ))}
            </select>
          </Field>
          {mode === "edit" ? (
            <Field label="Sort order">
              <input className="dash-input" name="sortOrder" type="number" min={0} defaultValue={product?.sortOrder ?? 0} />
            </Field>
          ) : null}
        </div>

        <label className="dash-checkline">
          <input type="checkbox" name="featured" value="true" defaultChecked={product?.featured ?? false} /> Featured
        </label>
        {mode === "create" ? (
          <p className="dash-card-note">New products are created inactive — activate them after review.</p>
        ) : null}

        <div className="dash-editor-actions">
          <SaveButton label={mode === "create" ? "Create product" : "Save product"} />
          <FormStatus status={state.status} message={state.message} />
        </div>
      </form>

      {mode === "edit" && product ? (
        <>
          <ProductDetailForm product={product} />
          <ProductOptions productId={product.id} options={product.options} canDelete={canDelete} />
          {canDelete && isDashboardCreatedId(product.id) ? (
            <DeleteProduct id={product.id} />
          ) : (
            <p className="dash-card-note">
              This is seed-backed content — it can be edited and deactivated but not permanently deleted.
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}

function ProductDetailForm({ product }: { product: ProductEditRecord }) {
  const [state, formAction] = useFormState(updateProductDetailAction, IDLE);
  return (
    <form action={formAction} className="dash-editor-form dash-glass dash-card">
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="expectedUpdatedAt" value={product.detail?.updatedAt ?? ""} />
      <h3 className="dash-editor-heading">Detail</h3>
      <LocalizedField name="positioning" label="Positioning" value={product.detail?.positioning} errors={state.errors} textarea />
      <LocalizedField name="disclaimer" label="Disclaimer" value={product.detail?.disclaimer} errors={state.errors} textarea required={false} />
      {product.detail && (product.detail.overview.length || product.detail.useCases.length || product.detail.recipeOptions.length) ? (
        <p className="dash-card-note">
          Overview / use-case / recipe lists are preserved as authored (bilingual) and are not
          edited here to avoid discarding Arabic content.
        </p>
      ) : null}
      <div className="dash-editor-actions">
        <SaveButton label="Save detail" />
        <FormStatus status={state.status} message={state.message} />
      </div>
    </form>
  );
}

function ProductOptions({ productId, options, canDelete }: { productId: string; options: ProductOptionRow[]; canDelete: boolean }) {
  const [addState, addAction] = useFormState(addProductOptionAction, IDLE);
  return (
    <section className="dash-section" aria-label="Product options">
      <h3 className="dash-editor-heading">Options</h3>
      {options.length === 0 ? (
        <p className="dash-card-note">No options yet.</p>
      ) : (
        <div className="dash-team-list">
          {options.map((o) => (
            <OptionRow key={o.id} option={o} canDelete={canDelete} />
          ))}
        </div>
      )}
      <form action={addAction} className="dash-option-add">
        <input type="hidden" name="productId" value={productId} />
        <h4 className="dash-editor-heading">Add option</h4>
        <Field label="Type" error={addState.errors?.type}>
          <select className="dash-select" name="type" defaultValue="use_case">
            {PRODUCT_OPTION_TYPES.map((t) => (
              <option key={t} value={t}>{PRODUCT_OPTION_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </Field>
        <LocalizedField name="label" label="Label" errors={addState.errors} />
        <Field label="Sort">
          <input className="dash-input" name="sortOrder" type="number" min={0} defaultValue={options.length} />
        </Field>
        <div className="dash-option-add-actions">
          <SaveButton label="Add option" />
          <FormStatus status={addState.status} message={addState.message} />
        </div>
      </form>
    </section>
  );
}

function OptionRow({ option, canDelete }: { option: ProductOptionRow; canDelete: boolean }) {
  const [state, formAction] = useFormState(updateProductOptionAction, IDLE);
  const [delState, delAction] = useFormState(deleteProductOptionAction, IDLE);
  const deletable = canDelete && isDashboardCreatedId(option.id);
  return (
    <div className="dash-glass dash-card dash-section-editor">
      <form action={formAction} className="dash-editor-form">
        <input type="hidden" name="optionId" value={option.id} />
        <input type="hidden" name="expectedUpdatedAt" value={option.updatedAt} />
        <div className="dash-editor-row">
          <Field label="Type" error={state.errors?.type}>
            <select className="dash-select" name="type" defaultValue={option.type}>
              {PRODUCT_OPTION_TYPES.map((t) => (
                <option key={t} value={t}>{PRODUCT_OPTION_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </Field>
          <Field label="Sort">
            <input className="dash-input" name="sortOrder" type="number" min={0} defaultValue={option.sortOrder} />
          </Field>
        </div>
        <LocalizedField name="label" label="Label" value={option.label} errors={state.errors} />
        <div className="dash-editor-actions">
          <SaveButton label="Save option" />
          <FormStatus status={state.status} message={state.message} />
        </div>
      </form>
      {deletable ? (
        <form action={delAction}>
          <input type="hidden" name="optionId" value={option.id} />
          <button type="submit" className="dash-btn dash-btn-danger">Remove option</button>
          <FormStatus status={delState.status} message={delState.message} />
        </form>
      ) : (
        <p className="dash-card-note">Seed-backed option — editable but not removable.</p>
      )}
    </div>
  );
}

function DeleteProduct({ id }: { id: string }) {
  const [state, formAction] = useFormState(deleteProductAction, IDLE);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <section className="dash-section" aria-label="Danger zone">
      <h3 className="dash-editor-heading">Delete</h3>
      <p className="dash-card-note">
        Permanently delete this newly created product. Only allowed for non-seed, unreferenced
        records. Prefer deactivation for anything already in use.
      </p>
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="id" value={id} />
        <button type="button" className="dash-btn dash-btn-danger" onClick={() => dialogRef.current?.showModal()}>
          Delete product
        </button>
        <FormStatus status={state.status} message={state.message} />
        <dialog ref={dialogRef} className="dash-dialog" aria-labelledby="del-confirm">
          <h2 id="del-confirm" className="dash-dialog-title">Delete this product?</h2>
          <p className="dash-dialog-body">This cannot be undone. Referenced products are protected by the database.</p>
          <div className="dash-dialog-actions">
            <button type="button" className="dash-btn" onClick={() => dialogRef.current?.close()}>Cancel</button>
            <button type="button" className="dash-btn dash-btn-danger" onClick={() => { dialogRef.current?.close(); formRef.current?.requestSubmit(); }}>
              Delete
            </button>
          </div>
        </dialog>
      </form>
    </section>
  );
}
