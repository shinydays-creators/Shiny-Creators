import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        glow: {
          gold: "#FBCB6A",
          "gold-dark": "#F0B84A",
          pink: "#FECFE4",
          "pink-dark": "#F9AECF",
          cream: "#FFF7FB",
          peach: "#FEEEE0",
          text: "#3A2E32",
          "text-muted": "#8A7279",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 24px 0 rgba(58, 46, 50, 0.08)",
        "soft-lg": "0 8px 40px 0 rgba(58, 46, 50, 0.12)",
        glow: "0 0 32px 0 rgba(251, 203, 106, 0.35)",
      },
      backgroundImage: {
        "glow-gradient":
          "linear-gradient(135deg, #FFF7FB 0%, #FEEEE0 50%, #FECFE4 100%)",
        "gold-gradient": "linear-gradient(135deg, #FBCB6A 0%, #F9AECF 100%)",
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
