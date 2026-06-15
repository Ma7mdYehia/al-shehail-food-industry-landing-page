"use client";

import { useEffect, useState } from "react";

// Subtle, internal-facing helper caption that marks where a real asset
// (logo, photo, certificate) still needs to be supplied. The internal
// guidance is kept (see docs/assets-needed.md), but these captions are
// hidden from normal public visitors.
//
// Visible only when:
//   - NODE_ENV is "development", or
//   - the URL contains the query param ?assetHints=1
//     e.g. https://www.alshehai.ae/?assetHints=1

type Props = {
  label: string;
  className?: string;
};

const SHOW_IN_DEV = process.env.NODE_ENV === "development";

export default function AssetHint({ label, className = "" }: Props) {
  const [visible, setVisible] = useState(SHOW_IN_DEV);

  useEffect(() => {
    if (SHOW_IN_DEV) return;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("assetHints") === "1") setVisible(true);
    } catch {
      /* no-op */
    }
  }, []);

  if (!visible) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium text-stone/70 ${className}`}
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 16V4M7 9l5-5 5 5" />
        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
      </svg>
      {label}
    </span>
  );
}
