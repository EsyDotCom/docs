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
  title: 'Errors',
  description:
    'Every error api.esy.com returns — the status code, the real response body, what causes it, and how to fix it.',
};

const shape = `{ "detail": "Workflow template not found" }`;

const intakeInvalid = `HTTP 422

{
  "detail": {
    "error": "intake_invalid",
    "fields": [
      "intake.prompt is required",
      "intake.categories is required"
    ]
  }
}`;

const validationShape = `HTTP 422

{
  "detail": [
    {
      "type": "missing",
      "loc": ["query", "workspaceId"],
      "msg": "Field required",
      "input": null
    }
  ]
}`;

const budgetExceeded = `HTTP 402

{
  "detail": {
    "code": "budget_exceeded",
    "reason": "hard_stop",
    "budgetId": "budget-…",
    "scope": "workspace",
    "enforcementMode": "hard_stop",
    "limitUsd": 50.0,
    "spendUsd": 49.82,
    "runEstimateUsd": 0.28,
    "remainingUsd": 0.18
  }
}`;

const deprecated = `HTTP 400

{
  "detail": {
    "code": "template_deprecated",
    "templateId": "generate-clip-art-asset",
    "supersededBy": "generate-clip-art-asset-v2",
    "message": "Template 'generate-clip-art-asset' is deprecated; use 'generate-clip-art-asset-v2' instead."
  }
}`;

const runFailure = `{
  "id": "run-7bef698a",
  "status": "failed",
  "error": "step 'step-4': OCR text gate rejected the render — verdict: {\\"foundText\\": \\"BRIEF, STRATEGY\\", \\"pass\\": false, \\"reason\\": \\"The image contains legible text, which violates the 'none' text policy.\\"}",
  "totalCosts": { "actualUsd": 0.042348, "status": "provider_reported" }
}`;

const retry = `// Retry transient failures; never retry a 4xx you caused.
const RETRYABLE = new Set([429, 500, 502, 503, 504]);

async function callEsy(path, init, attempt = 0) {
  const res = await fetch(\`https://api.esy.com\${path}\`, init);
  if (res.ok) return res.json();

  // A POST that may have already created a run must not be blindly repeated.
  const isWrite = (init.method ?? 'GET') !== 'GET';
  if (RETRYABLE.has(res.status) && !isWrite && attempt < 4) {
    await new Promise((r) => setTimeout(r, 2 ** attempt * 500));
    return callEsy(path, init, attempt + 1);
  }

  const body = await res.json().catch(() => ({}));
  throw new EsyError(res.status, body.detail);
}`;

