// Service-section type enum — mirrors the P02 service_sections CHECK exactly.
// Client-safe.
export const SERVICE_SECTION_TYPES = [
  "intro", "coverage", "process", "audience", "deliverables", "categories", "related", "note",
] as const;
export type ServiceSectionType = (typeof SERVICE_SECTION_TYPES)[number];

export function isServiceSectionType(v: unknown): v is ServiceSectionType {
  return typeof v === "string" && (SERVICE_SECTION_TYPES as readonly string[]).includes(v);
}
