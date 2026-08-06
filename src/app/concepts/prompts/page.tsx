import Link from 'next/link';
import { DocsPageShell } from '@/components/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Table } from '@/components/Primitives';

export const metadata = {
  title: 'Prompts',
  description:
    'A prompt is authored once and referenced, never copied into the templates that use it. Editing publishes an immutable version; a movable pointer selects the live one; and every run records the exact version it executed.',
};

// A step names a prompt instead of carrying one. The ref follows `live`, so a
// promotion reaches every step pointing at it on the next run.
const stepReference = `{
  "id": "step-1",
  "name": "Draft the brief",
  "kind": "llm",
  "systemPromptRef": {
    "slug": "research-analyst",
    "alias": "live"
  }
}`;

// Publishing and promoting are separate acts: v3 exists but nothing runs it
// until the pointer moves.
const versionState = `research-analyst              ← stable slug
   ├── v1   "You are an analyst…"      (immutable)
   ├── v2   "You are a careful…"       (immutable)   ← live
   └── v3   "You are a careful…"       (immutable)   published, NOT live`;

// What a run records, so an artifact traces to the exact text that made it.
const provenance = `run.registryRefs
   └── steps
        └── step-1
             ├── itemId    prm-8f2b41
             ├── slug      research-analyst
             ├── version   2            ← the concrete version, not "live"
             └── alias     live         ← how it was chosen`;

export default function PromptsPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Prompts"
        title="Prompts"
        lead={
          <>
            A prompt is authored <strong>once</strong> and referenced by the steps that use it — never copied into
            them. Editing publishes a new immutable version; a movable pointer selects which version runs; and
            every <Link href="/concepts/runs">Run</Link> records the exact version it executed, so an{' '}
            <Link href="/concepts/artifacts">Artifact</Link> traces back to the precise text that produced it.
          </>
        }
      />

      <h2>Why a prompt is not part of a template</h2>
      <p>
        A <Link href="/concepts/workflow-templates">Workflow Template</Link> could carry its prompt inline, and the
        first one always does. The trouble starts at the second: the same instruction gets pasted into another
        template, then a third, and the copies drift. Improving the wording means finding every copy, and{' '}
        <em>which workflows use this prompt?</em> has no answer — because there is no <em>this prompt</em>, only
        several similar paragraphs.
      </p>

      <Callout title="A workflow references; it does not define.">
        The template names the prompt it needs. One edit, made in one place, reaches every template that points at
        it — on their next run, without reopening any of them.
      </Callout>

      <h2>Referencing a prompt from a step</h2>
      <p>
        A step names a prompt through <code>systemPromptRef</code>. The reference identifies the prompt by{' '}
        <code>slug</code> or <code>itemId</code>, and says which version to use: <code>alias</code> to follow a
        moving pointer, or <code>version</code> to pin one.
      </p>

      <CodeBlock title="a step that references its prompt" language="json">
        {stepReference}
      </CodeBlock>

      <p>
        A step may also carry an inline <code>system</code> string, and many still do. When both are present the{' '}
        <strong>reference wins</strong>. That is what makes adopting the library safe: a template can be given a
        reference while keeping its inlined text, and if anything is wrong the fix is deleting the reference rather
        than recovering text that was overwritten.
      </p>

      <h2>Publishing is not promoting</h2>
      <p>
        Editing a prompt never changes what is running. Saving publishes a new <strong>immutable version</strong>;
        a separate act moves the <code>live</code> pointer to it. The gap between the two is the point — it is
        where you read the diff.
      </p>

      <CodeBlock title="a published edit that is not yet live" language="tree">
        {versionState}
      </CodeBlock>

      <Table
        head={['Act', 'What it changes', 'What runs']}
        rows={[
          ['Edit and publish', 'Adds a new immutable version', 'Nothing — the live pointer has not moved'],
          ['Promote', 'Moves the live pointer to that version', 'Every step following the alias, on its next run'],
          ['Pin a version', 'Freezes one step at a version number', 'That step, unaffected by future promotions'],
        ]}
      />

      <Callout title="Nothing is ever edited in place.">
        A published version is never mutated, so a run from last month can still be read against the exact text
        that produced it. Promotion moves a pointer; it does not rewrite history.
      </Callout>

      <h2>Resolution and provenance</h2>
      <p>
        References resolve in <strong>preflight</strong> — before any step executes, and therefore before any
        provider is paid. A step that cannot resolve its prompt is a run that was never configured, and discovering
        that at step four means steps one through three already spent money on an artifact that can never finish.
      </p>
      <p>
        What the run records is the <em>concrete version</em>, never the alias alone. <code>live</code> moves; the
        record must not.
      </p>

      <CodeBlock title="what a run records" language="tree">
        {provenance}
      </CodeBlock>

      <h2>The API</h2>

      <Table
        head={['Endpoint', 'Purpose']}
        rows={[
          [
            <code key="a">GET /v1/prompts</code>,
            <>
              List prompts. Add <code>?include=live</code> to get each one&rsquo;s current text in the same
              request.
            </>,
          ],
          [<code key="b">POST /v1/prompts</code>, 'Create a prompt and publish its first version together.'],
          [
            <code key="c">POST /v1/prompts/{'{id}'}/versions</code>,
            'Publish a new version. Nothing that runs changes until it is made live.',
          ],
          [
            <code key="d">POST /v1/prompts/{'{id}'}/aliases</code>,
            'Move the live pointer. This is the act that changes what runs.',
          ],
          [
            <code key="e">GET /v1/prompts/{'{id}'}/moves</code>,
            'The promotion history: which version went live, when, and the note left with it.',
          ],
          [
            <code key="f">GET /v1/prompts/resolve</code>,
            'Resolve a reference to concrete text and the version number a run must record.',
          ],
        ]}
      />

      <Callout title="An item always has a version.">
        Creating a prompt publishes v1 in the same request. A prompt with no version is a resource nothing can
        reference, which is never a useful state to persist.
      </Callout>

      <h2>Prompts and classifiers are the same shape</h2>
      <p>
        <Link href="/concepts/classification">Classifiers</Link> — the named label sets a template classifies
        against — follow exactly this model: authored once, referenced by templates, immutable versions, a movable{' '}
        <code>live</code> pointer, and the resolved version recorded in run provenance.
      </p>
      <p>
        They are separate collections because they are different things, but the versioning contract is identical,
        which is why promoting either behaves the same way and reads the same way in a run&rsquo;s record.
      </p>
    </DocsPageShell>
  );
}
