import SectionHeading from "./SectionHeading";
import { whyUsPoints } from "@/lib/content";

export default function WhyUs() {
  return (
    <section id="why" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why Al Shehail"
          title="The partner brands trust to scale"
          description="We combine product development, certified manufacturing, and retail experience into one dependable partnership."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyUsPoints.map((point, i) => (
            <div
              key={point.title}
              className="relative rounded-2xl border border-sand bg-warmwhite p-7 shadow-card"
            >
              <span className="font-serif text-3xl font-bold text-champagne/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold text-ink">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
