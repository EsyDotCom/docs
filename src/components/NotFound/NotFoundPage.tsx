import Link from 'next/link';

import { BrandMark } from '@/components/docs/BrandMark';
import SiteFooter from '@/components/SiteFooter/SiteFooter';

import { NotFoundMessage, NotFoundWorld, type NotFoundTake } from './NotFound';

export type { NotFoundTake };

/** A 404 prototype as a whole page: a bar, the message, then the footer over the take's reef. */
export default function NotFoundPage({ take }: { take: NotFoundTake }) {
  return (
    <div className="nf">
      <header className="nf-bar">
        <Link href="/" aria-label="Esy docs home">
          <BrandMark />
        </Link>
      </header>
      <NotFoundMessage take={take} />
      <SiteFooter world={<NotFoundWorld take={take} />} />
    </div>
  );
}