export default function ErrorsPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Get started · Errors"
        title="Errors"
        opener="errors"
        lead={
          <>
            Every response body on this page was captured from <code>api.esy.com</code>, not invented.
            Two things are worth knowing up front: errors always arrive under a <code>detail</code> key,
            and a run that <em>fails</em> is not an API error — it is a successful request describing
            unsuccessful work.
          </>
        }
      />

      <h2>The shape</h2>
      <p>
        Esy is a FastAPI service, so every error body has a single top-level <code>detail</code>. It is
        sometimes a string and sometimes an object — always check the type before reading into it.
      </p>

      <CodeBlock title="the simple case" language="json">
        {shape}
      </CodeBlock>

      <h2>Status codes</h2>
      <Table
        head={['Code', 'Meaning', 'What to do']}
        rows={[
          [
            <code key="a">400</code>,
            'The request is understood but the target refuses it — a deprecated template, an invalid provider override.',
            'Read detail.code and fix the request. Retrying will not help.',
          ],
          [
            <code key="b">401</code>,
            'Missing or invalid credentials.',
            <>
              Check the header format. See <Link key="l" href="/authentication">Authentication</Link>.
            </>,
          ],
          [
            <code key="c">402</code>,
            'A budget refused the run before anything was spent.',
            'Raise the budget, wait for the period to roll over, or lower the estimate.',
          ],
          [
            <code key="d">403</code>,
            'Authenticated, but not for this workspace — usually a workspace-bound key reaching elsewhere.',
            'Use a key bound to the right workspace, or omit workspaceId.',
          ],
          [
            <code key="e">404</code>,
            'No such template, run, or artifact — or it is outside your workspace.',
            'Check the id. A 404 can mean "not yours" as well as "not there".',
          ],
          [
            <code key="f">422</code>,
            'The payload did not satisfy the intake contract or the endpoint schema.',
            'Read detail.fields and fix the named inputs.',
          ],
          [
            <code key="g">5xx</code>,
            'Something broke on our side.',
            'Retry idempotent reads with backoff. Do not blind-retry a POST.',
          ],
        ]}
      />

      <h2>422 — the one you will hit most</h2>
      <p>
        There are two different <code>422</code>s and they look nothing alike. The first is the{' '}
        <strong>intake contract</strong>: your <code>intake</code> did not match what the workflow
        declares. <code>detail.fields</code> names each problem in plain language.
      </p>

      <CodeBlock title="POST /v1/runs — missing required intake" language="json">
        {intakeInvalid}
      </CodeBlock>

      <p>
        The second is FastAPI&rsquo;s own request validation, for a malformed query string or body. Here{' '}
        <code>detail</code> is an <em>array</em>, and <code>loc</code> tells you where the problem is.
      </p>

      <CodeBlock title="GET /v1/budgets — missing query parameter" language="json">
        {validationShape}
      </CodeBlock>

      <Callout title="Check the type of detail" tone="tip">
        <code>detail</code> can be a string, an object, or an array depending on which layer rejected
        you. A client that assumes one shape will throw while handling an error, which is the worst
        moment to throw. Branch on <code>typeof</code> / <code>Array.isArray</code> first.
      </Callout>

      <p>
        The reliable way to avoid intake errors is to read the contract before you call:{' '}
        <code>GET /v1/catalog/workflows/{'{id}'}</code> returns the <code>intakeSchema</code> with every
        field, its type, whether it is required, its default, and its allowed values. See{' '}
        <Link href="/api/workflows">Workflows and catalog</Link>.
      </p>

      <h2>402 — a budget said no</h2>
      <p>
        Budgets are enforced <em>before</em> the run starts, against the estimate. A refused run spends
        nothing, and the refusal is recorded so you can query it later.
      </p>

      <CodeBlock title="POST /v1/runs — refused" language="json">
        {budgetExceeded}
      </CodeBlock>

      <p>
        <code>reason</code> tells you which rule fired: <code>per_run_cap_exceeded</code>,{' '}
        <code>hard_stop</code>, <code>allow_overage_exceeded</code>, or{' '}
        <code>allow_one_more_exhausted</code>. The rest of the body is everything you need to render a
        useful message — you know the limit, the spend, and what this run would have cost.{' '}
        <Link href="/concepts/costs">Costs and budgets</Link> explains the enforcement modes.
      </p>

      <h2>400 — the template moved on</h2>
      <p>
        Workflows are deprecated rather than deleted, and the refusal names its successor so you can
        migrate without going hunting.
      </p>

      <CodeBlock title="POST /v1/runs — deprecated template" language="json">
        {deprecated}
      </CodeBlock>

      <h2>A failed run is not an API error</h2>
      <p>
        This is the distinction that matters most for your error handling. If{' '}
        <code>POST /v1/runs</code> returns <code>201</code>, the request succeeded. The{' '}
        <em>work</em> can still fail afterwards, and you learn that by reading the run&rsquo;s{' '}
        <code>status</code> — not by catching an exception.
      </p>

      <CodeBlock title="GET /v1/runs/{run_id} — the work failed" language="json">
        {runFailure}
      </CodeBlock>

      <p>
        Two things to notice. <code>error</code> carries the actual verdict, including the gate&rsquo;s
        reasoning — here an OCR gate rejecting lettering the model invented. And{' '}
        <code>totalCosts.actualUsd</code> is non-zero: <strong>a failed run still costs money</strong>,
        because the provider calls before the failure really happened. Budget for failures, not just for
        successes.
      </p>

      <Callout title="Terminal is not the same as successful" tone="warning">
        Treat <code>completed</code>, <code>review</code>, <code>failed</code>, <code>cancelled</code>,{' '}
        <code>rejected</code> and <code>changes_requested</code> as &ldquo;stop waiting&rdquo;. Only{' '}
        <code>completed</code> means you have a finished artifact. A run in <code>review</code> produced
        something, but a human has not accepted it yet.
      </Callout>

      <h2>Retrying</h2>
      <p>
        Reads are safe to retry. Writes are not: Esy does not yet enforce idempotency keys on{' '}
        <code>POST /v1/runs</code>, so a blind retry after a timeout can start the work twice and bill
        you twice. If a write times out, look for what you created before you try again.
      </p>

      <CodeBlock title="a retry policy that will not double-bill" language="typescript">
        {retry}
      </CodeBlock>

      <Takeaways
        items={[
          <>
            Errors arrive under <code>detail</code>, which may be a string, object, or array. Check the
            type before reading it.
          </>,
          <>
            <code>422</code> means your intake did not match the contract — read{' '}
            <code>detail.fields</code>, and fetch the <code>intakeSchema</code> to avoid it next time.
          </>,
          <>
            <code>402</code> is a budget refusal and costs nothing. A <code>failed</code> run costs
            real money.
          </>,
          <>Retry reads with backoff; never blind-retry a run creation.</>,
        ]}
      />
    </DocsPageShell>
  );
}
