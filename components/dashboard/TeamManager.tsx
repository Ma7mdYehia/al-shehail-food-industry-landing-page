"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { setMemberStateAction } from "@/lib/dashboard/team-actions";
import { IDLE } from "@/lib/dashboard/action-state";
import { DASHBOARD_ROLES, type DashboardRole } from "@/lib/auth/roles";
import type { TeamMemberRow } from "@/lib/dashboard/team-data";

function SaveButton({ onConfirmNeeded }: { onConfirmNeeded: () => void }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="button"
      className="dash-btn dash-btn-primary"
      onClick={onConfirmNeeded}
      disabled={pending}
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

function MemberRow({ member, activeOwners }: { member: TeamMemberRow; activeOwners: number }) {
  const [state, formAction] = useFormState(setMemberStateAction, IDLE);
  const [role, setRole] = useState<DashboardRole>(member.role);
  const [isActive, setIsActive] = useState<boolean>(member.isActive);
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const dirty = role !== member.role || isActive !== member.isActive;

  // The final active owner cannot be demoted/deactivated; an owner cannot change
  // their own owner status. These are UX guards only — the DB RPC enforces them.
  const isLastOwner = member.isActive && member.role === "owner" && activeOwners <= 1;
  const selfLock = member.isSelf && member.role === "owner";
  const roleLocked = isLastOwner || selfLock;
  const activeLocked = isLastOwner || selfLock;

  useEffect(() => {
    if (state.status === "success") dialogRef.current?.close();
  }, [state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="dash-team-row dash-glass dash-card"
      aria-label={`Manage ${member.displayName}`}
    >
      <input type="hidden" name="memberId" value={member.id} />
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="isActive" value={String(isActive)} />

      <div className="dash-team-id">
        <p className="dash-team-name">
          {member.displayName}
          {member.isSelf ? <span className="dash-role-badge dash-self-badge"> you</span> : null}
        </p>
        <p className="dash-card-note">{member.email}</p>
      </div>

      <label className="dash-field">
        <span className="dash-field-label">Role</span>
        <select
          className="dash-select"
          value={role}
          disabled={roleLocked}
          onChange={(e) => setRole(e.target.value as DashboardRole)}
        >
          {DASHBOARD_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="dash-field">
        <span className="dash-field-label">Status</span>
        <select
          className="dash-select"
          value={isActive ? "true" : "false"}
          disabled={activeLocked}
          onChange={(e) => setIsActive(e.target.value === "true")}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </label>

      <div className="dash-team-actions">
        <SaveButton
          onConfirmNeeded={() => {
            if (!dirty) return;
            dialogRef.current?.showModal();
          }}
        />
      </div>

      {state.status !== "idle" && state.message ? (
        <p
          className={state.status === "error" ? "dash-form-error" : "dash-form-ok"}
          role="status"
          aria-live="polite"
        >
          {state.message}
        </p>
      ) : null}

      {roleLocked ? (
        <p className="dash-card-note">
          {selfLock
            ? "You cannot change your own owner role or status."
            : "The final active owner cannot be demoted or deactivated."}
        </p>
      ) : null}

      <dialog ref={dialogRef} className="dash-dialog" aria-labelledby={`confirm-${member.id}`}>
        <h2 id={`confirm-${member.id}`} className="dash-dialog-title">
          Confirm change
        </h2>
        <p className="dash-dialog-body">
          Update <strong>{member.displayName}</strong> to role <strong>{role}</strong> and status{" "}
          <strong>{isActive ? "Active" : "Inactive"}</strong>?
        </p>
        <div className="dash-dialog-actions">
          <button
            type="button"
            className="dash-btn"
            onClick={() => dialogRef.current?.close()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="dash-btn dash-btn-primary"
            onClick={() => formRef.current?.requestSubmit()}
          >
            Confirm
          </button>
        </div>
      </dialog>
    </form>
  );
}

export function TeamManager({
  members,
  activeOwners,
}: {
  members: TeamMemberRow[];
  activeOwners: number;
}) {
  if (members.length === 0) {
    return (
      <div className="dash-glass dash-card" role="status">
        <p className="dash-card-label">No members</p>
        <p className="dash-card-note">No dashboard members were found.</p>
      </div>
    );
  }
  return (
    <div className="dash-team-list">
      {members.map((m) => (
        <MemberRow key={m.id} member={m} activeOwners={activeOwners} />
      ))}
    </div>
  );
}
