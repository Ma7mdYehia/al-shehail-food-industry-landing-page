import HeroSlider from "./hero/HeroSlider";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-36 lg:pt-44 lg:pb-28"
    >
      {/* Warm decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-warmwhite via-cream to-beige/40" />
        <div className="oven-glow absolute inset-x-0 top-0 h-[60%]" />
        <div className="bg-grain absolute inset-0 opacity-60" />
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />
        <div className="absolute top-40 -left-24 h-96 w-96 rounded-full bg-sand/30 blur-3xl" />
      </div>

      <HeroSlider />
    </section>
  );
}
