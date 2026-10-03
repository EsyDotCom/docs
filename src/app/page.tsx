import { cormorant } from '@/brands/folio/font';
import GuideHome from '@/components/DocsHome/GuideHome';
import '@/brands/folio/folio.css';
import '@/components/DocsHome/docs-home.css';

export const metadata = {
  title: 'Esy API documentation',
  description:
    'AI marketing production, through one API. Brief in, approved assets out: every image, video and post checked, costed and traceable.',
};

/**
 * The homepage is F · Guide from /prototypes/home (shipped 2026-10-03): the
 * stage (headline, search, a replay of the quickstart's real run), then the
 * docs as five chapters read in order. It brings its own Folio chrome, so
 * DocsFrame leaves the sidebar off this one page.
 */
export default function DocsHome() {
  return (
    <div className={cormorant.variable}>
      <GuideHome />
    </div>
  );
}
