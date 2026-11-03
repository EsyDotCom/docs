import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, PageHeader, Status, StepList, Table, Takeaways } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Set up your Plan (in design)',
  description:
    'Write the bet, map each brand’s engine from channels to newsletter to offers, give every channel a rhythm, and tag your links so Esy can tell which channel works.',
};

export default function SetUpYourPlanGuide() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Guide · Planning"
        title="Set up your Plan"
        lead={
          <>
            The <a href="/concepts/the-plan">Plan</a> holds your long-term bet, how each brand gets there, and the score.
            This guide walks through writing one, so the day-to-day work in the planner adds up to something you chose.
          </>
        }
      />

      <Callout title="In design" tone="warning">
        <p>
          <Status value="In design" tone="warn" /> The Plan section isn’t live yet. Steps 1, 4 and 5 use pieces that are
          live today (goals, commitments, tagged links), so you can do them now and the Plan will pick them up.
        </p>
      </Callout>

      <h2>1. Decide the bet and its window</h2>
      <p>
        One or two sentences: what you’re going long on, and until when. Then one sentence on why. Keep it about the
        business, not the tactics.
      </p>
      <Table
        head={['Good', 'Too small']}
        rows={[
          ['Grow the agency from an audience we own: posts bring people to the newsletter, and the newsletter books the calls. Jan 5 to Jun 30.', 'Post more on LinkedIn.'],
        ]}
      />

      <h2>2. Map each brand’s engine</h2>
      <StepList
        items={[
          { name: 'Audience', desc: 'Who the brand is for, in a sentence. Esy writes for them.' },
          { name: 'Newsletter', desc: 'The audience you own, and what it promises: “one system a week, built and shown”.' },
          { name: 'Channels', desc: 'Every place people find the brand. Name the ones you’re not doing yet too; they show as “Still to decide”.' },
          { name: 'Offers', desc: 'What the newsletter sells, each with a stage: selling, building, or idea.' },
        ]}
      />

      <h2>3. Give every channel a rhythm</h2>
      <p>
        A rhythm is how often a channel posts: “one a day”, “two a week on Tuesday and Thursday”. Rhythms are the lead
        measures, the part you control. Put the ones that matter most on the critical checklist, so a miss shows on Home.
        Leave the rest off, and they’re still counted.
      </p>
      <Callout title="Start with what you can keep" tone="tip">
        Begin with the rhythms you’re sure of and add one when they hold. A channel posted to on rhythm gives the
        Plan a clean count to read.
      </Callout>

      <h2>4. Set the score</h2>
      <p>
        Add a goal with a measure for each engine (usually newsletter subscribers) and one for the money (sales, or
        clients). Put them in order: the first is the one that matters most. See{' '}
        <a href="/concepts/goals">Goals and pace</a>.
      </p>

      <h2>5. Tag your links</h2>
      <p>
        Every post’s link to the newsletter carries its channel: <code>/newsletter?src=linkedin</code>,{' '}
        <code>?src=youtube</code>, <code>?src=instagram</code>. That’s how the Plan counts which channel brought each
        subscriber. Untagged signups show as “No tag”, never guessed. Use the same tag for a channel every time.
      </p>
      <Table
        head={['Channel', 'Tag']}
        rows={[
          ['YouTube (description, pinned comment)', <code key="y">?src=youtube</code>],
          ['LinkedIn', <code key="l">?src=linkedin</code>],
          ['Instagram (bio link)', <code key="i">?src=instagram</code>],
          ['X', <code key="x">?src=x</code>],
          ['Facebook', <code key="f">?src=facebook</code>],
          ['TikTok', <code key="t">?src=tiktok</code>],
        ]}
      />

      <h2>6. Check in once a week</h2>
      <p>
        Once a week, with the numbers in front of you: did the rhythm hold, what moved the score, is the bet still
        right? After three weeks of tagged links, each channel’s yield (subscribers per post) says where the next hour
        is best spent. Change the plan on purpose, with a reason; it keeps every revision.
      </p>

      <Takeaways
        items={[
          'A bet with a window, an engine per brand, a rhythm per channel, a goal per engine.',
          'The most important rhythms go on the critical checklist.',
          'Tag every link with ?src= now, so the Plan can count from the start.',
        ]}
      />
    </DocsPageShell>
  );
}
