import { DocsPageShell } from '@/components/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Table } from '@/components/Primitives';

export const metadata = {
  title: 'Budgets',
  description:
    'Spend limits at organization, project, or workflow scope. Enforced before a run executes, using the run estimate.',
};

const budgetExample = `{
  "id": "b1a2c3d4-...",
  "workspaceId": "8f0e...",
  "projectId": null,
  "workflowId": null,
  "scope": "workspace",
  "name": "ESY LLC monthly cap",
  "limitUsd": 50,
  "period": "monthly",
  "perRunCapUsd": 0.25,
  "enforcementMode": "hard_stop",
  "overageUsd": null,
  "currency": "USD"
}`;

const rejectionExample = `HTTP/1.1 402 Payment Required

{
  "detail": {
    "code": "budget_exceeded",
    "reason": "hard_stop",
    "scope": "project",
    "enforcementMode": "hard_stop",
    "limitUsd": 50,
    "spendUsd": 49.92,
    "runEstimateUsd": 0.21,
    "remainingUsd": 0.08
  }
}`;

export default function BudgetsPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Budgets"
        title="Budgets"
        lead={
          <>
            A budget is a spend limit attached to a scope. Esy enforces it <em>before</em> a run executes, using the
            run&rsquo;s estimated cost, so a run that would breach the limit is rejected rather than discovered after
            the provider has already been billed.
          </>
        }
      />

      <Callout title="Enforcement is on the estimate">
        Budget checks run pre-flight against the run&rsquo;s estimate (see Costs). Actuals reconcile afterward, so a
        budget is a guardrail on intent, not a billing reconciliation. Set limits with the estimate&rsquo;s typical
        cost in mind.
      </Callout>

      <h2>Scope</h2>
      <p>
        Every budget belongs to a workspace (organization). It optionally narrows to a single project or workflow
        within that workspace. The <code>scope</code> is derived from which id is set.
      </p>
      <Table
        head={['Scope', 'Applies to', 'Set']}
        rows={[
          ['workspace', 'Every run in the organization.', 'Neither projectId nor workflowId.'],
          ['project', 'Runs in one project.', 'projectId.'],
          ['workflow', 'Runs of one workflow template.', 'workflowId.'],
        ]}
      />

      <h2>Period</h2>
      <p>
        The limit applies over a window. Spend is summed from the provider cost ledger within the current window,
        using the actual cost where reconciled and the estimate otherwise.
      </p>
      <Table
        head={['Period', 'Window']}
        rows={[
          [<code key="t">total</code>, 'All-time. The limit is a lifetime cap.'],
          [<code key="d">daily</code>, 'Since 00:00 UTC today.'],
          [<code key="w">weekly</code>, 'Since Monday 00:00 UTC.'],
          [<code key="m">monthly</code>, 'Since the 1st of the month, 00:00 UTC.'],
        ]}
      />

      <h2>Enforcement modes</h2>
      <Table
        head={['Mode', 'Behavior']}
        rows={[
          [
            <code key="hs">hard_stop</code>,
            'Reject the run when current spend + run estimate would exceed the limit. The safe default for real provider money.',
          ],
          [
            <code key="ao">allow_overage</code>,
            'Tolerate spend up to limit + overageUsd, then reject. A grace band over the limit.',
          ],
          [
            <code key="aom">allow_one_more</code>,
            'Permit the single run that crosses the limit, then reject subsequent runs.',
          ],
          [
            <code key="to">track_only</code>,
            'Never blocks. Records and surfaces burn so spend is visible without gating runs.',
          ],
        ]}
      />

      <h2>Per-run cap</h2>
      <p>
        A budget may also carry a <code>perRunCapUsd</code> — a hard ceiling on a single run&rsquo;s estimate,
        independent of the period limit. It applies under any blocking mode and is useful for catching a
        misconfigured high-cost model before it runs at volume.
      </p>

      <h2>Example budget</h2>
      <CodeBlock title="POST /v1/budgets" language="json">
        {budgetExample}
      </CodeBlock>

      <h2>How a run is evaluated</h2>
      <p>
        On run creation, Esy prices the template, resolves every budget that applies to the run&rsquo;s scope
        (workspace-wide budgets always apply; project and workflow budgets apply on a match), and evaluates each. The
        most restrictive applicable budget wins. If one blocks, the run is never created and the API returns{' '}
        <code>402 budget_exceeded</code> with the scope, limit, current spend, and the remaining headroom.
      </p>
      <CodeBlock title="rejected run" language="json">
        {rejectionExample}
      </CodeBlock>

      <Callout title="Relationship to Costs">
        Budgets sit on top of the same provider cost ledger that powers Costs. The ledger supplies current spend per
        scope and period; budgets decide whether the next run may add to it.
      </Callout>
    </DocsPageShell>
  );
}
