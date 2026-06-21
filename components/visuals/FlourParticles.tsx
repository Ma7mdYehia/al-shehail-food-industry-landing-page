// Decorative flour-dust / gold particle field — pure CSS animation, no JS.
// Deterministic positions (no random) to avoid hydration mismatch. The drift
// animation is automatically neutralised under prefers-reduced-motion via the
// global reduced-motion rule.

type Props = {
  className?: string;
};

// left%, top%, size(px), delay(s), duration(s), gold?(vs flour-white)
const PARTICLES: [number, number, number, number, number, boolean][] = [
  [8, 70, 5, 0, 7, false],
  [18, 40, 3, 1.2, 8, true],
  [27, 80, 4, 2.4, 6.5, false],
  [38, 55, 6, 0.6, 9, true],
  [49, 30, 3, 3.1, 7.5, false],
  [58, 72, 5, 1.8, 8.5, true],
  [69, 48, 4, 2.9, 6.8, false],
  [78, 64, 3, 0.9, 9.2, true],
  [86, 36, 5, 2.2, 7.2, false],
  [93, 58, 4, 3.6, 8, true],
];

export default function FlourParticles({ className = "" }: Props) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {PARTICLES.map(([left, top, size, delay, duration, gold], i) => (
        <span
          key={i}
          className="absolute animate-drift rounded-full"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: size,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            background: gold
              ? "radial-gradient(circle, rgba(198,166,100,0.9), rgba(198,166,100,0))"
              : "radial-gradient(circle, rgba(255,253,248,0.95), rgba(255,253,248,0))",
          }}
        />
      ))}
    </div>
  );
}
