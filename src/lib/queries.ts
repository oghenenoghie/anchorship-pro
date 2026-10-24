import { and, asc, count, desc, eq, ilike, inArray, isNotNull, ne, or, gte, sql, type SQL } from "drizzle-orm";
import { requireDb } from "@/db";
import { vessels, vesselCategories, vesselImages, services, projects, articles, equipment, enquiries } from "@/db/schema";
import { PAGE_SIZE, likePattern, type CatalogueFilters, type Sort } from "@/lib/catalogue";

const published = eq(vessels.status, "published");
// First image by sort order. A correlated subquery keeps one row per vessel; joining vessel_images returned one row per image.
const firstImage = (column: typeof vesselImages.url | typeof vesselImages.alt) => sql<string | null>`(select ${column} from ${vesselImages} where ${vesselImages.vesselId} = ${vessels.id} order by ${vesselImages.sortOrder}, ${vesselImages.createdAt} limit 1)`;
const listingColumns = { vessel: vessels, category: vesselCategories.name, categorySlug: vesselCategories.slug, image: firstImage(vesselImages.url), imageAlt: firstImage(vesselImages.alt) };
const SORT_ORDER: Record<Sort, SQL[]> = {
  featured: [desc(vessels.featured), sql`${vessels.publishedAt} desc nulls last`, desc(vessels.createdAt)],
  newest: [sql`${vessels.publishedAt} desc nulls last`, desc(vessels.createdAt)],
  name: [asc(vessels.name)],
  length: [sql`${vessels.lengthMetres} desc nulls last`, asc(vessels.name)],
  deadweight: [sql`${vessels.deadweightTonnes} desc nulls last`, asc(vessels.name)],
};

// Public catalogue search: published vessels only, filtered server-side, with an exact total for the results count.
export async function searchPublishedVessels(f: Partial<CatalogueFilters>, pageSize = PAGE_SIZE) {
  const db = requireDb();
  const conditions: SQL[] = [published];
  if (f.q) { const p = likePattern(f.q); conditions.push(or(ilike(vessels.name, p), ilike(vessels.summary, p), ilike(vessels.slug, p))!); }
  if (f.category) conditions.push(eq(vesselCategories.slug, f.category));
  if (f.region) conditions.push(eq(vessels.location, f.region));
  if (f.availability) conditions.push(eq(vessels.availabilityStatus, f.availability));
  if (f.listing) conditions.push(inArray(vessels.listingType, f.listing === "charter" ? ["charter", "sale_or_charter"] : ["sale", "sale_or_charter"]));
  if (f.minLength) conditions.push(gte(vessels.lengthMetres, f.minLength));
  if (f.minDeadweight) conditions.push(gte(vessels.deadweightTonnes, f.minDeadweight));
  const where = and(...conditions);
  const page = f.page ?? 1;
  const [rows, [{ total }]] = await Promise.all([
    db.select(listingColumns).from(vessels).leftJoin(vesselCategories, eq(vessels.categoryId, vesselCategories.id)).where(where)
      .orderBy(...SORT_ORDER[f.sort ?? "featured"], asc(vessels.id)).limit(pageSize).offset((page - 1) * pageSize),
    db.select({ total: count() }).from(vessels).leftJoin(vesselCategories, eq(vessels.categoryId, vesselCategories.id)).where(where),
  ]);
  return { rows, total, page, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
}
export type VesselListing = Awaited<ReturnType<typeof searchPublishedVessels>>["rows"][number];

export async function getFeaturedVessels(limit = 3) { return (await searchPublishedVessels({ sort: "featured" }, limit)).rows; }

// Operating regions actually used by published listings, for the region filter.
export async function getPublishedRegions(categorySlug?: string) {
  const db = requireDb();
  const conditions = [published, isNotNull(vessels.location), ne(vessels.location, "")];
  if (categorySlug) conditions.push(eq(vesselCategories.slug, categorySlug));
  const rows = await db.selectDistinct({ region: vessels.location }).from(vessels).leftJoin(vesselCategories, eq(vessels.categoryId, vesselCategories.id)).where(and(...conditions)).orderBy(vessels.location);
  return rows.map(r => r.region).filter((r): r is string => !!r);
}

// Published listings per category slug.
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const rows = await requireDb().select({ slug: vesselCategories.slug, total: count() }).from(vessels).innerJoin(vesselCategories, eq(vessels.categoryId, vesselCategories.id)).where(published).groupBy(vesselCategories.slug);
  return Object.fromEntries(rows.map(r => [r.slug, r.total]));
}

export async function getVesselBySlug(slug: string) {
  const db = requireDb();
  const [row] = await db.select({ vessel: vessels, category: vesselCategories.name, categorySlug: vesselCategories.slug }).from(vessels).leftJoin(vesselCategories, eq(vessels.categoryId, vesselCategories.id)).where(and(eq(vessels.slug, slug), published)).limit(1);
  if (!row) return null;
  const images = await db.select({ url: vesselImages.url, alt: vesselImages.alt }).from(vesselImages).where(eq(vesselImages.vesselId, row.vessel.id)).orderBy(asc(vesselImages.sortOrder), asc(vesselImages.createdAt));
  return { ...row.vessel, category: row.category, categorySlug: row.categorySlug, images };
}

