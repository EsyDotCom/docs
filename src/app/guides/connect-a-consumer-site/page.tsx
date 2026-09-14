import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, PageHeader, StepList, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Connect a consumer site',
  description:
    'Render a public publication on your own site and verify Esy’s revalidation webhooks with an HMAC signature.',
};

const payloadExample = `{
  "publication": "esy-research",
  "slug": "the-economics-of-desalination",
  "action": "publish",
  "categories": ["policy", "energy"]
}`;

const headersExample = `webhook-id:        msg_8f0c2a1e4b7d4c9a
webhook-timestamp: 1782459381
webhook-signature: v1,K8c9…base64…3dA=`;

const verifyExample = `import crypto from "node:crypto";

const TOLERANCE_SECONDS = 5 * 60;

// Pick the secret for the publication that sent this webhook. Keep one env var
// per publication so adding a new one never touches the others.
function secretsFor(publication: string): string[] {
  const key = \`ESY_REVALIDATE_SECRET_\${publication.toUpperCase().replace(/-/g, "_")}\`;
  return [process.env[key]].filter(Boolean) as string[];
}

export function verify(rawBody: string, headers: Headers, secrets: string[]): boolean {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signature = headers.get("webhook-signature");
  if (!id || !timestamp || !signature || secrets.length === 0) return false;

  // Replay guard: reject anything signed too far from now.
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > TOLERANCE_SECONDS) return false;

  const signed = \`\${id}.\${timestamp}.\${rawBody}\`;
  const presented = signature.split(" ").map((p) => (p.startsWith("v1,") ? p.slice(3) : p));

  for (const secret of secrets) {
    const expected = crypto.createHmac("sha256", Buffer.from(secret, "utf8")).update(signed).digest("base64");
    for (const candidate of presented) {
      const a = Buffer.from(expected), b = Buffer.from(candidate);
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) return true;
    }
  }
  return false;
}`;

const routeExample = `// app/api/revalidate/route.ts (Next.js)
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { verify, secretsFor } from "@/lib/verify-webhook";

// Map each publication you serve to ITS route segment on this site. The segment
// is your section path (e.g. "learn"), NOT the publication slug ("esy-learn").
// Adding a destination is one line here.
const SECTION_PATHS: Record<string, string> = {
  "esy-learn": "learn",
  // "seopage-blog": "blog",
};

export async function POST(request: NextRequest) {
  // Read the RAW body first — HMAC must hash the exact bytes Esy signed.
  const rawBody = await request.text();
  const body = JSON.parse(rawBody);

  if (!verify(rawBody, request.headers, secretsFor(body.publication))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Resolve this site's path for the publication, then refresh just the pages
  // it affects (the section list + the document). An unknown publication is
  // rejected, not silently ignored.
  const section = SECTION_PATHS[body.publication];
  if (!section) {
    return NextResponse.json({ error: "Unknown publication" }, { status: 400 });
  }
  revalidatePath(\`/\${section}\`);
  revalidatePath(\`/\${section}/\${body.slug}\`);
  return NextResponse.json({ revalidated: true });
}`;

