import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, PageHeader, StepList, Table, Takeaways } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Run your week with the planner',
  description:
    'A goal with a number and a date, the must-dos on the critical checklist, tasks filed under the goal, and a day run from Today and Home.',
};

export default function RunYourWeekGuide() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Guide · Planning"
        title="Run your week with the planner"
        lead={
          <>
            This guide sets up the planner in os.esy.com for a real week: one goal that matters, the few things that
            must happen to move it, and the tasks under it. It takes about fifteen minutes. Everything here is live.
          </>
        }
      />

      <h2>1. Set the goal that matters most</h2>
      <StepList
        items={[
          { name: 'Open Goals', desc: 'Add a goal and pick its horizon (“Next six months” runs from today to six months on, less a day).' },
          { name: 'Give it a measure', desc: <>Pick where the number comes from: your newsletter’s subscribers, Stripe sales for the brand, or a value you check in. Esy fills the starting number from the source. See <a href="/concepts/goals">Goals and pace</a>.</> },
          { name: 'Order your goals', desc: 'The first is the one that matters most. When time is short, it wins.' },
        ]}
      />
      <p>
        From the next hourly read, the goal shows its line and its pace: on pace, behind, or too early to call, and what
        a week needs from here.
      </p>

      <h2>2. Put the must-dos on the critical checklist</h2>
      <p>
        Ask what has to happen, no matter what, for the number to move. Those are{' '}
        <a href="/concepts/commitments">commitments</a>. Keep the list short: three to five.
      </p>
      <Table
        head={['If it…', 'Add it as', 'Example']}
        rows={[
          ['happens every day', 'Every day', 'One Instagram post for the newsletter, by noon'],
          ['happens every week, in steps', 'Every week, on its day', 'The newsletter on Thursday: written Saturday, recorded Sunday, sent Thursday 6am'],
          ['happens once, by a date', 'Once', 'Send the client the agreement by Wednesday'],
        ]}
      />
      <p>
        On Today, add it under <strong>Don’t break the chain</strong>. It files under the brand in scope and is ticked
        by hand. Items Esy can see (news posts in your feed, an issue sent, a video published through Esy) are ticked by
        Esy itself.
      </p>
      <Callout title="Starting over" tone="tip">
        Coming back after a rough patch? Give your commitments a start date. Nothing before it is judged, and the
        chain starts clean.
      </Callout>

      <h2>3. File tasks under the goal</h2>
      <p>
        Add the week’s tasks in To do and pick the goal each one serves. Give a task a time and it moves onto the
        Timeline between the day’s deadlines. A task you don’t finish rolls over to today and says how many days late it
        is; Move it to another day, or Drop it.
      </p>

      <h2>4. Run each day</h2>
      <Table
        head={['When', 'Where', 'What to do']}
        rows={[
          ['Morning', 'Home', 'Read the navy rail: what’s left today, the next deadline and its countdown. Tick what you can.'],
          ['During the day', 'Today', 'Work down the chains, then the Timeline, then To do. A late item says how late, in a sentence.'],
          ['If a day can’t happen', 'Today', 'Take a rest day (two a month on daily items) or excuse the day with a reason. A miss you leave stays on top.'],
          ['End of the day', 'Days', 'See what got done and what’s still open.'],
        ]}
      />

      <h2>5. Look at the week</h2>
      <p>
        On Home, the board shows the week’s points against the week before, perfect days in a row, six weeks of daily
        items and the badges. On Goals, each goal’s pace says whether the week moved the line. If the chains held and the
        line didn’t move, the must-dos aren’t the right ones: change them.
      </p>

      <Callout title="Next: the Plan" tone="note">
        The Plan puts all of this under one long-term bet, and shows which channel brings the readers.{' '}
        <a href="/guides/set-up-your-plan">Set up your Plan</a> (in design).
      </Callout>

      <Takeaways
        items={[
          'One goal with a number and a date, first in the list.',
          'Three to five commitments: the things that must happen to move it.',
          'Tasks under the goal; Home and Today to run the day; Days for the record.',
        ]}
      />
    </DocsPageShell>
  );
}
