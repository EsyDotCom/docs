import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { CodeBlock, PageHeader, Table } from '@/components/docs/Primitives';

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

const inputFieldExample = `{
  "name": "sourceReport",
  "type": "artifactReference",
  "required": false,
  "description": "An existing research report to visualize",
  "artifactClass": "research",
  "artifactType": "research-report"
}`;

const inputRequestExample = `{
  "templateId": "generate-research-infographic",
  "intake": {
    "topic": "The history of dinosaurs",
    "aspectRatio": "3:4",
    "sourceReport": "artifact-7c4e91aa"
  }
}`;

const filmCutExample = `{
  "id": "artifact-5b1f0c2e",
  "runId": "run-3e9a7d10",
  "templateId": "build-film-cut",
  "artifactClass": "video",
  "artifactType": "film-cut",
  "status": "ready",
  "content": {
    "type": "video",
    "url": "https://images.esy.com/artifacts/tool/run-3e9a7d10/step-1.mp4",
    "storageKey": "artifacts/tool/run-3e9a7d10/step-1.mp4",
    "mimeType": "video/mp4",
    "durationSeconds": 60,
    "measuredSeconds": 60.04,
    "width": 1280,
    "height": 720,
    "fps": 24,
    "aspectRatio": "16:9",
    "generateAudio": false,
    "segments": [
      { "index": 0, "url": "https://images.clip.art/animations/…/take-1.mp4", "start": 0.0, "seconds": 5, "at": 0.0 },
      { "index": 1, "url": "https://images.clip.art/animations/…/take-4.mp4", "start": 0.6, "seconds": 4, "at": 5.0 }
    ]
  }
}`;

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
        opener="artifact"
        lead={
          <>
            Artifacts are the durable outputs produced by workflow runs — visual, video, research, or knowledge.
            Every artifact carries provenance back to the workflow and run that produced it. An artifact that
            prints a checkable fact also carries the passages it was drawn from and the{' '}
            <a href="/concepts/source-policies">source policy</a> that approved them.
          </>
        }
      />

      <h2>Produced and consumed</h2>
      <p>
        An artifact is a first-class value: a run can both <strong>produce</strong> one and{' '}
        <strong>consume</strong> one. A workflow is, in effect, a function over artifacts — it takes
        zero or more artifacts (plus intake) and produces one.
      </p>
      <CodeBlock title="the shape of a workflow" language="text">
        {`Workflow : Artifact* -> Artifact`}
      </CodeBlock>
      <p>
        This is why composition works two ways. A workflow can obtain an input artifact by{' '}
        <em>generating</em> it inline (a <a href="/concepts/sub-workflows">sub-workflow</a>) or by{' '}
        <em>accepting</em> one you already have (an <a href="#artifact-inputs">artifact input</a>).
      </p>

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

      <h2>Video artifacts</h2>
      <p>
        A video artifact is one MP4. Its <code>content</code> carries the public <code>url</code>, a
        stable <code>storageKey</code>, the <code>mimeType</code>, and the length in{' '}
        <code>durationSeconds</code>, alongside the frame size and shape. A generated clip also carries
        the prompt and references it was rendered from.
      </p>
      <p>
        A <strong>film cut</strong> (<code>artifactType: &quot;film-cut&quot;</code>, from{' '}
        <code>build-film-cut</code>) is several clips joined into one film — think of an editor&rsquo;s
        cut, not a new render. Nothing in it is invented: each clip is trimmed to the seconds you chose,
        fitted to one frame size and frame rate (letterboxed, never stretched), and joined in order. So
        it adds two things a single clip doesn&rsquo;t have:
      </p>
      <ul>
        <li>
          <code>segments</code> — where every shot sits in the film (<code>at</code>) and which part of
          which clip it is (<code>url</code>, <code>start</code>, <code>seconds</code>). It is the edit
          decision list, so you can map any moment of the film back to the take it came from.
        </li>
        <li>
          <code>measuredSeconds</code> — how long the encoded file actually runs, read from the file
          rather than added up. The artifact&rsquo;s length check compares it with the kept seconds; a
          film that comes out short is held for review instead of shipped.
        </li>
      </ul>
      <p>
        Film cuts are silent (<code>generateAudio: false</code>). Sound belongs to the whole film, not
        to each clip, so it is added in a later step rather than stitched together from clips that
        each had their own.
      </p>

      <CodeBlock title="GET /v1/artifacts/artifact-5b1f0c2e" language="json">
        {filmCutExample}
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

      <h2 id="artifact-inputs">Artifacts as inputs</h2>
      <p>
        A workflow template can declare that it accepts an existing artifact as input. The author adds
        an intake field of type <code>artifactReference</code>, constrained to the artifact{' '}
        <code>class</code> and <code>type</code> the workflow knows how to read — so the field has a
        defined consumer and the supplied value can be validated.
      </p>

      <CodeBlock title="an artifactReference intake field" language="json">
        {inputFieldExample}
      </CodeBlock>

      <p>
        At run time you pass the chosen artifact&rsquo;s id in intake. The engine loads that artifact
        and exposes its content at <code>inputs.&#123;field&#125;</code>, which steps reference like
        any other context — for example <code>&#123;inputs.sourceReport.summary&#125;</code>.
      </p>

      <CodeBlock title="POST /v1/runs — supplying an artifact input" language="json">
        {inputRequestExample}
      </CodeBlock>

      <h3>Generate or supply</h3>
      <p>
        A step can declare that a supplied artifact <em>satisfies</em> it. When the input is present,
        the step is skipped and the supplied artifact fills its output slot; when it is absent, the
        step runs normally — for example, generating the artifact through a sub-workflow. Downstream
        steps read the same reference either way, so &ldquo;generate a fresh one&rdquo; and &ldquo;use
        this existing one&rdquo; are interchangeable to the rest of the workflow.
      </p>
      <p>
        See the <a href="/guides/compose-with-artifact-inputs">compose with artifact inputs</a> guide
        for a worked example.
      </p>

      <p style={{ color: 'var(--color-text-faint)', fontSize: 14 }}>
        Knowledge artifacts have their own content shape; it will be documented here when the class ships its
        public contract.
      </p>
    </DocsPageShell>
  );
}
