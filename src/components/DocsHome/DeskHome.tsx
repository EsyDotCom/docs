'use client';

import { DeskBar, FirstCall, ModelPath, PageRail, QuietNumbers, ReferenceRail, StartQueue, WaysIn } from './desk-parts';
import { DocsFooter, FindPalette, useFind } from './shared';

// ───────────────────────────────────────────────────────────────────────────
// A · Desk: the docs as an app, in os.esy.com/agency's shell. A raised bar, a
// grey canvas, three cased panes that scroll on their own: every page in a
// left rail you can filter, the work of getting started in the middle (a
// queue with its actions in their own column), and the facts people come
// back for on the view's one navy rail. The parts live in desk-parts.tsx.
// ───────────────────────────────────────────────────────────────────────────

export default function DeskHome() {
  const find = useFind();
  return (
    <div className="folio fo-app dk-app">
      <DeskBar onFind={() => find.openFind()} />

      <div className="fo-body has-left has-right dk-body">
        <PageRail onSearch={find.openFind} />
        <main className="fo-pane dk-main">
          <div className="fo-main-in fo-main-in--wide dk-main-in">
            <p className="fo-label fo-label--jade">Esy docs · API v1</p>
            <h1 className="fo-display">Start a run. Get the file and its record.</h1>
            <p className="fo-lede">
              Esy is an API for running multi-step AI workflows. You post a workflow with your inputs; Esy runs
              each step, checks the output against its gates, and stores the result with a record of which models
              ran and what it cost.
            </p>
            <QuietNumbers />
            <StartQueue />
            <FirstCall />
            <ModelPath />
            <WaysIn />
          </div>
          <DocsFooter />
        </main>
        <ReferenceRail />
      </div>

      <FindPalette open={find.open} seed={find.seed} onClose={find.close} />
    </div>
  );
}
