import SectionHeading from "./SectionHeading";
import { privateLabelSteps } from "@/lib/content";

export default function PrivateLabel() {
  return (
    <section id="private-label" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Private Label Solutions"
          title="From idea to shelf, in eight steps"
          description="A clear, proven manufacturing path that takes your concept all the way to a certified, retail-ready, branded bakery product."
        />

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {privateLabelSteps.map((step) => (
            <li
              key={step.number}
              className="group relative flex flex-col rounded-2xl border border-sand bg-warmwhite p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-champagne hover:shadow-soft"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gold-gradient font-serif text-base font-bold text-white shadow-card">
                  {step.number}
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-champagne/50 to-transparent" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
