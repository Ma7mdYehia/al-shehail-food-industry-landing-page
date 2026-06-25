"use client";

import { useRef, type ElementType, type ReactNode } from "react";

// Wraps content in an element that tracks the pointer and exposes its position
// as CSS custom properties (--mx / --my, in %). Pair with the `.mouse-glow`
// and/or `.mouse-glow-border` utilities to render a soft champagne glow that
// follows the cursor. Purely decorative and reduced-motion safe (the glow is a
// static-position fallback when the pointer never moves).

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export default function MouseGlow({
  as: Tag = "div",
  className = "",
  children,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  function handleMove(e: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }

  return (
    <Tag ref={ref} onPointerMove={handleMove} className={className}>
      {children}
    </Tag>
  );
}
