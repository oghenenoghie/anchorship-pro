---
name: anchorship-architecture
description: Plan and implement major architecture, routing, data models, integrations, and repository-wide changes for the Anchorship Next.js + Neon project.
---

# Anchorship architecture workflow

1. Inspect the existing repository and current git diff before editing.
2. Read `.claude/CLAUDE.md`, `README.md`, package scripts, schema, and related routes.
3. State assumptions and list affected routes, tables, components, integrations, and tests.
4. Prefer incremental changes and preserve current functionality and URLs.
5. For database changes, update Drizzle schema and generate a migration; explain safe rollout and backfill steps.
6. For new pages, follow the `anchorship-design-system` skill (navy/ocean/teal tokens, PageHero, shared components, marine illustrations, restrained motion, accessible contrast).
7. Keep server-only database/auth code out of client components. Pass server-rendered children or plain data into client components (icons as elements, never component functions).
8. Add validation and server-side role checks for every mutation and protected read.
9. Verify typecheck, tests, and production build; for behaviour changes, run the app against a database (see below).
10. Summarize files changed, commands run, results, and remaining work.

Never invent company facts or mark demo vessel records as real inventory.

## Map

```text
src/app/(site)/                 public pages (layout = SiteHeader + SiteFooter, error.tsx boundary)
  page.tsx                      homepage: hero, fleet search, 9 categories, featured vessels, services, why, stories, CTA
  vessels/(catalogue)/          /vessels catalogue (+ loading skeleton)
  vessels/category/[slug]/      category pages (layout 404s unknown slugs, + loading skeleton)
  vessels/[slug]/               vessel detail + charter form
  request-vessel/               charter request page
  services, about, equipment, projects, news, contact
src/app/(admin-auth)/admin/login  sign-in (outside the admin layout)
src/app/admin/                  admin console (layout requires a user; pages call requireRole; account/ = change own password)
src/app/api/                    enquiries, health, admin login/logout/vessels
src/components/                 shared UI (see design-system skill), catalogue/, admin/
src/lib/                        vessel-categories, catalogue, labels, company, queries, validation, auth, session-stamp, password-policy, admin-access, email
drizzle/                        versioned migrations (0002 enquiry charter details, 0003 supplied categories)
```

- `src/lib/company.ts` holds the only approved public company copy (description, specialisation, sectors, fallback services, contact email and office address). Add statements there only when the business supplies them. The office address is shown exactly as supplied; its house number and postcode are unconfirmed, so structured data carries only locality and country.
- Database-backed public pages are `force-dynamic` or use search params; they catch database errors and render designed error/empty states.

## Verification

- `npm run typecheck`, `npm test` (node:test via tsx, `src/**/*.test.ts`), `npm run build`.
- End-to-end without Neon: the app uses Neon's HTTP driver, so a plain Postgres needs a shim. A working pattern: a small Node HTTP server (outside the repo) that accepts `{query, params}` / `{queries: [...]}` on `/sql` and answers `{fields:[{name,dataTypeID}], rows:[[text...]], command, rowCount}` using `pg` with `rowMode: "array"` and raw text type parsers, plus a `--require` preload that rewrites `https://api.<host>/sql` fetches to it. Set `DATABASE_URL` to a host such as `db.localtest.me`, apply `drizzle/*.sql` with psql, seed with `npm run db:seed`, then `next start`.
- Check status codes (404 for drafts/unknown slugs, 308/307 redirects), filter counts against the data, role redirects for each admin role, and screenshots at 390/820/1280/1440px.
