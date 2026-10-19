import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const url = process.env.DATABASE_URL;
// Fail fast at production runtime, but let `next build` run without a database (e.g. in CI).
if (!url && process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") throw new Error("DATABASE_URL is required");
export const sql = url ? neon(url) : null;
export const db = sql ? drizzle(sql, { schema }) : null;
export function requireDb() { if (!db) throw new Error("Database is not configured. Set DATABASE_URL in .env.local."); return db; }
