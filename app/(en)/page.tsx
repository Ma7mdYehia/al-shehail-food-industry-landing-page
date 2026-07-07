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
import { products } from "@/lib/products/catalog";
import type { Locale } from "@/lib/i18n";

const locale: Locale = "en";

export const metadata: Metadata = {
  title: {
    absolute:
      "Al Shehail Food Industries | Private Label Bakery Manufacturing UAE",
  },
  description:
    "Private label bakery manufacturing in the UAE — bakery product development and retail-ready supply, from idea to shelf, for retail and institutional brands.",
  alternates: {
    canonical: "/",
    languages: { en: "/", ar: "/ar" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  description:
    "UAE-based bakery manufacturing and private label partner. From idea to shelf — developing and manufacturing bakery products built for retail success.",
  url: "https://www.alshehai.ae",
  inLanguage: "en",
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
    itemOffered: { "@type": "Product", name: p.name.en },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header locale={locale} />
      <main>
        <Hero locale={locale} />
        <Partners locale={locale} />
        <AboutTeaser locale={locale} />
        <ServicesEcosystem locale={locale} />
        <Products locale={locale} />
        <ManufacturingProcessSection locale={locale} />
        <MarketPresenceTeaser locale={locale} />
        <FinalCTA locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
