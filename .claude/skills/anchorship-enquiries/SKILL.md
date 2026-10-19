---
name: anchorship-enquiries
description: Implement and improve public enquiry forms, validation, persistence, notification delivery, spam prevention, and admin follow-up workflows.
---

# Enquiry workflow

- Validate all request bodies on the server with Zod, regardless of browser validation.
- Apply body size limits, rate limits, bot mitigation and a honeypot; do not treat a honeypot as the only spam control.
- Persist the enquiry before attempting email delivery. Notification failure must not discard a customer request.
- Store a stable reference number, enquiry type, linked vessel/equipment, contact details, status and timestamps.
- Keep notification delivery state separate from enquiry status and support retry/reconciliation.
- Avoid logging full message bodies or personal details unnecessarily.
- Use generic public errors and return accessible field-level errors where possible.
- Restrict enquiry access by role and record status/assignment changes in audit events.
- Test invalid payloads, spam submissions, duplicate requests, database failure and email provider failure.
