import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const url = process.env.DATABASE_URL?.trim();
// A missing or malformed DATABASE_URL must not crash every page at startup: public pages fall back to their empty
// states, database actions fail through requireDb(), and /api/health names the problem.
let configError: string | null = null;
let client: NeonQueryFunction<false, false> | null = null;
if (!url) configError = "DATABASE_URL is not set";
else if (!/^postgres(ql)?:\/\//i.test(url)) configError = `DATABASE_URL must start with postgresql:// (it starts with "${url.slice(0, 8)}")`;
else { try { client = neon(url); } catch { configError = "DATABASE_URL is not a valid postgresql:// connection string"; } }
if (configError && process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") console.error(`[db] ${configError}`);
export const dbConfigError = configError;
export const sql = client;
export const db = sql ? drizzle(sql, { schema }) : null;
export function requireDb() { if (!db) throw new Error(`Database is not configured: ${configError}.`); return db; }
