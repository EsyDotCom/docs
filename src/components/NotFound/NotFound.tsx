import Link from 'next/link';

import { DriftedScene, InkScene, PieceScene } from './scenes';

// The docs 404, as parts (2026-10-06). A message with the way back, and a
// reef world told by Mason (SiteFooter/mason) that takes the footer world's
// place: on a page with an .nf-world, the usual footer world steps aside
// (not-found.css), so the footer card floats over this one instead.
//
//   NotFoundPiece — B · Missing piece: live as docs.esy.com's 404.
//   NotFoundInk   — C · Ink.
// A · Drifted stays a prototype only (/prototypes/not-found/drifted).

export type NotFoundTake = 'drifted' | 'piece' | 'ink';

const COPY: Record<NotFoundTake, { title: string; line: string }> = {
  drifted: {
    title: 'This page drifted off.',
    line: 'The address you followed doesn’t match a page in the docs. It may have moved, or it never existed. Mason’s still looking; these are a good place to start meanwhile.',
  },
  piece: {
    title: 'That piece isn’t here.',
    line: 'We looked for the page you asked for, and it isn’t part of the docs. Try one of these instead.',
  },
  ink: {
    title: 'This page vanished in a cloud of ink.',
    line: 'Octopuses ink when something startles them. This link startled us: there’s no page at this address. These will get you back on course.',
  },
};

const SCENES: Record<NotFoundTake, () => React.ReactNode> = { drifted: DriftedScene, piece: PieceScene, ink: InkScene };

/** The message and the way back. */
export function NotFoundMessage({ take }: { take: NotFoundTake }) {
  return (
    <div className="nf-msg">
      <p className="nf-kicker">404</p>
      <h1>{COPY[take].title}</h1>
      <p>{COPY[take].line}</p>
      <nav className="nf-links" aria-label="Where to go instead">
        <Link href="/">Docs home</Link>
        <Link href="/quickstart">Quickstart</Link>
        <Link href="/api">API reference</Link>
        <Link href="/changelog">Changelog</Link>
      </nav>
    </div>
  );
}

/** The reef that tells the 404, in the footer world's wrapper. */
export function NotFoundWorld({ take }: { take: NotFoundTake }) {
  const Scene = SCENES[take];
  return (
    <div className="fw bs-fw nf-world" aria-hidden="true">
      <Scene />
    </div>
  );
}

/** B · Missing piece: Mason tries a piece marked 404 in his gate, and it doesn't fit. */
export function NotFoundPiece() {
  return (
    <>
      <NotFoundMessage take="piece" />
      <NotFoundWorld take="piece" />
    </>
  );
}

/** C · Ink: a cloud of ink clears to show 4-0-4 set in slabs on the seabed. */
export function NotFoundInk() {
  return (
    <>
      <NotFoundMessage take="ink" />
      <NotFoundWorld take="ink" />
    </>
  );
}
