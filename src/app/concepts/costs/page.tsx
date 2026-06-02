import { DocsPageShell } from '@/components/DocsPageShell';
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
  "actualCostUsd": 0.0003,
  "status": "provider_reported",
  "pricingSource": "pricing_snapshot",
  "pricingVersion": "2026-05-16",
  "reconciledAt": "2026-05-16T22:14:43.902Z",
  "sourceUrl": "https://fal.ai/models/fal-ai/birefnet/v2/api"
}`;

export default function CostsPage() {
  return (
    <DocsPageShell>
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

      <p>
        When a run composes a <a href="/concepts/sub-workflows">sub-workflow</a>, each child run keeps its own
        ledger entries; the parent run&rsquo;s <code>totalCosts</code> includes the child run totals, so a composed
        workflow reports the full cost of producing its artifact.
      </p>

      <p>
        Each ledger entry is immutable and freezes the price that was applied: its <code>unitPriceUsd</code> and{' '}
        <code>pricingVersion</code> are snapshotted at write time. When a provider price changes later, existing
        entries keep the price they were charged at — nothing recomputes them.
      </p>

      <h2>Vendor vs. model: direct providers and gateways</h2>
      <p>
        Every ledger entry records two things that are easy to conflate: <code>provider</code> is the vendor that{' '}
        <em>invoices</em> you, and <code>model</code> is what actually <em>ran</em>. For direct providers — OpenAI,
        Anthropic — these coincide: you call them, they bill you. For a <strong>gateway</strong> like fal.ai they
        diverge: fal.ai is an API that routes to many underlying models (today <code>birefnet-light</code> for
        background removal; other hosted models later), so the vendor on the invoice is fal.ai while the model that
        ran is something else.
      </p>
      <p>
        Because both fields live on every entry, the two questions stay separate. Roll up spend by <strong>model</strong>{' '}
        to see what ran — the honest answer to &ldquo;what am I paying for&rdquo;. Roll up by <strong>vendor</strong>{' '}
        to reconcile against the invoices you actually receive. A gateway only ever shows up as a vendor; it is never
        the answer to &ldquo;which capability did I use.&rdquo;
      </p>
      <Callout title="When a gateway routes third-party models">
        If fal.ai later proxies a model such as Gemini, the same fields still carry the truth: <code>provider</code>{' '}
        stays the billing vendor (fal.ai) and <code>model</code> names the real model. A dedicated route/gateway field
        can annotate &ldquo;via fal.ai&rdquo; if that level of provenance becomes useful — the cost model does not have
        to change to support it.
      </Callout>

      <h2>Pricing versions are effective dates</h2>
      <p>
        <code>pricingVersion</code> is an ISO date (<code>YYYY-MM-DD</code>), not an opaque label: it is the day a
        price snapshot took effect. Because every ledger entry copies it, each entry answers &ldquo;what price was in
        effect, and from when&rdquo; on its own — the entry&rsquo;s <code>createdAt</code> tells you when the cost was
        incurred, and its <code>pricingVersion</code> tells you which price schedule applied.
      </p>
      <Callout title="Why this is enough">
        For spend reporting and point-in-time price provenance, the per-entry snapshot plus its <code>createdAt</code>{' '}
        is sufficient — no separate dated rate-card table is required. A standalone pricing history is only needed for
        price-trend or drift analysis, which Esy adds when that need is real.
      </Callout>

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
            'Cloudflare published per-operation rate (Class A writes); reconciled at write time, with monthly usage export as a cross-check.',
          ],
        ]}
      />
    </DocsPageShell>
  );
}
