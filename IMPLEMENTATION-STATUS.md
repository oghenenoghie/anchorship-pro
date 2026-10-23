# Implementation status

This ZIP is a substantial runnable-oriented starter scaffold, not a production-certified release.

## Implemented in this scaffold
- Public Next.js pages for homepage, about, services, vessels, vessel detail, equipment, projects, news, contact
- Neon/Drizzle relational schema and seed script for admin + categories
- Admin login/session, role-guarded dashboard, vessel listing view and vessel create flow
- Public enquiry persistence with validation and optional Resend-compatible notification
- Claude Code project instructions and six project-specific skills
- robots.txt, sitemap and environment template

## Verified during repository setup
- `npm install`, `npm run typecheck` and `npm run build` pass; initial migration generated as `drizzle/0000_init.sql`
- `npm run db:migrate` and `npm run db:seed` applied cleanly to PostgreSQL 16, and the seed is safe to re-run
- Production server tested end to end: enquiry validation/honeypot, admin login/logout, role-guarded vessel creation, duplicate-slug rejection, draft vessels hidden from public pages, audit events recorded
- Database-backed public pages render on demand, so newly published content appears without a rebuild

## Redesign (October 2026)
- Marine design system: tokens, Inter/Manrope typography, shared components, nine custom category illustrations, navy header with accessible Vessels dropdown and mobile menu, structured footer
- Homepage rebuilt around fleet search, the nine supplied vessel categories (live listing counts), featured vessels, services, process-based "Why Anchorship", conditional projects/news and a charter CTA
- Catalogue: search, category, region, availability, listing type, minimum length/deadweight, sorting, pagination and result counts; category pages at `/vessels/category/<slug>`; richer vessel detail pages with metadata
- Charter request flow at `/request-vessel` with vessel/category preselection, structured charter fields (migration 0002), field-level validation errors and server-confirmed reference numbers
- Admin visual refresh: role-aware sidebar, real metrics, filterable vessel and enquiry lists with mobile layouts, new read-only enquiry detail page, sectioned vessel editor
- Supplied categories inserted by migration 0003; earlier placeholder categories and their vessels are left untouched
- Unit tests (`npm test`) for categories, catalogue parameters and enquiry validation; verified end to end against PostgreSQL 16 through a local Neon HTTP shim

## Still required before production
- Connect a Neon database and run `npm run db:migrate` + `npm run db:seed` against it
- Add vessel deletion, vessel image upload/editing, and category management (the production Neon database has migrations 0002/0003 applied and its five unused placeholder categories were retired on 23 Oct 2026; other databases may still contain them), full CRUD for equipment/services/projects/articles, and enquiry status/assignment management
- Add production rate limiting, CSRF/origin policy, email retry queue, image upload integration, audit review UI, and automated tests
- Review all auth and database code; configure MFA/identity provider if needed
- Replace placeholder copy and image references with verified Anchorship-approved content and rights-cleared imagery; add approved contact details, office address, company history, privacy/legal pages and social links (none are published yet)
- Confirm the service list in `src/lib/company.ts` (Vessel Chartering, Marine Equipment, Vessel Brokerage, Ship Management) against current offerings
- Verify SEO redirects and existing URL preservation against the current live website

Do not deploy this scaffold to production without completing the above and a security review.
