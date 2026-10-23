import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VESSEL_CATEGORIES, type VesselCategory } from "@/lib/vessel-categories";
import { MarineIllustration } from "@/components/marine-illustration";

// One cell of the category grid. `count` is the number of published listings, or undefined when it could not be loaded.
export function MarineCategoryCard({ category, index, count, headingLevel = "h3" }: { category: VesselCategory; index: number; count?: number; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const countLabel = count === undefined ? null : count ? `${count} listed` : "On request";
  // Below sm: compact row (drawing beside the text) so nine categories do not become a very long scroll.
  return (
    <Link href={`/vessels/category/${category.slug}`} className="group relative grid grid-cols-[104px_minmax(0,1fr)] items-center gap-4 bg-white p-4 transition duration-300 ease-marine hover:z-10 hover:-translate-y-0.5 hover:shadow-lift focus-visible:z-10 sm:flex sm:flex-col sm:items-stretch sm:gap-0 sm:p-7">
      <div className="hidden items-center justify-between text-[.7rem] font-semibold uppercase tracking-[.14em] sm:flex">
        <span className="tabular-nums text-muted">{String(index + 1).padStart(2, "0")}</span>
        {countLabel && <span className={count ? "text-marine-700" : "text-muted"}>{countLabel}</span>}
      </div>
      <div className="bg-blueprint rounded-[4px] border border-line/70 px-1.5 py-2 transition-colors duration-300 group-hover:border-marine/40 group-hover:bg-marine-50/40 sm:mt-4 sm:px-4 sm:py-3">
        <MarineIllustration kind={category.illustration} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Heading className="font-display text-base font-bold leading-snug sm:mt-6 sm:text-lg">{category.name}</Heading>
        <p className="mt-1 line-clamp-2 text-[.8rem] leading-5 text-muted sm:mt-2 sm:line-clamp-none sm:text-sm sm:leading-6">{category.summary}</p>
        {countLabel && <span className={`mt-1.5 text-[.66rem] font-semibold uppercase tracking-[.12em] sm:hidden ${count ? "text-marine-700" : "text-muted"}`}>{countLabel}</span>}
        <span className="text-link mt-auto hidden pt-5 sm:inline-flex">Explore vessels <ArrowRight aria-hidden size={16} /></span>
      </div>
    </Link>
  );
}

// The nine-category grid with hairline dividers. With two columns nine cells leave a gap, so a call-to-action cell
// fills it on tablet widths only.
export function CategoryGrid({ counts }: { counts?: Record<string, number> }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {VESSEL_CATEGORIES.map((c, i) => <MarineCategoryCard key={c.slug} category={c} index={i} count={counts ? counts[c.slug] ?? 0 : undefined} />)}
      <div className="surface-dark hidden flex-col justify-between gap-6 p-7 sm:flex lg:hidden">
        <p className="font-display text-lg font-bold leading-snug">Not sure which category fits your operation?</p>
        <Link href="/request-vessel" className="btn btn-primary w-fit">Describe your requirement <ArrowRight size={16} aria-hidden /></Link>
      </div>
    </div>
  );
}
