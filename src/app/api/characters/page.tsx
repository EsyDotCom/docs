import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, EndpointList, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Characters API',
  description:
    'Avatars, their references and frozen versions, the people they depict, likeness consent, provider copies, and the gate every run passes.',
};

const flow = `# 1. The avatar, in a project
POST /v1/characters
{ "projectId": "…", "name": "Dr. Maya", "format": "likeness",
  "persona": { "summary": "Warm, plain-spoken dentist" }, "requestId": "maya-0001" }

# 2. Its references (artifacts you already have)
POST /v1/characters/{characterId}/references
{ "role": "portrait", "artifactId": "artifact-9f1e2d3c" }

# 3. The person it depicts (owners and admins)
POST /v1/workspaces/{workspaceId}/subjects
{ "displayName": "Maya Patel", "email": "maya@northside.example",
  "attestations": { "adult": true, "notPolitical": true } }

# 4. Freeze version 1
POST /v1/characters/{characterId}/versions
{ "subjectId": "…", "note": "first look" }

# 5. Their permission: recorded pending, then activated
POST /v1/subjects/{subjectId}/consents
{ "grantor": "self", "coversLikeness": true, "coversVoice": false,
  "scope": { "uses": ["organic"], "media": ["image", "video"],
             "channels": ["instagram", "web"], "territories": ["US"] },
  "startsOn": "2026-10-01", "endsOn": "2027-10-01",
  "evidenceKind": "signed_document", "evidenceSha256": "9b74c9897bac770ffc029102a200c5de…" }
POST /v1/likeness-consents/{consentId}:activate

# 6. Use it
POST /v1/runs
{ "templateId": "…", "workspaceId": "…", "intake": { "topic": "…", "characterId": "char-7f3a91c2" } }`;

const refused = `422 Unprocessable Entity
{
  "detail": {
    "code": "character_not_usable",
    "reasons": ["consent_revoked"],
    "message": "The person withdrew their permission."
  }
}`;

