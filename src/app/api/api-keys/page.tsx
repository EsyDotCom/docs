import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, EndpointList, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'API Keys',
  description:
    'Machine credentials for calling the Esy API from your applications — create, scope to a workspace, authenticate requests, and revoke.',
};

const createRequest = `{
  "name": "my-app-backend",
  "workspaceId": "b4c5d6e7-f8a9-4b0c-8d1e-2f3a4b5c6d7e"
}`;

const createResponse = `{
  "id": "key-1a2b3c4d",
  "name": "my-app-backend",
  "keyPrefix": "esy_sk_a1b2c",
  "workspaceId": "b4c5d6e7-f8a9-4b0c-8d1e-2f3a4b5c6d7e",
  "lastUsedAt": null,
  "revokedAt": null,
  "createdAt": "2026-07-03T21:15:00.000Z",
  "secret": "esy_sk_a1b2c3…full-secret-shown-once…9f0e"
}`;

const useExample = `curl https://api.esy.com/v1/runs \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"templateId": "generate-research-report", "intake": {"topic": "Desalination costs"}}'`;

export default function ApiKeysPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Reference · API Keys"
        title="API Keys"
        lead={
          <>
            API keys let your <strong>applications</strong> call the Esy API without a browser
            session — runs, artifacts, and costs work exactly as they do for you, because a key
            acts as your account. Create and manage keys from{' '}
            <a href="https://os.esy.com/settings" rel="noopener noreferrer">
              os.esy.com → Settings
            </a>
            .
          </>
        }
      />

      <h2>How keys work</h2>
      <p>
        A key is a bearer secret with the prefix <code>esy_sk_</code>. Esy stores only a hash — the
        full secret is shown <strong>once</strong>, at creation. Send it on every request:
      </p>
      <CodeBlock title="Authenticate a request" language="bash">
        {useExample}
      </CodeBlock>
      <p>
        Requests authenticated with a key behave as your user account: the same permissions, the
        same workspaces, the same runs list you see in the dashboard.
      </p>

      <h2>Workspace binding</h2>
      <p>
        A key created with a <code>workspaceId</code> is <strong>hard-restricted</strong> to that
        workspace:
      </p>
      <Table
        head={['Binding', 'Behavior']}
        rows={[
          [
            <code key="a">Account-wide</code>,
            'Acts across every workspace you belong to; unscoped runs land in your personal workspace.',
          ],
          [
            <code key="w">Workspace-bound</code>,
            'Runs and artifacts default INTO the bound workspace, and every other workspace is forbidden (403) — even ones you belong to.',
          ],
        ]}
      />
      <Callout title="Bind keys for production clients">
        Give each application its own workspace-bound key. If a key ever leaks, the blast radius is
        one workspace and one revocation — not your whole account.
      </Callout>

      <h2>Endpoints</h2>
      <p>
        Key management requires a <strong>user session</strong> (dashboard login) — a key cannot
        create or revoke keys.
      </p>
      <EndpointList
        items={[
          { method: 'POST', path: '/v1/api-keys', desc: 'Create a key (secret revealed once). Max 25 active keys.' },
          { method: 'GET', path: '/v1/api-keys', desc: 'List your keys — names, prefixes, usage; never secrets.' },
          { method: 'DELETE', path: '/v1/api-keys/{id}', desc: 'Revoke immediately. Revoked keys remain listed for audit.' },
        ]}
      />
      <CodeBlock title="POST /v1/api-keys" language="json">
        {createRequest}
      </CodeBlock>
      <CodeBlock title="201 — the only response that ever contains the secret" language="json">
        {createResponse}
      </CodeBlock>

      <h2>Security best practices</h2>
      <ul>
        <li>
          <strong>One key per client.</strong> <code>my-app-backend</code>, <code>ci</code>,{' '}
          <code>local-dev</code> — so revocation is surgical and <em>last used</em> tells you what
          is actually alive.
        </li>
        <li>
          <strong>Environment config only.</strong> Keys belong in your deployment platform&rsquo;s
          secret storage — never in code, git history, client-side JavaScript, or logs.
        </li>
        <li>
          <strong>Bind production keys to a workspace.</strong> Containment by default.
        </li>
        <li>
          <strong>Rotate on any suspicion.</strong> Create the replacement first, deploy it, then
          revoke the old key — zero downtime.
        </li>
        <li>
          <strong>Watch &ldquo;last used&rdquo;.</strong> A key that hasn&rsquo;t been used in
          months shouldn&rsquo;t exist.
        </li>
      </ul>
    </DocsPageShell>
  );
}
