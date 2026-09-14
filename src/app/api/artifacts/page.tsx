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
  title: 'Artifacts API',
  description: 'List, search, and read artifacts; walk a pack family; count over time; comment; retract.',
};

const list = `curl -s "https://api.esy.com/v1/artifacts?workspaceId=$WS&class=visual&status=ready&limit=20" \\
  -H "Authorization: Bearer $ESY_API_KEY"`;

const one = `{
  "id": "artifact-5a6a9501",
  "runId": "run-fb0677b2",
  "templateId": "generate-illustration",
  "title": "Lighthouse at Dusk with Storm Rolling In",
  "status": "ready",
  "artifactClass": "visual",
  "artifactType": "illustration",
  "version": 1,
  "content": {
    "type": "image",
    "url": "https://images.esy.com/artifacts/illustration/run-fb0677b2/image.webp",
    "mimeType": "image/webp",
    "model": "gpt-image-2.5-sunburst",
    "transparencyMechanism": "…"
  },
  "qa": { "status": "pending_review", "checks": [ … ] },
  "costLedger": [ … ]
}`;

const comment = `curl -X POST https://api.esy.com/v1/artifacts/artifact-5a6a9501/comments \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{ "body": "Crop tighter on the lighthouse for the pack cover." }'`;

export default function ArtifactsApiPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="API reference · Artifacts"
        title="Artifacts"
        lead={
          <>
            Read what runs produced. For what an artifact <em>is</em> — classes, statuses, provenance —
            see <Link href="/concepts/artifacts">Artifacts</Link>.
          </>
        }
      />

      <EndpointList
        items={[
          { method: 'GET', path: '/v1/artifacts', desc: 'List and search.' },
          { method: 'GET', path: '/v1/artifacts/{artifact_id}', desc: 'Read one.' },
          { method: 'GET', path: '/v1/artifacts/{artifact_id}/family', desc: 'The pack it belongs to.' },
          { method: 'GET', path: '/v1/artifacts/counts', desc: 'Counts bucketed over time.' },
          { method: 'GET', path: '/v1/artifacts/{artifact_id}/comments', desc: 'Read comments.' },
          { method: 'POST', path: '/v1/artifacts/{artifact_id}/comments', desc: 'Add a comment.' },
          { method: 'DELETE', path: '/v1/artifacts/{artifact_id}', desc: 'Retract.' },
        ]}
      />

      <Endpoint method="GET" path="/v1/artifacts" title="List artifacts, newest first, with filters and full-text search.">
        <CodeBlock title="request" language="bash">
          {list}
        </CodeBlock>
        <h4>Query parameters</h4>
        <PropertyTable
          rows={[
            { name: 'workspaceId', type: 'uuid', desc: 'Limit to one workspace.' },
            { name: 'projectId', type: 'uuid', desc: 'Limit to one project.' },
            { name: 'runId', type: 'string', desc: 'Everything one run produced.' },
            { name: 'templateId', type: 'string', desc: 'Everything one workflow produced.' },
            {
              name: 'class',
              type: 'enum',
              desc: (
                <>
                  <code>visual</code>, <code>research</code>, <code>video</code>, <code>knowledge</code>.
                </>
              ),
            },
            { name: 'artifactType', type: 'string', desc: 'For example illustration, coloring-page, clip-art.' },
            {
              name: 'status',
              type: 'string',
              desc: (
                <>
                  <code>ready</code>, <code>review</code>, <code>approved</code>, <code>rejected</code>, …
                </>
              ),
            },
            { name: 'q', type: 'string', desc: 'Free-text search over titles and metadata.' },
            { name: 'createdAfter / createdBefore', type: 'datetime', desc: 'ISO-8601 bounds.' },
            { name: 'workerId', type: 'string', desc: 'Produced by one worker.' },
            {
              name: 'includeStage',
              type: 'boolean',
              desc: 'Include intermediate stage artifacts emitted mid-run. Off by default.',
            },
            { name: 'offset / limit', type: 'integer', desc: 'Pagination. limit is capped at 100.' },
          ]}
        />
      </Endpoint>

      <Endpoint method="GET" path="/v1/artifacts/{artifact_id}" title="Read one artifact with its content, QA record, and cost ledger.">
        <CodeBlock title="200 OK" language="json">
          {one}
        </CodeBlock>
        <p>
          <code>content.url</code> is the file, served from <code>images.esy.com</code>. Everything under{' '}
          <code>content</code> beyond <code>url</code> and <code>mimeType</code> depends on the artifact
          type — treat unknown keys as additive.
        </p>
      </Endpoint>

      <Endpoint method="GET" path="/v1/artifacts/{artifact_id}/family" title="Walk the pack an artifact belongs to — its plan, its siblings, and its cover.">
        <p>
          Artifacts made by a <Link href="/concepts/orders">Generation Order</Link> that carried a{' '}
          <code>planArtifactId</code> form a family. Call this from any member to get the rest.
        </p>
      </Endpoint>

      <Endpoint method="GET" path="/v1/artifacts/counts" title="Artifact counts bucketed over time, for charts.">
        <p>
          Accepts the same filters as the list, plus <code>periodGranularity</code> to choose the bucket
          size.
        </p>
      </Endpoint>

      <Endpoint method="POST" path="/v1/artifacts/{artifact_id}/comments" title="Attach a comment to an artifact.">
        <CodeBlock title="request" language="bash">
          {comment}
        </CodeBlock>
      </Endpoint>

      <Endpoint method="DELETE" path="/v1/artifacts/{artifact_id}" title="Retract an artifact.">
        <Callout title="Retract, not erase" tone="warning">
          Retraction takes an artifact out of circulation; it does not rewrite history. The run that made
          it, its cost ledger, and its provenance remain — money that was spent stays accounted for.
        </Callout>
      </Endpoint>
    </DocsPageShell>
  );
}
