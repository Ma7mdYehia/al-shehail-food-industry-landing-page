// Subtle, internal-facing helper caption that marks where a real asset
// (logo, photo, certificate) still needs to be supplied. Kept intentionally
// muted and elegant so the page never looks unfinished or messy.

type Props = {
  label: string;
  className?: string;
};

export default function AssetHint({ label, className = "" }: Props) {
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
