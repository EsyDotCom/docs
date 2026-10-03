'use client';

import { ModelPath, PageRail, QuietNumbers, ReferenceRail, StartQueue, WaysIn } from './desk-parts';
import { DocsFooter, FindPalette, useFind } from './shared';
import { StageTop } from './stage-top';
import './merges.css';

// ───────────────────────────────────────────────────────────────────────────
// E · Stage Desk (A + C): C's stage first, then A's desk. The page opens on
// the shared stage (stage-top.tsx) and scrolls into A's three panes, whose
// rails stick while the middle scrolls. The hero is the one navy moment, so
// A's reference rail is light here.
// ───────────────────────────────────────────────────────────────────────────

export default function StageDeskHome() {
  const find = useFind();
  return (
    <div className="folio sd-app">
      <StageTop onFind={find.openFind} />

      {/* ── The desk: A's three panes, the rails sticking as the middle scrolls ── */}
      <section className="sd-desk">
        <div className="sd-frame sd-desk-head">
          <p className="fo-label fo-label--jade">After the first run</p>
          <h2 className="sd-desk-title">Everything you’ll come back for.</h2>
          <QuietNumbers />
        </div>
        <div className="sd-frame sd-grid">
          <PageRail onSearch={find.openFind} />
          <main className="fo-pane sd-main">
            <div className="fo-main-in">
              <StartQueue />
              <ModelPath />
              <WaysIn />
            </div>
          </main>
          <ReferenceRail tone="light" />
        </div>
      </section>

      <DocsFooter tone="canvas" />
      <FindPalette open={find.open} seed={find.seed} onClose={find.close} />
    </div>
  );
}
