'use client';

import { DeskBar, ModelPath, PageRail, QuietNumbers, ReferenceRail, StartQueue, WaysIn } from './desk-parts';
import { DocsFooter, FindPalette, useFind } from './shared';
import { Replay } from './stage';
import './merges.css';

// ───────────────────────────────────────────────────────────────────────────
// D · Desk Replay (A + C): A's app shell with C's replay inside it. The main
// pane opens on C's headline and the run playing, flush to the top of the
// pane; that stage is the view's one navy moment, so A's reference rail
// turns light, the way os.esy.com/agency's right rail is. The replay stands
// in for A's static first call; the queue, the path and ways in follow.
// ───────────────────────────────────────────────────────────────────────────

export default function DeskReplayHome() {
  const find = useFind();
  return (
    <div className="folio fo-app dk-app dr-app">
      <DeskBar onFind={() => find.openFind()} />

      <div className="fo-body has-left has-right dk-body">
        <PageRail onSearch={find.openFind} />
        <main className="fo-pane dk-main dr-main">
          <section className="dr-stage">
            <p className="fo-eyebrow dr-eyebrow">Esy docs · API v1</p>
            <h1 className="dr-h1">
              AI marketing production, <em>through one API.</em>
            </h1>
            <p className="dr-lede">Brief in, approved assets out. Every image, video and post checked, costed and traceable. Below, the quickstart’s run, as it happened.</p>
            <Replay className="dr-replay" />
          </section>

          <div className="fo-main-in fo-main-in--wide dk-main-in dr-main-in">
            <QuietNumbers />
            <StartQueue />
            <ModelPath />
            <WaysIn />
          </div>
          <DocsFooter />
        </main>
        <ReferenceRail tone="light" />
      </div>

      <FindPalette open={find.open} seed={find.seed} onClose={find.close} />
    </div>
  );
}
