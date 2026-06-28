// Lightweight, CSS/SVG-only decorative backdrop. Suggests a connected,
// flowing manufacturing system with soft embossed rounded shapes — concentrated
// toward the right edge so the centred copy keeps clean negative space. No
// raster images, no JS, reduced-motion safe (it's fully static).
export default function FlowBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Warm depth wash toward the corners */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 85% at 100% 0%, rgba(198,166,100,0.10), transparent 55%)," +
            "radial-gradient(110% 90% at 0% 100%, rgba(232,222,203,0.40), transparent 55%)",
        }}
      />

      {/* Embossed flowing shapes — soft, low-contrast, right-anchored */}
      <svg
        className="absolute -right-20 top-1/2 h-[150%] w-auto -translate-y-1/2 opacity-70 blur-[1px] sm:-right-12 lg:-right-4"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="flowPill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FEFCF8" />
            <stop offset="1" stopColor="#E8DECB" />
          </linearGradient>
          <linearGradient id="flowAccent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#C6A664" stopOpacity="0.5" />
            <stop offset="1" stopColor="#C6A664" stopOpacity="0" />
          </linearGradient>
          <filter id="flowSoft" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="10"
              stdDeviation="16"
              floodColor="#2A2724"
              floodOpacity="0.1"
            />
          </filter>
        </defs>

        {/* Connecting flow ribbon */}
        <path
          d="M120 70 C 330 140, 230 300, 440 360 S 350 540, 540 560"
          stroke="url(#flowAccent)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        <g filter="url(#flowSoft)">
          {/* Extruded capsules */}
          <rect x="250" y="64" width="200" height="80" rx="40" fill="url(#flowPill)" stroke="#E8DECB" />
          <rect
            x="330"
            y="252"
            width="230"
            height="88"
            rx="44"
            fill="url(#flowPill)"
            stroke="#E8DECB"
            transform="rotate(-8 445 296)"
          />
          <rect
            x="300"
            y="452"
            width="190"
            height="76"
            rx="38"
            fill="url(#flowPill)"
            stroke="#E8DECB"
            transform="rotate(6 395 490)"
          />
          {/* Connected nodes */}
          <circle cx="148" cy="82" r="28" fill="url(#flowPill)" stroke="#E8DECB" />
          <circle cx="472" cy="360" r="22" fill="url(#flowPill)" stroke="#E8DECB" />
          <circle cx="548" cy="560" r="16" fill="url(#flowPill)" stroke="#E8DECB" />
        </g>

        {/* Subtle champagne highlight dots along the flow */}
        <circle cx="350" cy="104" r="6" fill="#C6A664" opacity="0.45" />
        <circle cx="445" cy="296" r="6" fill="#C6A664" opacity="0.4" />
        <circle cx="395" cy="490" r="6" fill="#C6A664" opacity="0.4" />
      </svg>

      {/* Readability overlay — keeps the centre clean behind the text */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(62% 60% at 50% 42%, rgba(251,248,242,0.92), rgba(251,248,242,0) 70%)",
        }}
      />
    </div>
  );
}
