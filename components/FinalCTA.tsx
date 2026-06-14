import { company, whatsappLink } from "@/lib/content";

export default function FinalCTA() {
  return (
    <section id="contact" className="section">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl border border-champagne/40 bg-gradient-to-br from-warmwhite via-cream to-beige px-6 py-16 shadow-soft sm:px-12 lg:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-champagne/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-sand/40 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-2xl text-center">
            <span className="eyebrow">
              <span className="h-px w-6 bg-champagne" />
              From Idea to Shelf
            </span>
            <h2 className="heading-serif mt-5 text-3xl sm:text-4xl lg:text-5xl">
              Let&apos;s manufacture your next bakery product
            </h2>
            <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
              Share your product concept, category, or private label brief. Our
              team will help you develop, certify, manufacture, and supply it
              retail-ready across the UAE.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a href={`mailto:${company.email}`} className="btn-primary">
                Start a Project
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.518 5.26l-.999 3.648 3.97-1.057zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                WhatsApp Us
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-stone">
              <a
                href={`tel:+${company.phoneDigits}`}
                className="font-semibold text-charcoal transition-colors hover:text-gold"
              >
                {company.phone}
              </a>
              <a
                href={`mailto:${company.email}`}
                className="font-semibold text-charcoal transition-colors hover:text-gold"
              >
                {company.email}
              </a>
              <span>{company.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
