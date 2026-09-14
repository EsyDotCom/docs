import type { Metadata } from 'next';
import { Black_Ops_One, Geist, Geist_Mono, Inter, Literata } from 'next/font/google';

import { DocsLayout } from '@/components/docs/DocsLayout';

// The docs design system is the whole site here, so it loads from the root.
import './docs-theme.css';

/**
 * docs.esy.com is the docs and nothing else, so this is the layout the docs
 * used to nest inside esy.com's, promoted to the root.
 *
 * The fonts are the same five esy.com provided: the docs theme reads them as
 * CSS variables (--font-inter for body, --font-literata for leads,
 * --font-geist-mono for code, --font-black-ops-one for the wordmark).
 *
 * No site-wide `alternates.canonical`: Next inherits it into every page, and on
 * esy.com a canonical of '/docs' told search engines every docs page was a
 * duplicate of the docs home. Without one, each page stands as its own URL.
 */

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const literata = Literata({ variable: '--font-literata', subsets: ['latin'] });
const blackOpsOne = Black_Ops_One({ variable: '--font-black-ops-one', subsets: ['latin'], weight: '400' });

const DESCRIPTION =
  'API, runtime, and workflow reference for Esy — the platform for producing high-quality, reviewable artifacts.';

export const metadata: Metadata = {
  metadataBase: new URL('https://docs.esy.com'),
  title: {
    default: 'Docs — Esy',
    template: '%s — Esy Docs',
  },
  description: DESCRIPTION,
  openGraph: {
    siteName: 'Esy Docs',
    title: 'Docs — Esy',
    description: DESCRIPTION,
    url: 'https://docs.esy.com',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [geistSans, geistMono, inter, literata, blackOpsOne].map((f) => f.variable).join(' ');
  return (
    <html lang="en">
      <body className={fonts}>
        {/* .esy-docs scopes the design system, exactly as it did on esy.com. */}
        <div className="esy-docs">
          <DocsLayout>{children}</DocsLayout>
        </div>
      </body>
    </html>
  );
}
