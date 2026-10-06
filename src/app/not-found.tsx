import { NotFoundPiece } from '@/components/NotFound/NotFound';

export const metadata = {
  title: 'Page not found',
};

/**
 * docs.esy.com's 404 (2026-10-06): B · Missing piece from
 * /prototypes/not-found. Mason tries a piece marked 404 in his gate and it
 * doesn't fit. It sits in the docs chrome like any page; its reef takes the
 * footer world's place.
 */
export default function NotFound() {
  return <NotFoundPiece />;
}
