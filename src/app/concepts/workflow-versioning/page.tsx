import Link from 'next/link';
import { DocsPageShell } from '@/components/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Table } from '@/components/Primitives';

export const metadata = {
  title: 'Workflow versioning',
  description:
    'Workflow templates are immutable and versioned. Publishing a change mints a new version; a movable pointer selects the live one; and every run pins the exact version it executed so artifacts stay reproducible.',
};

// A stable slug carries many immutable versions; a movable pointer selects
// which version operators get by default.
const versionTree = `generate-research-report            ← stable id (slug)
   ├── 2026.05.29   (immutable)
   ├── 2026.06.10   (immutable)   ← canonical (the live default)
   └── 2026.06.18   (immutable)`;

// A run freezes the version + resolved inputs it executed, so the artifact
// is reproducible against the exact definition that produced it.
const runRecord = `run
   ├── workflowId        generate-research-report
   ├── version           2026.06.10        (pinned at run start)
   ├── specVersionHash   sha256:…          (the frozen Specification)
   ├── resolved models   anthropic/claude-opus-4-8, …
   └── artifact          → traces back to this exact version`;

export default function WorkflowVersioningPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Workflow versioning"
        title="Workflow versioning"
        lead={
          <>
            A <Link href="/concepts/workflow-templates">Workflow Template</Link> is{' '}
            <strong>immutable and versioned</strong>. Its id is stable, but its behavior never changes in place:
            editing a template publishes a <em>new version</em>. Each <Link href="/concepts/runs">Run</Link> pins
            the exact version it executed, so the <Link href="/concepts/artifacts">Artifact</Link> it produced stays
            reproducible against the precise definition that made it.
          </>
        }
      />

      <h2>Immutable versions, stable id</h2>
      <p>
        A template has a stable <code>id</code> (its slug) that identifies the job — for example{' '}
        <code>generate-research-report</code> — and one or more <strong>immutable versions</strong> under that id.
        You never mutate a published version. A change to the prompt, the model pin, the step graph, the gates, or
        the budget policy is published as a new version; the old version is kept exactly as it was.
      </p>

      <CodeBlock title="versions under a slug" language="tree">
        {versionTree}
      </CodeBlock>

      <h2>Choosing the live version</h2>
      <p>
        Because the id carries many versions, a <strong>movable pointer</strong> selects which one operators get by
        default — the <code>canonical</code> version. Promotion moves the pointer to a newer version; it never
        edits a version. Older versions remain resolvable so historical runs stay reproducible, and a workflow may
        keep opt-in alternates or operator-only shadow versions alongside its canonical one.
      </p>

      <h2>When to bump a version vs. spawn a sibling</h2>
      <p>
        Bump a version when it&rsquo;s the <em>same job</em> — same input and output contract, same intent — served
        by a different model decision. Spawn a separate workflow when the <em>output identity</em> changes: a
        research-assisted variant is a new template, not a new version of an existing one.
      </p>

      <Table
        head={['Bump', 'When', 'Example']}
        rows={[
          [
            <strong key="p">Patch</strong>,
            'Same model family, newer dated snapshot, no behavioral drift',
            <code key="pe">gpt-image-2-2026-04-21 → gpt-image-2-2026-06-15</code>,
          ],
          [
            <strong key="m">Minor</strong>,
            'Model swap in the same quality/cost class with a documented behavior difference',
            'swap one step’s model within the same tier',
          ],
          [
            <strong key="j">Major</strong>,
            'Material change to style, cost, or output shape',
            'replace the image model with a different one',
          ],
        ]}
      />

      <h2>Runs pin the version</h2>
      <p>
        When a run starts, it resolves the template into a{' '}
        <Link href="/concepts/workflow-specifications">Workflow Specification</Link> — the version&rsquo;s definition
        with this run&rsquo;s inputs slotted in — and records the version and a hash of that frozen specification
        (<code>specVersionHash</code>). Editing or promoting the template later cannot change what an in-flight or
        historical run means: each run is anchored to the exact definition it executed.
      </p>

      <CodeBlock title="what a run pins" language="tree">
        {runRecord}
      </CodeBlock>

      <Callout title="Why immutability">
        Immutable versions make runs reproducible and auditable, keep a template edit from silently changing the
        meaning of past runs, and let a published artifact carry verifiable provenance — the exact version and the
        models that produced it — rather than a hand-maintained label.
      </Callout>

      <h2>On the word &ldquo;manifest&rdquo;</h2>
      <p>
        A <strong>manifest</strong> is the serialized, content-addressed form of a single immutable template
        version — the frozen bundle (input contract, pipeline, per-step policy, output contract) identified by a
        hash. It is not a separate concept layered on top of templates; it is what an immutable version{' '}
        <em>is</em> when written down for storage, comparison, or provenance. The marketing site surfaces a
        version&rsquo;s manifest as the public record of what produced an artifact.
      </p>

      <h2>Related concepts</h2>
      <ul>
        <li>
          <Link href="/concepts/workflow-templates">Workflow templates</Link> — the versioned definitions this
          page governs.
        </li>
        <li>
          <Link href="/concepts/workflow-specifications">Workflow specifications</Link> — the per-run frozen form a
          run pins.
        </li>
        <li>
          <Link href="/concepts/runs">Runs</Link> — pin the version and specification they executed.
        </li>
        <li>
          <Link href="/concepts/artifacts">Artifacts</Link> — trace back to the exact template version that
          produced them.
        </li>
      </ul>
    </DocsPageShell>
  );
}
