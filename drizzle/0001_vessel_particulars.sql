-- Hand-edited: drizzle-kit omits USING, and Postgres cannot cast text to numeric implicitly.
-- A non-numeric value makes the migration fail (and roll back) instead of being silently dropped.
ALTER TABLE "vessels" ALTER COLUMN "length_metres" SET DATA TYPE numeric(10, 2) USING "length_metres"::numeric(10, 2);--> statement-breakpoint
ALTER TABLE "vessels" ALTER COLUMN "breadth_metres" SET DATA TYPE numeric(10, 2) USING "breadth_metres"::numeric(10, 2);--> statement-breakpoint
ALTER TABLE "vessels" ALTER COLUMN "deadweight_tonnes" SET DATA TYPE numeric(10, 2) USING "deadweight_tonnes"::numeric(10, 2);--> statement-breakpoint
-- Specifications move from a {label: value} object to an ordered [{label, value}] array; convert existing rows.
UPDATE "vessels" SET "specifications" = COALESCE((SELECT jsonb_agg(jsonb_build_object('label', e.key, 'value', e.value #>> '{}')) FROM jsonb_each("specifications") AS e), '[]'::jsonb) WHERE jsonb_typeof("specifications") = 'object';--> statement-breakpoint
ALTER TABLE "vessels" ALTER COLUMN "specifications" SET DEFAULT '[]'::jsonb;
