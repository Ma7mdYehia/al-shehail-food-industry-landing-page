// partner_project_products.status enum — mirrors the P02 CHECK exactly.
// Client-safe (no server imports).
export const PPP_STATUSES = ["active", "planned", "needs-data"] as const;
export type PppStatus = (typeof PPP_STATUSES)[number];

export function isPppStatus(v: unknown): v is PppStatus {
  return typeof v === "string" && (PPP_STATUSES as readonly string[]).includes(v);
}
