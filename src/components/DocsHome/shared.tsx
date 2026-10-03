'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { buildIndex, searchDocs, type Indexed } from '@/lib/docs-search';
import { PAGE_COUNT, SECTION_COUNT, START, SUGGESTIONS } from './data';

// ───────────────────────────────────────────────────────────────────────────
// Pieces every homepage direction shares: the lockup, the Folio find palette
// (the docs' real search, in Folio), code with tabs and a copy button, and a
// quiet footer. Each direction lays these out its own way.
// ───────────────────────────────────────────────────────────────────────────

/** The product lockup, "esy | OS", then the product name, as Folio's bar has it. */
export function Lockup({ tone = 'ink' }: { tone?: 'ink' | 'light' }) {
  return (
    <Link href="/" className={`dh-lockup ${tone === 'light' ? 'is-light' : ''}`} aria-label="Esy OS docs home">
      <span className="fo-wordmark">esy</span>
      <span className="fo-lockup-sep" aria-hidden="true" />
      <span className="fo-lockup-name">OS</span>
    </Link>
  );
}

// ── Search ─────────────────────────────────────────────────────────────────

/** Opening and closing the palette, with the docs' own keys: ⌘K toggles, / opens. */
export function useFind() {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState('');
  const openFind = useCallback((q = '') => {
    setSeed(q);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isCmd = e.metaKey || e.ctrlKey;
      if (isCmd && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSeed('');
        setOpen((o) => !o);
        return;
      }
      // "/" opens search unless someone is typing somewhere.
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (e.key === '/' && !isCmd && !typing) {
        e.preventDefault();
        setSeed('');
        setOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return { open, seed, openFind, close };
}

/** Before anything is typed: the three pages to read first, then a few lookups. */
const EMPTY_PICKS: Indexed[] = (() => {
  const index = buildIndex();
  const hrefs = [...START.map((s) => s.item.href), '/api/runs', '/errors', '/api/run-events', '/glossary'];
  return hrefs.map((h) => index.find((i) => i.href === h)!).filter(Boolean);
})();

/**
 * Results and keyboard for one search box: the docs' real index, page hits
 * first, then section hits. Shared by the palette and the inline find field.
 */
export function useDocsFind(query: string, onDone?: () => void) {
  const router = useRouter();
  const index = useMemo(() => buildIndex(), []);
  const results = useMemo(() => (query.trim() ? searchDocs(index, query).slice(0, 12) : EMPTY_PICKS), [index, query]);
  const [selected, setSelected] = useState(0);

  // A new query starts the selection at the top.
  useEffect(() => setSelected(0), [query]);

  const go = useCallback(
    (item: Indexed) => {
      if (item.external) window.open(item.href, '_blank', 'noopener,noreferrer');
      else router.push(item.href);
      onDone?.();
    },
    [router, onDone],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === 'Enter' && results[selected]) {
        e.preventDefault();
        go(results[selected]);
      }
    },
    [results, selected, go],
  );

  return { results, selected, setSelected, onKeyDown, go, empty: !query.trim() };
}

/** Wrap the first case-insensitive match of `q` in a <mark>. */
function hl(text: string, q: string) {
  const t = q.trim();
  const at = t ? text.toLowerCase().indexOf(t.toLowerCase()) : -1;
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + t.length)}</mark>
      {text.slice(at + t.length)}
    </>
  );
}

