// Copied verbatim from esy.com, src/components/NewsletterHome/SeoPageWordmark.tsx (main at a26c26d1, 2026-10-03),
// so docs.esy.com ends the way esy.com does. Re-copy it rather than editing here.
/**
 * SeoPageWordmark — SEOPage's wordmark: "seopage" with a citation
 * superscript, the small numbered mark AI answers put next to a source.
 *
 * Source: components/Logo.tsx in seopage.com (the logo shipped 2026-09-22).
 * The letters take currentColor, like ClipArtWordmark, so they follow the
 * surrounding link color; the badge keeps SEOPage's blue. The badge is sized
 * in em of its own 0.28em text, so the mark scales with font-size.
 *
 * If seopage.com ships an updated logo, re-copy it from that component.
 */
import { Funnel_Display } from 'next/font/google';

// seopage.com's wordmark face, loaded only where this mark renders.
const funnelDisplay = Funnel_Display({ weight: ['600', '700'], subsets: ['latin'], display: 'swap' });

export default function SeoPageWordmark({
  className = '',
  weight = 'regular',
}: {
  className?: string;
  /** 'light' sets the letters a weight down (600), for large display sizes. */
  weight?: 'regular' | 'light';
}) {
  return (
    <span
      role="img"
      aria-label="SEOPage"
      className={`seopage-wordmark ${weight === 'light' ? 'seopage-wordmark--light' : ''} ${funnelDisplay.className} ${className}`}
    >
      seopage
      <span aria-hidden="true" className="seopage-wordmark-badge">1</span>
    </span>
  );
}