export async function getRelatedVessels(vesselId: string, categoryId: string | null, limit = 3) {
  if (!categoryId) return [];
  return requireDb().select(listingColumns).from(vessels).leftJoin(vesselCategories, eq(vessels.categoryId, vesselCategories.id))
    .where(and(published, eq(vessels.categoryId, categoryId), ne(vessels.id, vesselId))).orderBy(...SORT_ORDER.featured, asc(vessels.id)).limit(limit);
}

export async function getPublishedVesselSlugs() {
  return requireDb().select({ slug: vessels.slug, updatedAt: vessels.updatedAt }).from(vessels).where(published);
}

export async function getPublishedContent(){const db=requireDb();const [serviceRows,projectRows,articleRows,equipmentRows]=await Promise.all([db.select().from(services).where(eq(services.status,"published")).orderBy(services.sortOrder),db.select().from(projects).where(eq(projects.status,"published")).orderBy(desc(projects.publishedAt)),db.select().from(articles).where(eq(articles.status,"published")).orderBy(desc(articles.publishedAt)),db.select().from(equipment).where(eq(equipment.status,"published")).orderBy(desc(equipment.createdAt))]);return {services:serviceRows,projects:projectRows,articles:articleRows,equipment:equipmentRows};}
export async function getVesselCategories(){return requireDb().select({id:vesselCategories.id,name:vesselCategories.name,slug:vesselCategories.slug}).from(vesselCategories).orderBy(vesselCategories.name);}
export async function vesselCategoryExists(id:string){const [row]=await requireDb().select({id:vesselCategories.id}).from(vesselCategories).where(eq(vesselCategories.id,id)).limit(1);return !!row;}

// Admin. Callers must check the session role before calling these.
export async function getAdminStats() {
  const db = requireDb();
  const when = (condition: SQL) => count(sql`case when ${condition} then 1 end`);
  const [[v], [e]] = await Promise.all([
    db.select({ vessels: count(), published: when(eq(vessels.status, "published")), drafts: when(eq(vessels.status, "draft")), available: when(and(eq(vessels.status, "published"), eq(vessels.availabilityStatus, "available"))!) }).from(vessels),
    db.select({ openEnquiries: when(sql`${enquiries.status} not in ('closed', 'spam')`), newEnquiries: when(eq(enquiries.status, "new")) }).from(enquiries),
  ]);
  return { ...v, ...e };
}

export async function getAdminVessels(f: { q?: string; status?: string; availability?: string; limit?: number } = {}) {
  const conditions: SQL[] = [];
  if (f.q) { const p = likePattern(f.q); conditions.push(or(ilike(vessels.name, p), ilike(vessels.slug, p))!); }
  if (f.status) conditions.push(eq(vessels.status, f.status as typeof vessels.$inferSelect.status));
  if (f.availability) conditions.push(eq(vessels.availabilityStatus, f.availability as typeof vessels.$inferSelect.availabilityStatus));
  return requireDb().select({ vessel: vessels, category: vesselCategories.name }).from(vessels).leftJoin(vesselCategories, eq(vessels.categoryId, vesselCategories.id)).where(conditions.length ? and(...conditions) : undefined).orderBy(desc(vessels.updatedAt)).limit(f.limit ?? 1000);
}

export async function getAdminEnquiries(f: { status?: string; type?: string; limit?: number } = {}) {
  const conditions: SQL[] = [];
  if (f.status) conditions.push(eq(enquiries.status, f.status as typeof enquiries.$inferSelect.status));
  if (f.type) conditions.push(eq(enquiries.type, f.type));
  return requireDb().select({ enquiry: enquiries, vesselName: vessels.name, categoryName: vesselCategories.name }).from(enquiries).leftJoin(vessels, eq(enquiries.vesselId, vessels.id)).leftJoin(vesselCategories, eq(enquiries.vesselCategoryId, vesselCategories.id))
    .where(conditions.length ? and(...conditions) : undefined).orderBy(desc(enquiries.createdAt)).limit(f.limit ?? 200);
}

export async function getEnquiryDetail(id: string) {
  const [row] = await requireDb().select({ enquiry: enquiries, vessel: { id: vessels.id, name: vessels.name, slug: vessels.slug, status: vessels.status }, categoryName: vesselCategories.name, equipmentName: equipment.name })
    .from(enquiries).leftJoin(vessels, eq(enquiries.vesselId, vessels.id)).leftJoin(vesselCategories, eq(enquiries.vesselCategoryId, vesselCategories.id)).leftJoin(equipment, eq(enquiries.equipmentId, equipment.id))
    .where(eq(enquiries.id, id)).limit(1);
  return row ?? null;
}
