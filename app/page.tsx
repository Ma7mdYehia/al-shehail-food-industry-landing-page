import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import AboutSnapshot from "@/components/AboutSnapshot";
import Products from "@/components/Products";
import PrivateLabel from "@/components/PrivateLabel";
import Certifications from "@/components/Certifications";
import Capabilities from "@/components/Capabilities";
import MarketPresence from "@/components/MarketPresence";
import WhyUs from "@/components/WhyUs";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import { company, productCategories } from "@/lib/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  description:
    "UAE-based bakery manufacturing and private label partner. From idea to shelf — developing and manufacturing bakery products built for retail success.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "AE",
  },
  email: company.email,
  makesOffer: productCategories.map((p) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Product", name: p.name },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Partners />
        <AboutSnapshot />
        <Products />
        <PrivateLabel />
        <Certifications />
        <Capabilities />
        <MarketPresence />
        <WhyUs />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
