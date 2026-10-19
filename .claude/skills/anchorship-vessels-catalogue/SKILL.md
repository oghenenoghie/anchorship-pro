---
name: anchorship-vessels-catalogue
description: Build and maintain vessel/equipment catalogue, searchable listings, detail pages, images, availability, technical specs, and enquiry links.
---

# Catalogue implementation rules

- Verify category names and required fields against approved business content.
- Use stable slugs, pagination, indexed filters, and server-side publication filtering.
- Draft and archived records must never leak to public pages.
- Treat availability as time-sensitive business data and show only statuses confirmed by staff.
- Store measurements as numeric values with explicit units and validate plausible ranges where requirements are known.
- Keep listing status distinct from operational availability and listing type.
- Support image alt text, sort order, and authorised uploads via a configured storage provider.
- Do not use stock or demo records as genuine inventory.
- Enquiry links should preserve the relevant vessel/equipment ID and context.
- Add tests for filtering, slug collisions, unpublished content, and empty catalogues.
