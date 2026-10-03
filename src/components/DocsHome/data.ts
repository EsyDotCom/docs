import headingIndex from '@/data/docs-search-index.json';
import { changelog } from '@/lib/changelog';
import { allNavItems, getNavItemByHref, navigation, type NavItem } from '@/lib/docs-navigation';
import {
  artifactResponse,
  createResponse,
  createRun,
  finishedRun,
  getArtifact,
  pollRun,
} from '@/lib/quickstart-calls';

// ───────────────────────────────────────────────────────────────────────────
// What the homepage directions show, all read from the docs themselves: the
// nav, the search index, the changelog and the quickstart's real run. Nothing
// here is a sample, so every number on every direction agrees with the page
// it links to.
// ───────────────────────────────────────────────────────────────────────────

export { navigation };
export type { NavItem };

/** A nav item by href. The hrefs below are all in the nav; a typo fails loudly at build. */
export function page(href: string): NavItem {
  const item = getNavItemByHref(href);
  if (!item) throw new Error(`DocsHome: no docs page at ${href}`);
  return item;
}

// ── Counts, computed so they can't drift from the docs ──────────────────────
const HEADINGS = Object.values(headingIndex as Record<string, string[]>)
  .flat()
  .filter((h) => !h.startsWith('{')); // skip unrendered JSX like "{item.title}", keep paths like /v1/runs/{run_id}