export default function CharactersApiPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Reference · Characters API"
        title="Characters API"
        lead={
          <>
            Members see a character and whether it can be used today. Owners and admins change characters, and
            only they see the people depicted and the terms of their consent. See{' '}
            <Link href="/concepts/characters">Characters</Link> for the model and the gate.
          </>
        }
      />

      <h2>From nothing to a run</h2>
      <CodeBlock title="a likeness avatar, end to end" language="http">
        {flow}
      </CodeBlock>
      <p>
        A synthetic avatar skips steps 3 and 5. Every write that changes a character returns its new ETag; edits
        need the etag you last read, and creates take a <code>requestId</code>.
      </p>

      <h2>Characters</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/characters', desc: 'A workspace’s characters (workspaceId) or one project’s (projectId). includeArchived to see archived ones.' },
          { method: 'POST', path: '/v1/characters', desc: 'Create in a project: name, format (synthetic | likeness), persona. Owners and admins.' },
          { method: 'GET', path: '/v1/characters/{characterId}', desc: 'The character, its references, its latest version and whether it is usable today.' },
          { method: 'PATCH', path: '/v1/characters/{characterId}', desc: 'Rename or edit the persona draft. Needs the etag. Versions are untouched.' },
          { method: 'DELETE', path: '/v1/characters/{characterId}', desc: 'Archive. Nothing it made is affected.' },
          { method: 'POST', path: '/v1/characters/{characterId}/references', desc: 'Add a reference to the draft: role (portrait, turnaround, expression, outfit, pose, voice_sample, other) and an artifactId from this workspace.' },
          { method: 'DELETE', path: '/v1/characters/{characterId}/references/{itemId}', desc: 'Remove a reference from the draft. Frozen versions keep it.' },
        ]}
      />

      <h2>Versions and the gate</h2>
      <EndpointList
        items={[
          { method: 'POST', path: '/v1/characters/{characterId}/versions', desc: 'Freeze the draft as the next version. A likeness names its subjectId once; later versions keep the same person.' },
          { method: 'GET', path: '/v1/characters/{characterId}/versions', desc: 'Every version, newest first, with its provider copies.' },
          { method: 'POST', path: '/v1/characters/{characterId}/versions/{number}:retire', desc: 'No new work on this version. What it made stays valid.' },
          { method: 'POST', path: '/v1/characters/{characterId}:check', desc: 'The gate for a planned use: media, and optionally use, channel, territory, advertiser, provider, a date or a version.' },
        ]}
      />
      <p>
        A run that can&rsquo;t use its character is refused before anything is priced. The same reasons come back
        from <code>:check</code>, and a run whose consent is withdrawn while it waits fails with them before it
        starts.
      </p>
      <CodeBlock title="a refused run" language="json">
        {refused}
      </CodeBlock>

      <h2>People and consent</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/workspaces/{workspaceId}/subjects', desc: 'The people your characters depict. includeErased to see erased ones.' },
          { method: 'POST', path: '/v1/workspaces/{workspaceId}/subjects', desc: 'Add a person. attestations.adult and attestations.notPolitical must both be true.' },
          { method: 'GET', path: '/v1/subjects/{subjectId}', desc: 'A person and every consent they gave.' },
          { method: 'PATCH', path: '/v1/subjects/{subjectId}', desc: 'Correct their name, email, public role or union status. Needs the etag.' },
          { method: 'POST', path: '/v1/subjects/{subjectId}:erase', desc: 'Erase: blank what identifies them, revoke every consent, retire every version that depicts them.' },
          { method: 'POST', path: '/v1/subjects/{subjectId}/consents', desc: 'Record a consent. It starts pending and allows nothing until activated.' },
          { method: 'POST', path: '/v1/likeness-consents/{consentId}:activate', desc: 'Pending → active.' },
          { method: 'POST', path: '/v1/likeness-consents/{consentId}:suspend', desc: 'Active → suspended (for example, during a strike).' },
          { method: 'POST', path: '/v1/likeness-consents/{consentId}:resume', desc: 'Suspended → active.' },
          { method: 'POST', path: '/v1/likeness-consents/{consentId}:revoke', desc: 'Withdraw, finally. Never blocked by a stale etag; revoking twice is fine.' },
          { method: 'GET', path: '/v1/likeness-consents/{consentId}/events', desc: 'Its history, newest first.' },
        ]}
      />

      <h2>Provider copies</h2>
      <EndpointList
        items={[
          { method: 'POST', path: '/v1/characters/{characterId}/versions/{number}/bindings', desc: 'Record a provider’s copy of a version: provider, assetKind (likeness | voice), its asset id, and the provider’s consent status.' },
          { method: 'PATCH', path: '/v1/character-bindings/{bindingId}', desc: 'Update the provider’s consent status, or disable the copy.' },
        ]}
      />
      <p>
        When a use names a provider, the gate needs both consents: yours (active and covering the use) and the
        provider&rsquo;s (<code>accepted</code>, or <code>not_required</code> for photo-based assets).
      </p>

      <h2>Errors</h2>
      <Table
        head={['Status', 'Code', 'When']}
        rows={[
          ['400', <code key="a">character_batch_unsupported</code>, 'An order featuring a character asked for batch mode.'],
          ['403', <code key="b">admin_required</code>, 'A member tried to change something.'],
          ['409', <code key="c">etag_mismatch</code>, 'Changed since you read it; the body has the current state.'],
          ['409', <code key="d">invalid_transition</code>, 'For example, resuming a revoked consent.'],
          ['409', <code key="e">project_has_characters</code>, 'Deleting a project that has avatars. Archive it instead.'],
          ['422', <code key="f">character_not_usable</code>, 'A run or order the gate refused; reasons say why.'],
          ['422', <code key="g">no_references · subject_required · subject_changed</code>, 'Freezing a version that isn’t ready.'],
          ['428', <code key="h">etag_required</code>, 'An edit without an etag.'],
        ]}
      />

      <Callout title="What the database refuses">
        Editing a frozen version or an active consent&rsquo;s terms, rewriting consent history, a subject who
        isn&rsquo;t attested an adult and not a political figure, a consent longer than 10 years, and any link
        between workspaces. These hold even for requests that never pass through this API.
      </Callout>
    </DocsPageShell>
  );
}
