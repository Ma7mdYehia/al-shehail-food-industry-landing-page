import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

// Shared stroke-icon base — keeps every icon visually consistent.
function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

/* ---------- Product category cues ---------- */

export function FlatbreadIcon(p: IconProps) {
  return (
    <Base {...p}>
      <ellipse cx="12" cy="12" rx="9" ry="6" />
      <path d="M8 10.5h.01M12 13h.01M15 10h.01M10 13.5h.01" />
    </Base>
  );
}

export function LoafIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M4 13a8 8 0 0116 0v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3z" />
      <path d="M9 8.5V17M15 8.5V17" />
    </Base>
  );
}

export function SamoonIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M5 15a7 4 0 0014 0c0-2.5-3-5-7-5s-7 2.5-7 5z" />
      <path d="M12 10.5v4M9 15.5l1.5-1.5M15 15.5L13.5 14" />
    </Base>
  );
}

export function BunIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M4 14a8 8 0 0116 0" />
      <path d="M3.5 14h17" />
      <path d="M6 17h12" />
      <path d="M8 10.5l.8-1M12 9.5V8.5M15.2 10.5l.8-1" />
    </Base>
  );
}

export function CroissantIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M3 17c4-1 7-4 9-9 .5 4-1 7-3 9 3-1 5-3 7-6" />
      <path d="M3 17l3.5-1M20 11l-3 1.5" />
    </Base>
  );
}

export function CroissantLargeIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M4 16c5-1 9-5 11-11 1 5-1 9-4 12 4-1 7-4 9-8" />
      <path d="M7 15.5l-3 .5M19 9l-2.5 1" />
    </Base>
  );
}

export function PuffPastryIcon(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="4" y="6" width="16" height="12" rx="1.5" />
      <path d="M4 10h16M4 14h16M9 6v12M15 6v12" />
    </Base>
  );
}

export function MaamoulIcon(p: IconProps) {
  return (
    <Base {...p}>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 5v2M12 17v2M5 12h2M17 12h2" />
    </Base>
  );
}

export function DateBallIcon(p: IconProps) {
  return (
    <Base {...p}>
      <circle cx="9" cy="14" r="4" />
      <circle cx="16" cy="11" r="3.2" />
      <path d="M9 10V7M9 7c-1.2 0-2-.8-2-2 1.2 0 2 .8 2 2z" />
    </Base>
  );
}

/* ---------- Pipeline / section cues ---------- */

export function DevelopIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 00-3.5 10.9c.5.4.5 1 .5 1.6V16h6v-.5c0-.6 0-1.2.5-1.6A6 6 0 0012 3z" />
    </Base>
  );
}

export function ProductionIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M3 21h18M5 21V10l5 3V10l5 3V7l4-2v16" />
      <path d="M8 21v-3h3v3" />
    </Base>
  );
}

export function PackagingIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </Base>
  );
}

export function RetailIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M4 9l1-4h14l1 4M4 9v11h16V9M4 9h16" />
      <path d="M4 9a2 2 0 004 0 2 2 0 004 0 2 2 0 004 0 2 2 0 004 0" />
      <path d="M9 20v-5h6v5" />
    </Base>
  );
}

export function ShieldCheckIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </Base>
  );
}

/* ---------- Contact ---------- */

export function PhoneIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z" />
    </Base>
  );
}

export function MailIcon(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </Base>
  );
}

export function WhatsAppIcon(p: IconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...p}
    >
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.518 5.26l-.999 3.648 3.97-1.057zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export function CalendarIcon(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
    </Base>
  );
}
