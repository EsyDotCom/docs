import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import {
  Callout,
  CodeBlock,
  Endpoint,
  EndpointList,
  PageHeader,
  PropertyTable,
} from '@/components/docs/Primitives';

export const metadata = {
  title: 'Workflows and catalog API',
  description:
    'Browse the public catalog, read a workflow contract, list versions, and inspect the model and tool registries.',
};

const catalog = `curl -s https://api.esy.com/v1/catalog/workflows`;

const catalogItem = `{
  "id": "generate-coloring-page",
  "name": "Generate Coloring Page",
  "shortDescription": "Printable line-art coloring page, post-processed, gated, classified.",
  "artifactClass": "visual",
  "depth": "quick",
  "estimatedRuntime": "30-90 sec",
  "includesQa": true,
  "stages": [ { "name": "Render", "description": "…", "stepCount": 1 }, … ],
  "whatYouProvide": [ … ],
  "whatYouGet": [ … ],
  "qaChecks": [ … ],
  "version": "2026.09.10"
}`;

const models = `curl -s "https://api.esy.com/v1/models?capability=image" \\
  -H "Authorization: Bearer $ESY_API_KEY"`;

export default function WorkflowsApiPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="API reference · Workflows"
        title="Workflows and catalog"
        lead={
          <>
            Find a workflow to run and read its contract. Concepts live on{' '}
            <Link href="/concepts/workflows">Workflows</Link>; this page is the endpoint list.
          </>
        }
      />

      <EndpointList
        items={[
          { method: 'GET', path: '/v1/catalog/workflows', desc: 'Public catalog. No key.' },
          { method: 'GET', path: '/v1/catalog/workflows/{workflow_id}', desc: 'Public contract. No key.' },
          { method: 'GET', path: '/v1/workflows', desc: 'Workflows visible to you, including internal ones.' },
          { method: 'GET', path: '/v1/workflows/{workflow_id}', desc: 'One workflow, unredacted where you have access.' },
          { method: 'GET', path: '/v1/workflows/{workflow_id}/versions', desc: 'Its immutable versions.' },
          { method: 'POST', path: '/v1/workflows/dry-run', desc: 'Resolve a draft definition without spending.' },
          { method: 'POST', path: '/v1/workflows/estimate', desc: 'Price a draft definition.' },
          { method: 'GET', path: '/v1/models', desc: 'The model registry.' },
          { method: 'GET', path: '/v1/tools', desc: 'The tool registry.' },
        ]}
      />

      <Endpoint method="GET" path="/v1/catalog/workflows" title="Every public workflow, summarised. Unauthenticated.">
        <CodeBlock title="request" language="bash">
          {catalog}
        </CodeBlock>
        <CodeBlock title="one item" language="json">
          {catalogItem}
        </CodeBlock>
        <p>
          The response is <code>{'{ items, total }'}</code>. Because it needs no key, it is safe to call
          from a build step — this site&rsquo;s own workflow pages are generated from it.
        </p>
      </Endpoint>

      <Endpoint method="GET" path="/v1/catalog/workflows/{workflow_id}" title="The full contract for one public workflow. Unauthenticated.">
        <p>
          Returns <code>intakeSchema</code>, <code>runtimeSteps</code>, <code>gates</code>,{' '}
          <code>artifactSchema</code>, and version history. Prompt templates, provider bindings, and{' '}
          <code>budgetPolicy</code> come back as <code>&quot;redacted&quot;</code>. Read{' '}
          <code>intakeSchema</code> here before you build an intake.
        </p>
      </Endpoint>

      <Endpoint method="GET" path="/v1/workflows" title="Workflows you can see, including internal ones.">
        <PropertyTable
          rows={[
            {
              name: 'visibility',
              type: 'enum',
              desc: (
                <>
                  <code>draft</code>, <code>internal</code>, <code>public</code>.
                </>
              ),
            },
            { name: 'includeDeprecated', type: 'boolean', desc: 'Deprecated workflows are hidden by default.' },
            { name: 'offset / limit', type: 'integer', desc: 'Pagination.' },
          ]}
        />
      </Endpoint>

      <Endpoint method="GET" path="/v1/workflows/{workflow_id}/versions" title="The append-only version history.">
        <p>
          See <Link href="/concepts/versioning">Versioning</Link> for how versions, revisions, and
          the live pointer relate.
        </p>
      </Endpoint>

      <Endpoint method="POST" path="/v1/workflows/dry-run" title="Resolve and price a draft workflow definition without calling a provider.">
        <Callout title="Takes a definition, not a templateId" tone="warning">
          Send <code>intakeSchema</code>, <code>runtimeSteps</code>, <code>providers</code>, and a sample{' '}
          <code>intake</code>. A <code>templateId</code> is ignored, and the response will say{' '}
          <code>ok: true</code> with zero steps. Full example on{' '}
          <Link href="/concepts/workflows">Workflows</Link>.
        </Callout>
      </Endpoint>

      <Endpoint method="POST" path="/v1/workflows/estimate" title="Price a draft runtimeSteps + providers pair.">
        <p>
          Optional <code>thresholdUsd</code> flags the definition as high-cost when the typical estimate
          exceeds it.
        </p>
      </Endpoint>

      <Endpoint method="GET" path="/v1/models" title="The model registry — every id a provider binding may name.">
        <CodeBlock title="request" language="bash">
          {models}
        </CodeBlock>
        <p>
          Filter with <code>capability</code> = <code>text</code>, <code>image</code>, <code>video</code>,
          or <code>tool</code>. Each entry carries pricing and capability flags such as{' '}
          <code>supportsNativeTransparency</code> — the facts the engine reads to pick a mechanism. Use
          these ids in a run&rsquo;s <code>providers</code> override.
        </p>
      </Endpoint>

      <Endpoint method="GET" path="/v1/tools" title="The tool registry — non-model steps such as esy/chroma-key.">
        <p>Tools are bound to roles exactly like models are.</p>
      </Endpoint>
    </DocsPageShell>
  );
}
