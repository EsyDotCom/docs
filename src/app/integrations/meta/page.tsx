import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Meta (Instagram and Facebook reach)',
  description:
    'Esy reads views and reach for Instagram accounts and Facebook Pages through Meta’s Graph API, read-only, and shows them as the Plan’s Reach.',
};

const course = `"reach": {
  "days": 28,
  "views": 412,
  "channels": [{
    "channelId": "nw-ig", "network": "instagram", "account": "@northwind",
    "views": 412, "reach": 230,
    "last7": [0, 0, 10, 40, 90, 120, 152],
    "posts": [{ "url": "…", "title": "First line of the caption", "on": "2026-11-03", "views": 152, "reach": 98 }]
  }]
},
"notCounted": { "reach": "LinkedIn and YouTube views aren’t read yet." }`;

export default function MetaIntegrationPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Integrations · Meta"
        title="Meta (Instagram and Facebook reach)"
        lead={
          <>
            Esy reads how many times a brand’s Instagram and Facebook posts were seen, through Meta’s Graph API, and
            shows it as the <a href="/concepts/the-plan">Plan’s</a> <strong>Reach</strong>. The connection only reads.
            It can’t post, reply or spend.
          </>
        }
      />

      <Callout title="Who can connect today">
        Esy reads the Pages and Instagram accounts in its own Meta business portfolio, through a system user that only
        has read access. Connecting your own Meta accounts to your organization comes later.
      </Callout>

      <h2>What’s read</h2>
      <p>Everything covers the last 28 days, today included.</p>
      <Table
        head={['Network', 'Numbers']}
        rows={[
          ['Instagram', 'Views; accounts reached; views on each of the last 7 days; each post in the window with its views and reach'],
          ['Facebook Page', 'Views (each time the Page’s posts were shown), by day'],
        ]}
      />
      <p>
        <strong>Views</strong> count every time something was shown, so one person can count more than once.{' '}
        <strong>Reach</strong> counts accounts, once each. Meta has replaced impressions with views.
      </p>

      <h2>Which account is a channel’s</h2>
      <Table
        head={['Channel', 'Matched by']}
        rows={[
          ['Instagram, with a handle', 'The username, such as @northwind'],
          ['Facebook, with a handle', 'The Page’s name or id'],
          ['Either, with no handle', 'The one Page named like the brand’s domain (Northwind.studio for northwind.studio), and for Instagram, the account linked to it'],
        ]}
      />
      <p>
        Esy never picks the closest match. A channel that matches no account isn’t counted, and the Plan says why.
      </p>

      <h2>What the course returns</h2>
      <p>
        <code>GET /v1/verticals/{'{id}'}/course</code> carries <code>reach</code> (or <code>null</code> when nothing
        was read), and the funnel’s <code>reach</code> is its <code>views</code>. The total adds up only the channels
        that were read. <code>notCounted.reach</code> names the rest.
      </p>
      <CodeBlock title="the course, in part" language="json">
        {course}
      </CodeBlock>

      <h2>Freshness</h2>
      <ul>
        <li>Numbers are read when the board asks, and kept for 15 minutes, so reloading doesn’t call Meta again.</li>
        <li>
          If Meta refuses or can’t be reached, that channel isn’t counted and the Plan gives Meta’s reason. Everything
          else on the board still loads.
        </li>
      </ul>

      <h2>Security</h2>
      <ul>
        <li>The token belongs to a read-only system user, not to a person, and lives only in api.esy.com’s secrets.</li>
        <li>It travels in a request header, never in a URL, so it can’t end up in a log line or an error.</li>
      </ul>
    </DocsPageShell>
  );
}
