"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateEnquiryAction } from "@/lib/dashboard/enquiry-actions";
import { IDLE } from "@/lib/dashboard/action-state";
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS } from "@/lib/dashboard/enquiry-constants";
import type { EnquiryDetail, AssignableMember } from "@/lib/dashboard/enquiry-data";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="dash-btn dash-btn-primary" disabled={pending}>
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

export function EnquiryWorkflow({
  enquiry,
  members,
}: {
  enquiry: EnquiryDetail;
  members: AssignableMember[];
}) {
  const [state, formAction] = useFormState(updateEnquiryAction, IDLE);

  return (
    <form action={formAction} className="dash-workflow" aria-label="Update enquiry">
      <input type="hidden" name="id" value={enquiry.id} />

      <label className="dash-field">
        <span className="dash-field-label">Status</span>
        <select className="dash-select" name="status" defaultValue={enquiry.status}>
          {ENQUIRY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ENQUIRY_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        {state.errors?.status ? (
          <span className="dash-field-err">{state.errors.status}</span>
        ) : null}
      </label>

      <label className="dash-field">
        <span className="dash-field-label">Assigned to</span>
        <select className="dash-select" name="assignedTo" defaultValue={enquiry.assignedTo ?? ""}>
          <option value="">Unassigned</option>
          {members.map((mbr) => (
            <option key={mbr.id} value={mbr.id}>
              {mbr.displayName}
            </option>
          ))}
        </select>
        {state.errors?.assignedTo ? (
          <span className="dash-field-err">{state.errors.assignedTo}</span>
        ) : null}
      </label>

      <label className="dash-field">
        <span className="dash-field-label">Internal notes</span>
        <textarea
          className="dash-textarea"
          name="internalNotes"
          rows={4}
          defaultValue={enquiry.internalNotes ?? ""}
          placeholder="Private notes for the team (not shown to the enquirer)."
        />
        {state.errors?.internalNotes ? (
          <span className="dash-field-err">{state.errors.internalNotes}</span>
        ) : null}
      </label>

      <div className="dash-workflow-actions">
        <SubmitButton />
        {state.status !== "idle" && state.message ? (
          <p
            className={state.status === "error" ? "dash-form-error" : "dash-form-ok"}
            role="status"
            aria-live="polite"
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
