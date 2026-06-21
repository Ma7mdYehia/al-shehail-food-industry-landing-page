import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm light B2B manufacturing palette
        cream: "#FBF8F2",
        warmwhite: "#FEFCF8",
        beige: "#F2EBDD",
        sand: "#E8DECB",
        champagne: "#C6A664",
        gold: "#B8924A",
        golddeep: "#9C7A38",
        charcoal: "#2A2724",
        ink: "#1C1A17",
        stone: "#6B655B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(42, 39, 36, 0.12)",
        card: "0 4px 24px -8px rgba(42, 39, 36, 0.10)",
        lift: "0 24px 60px -20px rgba(42, 39, 36, 0.22)",
        // Warm oven / champagne glow used on focused panels and seals.
        glow: "0 0 0 1px rgba(198, 166, 100, 0.35), 0 18px 50px -20px rgba(198, 166, 100, 0.45)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C6A664 0%, #B8924A 100%)",
        // Warm oven glow radial used behind premium panels.
        "oven-glow":
          "radial-gradient(60% 60% at 50% 0%, rgba(198, 166, 100, 0.22) 0%, rgba(198, 166, 100, 0) 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        // Soft light sweep used on the primary CTA.
        sweep: {
          "0%": { transform: "translateX(-120%)" },
          "60%, 100%": { transform: "translateX(220%)" },
        },
        // Travelling pulse that runs down a vertical process / production line.
        "line-pulse": {
          "0%": { top: "-12%", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
        // Gentle drift for flour-dust / gold particles.
        drift: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "20%": { opacity: "0.9" },
          "80%": { opacity: "0.6" },
          "100%": {
            transform: "translateY(-26px) translateX(8px)",
            opacity: "0",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        sweep: "sweep 0.9s ease-out",
        "line-pulse": "line-pulse 3.2s ease-in-out infinite",
        drift: "drift 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
