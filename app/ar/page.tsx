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

const locale: Locale = "ar";

export const metadata: Metadata = {
  title: {
    absolute:
      "الشحيل للصناعات الغذائية | تصنيع مخبوزات بعلامة خاصة في الإمارات",
  },
  description:
    "تصنيع مخبوزات بعلامة خاصة في الإمارات — تطوير منتجات المخبوزات وتوريد جاهز للرف، من الفكرة إلى الرف، لعلامات التجزئة والمؤسسات.",
  alternates: {
    canonical: "/ar",
    languages: { en: "/", ar: "/ar" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  description:
    "شريك تصنيع مخبوزات وعلامات خاصة مقره الإمارات. من الفكرة إلى الرف — تطوير وتصنيع منتجات مخبوزات مهيأة للنجاح في التجزئة.",
  url: "https://www.alshehai.ae/ar",
  inLanguage: "ar",
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
    itemOffered: { "@type": "Product", name: p.name.ar },
  })),
};

export default function ArabicHome() {
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
