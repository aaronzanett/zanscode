
The user wants to remove the SaaS page entirely and reframe the site around two pillars: **Services** (what Zanscode does for clients) and **Products** (finished products + SaaS offerings shown as a showcase, where each card links out to that product's own website).

## Plan

### 1. Remove the SaaS route
- Delete `src/routes/saas.tsx` entirely.
- Remove the `/saas` link from the navbar in `src/components/site/Header.tsx` (both desktop + mobile menus).
- Remove any "SaaS" references from the Footer sitemap columns in `src/components/site/Footer.tsx`.
- Clean up any internal links to `/saas` on the homepage (`src/routes/index.tsx`) if present.

### 2. Restructure the Products page as a unified showcase
Update `src/routes/products.tsx` so it presents **all Zanscode offerings** in two clear groups:

- **Finished Products** — installable/one-time products (existing cards, kept as-is in style).
- **SaaS Products** — cloud apps shown as a card grid (CRM, Projects, Finance, HR, BI, Inventory — moved over from the old saas.tsx).

Each SaaS card becomes an **external link** (`<a href="..." target="_blank" rel="noopener noreferrer">`) leading to that product's own future website. Use placeholder URLs (`https://crm.zanscode.com`, etc.) so the user can swap them later. Add a small "Visit site ↗" affordance and an external-link icon (lucide `ExternalLink`).

Keep the existing supporting sections (features grid, use cases, integrations, FAQ) so the page remains rich.

### 3. Tighten navigation flow
New navbar order: **Home → Services → Products → About → Contact** (drops SaaS). This keeps the user journey: learn what we do → see what we offer → know who we are → reach out.

### 4. Homepage adjustments
On `src/routes/index.tsx`, if the hero/sections reference SaaS as a separate pillar, simplify to two pillars: **Services** and **Products** (with a note that Products includes SaaS apps). No structural overhaul — just copy/CTA cleanup.

### Technical notes
- External SaaS links use plain `<a>` tags (not `<Link>`) since they leave the site.
- Placeholder URLs documented inline so the user can replace them with real product domains.
- No route-tree edits — `routeTree.gen.ts` regenerates automatically once `saas.tsx` is deleted.
- All `head()` meta on the Products page updated to reflect the broader scope.

