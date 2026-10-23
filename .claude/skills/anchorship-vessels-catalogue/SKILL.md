---
name: anchorship-vessels-catalogue
description: Build and maintain vessel/equipment catalogue, searchable listings, category pages, detail pages, images, availability, technical specs, and enquiry links.
---

# Catalogue implementation rules

## Vessel categories (business-supplied, fixed)

`src/lib/vessel-categories.ts` is the source of truth, in the supplied order:

1. FPSO, FDPSO and FSO (`fpso-fdpso-fso`) 2. Pipe and Cable Laying Vessels (`pipe-and-cable-laying-vessels`) 3. Tanker Vessels (`tanker-vessels`) 4. Tugboats and Towage (`tugboats-and-towage`) 5. Workboats (`workboats`) 6. Well Intervention (`well-intervention`) 7. Jack-up Rigs and Barges (`jack-up-rigs-and-barges`) 8. Pontoons (`pontoons`) 9. Dredgers (`dredgers`)

- Names are verbatim business terminology (keep "FDPSO"). Slugs are public URLs and match the rows inserted by migration `0003_supplied_vessel_categories`; changing one needs a redirect and a data migration.
- Each entry carries: illustration kind, short `summary` (cards), `description` (category page/meta), `particulars` (typed fields that matter: length, deadweight) and `keySpecs` (staff-entered specification labels to surface on cards, e.g. "Bollard pull" for tugs, "Dredging depth" for dredgers).
- Earlier placeholder categories (Offshore Support Vessel, Tug, Barge, Dredger, Tanker) may still exist in older databases with vessels assigned. They stay selectable under "Other categories" in the admin; never delete or remap them without approval.

## Routes

| Route | Purpose |
| --- | --- |
| `/vessels` (`vessels/(catalogue)`) | Full catalogue: search, filters, sort, pagination, category strip |
| `/vessels/category/[slug]` | Category page: illustration hero + catalogue fixed to the category. Unknown slug → 404 from the layout |
| `/vessels/category` | 308 to `/vessels` |
| `/vessels/[slug]` | Published vessel detail; drafts/archived → 404. Slug `category` is reserved (validation) |
| `/request-vessel?vessel=<slug>&category=<slug>` | Charter request with preselection (published, charter-capable vessels only) |

## Search and filters (`src/lib/catalogue.ts`, `searchPublishedVessels` in `src/lib/queries.ts`)

- Params: `q` (name/summary/slug, LIKE wildcards escaped), `category`, `region` (exact match on `location`; options come from published vessels only), `availability`, `listing` (`charter` includes `sale_or_charter`, `sale` likewise), `minLength`, `minDeadweight`, `sort` (featured, newest, name, length, deadweight), `page` (12 per page).
- Parsing is lenient: unknown values are dropped, never errors. Results show an exact count from a `count()` query.
- Every filter shown must work. Show relevance-aware filters only: deadweight is hidden on categories whose `particulars` omit it. Free-text specifications (bollard pull, dredging depth) are not filterable until they become typed columns; add a column + migration before exposing such a filter.
- Filters are GET forms (`GetForm`) and chips are links, so every state has a shareable URL and works without client JS.

## Listing and detail content

- Publication filtering is server-side (`status = 'published'`) in every public query, including counts, regions, related vessels and the sitemap.
- One row per vessel: the first image comes from a correlated subquery by `sort_order` (a join used to duplicate vessels per image).
- Cards show up to three particulars: the category's typed particulars that are present, then matching key specifications, then year built. Never estimate or fill missing values.
- With no photo, show the category illustration captioned "Category illustration", never as a photo of the vessel.
- Detail page sections: overview, principal particulars (only present fields), capabilities and equipment (staff specifications in order), listing status panel (availability, listing type, operating region, flag, year built), charter enquiry form linked to the vessel, related published vessels in the same category.
- Availability is staff-maintained and time-sensitive: display only the stored status and say availability is confirmed on enquiry.
- Metadata: per-page title/description, canonical URL, OpenGraph image when a vessel photo exists; sitemap lists static pages, the nine categories and published vessels (revalidated hourly).

## General rules

- Verify category names and required fields against approved business content.
- Store measurements as numeric values with explicit units and validate plausible ranges (`src/lib/vessel-limits.ts`).
- Keep listing status distinct from operational availability and listing type.
- Support image alt text, sort order, and authorised uploads via a configured storage provider (upload UI still to be built).
- Do not use stock or demo records as genuine inventory. Local test fixtures stay in scratch databases.
- Enquiry links preserve the vessel (id or slug) and category context.
- Tests: `src/lib/catalogue.test.ts`, `src/lib/vessel-categories.test.ts`. Add cases for new filters, sorts or categories.
