'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { APP_URL } from './data';
import { FindButton, Lockup } from './shared';
import { Replay, StageHero } from './stage';
import './merges.css';

// ───────────────────────────────────────────────────────────────────────────
// E's top, shared by E and round 3 (F, G, H) so it is the same in each: a bar
// that starts navy over the hero and becomes Folio's raised paper bar past
// it, then C's hero (headline, search) and the replay. Only what comes below
// the fold changes between them.
// ───────────────────────────────────────────────────────────────────────────

const TOP: [string, string][] = [
  ['Quickstart', '/quickstart'],
  ['How Esy works', '/how-esy-works'],
  ['API', '/api'],
  ['Guides', '/guides'],
  ['Changelog', '/changelog'],
];

export function StageTop({ onFind }: { onFind: (q?: string) => void }) {
  const hero = useRef<HTMLElement>(null);
  const [solid, setSolid] = useState(false);

  // The bar turns to paper once the hero has scrolled up under it.
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > (hero.current?.offsetHeight ?? 0) - 64);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`sd-bar ${solid ? 'is-solid' : ''}`}>
        <div className="sd-bar-in">
          <Lockup tone={solid ? 'ink' : 'light'} />
          <nav className="sd-nav" aria-label="Docs">
            {TOP.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="sd-bar-end">
            <FindButton tone={solid ? 'paper' : 'navy'} label="Search" onOpen={() => onFind()} />
            <a className={`fo-btn ${solid ? 'fo-btn--primary' : 'fo-btn--light'}`} href={APP_URL}>
              Get an API key
            </a>
          </div>
        </div>
      </header>

      <section className="rp-hero sd-hero" ref={hero}>
        <div className="rp-glow" aria-hidden="true" />
        <StageHero onFind={onFind} />
        <Replay />
      </section>
    </>
  );
}
