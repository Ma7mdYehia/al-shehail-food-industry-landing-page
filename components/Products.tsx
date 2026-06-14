import SectionHeading from "./SectionHeading";
import { productCategories } from "@/lib/content";

export default function Products() {
  return (
    <section id="products" className="section bg-warmwhite">
      <div className="container-x">
        <SectionHeading
          eyebrow="What We Manufacture"
          title="A complete bakery product range"
          description="From everyday breads to laminated pastries and date-based snacks — manufactured to consistent, retail-ready quality."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {productCategories.map((product, i) => (
            <div
              key={product.name}
              className="group relative overflow-hidden rounded-2xl border border-sand bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:border-champagne hover:shadow-soft"
            >
              <div className="absolute right-5 top-5 font-serif text-sm font-bold text-sand transition-colors group-hover:text-champagne">
                {String(i + 1).padStart(2, "0")}
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-gradient text-white shadow-card">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 13a8 8 0 0116 0v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1z" />
                  <path d="M8 13a4 4 0 018 0" />
                </svg>
              </span>
              <h3 className="mt-5 font-serif text-lg font-semibold text-ink">
                {product.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">
                {product.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
