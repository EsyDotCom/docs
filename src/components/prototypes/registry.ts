// Every prototype on docs.esy.com/prototypes, as data: the same shape as
// esy.com's registry (esy.com src/components/prototypes/registry.ts), so the
// two sites' prototypes read alike. Add one here and it shows on the index;
// give it `variants` and each variant gets its own page and a slot in the
// floating switcher. `rounds` tell the story: first directions, then merges,
// then what shipped.

export interface PrototypeVariant {
  slug: string;
  key: string; // A, B, C… for talking about them
  name: string;
  title: string; // the variant's headline, shown on its card
  blurb: string; // what's different about it, in one or two plain sentences
  round: number; // which round of the prototype it came from
  mergeOf?: string[]; // keys of the variants it combines, e.g. ['A', 'C']
  image?: string; // card screenshot under /public; without one the index draws a poster
  poster?: [string, string]; // the poster's two colours, when there's no screenshot
  live?: boolean; // shipped on the real site
  liveHref?: string; // where it's live
}

export interface PrototypeRound {
  n: number;
  title: string;
  summary: string;
}

export interface Prototype {
  slug: string;
  name: string;
  date: string; // YYYY-MM-DD, when it was built
  headline: string; // the index opens with the newest prototype's headline
  intro: string; // …and this, which says what to click
  summary: string;
  rounds: PrototypeRound[];
  variants: PrototypeVariant[];
}

// Newest first: the index opens with the first one's story.
export const PROTOTYPES: Prototype[] = [
  {
    slug: 'home',
    name: 'The docs homepage, in Folio',
    date: '2026-10-03',
    headline: 'We built eight versions of the docs homepage. F shipped.',
    intro:
      'Each one re-imagines docs.esy.com’s front page in Folio, the look of os.esy.com/agency. Round 1 tried three directions; round 2 merged A’s desk with C’s replay; round 3 kept E’s top and tried three ways to fill what’s below it. F · Guide is the homepage now. They all run on the real docs: the real pages, the real search, the real changelog, and the quickstart’s real run. Press ⌘K on any of them.',
    summary:
      'Three working directions for the docs.esy.com homepage in Folio, os.esy.com’s brand: an app, a front page, and a replay of a real run.',
    rounds: [
      {
        n: 1,
        title: 'Three directions',
        summary:
          'The same docs, three ways in: as an app you work in, as a front page you read, and as a replay of the first run you’ll make.',
      },
      {
        n: 2,
        title: 'Two merges',
        summary:
          'A’s desk with C’s replay. D puts the replay inside the desk, where A’s first call was; E opens on C’s stage and scrolls into A’s desk.',
      },
      {
        n: 3,
        title: 'Below E’s fold',
        summary:
          'E’s top stays exactly as it is: the bar, the headline, search and the replay. Below it, the three-pane desk goes, and three single-column pages take its place: one to learn in order, one by job, one to look things up.',
      },
    ],
    variants: [
      {
        slug: 'desk',
        key: 'A',
        name: 'Desk',
        round: 1,
        title: 'Start a run. Get the file and its record.',
        blurb:
          'The docs as an app, like os.esy.com/agency. Every page sits in a left rail you can filter, the three pages to read first are in the middle, and the facts you look up every day are on one navy rail.',
        image: '/prototypes/home/desk.webp',
        poster: ['#0a2540', '#00a896'],
      },
      {
        slug: 'edition',
        key: 'B',
        name: 'Edition',
        round: 1,
        title: 'Post a workflow. Get back the file, and how it was made.',
        blurb:
          'The docs as a front page, like the Brief. A serif masthead, the first run’s numbers, search right on the page, the quickstart’s steps to click through, and the changelog folding open.',
        image: '/prototypes/home/edition.webp',
        poster: ['#f6f9fa', '#e3f4f1'],
      },
      {
        slug: 'replay',
        key: 'C',
        name: 'Replay',
        round: 1,
        title: 'AI marketing production, through one API.',
        blurb:
          'A navy hero with search up front and a replay of the quickstart’s real run, step by step, ending on the picture it made. Under it, every page on one map.',
        image: '/prototypes/home/replay.webp',
        poster: ['#061527', '#0f3460'],
      },
      {
        slug: 'desk-replay',
        key: 'D',
        name: 'Desk Replay',
        round: 2,
        mergeOf: ['A', 'C'],
        title: 'C’s replay inside A’s desk.',
        blurb:
          'A’s app shell with C’s replay inside it. The middle pane opens on the run playing, as the page’s one navy moment, so the reference rail turns light, the way os.esy.com/agency’s does.',
        image: '/prototypes/home/desk-replay.webp',
        poster: ['#0a2540', '#edf1f5'],
      },
      {
        slug: 'stage-desk',
        key: 'E',
        name: 'Stage Desk',
        round: 2,
        mergeOf: ['A', 'C'],
        title: 'C’s stage first, then A’s desk.',
        blurb:
          'Opens on C’s hero, with search and the replay, then scrolls into A’s three panes, whose rails stay put while the middle scrolls. The bar turns from navy to paper as you leave the hero.',
        image: '/prototypes/home/stage-desk.webp',
        poster: ['#061527', '#edf1f5'],
      },
      {
        slug: 'guide',
        key: 'F',
        name: 'Guide',
        round: 3,
        title: 'Five chapters, from a first run to shipping.',
        blurb:
          'E’s top, then the docs as a book’s contents: five numbered chapters read in order, each with its few pages. Everything else is one search away.',
        image: '/prototypes/home/guide.webp',
        poster: ['#ffffff', '#e3f4f1'],
        live: true,
        liveHref: '/',
      },
      {
        slug: 'jobs',
        key: 'G',
        name: 'Jobs',
        round: 3,
        title: 'Find your job. The pages follow.',
        blurb:
          'E’s top, then one band per job (first run, the model, volume, publishing, lookups), each with its pages as lines. Nothing to switch; scan down to yours.',
        image: '/prototypes/home/jobs.webp',
        poster: ['#ffffff', '#edf1f5'],
      },
      {
        slug: 'reference',
        key: 'H',
        name: 'Reference',
        round: 3,
        title: 'The facts, the endpoints, and what changed.',
        blurb:
          'E’s top, then a page for the second visit: the facts true of every call as a table you can copy from, and every endpoint grouped by resource.',
        image: '/prototypes/home/reference.webp',
        poster: ['#ffffff', '#f6f9fa'],
      },
    ],
  },
];

export const findPrototype = (slug: string) => PROTOTYPES.find((p) => p.slug === slug);
