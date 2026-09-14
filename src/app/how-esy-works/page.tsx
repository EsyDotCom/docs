import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import {
  Callout,
  Diagram,
  DiagramDefs,
  PageHeader,
  Table,
  Takeaways,
} from '@/components/docs/Primitives';

export const metadata = {
  title: 'How Esy works',
  description:
    'The whole system on one page: workspaces and projects, workflows and runs, gates and artifacts, and where cost is tracked.',
};

export default function HowEsyWorksPage() {
  return (
    <DocsPageShell>
      <DiagramDefs />

      <PageHeader
        eyebrow="Get started · Mental model"
        title="How Esy works"
        opener="template"
        lead={
          <>
            Esy runs a declared workflow and keeps the receipt. Five nouns carry the whole system, and
            once you can name them the API stops being surprising. This page is the map; every box on it
            links to the page that goes deeper.
          </>
        }
      />

      <h2>The five nouns</h2>
      <p>
        Everything in the API is one of these, in this order. A <strong>workspace</strong> holds{' '}
        <strong>projects</strong>; a <strong>workflow</strong> is a reusable definition; a{' '}
        <strong>run</strong> is one execution of it; an <strong>artifact</strong> is what the run
        produced.
      </p>

      <Diagram
        title="The object model"
        minWidth={860}
        caption={
          <>
            The API path under each box is where that object lives. Note the first one: the API says{' '}
            <code>workspace</code>, and a workspace has a <code>kind</code> of either{' '}
            <code>organization</code> or <code>personal</code>.
          </>
        }
      >
        <svg viewBox="0 0 900 158" role="img" aria-label="A workspace contains projects; workflows are executed as runs, which produce artifacts">
          <text x="8" y="18" className="dg-hdr">WORKSPACE → PROJECT → WORKFLOW → RUN → ARTIFACT</text>

          <rect x="8" y="40" width="160" height="64" rx="7" className="dg-node" />
          <text x="88" y="68" className="dg-label" textAnchor="middle">Workspace</text>
          <text x="88" y="87" className="dg-sub" textAnchor="middle">organization | personal</text>
          <text x="88" y="128" className="dg-cap" textAnchor="middle">/v1/workspaces</text>

          <path d="M172 72 L190 72" className="dg-edge" />

          <rect x="194" y="40" width="160" height="64" rx="7" className="dg-node" />
          <text x="274" y="68" className="dg-label" textAnchor="middle">Project</text>
          <text x="274" y="87" className="dg-sub" textAnchor="middle">kind: general | brand</text>
          <text x="274" y="128" className="dg-cap" textAnchor="middle">…/projects</text>

          <path d="M358 72 L376 72" className="dg-edge" />

          <rect x="380" y="40" width="160" height="64" rx="7" className="dg-node" />
          <text x="460" y="68" className="dg-label" textAnchor="middle">Workflow</text>
          <text x="460" y="87" className="dg-sub" textAnchor="middle">versioned template</text>
          <text x="460" y="128" className="dg-cap" textAnchor="middle">/v1/workflows</text>

          <path d="M544 72 L562 72" className="dg-edge" />

          <rect x="566" y="40" width="160" height="64" rx="7" className="dg-node" />
          <text x="646" y="68" className="dg-label" textAnchor="middle">Run</text>
          <text x="646" y="87" className="dg-sub" textAnchor="middle">one execution</text>
          <text x="646" y="128" className="dg-cap" textAnchor="middle">/v1/runs</text>

          <path d="M730 72 L748 72" className="dg-edge dg-accent" />

          <rect x="752" y="40" width="140" height="64" rx="7" className="dg-node dg-accent" />
          <text x="822" y="68" className="dg-label" textAnchor="middle">Artifact</text>
          <text x="822" y="87" className="dg-sub" textAnchor="middle">output + provenance</text>
          <text x="822" y="128" className="dg-cap" textAnchor="middle">/v1/artifacts</text>
        </svg>
      </Diagram>

      <Table
        head={['Noun', 'What it is', 'Where it lives']}
        rows={[
          [
            <strong key="w">Workspace</strong>,
            'The billing and membership boundary. Yours is created for you at signup.',
            <code key="wp">/v1/workspaces</code>,
          ],
          [
            <strong key="p">Project</strong>,
            'An optional grouping inside a workspace, so runs and costs roll up somewhere meaningful.',
            <code key="pp">…/projects</code>,
          ],
          [
            <strong key="f">Workflow</strong>,
            'The versioned definition: what inputs it takes, what steps it runs, which models, which gates, what it outputs.',
            <code key="fp">/v1/workflows</code>,
          ],
          [
            <strong key="r">Run</strong>,
            'One execution, with per-step telemetry and cost. Immutable once terminal.',
            <code key="rp">/v1/runs</code>,
          ],
          [
            <strong key="a">Artifact</strong>,
            'What the run produced, plus the QA record and the cost ledger that made it.',
            <code key="ap">/v1/artifacts</code>,
          ],
        ]}
      />

      <Callout title="Organization or workspace?" tone="note">
        You will see both words. The concept is a workspace, and that is what the API calls it; an
        &ldquo;organization&rdquo; is a workspace whose <code>kind</code> is <code>organization</code>{' '}
        (the other kind is <code>personal</code>). These docs say <strong>workspace</strong> throughout.
      </Callout>

      <h2>What happens inside a run</h2>
      <p>
        A workflow is not a prompt. It is a short program: an ordered list of steps, each bound to a
        model or a tool, with gates between them that decide whether the next step is allowed to start.
      </p>

      <Diagram
        title="generate-coloring-page, as actually declared"
        minWidth={860}
        caption={
          <>
            A gate does not run anything. It judges what the previous step produced and declares which
            step id it <code>unlocks</code>. Steps do; gates judge.
          </>
        }
      >
        <svg viewBox="0 0 860 196" role="img" aria-label="Five steps separated by three quality gates: render, post-process, audit, text gate, classify">
          <text x="8" y="16" className="dg-hdr">5 STEPS · 3 GATES</text>

          <text x="72" y="46" className="dg-cap" textAnchor="middle">image</text>
          <rect x="8" y="54" width="128" height="58" rx="7" className="dg-node" />
          <text x="72" y="79" className="dg-label-sm" textAnchor="middle">Render</text>
          <text x="72" y="96" className="dg-sub" textAnchor="middle">step-1</text>
          <text x="72" y="140" className="dg-cap" textAnchor="middle">imageGenerator</text>

          <path d="M140 83 L148 83" className="dg-edge" />
          <rect x="150" y="69" width="28" height="28" rx="5" className="dg-node dg-warn" />
          <path d="M180 83 L188 83" className="dg-edge" />
          <text x="164" y="112" className="dg-cap" textAnchor="middle">g1</text>

          <text x="256" y="46" className="dg-cap" textAnchor="middle">tool</text>
          <rect x="192" y="54" width="128" height="58" rx="7" className="dg-node" />
          <text x="256" y="79" className="dg-label-sm" textAnchor="middle">Post-process</text>
          <text x="256" y="96" className="dg-sub" textAnchor="middle">step-2</text>
          <text x="256" y="140" className="dg-cap" textAnchor="middle">seal gaps</text>

          <path d="M324 83 L330 83" className="dg-edge" />

          <text x="398" y="46" className="dg-cap" textAnchor="middle">tool</text>
          <rect x="334" y="54" width="128" height="58" rx="7" className="dg-node" />
          <text x="398" y="79" className="dg-label-sm" textAnchor="middle">Audit</text>
          <text x="398" y="96" className="dg-sub" textAnchor="middle">step-3</text>
          <text x="398" y="140" className="dg-cap" textAnchor="middle">stroke, margin</text>

          <path d="M466 83 L474 83" className="dg-edge" />
          <rect x="476" y="69" width="28" height="28" rx="5" className="dg-node dg-warn" />
          <path d="M506 83 L514 83" className="dg-edge" />
          <text x="490" y="112" className="dg-cap" textAnchor="middle">g2</text>

          <text x="582" y="46" className="dg-cap" textAnchor="middle">llm</text>
          <rect x="518" y="54" width="128" height="58" rx="7" className="dg-node" />
          <text x="582" y="79" className="dg-label-sm" textAnchor="middle">Text gate</text>
          <text x="582" y="96" className="dg-sub" textAnchor="middle">step-3b</text>
          <text x="582" y="140" className="dg-cap" textAnchor="middle">textGate · OCR</text>

          <path d="M650 83 L658 83" className="dg-edge" />
          <rect x="660" y="69" width="28" height="28" rx="5" className="dg-node dg-warn" />
          <path d="M690 83 L698 83" className="dg-edge dg-accent" />
          <text x="674" y="112" className="dg-cap" textAnchor="middle">g3</text>

          <text x="766" y="46" className="dg-cap" textAnchor="middle">llm</text>
          <rect x="702" y="54" width="128" height="58" rx="7" className="dg-node dg-accent" />
          <text x="766" y="79" className="dg-label-sm" textAnchor="middle">Classify</text>
          <text x="766" y="96" className="dg-sub" textAnchor="middle">step-4</text>
          <text x="766" y="140" className="dg-cap" textAnchor="middle">classifier</text>

          <text x="8" y="176" className="dg-cap">each step names a ROLE; the workflow binds that role to a model in the registry</text>
        </svg>
      </Diagram>

      <p>
        Steps come in kinds — <code>image</code>, <code>llm</code>, <code>tool</code>,{' '}
        <code>subWorkflow</code>, <code>agent</code>, <code>code</code> — and each names a{' '}
        <em>role</em> rather than a model. The workflow binds roles to concrete models, which is why you
        can swap the image model without editing a single step.{' '}
        <Link href="/concepts/runs">Runs and steps</Link> has the detail.
      </p>

      <h2>The lifecycle you will actually see</h2>
      <p>
        Nine statuses, not five. Most runs go <code>pending → queued → running → completed</code>, but a
        workflow that declares an approval gate parks its run in <code>review</code> until a human
        decides.
      </p>

      <Diagram
        title="Run status transitions"
        minWidth={880}
        caption={
          <>
            The three statuses on the right only exist for workflows with an approval gate. For everything
            else, <code>running</code> goes straight to <code>completed</code>.
          </>
        }
      >
        <svg viewBox="0 0 900 288" role="img" aria-label="Run statuses from pending through queued and running to completed, review, failed or cancelled">
          <text x="8" y="18" className="dg-hdr">RUN STATUS</text>

          <path d="M84 96 L84 44 L766 44 L766 74" className="dg-edge" />
          <text x="420" y="38" className="dg-cap" textAnchor="middle">no approval gate declared</text>

          <rect x="16" y="96" width="136" height="40" rx="6" className="dg-node" />
          <text x="84" y="121" className="dg-label-sm" textAnchor="middle">pending</text>
          <rect x="16" y="176" width="136" height="40" rx="6" className="dg-node" />
          <text x="84" y="201" className="dg-label-sm" textAnchor="middle">planned</text>
          <text x="84" y="232" className="dg-cap" textAnchor="middle">order children</text>

          <path d="M156 116 L192 116" className="dg-edge" />
          <path d="M156 196 C 176 196, 176 116, 192 116" className="dg-edge" />

          <rect x="196" y="96" width="136" height="40" rx="6" className="dg-node" />
          <text x="264" y="121" className="dg-label-sm" textAnchor="middle">queued</text>
          <path d="M336 116 L372 116" className="dg-edge" />

          <rect x="376" y="96" width="136" height="40" rx="6" className="dg-node dg-accent" />
          <text x="444" y="121" className="dg-label-sm" textAnchor="middle">running</text>

          <path d="M420 140 L392 176" className="dg-edge dg-bad" />
          <path d="M470 140 L498 176" className="dg-edge" />
          <rect x="306" y="180" width="126" height="38" rx="6" className="dg-node dg-term" />
          <text x="369" y="204" className="dg-label-sm" textAnchor="middle">failed</text>
          <rect x="446" y="180" width="126" height="38" rx="6" className="dg-node dg-term" />
          <text x="509" y="204" className="dg-label-sm" textAnchor="middle">cancelled</text>

          <path d="M516 116 L562 116" className="dg-edge dg-warn" />
          <text x="539" y="106" className="dg-cap" textAnchor="middle">gate</text>
          <rect x="566" y="96" width="136" height="40" rx="6" className="dg-node dg-warn" />
          <text x="634" y="121" className="dg-label-sm" textAnchor="middle">review</text>

          <path d="M706 108 L740 74" className="dg-edge dg-accent" />
          <path d="M706 116 L740 116" className="dg-edge dg-bad" />
          <path d="M706 126 L740 172" className="dg-edge dg-warn" />
          <text x="728" y="66" className="dg-cap" textAnchor="end">approve</text>

          <rect x="744" y="56" width="140" height="38" rx="6" className="dg-node dg-accent" />
          <text x="814" y="80" className="dg-label-sm" textAnchor="middle">completed</text>
          <rect x="744" y="98" width="140" height="38" rx="6" className="dg-node dg-term" />
          <text x="814" y="122" className="dg-label-sm" textAnchor="middle">rejected</text>
          <rect x="744" y="158" width="140" height="38" rx="6" className="dg-node dg-term" />
          <text x="814" y="177" className="dg-label-sm" textAnchor="middle">changes_</text>
          <text x="814" y="190" className="dg-label-sm" textAnchor="middle">requested</text>

          <text x="8" y="266" className="dg-cap">stop polling on: completed · review · failed · cancelled · rejected · changes_requested</text>
        </svg>
      </Diagram>

      <h2>Ask for outcomes, not mechanisms</h2>
      <p>
        This is the one design rule that explains most of the intake schemas you will meet. Every run
        answers two questions, and they belong to different layers.
      </p>

      <Diagram
        title="Intake speaks outcomes, bindings speak mechanisms"
        minWidth={880}
        caption={
          <>
            You say what you want. The engine reads the bound model&rsquo;s capability flags and decides
            how. The mechanism it chose is recorded in provenance, and QA judges the outcome — never the
            mechanism.
          </>
        }
      >
        <svg viewBox="0 0 900 296" role="img" aria-label="The intake asks what you want; the engine decides how from model capability flags">
          <text x="8" y="18" className="dg-hdr">1 · THE INTAKE ASKS</text>
          <text x="478" y="18" className="dg-hdr">2 · THE ENGINE DECIDES</text>
          <path d="M450 8 L450 250" className="dg-rule" strokeDasharray="3 4" />

          <text x="8" y="48" className="dg-label">What do you want?</text>
          <rect x="8" y="62" width="420" height="92" rx="7" className="dg-node" />
          <text x="26" y="88" className="dg-sub">prompt</text>
          <text x="410" y="88" className="dg-label-sm" textAnchor="end">&ldquo;a fox in a waistcoat&rdquo;</text>
          <text x="26" y="114" className="dg-sub">background</text>
          <text x="410" y="114" className="dg-label-sm" textAnchor="end">&ldquo;see-through&rdquo;</text>
          <text x="26" y="140" className="dg-sub">aspectRatio</text>
          <text x="410" y="140" className="dg-label-sm" textAnchor="end">1:1</text>
          <text x="8" y="180" className="dg-cap">a promise. still true in five years.</text>

          <text x="478" y="48" className="dg-label">How should we make it?</text>
          <rect x="478" y="62" width="414" height="48" rx="7" className="dg-node" />
          <text x="496" y="84" className="dg-sub">model registry</text>
          <text x="874" y="92" className="dg-label-sm" textAnchor="end">supports_native_transparency</text>

          <path d="M600 114 L560 146" className="dg-edge dg-accent" />
          <path d="M770 114 L810 146" className="dg-edge" />
          <text x="566" y="132" className="dg-cap" textAnchor="end">true</text>
          <text x="806" y="132" className="dg-cap">false</text>

          <rect x="478" y="150" width="190" height="56" rx="7" className="dg-node dg-accent" />
          <text x="573" y="174" className="dg-label-sm" textAnchor="middle">render transparent</text>
          <text x="573" y="192" className="dg-sub" textAnchor="middle">removal skipped · $0</text>

          <rect x="702" y="150" width="190" height="56" rx="7" className="dg-node" />
          <text x="797" y="174" className="dg-label-sm" textAnchor="middle">render, then key out</text>
          <text x="797" y="192" className="dg-sub" textAnchor="middle">esy/chroma-key</text>

          <rect x="8" y="226" width="884" height="46" rx="7" className="dg-node dg-term" />
          <text x="26" y="248" className="dg-label-sm">
            Both record <tspan className="dg-sub">transparencyMechanism</tspan> in provenance.
          </text>
          <text x="26" y="264" className="dg-cap">a mechanism-judged pipeline can never be improved — so QA judges the result</text>
        </svg>
      </Diagram>

      <p>
        The practical consequence: an intake field asks for a <em>result</em> you would still want in a
        year, never for an implementation you happen to know about today. See{' '}
        <Link href="/concepts/intake">Intake</Link>.
      </p>

      <h2>Where the money is counted</h2>
      <p>
        Cost is recorded per provider call, not per run, and each entry moves through three states.
        There is no fourth state.
      </p>

      <Diagram
        title="Cost states"
        minWidth={520}
        caption={
          <>
            Budgets are enforced <em>before</em> a run starts, using the estimate. A refused run costs
            nothing and is still recorded. See <Link href="/concepts/costs">Costs and budgets</Link>.
          </>
        }
      >
        <svg viewBox="0 0 560 120" role="img" aria-label="Cost states progress from estimated to provider reported to reconciled">
          <text x="0" y="14" className="dg-hdr">PROVIDER_COST_LEDGER</text>
          <rect x="0" y="34" width="160" height="46" rx="6" className="dg-node" />
          <text x="80" y="55" className="dg-label-sm" textAnchor="middle">estimated</text>
          <text x="80" y="71" className="dg-sub" textAnchor="middle">before the call</text>
          <path d="M166 57 L192 57" className="dg-edge" />
          <rect x="198" y="34" width="164" height="46" rx="6" className="dg-node" />
          <text x="280" y="55" className="dg-label-sm" textAnchor="middle">provider_reported</text>
          <text x="280" y="71" className="dg-sub" textAnchor="middle">after the call</text>
          <path d="M368 57 L394 57" className="dg-edge dg-accent" />
          <rect x="400" y="34" width="158" height="46" rx="6" className="dg-node dg-accent" />
          <text x="479" y="55" className="dg-label-sm" textAnchor="middle">reconciled</text>
          <text x="479" y="71" className="dg-sub" textAnchor="middle">against the invoice</text>
          <text x="0" y="106" className="dg-cap">three states — roll up: step → run → workflow → project → workspace</text>
        </svg>
      </Diagram>

      <h2>What Esy is not</h2>
      <p>
        Esy runs workflows and preserves how their outputs were made. It does not optimise what happens
        to an artifact afterwards — sales, clicks, engagement — and it does not replace the judgement
        about what is worth making. If you are looking for a chat API, this is the wrong system: Esy is
        artifact-first, and a conversation is at most an input.
      </p>

      <Takeaways
        items={[
          <>
            Workspace → project → workflow → run → artifact. Every endpoint hangs off one of those five.
          </>,
          <>
            A workflow is a program with gates, not a prompt. Steps name roles; the workflow binds roles
            to models.
          </>,
          <>
            Intake asks for outcomes. The engine picks the mechanism from model capabilities and records
            which one it used.
          </>,
          <>
            Cost is per provider call, in three states, enforced against budgets before the run starts.
          </>,
        ]}
      />
    </DocsPageShell>
  );
}
