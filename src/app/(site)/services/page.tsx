import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ship, Handshake, Cog, ClipboardList } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CategoryGrid } from "@/components/category-card";
import { getPublishedContent } from "@/lib/queries";
import { FALLBACK_SERVICES, SECTORS, SPECIALISATION, type ServiceIcon } from "@/lib/company";
import type { EnquiryType } from "@/lib/labels";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Services", description: "Vessel chartering, marine equipment, vessel brokerage and ship management enquiries for offshore and marine operations.", alternates: { canonical: "/services" } };
const ICONS: Record<ServiceIcon, typeof Ship> = { charter: Ship, brokerage: Handshake, equipment: Cog, management: ClipboardList };
const ENQUIRY_TYPE_FOR: Partial<Record<ServiceIcon, EnquiryType>> = { brokerage: "vessel_sale", equipment: "equipment" };

export default async function Services() {
  let rows: Awaited<ReturnType<typeof getPublishedContent>>["services"] = [];
  try { rows = (await getPublishedContent()).services; } catch {}
  const data = rows.length ? rows.map(r => ({ slug: r.slug, title: r.title, summary: r.summary, body: r.body, icon: undefined as ServiceIcon | undefined })) : FALLBACK_SERVICES.map(s => ({ ...s, body: null as string | null }));
  return (
    <>
      <PageHero eyebrow="Our services" title="Marine services shaped around your requirements." description="Explore service areas and contact our team to discuss scope, availability and next steps." breadcrumbs={[{ label: "Services" }]}>
        <Link href="/request-vessel" className="btn btn-primary">Request a Vessel <ArrowRight size={16} aria-hidden /></Link>
        <Link href="/contact" className="btn btn-light">Contact our team</Link>
      </PageHero>
      <section className="section-pad">
        <div className="container-wide">
          <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-2">
            {data.map(x => {
              const Icon = ICONS[x.icon ?? "charter"];
              const charter = x.icon === "charter";
              const href = charter ? "/request-vessel" : `/contact?subject=${encodeURIComponent(x.title)}&type=${ENQUIRY_TYPE_FOR[x.icon ?? "charter"] ?? "service"}`;
              return (
                <article key={x.slug} id={x.slug} className="flex scroll-mt-28 flex-col bg-white p-7 sm:p-8">
                  <span aria-hidden className="grid h-12 w-12 place-items-center rounded-[4px] bg-navy text-marine-300"><Icon size={22} strokeWidth={1.5} /></span>
                  <h2 className="mt-6 font-display text-xl font-bold">{x.title}</h2>
                  <p className="mt-3 text-[.95rem] leading-7 text-muted">{x.summary || "Contact our team to discuss this service."}</p>
                  {x.body && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-ink/90">{x.body}</p>}
                  <Link className="text-link mt-auto pt-6" href={href}>{charter ? "Request a vessel" : "Discuss this service"} <ArrowRight size={15} aria-hidden /></Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section aria-labelledby="sectors-title" className="border-y border-line bg-mist py-14">
        <div className="container-wide grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div><p className="eyebrow">Sectors</p><h2 id="sectors-title" className="mt-3 font-display text-2xl font-bold md:text-[1.75rem]">Who we work with</h2><p className="mt-3 leading-7 text-muted">{SPECIALISATION}</p></div>
          <ul className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">{SECTORS.map(s => <li key={s} className="flex items-center gap-3 bg-white px-5 py-4 text-sm font-semibold text-navy"><span aria-hidden className="h-1.5 w-1.5 rounded-full bg-marine" />{s}</li>)}</ul>
        </div>
      </section>
      <section aria-labelledby="fleet-title" className="section-pad">
        <div className="container-wide">
          <SectionHeading id="fleet-title" eyebrow="Vessel chartering" title="Vessel categories we charter" action={<Link href="/vessels" className="btn btn-outline">Fleet catalogue <ArrowRight size={16} aria-hidden /></Link>} />
          <div className="mt-10"><CategoryGrid /></div>
        </div>
      </section>
    </>
  );
}
