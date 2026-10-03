import Image from 'next/image';
import Link from 'next/link';

import { BrandMark } from '@/components/docs/BrandMark';
import { PROTOTYPES, type Prototype, type PrototypeVariant } from '@/components/prototypes/registry';
import '@/components/prototypes/prototypes.css';

const [latest] = PROTOTYPES;

export const metadata = {
  title: { absolute: `${latest.headline} — Esy docs prototypes` },
  description: latest.summary,
};

// A variant gets a screenshot once it's built; until then the card draws a
// poster from the variant's colours and its own headline.
function VariantShot({ v }: { v: PrototypeVariant }) {
  if (v.image) return <Image src={v.image} alt="" width={1200} height={750} sizes="(max-width: 700px) 100vw, 380px" />;
  const [a, b] = v.poster ?? ['#0a2540', '#00a896'];
  const dark = !v.poster || v.poster[0].toLowerCase() < '#8';
  return (
    <span className="pi-poster" style={{ background: `linear-gradient(140deg, ${a}, ${b})`, color: dark ? '#eef4f3' : '#0a2540' }}>
      <span className="pi-poster-key">
        {v.key} · {v.name}
      </span>
      <span className="pi-poster-title">{v.title}</span>
    </span>
  );
}

const hrefOf = (p: Prototype, v: PrototypeVariant) => `/prototypes/${p.slug}/${v.slug}`;

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true">
      <path d="M3.5 8h9M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// The index, as on esy.com/prototypes: the newest prototype's story up top
// (what we built, where it is in the process), then every prototype in
// registry order, each variant a card with a picture and one thing to click.
export default function PrototypesIndex() {
  const shipped = latest.variants.find((v) => v.live);
  // The button leads to the newest round's first variant: that's what's new to try.
  const newestRound = Math.max(...latest.rounds.map((r) => r.n));
  const first = latest.variants.find((v) => v.round === newestRound) ?? latest.variants[0];
  const stepCount = latest.rounds.length + (shipped ? 1 : 2);

  return (
    <div className="proto">
      <header className="pi-wrap" style={{ display: 'flex', alignItems: 'center', height: 72 }}>
        <Link href="/" aria-label="Esy docs home">
          <BrandMark />
        </Link>
      </header>
      <main>
        <section className="pi-hero">
          <div className="pi-wrap">
            <span className="pi-kicker">Docs prototypes · {latest.name}</span>
            <h1>{latest.headline}</h1>
            <p className="pi-intro">{latest.intro}</p>
            <div className="pi-actions">
              <Link href={hrefOf(latest, shipped ?? first)} className="pi-btn pi-btn--primary">
                {shipped ? 'Try the one we shipped' : `Try the newest: ${first.key} · ${first.name}`} <Arrow />
              </Link>
              <a href={`#${latest.slug}`} className="pi-btn pi-btn--ghost">
                See all {latest.variants.length}
              </a>
            </div>

            {/* Where this prototype is: the rounds so far, then what comes next. */}
            <ol className="pi-steps" aria-label="Where this is" style={{ gridTemplateColumns: `repeat(${stepCount}, minmax(0, 1fr))` }}>
              {latest.rounds.map((r) => (
                <li key={r.n}>
                  <span className="n">{r.n}</span>
                  <span>
                    <b>{r.title}</b>
                    <small>
                      {latest.variants
                        .filter((v) => v.round === r.n)
                        .map((v) => (v.mergeOf ? `${v.key} = ${v.mergeOf.join(' + ')}` : `${v.key} · ${v.name}`))
                        .join(', ')}
                    </small>
                  </span>
                </li>
              ))}
              {shipped && (
                <li className="is-live">
                  <span className="n">✓</span>
                  <span>
                    <b>Shipped</b>
                    <small>
                      {shipped.key} · {shipped.name} is the{' '}
                      <Link href={shipped.liveHref ?? '/'} className="pi-inline">
                        docs.esy.com homepage
                      </Link>
                    </small>
                  </span>
                </li>
              )}
              {!shipped && (
                <>
                  <li>
                    <span className="n">{latest.rounds.length + 1}</span>
                    <span>
                      <b>Pick one</b>
                      <small>Or merge again</small>
                    </span>
                  </li>
                  <li>
                    <span className="n">✓</span>
                    <span>
                      <b>Ship</b>
                      <small>As the docs.esy.com homepage</small>
                    </span>
                  </li>
                </>
              )}
            </ol>
          </div>
        </section>

        {PROTOTYPES.map((p) => (
          <section key={p.slug} id={p.slug} className="pi-wrap pi-rounds">
            {p !== latest && <h2 className="pi-proto-name">{p.name}</h2>}
            {p.rounds.map((r) => (
              <div key={r.n} className="pi-round">
                <div className="pi-round-head">
                  <span className="pi-round-n">Round {r.n}</span>
                  <h3>{r.title}</h3>
                  <p>{r.summary}</p>
                </div>
                <div className="pi-grid">
                  {p.variants
                    .filter((v) => v.round === r.n)
                    .map((v) => (
                      <Link key={v.slug} href={hrefOf(p, v)} className={`pi-card ${v.live ? 'is-live' : ''}`}>
                        <span className="pi-card-shot">
                          <VariantShot v={v} />
                          {v.live && <span className="pi-live">Live</span>}
                        </span>
                        <span className="pi-card-body">
                          <span className="pi-key">
                            {v.key} · {v.name}
                            {v.mergeOf && <em> ({v.mergeOf.join(' + ')})</em>}
                          </span>
                          <span className="pi-card-title">{v.title}</span>
                          <span className="pi-card-blurb">{v.blurb}</span>
                          <span className="pi-card-cta">
                            Try it <Arrow />
                          </span>
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </section>
        ))}

        <section className="pi-wrap">
          <div className="pi-close">
            <div>
              <h2>The docs as they are today.</h2>
              <p>Every direction links into the current docs, so you can follow any path to the page it opens.</p>
            </div>
            <Link href="/" className="pi-btn pi-btn--light">
              Open docs.esy.com <Arrow />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
