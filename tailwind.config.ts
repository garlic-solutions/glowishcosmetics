import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          dark: "#333333",
          light: "#fff0f5",
          white: "#ffffff",
          gray: "#f8f8f8",
        },
        // Keeping pink for backward compatibility in some components until fully replaced,
        // but overriding the main gradient usage.
        pink: {
          50:  "#fff0f5",
          100: "#ffe4ee",
          200: "#ffc0cb",
          300: "#ff94b0",
          400: "#333333", // Replaced pink-400 with dark
          500: "#333333", // Replaced pink-500 with dark
          600: "#1a1a1a",
          700: "#1a1a1a",
          800: "#111111",
          900: "#000000",
        },
        blush: "#fff0f5",
        rose:  "#fce4ec",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-bricolage)", "sans-serif"],
      },
      backgroundImage: {
        "pink-gradient":
          "linear-gradient(135deg, #fff0f5 0%, #ffffff 50%, #f8f8f8 100%)",
        "hero-gradient":
          "linear-gradient(135deg, #ffffff 0%, #fff0f5 100%)",
      },
      animation: {
        "fade-in":  "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "float":    "float 3s ease-in-out infinite",
        "marquee":  "marquee 28s linear infinite",
        "spin":     "spin 20s linear infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { transform: "translateY(20px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        float:   { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
