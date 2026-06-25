"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MouseGlow from "../ui/MouseGlow";
import FlourParticles from "../visuals/FlourParticles";
import { PremiumObject } from "../visuals/PremiumObjects";
import ReadinessQuiz from "./ReadinessQuiz";
import {
  journeySteps,
  clientTypes,
  beforeWith,
  trustLayer,
} from "@/lib/heroJourney";

const AUTOPLAY_MS = 5000;

export default function HeroJourney() {
  const [active, setActive] = useState(0);
  const [clientId, setClientId] = useState(clientTypes[0].id);
  const [paused, setPaused] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const step = journeySteps[active];
  const client = clientTypes.find((c) => c.id === clientId)!;
  const railRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Autoplay through the steps, paused on hover/focus or reduced motion.
  // A manual click simply changes `active`; the next tick advances from there,
  // so there is no jarring reset.
  useEffect(() => {
    if (paused || reducedMotion || quizOpen) return;
    const t = setInterval(
      () => setActive((i) => (i + 1) % journeySteps.length),
      AUTOPLAY_MS
    );
    return () => clearInterval(t);
  }, [paused, reducedMotion, quizOpen]);

  const focusStep = useCallback((i: number) => {
    setActive(i);
    railRefs.current[i]?.focus();
  }, []);

  const onRailKeyDown = (e: React.KeyboardEvent) => {
    const last = journeySteps.length - 1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      focusStep(active === last ? 0 : active + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      focusStep(active === 0 ? last : active - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusStep(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusStep(last);
    }
  };

  return (
    <>
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ── Left: dynamic hero copy ─────────────────────────────────── */}
        <div className="animate-fade-up">
          <span className="eyebrow">
            <span className="h-px w-6 bg-champagne" />
            UAE-Based Bakery Manufacturing &amp; Private Label Partner
          </span>

          <p
            className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold"
            aria-live="polite"
          >
            {step.eyebrow}
          </p>
          <h1 className="heading-serif mt-2 text-3xl leading-[1.12] sm:text-4xl lg:text-[2.85rem] lg:leading-[1.1]">
            {step.title}
          </h1>

          <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone">
            {step.description}
          </p>

          {/* Client type switcher + supporting microcopy */}
          <div className="mt-7">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
              I am a
            </span>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="group"
              aria-label="Select your role"
            >
              {clientTypes.map((c) => {
                const on = c.id === clientId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setClientId(c.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne ${
                      on
                        ? "border-champagne bg-beige text-charcoal"
                        : "border-sand bg-warmwhite/70 text-stone hover:border-champagne hover:text-charcoal"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
            <p
              className="mt-2.5 text-sm font-medium text-gold"
              aria-live="polite"
            >
              {client.support}
            </p>
          </div>

          {/* Proof cards */}
          <dl className="mt-6 grid max-w-md grid-cols-2 gap-3">
            {step.proofCards.map((p) => (
              <div
                key={p.label}
                className="rounded-2xl border border-sand bg-warmwhite/80 px-4 py-3"
              >
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                  {p.label}
                </dt>
                <dd className="mt-1 font-serif text-base font-semibold text-charcoal">
                  {p.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Dynamic CTA — opens the project readiness quiz */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setQuizOpen(true)}
              className="btn-primary group"
            >
              {step.ctaLabel}
              <svg
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <a href="/products" className="btn-secondary">
              Explore Products
            </a>
          </div>

          {/* Trust layer */}
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {trustLayer.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-sand bg-warmwhite/70 px-4 py-3.5"
              >
                <div className="flex items-center gap-1.5">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-gold"
                    aria-hidden
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal">
                    {group.title}
                  </p>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-stone">
                  {group.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: interactive system card ──────────────────────────── */}
        <div
          className="relative animate-fade-up [animation-delay:120ms]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <MouseGlow className="mouse-glow mouse-glow-border relative rounded-3xl">
            <div className="glow-border relative overflow-hidden rounded-3xl bg-warmwhite p-3 shadow-soft">
              <div className="oven-glow pointer-events-none absolute inset-0" aria-hidden />
              <div className="bg-grain pointer-events-none absolute inset-0 opacity-70" aria-hidden />
              <FlourParticles />

              <div className="bg-dotted-gold relative overflow-hidden rounded-2xl border border-sand/70 p-5 sm:p-6">
                {/* Header + progress */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                      Manufacturing System
                    </span>
                    <p
                      className="mt-1 font-serif text-lg font-semibold leading-snug text-ink"
                      aria-live="polite"
                    >
                      Step {step.n} of {journeySteps.length} — {step.label}
                    </p>
                  </div>
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-gold-gradient text-white shadow-card">
                    <PremiumObject name={step.object} size={26} />
                  </span>
                </div>

                {/* Clickable step rail */}
                <div className="relative mt-5">
                  <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-champagne/70 via-champagne/40 to-champagne/10" aria-hidden />
                  <ul
                    className="relative space-y-2"
                    aria-label="Manufacturing steps"
                    onKeyDown={onRailKeyDown}
                  >
                    {journeySteps.map((s, i) => {
                      const on = i === active;
                      return (
                        <li key={s.id}>
                          <button
                            type="button"
                            id={`journey-tab-${s.id}`}
                            aria-pressed={on}
                            aria-current={on ? "step" : undefined}
                            tabIndex={on ? 0 : -1}
                            ref={(el) => {
                              railRefs.current[i] = el;
                            }}
                            onClick={() => setActive(i)}
                            className={`group flex w-full items-center gap-3.5 rounded-xl px-1 py-1 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne ${
                              on ? "" : "opacity-80 hover:opacity-100"
                            }`}
                          >
                            <span
                              className={`relative z-10 flex h-12 w-12 flex-none items-center justify-center rounded-2xl border shadow-card transition-all duration-300 ${
                                on
                                  ? "-translate-y-0.5 border-champagne bg-cream"
                                  : "border-sand bg-warmwhite group-hover:-translate-y-0.5"
                              }`}
                            >
                              <PremiumObject name={s.object} size={30} />
                            </span>
                            <div
                              className={`flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 backdrop-blur-sm transition-colors duration-300 ${
                                on
                                  ? "border-champagne bg-warmwhite"
                                  : "border-sand/70 bg-cream/60 group-hover:border-champagne/60"
                              }`}
                            >
                              <span className="truncate font-serif text-sm font-semibold text-charcoal">
                                {s.label}
                              </span>
                              <span className="font-serif text-xs font-bold text-champagne">
                                {String(s.n).padStart(2, "0")}
                              </span>
                            </div>
                          </button>

                          {/* Expanded active-step panel — shown inline under
                              the selected node so the flow stays compact. */}
                          {on && (
                            <div
                              aria-labelledby={`journey-tab-${s.id}`}
                              className="ml-[3.875rem] mt-2 rounded-2xl border border-sand bg-warmwhite/80 p-3.5"
                            >
                              <p className="text-sm leading-relaxed text-stone">
                                {s.description}
                              </p>
                              <div className="mt-2.5 flex flex-wrap gap-1.5">
                                {s.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full border border-sand bg-cream/70 px-2.5 py-1 text-[11px] font-semibold text-charcoal"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </MouseGlow>

          {/* Floating Current Output card */}
          <div className="absolute -bottom-5 -left-3 hidden items-center gap-2.5 rounded-2xl border border-sand bg-warmwhite px-4 py-3 shadow-soft sm:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-beige">
              <PremiumObject name={step.object} size={22} />
            </span>
            <div className="leading-tight">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone">
                Current Output
              </p>
              <p className="text-sm font-semibold text-charcoal">
                {step.outputTitle}
              </p>
              <p className="text-xs text-stone">{step.outputDescription}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Before / With value strip ─────────────────────────────────── */}
      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20">
        <div className="rounded-2xl border border-sand bg-cream/60 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-stone">
            {beforeWith.before.title}
          </p>
          <p className="mt-2 text-base leading-relaxed text-stone">
            {beforeWith.before.body}
          </p>
        </div>
        <div className="glow-border rounded-2xl bg-warmwhite p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
            {beforeWith.with.title}
          </p>
          <p className="mt-2 text-base leading-relaxed text-charcoal">
            {beforeWith.with.body}
          </p>
        </div>
      </div>

      <ReadinessQuiz
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        initialNeed={mapStepToNeed(step.id)}
      />
    </>
  );
}

// Map the active journey step to a sensible default quiz answer.
function mapStepToNeed(stepId: string): string | undefined {
  switch (stepId) {
    case "idea":
      return "idea";
    case "recipe":
    case "sampling":
      return "recipe";
    case "packaging":
      return "pack-prod";
    case "production":
    case "qc":
      return "private-label";
    case "retail":
      return "retail";
    default:
      return undefined;
  }
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
