import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import {
  Callout,
  CodeBlock,
  PageHeader,
  Table,
  Takeaways,
} from '@/components/docs/Primitives';

export const metadata = {
  title: 'Quickstart',
  description:
    'Make your first Esy run with curl: authenticate, start a workflow, poll until it finishes, and download the artifact.',
};

const createRun = `curl -X POST https://api.esy.com/v1/runs \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{
    "templateId": "generate-illustration",
    "intake": {
      "prompt": "a lighthouse at dusk, storm rolling in",
      "style": "flat",
      "aspectRatio": "4:3",
      "quality": "low",
      "categories": "landscapes"
    }
  }'`;

const createResponse = `{
  "id": "run-fb0677b2",
  "status": "pending",
  "templateId": "generate-illustration",
  "templateName": "Generate Illustration",
  "currentStepIndex": 0,
  "workflowVersion": "2026.09.09",
  "specVersionHash": "sha256:eb3ced0c91a625e7ad47beaa28f5ff7b6db933ca5f6cac78fb93c1b030852fdb",
  "createdVia": "api_key",
  "queuedAt": "2026-09-13T00:16:58.843436Z"
}`;

const pollRun = `curl -s https://api.esy.com/v1/runs/run-fb0677b2 \\
  -H "Authorization: Bearer $ESY_API_KEY"`;

const finishedRun = `{
  "id": "run-fb0677b2",
  "status": "completed",
  "artifactId": "artifact-5a6a9501",
  "durationMs": 16088,
  "totalCosts": {
    "estimatedUsd": 0.007749,
    "actualUsd": 0.007749,
    "currency": "USD",
    "status": "provider_reported"
  }
}`;

const getArtifact = `curl -s https://api.esy.com/v1/artifacts/artifact-5a6a9501 \\
  -H "Authorization: Bearer $ESY_API_KEY"`;

const artifactResponse = `{
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
    "model": "gpt-image-2.5-sunburst"
  },
  "qa": {
    "status": "pending_review",
    "checks": [
      { "id": "text-gate", "label": "Text gate", "status": "pass", "detail": "" }
    ]
  }
}`;

const script = `#!/usr/bin/env bash
# Start a run, wait for it, print the artifact URL.
set -euo pipefail

RUN=$(curl -s -X POST https://api.esy.com/v1/runs \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{"templateId":"generate-illustration","intake":{"prompt":"a lighthouse at dusk","style":"flat","aspectRatio":"4:3","quality":"low","categories":"landscapes"}}')

ID=$(echo "$RUN" | jq -r .id)
echo "run $ID"

# Poll until the run reaches a terminal status.
while :; do
  sleep 5
  STATUS=$(curl -s "https://api.esy.com/v1/runs/$ID" \\
    -H "Authorization: Bearer $ESY_API_KEY" | jq -r .status)
  echo "  $STATUS"
  case "$STATUS" in completed|review|failed|cancelled) break ;; esac
done

ART=$(curl -s "https://api.esy.com/v1/runs/$ID" \\
  -H "Authorization: Bearer $ESY_API_KEY" | jq -r .artifactId)

curl -s "https://api.esy.com/v1/artifacts/$ART" \\
  -H "Authorization: Bearer $ESY_API_KEY" | jq -r .content.url`;

