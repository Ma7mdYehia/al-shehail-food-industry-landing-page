import SectionHeading from "../SectionHeading";
import TeaserLink from "../TeaserLink";

export default function AboutTeaser() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            align="left"
            eyebrow="About Al Shehail"
            title="UAE-Based Bakery Manufacturing Partner"
            description="Al Shehail Food Industries is a UAE-based bakery manufacturer specialized in modern bakery products, private label production, and product development for retail and institutional markets."
          />
          <div className="lg:pt-2">
            <p className="text-base leading-relaxed text-stone sm:text-lg">
              We combine product development, certified manufacturing, and
              private label support under one partner — helping brands move from
              idea to retail-ready shelf.
            </p>
            <TeaserLink href="/about" label="Learn About Al Shehail" className="mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
