import Link from "next/link";
import SectionHeading from "./SectionHeading";
import ProductCard from "./ProductCard";
import { featuredProducts } from "@/lib/products";

// Homepage "What We Manufacture" — a curated, featured-first teaser (not the
// full catalog). The complete directory lives on /products.
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
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
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
