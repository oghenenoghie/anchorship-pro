// Public catalogue query parameters. Parsing is lenient: unknown or malformed values are dropped rather than
// rejected, so shared or hand-edited URLs still render a sensible listing.
import { isVesselCategorySlug, type VesselCategorySlug } from "@/lib/vessel-categories";
import { AVAILABILITY } from "@/lib/labels";
import { VESSEL_LIMITS } from "@/lib/vessel-limits";

export const PAGE_SIZE = 12;
export const SORTS = { featured: "Featured first", newest: "Newest listings", name: "Name (A–Z)", length: "Length (longest first)", deadweight: "Deadweight (highest first)" } as const;
export type Sort = keyof typeof SORTS;
export type Availability = keyof typeof AVAILABILITY;
export type ListingFilter = "charter" | "sale";
export type CatalogueFilters = {
  q?: string; category?: VesselCategorySlug; region?: string; availability?: Availability; listing?: ListingFilter;
  minLength?: number; minDeadweight?: number; sort: Sort; page: number;
};
export type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
function positive(v: string | undefined, max: number) { if (!v) return undefined; const n = Number(v); return Number.isFinite(n) && n > 0 && n <= max ? n : undefined; }

export function parseCatalogueParams(params: SearchParams): CatalogueFilters {
  const q = first(params.q)?.slice(0, 120);
  const category = first(params.category);
  const availability = first(params.availability);
  const listing = first(params.listing);
  const sort = first(params.sort);
  const page = Math.floor(Number(first(params.page)));
  return {
    q, category: isVesselCategorySlug(category) ? category : undefined,
    region: first(params.region)?.slice(0, 200),
    availability: availability && availability in AVAILABILITY ? (availability as Availability) : undefined,
    listing: listing === "charter" || listing === "sale" ? listing : undefined,
    minLength: positive(first(params.minLength), VESSEL_LIMITS.lengthMetres.max),
    minDeadweight: positive(first(params.minDeadweight), VESSEL_LIMITS.deadweightTonnes.max),
    sort: sort && sort in SORTS ? (sort as Sort) : "featured",
    page: Number.isFinite(page) && page > 1 ? Math.min(page, 1000) : 1,
  };
}

// Query string for a filter state; defaults are omitted so canonical URLs stay short.
export function catalogueQuery(filters: Partial<CatalogueFilters>, omit: (keyof CatalogueFilters)[] = []) {
  const p = new URLSearchParams();
  for (const [key, value] of Object.entries(filters) as [keyof CatalogueFilters, unknown][]) {
    if (omit.includes(key) || value === undefined || value === "") continue;
    if (key === "sort" && value === "featured") continue;
    if (key === "page" && value === 1) continue;
    p.set(key, String(value));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function activeFilterCount(f: CatalogueFilters, ignore: (keyof CatalogueFilters)[] = []) {
  return (["q", "category", "region", "availability", "listing", "minLength", "minDeadweight"] as const).filter(k => !ignore.includes(k) && f[k] !== undefined).length;
}

// Escapes LIKE wildcards so a search for "100%" matches literally.
export function likePattern(term: string) { return `%${term.replace(/[\\%_]/g, c => `\\${c}`)}%`; }
