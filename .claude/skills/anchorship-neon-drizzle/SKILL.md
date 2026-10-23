---
name: anchorship-neon-drizzle
description: Create and maintain Neon PostgreSQL schemas, Drizzle queries, migrations, seed data, indexes, and safe data workflows for Anchorship.
---

# Neon and Drizzle rules

- Review `src/db/schema.ts`, `src/db/index.ts`, and `drizzle.config.ts` first.
- Use explicit foreign keys, unique constraints, appropriate indexes, timestamps and deletion behavior.
- Use enums for controlled workflow states when the state set is stable.
- Use typed columns for attributes used for filtering/sorting; reserve JSONB for flexible specifications.
- Do not store image binaries in Postgres; store URLs and metadata.
- Keep application pooled connection and migration connection configuration distinct when required by Neon.
- Generate versioned migrations and inspect SQL before applying to production.
- Do not run destructive schema changes or seed fake production data without explicit approval.
- Use parameterised Drizzle queries; never interpolate user input into SQL strings.
- Add tests for unique slugs, publication visibility, foreign key behavior, and workflow state transitions.
- Reference data the application depends on (e.g. the nine supplied vessel categories) ships as an idempotent custom migration (`drizzle-kit generate --custom`, `INSERT ... ON CONFLICT DO NOTHING`), not only as seed data, so production gets it from `npm run db:migrate`. Keep `src/db/seed.ts` in step.
- Migrations so far: 0000 init, 0001 typed vessel particulars, 0002 enquiry charter details (nullable columns + FK to vessel_categories, `ON DELETE SET NULL`), 0003 supplied vessel categories. Test new migrations against a copy that contains pre-existing data, and re-run data migrations to prove idempotence.
- Escape `%`, `_` and `\` in user search terms before `ilike` (`likePattern()` in src/lib/catalogue.ts).
- Avoid one row per child record in listings: use correlated subqueries (first image) or aggregates instead of joins that multiply rows. Use `count()` queries for totals rather than loading tables into memory.
- Resolve optional foreign keys from untrusted input with subqueries in the insert (store NULL when the referenced row is missing or unpublished) instead of letting a foreign-key violation fail the request.

