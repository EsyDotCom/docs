import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { CodeBlock, PageHeader, StepList } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Generate a clip-art asset',
  description:
    'Run the generate-clip-art-asset workflow end-to-end and read back the artifact, step telemetry, and cost ledger.',
};

const requestExample = `{
  "templateId": "generate-clip-art-asset",
  "intake": {
    "intent": {
      "prompt": "a cute chipmunk sleeping in a nest with her family",
      "style": "cartoon",
      "aspectRatio": "1:1"
    },
    "runtime": {
      "backgroundRemovalEnabled": true
    }
  }
}`;

const responseExample = `{
  "id": "run-a1b2c3d4",
  "status": "review",
  "artifactId": "artifact-0dc32dbb",
  "durationMs": 42184,
  "totalCosts": {
    "estimatedUsd": 0.0533,
    "actualUsd": null,
    "currency": "USD",
    "status": "estimated"
  }
}`;

const pipeline = [
  { phase: 'Intake', name: 'Prompt + style', desc: 'Subject, style, aspect ratio.' },
  { phase: 'Generate', name: 'Image model', desc: 'OpenAI gpt-image-2 produces the raw image.' },
  { phase: 'Process', name: 'Background', desc: 'fal/birefnet-light removes the background.' },
  { phase: 'Encode', name: 'WebP', desc: 'Raw and processed PNG to WebP.' },
  { phase: 'Artifact', name: 'Reviewable', desc: 'Persisted with provider metadata and costs.' },
];

export default function GenerateClipArtGuidePage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Guide · clip-art"
        title="Generate a clip-art asset"
        lead={
          <>
            The <code>generate-clip-art-asset</code> workflow produces a reviewable visual artifact with provider
            metadata, storage keys, step telemetry, and cost ledger entries.
          </>
        }
      />

      <dl className="workflowMeta" aria-label="Workflow summary">
        <dt>Workflow</dt>
        <dd>generate-clip-art-asset</dd>
        <dt>Artifact class</dt>
        <dd>visual</dd>
        <dt>Provider</dt>
        <dd>OpenAI gpt-image-2</dd>
        <dt>Runtime</dt>
        <dd>~42s</dd>
        <dt>Output</dt>
        <dd>WebP · 1024×1024</dd>
      </dl>

      <h2>How this workflow runs</h2>
      <div className="pipeline" role="list">
        {pipeline.map((step) => (
          <div key={step.phase} className="pipelineStep" role="listitem">
            <small>{step.phase}</small>
            <strong>{step.name}</strong>
            <span>{step.desc}</span>
          </div>
        ))}
      </div>

      <div className="twoCol">
        <div className="twoColCard">
          <h3>What you provide</h3>
          <ul>
            <li>Subject prompt (required)</li>
            <li>
              Style: <code>cartoon</code>, <code>flat</code>, <code>realistic</code>, <code>watercolor</code>
            </li>
            <li>
              Aspect ratio: <code>1:1</code>, <code>4:3</code>, <code>3:4</code>, <code>16:9</code>
            </li>
            <li>
              Background removal: <code>true</code> by default
            </li>
          </ul>
        </div>
        <div className="twoColCard">
          <h3>What you get</h3>
          <ul>
            <li>A reviewable visual artifact (WebP, 1024×1024)</li>
            <li>Raw and processed file URLs</li>
            <li>Provider, model, and prompt metadata captured per step</li>
            <li>Per-step cost ledger entries with estimated and reconciled values</li>
          </ul>
        </div>
      </div>

      <h2>Send the request</h2>
      <p>
        Submit the run to the API with the workflow <code>templateId</code> and the intake your template requires.
      </p>
      <CodeBlock title="POST /v1/runs" language="json">
        {requestExample}
      </CodeBlock>

      <h2>Runtime steps</h2>
      <p>
        Each step persists its own timing, provider, model, and cost ledger entry. Steps execute in order;
        background removal can be disabled via intake.
      </p>
      <StepList
        items={[
          { name: 'prompt.resolve', desc: 'Resolve style descriptor and content-type template into the final prompt.' },
          { name: 'image.generate', desc: 'Provider call that produces the raw 1024×1024 image (default: openai/gpt-image-2).' },
          { name: 'background.remove', desc: 'Optional background removal (default: fal/birefnet-light).' },
          { name: 'image.convert_webp.raw', desc: 'Convert raw PNG to WebP.' },
          { name: 'image.convert_webp.processed', desc: 'Convert processed PNG to WebP.' },
          { name: 'storage.upload_raw', desc: 'Upload raw WebP to the artifacts namespace.' },
          { name: 'storage.upload_processed', desc: 'Upload processed WebP to the artifacts namespace.' },
          { name: 'artifact.create', desc: 'Persist the artifact record and link it to the run.' },
        ]}
      />

      <h2>Read the response</h2>
      <p>
        The synchronous response returns the run identifier, status, the produced <code>artifactId</code>, total
        runtime, and an estimated cost roll-up.
      </p>
      <CodeBlock title="201 created" language="json">
        {responseExample}
      </CodeBlock>

      <h2>Inspect telemetry</h2>
      <p>
        Fetch the full run for per-step timings, provider metadata, and cost ledger entries via{' '}
        <code>GET /v1/runs/&#123;runId&#125;</code>. The same provider cost ledger is available scoped to the
        artifact via <code>GET /v1/artifacts/&#123;artifactId&#125;</code>.
      </p>
    </DocsPageShell>
  );
}
