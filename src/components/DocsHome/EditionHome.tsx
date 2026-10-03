'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import {
  APP_URL,
  CALLS,
  CHANGES,
  ENDPOINT_COUNT,
  FIRST_RUN,
  INTENTS,
  LAST_CHANGE,
  PAGE_COUNT,
  SECTION_COUNT,
  START,
  SUGGESTIONS,
  fmtDate,
  kindOf,
  secs,
  usd,
} from './data';
import { Arrow, Code, CopyButton, DocsFooter, FindResults, Lockup, SearchIcon, useDocsFind } from './shared';
import './edition.css';

// ───────────────────────────────────────────────────────────────────────────
// B · Edition: the docs as a front page, after os.esy.com/agency's Brief. A
// masthead with the date of the last change, a serif lede, the first run's
// numbers, search right on the page (results open under the field), the
// quickstart's calls you can step through, the model in one sentence, and the
// changelog as folds. It reads top to bottom, like the Brief does.
// ───────────────────────────────────────────────────────────────────────────

const TOP: [string, string][] = [
  ['Overview', '/'],
  ['Quickstart', '/quickstart'],
  ['How Esy works', '/how-esy-works'],
  ['API', '/api'],
  ['Guides', '/guides'],
  ['Changelog', '/changelog'],
];

