import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, Ship, Handshake, Cog, ClipboardList, Layers, ListChecks, ShieldCheck, MessagesSquare } from "lucide-react";
import { getFeaturedVessels, getPublishedContent, getCategoryCounts, getPublishedRegions, type VesselListing } from "@/lib/queries";
import { VESSEL_CATEGORIES } from "@/lib/vessel-categories";
import { AVAILABILITY, formatDate } from "@/lib/labels";
import { CONTACT, FALLBACK_SERVICES, SECTORS, type ServiceIcon } from "@/lib/company";
import { siteUrl } from "@/lib/site-url";
import { VesselCard, VesselGrid } from "@/components/vessel-card";
import { CategoryGrid } from "@/components/category-card";
import { SectionHeading } from "@/components/section-heading";
import { EmptyState } from "@/components/empty-state";
import { HeroVisual } from "@/components/hero-visual";
import { GetForm } from "@/components/get-form";
import { MarineIllustration } from "@/components/marine-illustration";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { alternates: { canonical: "/" } };

const SERVICE_ICONS: Record<ServiceIcon, typeof Ship> = { charter: Ship, brokerage: Handshake, equipment: Cog, management: ClipboardList };
// Strengths describe how the platform and enquiry process work, not unverifiable performance claims.
const STRENGTHS = [
  { icon: Layers, title: "Category-specific sourcing", body: "Nine dedicated vessel categories, from tugs and workboats to FPSOs and jack-ups, so requirements are matched to the right type of vessel from the start." },
  { icon: ListChecks, title: "Technical suitability first", body: "Charter requests capture your operating region, charter period and technical requirements, so options are assessed against the work, not just availability." },
  { icon: ShieldCheck, title: "Verified listing information", body: "Specifications and availability on this site are entered by our team. Where a figure has not been verified, it is not shown." },
  { icon: MessagesSquare, title: "One point of contact", body: "A single enquiry route for vessels, equipment and charter questions, with a reference number for every request you submit." },
];

