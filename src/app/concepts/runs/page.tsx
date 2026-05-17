import { CodeBlock, PageHeader, Table } from '@/components/Primitives';

export const metadata = {
  title: 'Runs',
  description:
    'Durable execution records of workflow templates with per-step telemetry, provider settings, costs, and outcomes.',
};

const lifecycle = `queued ─▶ running ─▶ review ─▶ completed
                       │
                       └─▶ failed`;

const runExample = `{
  "id": "run-a1b2c3d4",
  "templateId": "generate-clip-art-asset",
  "status": "completed",
  "queuedAt":        "2026-05-16T22:14:12.482Z",
  "startedAt":       "2026-05-16T22:14:12.604Z",
  "firstArtifactAt": "2026-05-16T22:14:43.711Z",
  "completedAt":     "2026-05-16T22:14:54.681Z",
  "durationMs":          42077,
  "queueWaitMs":           122,
  "timeToFirstArtifactMs": 31107,
  "timeToFinalArtifactMs": 42077
}`;

export default function RunsPage() {
  return (
    <div className="content contentNarrow">
      <PageHeader
        eyebrow="Concepts · Runs"
        title="Runs"
        lead={
          <>
            Runs are executions of workflow templates. They are the canonical experimental record: what happened,
            when it happened, how long each step took, what it cost, and whether the output was worth keeping.
          </>
        }
      />

      <h2>Lifecycle</h2>
      <CodeBlock title="status transitions" language="ascii">
        {lifecycle}
      </CodeBlock>

      <h2>Status values</h2>
      <Table
        head={['Status', 'Meaning']}
        rows={[
          [<code key="queued">queued</code>, 'Accepted by the API, waiting for execution.'],
          [<code key="running">running</code>, 'Actively executing one or more steps.'],
          [<code key="review">review</code>, 'Produced an artifact awaiting operator review.'],
          [<code key="completed">completed</code>, 'Final state. Artifact accepted, or no review required.'],
          [<code key="failed">failed</code>, 'Terminal error. error_code records the cause.'],
        ]}
      />

      <h2>Timing fields</h2>
      <Table
        head={['Field', 'Meaning']}
        rows={[
          [<code key="queuedAt">queuedAt</code>, 'Wall time the run was accepted by the API.'],
          [<code key="startedAt">startedAt</code>, 'Wall time execution began on a worker.'],
          [<code key="firstArtifactAt">firstArtifactAt</code>, 'Wall time the first usable artifact existed.'],
          [<code key="completedAt">completedAt</code>, 'Wall time the run reached a terminal state.'],
          [<code key="durationMs">durationMs</code>, 'startedAt to terminal state, in milliseconds.'],
          [<code key="queueWaitMs">queueWaitMs</code>, 'queuedAt to startedAt, in milliseconds.'],
          [
            <code key="t1">timeToFirstArtifactMs</code>,
            'startedAt to first persisted artifact, in milliseconds.',
          ],
          [
            <code key="tf">timeToFinalArtifactMs</code>,
            'startedAt to final processed artifact, in milliseconds.',
          ],
        ]}
      />

      <h2>Example run</h2>
      <CodeBlock title="GET /v1/runs/run-a1b2c3d4" language="json">
        {runExample}
      </CodeBlock>

      <h2>Step telemetry</h2>
      <p>
        Each run carries a <code>runSteps</code> array. The step catalog varies by workflow, but every run opens
        with prompt resolution and closes with artifact creation. Steps are named with a dotted convention so
        they stay groupable across templates.
      </p>

      <h3>Lifecycle steps</h3>
      <p>Present on every run, regardless of workflow.</p>
      <Table
        head={['Step', 'Records']}
        rows={[
          [<code key="pr">prompt.resolve</code>, 'Resolved style descriptors and content-type template into the final prompt.'],
          [<code key="up">storage.upload</code>, 'Persisted the output file(s) to storage.'],
          [<code key="ac">artifact.create</code>, 'Final persistence of the artifact record and its link to the run.'],
        ]}
      />

      <h3>Workflow-specific steps</h3>
      <p>
        Example: the <code>generate-clip-art-asset</code> workflow adds these steps between prompt resolution and
        artifact creation.
      </p>
      <Table
        head={['Step', 'Records']}
        rows={[
          [<code key="ig">image.generate</code>, 'Provider call that produced the raw image.'],
          [<code key="br">background.remove</code>, 'Background-removal model invocation.'],
          [<code key="cv">image.convert_webp.*</code>, 'PNG to WebP conversion for raw and processed outputs.'],
        ]}
      />
    </div>
  );
}
