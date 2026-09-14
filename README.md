# docs.esy.com

Documentation for the Esy platform: the dashboard at [os.esy.com](https://os.esy.com) and the API at [api.esy.com](https://api.esy.com). Written for a developer with an API key and a terminal.

The docs used to live at `esy.com/docs`. They moved here in September 2026 when esy.com became the home of The Marketing Engineer; `esy.com/docs/*` redirects to the same path on this site.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

## Where things live

| Path | What it is |
|---|---|
| `src/app/**/page.tsx` | One file per page. Hand-written JSX. |
| `src/lib/docs-navigation.ts` | The sidebar, in reading order. Also drives breadcrumbs, prev/next, the sitemap, and search. |
| `src/components/docs/Primitives.tsx` | The building blocks pages are written in: `PropertyTable`, `Endpoint`, `Diagram`, `Callout`, and so on. |
| `src/app/docs-theme.css` | The design system. Both themes come from one set of tokens. |
| `public/brand/docs/` | Section art: transparent cutouts generated through Esy's own clip-art workflow. |

A page belongs in the sidebar. If you add one, add it to `docs-navigation.ts` too — an unlisted page is unreachable.

## Keeping the docs honest

```bash
npm run check:docs-endpoints
```

Extracts every `METHOD /v1/...` the docs mention and fails if the live [OpenAPI document](https://api.esy.com/openapi.json) does not have it. Run it before shipping any change to an API page.

The search index (`src/data/docs-search-index.json`) is regenerated from every page's section headings on each build.
