import Link from "next/link";
import { ArrowRight, MapPin, Ship } from "lucide-react";
import type { VesselListing } from "@/lib/queries";
import { getVesselCategory, keySpecifications, type ParticularKey } from "@/lib/vessel-categories";
import { AVAILABILITY, LISTING_TYPE, canCharter, formatMeasure } from "@/lib/labels";
import { MarineIllustration } from "@/components/marine-illustration";
import { StatusIndicator } from "@/components/status-indicator";

// Up to three particulars that matter for the vessel's category and are actually recorded. Nothing is estimated.
export function cardParticulars({ vessel: v, categorySlug }: Pick<VesselListing, "vessel" | "categorySlug">) {
  const category = getVesselCategory(categorySlug);
  const typed: Record<ParticularKey, { label: string; value: string | null }> = { length: { label: "Length", value: formatMeasure(v.lengthMetres, "m") }, deadweight: { label: "Deadweight", value: formatMeasure(v.deadweightTonnes, "t") } };
  const keys: readonly ParticularKey[] = category?.particulars ?? ["length", "deadweight"];
  const items: { label: string; value: string }[] = [];
  for (const k of keys) { const { label, value } = typed[k]; if (value) items.push({ label, value }); }
  items.push(...keySpecifications(categorySlug, v.specifications, 3 - items.length));
  if (items.length < 3 && v.yearBuilt) items.push({ label: "Built", value: String(v.yearBuilt) });
  return items.slice(0, 3);
}

export function VesselCard({ listing, headingLevel = "h3" }: { listing: VesselListing; headingLevel?: "h2" | "h3" }) {
  const { vessel: v, category, categorySlug, image } = listing;
  const kind = getVesselCategory(categorySlug)?.illustration;
  const availability = AVAILABILITY[v.availabilityStatus];
  const particulars = cardParticulars(listing);
  const Heading = headingLevel;
  const href = `/vessels/${v.slug}`;
  return (
    <article className="card card-hover group flex flex-col">
      <Link href={href} tabIndex={-1} aria-hidden className="relative block aspect-[16/10] overflow-hidden border-b border-line bg-mist">
        {image ? <img src={image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          : <div className="bg-blueprint grid h-full place-items-center px-8">{kind ? <MarineIllustration kind={kind} /> : <Ship size={40} className="text-ocean" />}</div>}
        <span className="absolute left-3 top-3 rounded-[3px] bg-navy px-2 py-1 text-[.68rem] font-bold uppercase tracking-[.08em] text-white">{LISTING_TYPE[v.listingType]}</span>
        <StatusIndicator variant="pill" label={availability.label} tone={availability.tone} className="absolute right-3 top-3" />
        {!image && kind && <span className="absolute bottom-2 left-3 text-[.65rem] font-medium uppercase tracking-[.12em] text-muted">Category illustration</span>}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[.7rem] font-bold uppercase tracking-[.14em] text-ocean">{category ?? "Vessel"}</p>
        <Heading className="mt-2 font-display text-lg font-bold leading-snug"><Link href={href} className="hover:text-ocean">{v.name}</Link></Heading>
        {v.location && <p className="mt-2 flex items-center gap-1.5 text-sm text-muted"><MapPin aria-hidden size={14} className="shrink-0 text-ocean" />{v.location}</p>}
        {!particulars.length && v.summary && <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{v.summary}</p>}
        {particulars.length > 0 && (
          <dl className="mt-4 divide-y divide-line border-y border-line">
            {particulars.map(p => <div key={p.label} className="flex items-baseline justify-between gap-4 py-2"><dt className="text-[.8rem] text-muted">{p.label}</dt><dd className="text-right text-sm font-semibold text-navy">{p.value}</dd></div>)}
          </dl>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <Link href={href} className="text-link">Details <span className="sr-only">for {v.name}</span><ArrowRight aria-hidden size={15} /></Link>
          {canCharter(v.listingType)
            ? <Link href={`/request-vessel?vessel=${encodeURIComponent(v.slug)}`} className="btn btn-primary btn-sm">Request charter <span className="sr-only">for {v.name}</span></Link>
            : <Link href={`${href}#enquire`} className="btn btn-primary btn-sm">Enquire <span className="sr-only">about {v.name}</span></Link>}
        </div>
      </div>
    </article>
  );
}

export function VesselGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{children}</div>;
}
