type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
};

// Shared hero band for the core company pages (about, private label, etc.).
export default function PageHero({ eyebrow, title, subtitle, children }: Props) {
  return (
    <section className="relative overflow-hidden pt-32 pb-12 sm:pt-36 lg:pt-44 lg:pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-warmwhite via-cream to-beige/40" />
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />
        <div className="absolute top-40 -left-24 h-96 w-96 rounded-full bg-sand/30 blur-3xl" />
      </div>
      <div className="container-x">
        <div className="max-w-3xl">
          <span className="eyebrow">
            <span className="h-px w-6 bg-champagne" />
            {eyebrow}
          </span>
          <h1 className="heading-serif mt-6 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone">{subtitle}</p>
          {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
        </div>
      </div>
    </section>
  );
}
