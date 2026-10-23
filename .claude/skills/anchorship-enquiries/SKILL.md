---
name: anchorship-enquiries
description: Implement and improve public enquiry forms, charter requests, validation, persistence, notification delivery, spam prevention, and admin follow-up workflows.
---

# Enquiry workflow

## Current implementation

- One endpoint: `POST /api/enquiries` (`src/app/api/enquiries/route.ts`), schema `enquirySchema` in `src/lib/validation.ts`.
- One form component: `EnquiryForm` (`src/components/enquiry-form.tsx`)
  - `variant="general"` (contact page): name, email, company, telephone, enquiry type, subject, message. `/contact?type=<type>&subject=<text>` preselects.
  - `variant="charter"` (`/request-vessel`, vessel detail): contact fields plus vessel category, operating region, expected charter start (date), expected duration, technical requirements, project details (required `message`). Sends `type=vessel_charter`.
- Journey: Homepage → Category → Catalogue → Vessel detail → Request charter (`/request-vessel?vessel=<slug>` or the form on the detail page) → in-place confirmation with the stored reference number.
- Charter details are typed columns on `enquiries` (migration 0002): `vessel_category_id`, `operating_region`, `charter_start` (date), `charter_duration`, `technical_requirements`.

## Rules

- Validate all request bodies on the server with Zod, regardless of browser validation. Optional fields use the `optional()` preprocess helper (empty string → absent) so errors stay field-specific.
- Return `400 { error, fields }` where `fields` maps field name → first readable message (`fieldErrors()`); never echo submitted values. The form marks fields `aria-invalid`, links messages with `aria-describedby`, and focuses the first invalid field or the alert.
- Linked records are resolved inside the insert via subqueries: a vessel id must be a published vessel, an equipment id published equipment, a category slug an existing category; otherwise NULL is stored. An enquiry must never fail because of a stale or forged id.
- Charter start: ISO date, real calendar date, not before yesterday (timezone slack), within ten years.
- Apply body size limits, rate limits, bot mitigation and the honeypot (`website`); do not treat the honeypot as the only spam control. Honeypot hits return `{ ok: true }` without storing.
- Persist the enquiry before attempting email delivery. Notification failure must not discard a customer request. The notification email lists the charter details.
- Only show success after a 2xx response; the confirmation quotes the reference returned by the server and never claims an email was delivered.
- Prevent duplicate submissions: ignore submits while sending, disable the button, set `aria-busy`.
- Store a stable reference number, enquiry type, linked vessel/equipment/category, contact details, status and timestamps.
- Keep notification delivery state (`notification_sent`) separate from enquiry status and support retry/reconciliation.
- Avoid logging full message bodies or personal details unnecessarily.
- Restrict enquiry access by role (`ADMIN_ACCESS.enquiries`). The admin inbox (`/admin/enquiries`) filters by status/type; `/admin/enquiries/[id]` shows the full request read-only. Status/assignment editing is not built yet: when adding it, record changes in `audit_events`.
- Tests: `src/lib/validation.test.ts`. Also exercise invalid payloads, spam submissions, duplicate requests, unknown ids, database failure and email provider failure end to end.
