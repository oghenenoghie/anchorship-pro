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
