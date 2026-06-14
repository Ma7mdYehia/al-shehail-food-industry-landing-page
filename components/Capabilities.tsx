import SectionHeading from "./SectionHeading";
import { capabilities } from "@/lib/content";

export default function Capabilities() {
  return (
    <section id="capabilities" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Manufacturing Capabilities"
          title="What we bring to your brand"
          description="A full-service manufacturing partner equipped to develop, produce, and supply bakery products at retail standard."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-sand bg-sand sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="group bg-warmwhite p-8 transition-colors hover:bg-cream"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-beige text-gold transition-colors group-hover:bg-gold-gradient group-hover:text-white">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21h18M5 21V8l4-2 4 2 6-3v16" />
                  <path d="M9 21v-4h4v4" />
                </svg>
              </span>
              <h3 className="mt-5 font-serif text-lg font-semibold text-ink">
                {cap.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
