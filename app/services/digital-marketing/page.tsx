import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: {
    absolute: "Food Digital Marketing | Al Shehail Food Industries",
  },
  description:
    "Digital marketing support for food brands, helping products communicate clearly across online channels.",
  alternates: { canonical: "/services/digital-marketing" },
};

export default function DigitalMarketingPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Services"
          title="Food Digital Marketing"
          subtitle="Digital marketing support for food brands, helping products communicate clearly across online channels."
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
