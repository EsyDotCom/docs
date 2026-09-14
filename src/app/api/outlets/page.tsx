import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, EndpointList, PageHeader } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Outlets API',
  description:
    'Manage outlets, publish and unpublish artifacts, read the consumer feed, and receive signed revalidation webhooks.',
};

const publishExample = `POST /v1/outlets/{outletId}/items/publish
{ "artifactIds": ["artifact-9f1e2d3c", "artifact-8a7b6c5d", "artifact-unclassified"] }

// per-id results — the gate explains itself
{
  "results": [
    { "artifactId": "artifact-9f1e2d3c", "ok": true },
    { "artifactId": "artifact-8a7b6c5d", "ok": true },
    { "artifactId": "artifact-unclassified", "ok": false,
      "problem": "Artifact has no classification (title + category) — the consumer can't build a page." }
  ],
  "changed": 2
}`;

const feedExample = `GET /v1/outlets/{outletId}/items?status=published&limit=100&offset=0

{
  "items": [{
    "id": "outitem-1a2b3c4d",
    "outletId": "outlet-3f9a1c2b",
    "artifactId": "artifact-9f1e2d3c",
    "status": "published",
    "publishedBy": "worker-06997927",
    "publishedAt": "2026-07-06T10:14:02Z",
    "artifact": {
      "id": "artifact-9f1e2d3c",
      "templateId": "generate-clip-art-asset-v2",
      "title": "Apple on Books",
      "content": { "type": "image", "url": "…", "classification": { "…": "…" } }
    }
  }],
  "total": 82
}`;

export default function OutletsApiPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Reference · Outlets API"
        title="Outlets API"
        lead={
          <>
            Outlets are os.esy.com’s channels for publishing artifacts of any kind — separate from the{' '}
            <a href="/api/publications">Publications API</a> (compose’s documents). An outlet is
            URL-defined (<code>siteUrl</code> + <code>sectionPath</code>): clip.art/free and clip.art/flowers
            are different outlets. All routes use a bearer token (session or <code>esy_sk_</code> key).
            Publishing is per-item and gated; every publish or unpublish act fires one signed webhook to the
            outlet’s consumer.
          </>
        }
      />

      <h2>Managing outlets</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/outlets', desc: 'Your outlets, with delivery health. Consumers discover which outlets to mirror here — filter siteUrl by your own domain; channel lists never live in consumer config.' },
          { method: 'POST', path: '/v1/outlets', desc: 'Create an outlet. If a webhook is configured, the secret is revealed once.' },
          { method: 'PATCH', path: '/v1/outlets/{outletId}', desc: 'Update destination binding, accepted kinds, and metadata.' },
          { method: 'POST', path: '/v1/outlets/{outletId}/secret/rotate', desc: 'Rotate the webhook secret (revealed once).' },
          { method: 'POST', path: '/v1/outlets/{outletId}/verify', desc: 'Send a test ping to the consumer’s webhook.' },
        ]}
      />

      <h2>Publishing artifacts</h2>
      <EndpointList
        items={[
          { method: 'POST', path: '/v1/outlets/{outletId}/items/publish', desc: 'Publish a batch of artifacts (gated: finished + classified + kind accepted). One webhook per act.' },
          { method: 'POST', path: '/v1/outlets/{outletId}/items/unpublish', desc: 'Unpublish a batch — the consumer hides those pages within seconds.' },
          { method: 'GET', path: '/v1/outlets/{outletId}/items', desc: 'The published-items feed a consumer reads (artifact data embedded).' },
          { method: 'GET', path: '/v1/outlets/items/by-artifact/{artifactId}', desc: 'Everywhere one artifact is filed — powers publish/unpublish controls.' },
        ]}
      />

      <CodeBlock title="publish, with the gate explaining itself" language="json">
        {publishExample}
      </CodeBlock>

      <CodeBlock title="the consumer feed" language="json">
        {feedExample}
      </CodeBlock>

      <h2>The webhook</h2>
      <p>
        One POST per act to the outlet’s <code>revalidateUrl</code>, authenticated twice:{' '}
        <code>Authorization: Bearer &lt;secret&gt;</code> and an HMAC-SHA256 signature over the exact body bytes.
        The payload is <code>{'{ outlet, action, artifactIds }'}</code> (action <code>publish</code>,{' '}
        <code>unpublish</code>, or <code>test</code>). Delivery is best-effort — health lands on the outlet
        record, and your periodic re-pull is the backstop.
      </p>

      <Callout title="Outlets are not Publications">
        Documents (compose’s editorial pieces) publish through the separate{' '}
        <a href="/api/publications">Publications API</a>, whose webhook sends{' '}
        <code>{'{ publication, slug, action, categories }'}</code>. Outlets carry artifacts only.
      </Callout>
    </DocsPageShell>
  );
}
