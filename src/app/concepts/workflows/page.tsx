import { Callout, CodeBlock, PageHeader, Table } from '@/components/Primitives';

export const metadata = {
  title: 'Workflows',
  description:
    'Reusable workflow templates that define intake, runtime steps, providers, quality gates, and budget policy.',
};

const workflowExample = `{
  "id": "generate-clip-art-asset",
  "name": "Generate Clip Art Asset",
  "artifactClass": "visual",
  "version": "2026.05.16",
  "cadence": "On demand",
  "providers": {
    "image": "openai/gpt-image-2",
    "backgroundRemoval": "fal/birefnet-light"
  },
  "gates": ["prompt resolution", "provider execution", "background removal", "storage metadata", "HITL review"],
  "budgetPolicy": "Records estimated OpenAI image and fal.ai background-removal costs per run"
}`;

const anatomy = `workflow template
   ├── intake schema
   ├── runtime steps
   ├── provider policy
   ├── quality gates
   ├── budget policy
   └── output shape`;

export default function WorkflowsPage() {
  return (
    <div className="content contentNarrow">
      <PageHeader
        eyebrow="Concepts · Workflows"
        title="Workflows"
        lead={
          <>
            Workflows are reusable templates for producing artifacts. They define intake, runtime steps,
            provider policy, output shape, quality gates, and budget policy.
          </>
        }
      />

      <h2>Composition</h2>
      <p>
        A workflow is a versioned template for how a particular kind of artifact gets produced. The id is stable;
        runtime behavior evolves through explicit versions and configuration snapshots captured on each run.
      </p>

      <CodeBlock title="workflow.json" language="json">
        {workflowExample}
      </CodeBlock>

      <h2>Anatomy</h2>
      <CodeBlock title="anatomy" language="tree">
        {anatomy}
      </CodeBlock>

      <h2>Fields</h2>
      <Table
        head={['Field', 'Purpose']}
        rows={[
          [<code key="id">id</code>, 'Stable workflow identifier. Cannot change once published.'],
          [<code key="name">name</code>, 'Human-readable label shown in the app and admin tooling.'],
          [
            <code key="ac">artifactClass</code>,
            <>One of <code>visual</code>, <code>video</code>, <code>research</code>, or <code>knowledge</code>. Determines the artifact contract.</>,
          ],
          [<code key="v">version</code>, 'Date-tagged version of the workflow template definition.'],
          [<code key="cd">cadence</code>, 'How the workflow is invoked: on demand, scheduled, continuous, per pack.'],
          [<code key="g">gates</code>, 'Quality, safety, approval, and budget checkpoints before execution continues.'],
          [<code key="p">providers</code>, 'Provider routing for each runtime step.'],
          [<code key="bp">budgetPolicy</code>, 'Constraints that keep execution predictable before a run launches.'],
        ]}
      />

      <Callout title="Version snapshots are required">
        Every run must persist the workflow version, prompt template, model ids, background-removal model, file
        format and codec, quality gates, and pricing version used at execution time. The same workflow id can
        produce different runtime behavior across versions; runs must remain reproducible against the exact
        snapshot that produced them.
      </Callout>
    </div>
  );
}
