"use client";

import { useFormState, useFormStatus } from "react-dom";
import { IDLE } from "@/lib/dashboard/action-state";
import { setProductActiveAction } from "@/lib/dashboard/product-actions";

function Toggle({ isActive }: { isActive: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="dash-btn dash-btn-small" disabled={pending}>
      {pending ? "…" : isActive ? "Deactivate" : "Activate"}
    </button>
  );
}

export function ProductActiveToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const [state, formAction] = useFormState(setProductActiveAction, IDLE);
  return (
    <form action={formAction} className="dash-inline-form">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="isActive" value={String(!isActive)} />
      <Toggle isActive={isActive} />
      {state.status === "error" && state.message ? (
        <span className="dash-field-err" role="status">{state.message}</span>
      ) : null}
    </form>
  );
}
