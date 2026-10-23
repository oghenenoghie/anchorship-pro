import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Flag, CalendarDays, Info } from "lucide-react";
import { getVesselBySlug, getRelatedVessels, type VesselListing } from "@/lib/queries";
import { getVesselCategory, isVesselCategorySlug } from "@/lib/vessel-categories";
import { AVAILABILITY, LISTING_TYPE, canCharter, formatMeasure } from "@/lib/labels";
import { PageHero } from "@/components/page-hero";
import { EnquiryForm } from "@/components/enquiry-form";
import { MarineIllustration } from "@/components/marine-illustration";
import { StatusIndicator } from "@/components/status-indicator";
import { VesselCard, VesselGrid } from "@/components/vessel-card";

type Params = { params: Promise<{ slug: string }> };
// Shared by generateMetadata and the page. Database errors propagate to the error boundary rather than becoming a 404.
const loadVessel = cache((slug: string) => getVesselBySlug(slug));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const v = await loadVessel((await params).slug).catch(() => null);
  if (!v) return { title: "Vessel not found" };
  const description = v.summary || `${v.category ?? "Vessel"} listing from Anchorship. Contact our team for verified specifications and current availability.`;
  const url = `/vessels/${v.slug}`;
  return { title: v.category ? `${v.name} | ${v.category}` : v.name, description, alternates: { canonical: url }, openGraph: { title: v.name, description, url, images: v.images[0] ? [{ url: v.images[0].url, alt: v.images[0].alt }] : undefined } };
}

