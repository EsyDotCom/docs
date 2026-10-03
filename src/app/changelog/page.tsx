import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { PageHeader } from '@/components/docs/Primitives';
import { changelog } from '@/lib/changelog';

export const metadata = {
  title: 'Changelog',
  description:
    'Public API and platform changes as Esy formalizes runtime contracts. Breaking changes will land under a new versioned path.',
};

export default function ChangelogPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Resources · Changelog"
        title="Changelog"
        lead={
          <>
            Public API and platform changes are tracked here as Esy formalizes runtime contracts. Breaking
            changes will move to a new versioned path; non-breaking additions ship continuously.
          </>
        }
      />

      <div style={{ marginTop: 16 }}>
        {changelog.map((entry) => (
          <article key={`${entry.date}-${entry.title}`} className="changelogEntry">
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
