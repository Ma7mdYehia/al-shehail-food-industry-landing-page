import SectionHeading from "../SectionHeading";
import TeaserLink from "../TeaserLink";
import ProcessJourney from "../ProcessJourney";
import FlowBackdrop from "../decor/FlowBackdrop";

export default function PrivateLabelTeaser() {
  return (
    <section className="section relative overflow-hidden">
      {/* Subtle premium 3D-style abstract flow pattern behind the journey */}
      <FlowBackdrop />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Private Label Solutions"
          title="From idea to shelf, end to end"
          description="One connected manufacturing line — product development, recipe, sampling, costing, packaging, production, quality control, and retail-ready supply."
        />

        <ProcessJourney />

        <div className="mt-12 text-center">
          <TeaserLink href="/private-label" label="Explore Private Label" variant="secondary" />
        </div>
      </div>
    </section>
  );
}
