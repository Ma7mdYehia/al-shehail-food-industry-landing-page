import SectionHeading from "./SectionHeading";

const highlights = [
  {
    title: "Product Development",
    text: "We turn product ideas into manufacturable, retail-ready bakery lines.",
  },
  {
    title: "Private Label Focus",
    text: "Dedicated to building and producing brands for the retail shelf.",
  },
  {
    title: "Certified Operations",
    text: "Manufacturing backed by recognized food-safety and quality systems.",
  },
];

export default function AboutSnapshot() {
  return (
    <section id="about" className="section">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="About Al Shehail"
              title="A bakery manufacturing partner built for retail success"
              description="Al Shehail Food Industries is a UAE-based bakery manufacturer and private label partner. We help food brands move from idea to shelf — developing, manufacturing, packing, and scaling bakery products for the modern market."
            />
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#private-label" className="btn-primary">
                See How We Work
              </a>
              <a href="#capabilities" className="btn-secondary">
                Our Capabilities
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl border border-sand bg-warmwhite p-6 shadow-card"
              >
                <span className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-beige text-gold">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