export default function EditionHome() {
  const findInput = useRef<HTMLInputElement>(null);
  // Search lives on the page here, so ⌘K and / bring you to the field.
  const focusFind = () => {
    findInput.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    findInput.current?.focus({ preventScroll: true });
  };
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isCmd = e.metaKey || e.ctrlKey;
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if ((isCmd && e.key.toLowerCase() === 'k') || (e.key === '/' && !isCmd && !typing)) {
        e.preventDefault();
        focusFind();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="folio ed-app">
      <header className="fo-bar ed-bar">
        <div className="fo-bar-in">
          <Lockup />
          <nav className="fo-nav ed-nav" aria-label="Docs">
            {TOP.map(([label, href]) => (
              <Link key={href} href={href} className={href === '/' ? 'is-on' : ''} aria-current={href === '/' ? 'page' : undefined}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="fo-bar-end">
            <button type="button" className="ed-barfind" onClick={focusFind} aria-label="Search the docs (⌘K)">
              <SearchIcon />
              <kbd>⌘K</kbd>
            </button>
            <a className="fo-bar-link ed-hide-sm" href={APP_URL}>
              Open OS <Arrow up />
            </a>
            <a className="fo-btn fo-btn--primary" href={APP_URL}>
              Get an API key
            </a>
          </div>
        </div>
      </header>

      <div className="ed-canvas">
        <article className="ed-sheet">
          <div className="ed">
            {/* ── Masthead ─────────────────────────────────────────────── */}
            <header className="ed-mast">
              <p className="ed-date">
                <span>The Esy docs · Edition of {fmtDate(LAST_CHANGE.date, 'long')}</span>
                <span>API v1</span>
              </p>
              <h1 className="ed-head">
                Post a workflow.
                <br />
                Get back the file, and how it was made.
              </h1>
              <p className="ed-by">
                For anyone with an API key and a terminal · {PAGE_COUNT} pages · {ENDPOINT_COUNT} endpoints
              </p>
            </header>

            <div className="ed-lead">
              <p>You send a workflow and its inputs in one request.</p>
              <p>Esy runs each step, checks the output against its gates, and stores the result.</p>
              <p>You get back the file, which models made it, and what it cost.</p>
            </div>

            <InlineFind inputRef={findInput} />

            {/* ── The first run's numbers ──────────────────────────────── */}
            <dl className="ed-facts">
              <div className="is-good">
                <dd>3</dd>
                <dt>calls from an empty shell to a finished file</dt>
              </div>
              <div>
                <dd>{secs(FIRST_RUN.durationMs)}</dd>
                <dt>the quickstart’s run, start to finish</dt>
              </div>
              <div>
                <dd>{usd(FIRST_RUN.costUsd)}</dd>
                <dt>what that run cost, as the providers reported it</dt>
              </div>
              <div>
                <dd>10</dd>
                <dt>run statuses; four of them end a polling loop</dt>
              </div>
            </dl>

            {/* ── Start here ───────────────────────────────────────────── */}
            <section className="ed-sec">
              <h2 className="ed-sec-h">
                Start here <small>in this order, about twenty minutes in all</small>
              </h2>
              <ol className="ed-start">
                {START.map((s, i) => (
                  <li key={s.item.href}>
                    <span className="ed-start-n">{String(i + 1).padStart(2, '0')}</span>
                    <h3>
                      <Link href={s.item.href}>{s.item.title}</Link>
                    </h3>
                    <p>{s.gist}</p>
                    <span className="ed-start-foot">
                      <Link className={`fo-btn ${i === 0 ? 'fo-btn--primary' : ''}`} href={s.item.href}>
                        {i === 0 ? 'Make your first run' : 'Read it'}
                      </Link>
                      <small>{s.minutes} min</small>
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <Stepper />

            {/* ── The model, in one sentence ───────────────────────────── */}
            <section className="ed-sec">
              <h2 className="ed-sec-h">
                The model, in one sentence <small>every word links to its page</small>
              </h2>
              <div className="ed-model">
                <p className="ed-sentence">
                  An <Link href="/concepts/intake">intake</Link> goes into a{' '}
                  <Link href="/concepts/workflows">workflow</Link>, which starts a{' '}
                  <Link href="/concepts/runs">run</Link>. The run’s steps pass through{' '}
                  <Link href="/concepts/gates-and-review">gates</Link>, and what comes out is an{' '}
                  <Link href="/concepts/artifacts">artifact</Link>, with every provider call written to the{' '}
                  <Link href="/concepts/costs">cost ledger</Link>.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="ed-model-art" src="/brand/docs/pipeline.webp" alt="" aria-hidden="true" />
              </div>
              <p className="ed-model-more">
                <Link className="fo-textbtn" href="/how-esy-works">
                  The whole system, on one page <Arrow />
                </Link>
              </p>
            </section>

            {/* ── By what you're doing ─────────────────────────────────── */}
            <section className="ed-sec">
              <h2 className="ed-sec-h">
                By what you’re doing <small>the same pages as the contents, sorted by the job</small>
              </h2>
              <div className="ed-desks">
                {INTENTS.map((t) => (
                  <div key={t.key} className="ed-desk">
                    <h3>{t.label}</h3>
                    <p>{t.line}</p>
                    <ul>
                      {t.pages.map((p) => (
                        <li key={p.href}>
                          <Link href={p.href}>{p.title}</Link>
                          <span>{kindOf(p.href)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <History />

            <p className="ed-foot">
              Every request in these docs was run against api.esy.com and its response pasted back. If one
              doesn’t work as written, that’s a bug in the docs.{' '}
              <a href="https://api.esy.com/openapi.json">The OpenAPI document</a> is what each page is checked
              against.
            </p>
          </div>
        </article>
        <DocsFooter tone="canvas" />
      </div>
    </div>
  );
}

/** Search on the page: type, and the results open under the field. */
function InlineFind({ inputRef }: { inputRef: React.RefObject<HTMLInputElement | null> }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const find = useDocsFind(query, () => setOpen(false));

  return (
    <div
      className="ed-find"
      // Close when focus leaves the field and its results (a click elsewhere, a tab away).
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <div className={`ed-find-field ${open ? 'is-open' : ''}`}>
        <SearchIcon />
        <input
          ref={inputRef}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false);
              e.currentTarget.blur();
            } else find.onKeyDown(e);
          }}
          placeholder={`Search ${PAGE_COUNT} pages and ${SECTION_COUNT} sections`}
          aria-label="Search the docs"
          spellCheck={false}
        />
        <kbd>⌘K</kbd>
      </div>
      {open && (
        <div className="ed-find-drop">
          <FindResults query={query} find={find} onPick={() => setOpen(false)} />
        </div>
      )}
      <p className="ed-find-try">
        <span>Try</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setQuery(s);
              setOpen(true);
              inputRef.current?.focus();
            }}
          >
            {s}
          </button>
        ))}
      </p>
    </div>
  );
}

/** The quickstart's calls: pick a step on the left, read its request and reply on the right. */
function Stepper() {
  const [on, setOn] = useState(1);
  const call = CALLS[on];
  const last = on === CALLS.length - 1;

  return (
    <section className="ed-sec">
      <h2 className="ed-sec-h">
        Your first run, step by step <small>the quickstart, verbatim</small>
      </h2>
      <div className="ed-steps">
        <ol className="ed-steps-list" role="tablist" aria-label="Quickstart steps">
          {CALLS.map((c, i) => (
            <li key={c.key}>
              <button role="tab" aria-selected={i === on} className={i === on ? 'is-on' : ''} onClick={() => setOn(i)}>
                <span className="ed-steps-n">{i === 0 ? '0' : i}</span>
                <span>
                  <b>{c.title}</b>
                  <small>{c.note}</small>
                </span>
              </button>
            </li>
          ))}
          <li className="ed-steps-more">
            <Link className="fo-textbtn" href="/quickstart">
              Open the quickstart <Arrow />
            </Link>
          </li>
        </ol>

        <div className="ed-steps-pane" role="tabpanel">
          <div className="ed-steps-bar">
            <span className="fo-code">{call.label}</span>
            <CopyButton text={call.request} />
          </div>
          <Code code={call.request} lang="bash" />
          {/* The last step's payoff: the file the run made. */}
          {call.key === 'read' && (
            <figure className="ed-steps-file">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={FIRST_RUN.image} alt={FIRST_RUN.title} loading="lazy" />
              <figcaption>
                <b>content.url</b> · the file this run stored, {FIRST_RUN.title.toLowerCase()}
              </figcaption>
            </figure>
          )}
          {call.response && (
            <>
              <div className="ed-steps-bar is-reply">
                <span>
                  <span className="ed-ok" /> {call.responseLabel}
                </span>
              </div>
              <Code code={call.response} lang="json" className="ed-steps-reply" />
            </>
          )}
          <div className="ed-steps-next">
            {last ? (
              <Link className="fo-btn fo-btn--primary" href="/quickstart">
                Do it yourself <Arrow />
              </Link>
            ) : (
              <button className="fo-btn" onClick={() => setOn(on + 1)}>
                Next: {CALLS[on + 1].title} <Arrow />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** What changed: every entry a fold. Open, it's the entry; folded, one row. */
function History() {
  const [open, setOpen] = useState<number>(0);
  return (
    <section className="ed-history">
      <h2 className="ed-history-h">
        What changed <small>newest first · {CHANGES.length} entries</small>
      </h2>
      {CHANGES.slice(0, 6).map((c, i) => {
        const isOpen = open === i;
        return (
          <div key={c.date + c.title} className={`ed-fold ${isOpen ? 'is-open' : ''}`}>
            <button className="ed-row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
              <span className="ed-row-date">
                <span className="ed-row-dot" />
                {fmtDate(c.date)}
              </span>
              <span className="ed-row-head">{c.title}</span>
              <span className="ed-row-facts">
                {c.tag} · {c.items.length} {c.items.length === 1 ? 'change' : 'changes'}
              </span>
              <span className="ed-row-chev" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div className="ed-body" data-open={isOpen}>
              <div className="ed-body-in">
                <ul>
                  {c.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
      <p className="ed-history-more">
        <Link className="fo-textbtn" href="/changelog">
          The whole changelog <Arrow />
        </Link>
      </p>
    </section>
  );
}
