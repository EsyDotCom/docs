import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, EndpointList, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Beehiiv (newsletters)',
  description:
    'Connect a publication to your own Beehiiv newsletter: Esy turns an article into an email-safe Beehiiv draft — you review and send in Beehiiv.',
};

export default function BeehiivIntegrationPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Integrations · Beehiiv"
        title="Beehiiv (newsletters)"
        lead={
          <>
            Beehiiv is an optional <strong>email delivery channel</strong> on a publication,
            independent of the web destination. Author once in Compose; when an article is worth
            emailing, Esy transforms it into email-safe HTML and creates a <strong>draft</strong> in
            your own Beehiiv account. Nothing sends from Esy — you review and hit send in Beehiiv.
          </>
        }
      />

      <h2>The model</h2>
      <p>
        A publication can publish through two independent channels. Wire either, or both — a
        newsletter-only publication (no website at all) is just one with the web fields left blank.
      </p>
      <Table
        head={['Channel', 'Wiring', '“Publish” means']}
        rows={[
          [
            'Web',
            <>
              <code key="w">siteUrl</code> + <code>sectionPath</code> + revalidate webhook
            </>,
            'The article goes live on your site.',
          ],
          [
            'Email',
            'Beehiiv connection (your publication id + API key)',
            'The article becomes a Beehiiv draft, per article and opt-in.',
          ],
        ]}
      />
      <Callout title="Opt-in per article, draft-first">
        Publishing to the web never emails anyone. “Send to newsletter” is a separate, per-article
        action that is off by default — publish daily for SEO without ever blasting subscribers —
        and it only ever creates a <strong>draft</strong>: sending stays a deliberate step inside
        Beehiiv.
      </Callout>

      <h2>What Esy sends to Beehiiv</h2>
      <p>
        The article’s editor content is transformed into conservative, email-safe HTML — Beehiiv
        wraps it in your newsletter’s template (header, footer, fonts, unsubscribe). Per-node rules:
      </p>
      <Table
        head={['Content', 'Email treatment']}
        rows={[
          ['Headings, paragraphs, lists, quotes, links', 'Pass through, escaped. Only http(s)/mailto links survive.'],
          ['Images', 'Absolute public URLs only, constrained to the email column width.'],
          [
            'Video',
            'Inboxes can’t play video — it becomes the poster image linking to the article on your site (or Mux’s hosted player for newsletter-only publications).',
          ],
          ['Citations', 'Flattened to numbered [n] references with a Sources list appended.'],
          ['Anything else (embeds, scripts)', 'Dropped — never passed through raw.'],
        ]}
      />
      <p>
        The email’s <strong>subject line</strong> and <strong>preview text</strong> are collected
        when you create the draft (prefilled from the article title) and stored on the document, so
        a later re-draft reopens with the same values.
      </p>

      <h2>Security</h2>
      <ul>
        <li>
          The Beehiiv API key is <strong>write-only</strong>: submitted once, encrypted at rest, and
          never returned by any endpoint — responses expose only <code>hasBeehiivKey</code>.
        </li>
        <li>
          The connection is <strong>owner-scoped and self-serve</strong> — it’s your own Beehiiv
          account and key, bound to your own publication.
        </li>
      </ul>

      <h2>Requirements</h2>
      <Callout title="Beehiiv plan gating">
        Beehiiv gates its <em>create-post</em> API by plan tier (Enterprise, in beta on their side
        at time of writing). Connecting and verifying work on any plan; if draft creation isn’t
        available on yours, the error says exactly that. Check your Beehiiv plan before relying on
        the draft flow.
      </Callout>

      <h2>API surface</h2>
      <p>All endpoints are authenticated and owner-scoped.</p>
      <EndpointList
        items={[
          {
            method: 'POST',
            path: '/v1/publications/{id}/newsletter',
            desc: 'Connect (or re-connect) the Beehiiv channel: beehiivPublicationId + beehiivApiKey.',
          },
          {
            method: 'DELETE',
            path: '/v1/publications/{id}/newsletter',
            desc: 'Disconnect the email channel; the web destination is untouched.',
          },
          {
            method: 'POST',
            path: '/v1/publications/{id}/newsletter/verify',
            desc: 'Live round-trip to Beehiiv proving the key and publication id resolve.',
          },
          {
            method: 'POST',
            path: '/v1/documents/{id}/newsletter/draft',
            desc: 'Transform the article and create a Beehiiv draft: { subject?, previewText? }.',
          },
        ]}
      />
      <p>
        The document records provenance: <code>newsletterStatus</code> (<code>&quot;&quot;</code> |{' '}
        <code>&quot;draft&quot;</code>), the Beehiiv post id, when the draft was created, and the
        subject/preview used.
      </p>

      <p>
        Ready to wire it up? Follow the step-by-step{' '}
        <a href="/guides/send-articles-to-beehiiv">Send articles to Beehiiv</a> guide, and see{' '}
        <a href="/concepts/publications">Publications</a> for the delivery-channel model.
      </p>
    </DocsPageShell>
  );
}
