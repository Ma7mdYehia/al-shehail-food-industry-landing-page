import SectionHeading from "./SectionHeading";
import { certifications } from "@/lib/content";

export default function Certifications() {
  return (
    <section id="certifications" className="section bg-warmwhite">
      <div className="container-x">
        <SectionHeading
          eyebrow="Certifications & Quality"
          title="Quality you can put your brand behind"
          description="Our manufacturing operations are built around recognized food-safety and quality standards."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert) => (
            <div
              key={cert.title}
              className="flex flex-col items-center rounded-2xl border border-sand bg-cream p-7 text-center shadow-card"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-champagne/40 bg-warmwhite text-gold">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 19.3 7.2 16.9l.9-5.4L4.2 7.7l5.4-.8z" />
                </svg>
              </span>
              <h3 className="mt-5 font-serif text-lg font-semibold text-ink">
                {cert.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">
                {cert.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
