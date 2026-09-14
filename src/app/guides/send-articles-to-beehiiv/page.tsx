import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, PageHeader, StepList, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Send articles to Beehiiv',
  description:
    'Connect a publication to your Beehiiv newsletter, then turn any article into a reviewed, email-safe Beehiiv draft — without ever auto-sending.',
};

const draftExample = `POST /v1/documents/{documentId}/newsletter/draft
{
  "subject": "How to get started with AI",
  "previewText": "A practical on-ramp — no jargon, no math."
}

// 200
{
  "status": "draft",
  "beehiivPostId": "post_8f0c2a1e-…",
  "draftedAt": "2026-07-03T14:02:11.004Z",
  "reviewUrl": "https://app.beehiiv.com/posts"
}`;

export default function SendArticlesToBeehiivGuidePage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Reference · Guides"
        title="Send articles to Beehiiv"
        lead={
          <>
            Wire a publication to your own Beehiiv newsletter once, then turn any article into an
            email-safe <strong>Beehiiv draft</strong> per article, on demand. Esy never sends email —
            you review and send inside Beehiiv, so a daily publishing cadence never blasts your
            subscribers.
          </>
        }
      />

      <h2>Before you start</h2>
      <ul>
        <li>
          A publication in Compose (any publication works — the newsletter channel is independent of
          the web destination, so even a publication with no website qualifies).
        </li>
        <li>
          A Beehiiv account with an <strong>API key</strong> and your Beehiiv{' '}
          <strong>publication id</strong> (<code>pub_…</code>) — both in the Beehiiv dashboard under{' '}
          <em>Settings → API</em>.
        </li>
      </ul>
      <Callout title="Check your Beehiiv plan first">
        Beehiiv gates its create-post API by plan tier (Enterprise, in beta on their side).
        Connecting and verifying work on any plan; creating drafts requires a plan that includes API
        post creation. If yours doesn’t, the draft step returns exactly that message.
      </Callout>

      <h2>Steps</h2>
      <StepList
        items={[
          {
            name: 'Connect Beehiiv to the publication',
            desc: (
              <>
                In Compose, open your publication → <strong>Connect</strong> tab →{' '}
                <strong>Newsletter (Beehiiv)</strong>. Paste your Beehiiv publication id and API key,
                then hit <em>Connect Beehiiv</em>. The key is encrypted at rest and never shown
                again — you can replace it later, but not read it back.
              </>
            ),
          },
          {
            name: 'Verify the connection',
            desc: (
              <>
                Click <em>Verify</em>. Esy makes a live round-trip to Beehiiv with your stored key —
                success shows your newsletter’s name; failure tells you precisely what’s wrong (bad
                key, wrong publication id, unreachable).
              </>
            ),
          },
          {
            name: 'Write and file an article',
            desc: (
              <>
                Author normally in Compose and file the article into the connected publication in{' '}
                <strong>Details</strong>. Publishing to the web stays exactly as before — and never
                emails anyone.
              </>
            ),
          },
          {
            name: 'Create the Beehiiv draft',
            desc: (
              <>
                In the editor’s <strong>Details</strong> panel, a <strong>Newsletter</strong> section
                appears (only for connected publications). Click <em>Send to newsletter…</em>, set
                the subject line (prefilled from the title) and preview text, and hit{' '}
                <em>Create Beehiiv draft</em>.
              </>
            ),
          },
          {
            name: 'Review and send in Beehiiv',
            desc: (
              <>
                The section flips to <em>Draft created</em> with a <em>Review &amp; send in
                Beehiiv</em> link. Open the draft in Beehiiv, check the rendering, pick your
                audience, and send from there — that final step always stays in Beehiiv.
              </>
            ),
          },
        ]}
      />

      <h2>What the draft contains</h2>
      <p>
        Esy transforms the article into email-safe body HTML and Beehiiv wraps it in your
        newsletter’s own template. The notable degradations:
      </p>
      <Table
        head={['In the article', 'In the email']}
        rows={[
          ['Text, headings, lists, quotes, links', 'Rendered normally (escaped; only web/mailto links kept).'],
          ['Images', 'Kept — constrained to the email column width.'],
          ['Video', 'A thumbnail linking to the published article (inboxes can’t play video).'],
          ['Citations', 'Numbered [n] references plus a Sources list at the end.'],
        ]}
      />

      <h2>Doing it over the API</h2>
      <p>
        The Compose UI is a thin layer over one endpoint — pipelines can create drafts directly.
        Subject falls back to the stored value, then the article title; whatever is used persists on
        the document for the next draft.
      </p>
      <CodeBlock title="create a draft" language="json">
        {draftExample}
      </CodeBlock>

      <h2>Troubleshooting</h2>
      <Table
        head={['Symptom', 'Cause & fix']}
        rows={[
          [
            'Verify fails with a 401 message',
            'Beehiiv rejected the API key — re-copy it from Beehiiv Settings → API and use Replace key.',
          ],
          [
            'Verify fails with a 404 message',
            'The publication id doesn’t belong to that key. Check you copied the pub_… id from the same Beehiiv workspace as the key.',
          ],
          [
            'Draft creation says it may not be available on this plan',
            'Beehiiv’s create-post API is plan-gated (Enterprise). Connect/verify still work; upgrade the Beehiiv plan to create drafts via API.',
          ],
          [
            'No Newsletter section in the Details panel',
            'The article isn’t filed into a publication with a Beehiiv connection — file it in Details, and connect Beehiiv in the publication’s Connect tab.',
          ],
          [
            'Video shows as an image in the email',
            'Expected — email clients can’t play video, so it degrades to a poster linking to the article (or Mux’s hosted player for newsletter-only publications).',
          ],
        ]}
      />

      <p>
        For the integration model, security posture, and full endpoint list, see the{' '}
        <a href="/integrations/beehiiv">Beehiiv integration</a> reference.
      </p>
    </DocsPageShell>
  );
}
