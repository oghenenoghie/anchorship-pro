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

- Section access lives in `src/lib/admin-access.ts` (`ADMIN_ACCESS`): vessels = super_admin, editor, sales; equipment and services = super_admin, editor; enquiries = all four roles; settings = super_admin. Pages call `requireRole(ADMIN_ACCESS.<section>)`; API routes keep their own `requireApiRole` lists. Keep them in agreement.
- The sidebar hides links a role cannot open (`canAccess`), and the overview hides panels likewise. Hiding is cosmetic; the server check is the control.
- `requireUser` is cached per request (React `cache`) so layout and page share one lookup; the account's active flag and role always come from the database.
- Do not add a `loading.tsx` under `src/app/admin`: it streams the page and turns `requireRole` redirects and `notFound()` into client-side responses with a 200 status.
- Validate route ids (`z.string().uuid()`) before querying, and 404 on missing records.
- Dashboard figures must come from real queries (`getAdminStats`); never hard-code metrics or availability.

