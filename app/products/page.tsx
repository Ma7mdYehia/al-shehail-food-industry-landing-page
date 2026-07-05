import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductIcon, { type ProductIconType } from "@/components/ProductIcon";
import ProductFamilyStickyNav from "@/components/products/ProductFamilyStickyNav";
import { products, productsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: { absolute: "منتجات المخبوزات | الشحيل للصناعات الغذائية الإمارات" },
  description:
    "استعرض تشكيلة الشحيل للصناعات الغذائية من المخبوزات — خبز مسطح ولفائف، وخبز طري، ومعجنات، وحلويات تمر — للتصنيع بعلامة خاصة وتوريد التجزئة.",
  alternates: { canonical: "/products" },
};

// Per-family icon + one-line tagline for the directory cards.
const familyIcon: Record<string, ProductIconType> = {
  "flatbread-wraps": "flatbread",
  "soft-bread": "loaf",
  pastry: "croissant",
  sweets: "maamoul",
};

const familyTagline: Record<string, string> = {
  "flatbread-wraps": "خبز عربي ولفائف وظيفية",
  "soft-bread": "أرغفة وكعك وأرغفة صغيرة",
  pastry: "كرواسان وعجين مورّق",
  sweets: "حلويات تمر وبسكويت",
};

function AllIcon({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      className="rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// A premium rounded family card that scrolls to its product section.
function FamilyCard({
  href,
  name,
  count,
  tagline,
  children,
}: {
  href: string;
  name: string;
  count: number;
  tagline: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group flex flex-col items-center rounded-2xl border border-sand bg-warmwhite px-4 py-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-champagne hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-sand bg-cream text-gold transition-colors duration-300 group-hover:border-champagne">
        {children}
      </span>
      <span className="mt-3 font-serif text-base font-semibold leading-tight text-ink">
        {name}
      </span>
      <span className="mt-0.5 text-[11px] font-medium text-stone/70">
        {count} {count === 1 ? "منتج" : "منتجات"}
      </span>
      <span className="mt-1.5 text-xs leading-snug text-stone">{tagline}</span>
    </a>
  );
}

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero */}
        <section className="relative overflow-hidden pt-32 pb-14 sm:pt-36 lg:pt-44 lg:pb-16">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-warmwhite via-cream to-beige/40" />
            <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />
          </div>
          <div className="container-x">
            <div className="max-w-3xl">
              <span className="eyebrow">
                <span className="h-px w-6 bg-champagne" />
                دليل المنتجات
              </span>
              <h1 className="heading-serif mt-6 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                منتجات المخبوزات حسب الفئة
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-stone">
                استعرض تشكيلتنا التصنيعية حسب فئة المنتج — مطوَّرة للعلامة
                الخاصة، والتجزئة، والتوريد المؤسسي.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Product Family Directory — a distinct soft beige band, set lower
            with extra breathing room below the hero. */}
        <section
          id="product-families"
          className="scroll-mt-24 border-y border-sand/50 bg-beige/35 pt-12 pb-12 sm:pt-14 lg:pt-16"
        >
          <div className="container-x">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <FamilyCard
                href="#product-directory"
                name="جميع المنتجات"
                count={products.length}
                tagline="التشكيلة التصنيعية الكاملة"
              >
                <AllIcon size={30} />
              </FamilyCard>
              {productsByCategory.map(({ category, items }) => (
                <FamilyCard
                  key={category.slug}
                  href={`#${category.slug}`}
                  name={category.name}
                  count={items.length}
                  tagline={familyTagline[category.slug] ?? ""}
                >
                  <ProductIcon
                    type={familyIcon[category.slug] ?? "loaf"}
                    width={32}
                    height={32}
                  />
                </FamilyCard>
              ))}
            </div>
          </div>
        </section>

        {/* Sticky quick-jump nav — hidden while the family cards are visible,
            then pinned under the header once scrolled past them. */}
        <ProductFamilyStickyNav />

        {/* 3. Grouped product sections */}
        <div id="product-directory" className="scroll-mt-36">
          {productsByCategory.map(({ category, items }) => (
            <section
              key={category.slug}
              id={category.slug}
              className="section scroll-mt-36 border-t border-sand/60 bg-warmwhite first:border-t-0"
            >
              <div className="container-x">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="max-w-2xl">
                    <span className="eyebrow">
                      <span className="h-px w-6 bg-champagne" />
                      {category.name}
                      <span className="ms-1 text-stone/70">
                        · {items.length}
                      </span>
                    </span>
                    <h2 className="heading-serif mt-4 text-3xl sm:text-4xl">
                      {category.name}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-stone sm:text-lg">
                      {category.description}
                    </p>
                  </div>
                  <a
                    href="#product-families"
                    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
                  >
                    العودة إلى الفئات
                    <ArrowRight />
                  </a>
                </div>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      showUseCases={false}
                    />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* 4. CTA */}
        <section className="section">
          <div className="container-x">
            <div className="relative overflow-hidden rounded-3xl border border-champagne/40 bg-gradient-to-br from-warmwhite via-cream to-beige px-6 py-16 text-center shadow-soft sm:px-12 lg:py-20">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -end-24 -top-24 h-72 w-72 rounded-full bg-champagne/20 blur-3xl" />
                <div className="absolute -bottom-24 -start-20 h-72 w-72 rounded-full bg-sand/40 blur-3xl" />
              </div>
              <div className="relative mx-auto max-w-2xl">
                <span className="eyebrow">
                  <span className="h-px w-6 bg-champagne" />
                  العلامة الخاصة
                </span>
                <h2 className="heading-serif mt-5 text-3xl sm:text-4xl lg:text-[2.75rem]">
                  تحتاج منتج مخبوزات مخصَّصًا؟
                </h2>
                <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
                  يمكن للشحيل دعم تطوير المنتج، وتخصيص الوصفة، والتصنيع بعلامة
                  خاصة، والتغليف، والتوريد الجاهز للرف.
                </p>
                <div className="mt-8">
                  <Link href="/contact" className="btn-primary">
                    ابدأ مشروع علامة خاصة
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
