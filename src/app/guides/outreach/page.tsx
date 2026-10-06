import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, PageHeader, StepList, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Outreach: customers and jobs',
  description:
    'How Esy outreach works: one engine, two lanes. Customers and jobs compared side by side — who you target, who decides, the follow-up rhythm, the email, the rules every lane shares, and how the Outreach page is laid out.',
};

// The Customers vs Jobs comparison, as rows: what changes between the two
// lanes of the same outreach engine. Source: the outreach research in
// api.esy.com docs/plans/2026-10-06-outreach/ (report 2, "The job search runs
// the same machine").
const comparison = [
  ['What you want', 'A sale: pages, a retainer, fractional work', 'A role or a contract'],
  ['Who you target', 'Businesses that fit your rules, like roofers in Texas or small agencies', 'Employers you would actually want to work at'],
  ['How targets are ranked', 'A fit score with its reasons: reviews, thin service pages, not a franchise', 'LAMP, from The 2-Hour Job Search: Motivation 0–3, Posting 1–3, Advocacy yes/no'],
  ['Who decides', 'Usually one person: the owner or GM, sometimes an office manager', 'A hiring manager and a recruiter, plus someone inside who will vouch for you'],
  ['Why now', 'Storm reviews, a new location, hiring crew leads', 'A posted role'],
  ['Volume', 'Tens to hundreds of businesses, with daily caps per mailbox', 'At most 5 employers active at once, 2 people at each'],
  ['Follow-up rhythm', '3–4 emails over about two weeks; stops when anyone there replies', '3B7: no reply in 3 business days, write to a second person; at 7, one follow-up to the first'],
  ['The email', 'A short pitch with your offer. It is a sales email, so it carries an unsubscribe link and your postal address', 'Under ~75 words, asking for advice, not a job. It gets the same safeguards anyway; a contract pitch is a sales email and goes separately'],
  ['Sent from', 'A dedicated outreach address, like zev@go.seopage.com', 'Your own address, one to one'],
  ['Sign-off', 'Every first email, then spot checks on follow-ups', 'Every email'],
  ['Finish line', 'They become a client', 'An interview, then an offer'],
];

// Where each part of the Outreach page lives, ordered by how often you touch
// it. Source: the outreach prototypes O1–O8 in os.esy.com /_agency/outreach
// (PR #322); O8 · Triage is the layout that shipped.
const layout = [
  ['Several times a day', 'Needs you (the home tab)', 'One item open at a time, most urgent first: replies, then drafts, then accounts to approve. The rest are one-line rows. You edit the email in place, and acting on an item opens the next one.', 'That person’s context: who works there and what has happened so far.'],
  ['When something breaks', 'Held mail', 'A banner above the queue, only while there’s a problem, such as a mailbox that paused itself.', '—'],
  ['Daily glance', 'Sent', 'Every email sent today. Filter to replied or bounced, and click a row to read it.', 'Mailbox health: each mailbox’s sends against its daily cap, bounce and spam rates, and the domain checks.'],
  ['Weekly', 'Pipeline', 'The funnel as a strip of stages. Picking a stage filters the list below it, and there’s a search box.', 'With a stage picked, why people stopped before it. With none picked, the rules that built the list.'],
  ['Now and then', 'Campaign', 'The steps, each with its own sign-off setting; who it reaches; and the guardrails: when it stops, who it skips, and what every email carries.', 'Budget against the cap, with a field to change the cap, and results so far.'],
  ['Rarely', 'Clay, HighLevel and Cal.com', 'Not on the Outreach page. These connections live in Data.', 'One line in Campaign’s rail says where to find them.'],
];

