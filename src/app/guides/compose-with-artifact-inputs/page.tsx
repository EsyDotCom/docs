import { DocsPageShell } from '@/components/DocsPageShell';
import { CodeBlock, PageHeader, StepList } from '@/components/Primitives';

export const metadata = {
  title: 'Compose with artifact inputs',
  description:
    'Let a workflow accept an existing artifact as input — supply a report you already have, or let the workflow generate one. A worked example with the research infographic.',
};

const fieldExample = `{
  "name": "sourceReport",
  "type": "artifactRef",
  "required": false,
  "description": "An existing research report to visualize",
  "artifactClass": "research",
  "artifactType": "research-report"
}`;

const stepExample = `{
  "id": "step-1",
  "name": "Research report",
  "kind": "subWorkflow",
  "subWorkflow": { "templateId": "generate-research-report" },
  "satisfiedBy": "inputs.sourceReport"
}`;

const supplyExample = `{
  "templateId": "generate-research-infographic",
  "intake": {
    "topic": "The history of dinosaurs",
    "aspectRatio": "3:4",
    "sourceReport": "artifact-7c4e91aa"
  }
}`;

const generateExample = `{
  "templateId": "generate-research-infographic",
  "intake": {
    "topic": "The history of dinosaurs",
    "aspectRatio": "3:4"
  }
}`;

export default function ComposeWithArtifactInputsGuidePage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Guide · composition"
        title="Compose with artifact inputs"
        lead={
          <>
            Some workflows can accept an existing <a href="/concepts/artifacts">artifact</a> as input
            instead of generating everything from scratch. This guide shows how an author wires that up,
            and how the same workflow runs whether you <em>supply</em> an artifact or let it{' '}
            <em>generate</em> one.
          </>
        }
      />

      <dl className="workflowMeta" aria-label="Guide summary">
        <dt>Example workflow</dt>
        <dd>generate-research-infographic</dd>
        <dt>Input artifact</dt>
        <dd>research / research-report</dd>
        <dt>Mechanism</dt>
        <dd>artifactRef intake field + satisfiedBy</dd>
        <dt>Output</dt>
        <dd>visual / infographic</dd>
      </dl>

      <h2>The idea</h2>
      <p>
        A workflow is a function over artifacts: it can <strong>produce</strong> one and{' '}
        <strong>consume</strong> one. The research infographic needs a research report to visualize. It
        can obtain that report two ways:
      </p>
      <div className="twoCol">
        <div className="twoColCard">
          <h3>Generate</h3>
          <p>
            Run the <a href="/concepts/sub-workflows">research-report sub-workflow</a> inline to produce
            a fresh report, then visualize it.
          </p>
        </div>
        <div className="twoColCard">
          <h3>Supply</h3>
          <p>
            Pass an existing report artifact you already reviewed and liked; the workflow skips
            generation and visualizes that one.
          </p>
        </div>
      </div>

      <h2>1. Declare the input (author)</h2>
      <p>
        Add an intake field of type <code>artifactRef</code>, constrained to the class and type the
        workflow knows how to read. Typing matters: it lets the run-time picker filter candidates and
        lets the platform validate what you pass.
      </p>
      <CodeBlock title="intake field" language="json">
        {fieldExample}
      </CodeBlock>

      <h2>2. Let the input satisfy the step (author)</h2>
      <p>
        Mark the report step <code>satisfiedBy</code> the input field. When a report is supplied, the
        engine skips the sub-workflow and binds the supplied report into that step&rsquo;s output slot —
        so downstream steps that read <code>&#123;step-1.report.summary&#125;</code> work unchanged.
      </p>
      <CodeBlock title="runtime step" language="json">
        {stepExample}
      </CodeBlock>

      <h2>3a. Run by supplying an artifact</h2>
      <p>
        Pass the report&rsquo;s id in intake. The engine loads it, exposes it at{' '}
        <code>inputs.sourceReport</code>, and the report step is skipped.
      </p>
      <CodeBlock title="POST /v1/runs — supply" language="json">
        {supplyExample}
      </CodeBlock>

      <h2>3b. Or run by generating</h2>
      <p>
        Omit the optional input and the workflow generates a fresh report through the sub-workflow,
        exactly as before. The two requests differ by a single field.
      </p>
      <CodeBlock title="POST /v1/runs — generate" language="json">
        {generateExample}
      </CodeBlock>

      <h2>What changes in the run</h2>
      <StepList
        items={[
          { name: 'Supplied', desc: 'The report step is skipped; the run records the supplied artifact id as provenance. No child run, no report-generation cost.' },
          { name: 'Generated', desc: 'The report step runs as a child sub-workflow, producing its own report artifact, with cost rolled up into the parent run.' },
          { name: 'Either way', desc: 'The infographic step reads the same report reference and produces the same artifact shape, linked back to the report it used.' },
        ]}
      />

      <p>
        Validation runs before execution: a supplied artifact must exist, be in your scope, and match the
        field&rsquo;s declared class/type — otherwise the run is rejected with a clear error.
      </p>
    </DocsPageShell>
  );
}
