import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";
// Self-hosted so builds never depend on Google Fonts being reachable: variable Inter and Manrope, latin subset, from
// @fontsource-variable/inter and /manrope 5.3.0 (SIL Open Font License 1.1, licence files alongside in ./fonts).
const inter = localFont({ src: "./fonts/inter-latin-wght-normal.woff2", variable: "--font-inter", display: "swap", weight: "100 900" });
const manrope = localFont({ src: "./fonts/manrope-latin-wght-normal.woff2", variable: "--font-manrope", display: "swap", weight: "200 800" });
const description = "Offshore vessel charter: FPSOs, pipe and cable laying vessels, tankers, tugs, workboats, well intervention vessels, jack-ups, pontoons and dredgers for offshore and marine operations.";
export const metadata: Metadata = {
  title: { default: "Anchorship | Offshore Vessel Charter", template: "%s | Anchorship" }, description,
  metadataBase: new URL(siteUrl("http://localhost:3000")), applicationName: "Anchorship",
  openGraph: { type: "website", siteName: "Anchorship", locale: "en_GB", title: "Anchorship | Offshore Vessel Charter", description },
  twitter: { card: "summary_large_image", title: "Anchorship | Offshore Vessel Charter", description },
};
export const viewport: Viewport = { themeColor: "#071B2C" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className={`${inter.variable} ${manrope.variable}`}><body>{children}</body></html>; }
