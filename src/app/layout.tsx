import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", weight: ["500", "600", "700", "800"] });
const description = "Offshore vessel charter: FPSOs, pipe and cable laying vessels, tankers, tugs, workboats, well intervention vessels, jack-ups, pontoons and dredgers for offshore and marine operations.";
export const metadata: Metadata = {
  title: { default: "Anchorship | Offshore Vessel Charter", template: "%s | Anchorship" }, description,
  metadataBase: new URL(siteUrl("http://localhost:3000")), applicationName: "Anchorship",
  openGraph: { type: "website", siteName: "Anchorship", locale: "en_GB", title: "Anchorship | Offshore Vessel Charter", description },
  twitter: { card: "summary_large_image", title: "Anchorship | Offshore Vessel Charter", description },
};
export const viewport: Viewport = { themeColor: "#071B2C" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className={`${inter.variable} ${manrope.variable}`}><body>{children}</body></html>; }
