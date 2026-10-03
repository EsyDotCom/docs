'use client';

import Link from 'next/link';

import { APP_URL, CHANGES, PRINCIPLES, START, fmtDate, navigation } from './data';
import { Arrow, DocsFooter, FindButton, FindPalette, Lockup, useFind } from './shared';
import { Replay, StageHero } from './stage';
import './replay.css';

// ───────────────────────────────────────────────────────────────────────────
// C · Replay: Folio's marketing page (the flat navy hero, the glass device,
// numbered chapters) turned to the docs. Search sits in the hero. The device
// replays the quickstart's real run, run-fb0677b2: its real requests and
// responses on the left, its step telemetry on the right, ending on the file
// it stored. Under the hero, every page on one map.
// ───────────────────────────────────────────────────────────────────────────

const TOP: [string, string][] = [
  ['Quickstart', '/quickstart'],
  ['How Esy works', '/how-esy-works'],
  ['API', '/api'],
  ['Guides', '/guides'],
  ['Changelog', '/changelog'],
];

export default function ReplayHome() {
  const find = useFind();
  return (
    <div className="folio rp-app">
      <section className="rp-hero">
        <div className="rp-glow" aria-hidden="true" />
        <nav className="rp-nav" aria-label="Docs">
          <Lockup tone="light" />
          <div className="rp-nav-links">
            {TOP.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </div>
          <div className="rp-nav-end">
            <FindButton tone="navy" label="Search" onOpen={() => find.openFind()} />
            <a className="fo-btn fo-btn--light" href={APP_URL}>
              Get an API key
            </a>
          </div>
        </nav>

        <StageHero onFind={find.openFind} />

        <Replay />
      </section>

      {/* ── Three pages, in this order ───────────────────────────────── */}
      <section className="rp-band">
        <div className="rp-wrap">
          <p className="fo-eyebrow">New here</p>
          <h2 className="fo-h2">Three pages, in this order.</h2>
          <ol className="fo-promises rp-start">
            {START.map((s, i) => (
              <li key={s.item.href}>
                <span className="rp-start-n">{String(i + 1).padStart(2, '0')}</span>
                <b>
                  <Link href={s.item.href}>{s.item.title}</Link>
                </b>
                <p>{s.gist}</p>
                <Link className="fo-textbtn rp-start-go" href={s.item.href}>
                  Read it · {s.minutes} min <Arrow />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Atlas onSearch={() => find.openFind()} />

      {/* ── Principles, then what changed ────────────────────────────── */}
      <section className="rp-band rp-band--tint">
        <div className="rp-wrap rp-two">
          <div>
            <p className="fo-eyebrow">What Esy holds itself to</p>
            <ol className="rp-principles">
              {PRINCIPLES.map((p, i) => (
                <li key={p.title}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <b>{p.title}</b>
                    <p>{p.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="fo-eyebrow">What changed</p>
            <ol className="fo-log rp-log">
              {CHANGES.slice(0, 5).map((c, i) => (
                <li key={c.date + c.title}>
                  <span className="fo-log-time">{fmtDate(c.date)}</span>
                  <span className={`fo-log-dot ${i === 0 ? 'is-you' : ''}`} />
                  <span>
                    <Link href="/changelog" className="rp-log-title">
                      {c.title}
                    </Link>
                    <small>{c.tag}</small>
                  </span>
                </li>
              ))}
            </ol>
            <Link className="fo-textbtn" href="/changelog">
              The whole changelog <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="fo-close rp-close">
        <div className="rp-wrap">
          <h2 className="rp-close-h">
            Your first run takes <em>five minutes.</em>
          </h2>
          <p>Set a key, then three calls. You’ll have a file and its receipt at the end.</p>
          <div className="rp-close-actions">
            <Link className="fo-btn fo-btn--light fo-btn--big" href="/quickstart">
              Open the quickstart <Arrow />
            </Link>
            <a className="fo-textbtn fo-textbtn--light" href={APP_URL}>
              Get an API key in os.esy.com <Arrow up />
            </a>
          </div>
        </div>
      </section>

      <DocsFooter />
      <FindPalette open={find.open} seed={find.seed} onClose={find.close} />
    </div>
  );
}

// ── Every page, on one map ─────────────────────────────────────────────────

/** Section art (public/brand/docs), one per section: generated through Esy's own clip-art workflow. */
const ART: Record<string, string> = {
  'Get started': 'handoff',
  'Core concepts': 'pipeline',
  'API reference': 'keys',
  Automation: 'shift',
  Publishing: 'docks',
  'Image quality contracts': 'review',
  Guides: 'template',
  Resources: 'versions',
};

function Atlas({ onSearch }: { onSearch: () => void }) {
  return (
    <section className="rp-band rp-atlas-band">
      <div className="rp-wrap">
        <div className="rp-atlas-head">
          <div>
            <p className="fo-eyebrow">Every page</p>
            <h2 className="fo-h2">The whole docs, on one map.</h2>
          </div>
          <button type="button" className="fo-textbtn" onClick={onSearch}>
            Or search inside them <kbd>⌘K</kbd>
          </button>
        </div>
        <div className="rp-atlas">
          {navigation.map((s) => (
            <div key={s.title} className="rp-atlas-group">
              <div className="rp-atlas-gh">
                <b>{s.title}</b>
                <span>{s.items.length}</span>
                {ART[s.title] && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={`/brand/docs/${ART[s.title]}.webp`} alt="" aria-hidden="true" loading="lazy" />
                )}
              </div>
              <ul>
                {s.items.map((item) => (
                  <li key={item.href}>
                    {item.external ? (
                      <a href={item.href}>
                        {item.title} <Arrow up />
                      </a>
                    ) : (
                      <Link href={item.href}>{item.title}</Link>
                    )}
                    {item.description && <small>{item.description}</small>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
