'use client';

import Link from 'next/link';

import { CHANGES, fmtDate } from './data';
import { Arrow } from './shared';

/** What changed, as Folio's log: the same last band under F, G and H. */
export function RecentChanges() {
  return (
    <section className="r3-sec r3-sec--tint">
      <div className="sd-frame r3-col">
        <p className="fo-eyebrow">What changed</p>
        <ol className="fo-log r3-log">
          {CHANGES.slice(0, 5).map((c, i) => (
            <li key={c.date + c.title}>
              <span className="fo-log-time">{fmtDate(c.date)}</span>
              <span className={`fo-log-dot ${i === 0 ? 'is-you' : ''}`} />
              <span>
                <Link href="/changelog" className="r3-log-title">
                  {c.title}
                </Link>
                <small>
                  {c.tag} · {c.items[0]}
                </small>
              </span>
            </li>
          ))}
        </ol>
        <Link className="fo-textbtn" href="/changelog">
          The whole changelog <Arrow />
        </Link>
      </div>
    </section>
  );
}
