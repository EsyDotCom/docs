#!/usr/bin/env node

/**
 * Fail the build if the docs document an endpoint the API does not have.
 *
 * WHY THIS EXISTS. The docs are hand-written page.tsx files, so nothing stopped
 * them drifting from the routers. Before this check, /docs/api claimed API keys
 * were "not yet documented" while a full API-keys page already shipped, and
 * several concept pages described objects (a "Workflow Specification" resource,
 * a fourth cost state) that do not exist in the code at all. Prose drifts
 * quietly; a path that 404s is checkable, so this checks the checkable part.
 *
 * It extracts every `METHOD /v1/...` that appears in the docs source, normalises
 * the path parameters, and diffs against the live OpenAPI document. An endpoint
 * in the spec but absent from the docs is fine — the API is much larger than
 * what we choose to document. The reverse is a bug.
 *
 * Usage:
 *   node scripts/check-docs-endpoints.mjs              # check against api.esy.com
 *   ESY_API_URL=http://localhost:8000 node scripts/check-docs-endpoints.mjs
 *   node scripts/check-docs-endpoints.mjs --offline    # skip if the API is unreachable
 *
 * Network failures are reported and, with --offline, skipped rather than failed:
 * a transient outage must not block a copy edit from shipping.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'src/app');
const API_BASE = process.env.ESY_API_URL || process.env.NEXT_PUBLIC_ESY_API_URL || 'https://api.esy.com';
const OFFLINE_OK = process.argv.includes('--offline');

const METHODS = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];

/**
 * Paths the docs mention deliberately but which are not routes on this API —
 * the machine-readable spec itself, and the OAuth-style endpoints hosted
 * elsewhere. Keep this list short and justified.
 */
const ALLOWED_NON_ROUTES = new Set(['/openapi.json', '/health']);

/**
 * Docs source is JSX, so a path parameter reaches us in several disguises:
 * `{run_id}` in a template literal, `&#123;id&#125;` once entity-escaped, and
 * `{'{run_id}'}` when it had to survive JSX braces. Flatten all of them first.
 */
function unescapeJsx(text) {
  return text
    .replace(/&#123;/g, '{')
    .replace(/&#125;/g, '}')
    .replace(/\{'\{/g, '{')
    .replace(/\}'\}/g, '}');
}

/** `/v1/runs/{run_id}`, `/v1/runs/:runId` and a query string all compare equal. */
function normalise(p) {
  return p
    .split('?')[0]
    .replace(/\{[^}]*\}/g, '{}')
    .replace(/:[A-Za-z_][A-Za-z0-9_]*/g, '{}')
    .replace(/\/$/, '');
}

/**
 * Segment-wise match so a worked example with a concrete id
 * (`/v1/catalog/workflows/generate-coloring-page`) satisfies the spec's
 * parameterised route (`/v1/catalog/workflows/{}`).
 */
function matchesSpec(docPath, specPaths) {
  const d = docPath.split('/');
  return specPaths.some((s) => {
    const parts = s.split('/');
    if (parts.length !== d.length) return false;
    return parts.every((seg, i) => seg === '{}' || d[i] === '{}' || seg === d[i]);
  });
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(tsx?|mdx?)$/.test(entry.name)) out.push(full);
  }
  return out;
}

// Matches "POST /v1/runs" and "GET  /v1/runs/{run_id}/events" wherever they appear —
// in a CodeBlock string, an EndpointList item, or ordinary prose.
const RE = new RegExp(`\\b(${METHODS.join('|')})\\s+(/(?:v1|openapi\\.json|health)[^\\s"'\`<),\\\\]*)`, 'g');

function collectDocumented() {
  const found = new Map(); // "METHOD path" -> Set(files)
  for (const file of walk(DOCS_DIR)) {
    const text = unescapeJsx(fs.readFileSync(file, 'utf8'));
    for (const m of text.matchAll(RE)) {
      const method = m[1];
      const raw = m[2].replace(/[.,;:]+$/, '');
      const key = `${method} ${normalise(raw)}`;
      if (!found.has(key)) found.set(key, new Set());
      found.get(key).add(path.relative(ROOT, file));
    }
  }
  return found;
}

async function loadSpec() {
  const url = `${API_BASE.replace(/\/$/, '')}/openapi.json`;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const spec = await res.json();
  if (!spec?.paths) throw new Error('response had no "paths"');

  // method -> [normalised paths], so matching can be segment-wise.
  const real = new Map();
  for (const [p, ops] of Object.entries(spec.paths)) {
    for (const method of Object.keys(ops)) {
      const m = method.toUpperCase();
      if (!METHODS.includes(m)) continue;
      if (!real.has(m)) real.set(m, []);
      real.get(m).push(normalise(p));
    }
  }
  return real;
}

async function main() {
  const documented = collectDocumented();
  console.log(`Found ${documented.size} distinct endpoints referenced in src/app.`);

  let real;
  try {
    real = await loadSpec();
  } catch (err) {
    const msg = `Could not read ${API_BASE}/openapi.json — ${err.message}`;
    if (OFFLINE_OK) {
      console.warn(`${msg}\nSkipping (--offline).`);
      return;
    }
    console.error(`${msg}\nRe-run with --offline to skip when the API is unreachable.`);
    process.exit(1);
  }
  const specCount = [...real.values()].reduce((n, v) => n + v.length, 0);
  console.log(`Live spec exposes ${specCount} endpoints.`);

  const missing = [];
  for (const [key, files] of documented) {
    const [method, p] = key.split(' ');
    if (ALLOWED_NON_ROUTES.has(p)) continue;
    if (!matchesSpec(p, real.get(method) ?? [])) missing.push([key, [...files]]);
  }

  if (missing.length) {
    console.error(`\n✗ ${missing.length} documented endpoint(s) do not exist on the API:\n`);
    for (const [key, files] of missing.sort()) {
      console.error(`  ${key}`);
      for (const f of files) console.error(`      ${f}`);
    }
    console.error('\nEither the docs are wrong, or the endpoint moved and the docs need updating.');
    process.exit(1);
  }

  console.log('\n✓ Every endpoint referenced in the docs exists on the API.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
