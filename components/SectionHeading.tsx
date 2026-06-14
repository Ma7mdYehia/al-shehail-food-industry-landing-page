type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: Props) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      <span className="eyebrow">
        <span className="h-px w-6 bg-champagne" />
        {eyebrow}
      </span>
      <h2 className="heading-serif mt-4 text-3xl sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-stone sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
