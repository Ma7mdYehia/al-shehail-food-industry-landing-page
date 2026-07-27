// Enquiry workflow constants — mirror the P02 form_enquiries status CHECK
// exactly. The database is the enforcement boundary; these drive UI + validation
// and must not drift from the schema.

export const ENQUIRY_STATUSES = ["new", "contacted", "qualified", "closed", "spam"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Closed",
  spam: "Spam",
};

export function isEnquiryStatus(v: unknown): v is EnquiryStatus {
  return typeof v === "string" && (ENQUIRY_STATUSES as readonly string[]).includes(v);
}
