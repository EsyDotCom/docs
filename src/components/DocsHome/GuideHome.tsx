'use client';

import Link from 'next/link';

import SiteFooter from '@/components/SiteFooter/SiteFooter';

import { GUIDE, kindOf } from './data';
import { QuietNumbers } from './desk-parts';
import { RecentChanges } from './round3-parts';
import { Arrow, FindPalette, useFind } from './shared';
import { StageTop } from './stage-top';
import './round3.css';

// ───────────────────────────────────────────────────────────────────────────
// F · Guide: E's top, then the docs as five chapters read in order, from a
// first run to shipping. One reading column, a chapter number in the margin,
// each chapter's pages as lines under it. Everything else is one search away.
// ───────────────────────────────────────────────────────────────────────────

export default function GuideHome() {
  const find = useFind();
  return (
    <div className="folio sd-app r3-app">
      <StageTop onFind={find.openFind} />

      <section className="r3-sec">
        <div className="sd-frame r3-col">
          <p className="fo-eyebrow">Read in order</p>
          <h2 className="fo-h2 r3-h2">Five chapters, from a first run to shipping.</h2>
          <QuietNumbers />

          <ol className="gd-chapters">
            {GUIDE.map((c, i) => (
              <li key={c.title} className="gd-ch">
                <span className="gd-n">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="gd-title">{c.title}</h3>
                  <p className="gd-line">{c.line}</p>
                  <ul className="gd-pages">
                    {c.pages.map((p) => (
                      <li key={p.href}>
                        <Link href={p.href}>
                          <b>{p.title}</b>
                          <span>{p.description}</span>
                        </Link>
                        <span className="fo-stage">{kindOf(p.href)}</span>
                      </li>
                    ))}
                  </ul>
                  {i === 0 && (
                    <Link className="fo-btn fo-btn--primary gd-go" href="/quickstart">
                      Start with the quickstart <Arrow />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <p className="gd-rest">
            That’s the spine. The other pages are details of these, and one search away.{' '}
            <button type="button" className="fo-textbtn" onClick={() => find.openFind()}>
              Search the docs <kbd>⌘K</kbd>
            </button>
          </p>
        </div>
      </section>

      <RecentChanges />
      <SiteFooter />
      <FindPalette open={find.open} seed={find.seed} onClose={find.close} />
    </div>
  );
}
