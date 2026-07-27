// Injectable save executors (pure branching logic + generic messages, no server
// imports). The real server actions build `deps` that run RLS-protected Supabase
// queries; tests build `deps` with canned results. This lets the exact
// error / stale / empty / success branching be EXECUTED without a database.

import { fail, success, type ActionState } from "@/lib/dashboard/action-state";

export type QueryResult = { data: unknown[] | null; error: unknown };
type Row = Record<string, unknown>;

const STALE = "This record was changed by someone else. Please refresh and try again.";

// ---- product detail (independent from the core product save) ----------------

export type DetailDeps = {
  updateDetail: (productId: string, expected: string, set: Row) => Promise<QueryResult>;
  insertDetail: (productId: string, set: Row) => Promise<QueryResult>;
};

export async function saveProductDetail(
  deps: DetailDeps,
  input: { productId: string; expectedUpdatedAt: string; set: Row }
): Promise<ActionState> {
  const { productId, expectedUpdatedAt, set } = input;
  try {
    if (expectedUpdatedAt) {
      // A detail row exists → optimistic update. Every result is checked.
      const { data, error } = await deps.updateDetail(productId, expectedUpdatedAt, set);
      if (error) return fail("The product detail could not be saved. Please retry.");
      if (!data || data.length === 0) return fail(STALE);
    } else {
      // No detail row yet → insert; a concurrent insert or any error is surfaced
      // (never reported as a false success).
      const { data, error } = await deps.insertDetail(productId, set);
      if (error || !data || data.length === 0) {
        return fail("The product detail could not be saved. Please refresh and retry.");
      }
    }
  } catch {
    return fail("The product detail could not be saved. Please refresh and retry.");
  }
  return success("Product detail saved.");
}

// ---- enquiry workflow -------------------------------------------------------

export type EnquiryDeps = {
  assignableMembers: () => Promise<QueryResult>;
  updateEnquiry: (id: string, expected: string, set: Row) => Promise<QueryResult>;
};

export async function saveEnquiry(
  deps: EnquiryDeps,
  input: { id: string; expectedUpdatedAt: string; assignedTo: string | null; set: Row }
): Promise<ActionState> {
  const { id, expectedUpdatedAt, assignedTo, set } = input;

  // The assignee must currently be an ACTIVE member (validated against the
  // assignable-members set, not the browser's select options). Null is allowed.
  if (assignedTo !== null) {
    try {
      const { data, error } = await deps.assignableMembers();
      const active = Array.isArray(data)
        ? data.some((m) => (m as { id?: unknown }).id === assignedTo)
        : false;
      if (error || !active) return fail("The selected assignee is not an active team member.");
    } catch {
      return fail("The enquiry could not be updated. Please refresh and try again.");
    }
  }

  try {
    const { data, error } = await deps.updateEnquiry(id, expectedUpdatedAt, set);
    if (error) return fail("The enquiry could not be updated. Please refresh and try again.");
    if (!data || data.length === 0) {
      return fail("This enquiry was changed by someone else. Please refresh and try again.");
    }
  } catch {
    return fail("The enquiry could not be updated. Please refresh and try again.");
  }
  return success("Enquiry updated.");
}
