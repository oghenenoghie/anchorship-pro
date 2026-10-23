import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { VesselCatalogue } from "@/components/catalogue/vessel-catalogue";
import { MarineIllustration } from "@/components/marine-illustration";
import { VESSEL_CATEGORIES, getVesselCategory } from "@/lib/vessel-categories";
import type { SearchParams } from "@/lib/catalogue";

type Params = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const category = getVesselCategory((await params).slug);
  if (!category) return { title: "Vessel category not found" };
  const title = `${category.name} for Charter`;
  return { title, description: category.description, alternates: { canonical: `/vessels/category/${category.slug}` }, openGraph: { title, description: category.description, url: `/vessels/category/${category.slug}` } };
}

export default async function VesselCategoryPage({ params, searchParams }: Params) {
  const category = getVesselCategory((await params).slug);
  if (!category) notFound();
  const index = VESSEL_CATEGORIES.indexOf(category);
  const others = VESSEL_CATEGORIES.filter(c => c.slug !== category.slug);
  return (
    <>
      <PageHero eyebrow={`Vessel category ${String(index + 1).padStart(2, "0")} / ${VESSEL_CATEGORIES.length}`} title={category.name} description={category.description} breadcrumbs={[{ label: "Vessels", href: "/vessels" }, { label: category.name }]}
        aside={<div className="mx-auto w-full max-w-[520px] rounded-md border border-white/[.12] bg-navy-800/50 px-5 py-6 sm:px-8"><MarineIllustration kind={category.illustration} tone="dark" title={`Line drawing representing ${category.name.toLowerCase()}`} /></div>}>
        <Link href={`/request-vessel?category=${category.slug}`} className="btn btn-primary">Request this vessel type <ArrowRight size={16} aria-hidden /></Link>
        <Link href="/vessels" className="btn btn-light">All vessel categories</Link>
      </PageHero>
      <section className="bg-mist py-10 md:py-14"><div className="container-wide"><VesselCatalogue searchParams={await searchParams} basePath={`/vessels/category/${category.slug}`} category={category} /></div></section>
      <section aria-labelledby="other-categories" className="border-t border-line py-14">
        <div className="container-wide">
          <h2 id="other-categories" className="font-display text-xl font-bold">Other vessel categories</h2>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {others.map(c => (
              <li key={c.slug} className="bg-white">
                <Link href={`/vessels/category/${c.slug}`} className="group flex h-full items-center gap-3 p-4 transition-colors hover:bg-mist">
                  <span className="bg-blueprint w-20 shrink-0 rounded-[3px] border border-line/70 p-1.5"><MarineIllustration kind={c.illustration} /></span>
                  <span className="text-sm font-semibold leading-snug text-navy group-hover:text-ocean">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
