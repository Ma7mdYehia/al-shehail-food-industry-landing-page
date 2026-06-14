import Link from "next/link";

type Cta = { label: string; href: string };

type Props = {
  eyebrow?: string;
  title: string;
  text: string;
  primary: Cta;
  secondary?: Cta;
};

// Warm, light CTA panel reused at the bottom of the core company pages.
export default function CtaBand({
  eyebrow = "Private Label",
  title,
  text,
  primary,
  secondary,
}: Props) {
  return (
    <section className="section">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl border border-champagne/40 bg-gradient-to-br from-warmwhite via-cream to-beige px-6 py-16 text-center shadow-soft sm:px-12 lg:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-champagne/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-sand/40 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-2xl">
            <span className="eyebrow">
              <span className="h-px w-6 bg-champagne" />
              {eyebrow}
            </span>
            <h2 className="heading-serif mt-5 text-3xl sm:text-4xl lg:text-[2.75rem]">
              {title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
              {text}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href={primary.href} className="btn-primary">
                {primary.label}
              </Link>
              {secondary && (
                <Link href={secondary.href} className="btn-secondary">
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
