import type { Metadata } from 'next';

import { cormorant } from '@/brands/folio/font';

// Prototypes: clickable directions we compare before shipping, the same
// pattern as esy.com/prototypes. Never indexed, never in search or the
// sitemap, and outside the docs chrome (DocsFrame renders them bare).
// Cormorant is Folio's serif, and Folio is what these try.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PrototypesLayout({ children }: { children: React.ReactNode }) {
  return <div className={cormorant.variable}>{children}</div>;
}
