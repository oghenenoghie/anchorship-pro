import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { VesselCatalogue } from "@/components/catalogue/vessel-catalogue";
import { MarineIllustration } from "@/components/marine-illustration";
import { VESSEL_CATEGORIES } from "@/lib/vessel-categories";
import type { SearchParams } from "@/lib/catalogue";
export const metadata: Metadata = { title: "Vessel Catalogue: Offshore Vessels for Charter", description: "Search published offshore and marine vessel listings by category, operating region, availability and principal particulars, and send a charter enquiry.", alternates: { canonical: "/vessels" } };
export default async function Vessels({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  return (
    <>
      <PageHero eyebrow="Fleet catalogue" title="Explore our marine fleet" description="Search published vessel listings by category, operating region, availability and particulars. Our team confirms specifications and current availability with every enquiry." breadcrumbs={[{ label: "Vessels" }]}>
        <Link href="/request-vessel" className="btn btn-primary">Request a Vessel <ArrowRight size={16} aria-hidden /></Link>
      </PageHero>
      <nav aria-label="Vessel categories" className="border-b border-line bg-white">
        <ul className="container-wide flex snap-x scroll-px-4 gap-2 overflow-x-auto py-3 [scrollbar-width:thin] sm:scroll-px-6 lg:scroll-px-8">
          {VESSEL_CATEGORIES.map(c => (
            <li key={c.slug} className="shrink-0 snap-start">
              <Link href={`/vessels/category/${c.slug}`} className="group flex items-center gap-2.5 rounded-[4px] border border-line px-2.5 py-1.5 text-[.8rem] font-semibold text-navy transition hover:border-navy">
                <span className="w-11"><MarineIllustration kind={c.illustration} /></span>{c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="bg-mist py-10 md:py-14"><div className="container-wide"><VesselCatalogue searchParams={params} basePath="/vessels" /></div></section>
    </>
  );
}
