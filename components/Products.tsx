import Link from "next/link";
import SectionHeading from "./SectionHeading";
import HomeProductCard from "./home/HomeProductCard";
import { products } from "@/lib/products";

// Homepage "What We Manufacture" teaser — a concise, curated selection of the
// featured products (capped at six). The full catalog lives on /products.
const HOME_MAX = 6;
const featured = products.filter((p) => p.featured).slice(0, HOME_MAX);

export default function Products() {
  return (
    <section id="products" className="section relative overflow-hidden bg-warmwhite">
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="What We Manufacture"
          title="A complete bakery product range"
          description="A featured selection from our range — flatbread and wraps, soft bread, pastry, and sweets — manufactured to consistent, retail-ready quality."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <HomeProductCard key={product.slug} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/products" className="btn-secondary">
            View Full Product Catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
