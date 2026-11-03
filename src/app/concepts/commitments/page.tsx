import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Status, Table, Takeaways } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Commitments — what must happen, with proof',
  description:
    'Daily, weekly and once items with deadlines and proof. Esy checks the proof itself, settles each day, keeps the record as a chain, and counts runs, rest days, points and badges.',
};

const weekly = `{
  "title": "The issue and its video",
  "cadence": "weekly",
  "weekday": 3,                      // Thursday (0 = Monday)
  "timezone": "America/New_York",
  "items": [
    { "label": "Tutorial written",  "dayOffset": -5, "at": "17:00", "proof": "manual" },
    { "label": "Roundup locked",    "dayOffset": -1, "at": "15:00", "proof": "manual" },
    { "label": "Video live",        "dayOffset": 0,  "at": "06:00", "proof": "youtube" },
    { "label": "Issue sent",        "dayOffset": 0,  "at": "06:00", "proof": "issue_sent" }
  ]
}`;

export default function CommitmentsConceptPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Planning"
        title="Commitments"
        opener="review"
        lead={
          <>
            A task is done once. A <strong>commitment</strong> comes due again and again, or once by a date, and is due
            by a time, with proof: three news posts every day by 9am; the newsletter and its video every Thursday. Esy
            checks the proof itself and is firm about it. In os.esy.com this is the <strong>critical checklist</strong>{' '}
            on Today, and the score board on Home.
          </>
        }
      />

      <h2>The three cadences</h2>
      <Table
        head={['Cadence', 'Due', 'Example']}
        rows={[
          [<code key="d">daily</code>, 'Every day', 'One Instagram post for the newsletter, by noon'],
          [<code key="w">weekly</code>, 'Every week on its weekday; its steps can fall on the days before', 'The issue and its video, Thursdays'],
          [<code key="o">once</code>, 'One time, by a date (dueDate)', 'Send the client the agreement by Wednesday'],
        ]}
      />

      <h2>Items: the steps, each with a deadline and proof</h2>
      <p>A commitment is a list of items. Each one says when it’s due and how Esy knows it happened.</p>
      <Table
        head={['Field', 'Means']}
        rows={[
          [<code key="l">label</code>, 'The step, in words.'],
          [<code key="o">dayOffset</code>, 'Days before the due day, 0 to −6. A daily commitment’s items are all 0.'],
          [<code key="a">at</code>, 'A wall-clock time in the commitment’s zone ("07:00"), or none for the end of that day. Daylight saving never moves it.'],
          [<code key="p">proof</code>, 'Where Esy looks: news_feed, issue_sent, youtube, or manual.'],
        ]}
      />
      <CodeBlock title="a weekly commitment with steps across the week" language="jsonc">
        {weekly}
      </CodeBlock>

      <h2>Proof</h2>
      <Table
        head={['Proof', 'Done when', 'Notes']}
        rows={[
          [<code key="n">news_feed</code>, 'A post in the feed was published that day', 'The day’s posts fill the news items in deadline order. News can’t be ticked by hand: the feed shows whether a post is live.'],
          [<code key="i">issue_sent</code>, 'An issue’s email went out that week', 'Read from the send record.'],
          [<code key="y">youtube</code>, 'A video was published through Esy that week', 'A video uploaded straight to YouTube can be marked done by hand.'],
          [<code key="m">manual</code>, 'You marked it done', 'The record says so.'],
        ]}
      />
      <p>
        If Esy can’t read a source just now, the item is <code>unknown</code>, not late, and the day is never called
        missed on a guess.
      </p>

      <h2>How a day ends</h2>
      <Table
        head={['Status', 'When']}
        rows={[
          [<Status key="o" value="open" tone="active" />, 'Not settled yet.'],
          [<Status key="m" value="met" tone="good" />, 'Every counted item is done. Each item says whether it beat its deadline; a late item done later still turns the day met, not on time.'],
          [<Status key="x" value="missed" tone="bad" />, 'The last deadline passed without every item done.'],
          [<Status key="e" value="excused" tone="warn" />, 'You gave a reason. It stays on the record.'],
        ]}
      />
      <p>
        A sweep settles each commitment’s current day, and the day before, every ten minutes, whether or not anyone
        opens the page. <strong>Firm:</strong> a missed day stays at the top of Today and Home until it’s done or
        excused.
      </p>

      <h2>The chain and the score</h2>
      <p>Esy counts all of it from how each day ended; the page only shows the numbers.</p>
      <Table
        head={['', 'Rule']}
        rows={[
          ['A run', 'Days (or weeks) kept in a row. A met day grows it, late or not. An excused day or a rest day holds it. A missed day breaks it. Today counts once it’s kept.'],
          ['Rest days', 'Two a calendar month per organization, on daily items, taken on the day itself. A rest day holds the run without growing it, and can be taken back.'],
          ['A perfect day', 'Every daily item due that day kept or rested, and at least one kept.'],
          ['Points', '10 for a kept daily day, 30 for a kept week, 40 for a once item; half when late. A level every 400 points.'],
          ['Badges', 'Seven in a row, a perfect day, a month of weeks, a perfect week, thirty in a row.'],
        ]}
      />

      <h2>Starting fresh</h2>
      <p>
        <code>startsOn</code> is the first day a commitment counts. No day before it is judged, and days already on
        record before it don’t count toward the run, the score or the history. A step due before it (a weekly item’s
        early steps in its first week) has the state <code>skipped</code>: the page says “before your start”, it’s
        never late, and it isn’t counted in “2 of 6 so far”.
      </p>

      <Callout title="A commitment is not a big task" tone="tip">
        If it repeats and missing it matters, it’s a commitment. If it happens once and you’ll know when it’s done,
        it’s a task. A once item sits between them: a deadline you can’t let slip, with its own countdown.
      </Callout>

      <p>
        Reference: <a href="/api/commitments">Commitments API</a>. How it fits with goals and tasks:{' '}
        <a href="/concepts/planning">The planner</a>.
      </p>

      <Takeaways
        items={[
          'Daily, weekly or once; each item has a deadline and a proof source.',
          'Esy checks the proof and settles each day; a miss stays until it’s done or excused.',
          'Runs, rest days, points and badges are counted by Esy from the record.',
          'startsOn gives a fresh start: nothing before it is judged.',
        ]}
      />
    </DocsPageShell>
  );
}
