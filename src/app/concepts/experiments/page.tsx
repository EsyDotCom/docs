import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, EndpointList, PageHeader, StepList, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Experiments & benchmarks',
  description:
    'How Esy decides things with measurement: a frozen design, arms, a versioned case set, trials that are ordinary runs, scores in their own table, and a report you can hand to someone.',
};

const designFile = `{
  "name": "Difference matte: which model repaints its own render",
  "kind": "benchmark",
  "hypothesis": "2.5 Sunburst repainting its own render holds the subject still at least as well as the split pairing, at the same cost per item.",

  "primaryMetric":    { "scorer": "diffmatte_pair", "key": "pairConsistency", "direction": "higher", "threshold": 0.95 },
  "guardrailMetrics": [{ "scorer": "run_metrics", "key": "cost_usd", "direction": "lower", "maxDegradation": 0.005 }],
  "analysisPlan":     { "paired": true, "bootstrapSamples": 2000, "correction": "holm", "alpha": 0.05 },

  "repeats": 1,
  "budgetLimitUsd": 3.0,
  "concurrency": 4,

  "caseSet": {
    "name": "diffmatte-pair-prompts",
    "casesFile": "experiments/cases/diffmatte-pair-prompts-2026-09-10.json"
  },

  "arms": [
    { "key": "A", "label": "Sunburst render, gpt-image-2 repaint", "isBaseline": true,
      "workflowId": "generate-clip-art-diffmatte",
      "intakeOverrides":   { "style": "flat", "quality": "low" },
      "providerOverrides": { "imageEditor": "openai/gpt-image-2-2026-04-21" } },

    { "key": "B", "label": "Sunburst render, Sunburst repaint",
      "workflowId": "generate-clip-art-diffmatte",
      "intakeOverrides":   { "style": "flat", "quality": "low" },
      "providerOverrides": { "imageEditor": "openai/gpt-image-2.5-sunburst-2026-09-08" } }
  ]
}`;

const caseShape = `{
  "caseId": "s02",
  "intake": { "prompt": "A noble fir Christmas tree in three-quarter view, …" },
  "tags":   { "category": "christmas", "elementType": "subject" },
  "holdout": false,
  "source": { "runId": "run-7717b86b" }
}`;

const cli = `# what it would cost, and nothing else
python -m scripts.experiment run experiments/designs/diffmatte-model-pair.json --dry-run

# run it and wait, then write the report next to you
python -m scripts.experiment run experiments/designs/diffmatte-model-pair.json --wait --out report.html

python -m scripts.experiment status exp-1a2b3c4d
python -m scripts.experiment report exp-1a2b3c4d --out report.html`;

const statsShape = `{
  "primary": { "metric": "diffmatte_pair.pairConsistency", "direction": "higher", "threshold": 0.95 },
  "baselineArmKey": "A",
  "perArm": {
    "A": { "passRate": 0.50, "median": 0.951, "p10": 0.922, "min": 0.919, "scored": 26, "costUsd": 0.295 },
    "B": { "passRate": 0.50, "median": 0.958, "p10": 0.894, "min": 0.703, "scored": 26, "costUsd": 0.298 }
  },
  "deltas": {
    "B": { "mean": 0.004, "low": -0.010, "high": 0.019, "p": 0.62,
           "pairedCases": 26, "significant": false }
  },
  "thresholdSweep": { "grid": [0.80, 0.82, …], "perArm": { "A": [1.0, 1.0, …], "B": […] } },
  "failures": { "perArm": { "A": { "byCode": {}, "rate": 0.0 } }, "srm": null },
  "verdictHints": ["arm B vs A on diffmatte_pair.pairConsistency: +0.0040 …"]
}`;

