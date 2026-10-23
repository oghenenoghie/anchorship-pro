# Anchorship project instructions

You are working on the Anchorship.nl marine/offshore website. Read `README.md` and the relevant skill in `.claude/skills/` before implementing substantial work.

## Product direction
- Primary visual reference: Dutch Offshore Contractors.
- Secondary visual reference: SeaSpeed Marine.
- Create original layouts and copy. Never copy another site's proprietary text, branding, or images.
- Preserve existing user changes and business data.
- Do not invent vessels, specifications, certifications, project history, availability, office addresses, or company claims.
- Vessel categories are the nine supplied by the business (`src/lib/vessel-categories.ts`); UI work follows `.claude/skills/anchorship-design-system`.

## Engineering standards
- Next.js App Router + strict TypeScript + Tailwind CSS.
- Neon PostgreSQL through Drizzle ORM; use schema migrations for database changes.
- Validate all untrusted input with Zod on the server.
- Enforce authorisation at every protected server mutation and data access boundary.
- Keep secrets server-side and never expose credentials through `NEXT_PUBLIC_*`.
- Use accessible semantic HTML, responsive layouts, meaningful empty/error/loading states and useful metadata.
- Prefer Server Components; add client components only for interactions that need them.
- Use transactions when a multi-step write must be atomic.
- Add or update tests for business-critical behavior.

## Definition of done
Run `npm run typecheck`, `npm test`, and `npm run build` when possible. Report what was run, what passed, and any remaining risks. Do not claim a task is complete if it is only a UI placeholder.
