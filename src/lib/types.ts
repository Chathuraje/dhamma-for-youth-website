/**
 * CONTENT MODEL
 * =============
 * A lesson is DATA, never JSX. The renderer turns data into an interactive
 * experience. This keeps authoring fast, makes every lesson consistent, and
 * lets us upgrade the visuals of every lesson at once.
 *
 * Adding a new block type is a 3-step change - see /docs/LESSON-AUTHORING.md.
 */

/* -------------------------------------------------------------------------- */
/*  Inline rich text                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Lesson copy is written as a lightweight marked-up string, not HTML.
 * Supported inline syntax (parsed by `src/lib/richtext.tsx`):
 *
 *   **bold**            emphasis
 *   *italic*            soft emphasis
 *   [[pali:citta]]      glossary chip - hover/tap for the term card
 *   [[ref:niraya]]      reference chip - links to a background topic
 *   [label](/href)      internal or external link
 *   `code`              literal / technical token
 */
export type RichText = string;

/* -------------------------------------------------------------------------- */
/*  Blocks                                                                    */
/* -------------------------------------------------------------------------- */

export type Tone = "neutral" | "insight" | "caution" | "tradition" | "practice";

/** Plain body copy. The workhorse. */
export interface ProseBlock {
  type: "prose";
  text: RichText;
  /** `lead` renders larger - use once at the top of a section. */
  variant?: "default" | "lead";
}

/** A sub-heading inside a section. */
export interface HeadingBlock {
  type: "heading";
  text: string;
  pali?: string;
}

/** A single statement worth remembering. Animates in with emphasis. */
export interface KeyIdeaBlock {
  type: "keyIdea";
  text: RichText;
  label?: string;
}

/** Aside box - a note, a warning, a point of traditional interpretation. */
export interface CalloutBlock {
  type: "callout";
  tone: Tone;
  title?: string;
  text: RichText;
}

/** A Pali term given the full treatment: script, pronunciation, meaning. */
export interface PaliTermBlock {
  type: "paliTerm";
  /** Glossary id - must exist in `src/content/glossary.ts`. */
  term: string;
}

/** Canonical or commentarial quotation. */
export interface QuoteBlock {
  type: "quote";
  text: RichText;
  pali?: string;
  /** e.g. "Dhammasanganii 1" - keep citations precise. */
  source?: string;
  translator?: string;
}

/** Staggered animated list. */
export interface ListBlock {
  type: "list";
  style: "bullet" | "number" | "step";
  items: Array<{ text: RichText; pali?: string }>;
}

/** Side-by-side contrast - ideal for "conventional vs ultimate" framings. */
export interface ComparisonBlock {
  type: "comparison";
  columns: Array<{
    title: string;
    pali?: string;
    tone?: Tone;
    points: RichText[];
  }>;
}

/**
 * An ordered process the learner steps through one stage at a time.
 * Built for citta-viithi (cognitive process series) and similar sequences.
 */
export interface FlowBlock {
  type: "flow";
  title?: string;
  autoplayable?: boolean;
  steps: Array<{
    label: string;
    pali?: string;
    text: RichText;
    accent?: "cobalt" | "jade" | "lotus";
  }>;
}

/**
 * Expandable classification tree - the shape most of Abhidhamma actually takes
 * (89 cittas, 52 cetasikas, 28 ruupas). Nodes carry counts so learners can see
 * the arithmetic of a category add up.
 */
export interface TaxonomyNode {
  id: string;
  label: string;
  pali?: string;
  count?: number;
  note?: RichText;
  children?: TaxonomyNode[];
}

export interface TaxonomyBlock {
  type: "taxonomy";
  title?: string;
  total?: number;
  root: TaxonomyNode[];
}

/** Multiple-choice check with an explanation revealed after answering. */
export interface QuizBlock {
  type: "quiz";
  question: RichText;
  options: Array<{ text: RichText; correct?: boolean }>;
  explanation: RichText;
}

/** Categorisation game: tap an item, tap its bucket. */
export interface SortGameBlock {
  type: "sortGame";
  prompt: string;
  buckets: Array<{ id: string; label: string; pali?: string }>;
  items: Array<{ id: string; label: string; bucketId: string; hint?: RichText }>;
}

