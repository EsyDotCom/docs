import { Callout, CodeBlock, PageHeader, Table } from '@/components/Primitives';

export const metadata = {
  title: 'Costs',
  description:
    'Estimated, provider-reported, and reconciled cost states. Every number tracked through Esy has a documented source.',
};

const costExample = `{
  "provider": "fal.ai",
  "providerOperation": "background.remove",
  "model": "birefnet-light",
  "quantity": 1,
  "unit": "request",
  "unitPriceUsd": 0.0003,
  "estimatedCostUsd": 0.0003,
  "actualCostUsd": null,
  "status": "estimated",
  "pricingSource": "pricing_snapshot",
  "pricingVersion": "2026.05.16",
  "sourceUrl": "https://fal.ai/models/fal-ai/birefnet-light"
}`;

export default function CostsPage() {
  return (
    <div className="docs-page">
      <div className="docs-page-content">
      <PageHeader
        eyebrow="Concepts · Costs"
        title="Costs"
        lead={
          <>
            Cost tracking in Esy separates estimates from provider-confirmed billing. Every cost has a source, a
            calculation method, and a confidence state — at the step, run, workflow, project, and organization
            level.
          </>
        }
      />

      <Callout title="Estimates are not billing">
        Runtime responses include estimated costs immediately so operators can plan budgets, but provider-reported
        and reconciled costs are tracked separately. Final billing comes from provider truth, not Esy estimates.
      </Callout>

      <h2>Cost states</h2>
      <Table
        head={['State', 'Meaning']}
        rows={[
          [
            <code key="e">estimated</code>,
            'Computed from Esy pricing snapshots and captured request settings.',
          ],
          [
            <code key="pr">provider_reported</code>,
            'Reported directly by a provider response or usage API.',
          ],
          [
            <code key="r">reconciled</code>,
            'Matched against provider billing or usage records.',
          ],
          [
            <code key="d">disputed</code>,
            'Internal estimate and provider-reported cost diverge beyond tolerance.',
          ],
        ]}
      />

      <h2>Provider cost ledger</h2>
      <p>
        Every provider interaction creates a ledger entry. Run telemetry rolls up these entries into a run-level{' '}
        <code>totalCosts</code> object with the same status semantics; project and organization burn roll up from
        runs.
      </p>

      <CodeBlock title="provider_cost_ledger entry" language="json">
        {costExample}
      </CodeBlock>

      <h2>Pricing sources</h2>
      <Table
        head={['Provider', 'Source of truth']}
        rows={[
          [
            'fal.ai',
            'Provider usage API for actuals; pricing snapshot for estimates while a run is in-flight.',
          ],
          [
            'openai',
            'Documented pricing snapshot per model and quality, keyed to a dated pricingVersion.',
          ],
          [
            'storage (R2)',
            'Per-operation pricing from Cloudflare; reconciled monthly via usage export.',
          ],
        ]}
      />
      </div>
    </div>
  );
}
