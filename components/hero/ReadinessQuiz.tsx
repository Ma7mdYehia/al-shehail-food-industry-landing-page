"use client";

import { useEffect, useRef, useState } from "react";
import { quiz, CONTACT_HREF } from "@/lib/heroJourney";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Pre-select Q1 based on the active step, when relevant. */
  initialNeed?: string;
};

// Lightweight two-question "Project Readiness" quiz in an accessible modal.
// It builds a prefilled contact link — no data is sent anywhere on its own.
export default function ReadinessQuiz({ open, onClose, initialNeed }: Props) {
  const [need, setNeed] = useState<string | null>(initialNeed ?? null);
  const [category, setCategory] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Reset selections each time the quiz is opened.
  useEffect(() => {
    if (open) {
      setNeed(initialNeed ?? null);
      setCategory(null);
    }
  }, [open, initialNeed]);

  // Close on Escape and focus the dialog when it opens.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const needLabel = quiz.q1.options.find((o) => o.id === need)?.label;
  const categoryLabel = quiz.q2.options.find((o) => o.id === category)?.label;
  const ready = Boolean(need && category);

  const href = ready
    ? `${CONTACT_HREF}?need=${encodeURIComponent(need!)}&category=${encodeURIComponent(
        category!
      )}`
    : CONTACT_HREF;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close project readiness quiz"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/40 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        className="animate-fade-up relative w-full max-w-lg overflow-hidden rounded-3xl border border-sand bg-warmwhite shadow-lift"
      >
        <div className="bg-dotted-gold border-b border-sand/70 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="eyebrow text-gold">Project Readiness</span>
              <h2
                id="quiz-title"
                className="heading-serif mt-2 text-xl sm:text-2xl"
              >
                Let&apos;s scope your bakery project
              </h2>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-sand bg-warmwhite text-stone transition-colors hover:border-champagne hover:text-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6">
          <QuizGroup
            legend={`1. ${quiz.q1.question}`}
            options={quiz.q1.options}
            value={need}
            onChange={setNeed}
            name="need"
          />
          <QuizGroup
            legend={`2. ${quiz.q2.question}`}
            options={quiz.q2.options}
            value={category}
            onChange={setCategory}
            name="category"
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-sand/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone" aria-live="polite">
            {ready
              ? `${needLabel} · ${categoryLabel}`
              : "Select both to continue."}
          </p>
          <a
            href={href}
            aria-disabled={!ready}
            onClick={(e) => {
              if (!ready) e.preventDefault();
              else onClose();
            }}
            className={`btn-primary justify-center ${
              ready ? "" : "pointer-events-none opacity-50"
            }`}
          >
            Send Project Brief
          </a>
        </div>
      </div>
    </div>
  );
}

function QuizGroup({
  legend,
  options,
  value,
  onChange,
  name,
}: {
  legend: string;
  options: { id: string; label: string }[];
  value: string | null;
  onChange: (id: string) => void;
  name: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-charcoal">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.id;
          return (
            <label
              key={o.id}
              className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm font-medium transition-colors focus-within:ring-2 focus-within:ring-champagne ${
                active
                  ? "border-champagne bg-gold-gradient text-white"
                  : "border-sand bg-cream/70 text-charcoal hover:border-champagne"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.id}
                checked={active}
                onChange={() => onChange(o.id)}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
