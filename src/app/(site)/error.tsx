"use client";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
// Error boundary for public pages (for example a database outage on a vessel page). Keeps the site chrome and offers a retry.
export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="section-pad bg-mist">
      <div className="container-wide max-w-3xl">
        <EmptyState as="h2" illustration="tug" title="This page could not be loaded" actions={<><button type="button" onClick={reset} className="btn btn-outline"><RotateCcw size={16} aria-hidden /> Try again</button><Link href="/request-vessel" className="btn btn-primary">Request a Vessel</Link></>}>
          Something went wrong on our side. Please try again in a moment, or send us your requirement and our team will follow up.
        </EmptyState>
      </div>
    </section>
  );
}