export default function OutreachGuidePage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Reference · Guides"
        title="Outreach: customers and jobs"
        lead={
          <>
            Esy outreach emails people from <strong>your own mailboxes</strong>: businesses that
            might buy from you, and the people who hire at companies you want to work for. An agent
            does the research and drafts every email; <strong>you sign off before anything sends</strong>.
          </>
        }
      />

      <Callout title="In design">
        The Outreach page is live in Esy OS (the Outreach section of /agency), but it runs on sample
        data: the API behind it isn’t built yet, so nothing it shows is looked up and nothing sends.
        This guide explains how it will work. The API endpoints aren’t public yet; this page will
        link to them when they are.
      </Callout>

      <h2>One engine, two lanes</h2>
      <p>
        Selling to a business and asking for a job look different, but underneath they’re the same
        problem: a decision inside an organization, made by a small group of people, approached with
        a few careful emails. So Esy runs both on one engine. Customers and Jobs are two lanes with
        different settings, not two products.
      </p>

      <h2>Customers vs Jobs</h2>
      <p>What changes between the two lanes:</p>
      <Table head={['', 'Customers', 'Jobs']} rows={comparison.map(([what, customers, jobs]) => [<strong key={what}>{what}</strong>, customers, jobs])} />

      <h2>What every lane shares</h2>
      <ul>
        <li>
          <strong>You sign off.</strong> Nothing sends until you approve it, and every first email
          is reviewed by a person.
        </li>
        <li>
          <strong>Every fact has a source.</strong> Each email address, name, and reason to reach
          out records where it came from and when it was read, so a draft never says anything Esy
          can’t point to.
        </li>
        <li>
          <strong>No guessed addresses.</strong> Esy never emails an address made up from a name
          pattern. US anti-spam law treats generated addresses as an aggravating violation.
        </li>
        <li>
          <strong>Stop means stop.</strong> An unsubscribe or a “please stop” reply puts that person
          on a do-not-contact list across every lane, permanently.
        </li>
        <li>
          <strong>LinkedIn stays manual.</strong> LinkedIn’s terms ban automation, so it only ever
          appears as a task for you.
        </li>
      </ul>

      <h2>How the work flows</h2>
      <StepList
        items={[
          {
            name: 'Set who fits',
            desc: 'Write the rules for the lane: for customers, the kind of business; for jobs, the roles and employers you want. Rules are versioned, so you can see why the list changed.',
          },
          {
            name: 'Esy finds them',
            desc: 'An agent builds the list, finds who decides at each one, finds a real way to reach them, and looks for a reason that’s true this month.',
          },
          {
            name: 'Approve the account',
            desc: 'Each account comes to you as a dossier: why it fits, why now, who decides, how to reach them, and what we’d say. Approve it, ask for one more person, or mark it not a fit.',
          },
          {
            name: 'Sign off the email',
            desc: 'The agent drafts the first email from the dossier. You read it, edit it if you like, and sign it off.',
          },
          {
            name: 'Replies come to you',
            desc: 'Esy sends on schedule, keeps follow-ups in the same thread, stops the moment someone replies, and puts the reply in front of you with a suggested answer.',
          },
        ]}
      />

      <h2>How the Outreach page is laid out</h2>
      <p>
        Each part of the page sits where it does because of how often you use it. The main column
        is where you act. The rail on the right explains whatever is open in the main column.
      </p>
      <Table
        head={['How often', 'What', 'Main column', 'Rail']}
        rows={layout.map(([often, what, main, rail]) => [<strong key={often}>{often}</strong>, what, main, rail])}
      />
      <p>
        One switch in the header picks <strong>Customers</strong> or <strong>Jobs</strong>, and it
        shows how many things wait in each lane, so you never miss the one you aren’t looking at.
      </p>

      <h3>Why it’s laid out this way</h3>
      <ul>
        <li>
          <strong>What you touch most gets the most room.</strong> Replies and drafts come several
          times a day, so they own the home tab. Settings you change once a month sit two tabs
          away.
        </li>
        <li>
          <strong>The main column is for doing; the rail explains.</strong> When a reply is open,
          the rail shows that person’s history. When you look at what was sent, the rail shows
          the mailboxes it went through. Nothing sits in the rail just because there was space.
        </li>
        <li>
          <strong>Held mail is a banner, not a queue row.</strong> A paused mailbox is a problem
          with the pipes, not a person waiting for an answer, so it appears above the queue only
          while it’s true.
        </li>
        <li>
          <strong>The lane switch appears once.</strong> Customers and Jobs change every tab, so
          the switch sits in the header instead of adding a second row of tabs.
        </li>
        <li>
          <strong>Inputs only where the choice is real.</strong> Each step has its own sign-off
          dropdown, the budget cap is a field you can type in, and drafts are edited in place
          instead of behind an Edit button.
        </li>
      </ul>

      <h3>What we tried first</h3>
      <p>
        This layout is the pick from eight prototypes (O1–O8, os.esy.com PR #322). Two alternatives
        lost:
      </p>
      <ul>
        <li>
          <strong>One mixed list with no Sent tab</strong> (O7). Drafts, replies, held mail and
          accounts all shared one list, so you couldn’t filter by kind, and there was nowhere to
          check what had already gone out.
        </li>
        <li>
          <strong>A list and a reader side by side</strong> inside the main column, like an email
          app. It’s faster once the queue runs past about 15 items, but it squeezes the email
          editor, so it stays the runner-up until queues get that long.
        </li>
      </ul>
    </DocsPageShell>
  );
}
