import { Callout, CodeBlock, EndpointList, PageHeader } from '@/components/Primitives';

export const metadata = {
  title: 'API reference',
  description:
    'Create workflow runs and read back artifacts, telemetry, and cost ledger entries from the Esy API.',
};

const exampleResponse = `{
  "id": "run-a1b2c3d4",
  "status": "running",
  "templateId": "generate-clip-art-asset",
  "queuedAt": "2026-05-16T22:14:12.482Z",
  "startedAt": "2026-05-16T22:14:12.604Z"
}`;

export default function ApiPage() {
  return (
    <div className="content contentNarrow">
      <PageHeader
        eyebrow="Reference · API"
        title="API reference"
        lead={
          <>
            Create workflow runs and read back artifacts, step telemetry, and cost ledger entries. Per-endpoint
            detail pages are generated from the OpenAPI schema once published.
          </>
        }
      />

      <h2>Base URL</h2>
      <p>
        Production: <code>https://api.esy.com</code>
      </p>

      <h2>Runtime endpoints</h2>
      <EndpointList
        items={[
          { method: 'POST', path: '/v1/runs', desc: 'Create and execute a workflow run.' },
          { method: 'GET', path: '/v1/runs', desc: 'List persisted runs for the authenticated workspace.' },
          {
            method: 'GET',
            path: '/v1/runs/{runId}',
            desc: 'Fetch run details, step telemetry, and cost ledger entries.',
          },
          { method: 'GET', path: '/v1/artifacts', desc: 'List persisted artifacts.' },
          {
            method: 'GET',
            path: '/v1/artifacts/{artifactId}',
            desc: 'Fetch artifact content, metadata, and cost ledger entries.',
          },
        ]}
      />

      <h2>Example response</h2>
      <CodeBlock title="POST /v1/runs · 201 created" language="json">
        {exampleResponse}
      </CodeBlock>

      <h2>Authentication</h2>
      <p>
        Requests are authenticated with a bearer token scoped to a workspace. External API keys, scopes, and rate
        limits will be documented here once they&rsquo;re available. For now, manage workspaces and tokens from{' '}
        <a href="https://app.esy.com" rel="noopener noreferrer">
          app.esy.com
        </a>
        .
      </p>

      <Callout title="Versioning">
        All endpoints are versioned under <code>/v1</code>. Breaking changes will land on a new path
        (<code>/v2</code>) and be tracked in the <a href="/changelog">changelog</a>.
      </Callout>
    </div>
  );
}
