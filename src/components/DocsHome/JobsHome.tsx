'use client';

import Link from 'next/link';

import { INTENTS, kindOf } from './data';
import { QuietNumbers } from './desk-parts';
import { RecentChanges } from './round3-parts';
import { Arrow, DocsFooter, FindPalette, useFind } from './shared';
import { StageTop } from './stage-top';
import './round3.css';

// ───────────────────────────────────────────────────────────────────────────
// G · Jobs: E's top, then the docs sorted by what you're doing. One band per
// job, opened by Folio's 2px navy rule: the job and its line on the left, its
// pages as lines on the right. Nothing to switch between; scan down to yours.
// ───────────────────────────────────────────────────────────────────────────

export default function JobsHome() {
  const find = useFind();
  return (
    <div className="folio sd-app r3-app">
      <StageTop onFind={find.openFind} />

      <section className="r3-sec">
        <div className="sd-frame r3-wide">
          <p className="fo-eyebrow">By what you’re doing</p>
          <h2 className="fo-h2 r3-h2">Find your job. The pages follow.</h2>
          <QuietNumbers />

          {INTENTS.map((t, i) => (
            <section key={t.key} className="jb-band">
              <div className="jb-side">
                <span className="jb-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t.label}</h3>
                <p>{t.line}</p>
              </div>
              <ul className="fo-lines jb-lines">
                {t.pages.map((p) => (
                  <li key={p.href}>
                    <span className="fo-stage">{kindOf(p.href)}</span>
                    <Link className="fo-line-title" href={p.href}>
                      {p.title}
                    </Link>
                    <span className="jb-desc">{p.description}</span>
                    <span className="fo-line-actions">
                      <Link className="fo-textbtn" href={p.href}>
                        Open <Arrow />
                      </Link>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <p className="gd-rest">
            Not here? Search reads every section heading, not just page titles.{' '}
            <button type="button" className="fo-textbtn" onClick={() => find.openFind()}>
              Search the docs <kbd>⌘K</kbd>
            </button>
          </p>
        </div>
      </section>

      <RecentChanges />
      <DocsFooter />
      <FindPalette open={find.open} seed={find.seed} onClose={find.close} />
    </div>
  );
}
