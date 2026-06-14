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
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C6A664 0%, #B8924A 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