export default function ExperimentsPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Experiments"
        title="Experiments &amp; benchmarks"
        lead={
          <>
            An experiment is how Esy settles a question with measurement instead of opinion: you write down what you
            think and how you will know, freeze it, and then the platform runs the comparison, scores it, and files a
            report you can hand to someone six months from now. It is the same shape whether you are choosing between
            two image models, testing a template change, or watching production for regressions.
          </>
        }
      />

      <h2>Why this exists</h2>
      <p>
        Before this, every comparison was a script someone wrote once. Twenty of them accumulated in one repository.
        Each re-invented how to run the arms, how to poll for results, how to price them, and how to draw a report.
        The results lived in untracked files with four different names. The findings ended up as dated comments beside
        the constants they changed, which is fine until you want to ask “is that still true?” — and one published
        report was deleted and had to be rebuilt from scratch.
      </p>
      <p>
        Then the cost of that showed up. A production quality gate was set from a bench of nineteen subjects whose
        scores did not look like real work. For two days, packs lost between nine and thirty-nine items each, and
        the code comment beside the number said the number was calibrated. It was — against the wrong thing.
      </p>
      <Callout title="The one rule everything follows from">
        <p>
          <strong>A claim about quality is worth what its record is worth.</strong> If you cannot re-run it, see what
          it ran on, and tell which version of which scorer produced the number, it is an anecdote. Experiments exist
          to turn anecdotes into records.
        </p>
      </Callout>

      <h2>The six nouns</h2>
      <p>
        Learn these and the rest of the page is detail. Nothing here is a new kind of execution — an experiment
        borrows the machinery that already runs your work.
      </p>
      <Table
        head={['Noun', 'What it is', 'Where it lives']}
        rows={[
          [
            <strong key="cs">Case set</strong>,
            'The inputs every arm sees — prompts and their intake, tagged, with an optional hold-out flag. Versioned: version 3 is readable forever, so a benchmark can say exactly what it ran on.',
            'Its own record, one immutable version per revision',
          ],
          [
            <strong key="e">Experiment</strong>,
            'The design: the hypothesis, the primary metric, the guardrails, the analysis plan, the budget. Frozen before the first trial.',
            'Its own record',
          ],
          [
            <strong key="a">Arm</strong>,
            'One thing under test: a template at a pinned version, plus the intake and model choices that make it this arm and not another. A to E.',
            'Its own record, under the experiment',
          ],
          [
            <strong key="t">Trial</strong>,
            'One case × one arm × one repeat. The work itself is an ordinary run, so it gets a run id, a cost ledger, quality gates and provenance for free.',
            'A row pointing at a run',
          ],
          [
            <strong key="s">Score</strong>,
            'A number a named scorer produced from a settled trial, stamped with the scorer’s version. Append-only.',
            'Its own table',
          ],
          [
            <strong key="r">Report</strong>,
            'A self-contained page plus a statistics blob, filed as a knowledge artifact with the provenance to reproduce it. A decision record can follow it.',
            'An artifact in the project',
          ],
        ]}
      />

      <h2>The rules, and why each one is there</h2>
      <Table
        head={['Rule', 'Why']}
        rows={[
          [
            <strong key="1">The design freezes before anything runs</strong>,
            'An analysis plan chosen after looking at the numbers is not a plan. Freezing pins the case-set version and each arm’s template version, validates every case against every arm, and hashes the whole design. After that, only the name can change.',
          ],
          [
            <strong key="2">A trial is an ordinary run</strong>,
            'Run ids, the cost ledger, the quality gates and the provenance already exist. A separate execution path would have none of them, and would drift from what production actually does — which is the thing you are trying to measure.',
          ],
          [
            <strong key="3">Failures are data, never gaps</strong>,
            'A trial that failed or was skipped for budget is a row with a reason. The report counts them per arm and says so when one arm lost many more than another, because a pass rate computed over a different number of samples is not comparable.',
          ],
          [
            <strong key="4">No retries</strong>,
            'An experiment measures what the template does, including how often it fails. Retrying measures a different template.',
          ],
          [
            <strong key="5">Trials interleave per case</strong>,
            'Case 1 for every arm, then case 2. Rate limits, provider hiccups and time of day then land on every arm alike, and the comparison is paired by construction.',
          ],
          [
            <strong key="6">Scores live in their own table, versioned</strong>,
            'When a scorer changes behaviour it bumps its version and writes new rows beside the old ones. History is re-scored instead of orphaned, and a report always says which version produced which number.',
          ],
          [
            <strong key="7">The report is an artifact</strong>,
            'It carries its own pictures and its own provenance: design hash, arm specs, run ids, scorer versions, code commit. A report that goes blank when a bucket is reorganised is not a record.',
          ],
          [
            <strong key="8">The analysis never decides</strong>,
            'It produces numbers and hints. Shipping is a decision a person records, and that decision is itself an artifact linked to the report.',
          ],
        ]}
      />

      <h2>Running one, start to finish</h2>
      <StepList
        items={[
          {
            name: 'Write the design',
            desc: 'A JSON file, committed next to the code. It is the create body plus, optionally, an inline case set. Keeping it in the repository is what makes “run last month’s benchmark again” a command rather than an archaeology project.',
          },
          {
            name: 'Dry-run it',
            desc: 'Prices every arm × case × repeat with the same estimator a single run uses, and executes nothing. If the estimate exceeds the budget cap, freezing tells you before you spend.',
          },
          {
            name: 'Freeze it',
            desc: 'Pins versions, validates every case against every arm’s intake schema and every model override, computes the design hash. A bad case fails here, not after forty renders.',
          },
          {
            name: 'Run it',
            desc: 'Trials are planned interleaved, executed under the experiment’s own budget ceiling and the workspace budgets, and settled from each run’s record.',
          },
          {
            name: 'Read the report',
            desc: 'Pass rate at the gate, median, p10, worst, the per-case delta against the baseline with an interval, cost, latency, and what each arm lost. Drag the gate to see what a different threshold would have done.',
          },
          {
            name: 'Record the decision',
            desc: 'Ship, hold or revert, with the rationale and a link to the report. The next canary reads this to know what the current baseline is.',
          },
        ]}
      />

      <CodeBlock title="experiments/designs/diffmatte-model-pair.json" language="json">
        {designFile}
      </CodeBlock>

      <CodeBlock title="the command line" language="bash">
        {cli}
      </CodeBlock>

      <h2>Designing one that answers something</h2>

      <h3>Pick one primary metric</h3>
      <p>
        One number decides, and you name it before you look. Everything else is a guardrail: reported, watched, and
        allowed to be the reason you say no, but never the reason you say yes. Guardrails carry a{' '}
        <code>maxDegradation</code> — how much worse than the baseline is still acceptable.
      </p>

      <h3>Choose the baseline deliberately</h3>
      <p>
        One arm is the baseline, and it should be what runs in production today. Every other arm is reported as a
        difference from it, computed per case: the same prompt, the same seed policy, arm B minus arm A. Per-case
        differences cancel out how hard each case is, which is most of the variation in a generation benchmark.
      </p>

      <h3>Cases, and the hold-out</h3>
      <p>
        A case set is versioned and private. Seed one from production — the runs that failed last night are the best
        benchmark you will ever have — and keep a hold-out slice that never feeds prompt tuning. Hold-out cases are
        excluded unless the plan asks for them, and a report says when they were included. Once a decided experiment
        has used a version, its hold-out flags cannot be flipped in place; that would make the split meaningless.
      </p>
      <CodeBlock title="one case" language="json">
        {caseShape}
      </CodeBlock>

      <h3>Repeats, not seeds</h3>
      <p>
        The image providers do not expose a seed, so repeats are the seed policy: the same case run N times gives you
        the spread. Cost is linear in repeats, so start at one for a screening comparison and raise it when the
        difference you care about is close to the noise.
      </p>

      <h3>Multiple arms</h3>
      <p>
        Every extra arm is another chance for one to look good by luck, so the analysis applies a Holm correction
        across the arms on the primary metric, and marks a delta as significant only if it survives. Guardrails are
        reported without correction — they exist to be looked at, not to be tested.
      </p>

      <Callout title="Never peek and stop early">
        <p>
          Watching a running experiment and stopping when it looks good is how you get a result that is real for
          nobody. The sample is fixed at freeze. If you need to look early, that is a design change: raise the
          repeats, or run again.
        </p>
      </Callout>

      <h2>Reading the report</h2>
      <Table
        head={['What you see', 'What it means', 'What it does not mean']}
        rows={[
          [
            <strong key="p">Pass rate</strong>,
            'The share of scored trials at or past the gate, at whatever threshold the slider is on.',
            'Not a quality score. A gate is a business rule; move it and the number moves.',
          ],
          [
            <strong key="d">Δ vs baseline [interval]</strong>,
            'The mean per-case difference, with a 95% bootstrap interval. A ★ means it survived the multi-arm correction.',
            'An interval that spans zero is not “slightly better”. It is “we cannot tell”.',
          ],
          [
            <strong key="m">Median and p10</strong>,
            'The typical case and the bad tail. p10 is where a tenth of cases score below.',
            'A good median with a terrible p10 is a lane that fails loudly on a subset — find the subset.',
          ],
          [
            <strong key="l">Lost</strong>,
            'Trials that failed or were skipped, by reason, per arm.',
            'Not noise to ignore. If one arm lost far more, its pass rate is not comparable and the report says so.',
          ],
          [
            <strong key="c">Cost and median time</strong>,
            'What the arm actually billed and how long it took, from the same ledger the invoices come from.',
            'Not an estimate. This is the recorded cost.',
          ],
        ]}
      />
      <CodeBlock title="the statistics blob a report carries" language="json">
        {statsShape}
      </CodeBlock>

      <h2>The scorers</h2>
      <p>
        A scorer is a named, versioned function that turns a settled trial into numbers. It never decides anything —
        thresholds belong to the design, verdicts to the analysis — so the same scorer serves an experiment that wants
        a hard gate and one that wants a distribution.
      </p>
      <Table
        head={['Scorer', 'What it measures']}
        rows={[
          [<code key="rm">run_metrics</code>, 'The run itself: outcome, cost, duration, time to first artifact, whether a gate rejected it. Free, and always runs.'],
          [<code key="aa">alpha_audit</code>, 'The cutout audit’s metrics as the audit recorded them: edge halo, kept pockets, damaged holes, key spill and the rest.'],
          [<code key="dp">diffmatte_pair</code>, 'The difference-matte pair: how still the repaint held, and the shape of the recovered transparency.'],
        ]}
      />
      <p>
        Adding one is a function plus a registry entry. Changing what an existing one returns for the same input is a
        version bump — that is the whole contract, and it is what lets you re-score a year of history and compare it
        honestly.
      </p>

      <h2>When not to use an experiment</h2>
      <Table
        head={['Situation', 'Do this instead']}
        rows={[
          ['You want to see what one prompt looks like on a new model', 'Run it. One picture is not a benchmark, and pretending it is wastes a design.'],
          ['There is no template for the thing you are testing', 'Author the template first. Arms run through templates so trials get run ids, ledgers and gates; a comparison outside them has none of that.'],
          ['You are debugging a single broken run', 'Read the run. An experiment answers “which is better across many cases”, not “why did this one fail”.'],
        ]}
      />

      <h2>Anti-drift rules</h2>
      <Callout title="Read this before writing a one-off bench script">
        <ol>
          <li>
            <strong>A comparison is a design file, not a script.</strong> If you are about to write a loop that calls a
            provider twice and prints a table, you are re-creating the thing this replaced. Write the design, commit
            it, run it.
          </li>
          <li>
            <strong>A threshold change cites a report.</strong> Any quality gate you introduce or move names the
            experiment whose report calibrated it. “Benched on nineteen subjects” in a comment is how the last one went
            wrong.
          </li>
          <li>
            <strong>A scorer change bumps its version.</strong> Silent changes make two months of numbers
            incomparable, and nobody finds out for a quarter.
          </li>
          <li>
            <strong>Every experiment ends in a decision record</strong> — including “hold”. An experiment nobody
            decided on is a cost with no outcome.
          </li>
        </ol>
      </Callout>

      <h2>API</h2>
      <EndpointList
        items={[
          { method: 'POST', path: '/v1/experiments', desc: 'Create a design, optionally with its arms.' },
          { method: 'POST', path: '/v1/experiments/{id}/freeze', desc: 'Pin versions, validate every case against every arm, hash the design.' },
          { method: 'POST', path: '/v1/experiments/{id}/dry-run', desc: 'Price it. Executes nothing.' },
          { method: 'POST', path: '/v1/experiments/{id}/run', desc: 'Plan the trials and execute them. 402 if the estimate exceeds the cap.' },
          { method: 'GET', path: '/v1/experiments/{id}/trials', desc: 'Every trial, filterable by arm and status.' },
          { method: 'GET', path: '/v1/experiments/{id}/scores', desc: 'Every score row, with the scorer version that produced it.' },
          { method: 'POST', path: '/v1/experiments/{id}/rescore', desc: 'Append new score rows — after a scorer changes, or to add one you did not run at the time.' },
          { method: 'GET', path: '/v1/experiments/{id}/report', desc: 'The statistics blob, or the page itself with ?format=html.' },
          { method: 'POST', path: '/v1/experiments/case-sets', desc: 'Create a case set; versions are appended, never edited.' },
          { method: 'GET', path: '/v1/experiments/scorers', desc: 'What can be measured, and at which version.' },
        ]}
      />

      <h2>What exists today</h2>
      <Table
        head={['Capability', 'State']}
        rows={[
          ['Design, freeze, price, run, score, report, read in the dashboard', 'Shipped'],
          ['Scorers: run metrics, alpha audit, difference-matte pair', 'Shipped'],
          ['Step-parameter variants without publishing a template', 'Next: an experiment-scoped template snapshot'],
          ['Scheduled benchmarks and a nightly canary against the last shipped baseline', 'Next'],
          ['Judges: a vision model with a rubric, and human pairwise voting', 'Later, with a calibration set'],
          ['A designer in the dashboard (today a design is a committed JSON file)', 'Next'],
        ]}
      />
    </DocsPageShell>
  );
}
