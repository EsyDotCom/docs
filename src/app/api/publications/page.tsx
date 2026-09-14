import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, EndpointList, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Publications API',
  description:
    'Read published documents from a public publication with no auth, and manage your own publications and categories with a bearer token.',
};

const listArticlesExample = `{
  "items": [
    {
      "slug": "the-economics-of-desalination",
      "title": "The economics of desalination",
      "description": "Cost drivers, energy intensity, and where the curve bends.",
      "category": "policy",
      "categoryLabel": "Policy",
      "categories": [{ "slug": "policy", "label": "Policy" }],
      "kind": "article",
      "publishedAt": "2026-06-20T14:02:11.004Z",
      "tags": ["water", "energy"],
      "relatedSlugs": []
    }
  ],
  "total": 1
}`;

const createExample = `{
  "name": "My Field Notes",
  "slug": "my-field-notes",
  "acceptedKinds": ["article"],
  "siteUrl": "https://example.com",
  "sectionPath": "/notes",
  "revalidateUrl": "https://example.com/api/revalidate"
}`;

const createResponse = `{
  "id": "b4c5d6e7-f8a9-4b0c-8d1e-2f3a4b5c6d7e",
  "name": "My Field Notes",
  "slug": "my-field-notes",
  "acceptedKinds": ["article"],
  "siteUrl": "https://example.com",
  "sectionPath": "/notes",
  "revalidateUrl": "https://example.com/api/revalidate",
  "isPublic": false,
  "hasRevalidateSecret": true,
  "revalidateSecret": "kP3x…shown-once…9aQ",
  "lastDeliveryStatus": "",
  "createdAt": "2026-06-26T07:40:00.000Z"
}`;

export default function PublicationsApiPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Reference · Publications API"
        title="Publications API"
        lead={
          <>
            Two surfaces: <strong>public reads</strong> (no auth) that any consumer renders from, and{' '}
            <strong>authoring</strong> (bearer token, scoped to your account) for managing your own
            publications and their categories. See the{' '}
            <a href="/concepts/publications">Publications concept</a> for the model.
          </>
        }
      />

      <h2>Base URL</h2>
      <p>
        Production: <code>https://api.esy.com</code>. All paths below are under{' '}
        <code>/v1/publications</code>.
      </p>

      <h2>Public reads — no auth</h2>
      <p>
        The headless contract. <code>{'{slug}'}</code> is the publication slug; only publications
        marked public and documents with status <code>published</code> are returned.
      </p>
      <EndpointList
        items={[
          {
            method: 'GET',
            path: '/v1/publications/public/{slug}/articles',
            desc: 'List published documents in a publication.',
          },
          {
            method: 'GET',
            path: '/v1/publications/public/{slug}/articles/{articleSlug}',
            desc: 'Fetch one published document by slug.',
          },
          {
            method: 'GET',
            path: '/v1/publications/public/{slug}/categories',
            desc: 'List the publication’s categories.',
          },
        ]}
      />
      <CodeBlock title="GET /v1/publications/public/esy-research/articles · 200" language="json">
        {listArticlesExample}
      </CodeBlock>

      <h2>Authoring — bearer token</h2>
      <p>
        Authenticated requests are scoped to your account: you only see and manage publications you
        own. Manage tokens from{' '}
        <a href="https://os.esy.com" rel="noopener noreferrer">
          os.esy.com
        </a>
        .
      </p>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/publications', desc: 'List your publications.' },
          { method: 'POST', path: '/v1/publications', desc: 'Create a publication (secret revealed once).' },
          { method: 'GET', path: '/v1/publications/{id}', desc: 'Fetch one of your publications.' },
          { method: 'PATCH', path: '/v1/publications/{id}', desc: 'Update destination fields.' },
          { method: 'DELETE', path: '/v1/publications/{id}', desc: 'Delete; its documents are unfiled, not deleted.' },
          {
            method: 'POST',
            path: '/v1/publications/{id}/secret/rotate',
            desc: 'Mint a new revalidate secret (revealed once).',
          },
          {
            method: 'POST',
            path: '/v1/publications/{id}/verify',
            desc: 'Send a no-op test webhook and record delivery health.',
          },
          {
            method: 'POST',
            path: '/v1/publications/{id}/newsletter',
            desc: 'Connect the Beehiiv email channel (publication id + write-only API key).',
          },
          {
            method: 'DELETE',
            path: '/v1/publications/{id}/newsletter',
            desc: 'Disconnect the email channel; the web destination is untouched.',
          },
          {
            method: 'POST',
            path: '/v1/publications/{id}/newsletter/verify',
            desc: 'Live round-trip to Beehiiv proving the stored key and publication id resolve.',
          },
        ]}
      />
      <p>
        Articles become Beehiiv drafts via{' '}
        <code>POST /v1/documents/&#123;id&#125;/newsletter/draft</code> — see the{' '}
        <a href="/integrations/beehiiv">Beehiiv integration</a> for the model and the email-safe
        transform.
      </p>

      <h3>Create a publication</h3>
      <CodeBlock title="POST /v1/publications" language="json">
        {createExample}
      </CodeBlock>
      <Callout title="The secret is shown once">
        <code>revalidateSecret</code> is returned only on <code>create</code> and{' '}
        <code>secret/rotate</code>. Esy stores it encrypted and never returns it again — copy it into
        your consumer’s environment immediately. Later responses only carry{' '}
        <code>hasRevalidateSecret</code>.
      </Callout>
      <CodeBlock title="201 created" language="json">
        {createResponse}
      </CodeBlock>

      <h2>Categories</h2>
      <p>A publication’s own taxonomy. Authoring endpoints are owner-scoped.</p>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/publications/{id}/categories', desc: 'List categories.' },
          { method: 'POST', path: '/v1/publications/{id}/categories', desc: 'Create a category.' },
          {
            method: 'POST',
            path: '/v1/publications/{id}/categories/reorder',
            desc: 'Reorder by passing ids in the desired order.',
          },
          {
            method: 'PATCH',
            path: '/v1/publications/{id}/categories/{categoryId}',
            desc: 'Rename or re-slug a category.',
          },
          {
            method: 'DELETE',
            path: '/v1/publications/{id}/categories/{categoryId}',
            desc: 'Delete a category; documents survive, links drop.',
          },
        ]}
      />

      <h2>Delivery health</h2>
      <p>
        Every webhook attempt records its outcome on the publication so you can see whether your
        consumer is receiving pings.
      </p>
      <Table
        head={['Field', 'Meaning']}
        rows={[
          [<code key="s">lastDeliveryStatus</code>, '“ok” or “failed”.'],
          [<code key="a">lastDeliveryAt</code>, 'Timestamp of the last attempt.'],
          [<code key="d">lastDeliveryDetail</code>, 'HTTP status or error string for the last attempt.'],
        ]}
      />

      <Callout title="Versioning">
        All endpoints are versioned under <code>/v1</code>. Breaking changes land on a new path and are
        tracked in the <a href="/changelog">changelog</a>.
      </Callout>
    </DocsPageShell>
  );
}
