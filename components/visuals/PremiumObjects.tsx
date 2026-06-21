// Reusable, abstract pseudo-3D manufacturing objects rendered as pure SVG.
// Light-theme, champagne-gold + charcoal, with layered fills and soft shadows
// to suggest depth without heavy 3D or fake product photography. All purely
// decorative (aria-hidden) and inherit sizing from the parent.

type ObjectProps = {
  className?: string;
  size?: number;
};

const G = "#B8924A"; // gold
const GC = "#C6A664"; // champagne
const GD = "#9C7A38"; // golddeep
const INK = "#2A2724"; // charcoal
const CREAM = "#FBF8F2";
const SAND = "#E8DECB";

function wrap(size: number) {
  return { width: size, height: size, viewBox: "0 0 64 64" } as const;
}

/** Recipe / spec card — a layered document with a gold header. */
export function RecipeCardObject({ className = "", size = 56 }: ObjectProps) {
  return (
    <svg {...wrap(size)} className={className} fill="none" aria-hidden>
      <rect x="14" y="12" width="34" height="42" rx="4" fill={SAND} />
      <rect x="10" y="8" width="34" height="42" rx="4" fill={CREAM} stroke={GC} strokeWidth="1.5" />
      <rect x="10" y="8" width="34" height="11" rx="4" fill={G} />
      <path d="M10 17h34" stroke={GD} strokeWidth="1" opacity="0.5" />
      <path d="M16 27h22M16 33h22M16 39h14" stroke={INK} strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      <circle cx="38" cy="44" r="5" fill={GC} opacity="0.9" />
      <path d="M36 44l1.6 1.6L40.5 42" stroke={CREAM} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Croissant layers — laminated arc suggesting flaky layers. */
export function CroissantLayersObject({ className = "", size = 56 }: ObjectProps) {
  return (
    <svg {...wrap(size)} className={className} fill="none" aria-hidden>
      <path d="M12 40c6-16 34-16 40 0" stroke={GD} strokeWidth="2" opacity="0.4" />
      <path d="M14 42c5-13 31-13 36 0" stroke={GC} strokeWidth="2" />
      <path d="M18 43c4-9 24-9 28 0" stroke={G} strokeWidth="2" />
      <path d="M22 44c3-6 17-6 20 0" stroke={GD} strokeWidth="2" />
      <ellipse cx="32" cy="47" rx="24" ry="4" fill={SAND} opacity="0.6" />
    </svg>
  );
}

/** Toast loaf — a rounded loaf with a sliced face. */
export function ToastLoafObject({ className = "", size = 56 }: ObjectProps) {
  return (
    <svg {...wrap(size)} className={className} fill="none" aria-hidden>
      <path d="M12 30c0-8 8-12 20-12s20 4 20 12v14a4 4 0 01-4 4H16a4 4 0 01-4-4V30z" fill={CREAM} stroke={GC} strokeWidth="1.6" />
      <path d="M12 30c0-8 8-12 20-12s20 4 20 12" fill={GC} opacity="0.25" />
      <ellipse cx="32" cy="36" rx="13" ry="9" fill={SAND} opacity="0.7" />
      <ellipse cx="32" cy="36" rx="13" ry="9" stroke={GD} strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

/** Burger bun — domed seeded top over a base. */
export function BurgerBunObject({ className = "", size = 56 }: ObjectProps) {
  return (
    <svg {...wrap(size)} className={className} fill="none" aria-hidden>
      <path d="M14 30c0-10 8-16 18-16s18 6 18 16H14z" fill={GC} />
      <path d="M14 30c0-10 8-16 18-16s18 6 18 16" stroke={GD} strokeWidth="1.4" />
      <rect x="14" y="34" width="36" height="8" rx="4" fill={SAND} />
      <rect x="13" y="30" width="38" height="6" rx="3" fill={CREAM} stroke={GC} strokeWidth="1.2" />
      <g fill={CREAM}>
        <circle cx="26" cy="23" r="1.3" /><circle cx="33" cy="20" r="1.3" /><circle cx="40" cy="23" r="1.3" />
      </g>
    </svg>
  );
}

/** Maamoul gift box — a lidded box with a gold ribbon. */
export function MaamoulBoxObject({ className = "", size = 56 }: ObjectProps) {
  return (
    <svg {...wrap(size)} className={className} fill="none" aria-hidden>
      <rect x="14" y="26" width="36" height="24" rx="3" fill={CREAM} stroke={GC} strokeWidth="1.6" />
      <rect x="11" y="18" width="42" height="11" rx="3" fill={SAND} stroke={GC} strokeWidth="1.6" />
      <path d="M32 18v32" stroke={G} strokeWidth="2.4" />
      <path d="M32 18c-3-4-9-4-9 0M32 18c3-4 9-4 9 0" stroke={G} strokeWidth="2.2" fill="none" />
    </svg>
  );
}

/** Packaging carton — a pseudo-3D shipping/retail carton. */
export function PackagingCartonObject({ className = "", size = 56 }: ObjectProps) {
  return (
    <svg {...wrap(size)} className={className} fill="none" aria-hidden>
      <path d="M32 14l20 8-20 8-20-8 20-8z" fill={SAND} stroke={GC} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 22v20l20 8V30L12 22z" fill={CREAM} stroke={GC} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M52 22v20l-20 8V30l20-8z" fill={GC} opacity="0.85" stroke={GD} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M32 30v6" stroke={GD} strokeWidth="1.4" />
    </svg>
  );
}

/** QC stamp — a circular approval seal with a check. */
export function QCStampObject({ className = "", size = 56 }: ObjectProps) {
  return (
    <svg {...wrap(size)} className={className} fill="none" aria-hidden>
      <circle cx="32" cy="32" r="19" fill={CREAM} stroke={G} strokeWidth="2" />
      <circle cx="32" cy="32" r="14" fill="none" stroke={GC} strokeWidth="1" strokeDasharray="2 3" />
      <path d="M25 32.5l4.5 4.5L40 27" stroke={G} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Retail shelf marker — a price/shelf tag with a tick. */
export function RetailShelfObject({ className = "", size = 56 }: ObjectProps) {
  return (
    <svg {...wrap(size)} className={className} fill="none" aria-hidden>
      <rect x="12" y="40" width="40" height="4" rx="2" fill={SAND} />
      <rect x="16" y="44" width="3" height="8" fill={SAND} />
      <rect x="45" y="44" width="3" height="8" fill={SAND} />
      <path d="M20 14h18l8 8-8 8H20a3 3 0 01-3-3V17a3 3 0 013-3z" fill={GC} stroke={GD} strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="40" cy="22" r="2" fill={CREAM} />
      <path d="M23 19l5 5M28 19l-5 5" stroke={CREAM} strokeWidth="1.6" strokeLinecap="round" opacity="0" />
      <path d="M22.5 22.5l3 3 6-6.5" stroke={CREAM} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Flour sack — a soft sack with a gold band. */
export function FlourSackObject({ className = "", size = 56 }: ObjectProps) {
  return (
    <svg {...wrap(size)} className={className} fill="none" aria-hidden>
      <path d="M22 18c0-2 2-3 10-3s10 1 10 3c0 3-2 4-2 8 0 14 4 16 4 22a3 3 0 01-3 3H23a3 3 0 01-3-3c0-6 4-8 4-22 0-4-2-5-2-8z" fill={CREAM} stroke={GC} strokeWidth="1.6" />
      <path d="M22 16c3 3 17 3 20 0" stroke={GD} strokeWidth="1.4" fill="none" />
      <rect x="22" y="34" width="20" height="7" fill={GC} opacity="0.85" />
      <path d="M26 37.5h12" stroke={CREAM} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export type PremiumObjectName =
  | "recipe"
  | "croissant"
  | "toast"
  | "bun"
  | "maamoul"
  | "carton"
  | "qc"
  | "retail"
  | "flour";

const REGISTRY: Record<
  PremiumObjectName,
  (p: ObjectProps) => JSX.Element
> = {
  recipe: RecipeCardObject,
  croissant: CroissantLayersObject,
  toast: ToastLoafObject,
  bun: BurgerBunObject,
  maamoul: MaamoulBoxObject,
  carton: PackagingCartonObject,
  qc: QCStampObject,
  retail: RetailShelfObject,
  flour: FlourSackObject,
};

/** Render a premium object by name. */
export function PremiumObject({
  name,
  ...props
}: ObjectProps & { name: PremiumObjectName }) {
  const Cmp = REGISTRY[name];
  return <Cmp {...props} />;
}
