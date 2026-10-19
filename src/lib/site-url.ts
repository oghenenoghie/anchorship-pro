// NEXT_PUBLIC_SITE_URL, tolerant of common typos (missing https://, trailing slash or path). An unusable value falls
// back instead of throwing: `new URL()` on a bad value used to fail the build, leaving the previous deployment live.
export function siteUrl(fallback = "https://anchorship.nl"): string { const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim(); if (!raw) return fallback; try { return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).origin; } catch { return fallback; } }
