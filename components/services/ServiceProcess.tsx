import SectionHeading from "../SectionHeading";

// Reusable numbered process timeline for the services pages. Same vertical
// layout on mobile and desktop (numbered nodes on a thin connecting line).
export type ServiceStep = { title: string; text: string };

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  steps: ServiceStep[];
};

export default function ServiceProcess({
  eyebrow,
  title,
  description,
  steps,
}: Props) {
  return (
    <>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="relative mx-auto mt-12 max-w-3xl">
        <span
          className="absolute bottom-3 left-5 top-3 w-px bg-sand sm:left-6"
          aria-hidden
        />
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex gap-4 sm:gap-5">
              <span className="relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-champagne/50 bg-warmwhite font-serif text-sm font-bold text-gold shadow-card sm:h-12 sm:w-12">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="card-lift flex-1 rounded-2xl border border-sand bg-warmwhite p-4 transition-colors hover:border-champagne/60 sm:p-5">
                <h3 className="font-serif text-base font-semibold text-ink sm:text-lg">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-stone">
                  {s.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
