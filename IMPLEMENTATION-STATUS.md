# Implementation status

This ZIP is a substantial runnable-oriented starter scaffold, not a production-certified release.

## Implemented in this scaffold
- Public Next.js pages for homepage, about, services, vessels, vessel detail, equipment, projects, news, contact
- Neon/Drizzle relational schema and seed script for admin + categories
- Admin login/session, role-guarded dashboard, vessel listing view and vessel create flow
- Public enquiry persistence with validation and optional Resend-compatible notification
- Claude Code project instructions and six project-specific skills
- robots.txt, sitemap and environment template

## Still required before production
- Install dependencies and run migrations/typecheck/build in an environment with package registry access
- Complete edit/delete/publish workflows for vessels, full CRUD for equipment/services/projects/articles, and enquiry status/assignment management
- Add production rate limiting, CSRF/origin policy, email retry queue, image upload integration, audit review UI, and automated tests
- Review all auth and database code; configure MFA/identity provider if needed
- Replace placeholder copy and image references with verified Anchorship-approved content and rights-cleared imagery
- Verify SEO redirects and existing URL preservation against the current live website

Do not deploy this scaffold to production without completing the above and a security review.
