'use client';

import Link from 'next/link';

import { ENDPOINTS, ESSENTIALS, allApiPages } from './data';
import { RecentChanges } from './round3-parts';
import { Arrow, CopyButton, DocsFooter, FindPalette, useFind } from './shared';
import { StageTop } from './stage-top';
import './round3.css';

// ───────────────────────────────────────────────────────────────────────────
// H · Reference: E's top, then a page for looking things up. The facts true
// of every call as a spec table you can copy from, every endpoint with a
// reference card grouped by resource, and what changed. Built for the second
// visit, not the first.
// ───────────────────────────────────────────────────────────────────────────

const CALL_COUNT = ENDPOINTS.reduce((n, g) => n + g.calls.length, 0);
const CARDED = new Set(ENDPOINTS.map((g) => g.page.href));

export default function ReferenceHome() {
  const find = useFind();
  return (
    <div className="folio sd-app r3-app">
      <StageTop onFind={find.openFind} />

      <section className="r3-sec">
        <div className="sd-frame r3-col">
          <p className="fo-eyebrow">Look it up</p>
          <h2 className="fo-h2 r3-h2">The facts, the endpoints, and what changed.</h2>

          {/* ── The essentials: label · value · copy, each label linking to its page ── */}
          <section className="fo-tier">
            <div className="fo-tier-head">
              <b>The essentials</b>
              <span>True of every call.</span>
            </div>
            <dl className="rf-spec">
              {ESSENTIALS.map((e) => (
                <div key={e.label}>
                  <dt>
                    <Link href={e.href}>{e.label}</Link>
                  </dt>
                  <dd>
                    <code>{e.value}</code>
                  </dd>
                  <span>{e.copy && <CopyButton text={e.value} />}</span>
                </div>
              ))}
            </dl>
          </section>

          {/* ── Endpoints, by resource ── */}
          <section className="fo-tier">
            <div className="fo-tier-head">
              <b>Endpoints</b>
              <span>
                {CALL_COUNT} with a reference card, by resource.
              </span>
            </div>
            {ENDPOINTS.map((g) => (
              <div key={g.page.href} className="rf-group">
                <h3>
                  <Link href={g.page.href}>{g.page.title}</Link>
                  <span>{g.page.description}</span>
                </h3>
                <ul>
                  {g.calls.map((c) => (
                    <li key={c.method + c.path}>
                      <Link href={g.page.href}>
                        <span className={`rf-m is-${c.method.toLowerCase()}`}>{c.method}</span>
                        <code>{c.path}</code>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="rf-more">
              <span>More API pages</span>
              {allApiPages
                .filter((p) => !CARDED.has(p.href))
                .map((p) => (
                  <Link key={p.href} href={p.href}>
                    {p.title}
                  </Link>
                ))}
            </p>
          </section>

          <p className="gd-rest">
            Looking for a status code, a field or a heading?{' '}
            <button type="button" className="fo-textbtn" onClick={() => find.openFind()}>
              Search the docs <kbd>⌘K</kbd>
            </button>{' '}
            <a className="fo-textbtn" href="https://api.esy.com/openapi.json">
              openapi.json <Arrow up />
            </a>
          </p>
        </div>
      </section>

      <RecentChanges />
      <DocsFooter />
      <FindPalette open={find.open} seed={find.seed} onClose={find.close} />
    </div>
  );
}
