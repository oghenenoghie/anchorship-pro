import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CategoryGrid } from "@/components/category-card";
import { SECTORS, SPECIALISATION } from "@/lib/company";
export const metadata: Metadata = { title: "About Anchorship", description: "Anchorship charters offshore vessels and marine equipment for offshore energy, oil and gas, dredging and marine construction operations.", alternates: { canonical: "/about" } };
const APPROACH = [
  { title: "Understand the operation", body: "Every charter starts with the work: scope, location, period and the technical requirements the vessel has to meet." },
  { title: "Match the right vessel type", body: "Nine dedicated categories keep requirements specific, from tugs and workboats to FPSOs, jack-ups and dredgers." },
  { title: "Communicate clearly", body: "Clear conversations and verified information, so decisions are made on facts rather than assumptions." },
];
// Company history, certifications, team and office locations: add here once the approved copy is available.
export default function About() {
  return (
    <>
      <PageHero eyebrow="About Anchorship" title="A marine partner focused on practical solutions." description="Learn about our approach to marine and offshore opportunities, service and client communication." breadcrumbs={[{ label: "About" }]} />
      <section className="section-pad">
        <div className="container-wide grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <div><p className="eyebrow">Our approach</p><h2 className="mt-3 font-display text-[1.75rem] font-bold leading-tight md:text-[2.125rem]">Clear conversations. Informed decisions.</h2></div>
          <div className="space-y-5 text-[1.0625rem] leading-8 text-muted">
            <p>{SPECIALISATION}</p>
            <p>Anchorship connects visitors with marine and offshore service information, vessel opportunities and equipment enquiries, with a single route for charter requests across nine vessel categories.</p>
            <ul className="flex flex-wrap gap-2 pt-2">{SECTORS.map(s => <li key={s} className="rounded-[3px] border border-line px-3 py-1.5 text-xs font-semibold text-ink">{s}</li>)}</ul>
          </div>
        </div>
        <div className="container-wide mt-14">
          <ol className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3">
            {APPROACH.map((a, i) => <li key={a.title} className="bg-white p-7"><span className="text-xs font-semibold tabular-nums tracking-[.14em] text-muted">{String(i + 1).padStart(2, "0")}</span><h3 className="mt-4 font-display text-lg font-bold">{a.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{a.body}</p></li>)}
          </ol>
        </div>
      </section>
      <section aria-labelledby="fleet-title" className="section-pad border-t border-line bg-mist">
        <div className="container-wide">
          <SectionHeading id="fleet-title" eyebrow="Vessel categories" title="The vessels we charter" action={<Link href="/request-vessel" className="btn btn-primary">Request a Vessel <ArrowRight size={16} aria-hidden /></Link>} />
          <div className="mt-10"><CategoryGrid /></div>
        </div>
      </section>
    </>
  );
}