export const PAGES = allNavItems.filter((i) => !i.external);
export const PAGE_COUNT = PAGES.length;
export const SECTION_COUNT = HEADINGS.length;
/** Distinct endpoints with their own reference card. */
export const ENDPOINT_COUNT = new Set(HEADINGS.filter((h) => /^(GET|POST|PUT|PATCH|DELETE) \//.test(h))).size;

// ── Dates: always UTC, so a build in any timezone prints the same day ───────
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function fmtDate(iso: string, style: 'short' | 'long' = 'short'): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const month = MONTHS[d.getUTCMonth()];
  return style === 'long'
    ? `${month} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
    : `${month.slice(0, 3)} ${d.getUTCDate()}`;
}

export const CHANGES = changelog;
export const LAST_CHANGE = changelog[0];

// ── The quickstart's run, end to end ────────────────────────────────────────
// run-fb0677b2 from 2026-09-13: the request and responses are the quickstart's
// (src/lib/quickstart-calls.ts), the step telemetry is what /concepts/runs
// publishes for the same run, and the image is the file it stored.
export const FIRST_RUN = {
  id: 'run-fb0677b2',
  templateId: 'generate-illustration',
  artifactId: 'artifact-5a6a9501',
  prompt: 'a lighthouse at dusk, storm rolling in',
  title: 'Lighthouse at Dusk with Storm Rolling In',
  image: 'https://images.esy.com/artifacts/illustration/run-fb0677b2/image.webp',
  durationMs: 16088,
  costUsd: 0.007749,
  steps: [
    { name: 'Render illustration', who: 'openai · gpt-image-2.5-sunburst', durationMs: 11178, costUsd: 0.0046 },
    { name: 'Classify asset', who: 'anthropic · claude-haiku-4-5', durationMs: 1260, costUsd: 0.000884 },
    { name: 'Text gate', who: 'anthropic · claude-haiku-4-5', durationMs: 3040, costUsd: 0.00226, gate: true },
    { name: 'artifact.create', who: 'esy', durationMs: 26, costUsd: 0 },
  ],
};

/** The quickstart's first call, verbatim, for a copy button. */
export const createRunCode = createRun;

export const usd = (n: number, digits = 4) => `$${n.toFixed(digits)}`;
export const secs = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

/** Set a key, then three calls: the quickstart, as steps. */
export const CALLS = [
  {
    key: 'key',
    title: 'Set your key',
    note: 'Create one in os.esy.com under Settings → API keys. It’s shown once.',
    label: 'shell',
    request: 'export ESY_API_KEY="esy_sk_…"',
    response: null as string | null,
    responseLabel: '',
  },
  {
    key: 'start',
    title: 'Start a run',
    note: 'Pick a workflow by its templateId and hand it the intake it declares.',
    label: 'POST /v1/runs',
    request: createRun,
    response: createResponse,
    responseLabel: '201 Created',
  },
  {
    key: 'wait',
    title: 'Wait for it',
    note: 'Poll until a terminal status, or stream it with run events.',
    label: 'GET /v1/runs/{run_id}',
    request: pollRun,
    response: finishedRun,
    responseLabel: '200 OK · about 16 seconds later',
  },
  {
    key: 'read',
    title: 'Read the artifact',
    note: 'The file, its QA record, and provenance back to the run.',
    label: 'GET /v1/artifacts/{artifact_id}',
    request: getArtifact,
    response: artifactResponse,
    responseLabel: '200 OK',
  },
];

/** The first call in the languages people paste into. curl is the quickstart's, verbatim. */
export const FIRST_CALL: { lang: string; label: string; code: string }[] = [
  { lang: 'bash', label: 'curl', code: createRun },
  {
    lang: 'js',
    label: 'JavaScript',
    code: `const res = await fetch('https://api.esy.com/v1/runs', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${process.env.ESY_API_KEY}\`,
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    templateId: 'generate-illustration',
    intake: {
      prompt: 'a lighthouse at dusk, storm rolling in',
      style: 'flat',
      aspectRatio: '4:3',
      quality: 'low',
      categories: 'landscapes',
    },
  }),
});
const run = await res.json(); // { id: 'run-…', status: 'pending', … }`,
  },
  {
    lang: 'py',
    label: 'Python',
    code: `import os, requests

run = requests.post(
    "https://api.esy.com/v1/runs",
    headers={"Authorization": f"Bearer {os.environ['ESY_API_KEY']}"},
    json={
        "templateId": "generate-illustration",
        "intake": {
            "prompt": "a lighthouse at dusk, storm rolling in",
            "style": "flat",
            "aspectRatio": "4:3",
            "quality": "low",
            "categories": "landscapes",
        },
    },
).json()  # {"id": "run-…", "status": "pending", …}`,
  },
];

// ── Ways in ─────────────────────────────────────────────────────────────────
/** What kind of page an href is: the stage column in a list of pages. */
export function kindOf(href: string): string {
  if (href.startsWith('/api')) return 'API';
  if (href.startsWith('/concepts')) return 'Concept';
  if (href.startsWith('/guides') || href.startsWith('/integrations')) return 'Guide';
  if (href.startsWith('/contracts')) return 'Contract';
  if (['/errors', '/glossary', '/changelog'].includes(href)) return 'Reference';
  return 'Start';
}

/** The three pages to read first, in order. */
export const START = [
  { item: page('/quickstart'), minutes: 5, gist: 'Set a key, then three calls: start a run, wait for it, read the artifact. Real requests, real responses.' },
  { item: page('/how-esy-works'), minutes: 10, gist: 'The whole system on one page: workspace, workflow, run, steps, gates, artifact, and where cost is counted.' },
  { item: page('/api'), minutes: 5, gist: 'Base URL, auth, casing, ids, pagination and idempotency. Everything true of every endpoint.' },
];

/** The docs by what the reader is doing, not by how the system is built. */
export const INTENTS: { key: string; label: string; short: string; line: string; pages: NavItem[] }[] = [
  {
    key: 'first',
    short: 'First run',
    label: 'Make a first run',
    line: 'From an empty shell to a finished file.',
    pages: ['/quickstart', '/authentication', '/api/runs', '/api/run-events', '/errors'].map(page),
  },
  {
    key: 'model',
    short: 'The model',
    label: 'Understand the model',
    line: 'The nouns everything else is built from.',
    pages: ['/how-esy-works', '/concepts/workflows', '/concepts/runs', '/concepts/gates-and-review', '/concepts/artifacts', '/concepts/costs'].map(page),
  },
  {
    key: 'volume',
    short: 'At volume',
    label: 'Run work at volume',
    line: 'Batches, budgets, and workers on a schedule.',
    pages: ['/concepts/orders', '/api/orders', '/concepts/collections', '/concepts/workers', '/api/workers', '/api/costs'].map(page),
  },
  {
    key: 'publish',
    short: 'Publishing',
    label: 'Publish what it makes',
    line: 'Send artifacts to your site or your newsletter.',
    pages: ['/concepts/outlets', '/concepts/publications', '/guides/connect-a-consumer-site', '/api/webhooks', '/integrations/beehiiv'].map(page),
  },
  {
    key: 'lookup',
    short: 'Look up',
    label: 'Look something up',
    line: 'Conventions, errors, and every term.',
    pages: ['/api', '/errors', '/glossary', '/api/api-keys', '/changelog'].map(page),
  },
];

/** A request becoming a file, in the order How Esy works tells it. */
export const PATH = [
  { noun: 'Intake', sub: 'the inputs you send', href: '/concepts/intake' },
  { noun: 'Workflow', sub: 'a versioned definition', href: '/concepts/workflows' },
  { noun: 'Run', sub: 'one execution of it', href: '/concepts/runs' },
  { noun: 'Gates', sub: 'checks between steps', href: '/concepts/gates-and-review' },
  { noun: 'Artifact', sub: 'the stored output', href: '/concepts/artifacts' },
].map((n) => ({ ...n, desc: page(n.href).description ?? '' }));

/** The facts people come back for, each with the page that explains it. */
export const ESSENTIALS: { label: string; value: string; copy?: boolean; href: string }[] = [
  { label: 'Base URL', value: 'https://api.esy.com/v1', copy: true, href: '/api' },
  { label: 'Auth', value: 'Authorization: Bearer $ESY_API_KEY', copy: true, href: '/authentication' },
  { label: 'Format', value: 'JSON, camelCase both ways', href: '/api' },
  { label: 'Runs are async', value: 'Poll the run, or stream its events', href: '/api/run-events' },
  { label: 'Stop polling on', value: 'completed · review · failed · cancelled', href: '/concepts/runs' },
  { label: 'Cost states', value: 'estimated → provider_reported → reconciled', href: '/concepts/costs' },
];

/** What Esy holds itself to; the current homepage's three principles. */
export const PRINCIPLES = [
  { title: 'Structure over prompting', desc: 'You pick a workflow and fill in its declared intake. There is no prompt box hoping for the right output.' },
  { title: 'Artifacts over conversations', desc: 'Every output is persisted with its provenance, telemetry, and review state. Nothing that matters is ephemeral.' },
  { title: 'Gated, not hopeful', desc: 'Work is judged before it reaches you, and a check only counts if something actually measured it.' },
];

/** Search suggestions: things people search for that live under a section, not a page title. */
export const SUGGESTIONS = ['402', 'reconnect', 'idempotency', 'typed hold', 'signature'];

export const APP_URL = 'https://os.esy.com';

// ── Round 3: what F and H list below the fold ──────────────────────────────

/** F · Guide: the docs as five chapters, read in order, from a first run to shipping. */
export const GUIDE: { title: string; line: string; pages: NavItem[] }[] = [
  {
    title: 'Make your first run',
    line: 'A key, three calls, and a finished image you can open.',
    pages: ['/quickstart', '/authentication', '/api/runs', '/errors'].map(page),
  },
  {
    title: 'Learn the model',
    line: 'What a workflow declares, what a run records, and what you send in.',
    pages: ['/how-esy-works', '/concepts/workflows', '/concepts/intake', '/concepts/runs'].map(page),
  },
  {
    title: 'Trust what comes out',
    line: 'How work is checked before it reaches you, and what an artifact keeps.',
    pages: ['/concepts/gates-and-review', '/concepts/artifacts', '/concepts/versioning', '/api/review-queue'].map(page),
  },
  {
    title: 'Run at volume, on budget',
    line: 'Batches, packs and workers on a schedule, with a cap on what they spend.',
    pages: ['/concepts/orders', '/concepts/costs', '/concepts/collections', '/concepts/workers'].map(page),
  },
  {
    title: 'Ship it',
    line: 'Send what Esy makes to your site, your newsletter, or your own code.',
    pages: ['/concepts/outlets', '/concepts/publications', '/guides/connect-a-consumer-site', '/api/webhooks'].map(page),
  },
];

/** H · Reference: every endpoint with a reference card, grouped by the API page it lives on. */
export const ENDPOINTS: { page: NavItem; calls: { method: string; path: string }[] }[] = allNavItems
  .filter((i) => i.href.startsWith('/api/'))
  .map((p) => ({
    page: p,
    calls: ((headingIndex as Record<string, string[]>)[p.href] ?? [])
      .map((h) => h.match(/^(GET|POST|PUT|PATCH|DELETE) (\/\S+)$/))
      .filter((m): m is RegExpMatchArray => !!m)
      .map((m) => ({ method: m[1], path: m[2] })),
  }))
  .filter((g) => g.calls.length);

/** Every API reference page, in nav order. */
export const allApiPages = allNavItems.filter((i) => i.href.startsWith('/api'));
