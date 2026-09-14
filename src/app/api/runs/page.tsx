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
  title: 'Runs API',
  description: 'Create, list, read, cancel, archive, and reassign runs, and recover a stranded one.',
};

const create = `curl -X POST https://api.esy.com/v1/runs \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{
    "templateId": "generate-illustration",
    "workspaceId": "9a1b6d4c-…",
    "intake": {
      "prompt": "a lighthouse at dusk, storm rolling in",
      "style": "flat",
      "aspectRatio": "4:3",
      "categories": "landscapes"
    },
    "providers": { "imageGenerator": "openai/gpt-image-2-2026-04-21" }
  }'`;

const list = `curl -s "https://api.esy.com/v1/runs?workspaceId=$WS&status=failed&limit=20" \\
  -H "Authorization: Bearer $ESY_API_KEY"`;

const reassign = `curl -X PATCH https://api.esy.com/v1/runs/run-fb0677b2/project \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{ "projectId": "b1126320-…" }'`;

export default function RunsApiPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="API reference · Runs"
        title="Runs"
        lead={
          <>
            Start work and follow it to the end. Statuses, step telemetry, and bindings are explained on{' '}
            <Link href="/concepts/runs">Runs and steps</Link>.
          </>
        }
      />

      <EndpointList
        items={[
          { method: 'POST', path: '/v1/runs', desc: 'Start a run.' },
          { method: 'GET', path: '/v1/runs', desc: 'List runs.' },
          { method: 'GET', path: '/v1/runs/{run_id}', desc: 'Read one, with steps and costs.' },
          { method: 'GET', path: '/v1/runs/{run_id}/events', desc: 'Stream it over SSE.' },
          { method: 'POST', path: '/v1/runs/{run_id}/cancel', desc: 'Stop it at the next step boundary.' },
          { method: 'POST', path: '/v1/runs/{run_id}/archive', desc: 'Hide a finished run from lists.' },
          { method: 'PATCH', path: '/v1/runs/{run_id}/project', desc: 'Move it to another project.' },
          { method: 'POST', path: '/v1/runs/{run_id}/finalize', desc: 'Recover a stranded run.' },
        ]}
      />

      <Endpoint method="POST" path="/v1/runs" title="Start a run. Returns 201 immediately with status pending; the work happens asynchronously.">
        <CodeBlock title="request" language="bash">
          {create}
        </CodeBlock>
        <h4>Body</h4>
        <PropertyTable
          rows={[
            {
              name: 'templateId',
              type: 'string',
              required: true,
              desc: (
                <>
                  The workflow id, e.g. <code>generate-illustration</code>. Find one in the{' '}
                  <Link href="/api/workflows">catalog</Link>.
                </>
              ),
            },
            {
              name: 'intake',
              type: 'object',
              required: true,
              desc: (
                <>
                  Must satisfy the workflow&rsquo;s <code>intakeSchema</code>, or you get a{' '}
                  <code>422</code> naming each bad field.
                </>
              ),
            },
            {
              name: 'workspaceId',
              type: 'uuid',
              desc: 'Where the run and its costs land. Defaults to your default workspace.',
            },
            { name: 'projectId', type: 'uuid', desc: 'Optional project inside that workspace.' },
            {
              name: 'providers',
              type: 'object',
              desc: (
                <>
                  Role → model-registry id, for this run only. Validated against{' '}
                  <code>GET /v1/models</code>.
                </>
              ),
            },
          ]}
        />
        <Callout title="Check the field names" tone="warning">
          The run body uses <code>templateId</code> and <code>providers</code>. Unknown keys are ignored,
          so a body using <code>workflowId</code> fails with <code>422 templateId required</code>, and one
          using <code>providerOverrides</code> silently runs with the default models.
        </Callout>
        <h4>Errors</h4>
        <p>
          <code>404</code> unknown workflow · <code>400</code> deprecated workflow or bad provider
          override · <code>403</code> workspace out of reach · <code>422</code> invalid intake ·{' '}
          <code>402</code> a budget refused it. Bodies for each are on{' '}
          <Link href="/errors">Errors</Link>.
        </p>
      </Endpoint>

      <Endpoint method="GET" path="/v1/runs" title="List runs, newest first.">
        <CodeBlock title="request" language="bash">
          {list}
        </CodeBlock>
        <PropertyTable
          rows={[
            { name: 'workspaceId / projectId', type: 'uuid', desc: 'Scope the list.' },
            { name: 'status', type: 'string', desc: 'One of the nine run statuses.' },
            { name: 'parentOrderId', type: 'string', desc: 'The children of one order.' },
            { name: 'workerId', type: 'string', desc: 'Runs a worker started.' },
            { name: 'includeArchived', type: 'boolean', desc: 'Archived runs are hidden by default.' },
            { name: 'offset / limit', type: 'integer', desc: 'Pagination. limit is capped at 100.' },
          ]}
        />
      </Endpoint>

      <Endpoint method="GET" path="/v1/runs/{run_id}" title="Read a run: status, intake, pinned version, step telemetry, and costs.">
        <p>
          The full shape, with real values, is on{' '}
          <Link href="/concepts/runs">Runs and steps</Link>. Poll this until the status is terminal,
          or stream <Link href="/api/run-events">run events</Link> instead.
        </p>
      </Endpoint>

      <Endpoint method="POST" path="/v1/runs/{run_id}/cancel" title="Cancel a run at its next step boundary.">
        <p>
          Stops future spend. Provider calls already made stay billed. The run ends as{' '}
          <code>cancelled</code>.
        </p>
      </Endpoint>

      <Endpoint method="POST" path="/v1/runs/{run_id}/archive" title="Hide a terminal run from lists.">
        <p>
          Archive, never delete: the run keeps its steps, costs, and artifact, and reappears with{' '}
          <code>includeArchived=true</code>. Only terminal runs can be archived.
        </p>
      </Endpoint>

      <Endpoint method="PATCH" path="/v1/runs/{run_id}/project" title="Move a run to a different project in the same workspace.">
        <CodeBlock title="request" language="bash">
          {reassign}
        </CodeBlock>
        <p>
          <code>projectId</code> must be present; send <code>null</code> to move the run to the workspace
          level. Costs follow the run.
        </p>
      </Endpoint>

      <Endpoint method="POST" path="/v1/runs/{run_id}/finalize" title="Recover a run whose steps all completed but whose finalization never ran.">
        <p>
          A rare recovery tool. If the process running a run dies between the last step and the
          bookkeeping, the work is done and paid for but the run never reaches a terminal status. This
          writes the artifact and the terminal status from what was already recorded — no step is re-run.
        </p>
      </Endpoint>
    </DocsPageShell>
  );
}
