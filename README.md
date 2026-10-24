# Anchorship.nl — Next.js + Neon

A full-stack starter for an offshore and marine services website. The design direction uses Dutch Offshore Contractors as the primary reference and SeaSpeed Marine as a secondary reference; it does not copy their branding, text, or proprietary assets.

## Included

- Next.js App Router + TypeScript + Tailwind CSS, Inter + Manrope self-hosted with `next/font/local` (no network access needed at build time)
- Marine design system: navy/ocean/teal tokens, shared components and a custom SVG line-art illustration for each of the nine vessel categories (see `.claude/skills/anchorship-design-system`)
- Responsive charter-focused homepage, services, vessel catalogue with search/filters/sorting/pagination, nine category pages, vessel detail pages, charter request page, equipment catalogue, projects, news, contact
- Neon PostgreSQL schema with Drizzle ORM and migrations
- Admin sign-in, dashboard with live metrics, vessel management (filterable list, create/edit), enquiry inbox with filters and detail view, and a change-password page (`/admin/account`) for every role
- Server-side validation, signed session cookies, role checks, audit events
- Public contact/vessel enquiry endpoints and optional email notification hook
- Seed data marked as demo data
- Claude Code skills under `.claude/skills/`

## Requirements

- Node.js 20.9+
- Neon PostgreSQL database
- Optional email provider API key

## Quick start

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL` and `AUTH_SECRET`. `drizzle-kit` and the seed script load `.env.local` the same way Next.js does.
2. Install dependencies: `npm install`.
3. Apply the schema: `npm run db:migrate` (this also inserts the nine supplied vessel categories) (or `npm run db:push` for a disposable development database). The initial migration is committed in `drizzle/`; after changing `src/db/schema.ts`, run `npm run db:generate` and commit the new migration.
4. Create the first admin user by setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your local shell, then run `npm run db:seed`. Seed data is demonstrative; do not use demo credentials in production.
5. Run `npm run dev` and visit `http://localhost:3000`.
6. Run the checks: `npm run typecheck`, `npm test` and `npm run build`.

Example PowerShell setup:

```powershell
Copy-Item .env.example .env.local
$env:ADMIN_EMAIL = "admin@example.com"
$env:ADMIN_PASSWORD = "use-a-long-unique-password"
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

The seed script requires `DATABASE_URL` and reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` from the process environment. Set those variables again whenever you run the seed script to create/update the admin user. Signed-in users change their own password at `/admin/account`; re-running the seed is the way to reset a forgotten one. Either way, every session issued under the old password ends.

After deploying, open `/api/health` to check the configuration: it reports whether `DATABASE_URL`, the database (and its migrations), `AUTH_SECRET` and `NEXT_PUBLIC_SITE_URL` are usable, without revealing their values. Environment variable changes on Vercel only apply to new deployments, so redeploy after changing them.

## Run in GitHub Codespaces

The repository includes a dev container (`.devcontainer/devcontainer.json`): Node.js 22, dependencies installed with `npm ci` when the codespace is created, and port 3000 forwarded.

1. Add two Codespaces secrets, once: repository **Settings → Secrets and variables → Codespaces → New repository secret** (or your own [Codespaces settings](https://github.com/settings/codespaces), giving the secret access to this repository).
   - `DATABASE_URL`: the pooled Neon connection string of a development database or Neon branch. Avoid the live site's database: anything you change in the codespace changes it.
   - `AUTH_SECRET`: a random value of at least 32 characters (`openssl rand -base64 32`).
2. On the repository page choose **Code → Codespaces → Create codespace on main** and wait for `npm ci` to finish. Secrets added while a codespace is running only reach it after **Codespaces: Rebuild Container** (or a new codespace).
3. In the terminal run `npm run dev`, then open the forwarded port 3000 from the **Ports** tab (or the pop-up). Check `/api/health` first.
4. If the development database is new, apply the schema and create an admin user in the terminal:
   ```bash
   npm run db:migrate
   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-long-unique-password' npm run db:seed
   ```

Inside a codespace, `next.config.ts` trusts that codespace's forwarded address for Server Actions (sign-out, change password); without it Next.js rejects them as cross-origin. No extra origin is trusted anywhere else.

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
src/app/(site)       public routes (catalogue under vessels/, charter requests under request-vessel/)
src/app/admin        admin routes
src/app/api          public API routes
src/components       shared UI, marine illustrations, catalogue and admin components
src/db               schema, connection, seed
src/lib              vessel categories, catalogue params, labels, company copy, auth, validation, email, queries
.claude/skills       Claude Code project workflows
```

## Content and launch

Replace all demo vessel/project records with verified Anchorship content, verify current service offerings and contact details, confirm image rights, set canonical domain and redirects, then run `npm run typecheck` and `npm run build`. Do not present seed data as real available vessels.
