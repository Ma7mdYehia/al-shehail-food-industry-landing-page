"use client";

import type { ReactNode } from "react";

type Localized = { en: string; ar: string };

/** A labelled English + Arabic input pair with inline field errors. */
export function LocalizedField({
  name,
  label,
  value,
  errors,
  textarea,
  required = true,
}: {
  name: string;
  label: string;
  value?: Localized | null;
  errors?: Record<string, string>;
  textarea?: boolean;
  required?: boolean;
}) {
  const en = value?.en ?? "";
  const ar = value?.ar ?? "";
  return (
    <fieldset className="dash-locfield">
      <legend className="dash-field-label">
        {label}
        {required ? "" : " (optional)"}
      </legend>
      <div className="dash-locfield-row">
        <label className="dash-field">
          <span className="dash-field-sub">English</span>
          {textarea ? (
            <textarea className="dash-textarea" name={`${name}_en`} defaultValue={en} rows={3} />
          ) : (
            <input className="dash-input" name={`${name}_en`} defaultValue={en} />
          )}
          {errors?.[`${name}.en`] ? <span className="dash-field-err">{errors[`${name}.en`]}</span> : null}
        </label>
        <label className="dash-field">
          <span className="dash-field-sub" dir="rtl">العربية</span>
          {textarea ? (
            <textarea className="dash-textarea" name={`${name}_ar`} defaultValue={ar} rows={3} dir="rtl" />
          ) : (
            <input className="dash-input" name={`${name}_ar`} defaultValue={ar} dir="rtl" />
          )}
          {errors?.[`${name}.ar`] ? <span className="dash-field-err">{errors[`${name}.ar`]}</span> : null}
        </label>
      </div>
    </fieldset>
  );
}

/** A single labelled field wrapper with an inline error slot. */
export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="dash-field" htmlFor={htmlFor}>
      <span className="dash-field-label">{label}</span>
      {children}
      {error ? <span className="dash-field-err">{error}</span> : null}
    </label>
  );
}

/** aria-live status/error line for a form. */
export function FormStatus({ status, message }: { status: string; message?: string }) {
  if (status === "idle" || !message) return null;
  return (
    <p className={status === "error" ? "dash-form-error" : "dash-form-ok"} role="status" aria-live="polite">
      {message}
    </p>
  );
}
