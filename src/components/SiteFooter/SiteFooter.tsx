import Link from 'next/link';

import { BrandMark } from '@/components/docs/BrandMark';

import ClipArtWordmark from './ClipArtWordmark';
import ComposeWordmark from './ComposeWordmark';
import FooterWorld from './FooterWorld';
import SeoPageWordmark from './SeoPageWordmark';
import './site-footer.css';

// ───────────────────────────────────────────────────────────────────────────
// esy.com's footer on docs.esy.com (2026-10-03): the factory world, with the
// footer as a card floating over it. The markup is esy.com's
// src/components/Home/footer.tsx in its light theme (light is that site's
// standard too), with two docs changes: the card carries the product's
// lockup, esy | OS, as Folio's footer rule says, and its links go back to
// esy.com by full URL. "From Esy" adds OS before Compose.
// ───────────────────────────────────────────────────────────────────────────

const ESY = 'https://esy.com';

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: 'Products',
    links: [
      ['OS', 'https://os.esy.com'],
      ['Compose', 'https://compose.esy.com'],
    ],
  },
  {
    title: 'Read',
    links: [
      ['The Marketing Engineer', `${ESY}/engineer/`],
      ['AI Marketing News', `${ESY}/news/`],
      ['Topics', `${ESY}/topics/`],
      ['Editorial standards', `${ESY}/editorial-standards/`],
      ['Docs', '/'],
    ],
  },
  {
    title: 'Watch & learn',
    links: [
      ['Courses', `${ESY}/courses/`],
      ['Films', `${ESY}/films/`],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About', `${ESY}/about/`],
      ['Contact', 'mailto:zev@esy.com'],
      ['Privacy', `${ESY}/privacy/`],
      ['Terms', `${ESY}/terms/`],
    ],
  },
];

/** The page ending: the world, then the footer card over it. `world` swaps the scene (the 404 prototypes do). */
export default function SiteFooter({ world }: { world?: React.ReactNode } = {}) {
  return (
    <>
      {world ?? <FooterWorld />}
      <footer className="footer footer--light">
        <div className="footer-overlay" />

        <div className="footer-content">
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label="Esy OS docs home">
              <BrandMark />
            </Link>
            <p className="footer-desc">
              <strong>Build the AI systems that run marketing.</strong>
              <br />
              One email a week, and AI Marketing News every day.
            </p>
            <div className="footer-socials">
              <a href="https://www.youtube.com/@EsyDotCom" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/zevuhuru/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://x.com/ESYdotcom" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {COLUMNS.map((c) => (
            <div key={c.title} className="footer-column">
              <h4>{c.title}</h4>
              <div className="footer-links">
                {c.links.map(([text, href]) =>
                  href.startsWith('/') ? (
                    <Link key={text} href={href} className="footer-link">
                      {text}
                    </Link>
                  ) : (
                    <a key={text} href={href} className="footer-link">
                      {text}
                    </a>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>

        {/* From Esy: the apps as their own wordmarks, in one row. OS sits before
            Compose, set like it: the esy stencil face with its first letter in jade. */}
        <div className="footer-extended">
          <h4>From Esy</h4>
          <div className="footer-extended-links footer-marks">
            <a href="https://clip.art" target="_blank" rel="noopener noreferrer" className="footer-mark" aria-label="clip.art">
              <ClipArtWordmark className="footer-mark-clipart" />
            </a>
            <a href="https://seo.page" target="_blank" rel="noopener noreferrer" className="footer-mark footer-mark--seopage" aria-label="SEOPage">
              <SeoPageWordmark weight="light" />
            </a>
            <a href="https://os.esy.com" target="_blank" rel="noopener noreferrer" className="footer-mark footer-mark--os" aria-label="Esy OS">
              <span className="cw cw--stencil" role="img" aria-label="Esy OS">
                <span className="cw-face" aria-hidden="true">OS</span>
              </span>
            </a>
            <a href="https://compose.esy.com" target="_blank" rel="noopener noreferrer" className="footer-mark footer-mark--compose" aria-label="Esy Compose">
              <ComposeWordmark mark="stencil" />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024-2026 ESY, LLC. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
