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

## Still required before production
- Connect a Neon database and run `npm run db:migrate` + `npm run db:seed` against it
- Add vessel deletion and category, specification and image editing (the vessel form covers the core listing fields only), full CRUD for equipment/services/projects/articles, and enquiry status/assignment management
- Add production rate limiting, CSRF/origin policy, email retry queue, image upload integration, audit review UI, and automated tests
- Review all auth and database code; configure MFA/identity provider if needed
- Replace placeholder copy and image references with verified Anchorship-approved content and rights-cleared imagery
- Verify SEO redirects and existing URL preservation against the current live website

Do not deploy this scaffold to production without completing the above and a security review.