export default async function HomePage() {
  let featured: VesselListing[] = [];
  let content: Awaited<ReturnType<typeof getPublishedContent>> = { services: [], projects: [], articles: [], equipment: [] };
  let counts: Record<string, number> | undefined;
  let regions: string[] = [];
  let catalogueOffline = false;
  try { [featured, content, counts, regions] = await Promise.all([getFeaturedVessels(3), getPublishedContent(), getCategoryCounts(), getPublishedRegions()]); } catch { catalogueOffline = true; }
  const services = content.services.length ? content.services.map(s => ({ slug: s.slug, title: s.title, summary: s.summary, icon: undefined as ServiceIcon | undefined })) : FALLBACK_SERVICES;
  const stories = [...content.projects.slice(0, 2).map(p => ({ kind: "Project", title: p.title, summary: p.summary, image: p.imageUrl, date: p.publishedAt, href: "/projects" })), ...content.articles.slice(0, 2).map(a => ({ kind: "News", title: a.title, summary: a.excerpt, image: a.coverImageUrl, date: a.publishedAt, href: "/news" }))].slice(0, 3);
  // The street line is left out until the house number and postcode are confirmed (see CONTACT in src/lib/company.ts).
  const orgJsonLd = { "@context": "https://schema.org", "@type": "Organization", name: "Anchorship", url: siteUrl(), email: CONTACT.email, address: { "@type": "PostalAddress", addressLocality: CONTACT.office.locality, addressCountry: CONTACT.office.countryCode } };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      {/* A · Hero */}
      <section className="surface-dark relative isolate overflow-hidden">
        <div aria-hidden className="bg-blueprint-dark absolute inset-0 -z-10" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_40%,rgba(34,166,161,.14),transparent_55%)]" />
        <div className="container-wide grid items-center gap-12 pb-32 pt-14 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-40 lg:pt-24">
          <div>
            <p className="eyebrow">Offshore vessel charter</p>
            <h1 className="mt-5 font-display text-[2.35rem] font-extrabold uppercase leading-[1.02] tracking-[-.01em] sm:text-5xl xl:text-[3.6rem]">
              Offshore vessels.<span className="mt-1 block text-marine-300">Ready for your next operation.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-on-dark md:text-lg md:leading-8">Connecting offshore operators with marine vessel charter solutions for demanding projects across energy, marine construction, and offshore operations.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/vessels" className="btn btn-primary">Explore Our Fleet <ArrowRight size={16} aria-hidden /></Link>
              <Link href="/request-vessel" className="btn btn-light">Request a Vessel</Link>
            </div>
            <div className="mt-12 border-t border-white/10 pt-5">
              <p className="text-[.68rem] font-bold uppercase tracking-[.16em] text-on-dark">Supporting</p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white">{SECTORS.map(s => <li key={s} className="flex items-center gap-2"><span aria-hidden className="h-1 w-1 rounded-full bg-marine" />{s}</li>)}</ul>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* C · Fleet discovery: a GET form onto the catalogue, which implements every field below */}
      <section aria-labelledby="discover-title" className="relative z-10 -mt-20 lg:-mt-24">
        <div className="container-wide">
          <div className="panel p-6 shadow-lift sm:p-8">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <div><h2 id="discover-title" className="font-display text-2xl font-bold md:text-[1.75rem]">Explore Our Marine Fleet</h2><p className="mt-2 text-sm text-muted md:text-base">Specialized vessel charter solutions for offshore, energy, and marine operations.</p></div>
              <Link href="/vessels" className="text-link shrink-0">Browse all vessels <ArrowRight size={15} aria-hidden /></Link>
            </div>
            <GetForm action="/vessels" role="search" aria-label="Search vessels" className={`mt-6 grid gap-3 sm:grid-cols-2 ${regions.length ? "lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]" : "lg:grid-cols-[1.6fr_1fr_1fr_auto]"}`}>
              <label className="label sm:col-span-2 lg:col-span-1"><span>Vessel name or keyword</span><span className="relative"><Search aria-hidden size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input name="q" type="search" className="field pl-10" placeholder="e.g. tug, DP2, pontoon" /></span></label>
              <label className="label"><span>Vessel category</span><select name="category" className="field" defaultValue=""><option value="">All categories</option>{VESSEL_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
              {regions.length > 0 && <label className="label"><span>Operating region</span><select name="region" className="field" defaultValue=""><option value="">All regions</option>{regions.map(r => <option key={r} value={r}>{r}</option>)}</select></label>}
              <label className="label"><span>Availability</span><select name="availability" className="field" defaultValue=""><option value="">Any availability</option>{Object.entries(AVAILABILITY).map(([value, a]) => <option key={value} value={value}>{a.label}</option>)}</select></label>
              <div className="flex items-end sm:col-span-2 lg:col-span-1"><button className="btn btn-dark w-full lg:w-auto"><Search size={16} aria-hidden /> Search fleet</button></div>
            </GetForm>
          </div>
        </div>
      </section>

      {/* D · Nine vessel categories */}
      <section aria-labelledby="categories-title" className="section-pad">
        <div className="container-wide">
          <SectionHeading id="categories-title" eyebrow="Vessel categories" title="Nine categories. One charter route." description="From harbour tugs to floating production units, browse by vessel type to see published listings and the operations each category supports." action={<Link href="/vessels" className="btn btn-outline">View full catalogue <ArrowRight size={16} aria-hidden /></Link>} />
          <div className="mt-10"><CategoryGrid counts={counts} /></div>
        </div>
      </section>

      {/* E · Featured vessels */}
      <section aria-labelledby="featured-title" className="section-pad border-y border-line bg-mist">
        <div className="container-wide">
          <SectionHeading id="featured-title" eyebrow="Fleet catalogue" title="Featured vessels" description="Published listings maintained by the Anchorship team. Specifications and availability are shown only where they have been verified." action={featured.length ? <Link href="/vessels" className="btn btn-outline">View all vessels <ArrowRight size={16} aria-hidden /></Link> : undefined} />
          <div className="mt-10">
            {featured.length ? <VesselGrid>{featured.map(row => <VesselCard key={row.vessel.id} listing={row} />)}</VesselGrid>
              : <EmptyState illustration="workboat" title={catalogueOffline ? "The vessel catalogue is temporarily unavailable" : "Tell us what your operation needs"} actions={<><Link href="/request-vessel" className="btn btn-primary">Request a Vessel <ArrowRight size={16} aria-hidden /></Link><Link href="/contact" className="btn btn-outline">Contact our team</Link></>}>
                  {catalogueOffline ? "We could not load listings just now. You can still send a charter request and our team will follow up." : "Verified listings are published here as they become available. In the meantime, send us your vessel requirement and charter period and our team will follow up."}
                </EmptyState>}
          </div>
        </div>
      </section>

      {/* F · Services and operations */}
      <section aria-labelledby="services-title" className="section-pad">
        <div className="container-wide grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading id="services-title" eyebrow="Services" title="Charter and marine services" description="Vessel and equipment solutions for offshore energy, oil and gas, dredging and marine construction operations." />
            <ul className="mt-8 flex flex-wrap gap-2">{SECTORS.map(s => <li key={s} className="rounded-[3px] border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink">{s}</li>)}</ul>
            <Link href="/services" className="btn btn-outline mt-8">All services <ArrowRight size={16} aria-hidden /></Link>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
            {services.map(s => {
              const Icon = SERVICE_ICONS[s.icon ?? "charter"];
              return (
                <li key={s.slug} className="bg-white">
                  <Link href={`/services#${s.slug}`} className="group flex h-full flex-col p-6 transition-colors hover:bg-mist">
                    <span aria-hidden className="grid h-11 w-11 place-items-center rounded-[4px] border border-line text-ocean transition-colors group-hover:border-marine group-hover:text-marine-700"><Icon size={21} strokeWidth={1.5} /></span>
                    <h3 className="mt-5 font-display text-lg font-bold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{s.summary || "Contact our team to discuss this service."}</p>
                    <span className="text-link mt-auto pt-4">Learn more <ArrowRight size={15} aria-hidden /></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* G · Why Anchorship */}
      <section aria-labelledby="why-title" className="section-pad border-t border-line bg-mist">
        <div className="container-wide">
          <SectionHeading id="why-title" eyebrow="Why Anchorship" title="A clear route from requirement to vessel" description="A charter platform built around how offshore procurement teams actually specify vessels." />
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STRENGTHS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="panel relative flex flex-col p-6">
                <div className="flex items-center justify-between"><span aria-hidden className="grid h-10 w-10 place-items-center rounded-[4px] bg-navy text-marine-300"><Icon size={19} strokeWidth={1.6} /></span><span className="text-xs font-semibold tabular-nums tracking-[.14em] text-muted">{String(i + 1).padStart(2, "0")}</span></div>
                <h3 className="mt-6 font-display text-base font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* I · Projects and news, only when approved content is published */}
      {stories.length > 0 && (
        <section aria-labelledby="stories-title" className="section-pad">
          <div className="container-wide">
            <SectionHeading id="stories-title" eyebrow="Projects & news" title="Latest from Anchorship" action={<div className="flex gap-3"><Link href="/projects" className="btn btn-outline">Projects</Link><Link href="/news" className="btn btn-outline">News</Link></div>} />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {stories.map(s => (
                <article key={`${s.kind}-${s.title}`} className="card card-hover flex flex-col">
                  {s.image ? <img src={s.image} alt="" loading="lazy" decoding="async" className="aspect-[16/9] w-full border-b border-line object-cover" /> : <div aria-hidden className="bg-blueprint aspect-[16/9] border-b border-line" />}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[.7rem] font-bold uppercase tracking-[.14em] text-ocean">{s.kind}{s.date ? <span className="font-medium text-muted"> · {formatDate(s.date)}</span> : null}</p>
                    <h3 className="mt-2 font-display text-lg font-bold leading-snug">{s.title}</h3>
                    {s.summary && <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{s.summary}</p>}
                    <Link href={s.href} className="text-link mt-auto pt-4">Read more <span className="sr-only">: {s.title}</span><ArrowRight size={15} aria-hidden /></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* H · Charter enquiry call to action */}
      <section aria-labelledby="cta-title" className="surface-dark relative isolate overflow-hidden">
        <div aria-hidden className="bg-blueprint-dark absolute inset-0 -z-10 opacity-70" />
        <div className="container-wide grid items-center gap-10 py-16 md:py-20 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">Charter enquiry</p>
            <h2 id="cta-title" className="mt-4 max-w-2xl font-display text-[1.9rem] font-extrabold leading-tight md:text-[2.5rem]">Looking for the Right Vessel for Your Operation?</h2>
            <p className="mt-4 max-w-xl text-on-dark md:text-lg">Tell us about your project, operational requirements, and preferred charter period.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/request-vessel" className="btn btn-primary">Request a Vessel <ArrowRight size={16} aria-hidden /></Link><Link href="/contact" className="btn btn-light">Contact our team</Link></div>
          </div>
          <div aria-hidden className="hidden gap-4 lg:grid lg:grid-cols-3">
            {(["tug", "jack-up", "dredger"] as const).map(k => <div key={k} className="rounded-[4px] border border-white/10 bg-navy-800/60 p-3"><MarineIllustration kind={k} tone="dark" /></div>)}
          </div>
        </div>
      </section>
    </>
  );
}
