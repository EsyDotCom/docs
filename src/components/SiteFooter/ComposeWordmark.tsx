// Copied verbatim from esy.com, src/components/NewsletterHome/ComposeWordmark.tsx (main at a26c26d1, 2026-10-03),
// so docs.esy.com ends the way esy.com does. Re-copy it rather than editing here.
/**
 * ComposeWordmark — Esy Compose's mark, built from the esy wordmark: "esy" in
 * Black Ops One with its jade first letter, as the site header and
 * compose.esy.com's bar set it. Three ways to carry the name (2026-09-30,
 * /prototypes/home-compose/):
 *
 *   lockup  — esy | COMPOSE: hairline and tracked caps, exactly the header's
 *             "esy | OS" lockup with the product name swapped.
 *   stencil — "compose" set in the esy face itself, jade first letter, so the
 *             product reads as a sibling of the wordmark.
 *   pen     — esy, then "Compose" in Compose's own italic serif (Cormorant),
 *             the stencil for the company and the pen for the product.
 *
 * Everything is sized in em: set font-size on the mark or its parent. The
 * letters take currentColor; the first letter takes --cw-accent (jade).
 */
import { Cormorant_Garamond } from 'next/font/google';
import './ComposeWordmark.css';

// Compose's italic display cut, loaded only where the pen mark renders.
const composeItalic = Cormorant_Garamond({ weight: '600', style: 'italic', subsets: ['latin'], display: 'swap' });

export type ComposeMarkStyle = 'lockup' | 'stencil' | 'pen';

export default function ComposeWordmark({ mark = 'lockup', className = '' }: { mark?: ComposeMarkStyle; className?: string }) {
  return (
    <span role="img" aria-label="Esy Compose" className={`cw cw--${mark} ${className}`}>
      {mark === 'stencil' ? (
        <span className="cw-face" aria-hidden="true">compose</span>
      ) : (
        <>
          <span className="cw-face" aria-hidden="true">esy</span>
          {mark === 'lockup' && <span className="cw-rule" aria-hidden="true" />}
          <span className={mark === 'lockup' ? 'cw-tag' : `cw-pen ${composeItalic.className}`} aria-hidden="true">Compose</span>
        </>
      )}
    </span>
  );
}
