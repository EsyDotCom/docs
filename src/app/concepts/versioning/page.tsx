import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import {
  Callout,
  CodeBlock,
  Diagram,
  DiagramDefs,
  PageHeader,
  PropertyTable,
  Table,
  Takeaways,
} from '@/components/docs/Primitives';

export const metadata = {
  title: 'Versioning',
  description:
    'Immutable workflow versions, a movable live pointer, and the frozen spec each run pins so results stay reproducible.',
};

const pinned = `{
  "id": "run-fb0677b2",
  "templateId": "generate-illustration",
  "workflowVersion": "2026.09.09",
  "specVersionHash": "sha256:eb3ced0c91a625e7ad47beaa28f5ff7b6db933ca5f6cac78fb93c1b030852fdb"
}`;

const versions = `curl -s https://api.esy.com/v1/workflows/generate-illustration/versions \\
  -H "Authorization: Bearer $ESY_API_KEY"`;

export default function VersioningPage() {
  return (
    <DocsPageShell>
      <DiagramDefs />

      <PageHeader
        eyebrow="Core concepts · Versioning"
        title="Versioning"
        opener="versions"
        lead={
          <>
            Workflow definitions are append-only. Editing one publishes a new immutable version and moves
            a pointer; it never rewrites what came before. Every run pins the version it executed, so a
            result from last year is still explainable today.
          </>
        }
      />

      <h2>Versions never change</h2>
      <p>
        A workflow has a stable id — <code>generate-illustration</code> — and a stack of versions beneath
        it. Publishing an edit appends; it does not mutate. A separate movable pointer,{' '}
        <code>canonicalVersionId</code>, decides which version is live for new runs.
      </p>

      <Diagram
        title="Immutable versions, one movable pointer"
        minWidth={860}
        caption={
          <>
            Runs hold a dashed line to the version they executed. Moving the live pointer does not move
            them — which is exactly the point.
          </>
        }
      >
        <svg viewBox="0 0 900 270" role="img" aria-label="Three immutable workflow versions with a live pointer and runs pinned to the version they used">
          <text x="8" y="16" className="dg-hdr">WORKFLOW VERSIONS · APPEND-ONLY</text>

          <rect x="560" y="34" width="130" height="28" rx="14" className="dg-node dg-accent" />
          <text x="625" y="53" className="dg-label-sm" textAnchor="middle">live</text>
          <path d="M625 66 L625 92" className="dg-edge dg-accent" />
          <text x="700" y="53" className="dg-cap">canonicalVersionId</text>

          <rect x="30" y="96" width="200" height="62" rx="7" className="dg-node" />
          <text x="130" y="122" className="dg-label-sm" textAnchor="middle">2026.05.01 · rev 1</text>
          <text x="130" y="140" className="dg-sub" textAnchor="middle">a3f1c9…</text>

          <rect x="270" y="96" width="200" height="62" rx="7" className="dg-node" />
          <text x="370" y="122" className="dg-label-sm" textAnchor="middle">2026.07.24 · rev 2</text>
          <text x="370" y="140" className="dg-sub" textAnchor="middle">7b02de…</text>

          <rect x="525" y="96" width="200" height="62" rx="7" className="dg-node dg-accent" />
          <text x="625" y="122" className="dg-label-sm" textAnchor="middle">2026.09.10 · rev 3</text>
          <text x="625" y="140" className="dg-sub" textAnchor="middle">e41a77…</text>

          <rect x="765" y="96" width="88" height="62" rx="7" className="dg-node dg-ghost" />
          <text x="809" y="122" className="dg-label-sm dg-muted" textAnchor="middle">draft</text>
          <text x="809" y="140" className="dg-sub" textAnchor="middle">not runnable</text>

          <text x="8" y="196" className="dg-cap">each run pins workflowVersion + specVersionHash at creation</text>

          <path d="M130 214 L130 164" className="dg-edge dg-dash" />
          <path d="M330 214 L360 164" className="dg-edge dg-dash" />
          <path d="M600 214 L620 164" className="dg-edge dg-dash" />

          <rect x="60" y="218" width="140" height="34" rx="6" className="dg-node" />
          <text x="130" y="240" className="dg-sub" textAnchor="middle">run-a1b2c3d4</text>
          <rect x="262" y="218" width="140" height="34" rx="6" className="dg-node" />
          <text x="332" y="240" className="dg-sub" textAnchor="middle">run-88fe01aa</text>
          <rect x="530" y="218" width="140" height="34" rx="6" className="dg-node" />
          <text x="600" y="240" className="dg-sub" textAnchor="middle">run-0c7d9e21</text>
        </svg>
      </Diagram>

      <Table
        head={['Field', 'What it does']}
        rows={[
          [
            <code key="a">version</code>,
            'The human label, dated — 2026.09.10. What you quote when discussing behaviour.',
          ],
          [<code key="b">revision</code>, 'Increments on every edit within a version label.'],
          [
            <code key="c">canonicalVersionId</code>,
            'Points at the version new runs will use. Moving it is how you ship.',
          ],
          [
            <code key="d">contentHash</code>,
            'SHA-256 over the key-sorted definition. Identical hashes mean identical definitions.',
          ],
        ]}
      />

      <h2>The frozen spec</h2>
      <p>
        When you create a run, Esy snapshots the workflow definition and combines it with your resolved
        intake into a single hash. That pair is the run&rsquo;s spec, and it is fixed for the life of the
        run.
      </p>

      <CodeBlock title="fields present on every run" language="json">
        {pinned}
      </CodeBlock>

      <PropertyTable
        rows={[
          {
            name: 'workflowVersion',
            type: 'string',
            desc: 'The version label this run executed — not necessarily the one that is live now.',
          },
          {
            name: 'specVersionHash',
            type: 'string',
            desc: (
              <>
                Hash of the frozen definition <em>plus</em> the resolved intake. Two runs with the same
                hash had identical inputs in every respect.
              </>
            ),
          },
          {
            name: 'specId',
            type: 'string | null',
            desc: 'Identifier for the frozen snapshot, where one was persisted separately.',
          },
        ]}
      />

      <p>
        This is what makes a six-month-old run answerable. You can tell whether two outputs differ because
        the inputs differed or because the workflow changed underneath them — compare the hashes.
      </p>

      <Callout title="There is no “Workflow Specification” object" tone="note">
        <p>
          Earlier docs described a first-class <em>Workflow Specification</em> resource. It does not
          exist. The real frozen instance is the <code>workflowVersion</code> +{' '}
          <code>specVersionHash</code> pair above, held on the run.
        </p>
        <p>
          There <em>is</em> an unrelated legacy <code>/v1/specs</code> endpoint with a different shape
          entirely. It is not this, and you should not build against it.
        </p>
      </Callout>

      <h2>Listing versions</h2>
      <CodeBlock title="GET /v1/workflows/{workflow_id}/versions" language="bash">
        {versions}
      </CodeBlock>

      <h2>Bump, or make a sibling?</h2>
      <p>The decision that matters when a workflow needs to change:</p>

      <Table
        head={['The change', 'Do this', 'Why']}
        rows={[
          [
            'Better prompt, same promise and same inputs',
            'New version of the same workflow',
            'Callers need do nothing; saved intakes keep working.',
          ],
          [
            'A better mechanism for a promise already made',
            'Not a version change at all',
            (
              <>
                Capability flag plus conditional step logic. See{' '}
                <Link key="l" href="/concepts/intake">Intake</Link>.
              </>
            ),
          ],
          [
            'New required intake field, or a different output shape',
            'A new workflow id, and deprecate the old one',
            'Existing saved intakes would break. Deprecation names the successor.',
          ],
        ]}
      />

      <p>
        Deprecation is not deletion. A deprecated workflow refuses new runs with a <code>400</code> that
        carries <code>supersededBy</code>, while every historical run still resolves and still explains
        itself.
      </p>

      <h2>Reproducibility in practice</h2>
      <ul>
        <li>
          <strong>Record the version with the output.</strong> If you store artifacts in your own system,
          store <code>workflowVersion</code> and <code>specVersionHash</code> beside them.
        </li>
        <li>
          <strong>Pin models for batch work.</strong> Version pinning covers the workflow, not the
          provider&rsquo;s model. For a catalog, also pin a dated model snapshot via{' '}
          <Link href="/concepts/runs">provider overrides</Link>.
        </li>
        <li>
          <strong>Compare hashes before blaming the model.</strong> Different output with the same hash
          is model non-determinism; different hashes mean the inputs or the definition changed.
        </li>
      </ul>

      <Takeaways
        items={[
          <>Versions are append-only; a movable pointer decides which one is live.</>,
          <>
            Every run pins <code>workflowVersion</code> and <code>specVersionHash</code> at creation.
          </>,
          <>
            A new promise needs a new workflow; a better mechanism for the same promise needs neither.
          </>,
        ]}
      />
    </DocsPageShell>
  );
}