/** Open reflection. Saved to the learner's device only - never transmitted. */
export interface ReflectBlock {
  type: "reflect";
  prompt: RichText;
  placeholder?: string;
}

/** Dense reference data. Scrolls horizontally on small screens. */
export interface TableBlock {
  type: "table";
  caption?: string;
  headers: string[];
  rows: RichText[][];
}

/** End-of-section recap. */
export interface SummaryBlock {
  type: "summary";
  title?: string;
  points: RichText[];
}

/**
 * How a whole divides.
 *
 * Distinct from `taxonomy`, which is an expandable tree the learner opens a
 * branch at a time and which exists to make counts add up. This one is a
 * static partition diagram: the whole is a band, and the band splits. Nothing
 * is hidden, so the shape of the division is the first thing seen rather than
 * something to be discovered by clicking.
 */
export interface StructureNode {
  id: string;
  label: string;
  pali?: string;
  note?: RichText;
  accent?: "cobalt" | "jade" | "lotus" | "neutral";
  children?: StructureNode[];
}

export interface StructureBlock {
  type: "structure";
  title?: string;
  /** The undivided whole, at the top of the diagram. */
  root: StructureNode;
  caption?: RichText;
}

/**
 * An arithmetic derivation, shown whole.
 *
 * For results a learner should be able to check rather than accept — the
 * nine-minute figure is the case this was built for. Every step is on screen
 * at once, because the point is that the chain holds, and a chain the learner
 * has to click through cannot be read as a chain.
 */
export interface DerivationBlock {
  type: "derivation";
  title?: string;
  /** The figures the arithmetic assumes. Stated before it starts. */
  given?: Array<{ label: string; value: string }>;
  steps: Array<{
    label: string;
    /** The arithmetic itself. Set in mono, and it must actually compute. */
    expression?: string;
    result: string;
    note?: RichText;
  }>;
  /** The answer, given the weight of an answer. */
  conclusion: { value: string; text: RichText };
}

/**
 * A sequence of events in time, shown whole.
 *
 * Distinct from `flow`, which is a process the learner steps through because
 * the stepping is the teaching. A history is not a process: it is read, and it
 * reads better as one continuous line than as a slideshow.
 */
export interface TimelineBlock {
  type: "timeline";
  title?: string;
  events: Array<{
    label: string;
    pali?: string;
    /** Era, date, ordinal or place — set apart from the label. */
    when?: string;
    text: RichText;
    accent?: "cobalt" | "jade" | "lotus";
    /** A change of era or medium. Renders as a heavier node. */
    milestone?: boolean;
  }>;
}

/**
 * An authored image — a diagram, a chart, a plate.
 *
 * Artwork is mirrored per language, so `src` names the file **without** its
 * locale segment and `figureSrc()` resolves it. `alt` lives here rather than in
 * the image because it is authored text and translates with the lesson.
 */
export interface FigureBlock {
  type: "figure";
  /** Path under `public/images/<locale>/`, e.g. `"lessons/slug/name.png"`. */
  src: string;
  /** What the image shows. Required — a figure nobody can read is not a figure. */
  alt: string;
  caption?: RichText;
  /** The file's real pixel size, so the page reserves its space before loading. */
  width: number;
  height: number;
  /**
   * `wide` lets a detailed diagram grow past the reading column, to the right
   * only and only from `xl` up — the body sits beside a sticky rail, so there
   * is no room to take on the left.
   */
  size?: "inline" | "wide";
}

