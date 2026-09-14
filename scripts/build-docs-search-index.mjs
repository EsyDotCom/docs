#!/usr/bin/env node

/**
 * Build the docs search index: every section heading on every docs page.
 *
 * WHY THIS EXISTS. The search modal only matched nav titles and descriptions,
 * so searching "402", "typed hold", or "reconnect" found nothing even though
 * each has its own section. Page bodies are hand-written JSX, so there is no
 * content API to query at runtime — this reads the source at build time and
 * writes the headings to a small JSON the client imports.
 *
 * Headings only, deliberately: they are what a reader searches for, and 47
 * pages of headings is ~15 KB in the client bundle. Full body text would be
 * an order of magnitude more for little gain.
 *
 * Runs in `prebuild`, so the index can never go stale relative to a deploy.
 *
 * Usage:  node scripts/build-docs-search-index.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'src/app');
const OUT = path.join(ROOT, 'src/data/docs-search-index.json');

const ENTITIES = {
  '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”', '&quot;': '"',
  '&amp;': '&', '&mdash;': '—', '&ndash;': '–', '&hellip;': '…', '&nbsp;': ' ',
  '&#123;': '{', '&#125;': '}', '&times;': '×', '&rarr;': '→',
};

/** Turn a JSX heading body into the plain text a reader sees. */
function toText(jsx) {
  return jsx
    .replace(/\{'\s*'\}/g, ' ')                 // {' '} spacers
    .replace(/\{['"`]([^'"`]*)['"`]\}/g, '$1')  // {'literal'}
    .replace(/<[^>]+>/g, '')                    // tags
    .replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name === 'page.tsx') out.push(full);
  }
  return out;
}

const index = {};
for (const file of walk(DOCS_DIR)) {
  const href = '/' + path.relative(path.join(ROOT, 'src/app'), path.dirname(file)).split(path.sep).join('/');
  const src = fs.readFileSync(file, 'utf8');

  const headings = new Set();
  // Prose sections.
  for (const m of src.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)) {
    const t = toText(m[1]);
    if (t) headings.add(t);
  }
  // Endpoint cards render their own h3 from props, so read the props.
  for (const m of src.matchAll(/<Endpoint\s+method="([A-Z]+)"\s+path="([^"]+)"/g)) {
    headings.add(`${m[1]} ${m[2]}`);
  }
  // Glossary terms are data, not headings, but they are exactly what people search for.
  for (const m of src.matchAll(/term:\s*'([^']+)'/g)) headings.add(m[1]);

  if (headings.size) index[href] = [...headings];
}

// Stable key order keeps the committed file's diffs readable.
const sorted = Object.fromEntries(Object.keys(index).sort().map((k) => [k, index[k]]));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(sorted, null, 2) + '\n');

const count = Object.values(sorted).reduce((n, h) => n + h.length, 0);
console.log(`Docs search index: ${count} headings across ${Object.keys(sorted).length} pages → ${path.relative(ROOT, OUT)}`);
