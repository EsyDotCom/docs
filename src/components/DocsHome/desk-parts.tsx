'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
  APP_URL,
  CHANGES,
  ENDPOINT_COUNT,
  ESSENTIALS,
  FIRST_CALL,
  FIRST_RUN,
  INTENTS,
  LAST_CHANGE,
  PAGE_COUNT,
  PATH,
  START,
  createRunCode,
  fmtDate,
  kindOf,
  navigation,
  secs,
  usd,
} from './data';
import { Arrow, CodeTabs, CopyButton, FindButton, Lockup } from './shared';
import './desk.css';

// ───────────────────────────────────────────────────────────────────────────
// A · Desk's parts, shared with the merges that reuse it (D and E): the bar,
// the page rail, the start-here queue, the first call, the model path, ways
// in by intent, and the reference rail. A merge composes these; it never
// copies them.
// ───────────────────────────────────────────────────────────────────────────

const TOP: [string, string][] = [
  ['Overview', '/'],
  ['Quickstart', '/quickstart'],
  ['How Esy works', '/how-esy-works'],
  ['API', '/api'],
  ['Guides', '/guides'],
  ['Changelog', '/changelog'],
];

/** The raised bar: lockup, sections, the find field, and the one primary action. */
export function DeskBar({ onFind }: { onFind: () => void }) {
  return (
    <header className="fo-bar dk-bar">
      <div className="fo-bar-in">
        <Lockup />
        <nav className="fo-nav dk-nav" aria-label="Docs">
          {TOP.map(([label, href]) => (
            <Link key={href} href={href} className={href === '/' ? 'is-on' : ''} aria-current={href === '/' ? 'page' : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="fo-bar-end">
          <FindButton onOpen={onFind} />
          <a className="fo-bar-link dk-hide-sm" href={APP_URL}>
            Open OS <Arrow up />
          </a>
          <a className="fo-btn fo-btn--primary" href={APP_URL}>
            Get an API key
          </a>
        </div>
      </div>
    </header>
  );
}

/** The left rail: every page in reading order, filtered as you type. */
export function PageRail({ onSearch, className = '' }: { onSearch: (q: string) => void; className?: string }) {
  const [filter, setFilter] = useState('');
  const groups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return navigation
      .map((s) => ({ title: s.title, items: s.items.filter((i) => !q || i.title.toLowerCase().includes(q)) }))
      .filter((s) => s.items.length);
  }, [filter]);

  return (
    <aside className={`fo-pane dk-left ${className}`} aria-label="Every page">
      <div className="fo-list">
        <div className="fo-list-head">
          <span className="fo-label">Contents</span>
          <span className="fo-list-count fo-list-count--muted">{PAGE_COUNT} pages</span>
        </div>
        <input
          className="fo-find"
          placeholder="Filter pages"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter pages by title"
        />
        {groups.map((g) => (
          <div key={g.title} className="fo-list-group">
            <p className="fo-list-site">{g.title}</p>
            {g.items.map((item) =>
              item.external ? (
                <a key={item.href} className="fo-list-row" href={item.href}>
                  <span className="fo-list-name">{item.title}</span>
                  <Arrow up />
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`fo-list-row ${item.href === '/' ? 'is-on' : ''}`}
                  aria-current={item.href === '/' ? 'page' : undefined}
                >
                  <span className="fo-list-name">{item.title}</span>
                </Link>
              ),
            )}
          </div>
        ))}
        {/* No title matches: offer the deeper search, which reads section headings too. */}
        {!groups.length && (
          <p className="fo-list-foot">
            No page is called that.{' '}
            <button className="fo-textbtn" onClick={() => onSearch(filter)}>
              Search inside pages for “{filter}”
            </button>
          </p>
        )}
        <p className="fo-list-foot">Every page, in reading order. Press / to search inside them.</p>
      </div>
    </aside>
  );
}

/** A quiet line of figures under a title; the jade one is what gets you going. */
export function QuietNumbers() {
  return (
    <p className="fo-quiet">
      <span className="is-you">
        <b>3</b> calls to a finished file
      </span>
      <span>
        <b>{PAGE_COUNT}</b> pages
      </span>
      <span>
        <b>{ENDPOINT_COUNT}</b> endpoints
      </span>
      <span>
        Updated <b>{fmtDate(LAST_CHANGE.date)}</b>
      </span>
    </p>
  );
}

/** Start here: a queue, each row's actions in their own column. */
export function StartQueue() {
  return (
    <section className="fo-tier">
      <div className="fo-tier-head">
        <b>Start here</b>
        <span>In this order. About twenty minutes in all.</span>
      </div>
      <ol className="fo-queue">
        {START.map((s, i) => (
          <li key={s.item.href}>
            <div className="fo-q-body">
              <div className="fo-q-meta">
                <span className={`fo-kind ${i === 0 ? 'is-you' : ''}`}>Step {i + 1}</span>
                <span>{s.minutes} min</span>
                <span className="fo-code">{s.item.href}</span>
              </div>
              <h3 className="fo-q-title">
                <Link href={s.item.href}>{s.item.title}</Link>
              </h3>
              <p className="fo-q-note">{s.gist}</p>
            </div>
            <div className="fo-q-actions">
              <Link className={`fo-btn ${i === 0 ? 'fo-btn--primary' : ''}`} href={s.item.href}>
                {i === 0 ? 'Make a run' : 'Read it'}
              </Link>
              {i === 0 && <CopyButton className="fo-textbtn dk-copytext" text={createRunCode} label="Copy the first call" />}
              {i === 1 && (
                <Link className="fo-textbtn" href="/glossary">
                  Glossary
                </Link>
              )}
              {i === 2 && (
                <Link className="fo-textbtn" href="/errors">
                  Errors
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** The first call in three languages, and what came back: the file and the run's steps. */
export function FirstCall() {
  return (
    <section className="fo-tier">
      <div className="fo-tier-head">
        <b>Your first call</b>
        <span>From the quickstart, run against api.esy.com.</span>
      </div>
      <CodeTabs tabs={FIRST_CALL} title="POST /v1/runs" />
      <div className="dk-reply">
        <Link href="/quickstart" className="dk-reply-shot" aria-label="The file this run made">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FIRST_RUN.image} alt={FIRST_RUN.title} loading="lazy" />
        </Link>
        <div>
          <p className="dk-reply-h">
            <span className="fo-live is-idle" />
            <span className="fo-code">{FIRST_RUN.id}</span> came back <b>completed</b> in{' '}
            <b>{secs(FIRST_RUN.durationMs)}</b> for <b>{usd(FIRST_RUN.costUsd)}</b>
          </p>
          <ol className="fo-log dk-log">
            {FIRST_RUN.steps.map((st) => (
              <li key={st.name}>
                <span className="fo-log-time">{secs(st.durationMs)}</span>
                <span className={`fo-log-dot ${st.gate ? 'is-you' : ''}`} />
                <span className="dk-log-entry">
                  <b>{st.name}</b>
                  {st.gate && <em> passed</em>}
                  <small>
                    {st.who}
                    {st.costUsd ? ` · ${usd(st.costUsd)}` : ''}
                  </small>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** The model as a path: hover a noun, read its line. */
export function ModelPath() {
  const [noun, setNoun] = useState(2); // the run, the noun everything turns on
  return (
    <section className="fo-tier">
      <div className="fo-tier-head">
        <b>How a request becomes a file</b>
        <span>Five nouns. Everything else is a detail of one of them.</span>
      </div>
      <ol className="dk-path">
        {PATH.map((n, i) => (
          <li key={n.noun}>
            <Link href={n.href} className={i === noun ? 'is-on' : ''} onMouseEnter={() => setNoun(i)} onFocus={() => setNoun(i)}>
              <small>{String(i + 1).padStart(2, '0')}</small>
              <b>{n.noun}</b>
              <span>{n.sub}</span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="fo-callout dk-path-note">
        <b>{PATH[noun].noun}</b>
        {PATH[noun].desc}{' '}
        <Link className="fo-textbtn" href={PATH[noun].href}>
          Read it <Arrow />
        </Link>
      </div>
      <p className="dk-ledger">
        Every provider call along the way writes one row to the cost ledger.{' '}
        <Link className="fo-textbtn" href="/concepts/costs">
          Costs and budgets
        </Link>
      </p>
    </section>
  );
}

/** Ways in, by what you're doing: text tabs over lines of pages. */
export function WaysIn() {
  const [intent, setIntent] = useState(0);
  const picked = INTENTS[intent];
  return (
    <section className="fo-tier">
      <div className="fo-tier-head">
        <b>Find your way</b>
        <span>By what you’re doing, not by how Esy is built.</span>
      </div>
      <div className="fo-tabs dk-tabs" role="tablist">
        {INTENTS.map((t, i) => (
          <button key={t.key} role="tab" aria-selected={i === intent} className={i === intent ? 'is-on' : ''} onClick={() => setIntent(i)}>
            {t.short}
            <span>{t.pages.length}</span>
          </button>
        ))}
      </div>
      <p className="dk-intent-line">{picked.line}</p>
      <ul className="fo-lines dk-lines">
        {picked.pages.map((p) => (
          <li key={p.href}>
            <span className="fo-stage">{kindOf(p.href)}</span>
            <Link className="fo-line-title" href={p.href}>
              {p.title}
            </Link>
            <span className="dk-line-desc">{p.description}</span>
            <span className="fo-line-actions">
              <Link className="fo-textbtn" href={p.href}>
                Open <Arrow />
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The reference rail: the facts people come back for, what changed, and where
 * else Esy lives. Navy when it is the view's one navy moment (A); light, like
 * os.esy.com/agency's rail, when something else on the page is navy (D, E).
 */
export function ReferenceRail({ tone = 'navy', className = '' }: { tone?: 'navy' | 'light'; className?: string }) {
  const navy = tone === 'navy';
  return (
    <aside className={`fo-pane dk-right ${navy ? 'fo-rail--navy is-night' : 'is-light'} ${className}`} aria-label="Reference">
      <section className="fo-side">
        <h2 className="fo-side-h">The essentials</h2>
        {ESSENTIALS.map((e) => (
          <div key={e.label} className="fo-side-row dk-ess">
            <span className="dk-ess-label">
              <Link href={e.href}>{e.label}</Link>
              {e.copy && <CopyButton text={e.value} />}
            </span>
            <code>{e.value}</code>
          </div>
        ))}
      </section>

      <section className="fo-side">
        <h2 className="fo-side-h">What changed</h2>
        {CHANGES.slice(0, 4).map((c) => (
          <div key={c.date + c.title} className="fo-side-row">
            <span className="dk-date">
              {fmtDate(c.date)} · {c.tag}
            </span>
            <Link className="fo-side-title" href="/changelog">
              {c.title}
            </Link>
          </div>
        ))}
        <p className="dk-side-more">
          <Link className={`fo-textbtn ${navy ? 'fo-textbtn--light' : ''}`} href="/changelog">
            The whole changelog <Arrow />
          </Link>
        </p>
      </section>

      <section className="fo-side dk-side-last">
        <h2 className="fo-side-h">Elsewhere</h2>
        <div className="fo-side-row">
          <a className="fo-side-title" href={APP_URL}>
            os.esy.com <Arrow up />
          </a>
          The dashboard: runs, review, costs, and your API keys.
        </div>
        <div className="fo-side-row">
          <a className="fo-side-title" href="https://api.esy.com/openapi.json">
            openapi.json <Arrow up />
          </a>
          The machine-readable contract every page here is checked against.
        </div>
      </section>
    </aside>
  );
}
