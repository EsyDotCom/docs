import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, PageHeader, StepList, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Outreach: customers and jobs',
  description:
    'How Esy outreach works: one engine, two lanes. Customers and jobs compared side by side — who you target, who decides, the follow-up rhythm, the email, and the rules every lane shares.',
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
        Outreach is being designed in Esy OS (the Outreach section of /agency). This guide explains
        how it will work. The API endpoints aren’t public yet; this page will link to them when
        they are.
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
    </DocsPageShell>
  );
}
