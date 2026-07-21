// Dashboard input validation & normalization (pure, no secrets, no DB).
//
// Mirrors the database CHECK constraints from P02/P03 so bad input is rejected
// server-side BEFORE a query runs, with field-scoped messages the UI can show.
// All limits are conservative upper bounds to keep payloads small; the database
// remains the final enforcement boundary.

export type FieldErrors = Record<string, string>;

export type Validated<T> =
  | { ok: true; value: T }
  | { ok: false; errors: FieldErrors };

/** A localized value: { en, ar }. `en` is required non-empty; `ar` optional. */
export type Localized = { en: string; ar: string };

export const LIMITS = {
  short: 200, // slugs, keys, titles, single-line labels
  medium: 600, // subtitles, short descriptions
  long: 4000, // long descriptions, notes, positioning
  arrayMax: 50, // bounded list sizes
  pageSizeMax: 100,
  pageSizeDefault: 20,
} as const;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Trim + collapse a required single-line string within [1, max]. */
export function reqText(
  raw: unknown,
  field: string,
  errors: FieldErrors,
  max = LIMITS.short
): string {
  const s = typeof raw === "string" ? raw.trim() : "";
  if (!s) errors[field] = "This field is required.";
  else if (s.length > max) errors[field] = `Must be ${max} characters or fewer.`;
  return s;
}

/** Optional string within [0, max]; returns "" when absent. */
export function optText(
  raw: unknown,
  field: string,
  errors: FieldErrors,
  max = LIMITS.medium
): string {
  if (raw === undefined || raw === null) return "";
  const s = typeof raw === "string" ? raw.trim() : "";
  if (s.length > max) errors[field] = `Must be ${max} characters or fewer.`;
  return s;
}

export function slug(raw: unknown, field: string, errors: FieldErrors): string {
  const s = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (!s) errors[field] = "A slug is required.";
  else if (s.length > LIMITS.short) errors[field] = `Must be ${LIMITS.short} characters or fewer.`;
  else if (!SLUG_RE.test(s)) errors[field] = "Use lowercase letters, numbers and single hyphens.";
  return s;
}

/**
 * Validate a localized object. Requires a non-empty English value; Arabic is
 * optional (matching the DB, where `ar` may be present-but-empty for e.g. media
 * alt text). Rejects any non-string members. `arRequired` enforces Arabic too.
 */
export function localized(
  raw: unknown,
  field: string,
  errors: FieldErrors,
  opts: { max?: number; arRequired?: boolean } = {}
): Localized {
  const max = opts.max ?? LIMITS.medium;
  const out: Localized = { en: "", ar: "" };
  if (!isPlainObject(raw)) {
    errors[field] = "Localized text is required.";
    return out;
  }
  const en = typeof raw.en === "string" ? raw.en.trim() : "";
  const ar = typeof raw.ar === "string" ? raw.ar.trim() : "";
  if (!en) errors[`${field}.en`] = "English text is required.";
  else if (en.length > max) errors[`${field}.en`] = `Must be ${max} characters or fewer.`;
  if (opts.arRequired && !ar) errors[`${field}.ar`] = "Arabic text is required.";
  else if (ar.length > max) errors[`${field}.ar`] = `Must be ${max} characters or fewer.`;
  out.en = en;
  out.ar = ar;
  return out;
}

/** Reject any keys not in the allowlist (defense against mass-assignment). */
export function rejectUnknownFields(
  raw: unknown,
  allowed: readonly string[],
  errors: FieldErrors
): void {
  if (!isPlainObject(raw)) return;
  const set = new Set(allowed);
  for (const key of Object.keys(raw)) {
    if (!set.has(key)) errors._form = "Unexpected field submitted.";
  }
}

export function oneOf<T extends string>(
  raw: unknown,
  values: readonly T[],
  field: string,
  errors: FieldErrors
): T | "" {
  if (typeof raw === "string" && (values as readonly string[]).includes(raw)) return raw as T;
  errors[field] = "Invalid value.";
  return "";
}

export function boolean(raw: unknown): boolean {
  return raw === true || raw === "true" || raw === "on" || raw === "1";
}

/** Bounded, safe integer within [min, max]; falls back to `fallback`. */
export function boundedInt(raw: unknown, min: number, max: number, fallback: number): number {
  const n = typeof raw === "number" ? raw : parseInt(String(raw ?? ""), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

/** Clamp pagination inputs to safe bounds. Returns 1-based page + limit + offset. */
export function pagination(pageRaw: unknown, sizeRaw: unknown): {
  page: number;
  pageSize: number;
  offset: number;
} {
  const pageSize = boundedInt(sizeRaw, 1, LIMITS.pageSizeMax, LIMITS.pageSizeDefault);
  const page = boundedInt(pageRaw, 1, 1_000_000, 1);
  return { page, pageSize, offset: (page - 1) * pageSize };
}

/** A localized value stored to a jsonb column: `ar` empty becomes "" (kept). */
export function toLocalizedJson(v: Localized): { en: string; ar: string } {
  return { en: v.en, ar: v.ar };
}