/** The rows: section, title, and either the heading that matched or the page's line. */
export function FindResults({
  query,
  find,
  onPick,
}: {
  query: string;
  find: ReturnType<typeof useDocsFind>;
  onPick?: () => void;
}) {
  const list = useRef<HTMLUListElement>(null);
  // Keep the picked row in view while arrowing through a long list.
  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [find.selected]);

  if (!find.results.length) {
    return (
      <p className="dh-find-none">
        Nothing matches “{query}”. Try a status code, an endpoint, or a word from a heading.
      </p>
    );
  }
  return (
    <ul className="dh-find-list" role="listbox" ref={list}>
      {find.empty && <li className="dh-find-group">Start here, then look things up</li>}
      {find.results.map((r, i) => (
        <li key={`${r.href}-${r.match ?? ''}`} role="option" aria-selected={i === find.selected}>
          <Link
            href={r.href}
            className={`dh-find-row ${i === find.selected ? 'is-on' : ''}`}
            // Move, not enter: a list opening under a resting cursor shouldn't steal the keyboard's pick.
            onMouseMove={() => find.selected !== i && find.setSelected(i)}
            onClick={onPick}
            {...(r.external ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            <span className="dh-find-sec">{r.section}</span>
            <span className="dh-find-main">
              <b>{hl(r.title, query)}</b>
              {r.match ? <em>§ {hl(r.match, query)}</em> : <small>{r.description}</small>}
            </span>
            <span className="dh-find-go" aria-hidden="true">↵</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** The palette: a find field over the page, Folio's drawer manners (scrim, Escape closes). */
export function FindPalette({ open, seed, onClose }: { open: boolean; seed: string; onClose: () => void }) {
  const [query, setQuery] = useState(seed);
  const find = useDocsFind(query, onClose);
  const input = useRef<HTMLInputElement>(null);

  // Each opening starts from the seed it was opened with (a chip, or nothing).
  useEffect(() => {
    if (open) {
      setQuery(seed);
      requestAnimationFrame(() => input.current?.focus());
    }
  }, [open, seed]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fo-scrim dh-find-scrim" onClick={onClose}>
      <div className="dh-find" role="dialog" aria-label="Search the docs" onClick={(e) => e.stopPropagation()}>
        <div className="dh-find-bar">
          <SearchIcon />
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={find.onKeyDown}
            placeholder="Search pages, sections and endpoints"
            aria-label="Search the docs"
            spellCheck={false}
          />
          <kbd onClick={onClose}>esc</kbd>
        </div>
        {!query && (
          <div className="dh-find-chips">
            <span>Try</span>
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => setQuery(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
        <FindResults query={query} find={find} onPick={onClose} />
        <div className="dh-find-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> move <kbd>↵</kbd> open <kbd>esc</kbd> close
          </span>
          <span>
            {SECTION_COUNT} sections across {PAGE_COUNT} pages
          </span>
        </div>
      </div>
    </div>
  );
}

/** A find field that opens the palette: what a search box looks like before you use it. */
export function FindButton({ onOpen, label = 'Search the docs', tone = 'paper' }: { onOpen: () => void; label?: string; tone?: 'paper' | 'navy' }) {
  return (
    <button type="button" className={`dh-findbtn ${tone === 'navy' ? 'is-navy' : ''}`} onClick={onOpen} aria-label={`${label} (⌘K)`}>
      <SearchIcon />
      <span>{label}</span>
      <kbd>⌘K</kbd>
    </button>
  );
}

export function SearchIcon() {
  return (
    <svg className="dh-search-icon" viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Code ───────────────────────────────────────────────────────────────────

// One pass over the text: comments, JSON keys, strings, flags, numbers, words.
// Enough colour to read a request at a glance, not a full grammar.
const STR = /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/.source;
const KEY = /"(?:[^"\\\n]|\\.)*"(?=\s*:)/.source;
const FLAG = /(?<=\s)-[A-Za-z]\b/.source;
const NUM = /\b\d+(?:\.\d+)?\b/.source;
const WORD = /\b(?:curl|export|const|await|import|true|false|null|None|True|False)\b/.source;
const COMMENT: Record<string, string> = {
  bash: /(?<=^|\s)#[^\n]*/.source,
  py: /(?<=^|\s)#[^\n]*/.source,
  js: /\/\/[^\n]*/.source,
  json: /(?!)/.source,
};
const TOKEN_CLASS = ['dh-t-com', 'dh-t-key', 'dh-t-str', 'dh-t-flag', 'dh-t-num', 'dh-t-kw'];

function highlight(code: string, lang: string) {
  const rx = new RegExp([COMMENT[lang] ?? COMMENT.json, KEY, STR, FLAG, NUM, WORD].map((s) => `(${s})`).join('|'), 'gm');
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of code.matchAll(rx)) {
    const at = m.index ?? 0;
    if (at > last) out.push(code.slice(last, at));
    const group = m.slice(1).findIndex((g) => g !== undefined);
    out.push(
      <span key={at} className={TOKEN_CLASS[group]}>
        {m[0]}
      </span>,
    );
    last = at + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function Code({ code, lang = 'bash', className = '' }: { code: string; lang?: string; className?: string }) {
  return (
    <pre className={`dh-code ${className}`}>
      <code>{highlight(code, lang)}</code>
    </pre>
  );
}

/** Copy to the clipboard, and say so for a moment. */
export function CopyButton({ text, label = 'Copy', className = '' }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <button
      type="button"
      className={`dh-copy ${done ? 'is-done' : ''} ${className}`}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => setDone(true), () => undefined);
      }}
    >
      {done ? 'Copied' : label}
    </button>
  );
}

/** Code in tabs (curl · JavaScript · Python), with a copy button for the open one. */
export function CodeTabs({
  tabs,
  title,
  tone = 'paper',
}: {
  tabs: { lang: string; label: string; code: string }[];
  title?: React.ReactNode;
  tone?: 'paper' | 'night';
}) {
  const [on, setOn] = useState(0);
  const tab = tabs[on];
  return (
    <div className={`dh-codetabs ${tone === 'night' ? 'is-night' : ''}`}>
      <div className="dh-codetabs-bar">
        {title && <span className="dh-codetabs-title">{title}</span>}
        <div className="dh-codetabs-tabs" role="tablist">
          {tabs.map((t, i) => (
            <button key={t.label} role="tab" aria-selected={i === on} className={i === on ? 'is-on' : ''} onClick={() => setOn(i)}>
              {t.label}
            </button>
          ))}
        </div>
        <CopyButton text={tab.code} />
      </div>
      <Code code={tab.code} lang={tab.lang} />
    </div>
  );
}

// ── The rest ───────────────────────────────────────────────────────────────

/** A right arrow that nudges on hover (inherits colour). */
export function Arrow({ up = false }: { up?: boolean }) {
  return (
    <svg className="dh-arrow" viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
      {up ? (
        <path d="M5 11 11 5M6 5h5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M3.5 8h9M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

/** The site's quiet last line: lockup, where else Esy lives, and the legal bits. */
export function DocsFooter({ tone = 'paper' }: { tone?: 'paper' | 'canvas' }) {
  const links: [string, string][] = [
    ['os.esy.com', 'https://os.esy.com'],
    ['esy.com', 'https://esy.com'],
    ['Changelog', '/changelog'],
    ['Privacy', 'https://esy.com/privacy/'],
    ['Terms', 'https://esy.com/terms/'],
  ];
  return (
    <footer className={`dh-foot ${tone === 'canvas' ? 'is-canvas' : ''}`}>
      <Lockup />
      <nav aria-label="Elsewhere">
        {links.map(([label, href]) => (
          <Fragment key={label}>
            {href.startsWith('/') ? <Link href={href}>{label}</Link> : <a href={href}>{label}</a>}
          </Fragment>
        ))}
      </nav>
      <small>© 2024–2026 ESY, LLC</small>
    </footer>
  );
}

