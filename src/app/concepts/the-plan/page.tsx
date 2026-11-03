import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Status, Table, Takeaways } from '@/components/docs/Primitives';

export const metadata = {
  title: 'The Plan — the bet, the engines, the score (in design)',
  description:
    'The top of the planner: one record that holds an organization’s long-term bet, each brand’s engine (channels → newsletter → offers), and the score, edited by its owner and read by Esy as long-term intent.',
};

const read = `The bet: Grow the agency from an audience we own. Posts bring people to the
newsletter; the newsletter books the calls. From Jan 5 to Jun 30.

Northwind Studio: For owners of local service businesses. Socials bring them
to The Local Letter (northwind.studio/letter), sent one a week.
Rhythm: LinkedIn two a week; YouTube one a week; Instagram one a day.
Named, no rhythm yet: TikTok.
Offers: Managed SEO (selling), Website audits (building).
Goal (the one that matters most): 500 subscribers by Jun 30.

This week: 212 of 500, 18 behind the line. Rhythm 9 of 10 kept.
LinkedIn brings the most per post (4.2).`;

export default function ThePlanPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Planning"
        title="The Plan"
        opener="docks"
        lead={
          <>
            The Plan is the top of the planner: one record that says what the business is going long on, how each
            brand gets there, and how it’s scored. Its owner edits it in place; Esy reads it before it plans a day,
            flags what’s behind, or drafts. It turns everyday work into work toward something.
          </>
        }
      />

      <Callout title="In design" tone="warning">
        <p>
          <Status value="In design" tone="warn" /> The Plan is designed and prototyped in os.esy.com, but not live, and
          its API isn’t published yet. Goals, commitments and tasks, which it’s built from, are live today. This page
          describes how it will work so you can set up the pieces now.
        </p>
      </Callout>

      <h2>The ladder</h2>
      <p>Read top to bottom. Each rung answers one question.</p>
      <Table
        head={['Rung', 'Answers', 'Made of']}
        rows={[
          [<strong key="w">Why</strong>, 'What are we going long on, and until when?', 'The bet, its why, and its window (day 43 of 178)'],
          [<strong key="s">Score</strong>, 'What does it add up to?', <>Goals with a measure and a pace, in priority order. The first is <em>the one that matters most</em></>],
          [<strong key="h">How</strong>, 'Where does it come from?', 'One engine per brand: channels → newsletter → offers'],
          [<strong key="t">This week</strong>, 'Are we on course?', 'The score, the rhythm kept, and how much finished work fed a goal'],
          [<strong key="n">Next</strong>, 'What moves it?', 'Open tasks under each goal, and what Esy suggests from the numbers'],
        ]}
      />
      <p>
        The idea underneath is <strong>lead and lag measures</strong>. Subscribers and clients are the result (lag):
        you can’t move them directly. Posts kept on rhythm are the activity you control (lead). The Plan shows both,
        side by side, so you can tell at a glance whether the work is moving the score.
      </p>

      <h2>Engines: channels → newsletter → offers</h2>
      <p>An engine is one brand’s path to income.</p>
      <Table
        head={['Part', 'What it holds']}
        rows={[
          ['Audience', 'Who it’s for, in a sentence. Esy writes drafts for them.'],
          ['Channels', 'Where people find the brand: YouTube, LinkedIn, Instagram, X, Facebook, TikTok, the brand’s own site. Each has a rhythm, “two a week” or “one a day”, on set days.'],
          ['Newsletter', 'The audience the brand owns, and what it promises its readers. Its subscriber count is usually the first goal’s measure.'],
          ['Offers', 'What the newsletter sells: a product, a service, a sponsor, a community. Each has a stage: selling, building, or idea.'],
        ]}
      />
      <p>
        <strong>A rhythm can go on the checklist.</strong> Then it’s also a{' '}
        <a href="/concepts/commitments">commitment</a>: each day is judged, a miss shows on Home, and the run counts.
        Changing the rhythm changes the commitment from tomorrow, never a day already judged. A rhythm off the checklist
        is still shown and counted, just not firm. A channel named with no rhythm is an open decision: it’s listed
        under “Still to decide” until it gets one or leaves the plan.
      </p>

      <h2>Sources: which channel brought each subscriber</h2>
      <p>
        Every post’s link to the newsletter carries its channel in a <code>?src=</code> tag, such as{' '}
        <code>/letter?src=linkedin</code>. The signup records it once, and the first source wins. A signup through a
        link with no tag is counted as <strong>No tag</strong>, never guessed. From those counts Esy works out each
        channel’s <strong>yield</strong>: subscribers brought per post kept. It shows a channel’s yield only after
        three weeks of tagged links, because before that it’s noise.
      </p>

      <h2>This week: staying the course</h2>
      <Table
        head={['Tile', 'Counts']}
        rows={[
          ['The score', 'The first goal against its line: how far ahead or behind, and what a week needs from here.'],
          ['The rhythm', 'Posts kept of those due so far this week, and which were missed.'],
          ['On the plan', 'Finished tasks this week that fed one of the plan’s goals, out of all finished. The rest is drift, listed by name, without judgment.'],
        ]}
      />
      <p>
        Once a week, a short check-in asks three questions with the numbers in front of you: did the rhythm hold, what
        moved the score, and is the bet still right? Changes to the bet, the window or the goals’ order are kept as
        revisions, so a change of course is a decision, never a drift.
      </p>

      <h2>What Esy reads</h2>
      <p>
        The Plan is rendered as plain lines and read into every planning and drafting call: Today’s suggestions, the
        journal, the check-in, Ask Esy, Compose. It reads like this:
      </p>
      <CodeBlock title="the plan, as Esy reads it" language="text">
        {read}
      </CodeBlock>
      <p>
        Agents treat it as <strong>intent, not instruction</strong>. It says what the owner is going for; it never
        authorizes sending, posting or spending. Esy suggests with the numbers and changes nothing on its own.
      </p>

      <h2>The rules, in short</h2>
      <Table
        head={['', 'Rule']}
        rows={[
          ['One plan', 'One active plan per organization, with a window.'],
          ['Esy counts', 'Pace, yields, the course and drift are computed by api.esy.com and shown by the dashboard.'],
          ['Goals stay goals', 'The plan points at goals; their numbers and pace are the goals’ own.'],
          ['Order is priority', 'The first goal is the one that matters most, everywhere.'],
          ['Counted, never guessed', 'Sources come from tags; untagged is “No tag”.'],
          ['No silent changes', 'Changes to the bet, window and goals are revisions.'],
        ]}
      />

      <Takeaways
        items={[
          'The Plan holds the bet, each brand’s engine and the score, in one record.',
          'Rhythms are the lead measures; goals are the lag measures; both on one page.',
          'Tag every newsletter link with ?src= so the Plan can tell which channel works.',
          'Esy reads the Plan as long-term intent and suggests; the owner decides.',
        ]}
      />
      <p>
        Set it up: <a href="/guides/set-up-your-plan">Set up your Plan</a>. Where it sits:{' '}
        <a href="/concepts/planning">The planner</a>.
      </p>
    </DocsPageShell>
  );
}
