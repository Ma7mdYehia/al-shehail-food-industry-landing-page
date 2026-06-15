import Link from "next/link";

type Props = {
  href: string;
  label: string;
  variant?: "text" | "secondary";
  className?: string;
};

// Consistent "learn more" link used by the homepage teaser sections.
export default function TeaserLink({
  href,
  label,
  variant = "text",
  className = "",
}: Props) {
  if (variant === "secondary") {
    return (
      <Link href={href} className={`btn-secondary ${className}`}>
        {label}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 text-sm font-semibold text-gold ${className}`}
    >
      {label}
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
    </Link>
  );
}
