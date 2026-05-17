import Link from 'next/link';
import { PageHeader } from '@/components/Primitives';

export const metadata = {
  title: 'Guides',
  description:
    'Step-by-step walkthroughs for the workflow templates running in Esy production, with full request, runtime, and response detail.',
};

const guides = [
  {
    href: '/guides/generate-clip-art-asset',
    label: 'clip-art',
    title: 'Generate a clip-art asset',
    desc: 'Run the generate-clip-art-asset workflow end-to-end and read back the artifact, step telemetry, and cost ledger.',
  },
];

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
      <path
        d="M3.5 8h9M8.5 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GuidesIndexPage() {
  return (
    <div className="content contentNarrow">
      <PageHeader
        eyebrow="Reference · Guides"
        title="Guides"
        lead={
          <>
            Step-by-step walkthroughs for the workflow templates running in production. Each guide covers the
            request shape, runtime steps, response, and how to inspect the resulting telemetry and costs.
          </>
        }
      />

      <div className="atlasGrid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', marginTop: 32 }}>
        {guides.map((guide, i) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="atlasCard"
            data-index={String(i + 1).padStart(2, '0')}
          >
            <span className="atlasCardLabel">{guide.label}</span>
            <h3>{guide.title}</h3>
            <p>{guide.desc}</p>
            <span className="atlasArrow">
              Read <Arrow />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
