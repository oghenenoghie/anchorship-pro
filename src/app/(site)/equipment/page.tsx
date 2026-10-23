import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Cog } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EmptyState } from "@/components/empty-state";
import { getPublishedContent } from "@/lib/queries";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Marine and Offshore Equipment", description: "Browse published marine and offshore equipment or send us a specific equipment requirement.", alternates: { canonical: "/equipment" } };
const enquire = (name: string) => `/contact?type=equipment&subject=${encodeURIComponent(`Equipment enquiry: ${name}`)}`;
export default async function EquipmentPage() {
  let rows: Awaited<ReturnType<typeof getPublishedContent>>["equipment"] = [];
  let failed = false;
  try { rows = (await getPublishedContent()).equipment; } catch { failed = true; }
  return (
    <>
      <PageHero eyebrow="Equipment" title="Marine and offshore equipment." description="Browse published equipment records or contact us with a specific requirement." breadcrumbs={[{ label: "Equipment" }]} />
      <section className="bg-mist py-10 md:py-14">
        <div className="container-wide">
          {rows.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map(x => (
                <article key={x.id} className="card card-hover flex flex-col">
                  {x.imageUrl ? <img src={x.imageUrl} alt={x.name} loading="lazy" decoding="async" className="aspect-[16/10] w-full border-b border-line object-cover" /> : <div aria-hidden className="bg-blueprint grid aspect-[16/10] place-items-center border-b border-line text-ocean"><Cog size={36} strokeWidth={1.25} /></div>}
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="font-display text-lg font-bold">{x.name}</h2>
                    {x.summary && <p className="mt-2 text-sm leading-6 text-muted">{x.summary}</p>}
                    <Link href={enquire(x.name)} className="btn btn-outline btn-sm mt-auto w-fit">Request details <span className="sr-only">for {x.name}</span><ArrowRight size={15} aria-hidden /></Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState icon={<Cog size={24} />} title={failed ? "The equipment catalogue is temporarily unavailable" : "Equipment catalogue"} actions={<Link href="/contact?type=equipment" className="btn btn-primary">Make an equipment enquiry <ArrowRight size={16} aria-hidden /></Link>}>
              {failed ? "We could not load equipment records just now. You can still send us your equipment requirement." : "Published equipment records will appear here. In the meantime, tell us what equipment your operation needs."}
            </EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