export default function QuickstartPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Get started · Quickstart"
        title="Your first run"
        opener="handoff"
        lead={
          <>
            Five minutes, four curl commands, one finished image. Everything on this page is a real
            request against <code>api.esy.com</code> with a real response pasted back — if a command here
            does not work verbatim, it is a bug in the docs.
          </>
        }
      />

      <h2>Before you start</h2>
      <p>
        You need an API key. Create one in{' '}
        <a href="https://os.esy.com" target="_blank" rel="noreferrer">
          os.esy.com
        </a>{' '}
        under Settings → API keys. The secret is shown <strong>once</strong>, at creation — Esy stores
        only a hash of it, so there is no way to recover it later. Put it in your shell:
      </p>

      <CodeBlock title="shell" language="bash">
        {`export ESY_API_KEY="esy_sk_…"`}
      </CodeBlock>

      <Callout title="A key acts as you" tone="warning">
        An API key carries the permissions of the account that created it — it is not a reduced-privilege
        role. Scope it to a single workspace when you create it, and revoke it the moment it leaks. See{' '}
        <Link href="/authentication">Authentication</Link>.
      </Callout>

      <h2>Step 1 — Start a run</h2>
      <p>
        A <strong>run</strong> is one execution of a <strong>workflow</strong>. You pick the workflow by
        its <code>templateId</code> and hand it an <code>intake</code> — the inputs that workflow
        declares. Here we use <code>generate-illustration</code>, which is public and needs no setup.
      </p>

      <CodeBlock title="POST /v1/runs" language="bash">
        {createRun}
      </CodeBlock>

      <p>
        You get <code>201</code> back immediately with status <code>pending</code>. Runs execute
        asynchronously — the API accepts the work and returns; it does not wait for the image.
      </p>

      <CodeBlock title="201 Created" language="json">
        {createResponse}
      </CodeBlock>

      <p>
        Two fields in that response matter more than they look. <code>workflowVersion</code> and{' '}
        <code>specVersionHash</code> are frozen at creation: this run is pinned to the exact definition
        that existed the moment you called it, so it stays reproducible even after the workflow is
        edited. <code>createdVia: &quot;api_key&quot;</code> is provenance — Esy records how every run was
        started.
      </p>

      <h2>Step 2 — Wait for it</h2>
      <p>Poll the run until it reaches a terminal status.</p>

      <CodeBlock title="GET /v1/runs/{run_id}" language="bash">
        {pollRun}
      </CodeBlock>

      <p>
        Terminal statuses are <code>completed</code>, <code>review</code>, <code>failed</code>, and{' '}
        <code>cancelled</code>. Stop polling on any of them.{' '}
        <Link href="/concepts/runs">Runs and steps</Link> covers the full lifecycle, including the
        two statuses a human review can produce.
      </p>

      <CodeBlock title="200 OK — about 16 seconds later" language="json">
        {finishedRun}
      </CodeBlock>

      <Callout title="Prefer streaming to polling" tone="tip">
        For anything user-facing, open{' '}
        <Link href="/api/run-events">
          <code>GET /v1/runs/{'{run_id}'}/events</code>
        </Link>{' '}
        instead. It sends a full snapshot on connect and then every state change as it happens, so you
        get progress rather than a spinner.
      </Callout>

      <h2>Step 3 — Read the artifact</h2>
      <p>
        The run produced an <strong>artifact</strong>: the durable record of what was made, what it
        cost, and how it was checked.
      </p>

      <CodeBlock title="GET /v1/artifacts/{artifact_id}" language="bash">
        {getArtifact}
      </CodeBlock>

      <CodeBlock title="200 OK" language="json">
        {artifactResponse}
      </CodeBlock>

      <p>
        <code>content.url</code> is your image, served from <code>images.esy.com</code>. The{' '}
        <code>qa</code> block is the workflow&rsquo;s own verdict on it — here a text gate that read the
        image and confirmed it carries no stray lettering.
      </p>

      <h2>What it cost</h2>
      <p>
        The run above cost <strong>$0.0077</strong>. Esy itemises that per provider call rather than
        giving you one opaque number:
      </p>

      <Table
        head={['Step', 'Provider', 'Model', 'Cost']}
        rows={[
          ['Render illustration', 'openai', <code key="m1">gpt-image-2.5-sunburst</code>, '$0.004600'],
          ['Classify asset', 'anthropic', <code key="m2">claude-haiku-4-5</code>, '$0.000884'],
          ['Text gate', 'anthropic', <code key="m3">claude-haiku-4-5</code>, '$0.002260'],
          ['storage.upload', 'cloudflare_r2', '—', '$0.0000045'],
        ]}
      />

      <p>
        Note the render is not even the majority of the bill — the two checks around it cost more than
        the image did. That is the trade Esy makes on your behalf, and{' '}
        <Link href="/concepts/costs">Costs and budgets</Link> explains how to cap it.
      </p>

      <h2>The whole thing as a script</h2>
      <p>Start, wait, print the URL. Needs <code>curl</code> and <code>jq</code>.</p>

      <CodeBlock title="first-run.sh" language="bash">
        {script}
      </CodeBlock>

      <h2>Where to go next</h2>
      <Table
        head={['If you want to…', 'Read']}
        rows={[
          [
            'Understand what just happened',
            <Link key="a" href="/how-esy-works">
              How Esy works
            </Link>,
          ],
          [
            'See every workflow you can run',
            <Link key="b" href="/api/workflows">
              Workflows and catalog
            </Link>,
          ],
          [
            'Know what each intake field means',
            <Link key="c" href="/concepts/intake">
              Intake
            </Link>,
          ],
          [
            'Handle failures properly',
            <Link key="d" href="/errors">
              Errors
            </Link>,
          ],
          [
            'Generate hundreds of these',
            <Link key="e" href="/concepts/orders">
              Generation Orders
            </Link>,
          ],
        ]}
      />

      <Takeaways
        items={[
          <>
            A run is asynchronous: <code>POST /v1/runs</code> returns <code>pending</code>, and you poll
            or stream until it is terminal.
          </>,
          <>
            Every run pins the workflow version it executed, so results stay reproducible after the
            workflow changes.
          </>,
          <>
            The artifact carries the output, the QA verdict, and an itemised cost ledger — not just a
            file.
          </>,
        ]}
      />
    </DocsPageShell>
  );
}
