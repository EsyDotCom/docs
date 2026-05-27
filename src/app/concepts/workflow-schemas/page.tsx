import Link from 'next/link';
import { DocsPageShell } from '@/components/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Table } from '@/components/Primitives';

export const metadata = {
  title: 'Workflow schemas',
  description:
    'The platform contract every Workflow Template must satisfy. Declares required fields, allowed types, gate-unlock grammar, and validation rules.',
};

const schemaExample = `{
  "schemaVersion": "workflow-schema-v1",
  "templateRequiredFields": [
    "id",
    "name",
    "artifactClass",
    "version",
    "cadence",
    "intakeSchema",
    "runtimeSteps",
    "providers",
    "gates",
    "budgetPolicy",
    "outputShape"
  ],
  "artifactClass": {
    "type": "enum",
    "allowed": ["visual", "video", "research", "knowledge"]
  },
  "gate": {
    "fields": {
      "id": "string (required, unique within template)",
      "name": "string (required)",
      "type": "enum [quality, safety, approval, budget]",
      "inputs": "array<ArtifactTypeRef> (required)",
      "outputs": "array<ArtifactTypeRef> (required)",
      "unlocks": "array<GateId>"
    }
  },
  "subWorkflowRef": {
    "fields": {
      "templateId": "string (required)",
      "templateVersion": "string (required, pinned)",
      "intakeMapping": "object (required)"
    }
  },
  "validation": [
    "Every gate id must be unique within the template",
    "Every unlocks reference must point to a gate in the same template",
    "Every outputShape must be a registered ArtifactType",
    "Every provider must be a registered ProviderRef",
    "Template version must be ISO-style date-tagged"
  ]
}`;

const levelDiagram = `Workflow Schema  (rules)             ← this page
       │
       ▼ a Template satisfies the Schema
Workflow Template  (declared)
       │
       ▼ a Run instantiates the Template
Workflow Specification  (runtime)
       │
       ▼ production executes the Specification
Workflow Run + Artifact`;

export default function WorkflowSchemasPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Workflow schemas"
        title="Workflow schemas"
        lead={
          <>
            A Workflow Schema is the platform&apos;s contract for what counts as a workflow. It declares the rules every{' '}
            <Link href="/concepts/workflow-templates">Workflow Template</Link> must obey — required fields, allowed
            types, gate-unlock grammar, sub-workflow reference rules, and validation logic the platform enforces
            before a Template is publishable.
          </>
        }
      />

      <h2>Position in the model</h2>
      <p>
        Workflows on Esy are defined at three levels of abstraction. The Schema is the highest level — the
        meta-definition that governs how Templates are authored. Most operators never see the Schema directly;
        they pick a Template that has already been validated against it.
      </p>

      <CodeBlock title="levels" language="tree">
        {levelDiagram}
      </CodeBlock>

      <h2>What the Schema declares</h2>
      <Table
        head={['Concern', 'What the Schema specifies']}
        rows={[
          [
            <strong key="fields">Required fields</strong>,
            'The set of fields a Workflow Template must contain to be publishable (id, name, artifactClass, version, cadence, intakeSchema, runtimeSteps, providers, gates, budgetPolicy, outputShape).',
          ],
          [
            <strong key="types">Allowed types and shapes</strong>,
            'For each field, the type and shape it must take. artifactClass is an enum; gates is an ordered list of gate objects; providers is a record mapping step names to provider identifiers.',
          ],
          [
            <strong key="gates">Gate grammar</strong>,
            'The structure of a gate: id, name, type, inputs (ArtifactTypeRefs), outputs (ArtifactTypeRefs), and unlocks (gate ids). Determines what flows between steps.',
          ],
          [
            <strong key="sub">Sub-workflow references</strong>,
            'How a Template can declare that a step delegates to another Template — including version pinning and intake mapping.',
          ],
          [
            <strong key="ver">Versioning conventions</strong>,
            'How Template versions must be tagged and how runs reference a specific Template version snapshot.',
          ],
          [
            <strong key="val">Validation rules</strong>,
            'The checks the platform runs before publishing a Template — gate-id uniqueness, unlocks-target existence, ArtifactType registration, provider registration, version format.',
          ],
        ]}
      />

      <h2>Example</h2>
      <p>
        An illustrative subset of <code>workflow-schema-v1</code>. The Schema itself is a stable declarative document
        that the platform reads when validating new Templates.
      </p>
      <CodeBlock title="workflow-schema-v1.json (excerpt)" language="json">
        {schemaExample}
      </CodeBlock>

      <h2>Audience</h2>
      <p>
        The Schema is consumed by three audiences, in order of how often they engage with it:
      </p>
      <ul>
        <li>
          <strong>Platform engineers</strong> — Author and version the Schema itself. Decide what counts as a
          valid workflow on Esy. Rarely changes the Schema; when it does, existing Templates either remain on
          their prior Schema version or migrate.
        </li>
        <li>
          <strong>Workflow designers</strong> — Author new Templates that conform to the Schema. Read it as a
          reference for what fields are required and what shapes are valid.
        </li>
        <li>
          <strong>Operators</strong> — Almost never. Operators pick Templates that have already been validated
          against the Schema. The Schema is platform-internal.
        </li>
      </ul>

      <h2>Frequency</h2>
      <p>
        <strong>One per platform, versioned.</strong> The Schema is a singleton across Esy, evolving through
        explicit versions (<code>workflow-schema-v1</code>, <code>workflow-schema-v2</code>). When the Schema
        changes, every Template declares which Schema version it conforms to, and the platform routes validation
        accordingly.
      </p>

      <Callout title="The Schema is the contract. Templates are concrete instances of that contract.">
        Think of the Schema as a TypeScript language specification, and a Template as a specific{' '}
        <code>interface User &#123; ... &#125;</code> declaration. The language spec defines what an interface can
        be; an interface declaration is one concrete shape inside that spec. Multiple Templates can satisfy the
        same Schema, just as many interfaces can be written in TypeScript.
      </Callout>

      <h2>Related concepts</h2>
      <ul>
        <li>
          <Link href="/concepts/workflow-templates">Workflow templates</Link> — concrete predesigned workflows
          that satisfy the Schema.
        </li>
        <li>
          <Link href="/concepts/workflow-specifications">Workflow specifications</Link> — per-run populated
          instances of a Template.
        </li>
        <li>
          <Link href="/concepts/runs">Runs</Link> — durable execution records of a Specification.
        </li>
        <li>
          <Link href="/concepts/artifacts">Artifacts</Link> — the outputs of a Run, with provenance back through
          Specification, Template, and Schema versions.
        </li>
      </ul>
    </DocsPageShell>
  );
}
