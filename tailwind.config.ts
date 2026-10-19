import type { Config } from "tailwindcss";
const config: Config = { content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { colors: { navy: "#0B1D2A", ocean: "#176B87", mist: "#F3F5F6" }, boxShadow: { soft: "0 18px 55px rgba(11,29,42,.09)" } } }, plugins: [] };
export default config;
