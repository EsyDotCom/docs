import { notFound } from 'next/navigation';

import DeskHome from '@/components/DocsHome/DeskHome';
import DeskReplayHome from '@/components/DocsHome/DeskReplayHome';
import EditionHome from '@/components/DocsHome/EditionHome';
import GuideHome from '@/components/DocsHome/GuideHome';
import JobsHome from '@/components/DocsHome/JobsHome';
import ReferenceHome from '@/components/DocsHome/ReferenceHome';
import ReplayHome from '@/components/DocsHome/ReplayHome';
import StageDeskHome from '@/components/DocsHome/StageDeskHome';
import PrototypeBar from '@/components/prototypes/PrototypeBar';
import { findPrototype } from '@/components/prototypes/registry';
import '@/brands/folio/folio.css';
import '@/components/DocsHome/docs-home.css';

// The docs homepage in Folio. Round 1, three directions: A · Desk (the app),
// B · Edition (the front page), C · Replay (the run). Round 2, two merges of
// A and C: D · Desk Replay and E · Stage Desk. Round 3, E's top with three
// below-the-folds: F · Guide, G · Jobs, H · Reference. Each is a whole page
// with its own chrome; the floating switcher moves between them.
const VARIANTS: Record<string, () => React.ReactNode> = {
  desk: DeskHome,
  edition: EditionHome,
  replay: ReplayHome,
  'desk-replay': DeskReplayHome,
  'stage-desk': StageDeskHome,
  guide: GuideHome,
  jobs: JobsHome,
  reference: ReferenceHome,
};

const prototype = findPrototype('home')!;

export function generateStaticParams() {
  return prototype.variants.map((v) => ({ variant: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  const v = prototype.variants.find((x) => x.slug === variant);
  return { title: { absolute: v ? `Docs home ${v.key} · ${v.name} — Esy prototypes` : 'Esy prototypes' } };
}

export default async function DocsHomeVariantPage({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  const Home = VARIANTS[variant];
  if (!Home) notFound();

  return (
    <>
      <Home />
      <PrototypeBar prototype={prototype} current={variant} />
    </>
  );
}
