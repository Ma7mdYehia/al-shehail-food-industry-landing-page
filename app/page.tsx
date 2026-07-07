import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import Products from "@/components/Products";
import AboutTeaser from "@/components/home/AboutTeaser";
import ManufacturingProcessSection from "@/components/home/ManufacturingProcessSection";
import ServicesEcosystem from "@/components/home/ServicesEcosystem";
import MarketPresenceTeaser from "@/components/home/MarketPresenceTeaser";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import { company } from "@/lib/content";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: {
    absolute:
      "الشحيل للصناعات الغذائية | تصنيع مخبوزات وحلول علامة خاصة في الإمارات",
  },
  description:
    "الشحيل للصناعات الغذائية شريك إماراتي لتصنيع المخبوزات وحلول العلامة الخاصة، من تطوير المنتج والوصفة إلى التغليف والتوريد الجاهز للسوق.",
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  description:
    "شريك إماراتي لتصنيع المخبوزات وحلول العلامة الخاصة، يدعم العلامات الغذائية في تطوير المنتج والتصنيع والتغليف والتوريد.",
  url: "https://www.alshehai.ae",
  address: {
    "@type": "PostalAddress",
    streetAddress: "New Industrial Area",
    addressLocality: "Umm Al Quwain",
    addressCountry: "AE",
  },
  email: company.email,
  telephone: company.phone,
  makesOffer: products.map((p) => ({
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
        <AboutTeaser />
        <ServicesEcosystem />
        <Products />
        <ManufacturingProcessSection />
        <MarketPresenceTeaser />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
