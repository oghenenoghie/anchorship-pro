# Anchorship.nl — Next.js + Neon

A full-stack starter for an offshore and marine services website. The design direction uses Dutch Offshore Contractors as the primary reference and SeaSpeed Marine as a secondary reference; it does not copy their branding, text, or proprietary assets.

## Included

- Next.js App Router + TypeScript + Tailwind CSS
- Responsive corporate homepage, services, vessel catalogue/detail pages, equipment catalogue, projects, news, contact
- Neon PostgreSQL schema with Drizzle ORM and migrations
- Admin sign-in, dashboard, vessel management starter, enquiry management starter
- Server-side validation, signed session cookies, role checks, audit events
- Public contact/vessel enquiry endpoints and optional email notification hook
- Seed data marked as demo data
- Claude Code skills under `.claude/skills/`

## Requirements

- Node.js 20.9+
- Neon PostgreSQL database
- Optional email provider API key

## Quick start

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL` and `AUTH_SECRET`.
2. Install dependencies: `npm install`.
3. Generate and apply schema: `npm run db:generate` then `npm run db:migrate` (or `npm run db:push` for a disposable development database).
4. Create the first admin user by setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your local shell, then run `npm run db:seed`. Seed data is demonstrative; do not use demo credentials in production.
5. Run `npm run dev` and visit `http://localhost:3000`.

Example PowerShell setup:

```powershell
Copy-Item .env.example .env.local
$env:ADMIN_EMAIL = "admin@example.com"
$env:ADMIN_PASSWORD = "use-a-long-unique-password"
npm install
npm run db:push
npm run db:seed
npm run dev
```

The seed script requires `DATABASE_URL` and reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` from the process environment. Set those variables again whenever you run the seed script to create/update the admin user.

## Security notes before production

- Use a long random `AUTH_SECRET`; never commit `.env.local`.
- Configure production secrets in the hosting provider, not in source control.
- Review auth, cookie, rate-limit, spam, upload and email settings before launch.
- This starter uses signed JWT session cookies and bcrypt password hashes. For larger teams, consider a managed identity provider and MFA.
- Public image URLs are supported; actual direct-to-storage upload UI must be wired to your chosen storage provider before launch.
- Add a production-grade rate limiter (e.g. Upstash Redis or host-level WAF) before exposing enquiry endpoints publicly.
- Configure database backups/PITR in Neon and test recovery.
- Have a security review before production. This scaffold is not a substitute for one.

## Environment variables

See `.env.example`. `DATABASE_URL` should generally use Neon's pooled connection string for app traffic. `DATABASE_URL_MIGRATIONS` can be a direct connection string for migration tooling.

## Project layout

```text
src/app/(site)       public routes
src/app/admin        admin routes
src/app/api          public API routes
src/components       shared UI
src/db               schema, connection, seed
src/lib              auth, validation, email, queries
.claude/skills       Claude Code project workflows
```

## Content and launch

Replace all demo vessel/project records with verified Anchorship content, verify current service offerings and contact details, confirm image rights, set canonical domain and redirects, then run `npm run typecheck` and `npm run build`. Do not present seed data as real available vessels.
