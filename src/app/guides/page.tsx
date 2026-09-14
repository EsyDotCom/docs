import Link from 'next/link';
import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { PageHeader } from '@/components/docs/Primitives';

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
  {
    href: '/guides/compose-with-artifact-inputs',
    label: 'composition',
    title: 'Compose with artifact inputs',
    desc: 'Let a workflow accept an existing artifact as input — supply a report you already have, or let the workflow generate one.',
  },
  {
    href: '/guides/publish-packs-with-a-worker-team',
    label: 'workers',
    title: 'Publish packs with a worker team',
    desc: 'Build a crew that plans a themed pack every day, generates every asset, composes a cover, and publishes the finished pack to your own site.',
  },
  {
    href: '/guides/connect-a-consumer-site',
    label: 'publishing',
    title: 'Connect a consumer site',
    desc: 'Render a public publication on your own site and verify Esy’s revalidation webhooks with an HMAC signature.',
  },
  {
    href: '/guides/send-articles-to-beehiiv',
    label: 'newsletters',
    title: 'Send articles to Beehiiv',
    desc: 'Connect a publication to your Beehiiv newsletter and turn any article into a reviewed, email-safe draft — no auto-sending.',
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
    <DocsPageShell>
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
    </DocsPageShell>
  );
}
