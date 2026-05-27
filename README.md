# docs

Clean-slate public documentation site for Esy.

Canonical domain target: `docs.esy.com`.

## Goals

- Document the public Esy API and runtime concepts.
- Provide a scalable foundation for concepts, guides, changelog, and generated API reference.
- Match the Esy brand system used by `esy.com` and `app.esy.com`.

## Information architecture

### Concepts — workflow primitives

Workflows on Esy are defined at three levels of abstraction. The three primitive concept pages live under `src/app/concepts/`:

- **`workflow-schemas/`** — The platform contract every Workflow Template must satisfy. The meta-rules.
- **`workflow-templates/`** — Reusable, versioned predesigned workflows that satisfy the Schema. What operators pick to start a Run.
- **`workflow-specifications/`** — Per-run populated instances of a Template. The deterministic blueprint production reads.

The foundational engineering source of truth for this vocabulary lives at `client/esy.com/docs/foundations/WORKFLOW_PRIMITIVES.md` and is mirrored as a high-level overview at `https://esy.com/docs/foundations`.

### Other concepts

- `runs/` — Durable execution records that instantiate a Template.
- `artifacts/` — Outputs of a Run with provenance back through Specification → Template → Schema.
- `costs/` — Cost accounting across runs, templates, and projects.

### Reference and guides

- `api/` — Endpoints, request shapes, response schemas.
- `changelog/` — Platform changes over time.
- `guides/` — End-to-end walkthroughs for production workflows.

## Adding a new concept page

1. Create `src/app/concepts/<concept-name>/page.tsx` using `DocsPageShell` and `Primitives` (`PageHeader`, `Callout`, `CodeBlock`, `Table`).
2. Add a sidebar entry in `src/lib/navigation.ts` under the appropriate section.
3. Add an atlas entry in `src/app/page.tsx` if the concept is a top-level primitive.

## Development

```bash
npm install
npm run dev
```
