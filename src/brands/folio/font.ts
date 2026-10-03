import { Cormorant_Garamond } from 'next/font/google';

// Folio's serif. It loads only where Folio renders (the homepage and the
// prototypes), as os.esy.com does: wrap the Folio root's parent in
// `cormorant.variable` and folio.css reads --font-cormorant.
export const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
});
