// Media enum constants — mirror the P02 media_assets CHECK constraints exactly.
// Client-safe (no server imports) so both editor components and server code can
// import the runtime values.

export const MEDIA_TYPES = [
  "brand", "partners", "products", "factory", "certifications", "retail", "og",
] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export const MEDIA_STATUSES = ["active", "pending", "legacy"] as const;
export type MediaStatus = (typeof MEDIA_STATUSES)[number];

export function isMediaType(v: unknown): v is MediaType {
  return typeof v === "string" && (MEDIA_TYPES as readonly string[]).includes(v);
}
export function isMediaStatus(v: unknown): v is MediaStatus {
  return typeof v === "string" && (MEDIA_STATUSES as readonly string[]).includes(v);
}
