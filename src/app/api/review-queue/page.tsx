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
  title: 'Review queue API',
  description: 'Read the runs waiting on a human, and approve, reject, or request changes — one at a time or in bulk.',
};

const list = `curl -s "https://api.esy.com/v1/queue?workspaceId=$WS&limit=20" \\
  -H "Authorization: Bearer $ESY_API_KEY"`;

const item = `{
  "runId": "run-62af77b1",
  "templateId": "generate-clip-art-asset-v2",
  "gateId": "gate-review",
  "gateName": "Review",
  "status": "review",
  "artifactId": "artifact-a5db7c7d",
  "artifactTitle": "Flat Clip Art Asset",
  "artifactStatus": "review",
  "qa": {
    "status": "pending_review",
    "checks": [
      { "id": "text-gate", "label": "Text gate", "status": "pass", "detail": "" },
      { "id": "background", "label": "Background", "status": "pass", "detail": "" }
    ]
  }
}`;

const decide = `curl -X POST https://api.esy.com/v1/queue/run-62af77b1/decision \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{ "decision": "reject", "note": "Glyph is clipped at the right edge." }'`;

const bulk = `curl -X POST https://api.esy.com/v1/queue/decisions \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{
    "decisions": [
      { "runId": "run-62af77b1", "decision": "approve" },
      { "runId": "run-0c7d9e21", "decision": "request_changes", "note": "Too dark." }
    ]
  }'`;

export default function ReviewQueueApiPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="API reference · Review queue"
        title="Review queue"
        lead={
          <>
            Everything a workflow parked for a human, and the endpoints to decide it. The rules behind
            approval are on <Link href="/concepts/gates-and-review">Gates and review</Link>.
          </>
        }
      />

      <EndpointList
        items={[
          { method: 'GET', path: '/v1/queue', desc: 'Runs waiting on a decision.' },
          { method: 'GET', path: '/v1/queue/count', desc: 'Just the number.' },
          { method: 'POST', path: '/v1/queue/{run_id}/decision', desc: 'Decide one run.' },
          { method: 'POST', path: '/v1/queue/decisions', desc: 'Decide many.' },
        ]}
      />

      <Endpoint method="GET" path="/v1/queue" title="Runs in review, each with the gate that held it and its QA record.">
        <CodeBlock title="request" language="bash">
          {list}
        </CodeBlock>
        <CodeBlock title="one item" language="json">
          {item}
        </CodeBlock>
        <p>
          Filter with <code>workspaceId</code>, <code>projectId</code>, and <code>templateId</code>;
          paginate with <code>offset</code>/<code>limit</code>. The queue is a view over runs whose status
          is <code>review</code>, so it is always current.
        </p>
      </Endpoint>

      <Endpoint method="POST" path="/v1/queue/{run_id}/decision" title="Approve, reject, or request changes on one run.">
        <CodeBlock title="request" language="bash">
          {decide}
        </CodeBlock>
        <PropertyTable
          rows={[
            {
              name: 'decision',
              type: 'enum',
              required: true,
              desc: (
                <>
                  <code>approve</code>, <code>reject</code>, or <code>request_changes</code>. The run
                  becomes <code>completed</code>, <code>rejected</code>, or{' '}
                  <code>changes_requested</code>.
                </>
              ),
            },
            { name: 'note', type: 'string', desc: 'Why. Kept in the decision ledger with who and when.' },
            {
              name: 'patch',
              type: 'object',
              desc: (
                <>
                  Required when releasing a typed hold, and must supply exactly the fields the hold
                  declared.
                </>
              ),
            },
            { name: 'gateId', type: 'string', desc: 'Which gate you are deciding, when a run has several.' },
          ]}
        />
        <Callout title="Approval can be refused" tone="warning">
          Approving a run with any <code>qa.checks</code> entry at <code>fail</code>, or still{' '}
          <code>pending</code>, is rejected. So is a typed-hold patch with extra or missing fields, or the
          value <code>&quot;uncategorized&quot;</code>.
        </Callout>
      </Endpoint>

      <Endpoint method="POST" path="/v1/queue/decisions" title="Decide several runs in one request.">
        <CodeBlock title="request" language="bash">
          {bulk}
        </CodeBlock>
        <p>
          Each entry takes the same fields as a single decision, plus <code>runId</code>. The same
          approval rules apply to every entry individually.
        </p>
      </Endpoint>
    </DocsPageShell>
  );
}
