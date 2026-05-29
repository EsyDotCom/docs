import { DocsPageShell } from '@/components/DocsPageShell';
import { CodeBlock, PageHeader, Table } from '@/components/Primitives';

export const metadata = {
  title: 'Artifacts',
  description:
    'Generated outputs — visual, video, research, or knowledge — with full provenance back to the workflow and run that produced them.',
};

const artifactExample = `{
  "id": "artifact-0dc32dbb",
  "runId": "run-a1b2c3d4",
  "templateId": "generate-clip-art-asset",
  "artifactClass": "visual",
  "status": "review",
  "content": {
    "type": "image",
    "url": "https://images.esy.com/artifacts/clip-art/artifact-0dc32dbb/processed.webp",
    "storageKey": "artifacts/clip-art/artifact-0dc32dbb/processed.webp",
    "mimeType": "image/webp",
    "width": 1024,
    "height": 1024
  },
  "createdAt": "2026-05-16T22:14:43.711Z"
}`;

const namespace = `artifacts/{artifactType}/{artifactId}/raw.webp
artifacts/{artifactType}/{artifactId}/processed.webp`;

const researchExample = `{
  "id": "artifact-7c4e91aa",
  "runId": "run-9f8e7d6c",
  "templateId": "generate-research-report",
  "artifactClass": "research",
  "status": "review",
  "content": {
    "type": "research-report",
    "title": "The economics of desalination",
    "summary": "A structured synthesis of cost drivers, energy intensity, and...",
    "sections": [
      { "heading": "Cost drivers", "body": "..." },
      { "heading": "Energy intensity", "body": "..." }
    ],
    "sources": ["IEA 2025 desalination outlook", "..."]
  },
  "createdAt": "2026-05-29T15:02:11.004Z"
}`;

export default function ArtifactsPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Artifacts"
        title="Artifacts"
        lead={
          <>
            Artifacts are the durable outputs produced by workflow runs — visual, video, research, or knowledge.
            Every artifact carries provenance back to the workflow and run that produced it.
          </>
        }
      />

      <h2>Artifact classes</h2>
      <Table
        head={['Class', 'Content']}
        rows={[
          [<code key="v">visual</code>, 'Images: clip art, illustrations, coloring pages, covers.'],
          [<code key="vd">video</code>, 'Short-form video: scenes, stitched films, animations.'],
          [<code key="r">research</code>, 'Structured research outputs and screenplays.'],
          [<code key="k">knowledge</code>, 'Project state, decisions, and reusable context records.'],
        ]}
      />

      <h2>Provenance</h2>
      <p>
        Every artifact references the <code>runId</code> and <code>templateId</code> that produced it, so you can
        trace prompt, provider, model, timing, cost, and review state from any persisted output through{' '}
        <code>GET /v1/runs/&#123;runId&#125;</code>.
      </p>

      <CodeBlock title="GET /v1/artifacts/artifact-0dc32dbb" language="json">
        {artifactExample}
      </CodeBlock>

      <h2>Status values</h2>
      <Table
        head={['Status', 'Meaning']}
        rows={[
          [<code key="r">review</code>, 'Produced and persisted; awaiting operator review.'],
          [<code key="a">approved</code>, 'Reviewed and accepted as the canonical output.'],
          [<code key="rj">rejected</code>, 'Reviewed and discarded. Record kept for provenance.'],
          [<code key="d">draft</code>, 'Intermediate output, not yet user-visible.'],
        ]}
      />

      <h2>Visual artifacts</h2>
      <p>
        A visual artifact has two files: <code>raw</code> (model output) and <code>processed</code> (post
        background removal and any QA passes). Both are stored as WebP. The artifact response includes the public{' '}
        <code>url</code> for the processed file; the <code>storageKey</code> is stable and safe to persist on
        your side.
      </p>

      <CodeBlock title="visual file paths" language="path">
        {namespace}
      </CodeBlock>

      <h2>Research artifacts</h2>
      <p>
        A research artifact is structured text rather than a file. Its <code>content</code> carries a{' '}
        <code>title</code>, a <code>summary</code>, an ordered list of <code>sections</code>{' '}
        (<code>heading</code> + <code>body</code>), and a list of <code>sources</code>. Sourcing is
        model-derived today; web-search-backed citations land in a later phase.
      </p>

      <CodeBlock title="GET /v1/artifacts/artifact-7c4e91aa" language="json">
        {researchExample}
      </CodeBlock>

      <p>
        Research artifacts are reusable on their own and as inputs to other workflows. When a workflow composes a
        research report through a <a href="/concepts/sub-workflows">sub-workflow</a>, the produced artifact (for
        example, an infographic) carries a <code>sourceReportArtifactId</code> back-reference to the report it was
        built from.
      </p>

      <p style={{ color: 'var(--color-text-faint)', fontSize: 14 }}>
        Video and knowledge artifacts have their own content shapes; those will be documented here as each class
        ships its public contract.
      </p>
    </DocsPageShell>
  );
}
