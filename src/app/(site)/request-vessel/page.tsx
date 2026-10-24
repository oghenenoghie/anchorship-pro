import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquiryForm } from "@/components/enquiry-form";
import { MarineIllustration } from "@/components/marine-illustration";
import { StatusIndicator } from "@/components/status-indicator";
import { getVesselBySlug } from "@/lib/queries";
import { getVesselCategory, isVesselCategorySlug } from "@/lib/vessel-categories";
import { AVAILABILITY, canCharter } from "@/lib/labels";
export const metadata: Metadata = { title: "Request a Vessel", description: "Send a charter enquiry for an offshore or marine vessel: tell us about your project, operational requirements and preferred charter period.", alternates: { canonical: "/request-vessel" } };

const STEPS = [
  { title: "Send your requirement", body: "Vessel type, operating region, charter period and any technical requirements you already know." },
  { title: "We review it", body: "Our team reviews your request against vessel suitability and availability." },
  { title: "We follow up", body: "We contact you using the details you provide to discuss options and next steps." },
];

type Search = { vessel?: string | string[]; category?: string | string[] };
export default async function RequestVessel({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const vesselSlug = typeof params.vessel === "string" ? params.vessel.slice(0, 220) : undefined;
  const categoryParam = typeof params.category === "string" ? params.category : undefined;
  // Only published vessels can be preselected; anything else falls back to a general charter request.
  const vessel = vesselSlug ? await getVesselBySlug(vesselSlug).catch(() => null) : null;
  const requestable = vessel && canCharter(vessel.listingType) ? vessel : null;
  const category = getVesselCategory(requestable?.categorySlug) ?? (isVesselCategorySlug(categoryParam) ? getVesselCategory(categoryParam) : undefined);
  return (
    <>
      <PageHero eyebrow="Charter enquiry" title="Request a vessel" description="Tell us about your project, operational requirements, and preferred charter period. Only the fields marked as required are needed to get started." breadcrumbs={[{ label: "Request a Vessel" }]} />
      <section className="bg-mist py-10 md:py-14">
        <div className="container-wide grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
          <div className="panel p-6 sm:p-8">
            <EnquiryForm variant="charter" vesselId={requestable?.id} vesselName={requestable?.name} defaultCategory={category?.slug} subject={requestable ? `Charter request: ${requestable.name}` : undefined} />
          </div>
          <aside className="grid content-start gap-5">
            {requestable && (
              <div className="panel overflow-hidden">
                <p className="border-b border-line bg-mist px-5 py-3 text-[.7rem] font-bold uppercase tracking-[.16em] text-muted">Requested vessel</p>
                <div className="p-5">
                  <p className="text-[.7rem] font-bold uppercase tracking-[.14em] text-ocean">{requestable.category ?? "Vessel"}</p>
                  <p className="mt-1 font-display text-lg font-bold text-navy">{requestable.name}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted"><StatusIndicator label={AVAILABILITY[requestable.availabilityStatus].label} tone={AVAILABILITY[requestable.availabilityStatus].tone} />{requestable.location && <span>{requestable.location}</span>}</div>
                  <Link href={`/vessels/${requestable.slug}`} className="text-link mt-4">View vessel details <ArrowUpRight size={15} aria-hidden /></Link>
                </div>
              </div>
            )}
            {!requestable && category && (
              <div className="panel p-5">
                <p className="text-[.7rem] font-bold uppercase tracking-[.16em] text-muted">Selected category</p>
                <div className="bg-blueprint mt-3 rounded-[4px] border border-line/70 p-3"><MarineIllustration kind={category.illustration} /></div>
                <p className="mt-3 font-display font-bold text-navy">{category.name}</p>
                <Link href={`/vessels/category/${category.slug}`} className="text-link mt-2">Browse listed vessels <ArrowUpRight size={15} aria-hidden /></Link>
              </div>
            )}
            <div className="panel p-5">
              <h2 className="text-[.72rem] font-bold uppercase tracking-[.16em] text-navy">What happens next</h2>
              <ol className="mt-4 grid gap-4">
                {STEPS.map((s, i) => <li key={s.title} className="flex gap-3"><span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-marine-300">{i + 1}</span><div><p className="text-sm font-semibold text-navy">{s.title}</p><p className="mt-0.5 text-sm leading-6 text-muted">{s.body}</p></div></li>)}
              </ol>
            </div>
            <p className="px-1 text-sm text-muted">Looking for equipment or another service? Use the <Link href="/contact" className="font-semibold text-ocean underline-offset-4 hover:underline">general contact form</Link>.</p>
          </aside>
        </div>
      </section>
    </>
  );
}
