import HeroSlider from "./hero/HeroSlider";
import type { Locale } from "@/lib/i18n";

export default function Hero({ locale }: { locale: Locale }) {
  return (
    <section
      id="top"
      className="relative overflow-hidden"
    >
      {/* Warm layered ambient background — cream base, champagne + wheat glows */}
      <div className="bg-warm-ambient pointer-events-none absolute inset-0 -z-10">
        <div className="oven-glow absolute inset-x-0 top-0 h-[60%]" />
        <div className="bg-grain absolute inset-0 opacity-50" />
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-champagne/15 blur-3xl" />
        <div className="absolute top-40 -left-24 h-96 w-96 rounded-full bg-sand/30 blur-3xl" />
      </div>

      <HeroSlider locale={locale} />
    </section>
  );
}
