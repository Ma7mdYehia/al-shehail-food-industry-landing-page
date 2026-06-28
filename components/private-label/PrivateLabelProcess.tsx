// Page-specific "From Idea to Shelf" process — a clean vertical timeline that
// works the same on mobile and desktop. Numbered nodes on a thin connecting
// line, each with a title and short supporting line. Lightweight, no SVG.
const steps = [
  {
    title: "Product Brief",
    text: "We understand the product idea, market, format, and business goal.",
  },
  {
    title: "Recipe Direction",
    text: "We define the recipe route based on positioning and feasibility.",
  },
  {
    title: "Sample Development",
    text: "Initial samples are prepared, reviewed, and refined.",
  },
  {
    title: "Costing",
    text: "The product direction is evaluated against cost, format, and volume.",
  },
  {
    title: "Packaging Planning",
    text: "Packaging direction is aligned with product type and supply needs.",
  },
  {
    title: "Production Setup",
    text: "The product moves into a controlled production plan.",
  },
  {
    title: "Quality Control",
    text: "Checks are applied across handling, production, and packing.",
  },
  {
    title: "Retail-Ready Supply",
    text: "The final product is prepared for market-ready supply.",
  },
];

export default function PrivateLabelProcess() {
  return (
    <div className="relative mx-auto mt-12 max-w-3xl">
      {/* Connecting line behind the number nodes */}
      <span
        className="absolute bottom-3 left-5 top-3 w-px bg-sand sm:left-6"
        aria-hidden
      />
      <ol className="space-y-4">
        {steps.map((s, i) => (
          <li key={s.title} className="relative flex gap-4 sm:gap-5">
            <span className="relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-champagne/50 bg-warmwhite font-serif text-sm font-bold text-gold shadow-card sm:h-12 sm:w-12">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="card-lift flex-1 rounded-2xl border border-sand bg-warmwhite p-4 transition-colors hover:border-champagne/60 sm:p-5">
              <h3 className="font-serif text-base font-semibold text-ink sm:text-lg">
                {s.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-stone">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
