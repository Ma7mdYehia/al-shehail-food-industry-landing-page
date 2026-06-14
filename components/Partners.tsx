import { manufacturingPartners } from "@/lib/content";

export default function Partners() {
  return (
    <section className="border-y border-sand/60 bg-warmwhite py-12 sm:py-14">
      <div className="container-x">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-stone">
          Manufacturing Partner For
        </p>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {manufacturingPartners.map((partner) => (
            <div
              key={partner}
              className="flex items-center justify-center"
            >
              <span className="font-serif text-xl font-semibold text-charcoal/70 transition-colors hover:text-gold sm:text-2xl">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
