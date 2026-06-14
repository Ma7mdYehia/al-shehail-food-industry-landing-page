import SectionHeading from "./SectionHeading";
import AssetHint from "./AssetHint";
import { certifications } from "@/lib/content";
import { ShieldCheckIcon } from "./Icons";

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
              className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-sand bg-cream p-8 text-center shadow-card transition-all duration-300 hover:border-champagne hover:shadow-soft"
            >
              {/* Gold seal */}
              <span className="relative flex h-20 w-20 items-center justify-center">
                <span className="absolute inset-0 rounded-full border-2 border-dashed border-champagne/40" />
                <span className="absolute inset-2 rounded-full border border-champagne/30" />
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient text-white shadow-card">
                  <ShieldCheckIcon width={22} height={22} />
                </span>
              </span>

              <span className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-champagne">
                Quality Mark
              </span>
              <h3 className="mt-1.5 font-serif text-lg font-semibold text-ink">
                {cert.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">
                {cert.description}
              </p>
              {/* Placeholder cue for the verified certification asset. */}
              <AssetHint
                label={
                  cert.title === "Carrefour Approved"
                    ? "Approval proof/logo needed"
                    : "Certificate scan/logo needed"
                }
                className="mt-4"
              />
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-stone">
          Certification marks shown represent quality and food-safety standards
          our operations are built around.
        </p>
      </div>
    </section>
  );
}
