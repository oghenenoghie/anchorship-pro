---
name: anchorship-admin-security
description: Implement or review admin authentication, session handling, role-based access, audit logging, and secure mutations in the Anchorship application.
---

# Admin security checklist

- Authenticate users on the server and re-check that the account remains active.
- Enforce roles on every protected route, server action, API handler and data mutation.
- Never rely on hidden UI controls or middleware alone as authorisation.
- Use HttpOnly, Secure-in-production, SameSite cookies and short session expiry; rotate secrets and revoke sessions where required.
- Hash passwords with a suitable adaptive password hash; never log passwords, tokens, or secrets.
- Apply login rate limits and account abuse controls before production.
- Protect state-changing cookie-authenticated endpoints against CSRF using origin checks and/or CSRF tokens as appropriate.
- Audit security-relevant changes without recording unnecessary personal data.
- Return generic login errors and avoid leaking whether an email exists.
- Verify unauthorised and lower-role requests fail in automated tests.
- Recommend MFA or managed identity for production staff access.

# Admin console conventions

- Section access lives in `src/lib/admin-access.ts` (`ADMIN_ACCESS`): vessels = super_admin, editor, sales; equipment and services = super_admin, editor; enquiries = all four roles; settings = super_admin. The Account page is open to every signed-in role and only ever changes the caller's own account. Pages call `requireRole(ADMIN_ACCESS.<section>)`; API routes keep their own `requireApiRole` lists. Keep them in agreement.
- The sidebar hides links a role cannot open (`canAccess`), and the overview hides panels likewise. Hiding is cosmetic; the server check is the control.
- `getActiveUser` (cached per request with React `cache`) is the one place a session is validated: signed cookie, account active, and the token's password stamp matching the current hash. `requireUser`/`requireRole` (pages, Server Actions) and `requireApiRole` (API routes) all go through it; role, name and email always come from the database.
- Sessions are tied to the password: `createSession(user, passwordHash)` stores an HMAC fingerprint of the hash (`src/lib/session-stamp.ts`). Any password change or reset (account page, seed, SQL) ends every session issued before it. Always pass the hash that was just stored.
- Server Components cannot modify cookies (`cookies().delete()` throws there). Redirect a stale session to `/admin/login` and let the next sign-in replace the cookie; the login page only skips its form for a session `getActiveUser` accepts, so there is no redirect loop.
- Own-account changes live at `/admin/account` (every role) as a Server Action (same-origin only, works without JavaScript). Verify the current password, store the hash and its audit event in one `db.batch`, then re-issue the caller's session. Passwords: at least 12 characters, at most 72 bytes (bcrypt's limit; refuse rather than truncate), never trimmed, never logged or put in audit metadata. Limits live in `src/lib/password-policy.ts` so the client form does not import Zod.
- Do not add a `loading.tsx` under `src/app/admin`: it streams the page and turns `requireRole` redirects and `notFound()` into client-side responses with a 200 status.
- Validate route ids (`z.string().uuid()`) before querying, and 404 on missing records.
- Dashboard figures must come from real queries (`getAdminStats`); never hard-code metrics or availability.

