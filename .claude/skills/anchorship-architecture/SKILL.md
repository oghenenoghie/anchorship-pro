---
name: anchorship-architecture
description: Plan and implement major architecture, routing, data models, integrations, and repository-wide changes for the Anchorship Next.js + Neon project.
---

# Anchorship architecture workflow

1. Inspect the existing repository and current git diff before editing.
2. Read `.claude/CLAUDE.md`, `README.md`, package scripts, schema, and related routes.
3. State assumptions and list affected routes, tables, components, integrations, and tests.
4. Prefer incremental changes and preserve current functionality.
5. For database changes, update Drizzle schema and generate a migration; explain safe rollout and backfill steps.
6. For new pages, follow the marine corporate design system: deep navy, ocean blue, white, light neutral backgrounds, restrained motion, strong photography, and accessible contrast.
7. Keep server-only database/auth code out of client components.
8. Add validation and server-side role checks for every mutation.
9. Verify typecheck, tests, lint where configured, and production build.
10. Summarize files changed, commands run, results, and remaining work.

Never invent company facts or mark demo vessel records as real inventory.
