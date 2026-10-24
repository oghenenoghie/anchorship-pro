---
name: anchorship-design-system
description: Create and refine Anchorship's responsive maritime corporate UI, page layouts, components, typography, marine illustrations, interactions, and accessibility.
---

# Anchorship marine design system

Read this before changing any public or admin UI. Extend what exists; do not create competing components or one-off styles.

## Direction

- Premium offshore charter platform for B2B procurement teams: engineered, technical, spacious, confident. Not a generic SaaS template.
- Primary reference: Dutch Offshore Contractors (industrial hierarchy, bold navy heroes). Secondary: SeaSpeed Marine (vessel discovery, clear enquiry paths). Never copy their code, layout, copy, branding or imagery.
- Imagery: no unverified stock photos. Use the marine illustration system or rights-cleared photography supplied by Anchorship. The hero uses a technical illustration "plate", not a photo.

## Tokens (tailwind.config.ts + :root in src/app/globals.css)

| Token | Value | Use |
| --- | --- | --- |
| `navy` | #071B2C | header, heroes, footer, CTA bands, major headings |
| `navy-800` | #102B40 | panels on navy, illustration ink |
| `ocean` | #145D7A | links and text emphasis on light surfaces (7.3:1 on white) |
| `marine` | #22A6A1 | primary buttons (navy text), status dots, accents. Never body text on white (2.98:1) |
| `marine-300` | #56D1CB | teal text/eyebrows on navy (9.5:1) |
| `marine-700` | #0F6E6A | teal text on white when needed (6.1:1) |
| `mist` | #F4F7F9 | alternate section and page backgrounds |
| `line` | #DCE5EB | borders, hairline grid dividers |
| `ink` | #142536 | body text |
| `muted` | #5B6E7E | secondary text. Darkened from the brief's #647787, which fails 4.5:1 on `mist` |
| `on-dark` | #B8C7D3 | secondary text on navy |

- Radii: cards/panels 6px (`rounded-md`, `.card`, `.panel`), buttons/inputs/badges 3–4px. No pill cards or oversized rounded containers.
- Shadows: `shadow-card` (resting), `shadow-lift` (hover/elevated), `shadow-soft` (login card). Borders do most of the work.
- Gradients: only the subtle radial glow in the homepage hero. Blueprint grids (`.bg-blueprint`, `.bg-blueprint-dark`) mark technical areas.
- Headings read `--heading`; `.surface-dark` sets it to white and `.surface-light` resets it to navy, so utility colour classes still win.

## Typography

- Inter (`font-sans`, body/UI) + Manrope (`font-display`, headings), self-hosted with `next/font/local` from `src/app/fonts/` (variable WOFF2, latin subset, SIL OFL licences alongside). Do not switch back to `next/font/google`: it downloads fonts during every build, so a Google Fonts outage fails the deploy. To update or add a subset, take the files from the `@fontsource-variable/*` packages.
- Controlled scale: homepage h1 `text-[2.35rem] sm:text-5xl xl:text-[3.6rem]` uppercase extrabold; page h1 (PageHero) `text-[2.05rem] → md:text-[2.875rem]`; section h2 `text-[1.75rem] md:text-[2.125rem]`; card h3 `text-lg`. Body 16px / 1.65.
- Eyebrows: `.eyebrow` (uppercase, tracked, teal rule). Section/legend labels: `text-[.72rem] font-bold uppercase tracking-[.16em]`.

## Layout

- Width: `.container-wide` (max 1240px, 16/24/32px gutters). Section rhythm: `.section-pad` (64px → 88px) or `py-10 md:py-14` for listing pages.
- Page skeleton: navy `PageHero` (breadcrumbs, eyebrow, h1, lead, actions, optional `aside` illustration) → content on white or `bg-mist` → optional navy CTA band → `SiteFooter`.
- Grids: hairline grids (`grid gap-px bg-line border border-line`) for categories, services and steps; separated `.card` grids for vessel listings.
- Catalogue: filter sidebar `lg:grid-cols-[272px_minmax(0,1fr)]`, results in `VesselGrid` (1 → 2 → 3 columns). Detail: content + sticky summary `lg:grid-cols-[minmax(0,1fr)_340px]`.
- Reorganise for small screens rather than shrinking: category cards become compact rows below `sm`; filters collapse behind a toggle below `lg`; admin tables become stacked cards below `md`; header nav collapses below `xl` (8 links + CTA do not fit at `lg`).
- Odd item counts in 2-column grids: fill the gap deliberately (CategoryGrid adds a CTA cell at tablet width; particulars span the last cell).
- Check every page at 390, 820, 1280 and 1440px with zero horizontal overflow.

## Components (src/components)

