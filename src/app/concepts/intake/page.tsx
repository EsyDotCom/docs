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
  title: 'Intake',
  description:
    'The inputs a workflow accepts, how the intake schema is shaped, and why intake asks for outcomes rather than mechanisms.',
};

const schema = `{
  "fields": [
    {
      "name": "prompt",
      "type": "string",
      "required": true,
      "description": "Subject of the coloring page"
    },
    {
      "name": "aspectRatio",
      "type": "enum",
      "required": true,
      "default": "3:4",
      "options": ["3:4", "1:1", "4:3"]
    },
    {
      "name": "quality",
      "type": "enum",
      "required": false,
      "default": "medium",
      "options": ["low", "medium", "high", "xhigh", "max"]
    }
  ]
}`;

const invalid = `HTTP 422

{
  "detail": {
    "error": "intake_invalid",
    "fields": [
      "intake.prompt is required",
      "intake.categories is required"
    ]
  }
}`;

const artifactRef = `{
  "name": "sourceReport",
  "type": "artifactReference",
  "required": true,
  "artifactType": "research-report",
  "description": "The report to turn into an infographic"
}`;

export default function IntakePage() {
  return (
    <DocsPageShell>
      <DiagramDefs />

      <PageHeader
        eyebrow="Core concepts · Intake"
        title="Intake"
        opener="handoff"
        lead={
          <>
            Intake is what you hand a run. Each workflow declares the fields it accepts, and Esy
            validates your payload against that declaration before a single provider call is made — so a
            typo costs you a <code>422</code> rather than a render.
          </>
        }
      />

      <h2>Reading the schema</h2>
      <p>
        Fetch any workflow&rsquo;s contract and you get its <code>intakeSchema</code>: a flat list of
        fields, each with a type, a required flag, and — where the field is constrained — its allowed
        values and default.
      </p>

      <CodeBlock title="intakeSchema, from generate-coloring-page" language="json">
        {schema}
      </CodeBlock>

      <p>Field types you will meet:</p>

      <Table
        head={['Type', 'Meaning']}
        rows={[
          [<code key="a">string</code>, 'Free text. Usually the prompt or a title.'],
          [<code key="b">enum</code>, 'One of a fixed list in options. Anything else is rejected.'],
          [<code key="c">boolean</code>, 'A switch, almost always with a sensible default.'],
          [<code key="d">integer</code>, 'A count.'],
          [<code key="e">number</code>, 'A decimal, typically a threshold.'],
          [<code key="f">array</code>, 'A list of values.'],
          [<code key="g">object</code>, 'Structured input for a step that needs more than a scalar.'],
          [
            <code key="h">artifactReference</code>,
            'The id of an existing artifact to feed into this run.',
          ],
        ]}
      />

      <Callout title="Defaults are applied, not assumed" tone="tip">
        A field with a <code>default</code> is filled in for you when you omit it, and the value that was
        used is recorded on the run. You never have to send a field just to get its default, and you can
        always see afterwards what the run actually ran with.
      </Callout>

      <h2>When it does not validate</h2>
      <p>
        Every problem is named, so you should never have to guess which field was wrong. This is the
        single most common error against the API.
      </p>

      <CodeBlock title="POST /v1/runs" language="json">
        {invalid}
      </CodeBlock>

      <p>
        Unknown keys are currently logged rather than rejected — do not rely on that as permission to
        send extra fields. See <Link href="/errors">Errors</Link> for the full list.
      </p>

      <h2>Artifact inputs</h2>
      <p>
        Some workflows take another artifact as input — an infographic built from a research report, an
        edit applied to an existing image. Those fields have type{' '}
        <code>artifactReference</code> and usually constrain the <code>artifactType</code> they accept.
      </p>

      <CodeBlock title="an artifactReference field" language="json">
        {artifactRef}
      </CodeBlock>

      <p>
        You pass an artifact id, and Esy checks that it exists, that it is the right type, and that it is
        inside a workspace you can reach — before the run starts. A workflow can also declare that a step
        may <em>produce</em> the input if you do not supply one; see{' '}
        <Link href="/guides/compose-with-artifact-inputs">Compose with artifact inputs</Link>.
      </p>

      <h2>The rule behind the schemas</h2>
      <p>
        Once you have read a few intake schemas, you will notice something: they ask for results, not
        methods. That is deliberate, and it is the design rule that explains most of what you will
        otherwise find arbitrary.
      </p>

      <p>Every run answers two questions, and they belong to different layers:</p>

      <Diagram
        title="Intake speaks outcomes, bindings speak mechanisms"
        minWidth={880}
        caption={
          <>
            Question one is yours. Question two is the engine&rsquo;s, answered from the bound
            model&rsquo;s declared capabilities and recorded in provenance.
          </>
        }
      >
        <svg viewBox="0 0 900 296" role="img" aria-label="The intake asks what you want; the engine decides how from model capability flags">
          <text x="8" y="18" className="dg-hdr">1 · THE INTAKE ASKS</text>
          <text x="478" y="18" className="dg-hdr">2 · THE ENGINE DECIDES</text>
          <path d="M450 8 L450 250" className="dg-rule" strokeDasharray="3 4" />

          <text x="8" y="48" className="dg-label">What do you want?</text>
          <rect x="8" y="62" width="420" height="92" rx="7" className="dg-node" />
          <text x="26" y="88" className="dg-sub">prompt</text>
          <text x="410" y="88" className="dg-label-sm" textAnchor="end">&ldquo;a fox in a waistcoat&rdquo;</text>
          <text x="26" y="114" className="dg-sub">background</text>
          <text x="410" y="114" className="dg-label-sm" textAnchor="end">&ldquo;see-through&rdquo;</text>
          <text x="26" y="140" className="dg-sub">aspectRatio</text>
          <text x="410" y="140" className="dg-label-sm" textAnchor="end">1:1</text>
          <text x="8" y="180" className="dg-cap">a promise. still true in five years.</text>

          <text x="478" y="48" className="dg-label">How should we make it?</text>
          <rect x="478" y="62" width="414" height="48" rx="7" className="dg-node" />
          <text x="496" y="84" className="dg-sub">model registry</text>
          <text x="874" y="92" className="dg-label-sm" textAnchor="end">supports_native_transparency</text>

          <path d="M600 114 L560 146" className="dg-edge dg-accent" />
          <path d="M770 114 L810 146" className="dg-edge" />
          <text x="566" y="132" className="dg-cap" textAnchor="end">true</text>
          <text x="806" y="132" className="dg-cap">false</text>

          <rect x="478" y="150" width="190" height="56" rx="7" className="dg-node dg-accent" />
          <text x="573" y="174" className="dg-label-sm" textAnchor="middle">render transparent</text>
          <text x="573" y="192" className="dg-sub" textAnchor="middle">removal skipped · $0</text>

          <rect x="702" y="150" width="190" height="56" rx="7" className="dg-node" />
          <text x="797" y="174" className="dg-label-sm" textAnchor="middle">render, then key out</text>
          <text x="797" y="192" className="dg-sub" textAnchor="middle">esy/chroma-key</text>

          <rect x="8" y="226" width="884" height="46" rx="7" className="dg-node dg-term" />
          <text x="26" y="248" className="dg-label-sm">
            Both record <tspan className="dg-sub">transparencyMechanism</tspan> in provenance.
          </text>
          <text x="26" y="264" className="dg-cap">QA judges the outcome, never the mechanism</text>
        </svg>
      </Diagram>

      <p>
        You ask for &ldquo;a picture with a see-through background&rdquo;. Whether the model renders
        transparency directly or Esy renders normally and keys the background out afterwards is a
        kitchen decision — it depends on which model is bound today and what that model can do.
      </p>

      <h2>Why it is built this way</h2>
      <p>
        A mechanism field fails twice over. First, it asks you a question already settled by the model
        binding, so wrong combinations simply break runs. Second, and worse, it makes saved intakes rot.
      </p>

      <Table
        head={['A saved intake that says…', 'In a year']}
        rows={[
          [
            <em key="a">&ldquo;I want a transparent background&rdquo;</em>,
            'Still exactly what you wanted. The engine picks whatever is best by then.',
          ],
          [
            <em key="b">&ldquo;Run the background-removal step&rdquo;</em>,
            'Actively worse: it forces an extra paid step that a newer model made unnecessary.',
          ],
        ]}
      />

      <Callout title="The test for a new capability" tone="note">
        <p>
          A new <strong>promise</strong> — something the workflow could not deliver before — is a
          template change and a new version. A better <strong>mechanism</strong> for a promise already
          made is not: it is a capability flag on the model, conditional logic in the step, and a
          provenance entry. Your saved intakes keep working and quietly get better.
        </p>
      </Callout>

      <h2>Seeing what was actually used</h2>
      <p>
        Because the engine makes these choices, it also records them. A finished run carries the resolved
        intake — defaults filled in — and the artifact records the mechanism chosen, for instance{' '}
        <code>transparencyMechanism: &quot;native&quot;</code> versus <code>&quot;post-process&quot;</code>. If you need to
        know why two runs of the same workflow behaved differently, that is where to look.
      </p>

      <PropertyTable
        rows={[
          {
            name: 'run.intake',
            type: 'object',
            desc: 'What you sent, with defaults applied.',
          },
          {
            name: 'run.workflowVersion',
            type: 'string',
            desc: 'Which definition interpreted that intake.',
          },
          {
            name: 'run.specVersionHash',
            type: 'string',
            desc: 'Hash of definition + intake. Two identical hashes mean identical inputs.',
          },
          {
            name: 'artifact.content',
            type: 'object',
            desc: 'The resolved prompt, the model used, and the mechanism chosen.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>
            Read a workflow&rsquo;s <code>intakeSchema</code> before calling it; it names every field,
            its type, and its allowed values.
          </>,
          <>
            Intake asks for outcomes. If a field looks like it is asking you how to implement something,
            that is a bug, not a feature.
          </>,
          <>
            Defaults are applied and recorded, so a finished run always shows what it really ran with.
          </>,
        ]}
      />
    </DocsPageShell>
  );
}