export default function ConnectConsumerGuidePage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Reference · Guides"
        title="Connect a consumer site"
        lead={
          <>
            Render a public publication on your own site, and verify the revalidation webhooks Esy
            sends when content changes. Verification uses an <strong>HMAC signature</strong> so the
            shared secret never travels on the wire.
          </>
        }
      />

      <h2>Steps</h2>
      <StepList
        items={[
          {
            name: 'Read the public API',
            desc: (
              <>
                Fetch a publication’s published documents from{' '}
                <code>GET /v1/publications/public/&#123;slug&#125;/articles</code> (no auth) and render
                them. See the <a href="/api/publications">Publications API</a>.
              </>
            ),
          },
          {
            name: 'Add a webhook endpoint',
            desc: (
              <>
                Create a POST route on your site (e.g. <code>/api/revalidate</code>) and set its URL as
                the publication’s <code>revalidateUrl</code>.
              </>
            ),
          },
          {
            name: 'Store the secret',
            desc: (
              <>
                Copy the secret shown once on create/rotate into an env var named for the publication:{' '}
                <code>ESY_REVALIDATE_SECRET_&lt;SLUG&gt;</code>.
              </>
            ),
          },
          {
            name: 'Verify every request',
            desc: 'Recompute the HMAC signature and reject anything that does not match.',
          },
        ]}
      />

      <h2>What Esy sends</h2>
      <p>On publish or unpublish, Esy POSTs your endpoint with a generic JSON body:</p>
      <CodeBlock title="request body" language="json">
        {payloadExample}
      </CodeBlock>
      <p>…and three signature headers:</p>
      <CodeBlock title="request headers" language="http">
        {headersExample}
      </CodeBlock>
      <Table
        head={['Header', 'Meaning']}
        rows={[
          [<code key="i">webhook-id</code>, 'Unique id for this delivery (use it to de-dupe if you want).'],
          [<code key="t">webhook-timestamp</code>, 'Unix seconds when Esy signed it — drives the replay window.'],
          [
            <code key="s">webhook-signature</code>,
            'Space-separated list of v1,<base64 HMAC-SHA256> (more than one during secret rotation).',
          ],
        ]}
      />

      <h2>The signature</h2>
      <p>
        Esy signs the exact string <code>{'{id}.{timestamp}.{rawBody}'}</code> with your publication’s
        secret:
      </p>
      <CodeBlock title="what gets signed" language="text">
        {`signature = base64( HMAC_SHA256( secret, "{webhook-id}.{webhook-timestamp}.{rawBody}" ) )`}
      </CodeBlock>

      <h2>Verify it</h2>
      <p>
        Recompute the signature with your copy of the secret and compare in constant time. Reject if
        the timestamp is more than five minutes old.
      </p>
      <CodeBlock title="lib/verify-webhook.ts" language="ts">
        {verifyExample}
      </CodeBlock>
      <CodeBlock title="app/api/revalidate/route.ts" language="ts">
        {routeExample}
      </CodeBlock>

      <Callout title="Read the raw body before parsing">
        The signature covers the exact bytes Esy sent. If you call <code>request.json()</code> first
        and re-serialize, key order or spacing can differ and the signature won’t match. Always read{' '}
        <code>request.text()</code> and parse that string.
      </Callout>

      <Callout title="Map to your section path, not the slug">
        The webhook payload’s <code>publication</code> is the <em>slug</em> (e.g.{' '}
        <code>esy-learn</code>) — a stable id, not a URL. Revalidate <em>your</em> route segment (the
        publication’s <code>sectionPath</code>, e.g. <code>/learn</code>), which you control on the
        consumer. Using the slug as the path is the usual cause of a wrong or doubled URL like{' '}
        <code>/esy-learn/…</code> or <code>/learn/learn/…</code>.
      </Callout>

      <h2>One env var per publication</h2>
      <p>
        If your site serves several publications, give each its own secret. Adding a new publication is
        then just a new variable — no risk to the existing ones.
      </p>
      <CodeBlock title="environment" language="bash">
        {`ESY_REVALIDATE_SECRET_AGENTIC=…
ESY_REVALIDATE_SECRET_ESY_RESEARCH=…
ESY_REVALIDATE_SECRET_ESY_LEARN=…`}
      </CodeBlock>

      <h2>Confirm it works</h2>
      <p>
        Use <code>POST /v1/publications/&#123;id&#125;/verify</code> (or the Connect panel’s “Verify
        connection”) to send a no-op test webhook. A 200 means your endpoint received and verified it;
        the result is recorded as delivery health on the publication.
      </p>

      <h2>Operating it</h2>
      <p>
        Three things trip up most first connections — all on the consumer side, and all reported as a
        failed delivery on the publication.
      </p>
      <Table
        head={['Symptom', 'Cause & fix']}
        rows={[
          [
            'The secret looks right, but every delivery 401s',
            <>
              On most hosts (Vercel included) env vars apply at <strong>build time</strong>. After
              setting <code>ESY_REVALIDATE_SECRET_&lt;SLUG&gt;</code>, <strong>redeploy</strong> — a
              running deployment keeps the old value.
            </>,
          ],
          [
            'Deliveries 401 right after a rotate',
            <>
              Rotating in Compose mints a new secret and the old one stops verifying immediately.
              Update the consumer’s env to the new value and redeploy.
            </>,
          ],
          [
            'Every delivery shows a redirect',
            <>
              If your site sets <code>trailingSlash</code>, point <code>revalidateUrl</code> at the
              canonical form (<code>…/api/revalidate/</code>). Otherwise each POST 308-redirects, which
              some clients don’t replay cleanly.
            </>,
          ],
        ]}
      />
      <Callout title="A failed delivery never blocks a publish">
        Webhooks are best-effort: a rejected ping is recorded in delivery health but never rolls back a
        valid publish. Your reader’s normal cache window still picks the change up — the webhook just
        makes it instant. Fix the secret/redeploy and re-run “Verify connection”.
      </Callout>
    </DocsPageShell>
  );
}