| Component | File | Notes |
| --- | --- | --- |
| SiteHeader / NavLink / NavDropdown / MobileNav | site-header.tsx, nav-link.tsx, nav-dropdown.tsx, mobile-nav.tsx | Navy sticky header (72px, `--header-h`). Vessels dropdown panel is server-rendered children of the client disclosure. |
| SiteFooter, BrandLink | site-footer.tsx, brand.tsx | Footer lists categories/services/company and the approved contact details. Social and legal links only once supplied. |
| ContactDetails | contact-details.tsx | Email and office from `CONTACT` in src/lib/company.ts. `variant="footer"` (navy, compact) or `"panel"` (labelled). Never hard-code contact details elsewhere. |
| PageHero, SectionHeading, Breadcrumbs | page-hero.tsx, section-heading.tsx, breadcrumbs.tsx | Breadcrumbs also emit BreadcrumbList JSON-LD. |
| Buttons | `.btn` + `.btn-primary` (teal), `.btn-dark`, `.btn-outline`/`.btn-secondary`, `.btn-light` (on navy), `.btn-sm`, `.text-link` | 44px default height, 36px small. One teal primary action per view region. |
| MarineIllustration, HeroVisual | marine-illustration.tsx, hero-visual.tsx | See illustration rules below. |
| MarineCategoryCard, CategoryGrid | category-card.tsx | Count shows real published listings or "On request". |
| VesselCard, VesselGrid | vessel-card.tsx | Particulars as label/value rows; image or labelled "Category illustration". |
| VesselCatalogue, FiltersPanel, GetForm | catalogue/*, get-form.tsx | GET forms; empty params dropped on submit. |
| EnquiryForm | enquiry-form.tsx | `variant="general" | "charter"`. |
| StatusIndicator, EmptyState | status-indicator.tsx, empty-state.tsx | Dot + text (never colour alone); empty states offer a next step. |
| Admin: AdminNav, AdminPageHeader, MetricCard, AdminNotice | components/admin/* | Same tokens, denser. `.data-table` inside `.table-wrap`. |

Labels for enum values come from `src/lib/labels.ts` (availability "On charter", listing types, publication and enquiry statuses). Do not hand-format enum strings.

## Marine illustration system

- One family: side-profile engineering line art on a 240×120 canvas, waterline at y=88, hull filled with `--illus-fill`, `stroke-width` 1.5 non-scaling (crisp at every size), navy ink, teal (`.ac`) only for the defining equipment.
- Kinds (`IllustrationKind` in src/lib/vessel-categories.ts): fpso (modules, flare tower, turret mooring), pipelay (reel + lay tower, pipe to seabed), tanker (dashed cargo tanks), tug (high bow, fenders, tow line), workboat (wheelhouse forward, knuckle-boom crane), well-intervention (lattice tower, riser through moonpool), jack-up (lattice legs, spudcans, cantilever derrick), pontoon (modular joints, spud poles), dredger (cutter ladder + head, spuds, floating pipeline).
- Tones: `tone="light"` on white/blueprint panels, `tone="dark"` on navy. `drift` (continuous wave motion) only for one hero-scale drawing per page.
- Never add text, dimensions, certification marks or fake labels inside drawings. When a drawing stands in for a missing vessel photo, caption it as a category illustration.
- Decorative use: omit `title` (aria-hidden). Meaningful standalone use: pass `title` (role="img").
- New kinds: same canvas, waterline and classes (`ln`, `fl`, `th`, `hv`, `ac`, `dash`, `dot`, `faint`); preview all nine together before committing.

## Motion

- CSS only: button/border colour transitions, card lift (`-translate-y-0.5` + `shadow-lift`), illustration wave drift on hover, teal accent stroke emphasis, nav underline.
- Respect `prefers-reduced-motion` (globals.css disables animation/transition durations and the hero drift). No parallax, floating loops or heavy libraries.

## Accessibility

- Semantic landmarks, one h1 per page, ordered headings, labelled controls, `aria-current` on nav and pagination, visible focus (`:focus-visible` ocean on light, marine-300 on `.surface-dark`; add `.surface-light` to white panels inside dark areas).
- Forms: native validation plus server field errors (`aria-invalid`, `aria-describedby`), alert summary that receives focus, success panel with `role="status"` that receives focus.
- Disclosure menus: button with `aria-expanded`/`aria-controls`, Escape closes and returns focus.
- Absolutely positioned content (including `sr-only`) inside horizontal scrollers needs a positioned scroller (`.table-wrap` is `position: relative`) or it widens the page.

## Next.js gotchas learned in this codebase

- A `loading.tsx` above a page that calls `notFound()` or `redirect()` streams a 200 first, so 404s and redirects become client-side. Keep loading boundaries on listing routes only (`vessels/(catalogue)`, `vessels/category/[slug]` whose layout validates the slug). Admin has no loading boundary so `requireRole` redirects stay server-side.
- Public pages catch database errors and show designed error states; vessel detail lets errors reach `(site)/error.tsx` so an outage is never served as a 404.

## Definition of done for UI work

`npm run typecheck`, `npm test`, `npm run build`; screenshots at the four widths; keyboard pass (tab order, dropdown, mobile menu, forms); reduced-motion check; no invented company facts, fleet data or statistics.
