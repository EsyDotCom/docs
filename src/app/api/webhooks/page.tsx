import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import {
  Callout,
  CodeBlock,
  EndpointList,
  PageHeader,
  Table,
  Takeaways,
} from '@/components/docs/Primitives';

export const metadata = {
  title: 'Webhooks',
  description:
    'Verify a signed delivery from an Esy outlet or publication: the headers, the signed content, rotation, and replay protection.',
};

const headers = `webhook-id:        msg_5f0c…            # unique per delivery — your idempotency key
webhook-timestamp: 1757721600           # unix seconds, and part of what is signed
webhook-signature: v1,K3m…= v1,9Qa…=    # one or more signatures, space-separated`;

const verify = `import crypto from 'node:crypto';

const TOLERANCE_SECONDS = 5 * 60;

/**
 * Verify an Esy webhook. \`rawBody\` must be the exact bytes received —
 * parse JSON only after this returns true.
 */
export function verifyEsyWebhook(rawBody, headers, secret) {
  const id = headers['webhook-id'];
  const timestamp = headers['webhook-timestamp'];
  const signatures = headers['webhook-signature'];
  if (!id || !timestamp || !signatures) return false;

  // Reject stale deliveries so a captured request cannot be replayed later.
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(\`\${id}.\${timestamp}.\${rawBody}\`)
    .digest('base64');

  // During a rotation Esy signs with both secrets; any match is valid.
  return signatures.split(' ').some((sig) => {
    const [version, value] = sig.split(',');
    if (version !== 'v1' || !value) return false;
    const a = Buffer.from(value);
    const b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
}`;

const nextRoute = `// app/api/esy/route.ts
import { verifyEsyWebhook } from '@/lib/verify-esy-webhook';

export async function POST(request: Request) {
  const raw = await request.text(); // BEFORE parsing — the signature covers bytes
  const ok = verifyEsyWebhook(raw, Object.fromEntries(request.headers), process.env.ESY_WEBHOOK_SECRET!);
  if (!ok) return new Response('invalid signature', { status: 401 });

  const event = JSON.parse(raw);
  // …handle it, keyed on the webhook-id header so a retry is a no-op
  return Response.json({ received: true });
}`;

export default function WebhooksPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="API reference · Webhooks"
        title="Webhooks"
        lead={
          <>
            When Esy publishes to your site — through an <Link href="/concepts/outlets">outlet</Link>{' '}
            or a <Link href="/concepts/publications">publication</Link> — it calls you, and signs the
            call. The secret never travels on the wire; you recompute the signature and compare.
          </>
        }
      />

      <h2>The headers</h2>
      <p>
        Esy follows the Standard Webhooks convention. Every delivery carries three headers.
      </p>

      <CodeBlock title="request headers" language="text">
        {headers}
      </CodeBlock>

      <h2>What is signed</h2>
      <p>
        The HMAC-SHA256 is computed over the id, the timestamp, and the raw body, joined with dots, using
        the secret you were shown when you created the outlet or publication:
      </p>

      <CodeBlock title="signed content" language="text">
        {`{webhook-id}.{webhook-timestamp}.{raw request body}`}
      </CodeBlock>

      <Callout title="Verify the bytes you received, not the JSON you parsed" tone="danger">
        The signature covers the exact body bytes. Parsing and re-serialising JSON changes whitespace and
        key order and breaks every signature. Read the raw body, verify, and only then parse.
      </Callout>

      <h2>Verifying in Node</h2>
      <CodeBlock title="verify-esy-webhook.js" language="javascript">
        {verify}
      </CodeBlock>

      <CodeBlock title="a Next.js route handler" language="typescript">
        {nextRoute}
      </CodeBlock>

      <h2>Rules your receiver should follow</h2>
      <Table
        head={['Rule', 'Why']}
        rows={[
          ['Compare with a constant-time function.', 'A plain === leaks the signature one byte at a time through timing.'],
          ['Reject timestamps older than a few minutes.', 'The timestamp is signed, so this stops replay of a captured request.'],
          ['Deduplicate on webhook-id.', 'Deliveries are retried. The same id twice is the same event.'],
          ['Accept any matching signature in the list.', 'During rotation Esy signs with the old and new secret at once.'],
          ['Reply quickly, work later.', 'Acknowledge, then do slow processing asynchronously.'],
        ]}
      />

      <Callout title="200 versus 202 for pack deliveries" tone="note">
        For pack ingestion the status you return is load-bearing: <code>200</code> means you took all of
        it; <code>202</code> means you took part of it and Esy should push again to finish. Esy re-pushes
        automatically on a <code>202</code>.
      </Callout>

      <h2>Rotating and testing a secret</h2>
      <EndpointList
        items={[
          { method: 'POST', path: '/v1/outlets/{outlet_id}/secret/rotate', desc: 'New secret for an outlet. Shown once.' },
          { method: 'POST', path: '/v1/outlets/{outlet_id}/verify', desc: 'Send a signed test delivery.' },
          {
            method: 'POST',
            path: '/v1/publications/{publication_id}/secret/rotate',
            desc: 'New secret for a publication. Shown once.',
          },
          { method: 'POST', path: '/v1/publications/{publication_id}/verify', desc: 'Send a signed test delivery.' },
        ]}
      />

      <p>
        Rotate, deploy the new secret alongside the old one, confirm with <code>verify</code>, then drop
        the old one. Because deliveries are signed with both during the overlap, nothing fails in between.
      </p>

      <h2>Inbound webhooks</h2>
      <p>
        Esy does not currently accept webhooks from you. Everything flows outward — Esy calls your
        endpoints; you call the API. See the{' '}
        <Link href="/guides/connect-a-consumer-site">Connect a consumer site</Link> guide for a
        complete receiver.
      </p>

      <Takeaways
        items={[
          <>
            Three headers: <code>webhook-id</code>, <code>webhook-timestamp</code>,{' '}
            <code>webhook-signature</code>.
          </>,
          <>
            HMAC-SHA256 over <code>{'{id}.{timestamp}.{raw body}'}</code>, base64, prefixed{' '}
            <code>v1,</code>.
          </>,
          <>Verify raw bytes, compare in constant time, reject stale timestamps, dedupe on the id.</>,
        ]}
      />
    </DocsPageShell>
  );
}
