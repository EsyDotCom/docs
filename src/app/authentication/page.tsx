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
  title: 'Authentication',
  description:
    'How to authenticate against api.esy.com: API keys, bearer tokens, workspace scoping, and what to do when a key leaks.',
};

const header = `curl https://api.esy.com/v1/runs \\
  -H "Authorization: Bearer $ESY_API_KEY"`;

const whoami = `curl -s https://api.esy.com/v1/users/me \\
  -H "Authorization: Bearer $ESY_API_KEY"`;

const whoamiResponse = `{
  "id": "6c24a056-…",
  "email": "you@example.com",
  "name": "Your Name",
  "role": "admin",
  "isActive": true,
  "workspaceMemberships": [
    {
      "workspaceId": "9a1b6d4c-…",
      "workspaceSlug": "your-org",
      "workspaceName": "Your Org",
      "workspaceKind": "organization",
      "role": "owner"
    }
  ]
}`;

const unauthorized = `HTTP 401

{ "detail": "Missing authentication token" }`;

export default function AuthenticationPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Get started · Authentication"
        title="Authentication"
        opener="keys"
        lead={
          <>
            Every request carries an API key in an <code>Authorization</code> header. There is one
            mechanism, it is the same on every endpoint, and there is nothing to negotiate — no OAuth
            dance, no request signing.
          </>
        }
      />

      <h2>The header</h2>
      <p>
        Send your key as a bearer token. Secrets start with <code>esy_sk_</code>.
      </p>

      <CodeBlock title="every request" language="bash">
        {header}
      </CodeBlock>

      <p>
        Miss it, or send a revoked key, and you get a <code>401</code>:
      </p>

      <CodeBlock title="401 Unauthorized" language="json">
        {unauthorized}
      </CodeBlock>

      <h2>Creating a key</h2>
      <p>
        Keys are created in{' '}
        <a href="https://os.esy.com" target="_blank" rel="noreferrer">
          os.esy.com
        </a>{' '}
        under Settings → API keys, or through{' '}
        <Link href="/api/api-keys">
          <code>POST /v1/api-keys</code>
        </Link>{' '}
        from a signed-in session.
      </p>

      <Callout title="The secret is shown exactly once" tone="warning">
        Esy stores only a SHA-256 hash of your key. The creation response is the only time the plaintext
        secret exists anywhere you can read it. If you lose it, you cannot recover it — you revoke that
        key and make another.
      </Callout>

      <h2>What a key can do</h2>
      <p>
        This is the part people get wrong. <strong>An API key acts as the user who created it.</strong>{' '}
        It is a credential, not a reduced-privilege role: there is no scope system that lets you mint a
        read-only key today. If the creating account can delete a project, so can a key it created.
      </p>

      <p>
        The one restriction available is workspace binding. A key bound to a workspace can only touch
        that workspace, and a request naming any other is rejected with <code>403</code>. Bind every key
        you create — it is the difference between a leaked key being a problem and being a catastrophe.
      </p>

      <Table
        head={['Property', 'Behaviour']}
        rows={[
          ['Identity', 'The key acts as its creating user, with that user’s permissions.'],
          ['Workspace binding', 'Optional but recommended. Hard-restricts the key to one workspace.'],
          ['Expiry', 'Keys do not expire on their own. Revoke them explicitly.'],
          ['Storage', 'Only a SHA-256 hash is kept. The plaintext is never recoverable.'],
          ['Rate limits', 'Not currently enforced per key. Do not rely on the API to throttle you.'],
        ]}
      />

      <h2>Checking which key you have</h2>
      <p>
        <code>GET /v1/users/me</code> tells you who a key authenticates as and which workspaces it can
        reach. It is the fastest way to confirm a key works and to find the{' '}
        <code>workspaceId</code> you will pass when creating runs.
      </p>

      <CodeBlock title="GET /v1/users/me" language="bash">
        {whoami}
      </CodeBlock>

      <CodeBlock title="200 OK" language="json">
        {whoamiResponse}
      </CodeBlock>

      <h2>Sessions, for browsers</h2>
      <p>
        The dashboard authenticates with a cookie session rather than a key —{' '}
        <code>POST /v1/auth/login</code> sets an <code>esy_session</code> cookie and returns an access
        token. You almost certainly do not want this: it exists for first-party browser clients, and
        cross-origin cookie mutations are rejected with <code>403</code> on purpose. For server-to-server
        work, use a key.
      </p>

      <h2>Keeping a key safe</h2>
      <ul>
        <li>
          Keep it in an environment variable or a secret manager. Never in source control, never in a
          client bundle, never in a URL — query strings end up in logs and browser history.
        </li>
        <li>
          Bind it to one workspace at creation, and create separate keys per deployment so you can revoke
          one without taking down everything.
        </li>
        <li>
          Never put a key in frontend code. A key that reaches a browser is public. Proxy Esy calls
          through your own backend.
        </li>
        <li>
          Revoke on suspicion, not on proof:{' '}
          <code>DELETE /v1/api-keys/{'{key_id}'}</code> takes effect immediately.
        </li>
      </ul>

      <Callout title="If a key leaks" tone="danger">
        Revoke it first, investigate second. Revocation is instant and free; a live leaked key is not.
        Then check <Link href="/api/runs">runs</Link> for work you did not start — every run records{' '}
        <code>createdVia</code>, <code>apiKeyId</code> and <code>apiKeyName</code>, so you can tell
        exactly which credential did what.
      </Callout>

      <Takeaways
        items={[
          <>
            One mechanism: <code>Authorization: Bearer esy_sk_…</code> on every request.
          </>,
          <>
            A key acts as the user who created it. Workspace binding is the only way to narrow it.
          </>,
          <>
            The secret is displayed once and stored only as a hash. Revoke and recreate rather than
            recover.
          </>,
        ]}
      />
    </DocsPageShell>
  );
}
