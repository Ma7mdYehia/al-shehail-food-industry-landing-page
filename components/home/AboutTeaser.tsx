import SectionHeading from "../SectionHeading";
import TeaserLink from "../TeaserLink";

export default function AboutTeaser() {
  return (
    <section className="section">
      <div className="container-x">
        {/* One clean left-aligned content block: eyebrow, title, description,
            then the learn-more link directly under the copy. */}
        <div className="max-w-2xl">
          <SectionHeading
            align="left"
            eyebrow="About Al Shehail"
            title="UAE-Based Bakery Manufacturing Partner"
            description="Al Shehail Food Industries is a UAE-based bakery manufacturer specialized in modern bakery products, private label production, and product development for retail and institutional markets."
          />
          <TeaserLink
            href="/about"
            label="Learn About Al Shehail"
            className="mt-6"
          />
        </div>
      </div>
    </section>
  );
}
