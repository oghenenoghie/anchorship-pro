import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";
// Load .env / .env.local the same way Next.js does, so drizzle-kit sees DATABASE_URL.
loadEnvConfig(process.cwd());
export default defineConfig({ schema: "./src/db/schema.ts", out: "./drizzle", dialect: "postgresql", dbCredentials: { url: process.env.DATABASE_URL_MIGRATIONS || process.env.DATABASE_URL || "" } });
