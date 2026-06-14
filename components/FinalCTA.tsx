export default function FinalCTA() {
  return (
    <section id="contact" className="section">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl border border-sand bg-gradient-to-br from-charcoal to-ink px-6 py-16 text-center sm:px-12 lg:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-champagne/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <span className="eyebrow text-champagne">
              <span className="h-px w-6 bg-champagne" />
              From Idea to Shelf
            </span>
            <h2 className="heading-serif mt-5 text-3xl text-warmwhite sm:text-4xl lg:text-5xl">
              Let&apos;s build your next bakery product
            </h2>
            <p className="mt-5 text-base leading-relaxed text-cream/80 sm:text-lg">
              Tell us your concept, category, or private label goal. Our team
              will help you develop, manufacture, and bring it to retail.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a
                href="mailto:info@alshehailfood.com"
                className="btn-primary"
              >
                Start a Project
              </a>
              <a
                href="#products"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/30 bg-transparent px-7 py-3.5 text-sm font-semibold text-warmwhite transition-all duration-300 hover:border-champagne hover:text-champagne"
              >
                View Product Range
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