/** Breathing room between movements of a section. */
export interface DividerBlock {
  type: "divider";
  ornament?: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Simulators                                                                */
/*                                                                            */
/*  These are the blocks that make this a learning tool rather than a book.   */
/*  Each one lets the learner manipulate something and watch the consequence. */
/* -------------------------------------------------------------------------- */

/**
 * Two-realm time converter.
 *
 * One day in the higher realm equals `humanDaysPerRealmDay` days here, so time
 * is a straight linear scale - the teaching point is the sheer size of the
 * ratio, which a slider conveys and a paragraph does not.
 */
export interface TimeConverterBlock {
  type: "timeConverter";
  title?: string;
  realms: Array<{
    id: string;
    label: string;
    pali?: string;
    /** Human days that pass during one day of this realm. 1 for the human realm. */
    humanDaysPerRealmDay: number;
    /**
     * Minutes in one day of this realm. 1440 for a 24-hour day.
     *
     * Not assumed, because a teaching may reckon a deva day differently — the
     * talk this course is built from reckons the Tāvatiṃsa day at 60 hours
     * (3,600 minutes), and the widget must show the teacher's arithmetic
     * rather than quietly substituting our own.
     */
    minutesPerRealmDay: number;
    accent?: "cobalt" | "jade" | "lotus";
  }>;
  /** One-tap scenarios worth showing, e.g. the three-month rains retreat. */
  presets: Array<{
    label: string;
    humanDays: number;
    note?: RichText;
  }>;
}

/**
 * The suddhaṭṭhaka - eight inseparable material realities.
 *
 * Rendered as a ring of nodes that pulse together, because the doctrinal point
 * is that they arise and cease *simultaneously*, never one before another.
 */
export interface OctadBlock {
  type: "octad";
  title?: string;
  /** Exactly 8: the four great elements then the four derived. */
  items: Array<{
    id: string;
    label: string;
    pali: string;
    group: "maha" | "upada";
    short: RichText;
    detail?: RichText;
  }>;
  /** Zoom ladder from the everyday down to the indivisible. */
  scale?: Array<{ label: string; note?: RichText }>;
  simultaneityNote?: RichText;
}

/**
 * Element-dominance mixer.
 *
 * The learner moves four sliders and watches which material the mix produces.
 * `outcomes` are matched by whichever element dominates.
 */
export interface ElementMixerBlock {
  type: "elementMixer";
  title?: string;
  elements: Array<{
    id: string;
    label: string;
    pali: string;
    /** Starting share, 0-100. Should total 100. */
    start: number;
    hint?: RichText;
  }>;
  outcomes: Array<{
    /** Element id that must dominate for this outcome to show. */
    when: string;
    /** Minimum share required. */
    atLeast: number;
    label: string;
    text: RichText;
    glyph?: string;
  }>;
  /** "Why can a tsunami break a hotel?" - the counter-intuitive cases. */
  puzzles?: Array<{ question: string; answer: RichText }>;
}

/**
 * Cutting simulator for pariccheda ākāsa.
 *
 * The learner slices a material and the magnified view shows the blade passing
 * through the gaps *between* octads rather than through any octad itself.
 */
export interface SlicerBlock {
  type: "slicer";
  title?: string;
  materials: Array<{
    id: string;
    label: string;
    /** How tightly bound the octads are, 0-1. Drives the animation. */
    density: number;
    tool: string;
    note: RichText;
  }>;
  explanation: RichText;
}

/**
 * Relative speech-rate comparison.
 *
 * Speakers are given as a multiplier over the baseline, and the block shows how
 * long each would take to say one fixed phrase. The phrase is authored rather
 * than typed: it is part of the teaching, and an empty text box asks a learner
 * to invent an input before they know what the comparison is for.
 */
export interface SpeechSpeedBlock {
  type: "speechSpeed";
  title?: string;
  /** Words a baseline human speaks per second. */
  baselineWordsPerSecond: number;
  speakers: Array<{
    id: string;
    label: string;
    /** Words spoken in the time the baseline speaker manages one. */
    multiplier: number;
    accent?: "cobalt" | "jade" | "lotus";
    note?: RichText;
  }>;
  /** The phrase being timed. Shown as the block's subject. */
  sample: string;
}

/**
 * Realm / office hierarchy with inspectable cards.
 *
 * Distinct from `taxonomy`: that block counts things, this one describes who
 * or what occupies each tier, with a detail card per node.
 */
export interface HierarchyNode {
  id: string;
  label: string;
  pali?: string;
  tier: string;
  summary: RichText;
  details?: Array<{ label: string; value: RichText }>;
  accent?: "cobalt" | "jade" | "lotus";
  children?: HierarchyNode[];
}

export interface HierarchyBlock {
  type: "hierarchy";
  title?: string;
  root: HierarchyNode[];
}

/**
 * Step-by-step deconstruction of a conventional object down to what cannot be
 * divided further.
 *
 * The single most important interaction in the course: it is the Abhidhamma
 * method performed rather than described.
 */
export interface DeconstructBlock {
  type: "deconstruct";
  title?: string;
  /** Shown once the final stage is reached, for every object. */
  conclusion: RichText;
  objects: Array<{
    id: string;
    label: string;
    glyph?: string;
    /**
     * Which silhouette the viewport draws before the breaking starts.
     *
     * The first stage is still the everyday object, so it should look like
     * one — an abstract scatter at stage one asks the learner to break
     * something they were never shown.
     */
    shape?: "vessel" | "leaf" | "liquid" | "body";
    /** Ordered stages from conventional down to ultimate. */
    stages: Array<{ label: string; text: RichText }>;
    dominant: string;
    separation: RichText;
  }>;
}

/**
 * An escalating comparison, revealed one rung at a time.
 *
 * For teachings shaped as "faster than that... and faster still than that" —
 * the Dhanuggaha Sutta's chain of speeds, or the three world-system scales.
 * A table flattens the escalation; revealing rungs in order preserves it,
 * because the last rung only lands if the earlier ones have already
 * exhausted the learner's sense of scale.
 */
export interface LadderBlock {
  type: "ladder";
  title?: string;
  /** Ordered from smallest/slowest to largest/fastest. */
  rungs: Array<{
    label: string;
    pali?: string;
    /** Optional magnitude shown as a figure, e.g. "1,000" or "10¹²". */
    figure?: string;
    text: RichText;
    accent?: "cobalt" | "jade" | "lotus";
  }>;
  /** Shown once every rung is open. */
  conclusion?: RichText;
}

/**
 * The citta-kkhaṇa: one mind-moment, its three sub-moments, and the 17:1
 * ratio between a rūpa's lifespan and a citta's.
 *
 * The ratio is the whole point and it is impossible to feel from the number
 * alone, so the block runs seventeen mind-moments against one materiality and
 * lets the learner watch the mismatch.
 */
export interface MomentRatioBlock {
  type: "momentRatio";
  title?: string;
  /** The three sub-moments, in order. Normally uppāda / ṭhiti / bhaṅga. */
  phases: Array<{ label: string; pali: string; note: RichText }>;
  /** How many mind-moments one materiality lasts. */
  rupaLifespan: number;
  /** e.g. "ඇසිපිය හෙළන මොහොතක" — the unit the counts below are per. */
  perUnitLabel?: string;
  /** Formatted counts, e.g. "10¹²" and "5.8 × 10¹⁰". */
  cittaCount?: string;
  rupaCount?: string;
  note?: RichText;
}

/**
 * The firebrand circle (alāta-cakka) — santati-ghana made visible.
 *
 * Slow, the learner sees separate points arising and passing. Fast, the same
 * points read as one unbroken ring. Nothing about the points changed; only the
 * speed did. That is the illusion of a continuing self, demonstrated rather
 * than asserted, and it is the one idea in this course best taught by a
 * control the learner moves themselves.
 */
export interface SpinWheelBlock {
  type: "spinWheel";
  title?: string;
  /** Shown while the speed is low enough to resolve individual points. */
  slowLabel: string;
  slowText: RichText;
  /** Shown once the points blur into a continuous ring. */
  fastLabel: string;
  fastText: RichText;
  conclusion?: RichText;
}

/**
 * The 82 ultimate realities as a periodic-table-style grid.
 *
 * Cells unlock as lessons are completed, so the learner watches the map of the
 * universe fill in. Locked cells stay visible but unlabelled - the shape of
 * what is still to come is itself informative.
 */
export interface ParamatthaTableBlock {
  type: "paramatthaTable";
  title?: string;
  groups: Array<{
    id: string;
    label: string;
    pali: string;
    count: number;
    accent: "cobalt" | "jade" | "lotus" | "rose";
    /** Named cells. Any shortfall against `count` renders as locked cells. */
    cells: Array<{
      id: string;
      label: string;
      pali?: string;
      /** Lesson slug that unlocks it. Omit to leave it always unlocked. */
      unlockedBy?: string;
      note?: RichText;
    }>;
  }>;
}

/**
 * An ordered set of *works* — a canon, a collection, a series of treatises —
 * shown as a shelf you can pull volumes from rather than a list you scroll.
 *
 * The point of the shelf over a list is the ordering. Where a set genuinely
 * deepens as it goes, `ascending` draws each volume taller than the last, so
 * the shape of the shelf says what the prose says. Leave it off for a set that
 * is merely ordered — a height ramp on an unranked collection is a claim the
 * content never made.
 */
export interface ShelfBlock {
  type: "shelf";
  title?: string;
  /** Ordered. Position is meaningful; do not sort at render time. */
  volumes: Array<{
    /** Stable, unique within the block — it keys the selected volume. */
    id: string;
    label: string;
    pali?: string;
    /** Glossary id, if the volume has an entry worth linking. */
    term?: string;
    text: RichText;
  }>;
  /** Draw the volumes rising left to right. Only where the set really deepens. */
  ascending?: boolean;
}

export type Block =
  | ProseBlock
  | HeadingBlock
  | KeyIdeaBlock
  | CalloutBlock
  | PaliTermBlock
  | QuoteBlock
  | ListBlock
  | ComparisonBlock
  | FlowBlock
  | TaxonomyBlock
  | QuizBlock
  | SortGameBlock
  | ReflectBlock
  | TableBlock
  | SummaryBlock
  | FigureBlock
  | StructureBlock
  | DerivationBlock
  | TimelineBlock
  | DividerBlock
  | TimeConverterBlock
  | OctadBlock
  | ElementMixerBlock
  | SlicerBlock
  | SpeechSpeedBlock
  | HierarchyBlock
  | DeconstructBlock
  | ParamatthaTableBlock
  | LadderBlock
  | MomentRatioBlock
  | SpinWheelBlock
  | ShelfBlock;

export type BlockType = Block["type"];

/* -------------------------------------------------------------------------- */
/*  Sections & lessons                                                        */
/* -------------------------------------------------------------------------- */

/**
 * A section is one "movement" of the lesson - the unit the progress rail
 * tracks and the unit the learner navigates between. Aim for 3-7 blocks.
 */
export interface Section {
  /** URL-safe, stable. Used for deep links (#id) and progress records. */
  id: string;
  title: string;
  pali?: string;
  /** One line shown in the lesson's side rail. */
  brief?: string;
  blocks: Block[];
}

export type Difficulty = "foundation" | "intermediate" | "deep";
export type LessonStatus = "draft" | "published";

export interface Source {
  label: string;
  /** e.g. "Abhidhammattha Sangaha, ch. 1" */
  ref?: string;
  url?: string;
}

export interface Lesson {
  /** URL slug. Stable forever once published - progress records key on it. */
  slug: string;
  /** Display order and the number shown in the UI. */
  number: number;
  title: string;
  pali?: string;
  subtitle: string;
  /** 1-2 sentences for cards and social previews. */
  summary: string;
  status: LessonStatus;
  difficulty: Difficulty;
  /** Honest estimate in minutes. */
  durationMin: number;
  tags: string[];
  /** Slugs of lessons that should come first. */
  prerequisites?: string[];
  /** "By the end you will be able to..." - concrete and checkable. */
  objectives: string[];
  /** Glossary ids introduced here. Surfaced on the lesson card. */
  keyTerms?: string[];
  sections: Section[];
  /** Where this teaching comes from. Required for published lessons. */
  sources?: Source[];
  /** ISO date. */
  updated?: string;
}

/* -------------------------------------------------------------------------- */
/*  Chapters                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * A chapter groups the lessons that came out of one body of teaching.
 *
 * There is exactly one way through a chapter: its lessons. An earlier version
 * carried a parallel continuous-reading copy of the same teaching, which meant
 * every change had to be made twice and learners had to choose a route before
 * they knew what was in it. The lessons now carry the whole teaching.
 */
export interface Chapter {
  slug: string;
  number: number;
  title: string;
  pali?: string;
  subtitle: string;
  summary: string;
  status: LessonStatus;
  /**
   * Artwork for the chapter's card, named **without** its locale segment,
   * exactly as `FigureBlock.src` is: `"chapters/01-slug.svg"` resolves to
   * `/images/si/chapters/01-slug.svg`. `check:content` fails the build if the
   * file is missing for any locale.
   *
   * The files under `public/images/<locale>/chapters/` are placeholders.
   */
  image?: string;
  /** Lesson slugs, in teaching order. */
  lessons: string[];
  sources?: Source[];
  updated?: string;
}

/* -------------------------------------------------------------------------- */
/*  Reference topics                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Background material that a lesson refers to but is not itself Abhidhamma.
 *
 * Cosmology is the clear case: a lesson needs to say "this was taught in
 * Tāvatiṃsa" without turning into a catalogue of deva realms. The lesson links
 * the name; the full account lives here, and can grow without diluting the
 * teaching.
 *
 * Reference topics use the same `Section`/`Block` model as lessons, so every
 * block type works here too. They are deliberately NOT part of the course:
 * they carry no progress, no prerequisites and no lesson number.
 */
export interface ReferenceTopic {
  slug: string;
  title: string;
  pali?: string;
  /** One line. Shown in the inline chip and on the index card. */
  summary: string;
  /** Groups the index page, e.g. "විශ්ව විද්‍යාව". */
  category: string;
  status: LessonStatus;
  sections: Section[];
  /** Other reference slugs worth reading next. */
  see?: string[];
  sources?: Source[];
  updated?: string;
}

/* -------------------------------------------------------------------------- */
/*  Glossary                                                                  */
/* -------------------------------------------------------------------------- */

export interface GlossaryTerm {
  /** Lowercase, no diacritics - the id used in `[[pali:id]]`. */
  id: string;
  /** Correctly diacriticked Pali, e.g. "citta", "cetasika", "panna". */
  pali: string;
  /**
   * The Sinhala form of the term.
   *
   * This is what a reader meets inline: the site is authored in Sinhala, so a
   * sentence of Sinhala prose should not break into Latin script to name its
   * own subject. The Pali stays on the term card and the glossary, where it is
   * the scholarly reference rather than the reading experience.
   */
  si: string;
  /** Simple phonetic guide, e.g. "CHIT-ta". */
  say?: string;
  /** Short gloss - one line. Leads the term card and the glossary entry. */
  short: string;
  /** Fuller explanation for the glossary page. */
  long?: RichText;
  /** Literal/etymological sense, where it illuminates the term. */
  literal?: string;
  /** Related glossary ids. */
  see?: string[];
  /** Lesson slug where this term is introduced. */
  introducedIn?: string;
}

/* -------------------------------------------------------------------------- */
/*  Blog posts                                                                */
/* -------------------------------------------------------------------------- */

/**
 * A written piece that is not part of the course.
 *
 * Posts use the same `Section`/`Block` tree as lessons, so every block type
 * works in one — a post can open a taxonomy or run a comparison without any
 * new machinery. What a post does *not* have is a number, a chapter, progress
 * or prerequisites: it is read, not studied, and nothing about it appears in
 * the learner's completion figures.
 *
 * The rule for what belongs here rather than in a lesson is the same one that
 * governs reference topics, one step further out: if it is Abhidhamma, it is a
 * lesson; if a lesson needs to name it, it is a reference topic; if it is
 * *about* the project, the tradition or the work of studying — rather than the
 * teaching itself — it is a post.
 *
 * Content integrity applies unchanged. A post that makes a doctrinal claim
 * cites it like a lesson does.
 */
export interface Post {
  /** URL slug. Stable once published. */
  slug: string;
  title: string;
  /** One line under the title. */
  subtitle?: string;
  /** 1-2 sentences for the index and social previews. */
  summary: string;
  status: LessonStatus;
  /** ISO date. Sorts the index, newest first. */
  published: string;
  /** ISO date, when a published post has been revised. */
  updated?: string;
  tags: string[];
  /** Honest estimate in minutes. */
  readingMin: number;
  sections: Section[];
  /** Required whenever the post makes a claim about the teaching. */
  sources?: Source[];
}
