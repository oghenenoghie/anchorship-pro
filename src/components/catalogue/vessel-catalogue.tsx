import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw, Search, X } from "lucide-react";
import { searchPublishedVessels, getPublishedRegions } from "@/lib/queries";
import { parseCatalogueParams, catalogueQuery, activeFilterCount, SORTS, PAGE_SIZE, type CatalogueFilters, type SearchParams } from "@/lib/catalogue";
import { VESSEL_CATEGORIES, getVesselCategory, type VesselCategory, type ParticularKey } from "@/lib/vessel-categories";
import { AVAILABILITY } from "@/lib/labels";
import { VesselCard, VesselGrid } from "@/components/vessel-card";
import { EmptyState } from "@/components/empty-state";
import { FiltersPanel } from "@/components/catalogue/filters-panel";
import { GetForm } from "@/components/get-form";

type Props = { searchParams: SearchParams; basePath: string; category?: VesselCategory };

// Searchable, filterable listing shared by /vessels and the category pages. Everything is a GET form and plain links,
// so filtering works without client JavaScript and every state has a shareable URL.
export async function VesselCatalogue({ searchParams, basePath, category }: Props) {
  const parsed = parseCatalogueParams(searchParams);
  const filters: CatalogueFilters = category ? { ...parsed, category: category.slug } : parsed;
  let result: Awaited<ReturnType<typeof searchPublishedVessels>> | null = null;
  let regions: string[] = [];
  try { [result, regions] = await Promise.all([searchPublishedVessels(filters), getPublishedRegions(category?.slug)]); } catch { result = null; }
  const fixed: (keyof CatalogueFilters)[] = category ? ["category"] : [];
  const active = activeFilterCount(filters, fixed);
  const href = (f: Partial<CatalogueFilters>) => `${basePath}${catalogueQuery(f, fixed)}`;
  const requestHref = `/request-vessel${filters.category ? `?category=${filters.category}` : ""}`;
  const showDeadweight = !category || (category.particulars as readonly ParticularKey[]).includes("deadweight");
  if (filters.region && !regions.includes(filters.region)) regions = [filters.region, ...regions];

  const chips: { label: string; key: keyof CatalogueFilters }[] = [];
  if (filters.q) chips.push({ key: "q", label: `“${filters.q}”` });
  if (filters.category && !category) chips.push({ key: "category", label: getVesselCategory(filters.category)!.name });
  if (filters.availability) chips.push({ key: "availability", label: AVAILABILITY[filters.availability].label });
  if (filters.listing) chips.push({ key: "listing", label: filters.listing === "charter" ? "For charter" : "For sale" });
  if (filters.region) chips.push({ key: "region", label: filters.region });
  if (filters.minLength) chips.push({ key: "minLength", label: `Length ≥ ${filters.minLength} m` });
  if (filters.minDeadweight) chips.push({ key: "minDeadweight", label: `Deadweight ≥ ${filters.minDeadweight} t` });

  return (
    <div className="grid gap-6 lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-10">
      <FiltersPanel activeCount={active}>
        <GetForm action={basePath} className="panel p-5" aria-labelledby="filters-title">
          <div className="flex items-center justify-between">
            <h2 id="filters-title" className="text-[.72rem] font-bold uppercase tracking-[.16em] text-navy">Refine results</h2>
            {active > 0 && <Link href={basePath} className="inline-flex items-center gap-1 text-xs font-semibold text-ocean hover:text-navy"><RotateCcw aria-hidden size={12} /> Reset</Link>}
          </div>
          <div className="mt-5 grid gap-4">
            <label className="label"><span>Vessel name or keyword</span><span className="relative"><Search aria-hidden size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input name="q" type="search" defaultValue={filters.q} maxLength={120} className="field pl-9" placeholder="Search listings" /></span></label>
            {!category && <label className="label"><span>Vessel category</span><select name="category" defaultValue={filters.category ?? ""} className="field"><option value="">All categories</option>{VESSEL_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>}
            <label className="label"><span>Availability</span><select name="availability" defaultValue={filters.availability ?? ""} className="field"><option value="">Any availability</option>{Object.entries(AVAILABILITY).map(([v, a]) => <option key={v} value={v}>{a.label}</option>)}</select></label>
            <label className="label"><span>Listing type</span><select name="listing" defaultValue={filters.listing ?? ""} className="field"><option value="">Charter or sale</option><option value="charter">Available for charter</option><option value="sale">Available for sale</option></select></label>
            {regions.length > 0 && <label className="label"><span>Operating region</span><select name="region" defaultValue={filters.region ?? ""} className="field"><option value="">All regions</option>{regions.map(r => <option key={r} value={r}>{r}</option>)}</select></label>}
            <fieldset className="grid gap-3 border-t border-line pt-4">
              <legend className="float-left mb-1 w-full text-[.84rem] font-semibold text-ink">Principal particulars</legend>
              <div className={`grid gap-3 ${showDeadweight ? "grid-cols-2" : ""}`}>
                <label className="label"><span className="label-hint">Min. length (m)</span><input name="minLength" type="number" inputMode="decimal" min={0} step="any" defaultValue={filters.minLength} className="field" /></label>
                {showDeadweight && <label className="label"><span className="label-hint"><abbr title="Deadweight" className="no-underline">Min. DWT</abbr> (t)</span><input name="minDeadweight" type="number" inputMode="decimal" min={0} step="any" defaultValue={filters.minDeadweight} className="field" /></label>}
              </div>
            </fieldset>
            <label className="label border-t border-line pt-4"><span>Sort by</span><select name="sort" defaultValue={filters.sort} data-default="featured" className="field">{Object.entries(SORTS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
            <button className="btn btn-dark w-full">Apply filters</button>
          </div>
        </GetForm>
      </FiltersPanel>

      <div className="min-w-0">
        {result && (
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-4">
            <p className="text-sm text-muted">
              {result.total > 0 && result.rows.length > 0
                ? <>Showing <strong className="text-navy">{(result.page - 1) * PAGE_SIZE + 1}–{(result.page - 1) * PAGE_SIZE + result.rows.length}</strong> of <strong className="text-navy">{result.total}</strong> {result.total === 1 ? "vessel" : "vessels"}</>
                : <><strong className="text-navy">0</strong> vessels</>}
            </p>
            <p className="text-sm text-muted">Sorted by {SORTS[filters.sort].charAt(0).toLowerCase() + SORTS[filters.sort].slice(1)}</p>
          </div>
        )}
        {chips.length > 0 && (
          <ul aria-label="Active filters" className="mt-4 flex flex-wrap gap-2">
            {chips.map(c => <li key={c.key}><Link href={href({ ...filters, [c.key]: undefined, page: 1 })} className="inline-flex items-center gap-1.5 rounded-[3px] border border-line bg-white px-2.5 py-1.5 text-xs font-semibold text-ink transition hover:border-navy">{c.label}<X aria-hidden size={13} /><span className="sr-only">Remove filter</span></Link></li>)}
          </ul>
        )}
        <div className="mt-6">
          {!result ? (
            <EmptyState illustration={category?.illustration ?? "tanker"} title="The catalogue is temporarily unavailable" actions={<><Link href={href(filters)} className="btn btn-outline">Try again</Link><Link href={requestHref} className="btn btn-primary">Request a Vessel</Link></>}>We could not load vessel listings just now. You can still send a charter request and our team will follow up.</EmptyState>
          ) : result.rows.length ? (
            <VesselGrid>{result.rows.map(row => <VesselCard key={row.vessel.id} listing={row} headingLevel="h2" />)}</VesselGrid>
          ) : result.total > 0 ? (
            <EmptyState title="This page has no results" actions={<Link href={href({ ...filters, page: 1 })} className="btn btn-outline">Back to the first page</Link>}>There are {result.total} matching vessels on earlier pages.</EmptyState>
          ) : active > 0 ? (
            <EmptyState illustration={category?.illustration ?? "workboat"} title="No vessels match these filters" actions={<><Link href={basePath} className="btn btn-outline">Clear all filters</Link><Link href={requestHref} className="btn btn-primary">Request a Vessel</Link></>}>Try widening your search, or tell us what you need and our team will look for a suitable vessel.</EmptyState>
          ) : (
            <EmptyState illustration={category?.illustration ?? "workboat"} title={category ? `No ${category.name.toLowerCase()} listings are published right now` : "No vessel listings are published right now"} actions={<><Link href={requestHref} className="btn btn-primary">Request {category ? "this vessel type" : "a vessel"} <ArrowRight size={16} aria-hidden /></Link><Link href="/contact" className="btn btn-outline">Contact our team</Link></>}>
              Verified listings appear here once our team publishes them. Send us your requirement, operating region and charter period and we will follow up.
            </EmptyState>
          )}
        </div>
        {result && result.pageCount > 1 && <Pagination page={result.page} pageCount={result.pageCount} href={p => href({ ...filters, page: p })} />}
      </div>
    </div>
  );
}

function Pagination({ page, pageCount, href }: { page: number; pageCount: number; href: (page: number) => string }) {
  const from = Math.max(1, Math.min(page - 2, pageCount - 4));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, i) => from + i);
  const step = "inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-[4px] border px-3 text-sm font-semibold transition";
  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? <Link href={href(page - 1)} rel="prev" className={`${step} border-line bg-white text-navy hover:border-navy`}><ArrowLeft aria-hidden size={15} />Previous</Link> : null}
      {pages.map(p => p === page ? <span key={p} aria-current="page" className={`${step} border-navy bg-navy text-white`}>{p}</span> : <Link key={p} href={href(p)} className={`${step} border-line bg-white text-navy hover:border-navy`}><span className="sr-only">Page </span>{p}</Link>)}
      {page < pageCount ? <Link href={href(page + 1)} rel="next" className={`${step} border-line bg-white text-navy hover:border-navy`}>Next<ArrowRight aria-hidden size={15} /></Link> : null}
    </nav>
  );
}
