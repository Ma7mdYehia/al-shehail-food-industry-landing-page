"use client";

import { useFormState, useFormStatus } from "react-dom";
import { IDLE } from "@/lib/dashboard/action-state";
import { updateSharedContentAction } from "@/lib/dashboard/shared-content-actions";
import { LocalizedField, FormStatus } from "@/components/dashboard/fields";
import type { SharedContent } from "@/lib/dashboard/shared-content";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="dash-btn dash-btn-primary" disabled={pending}>
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

export function SharedContentEditor({ content }: { content: SharedContent }) {
  const [state, formAction] = useFormState(updateSharedContentAction, IDLE);
  return (
    <div className="dash-editor">
      <form action={formAction} className="dash-editor-form">
        <input type="hidden" name="id" value={content.id} />
        <input type="hidden" name="expectedUpdatedAt" value={content.updatedAt} />
        <LocalizedField name="recipeDisclaimer" label="Recipe disclaimer" value={content.recipeDisclaimer} errors={state.errors} textarea />
        <div className="dash-editor-actions">
          <SaveButton />
          <FormStatus status={state.status} message={state.message} />
        </div>
      </form>

      <div className="dash-glass dash-card">
        <p className="dash-card-label">Preserved structured lists</p>
        <p className="dash-card-note">
          The private-label ({content.privateLabelCount}), packaging ({content.packagingCount}) and
          quality ({content.qualityCount}) point lists are stored as authored bilingual content and
          are preserved exactly — structured editing of these lists is a later pass, so nothing is
          overwritten here.
        </p>
      </div>
    </div>
  );
}
