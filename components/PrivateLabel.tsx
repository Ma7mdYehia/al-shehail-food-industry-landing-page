import SectionHeading from "./SectionHeading";
import { privateLabelSteps } from "@/lib/content";

export default function PrivateLabel() {
  return (
    <section id="private-label" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Private Label Solutions"
          title="From idea to shelf, end to end"
          description="A clear, proven path that takes your concept all the way to a retail-ready, branded bakery product."
        />

        <div className="mt-16">
          <ol className="relative grid gap-8 lg:grid-cols-5 lg:gap-4">
            {/* Connecting line on large screens */}
            <span
              className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-sand via-champagne/50 to-sand lg:block"
              aria-hidden
            />
            {privateLabelSteps.map((step) => (
              <li key={step.number} className="relative">
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient font-serif text-lg font-bold text-white shadow-soft">
                  {step.number}
                </div>
                <h3 className="mt-5 font-serif text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
