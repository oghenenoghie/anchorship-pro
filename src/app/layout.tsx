import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";
export const metadata: Metadata = { title: { default: "Anchorship | Marine & Offshore Solutions", template: "%s | Anchorship" }, description: "Marine and offshore services, vessel brokerage, chartering and equipment solutions.", metadataBase: new URL(siteUrl("http://localhost:3000")) };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
