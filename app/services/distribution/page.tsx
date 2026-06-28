import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: {
    absolute: "Distribution Fleet & Retail Reach | Al Shehail Food Industries",
  },
  description:
    "Support for moving finished bakery products from production to retail channels through Al Shehail's distribution operation.",
  alternates: { canonical: "/services/distribution" },
};

export default function DistributionPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Services"
          title="Distribution Fleet & Retail Reach"
          subtitle="Support for moving finished bakery products from production to retail channels through Al Shehail's distribution operation."
        >
          <a href="/contact" className="btn-primary">
            Start a Project
          </a>
          <a href="/private-label" className="btn-secondary">
            Private Label Manufacturing
          </a>
        </PageHero>

        <section className="section">
          <div className="container-x">
            <div className="mx-auto max-w-2xl rounded-2xl border border-sand bg-cream p-8 text-center">
              <p className="text-sm leading-relaxed text-stone">
                Detailed service content will be added in the next stage.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
