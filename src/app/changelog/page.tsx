import { DocsPageShell } from '@/components/DocsPageShell';
import { PageHeader } from '@/components/Primitives';

export const metadata = {
  title: 'Changelog',
  description:
    'Public API and platform changes as Esy formalizes runtime contracts. Breaking changes will land under a new versioned path.',
};

const entries = [
  {
    date: '2026-05-16',
    tag: 'docs',
    title: 'Public reference layer',
    items: [
      'Launched docs.esy.com with the Esy brand system aligned to esy.com and app.esy.com.',
      'Added concept pages for Workflow templates, Runs, Artifacts, and Costs.',
      'Documented the generate-clip-art-asset workflow end-to-end with step-level telemetry.',
      'Introduced the provider cost ledger with estimated, provider-reported, and reconciled states.',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Reference · Changelog"
        title="Changelog"
        lead={
          <>
            Public API and platform changes are tracked here as Esy formalizes runtime contracts. Breaking
            changes will move to a new versioned path; non-breaking additions ship continuously.
          </>
        }
      />

      <div style={{ marginTop: 16 }}>
        {entries.map((entry) => (
          <article key={entry.date} className="changelogEntry">
            <div>
              <div className="changelogDate">{entry.date}</div>
              <span className="changelogTag">{entry.tag}</span>
            </div>
            <div>
              <h3>{entry.title}</h3>
              <ul>
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </DocsPageShell>
  );
}
