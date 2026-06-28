// Ultra-light, static decorative backdrop. CSS gradients + a couple of thin
// static SVG flow lines suggesting a connected private-label process — kept to
// the right edge so the centred copy stays clean. No blur, no filters, no
// shadows, no animation, no JS: nothing that repaints during scroll.
export default function FlowBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Soft warm gradient base, concentrated toward the right edge */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 80% at 100% 25%, rgba(198,166,100,0.08), transparent 60%)," +
            "radial-gradient(60% 70% at 96% 100%, rgba(232,222,203,0.35), transparent 62%)",
        }}
      />

      {/* Very subtle static flow lines — thin strokes, low opacity, right side */}
      <svg
        className="absolute right-0 top-0 h-full w-1/2 opacity-60"
        viewBox="0 0 400 600"
        fill="none"
        preserveAspectRatio="xMaxYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-20 130 C 150 180, 95 305, 270 335 S 205 505, 430 525"
          stroke="#C6A664"
          strokeOpacity="0.18"
          strokeWidth="1.5"
        />
        <path
          d="M-20 195 C 165 245, 115 365, 305 395 S 245 560, 445 585"
          stroke="#C6A664"
          strokeOpacity="0.12"
          strokeWidth="1.5"
        />
        {/* A couple of process nodes along the flow */}
        <circle cx="270" cy="335" r="4" fill="#C6A664" fillOpacity="0.25" />
        <circle cx="305" cy="395" r="3" fill="#C6A664" fillOpacity="0.2" />
      </svg>
    </div>
  );
}