export default async function VesselDetail({ params }: Params) {
  const v = await loadVessel((await params).slug);
  if (!v) notFound();
  const category = getVesselCategory(v.categorySlug);
  const availability = AVAILABILITY[v.availabilityStatus];
  const charter = canCharter(v.listingType);
  let related: VesselListing[] = [];
  try { related = await getRelatedVessels(v.id, v.categoryId); } catch {}
  const particulars = ([["Vessel category", v.category], ["Year built", v.yearBuilt?.toString()], ["Flag", v.flag], ["Length", formatMeasure(v.lengthMetres, "m")], ["Breadth", formatMeasure(v.breadthMetres, "m")], ["Deadweight", formatMeasure(v.deadweightTonnes, "tonnes")]] as [string, string | null | undefined][]).filter((p): p is [string, string] => !!p[1]);
  const [hero, ...gallery] = v.images;

  return (
    <>
      <PageHero eyebrow={v.category ?? "Vessel"} title={v.name} description={v.summary ?? undefined}
        breadcrumbs={[{ label: "Vessels", href: "/vessels" }, ...(v.category && isVesselCategorySlug(v.categorySlug) ? [{ label: v.category, href: `/vessels/category/${v.categorySlug}` }] : []), { label: v.name }]}>
        <Link href="#enquire" className="btn btn-primary">{charter ? "Request charter" : "Enquire about this vessel"} <ArrowRight size={16} aria-hidden /></Link>
        <Link href={category ? `/vessels/category/${category.slug}` : "/vessels"} className="btn btn-light">{category ? `More ${category.name.toLowerCase()}` : "Back to catalogue"}</Link>
      </PageHero>

      <section className="py-10 md:py-14">
        <div className="container-wide grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            {hero ? (
              <div className="grid gap-3">
                <img src={hero.url} alt={hero.alt} className="aspect-[16/10] w-full rounded-md border border-line object-cover" />
                {gallery.length > 0 && <ul aria-label="More images" className="grid grid-cols-3 gap-3 sm:grid-cols-4">{gallery.map((img, i) => <li key={`${img.url}-${i}`}><a href={img.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-[4px] border border-line"><img src={img.url} alt={img.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition duration-300 hover:scale-[1.03]" /><span className="sr-only"> (opens full-size image in a new tab)</span></a></li>)}</ul>}
              </div>
            ) : (
              <figure className="panel bg-blueprint px-6 py-8 sm:px-12">
                {category ? <MarineIllustration kind={category.illustration} /> : <div className="aspect-[2/1]" />}
                <figcaption className="mt-4 flex items-center gap-2 text-xs text-muted"><Info aria-hidden size={14} />{category ? "Category illustration, not a photograph of this vessel." : "No vessel images have been published."} Photographs are available on request.</figcaption>
              </figure>
            )}

            <div className="mt-10 grid gap-10">
              <section aria-labelledby="overview">
                <h2 id="overview" className="font-display text-2xl font-bold">Vessel overview</h2>
                <p className="mt-4 whitespace-pre-line leading-7 text-ink/90">{v.description || v.summary || "Further details are available on request from our team."}</p>
              </section>
              <section aria-labelledby="particulars">
                <h2 id="particulars" className="font-display text-2xl font-bold">Principal particulars</h2>
                {particulars.length ? <dl className="mt-5 grid overflow-hidden rounded-md border-x border-t border-line sm:grid-cols-2">{particulars.map(([label, value]) => <div key={label} className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-3.5 sm:odd:border-r sm:[&:last-child:nth-child(odd)]:col-span-2 sm:[&:last-child:nth-child(odd)]:border-r-0"><dt className="text-sm text-muted">{label}</dt><dd className="text-right text-sm font-semibold text-navy">{value}</dd></div>)}</dl>
                  : <p className="mt-3 text-muted">Principal particulars are available on request.</p>}
              </section>
              {v.specifications.length > 0 && (
                <section aria-labelledby="specifications">
                  <h2 id="specifications" className="font-display text-2xl font-bold">Capabilities and equipment</h2>
                  <dl className="mt-5 overflow-hidden rounded-md border border-line">{v.specifications.map((s, i) => <div key={i} className="grid gap-1 border-b border-line px-5 py-3.5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-6 even:bg-mist/60"><dt className="text-sm text-muted">{s.label}</dt><dd className="break-words text-sm font-semibold text-navy">{s.value}</dd></div>)}</dl>
                </section>
              )}
            </div>
          </div>

          <aside aria-label="Listing summary" className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
            <div className="panel overflow-hidden">
              <div className="border-b border-line bg-mist px-5 py-4"><p className="text-[.7rem] font-bold uppercase tracking-[.16em] text-muted">Listing status</p><div className="mt-2 flex flex-wrap items-center gap-3"><StatusIndicator label={availability.label} tone={availability.tone} className="text-sm" /><span className="rounded-[3px] bg-navy px-2 py-0.5 text-[.68rem] font-bold uppercase tracking-[.08em] text-white">{LISTING_TYPE[v.listingType]}</span></div></div>
              <dl className="grid gap-3 px-5 py-4 text-sm">
                {v.location && <div className="flex gap-3"><MapPin aria-hidden size={16} className="mt-0.5 shrink-0 text-ocean" /><div><dt className="text-muted">Operating region</dt><dd className="font-semibold text-navy">{v.location}</dd></div></div>}
                {v.flag && <div className="flex gap-3"><Flag aria-hidden size={16} className="mt-0.5 shrink-0 text-ocean" /><div><dt className="text-muted">Flag</dt><dd className="font-semibold text-navy">{v.flag}</dd></div></div>}
                {v.yearBuilt && <div className="flex gap-3"><CalendarDays aria-hidden size={16} className="mt-0.5 shrink-0 text-ocean" /><div><dt className="text-muted">Year built</dt><dd className="font-semibold text-navy">{v.yearBuilt}</dd></div></div>}
              </dl>
              <div className="grid gap-2 border-t border-line px-5 py-4">
                <Link href="#enquire" className="btn btn-primary w-full">{charter ? "Request charter" : "Enquire about this vessel"} <ArrowRight size={16} aria-hidden /></Link>
                <p className="text-xs leading-5 text-muted">Availability is confirmed by our team when you enquire.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="enquire" aria-labelledby="enquire-title" className="section-pad border-t border-line bg-mist">
        <div className="container-wide grid gap-10 lg:grid-cols-[.8fr_1.4fr] lg:gap-14">
          <div>
            <p className="eyebrow">{charter ? "Charter enquiry" : "Vessel enquiry"}</p>
            <h2 id="enquire-title" className="mt-3 font-display text-[1.75rem] font-bold leading-tight md:text-[2.125rem]">{charter ? `Request ${v.name}` : `Enquire about ${v.name}`}</h2>
            <p className="mt-4 leading-7 text-muted">Tell us about your project, operational requirements{charter ? " and preferred charter period" : ""}. Your enquiry is linked to this listing so our team has the context when they follow up.</p>
          </div>
          <div className="panel p-6 sm:p-8">
            {charter ? <EnquiryForm variant="charter" vesselId={v.id} vesselName={v.name} defaultCategory={category?.slug} subject={`Charter request: ${v.name}`} />
              : <EnquiryForm type="vessel_sale" vesselId={v.id} subject={`Enquiry about ${v.name}`} />}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="section-pad">
          <div className="container-wide">
            <h2 id="related-title" className="font-display text-[1.75rem] font-bold">More {v.category?.toLowerCase() ?? "vessels"}</h2>
            <div className="mt-8"><VesselGrid>{related.map(r => <VesselCard key={r.vessel.id} listing={r} />)}</VesselGrid></div>
          </div>
        </section>
      )}
    </>
  );
}
