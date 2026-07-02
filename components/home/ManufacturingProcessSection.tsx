import Link from "next/link";
import SectionHeading from "../SectionHeading";
import ProcessJourney from "../ProcessJourney";
import { manufacturingProcessNarrative } from "@/lib/homepageEcosystem";

// Homepage "From Concept to Production" section — restores the premium timeline
// journey used in the earlier homepage direction instead of the image-card grid.
export default function ManufacturingProcessSection() {
  const { title, subtitle, note } = manufacturingProcessNarrative;

  return (
    <section
      id="manufacturing-process"
      className="section scroll-mt-24 border-t border-sand/60 bg-warmwhite"
    >
      <div className="container-x">
        <SectionHeading eyebrow="Manufacturing Process" title={title} description={subtitle} />

        <ProcessJourney />

        {/* Careful-claims note */}
        <p className="mx-auto mt-8 max-w-3xl rounded-2xl border border-sand bg-cream px-5 py-4 text-center text-xs leading-relaxed text-stone">
          {note}
        </p>

        <div className="mt-10 text-center">
          <Link
            href="/private-label"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
          >
            Explore Private Label Manufacturing
            <svg
              className="transition-transform duration-300 group-hover:translate-x-0.5"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
