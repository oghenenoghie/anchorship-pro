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
