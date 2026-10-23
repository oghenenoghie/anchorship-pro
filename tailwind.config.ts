import type { Config } from "tailwindcss";
// Anchorship design tokens. Keep in sync with the CSS custom properties in src/app/globals.css and the
// anchorship-design-system skill. `muted` is darkened from the brief's #647787 so small text passes 4.5:1 on `mist`.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#071B2C", 800: "#102B40", 700: "#1A3A52" },
        ocean: { DEFAULT: "#145D7A", 600: "#1B7193" },
        // Teal: interactive accents, status and emphasis only. Not for body text on white (2.98:1); use marine-700 there.
        marine: { DEFAULT: "#22A6A1", 300: "#56D1CB", 700: "#0F6E6A", 50: "#E9F6F5" },
        mist: "#F4F7F9",
        line: "#DCE5EB",
        ink: "#142536",
        muted: "#5B6E7E",
        "on-dark": "#B8C7D3",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["var(--font-manrope)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: { content: "1240px", prose: "68ch" },
      borderRadius: { card: "6px" },
      boxShadow: {
        soft: "0 18px 55px rgba(7,27,44,.09)",
        card: "0 1px 2px rgba(7,27,44,.05)",
        lift: "0 18px 40px -18px rgba(7,27,44,.28)",
      },
      transitionTimingFunction: { marine: "cubic-bezier(.2,.7,.2,1)" },
    },
  },
  plugins: [],
};
export default config;
