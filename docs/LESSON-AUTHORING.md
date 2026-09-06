# Writing a lesson

A lesson is a typed data file. You describe *what* the learner encounters; the
renderer decides how it looks and behaves.

Open **`/lab`** in the dev server first — it renders every block type live with
notes. It is faster than reading this document.

---

## 1. Create the file

`src/content/lessons/01-what-is-abhidhamma.ts`

```ts
import type { Lesson } from "@/lib/types";

export const lesson: Lesson = {
  slug: "what-is-abhidhamma",
  number: 1,
  title: "What is the Abhidhamma?",
  pali: "abhidhamma",
  subtitle: "Two ways of describing the same experience — and why the second one matters.",
  summary: "Where the Abhidhamma sits in the Canon, and what changes when you drop the language of persons.",

  status: "draft",
  difficulty: "foundation",
  durationMin: 18,
  tags: ["orientation", "method"],

  objectives: [
    "Say where the Abhidhamma sits in the Pāli Canon",
    "Distinguish conventional from ultimate description",
    "Name the four ultimate realities",
  ],

  keyTerms: ["abhidhamma", "paramattha", "pannatti"],

  sections: [
    // ...
  ],

  sources: [
    { label: "Abhidhammattha Saṅgaha", ref: "ch. 1" },
    { label: "Bhikkhu Bodhi, A Comprehensive Manual of Abhidhamma", ref: "Introduction" },
  ],

  updated: "2026-09-04",
};
```

> **Import rule:** content files may import from `@/` only as `import type`.
> Anything imported at runtime must use a relative path. The validator runs on
> Node's native type-stripping, which cannot resolve the alias.

## 2. Register it

`src/content/lessons/index.ts`:

```ts
import { lesson as lesson01 } from "./01-what-is-abhidhamma";

export const lessons: Lesson[] = [lesson01];
```

## 3. Validate

```bash
npm run check:content
```

Drafts are visible in development and hidden in production. Flip `status` to
`"published"` when it is ready — at which point `sources` becomes mandatory.

---

## Sections

A section is one movement of the lesson. It is the unit the progress rail
tracks and the unit deep links point at.

```ts
{
  id: "two-truths",          // lowercase, stable forever — progress keys on it
  title: "Two ways of speaking",
  pali: "sammuti and paramattha",
  brief: "Conventional and ultimate description",
  blocks: [ /* 3–7 blocks */ ],
}
```

Aim for **3–7 blocks per section** and **4–8 sections per lesson**. A section
that runs longer should probably be two.

---

## Inline markup

Lesson copy is a plain string with six constructs. Not markdown — no headings,
no lists, no raw HTML.

| Write | Get |
| --- | --- |
| `**text**` | **bold** |
| `*text*` | *italic* |
| `` `text` `` | inline code |
| `[label](/lessons/x)` | link (external URLs open in a new tab) |
| `[[pali:citta]]` | glossary chip — renders **සිත**, hover for the whole entry |
| `[[ref:niraya]]` | reference chip — opens a background topic in an overlay |

`[[pali:id]]` must match a `GlossaryTerm.id` in `src/content/glossary.ts`. An
unknown id fails `check:content`.

**The chip renders the term's `si` form, not its Pāli.** The site is authored
in Sinhala, so a sentence should not break into Latin script to name its own
subject: a learner meets **සිත** in the prose and finds `citta` on the card.
The card carries the *whole* glossary entry — pronunciation, literal sense,
gloss, the fuller explanation and the related terms — so a reader never has to
leave the sentence to finish reading. `long` is rendered there with chips off:
a `[[pali:…]]` inside a term's own explanation becomes that term's name in
plain text, because a chip inside a chip is a trap the pointer cannot leave.

The Pāli is still the id you write, and it still appears on the hover card, the
`paliTerm` block and the glossary entry. A term without a `si` fails
`check:content`.

Use a chip **the first time a term appears in a section**, then plain text
after. Chipping every occurrence turns the page into confetti.

---

## The blocks

### Text

```ts
{ type: "prose", text: "Body copy.", variant: "lead" }   // lead: once, at the top
{ type: "heading", text: "Sub-heading", pali: "optional" }
{ type: "divider", ornament: true }
```

### Emphasis

```ts
{ type: "keyIdea", text: "One sentence worth remembering.", label: "Key idea" }
```

At most one or two per section. A page of key ideas has none.

```ts
{ type: "callout", tone: "caution", title: "Easy to misread", text: "..." }
```

Tones: `neutral` · `insight` · `caution` · `tradition` · `practice`.
`tradition` is for points of commentarial interpretation; `practice` for
something to try.

### Pāli and citation

```ts
{ type: "paliTerm", term: "bhavanga" }   // full card, pulled from the glossary

{
  type: "quote",
  pali: "cittaṃ, bhikkhave, pabhassaraṃ",
  text: "Luminous, monks, is this mind.",
  source: "Aṅguttara Nikāya 1.49",
  translator: "Bhikkhu Bodhi",
}
```

Cite precisely — book, chapter, verse. `docs/CONTENT-INTEGRITY.md` explains why.

### Structure

```ts
{
  type: "list",
  style: "number",              // bullet | number | step
  items: [{ text: "Consciousness", pali: "citta" }],
}

{
  type: "comparison",
  columns: [
    { title: "Conventional", pali: "sammuti", tone: "neutral", points: ["..."] },
    { title: "Ultimate", pali: "paramattha", tone: "insight", points: ["..."] },
  ],
}

{
  type: "table",
  caption: "optional",
  headers: ["Class", "Pāli", "Makes kamma?"],
  rows: [["Wholesome", "kusala", "Yes"]],   // row length must match headers
}
```

### Taxonomy — the Abhidhamma workhorse

Nested enumerations with counts that roll up from the leaves.

```ts
{
  type: "taxonomy",
  title: "The 52 mental factors",
  total: 52,                    // optional; validated against the leaves
  root: [
    {
      id: "universals",
      label: "Universals",
      pali: "sabbacittasādhāraṇa",
      note: "Present in every citta without exception.",
      children: [
        { id: "phassa", label: "Contact", pali: "phassa", count: 1 },
        // ...
      ],
    },
  ],
}
```

Put `count` on **leaves only** — parents sum their children. If `total`
disagrees with the sum, the build fails. That is the point: it catches a
dropped category, which is exactly the mistake that makes an enumeration
useless.

### Flow — ordered processes

```ts
{
  type: "flow",
  title: "A moment of seeing",
  autoplayable: true,
  steps: [
    { label: "Adverting", pali: "āvajjana", accent: "cobalt", text: "..." },
    { label: "Impulsion", pali: "javana", accent: "jade", text: "..." },
  ],
}
```

Use `accent` to group phases — e.g. lotus for passive stages, cobalt for
process, jade for the kammically active `javana` moments. The colour does
teaching work; do not vary it decoratively.

**Reach for `flow` only when the stepping is itself the teaching** — a
cognitive series is a sequence of discrete moments, and watching them advance
one at a time is the point. A history is not a process and arithmetic is not a
process. Those get `timeline` and `derivation`, which show everything at once.

### Figure — an authored image

```ts
{
  type: "figure",
  src: "lessons/pitaka-thuna/tripitaka-vyuhaya.png",   // no locale segment
  alt: "බුද්ධ දේශනාව විනය සහ ධර්මය ලෙස බෙදෙන අයුරු.",
  width: 1600,
  height: 900,
  caption: "Optional. Rich text.",
  size: "wide",                                        // optional
}
```

Artwork is **mirrored per language by a file-name suffix**:
`lessons/<slug>/x-si.png` sits beside `x-en.png`, and `src` omits the suffix
segment so the same lesson data serves both. `alt` lives in the lesson rather
than the file because it is authored text and translates with the lesson.

`width`/`height` are the file's real pixel size — the page reserves the space
before the image loads. `check:content` fails if the file is missing from the
authored locale and warns if a translation is missing.

Diagrams must survive **both themes**: transparent background, mid-tone
strokes. Full conventions in `public/images/README.md`.

### Structure — how a whole divides

```ts
{
  type: "structure",
  title: "The shape of the Canon",
  root: {
    id: "canon", label: "The teaching", accent: "neutral",
    children: [
      { id: "vinaya", label: "Vinaya", pali: "vinaya", accent: "cobalt", note: "..." },
      { id: "dhamma", label: "Dhamma", accent: "jade", children: [ /* ... */ ] },
    ],
  },
  caption: "What the diagram cannot say in a label.",
}
```

A static partition diagram — nothing opens. Use it when the *shape* of a
division is the teaching. Use `taxonomy` instead when counts have to add up.
Node ids must be unique; the validator checks.

### Derivation — arithmetic shown whole

```ts
{
  type: "derivation",
  given: [{ label: "A year", value: "360 days" }],
  steps: [
    { label: "The ratio in days", expression: "100 × 360", result: "36,000 days",
      note: "Optional — what the number means." },
  ],
  conclusion: { value: "9 minutes", text: "..." },
}
```

For a figure a learner should be able to **check** rather than accept. State
the assumptions in `given`, and make sure `expression` actually computes to
`result` — the whole value of the block is that someone can follow it.

### Timeline — a history read as one line

```ts
{
  type: "timeline",
  events: [
    { label: "Spoken", when: "year 7", accent: "lotus", milestone: true, text: "..." },
    { label: "Memorised", accent: "cobalt", text: "..." },
  ],
}
```

`milestone` marks a change of era or medium and draws a heavier node. `when` is
optional — leave it off when a date would be false precision.

### Exercises

```ts
{
  type: "quiz",
  question: "At which stage is kamma made?",
  options: [
    { text: "Adverting" },
    { text: "[[pali:javana]]", correct: true },   // exactly one
  ],
  explanation: "Only javana moments are kusala or akusala...",
}
```

Write the **explanation** first — it is the actual teaching. The question exists
to make the learner commit before reading it. Wrong options should be plausible
misreadings, not filler.

```ts
{
  type: "sortGame",
  prompt: "Which are ultimate realities, and which are concepts?",
  buckets: [
    { id: "ultimate", label: "Ultimate", pali: "paramattha" },
    { id: "concept", label: "Concept", pali: "paññatti" },
  ],
  items: [
    { id: "1", label: "Feeling", bucketId: "ultimate" },
    { id: "2", label: "A chariot", bucketId: "concept", hint: "A designation for parts arranged a certain way." },
  ],
}
```

4–8 items, 2–3 buckets. Add a `hint` to anything a learner could reasonably get
wrong — the hint shows only after checking, and is where the learning happens.

```ts
{
  type: "reflect",
  prompt: "Catch one moment today where [[pali:vedana]] is distinct from the liking that follows it.",
  placeholder: "Take your time...",
}
```

Ask for something observable. "What do you think about anattā?" is not a
reflection prompt; "find one moment where you can watch a decision form" is.

### Recap

```ts
{
  type: "summary",
  title: "In short",
  points: ["...", "...", "..."],
}
```

Three to five points, at the end of a section or a lesson.

---

### Simulators

These are what make the site a learning tool rather than a book. Reach for one
when the learner should *do* the thing, not read about it.

```ts
// Break a conventional object down until division stops.
{
  type: "deconstruct",
  conclusion: "Shown at the end, for every object.",
  objects: [{
    id: "pot", label: "මැටි කළය", glyph: "🏺",
    dominant: "පඨවි ධාතුව",
    separation: "How it comes apart.",
    stages: [ { label: "...", text: "..." } ],   // conventional → ultimate
  }],
}
```

Give it **at least two objects**. The whole insight is that different objects
reach the same floor, and a learner only sees that by running it twice.

```ts
// The suddhaṭṭhaka. Exactly 4 mahābhūta + 4 upādā-rūpa — the validator enforces it.
{
  type: "octad",
  scale: [{ label: "පරමාණුව" }, { label: "ශුද්ධාෂ්ටකය" }],   // zoom ladder
  simultaneityNote: "...",
  items: [{ id, label, pali, group: "maha" | "upada", short, detail }],
}
```

```ts
// Two-realm time ratio.
{
  type: "timeConverter",
  realms: [{
    id, label, pali,
    humanDaysPerRealmDay: 36000,   // the teaching's own figure
    minutesPerRealmDay: 3600,      // 1440 for a 24-hour day
  }],
  presets: [{ label: "වස් කාලය", humanDays: 90, note: "..." }],
}
```

**Use the teacher's arithmetic, not yours.** This talk reckons a 360-day year
and a 60-hour deva day; substituting 365 and 24 turns the taught answer of
9 minutes into 8.88. `minutesPerRealmDay` exists precisely so a reckoning can
be stated rather than assumed, and the widget prints its own derivation so a
learner can check it.

```ts
// Element dominance. Shares are normalised to 100 — raising one lowers the rest.
{
  type: "elementMixer",
  elements: [{ id, label, pali, start: 25, hint }],   // starts must total 100
  outcomes: [{ when: "pathavi", atLeast: 40, label, glyph, text }],
  puzzles: [{ question, answer }],                     // the counter-intuitive cases
}
```

```ts
// Cutting. The blade travels the gap; no node is ever divided.
{
  type: "slicer",
  explanation: "...",
  materials: [{ id, label, density: 0..1, tool, note }],
}
```

`density` drives how tightly the lattice packs — a leaf and a steel bar differ
in the size of the gap, never in whether there is one.

```ts
{ type: "speechSpeed", baselineWordsPerSecond: 1, sample: "...",
  speakers: [{ id, label, multiplier: 128, accent, note }] }

{ type: "hierarchy", root: [{ id, label, pali, tier, summary,
  details: [{ label, value }], accent, children: [...] }] }

{ type: "paramatthaTable", groups: [{ id, label, pali, count: 28, accent,
  cells: [{ id, label, pali, unlockedBy: "lesson-slug", note }] }] }
```

Use `hierarchy` for *who sits where*; use `taxonomy` when you are *counting*.

> **Currently unused in content:** `reflect`, `timeConverter`, `slicer` and
> `quiz` were removed from the lessons by the author. The block types are
> intact and demonstrated in `/lab` — treat them as available inventory, and do
> not add them back to a lesson without being asked.
>
> When removing a block that carries teaching (a quiz explanation, a callout
> inside a simulator), check whether the point is made anywhere else in the
> lesson first. If it is not, keep it as prose or a callout. Removing a
> *presentation* is not licence to remove a *teaching*.

In `paramatthaTable`, name only the cells a learner has met. The shortfall
against `count` renders as locked placeholders, and that visible remainder is
the point — it shows the size of what is still ahead.

---

## Shape of a good lesson

A rhythm that works:

1. **Open** — `prose` (lead) establishing why this matters.
2. **Orient** — `comparison` or `keyIdea` giving the shape before the detail.
3. **Teach** — `prose`, `paliTerm`, `taxonomy` or `flow`.
4. **Check** — `quiz` or `sortGame` while it is fresh.
5. **Land** — `summary`, then `reflect`.

Rules of thumb:

- **Every section should contain something the learner does.** A section of
  pure prose is a section that should have been shorter.
- Interactive blocks go *after* the material they test, never before.
- One `keyIdea` per section at most.
- If two sections both explain, put an exercise between them.

---

## Before you publish

```bash
npm run check
```

Then read it on a phone. The rail collapses to a bottom sheet, tables scroll,
and the process track scrolls horizontally — confirm all three still make
sense.

Finally: set `status: "published"`, add `sources`, and add a line to
`CHANGELOG.md`.

---

## Chapters

A chapter groups the lessons from one body of teaching.

`src/content/chapters/01-my-chapter.ts`:

```ts
import type { Chapter } from "@/lib/types";

export const chapter: Chapter = {
  slug: "paramattha-pivisuma",
  number: 1,
  title: "...",
  subtitle: "...",
  summary: "...",
  status: "published",
  lessons: ["lesson-a", "lesson-b"],    // slugs, in teaching order
  sources: [{ label: "...", ref: "..." }],
};
```

Register it in `src/content/chapters/index.ts`.

**There is one view.** Reading and doing live together in the lessons — there
is no separate continuous-reading copy, and the validator errors if a chapter
grows a `reading` field.

---

## Reference topics

Background a lesson **names but does not carry**.

The rule: *if it is Abhidhamma, it belongs in a lesson; if a lesson merely
needs to name it, it belongs in reference.* A lesson can say the Abhidhamma was
taught in Tāvatiṃsa without becoming a catalogue of deva realms.

`src/content/reference/niraya.ts`:

```ts
import type { ReferenceTopic } from "@/lib/types";

export const topic: ReferenceTopic = {
  slug: "niraya",
  title: "නිරය",
  pali: "niraya",
  summary: "One line. Shown in the inline chip — keep it under 160 chars.",
  category: "විශ්ව විද්‍යාව",       // groups the index page
  status: "published",
  see: ["pretha-loka"],              // related topics
  sections: [ /* same Section/Block model as a lesson */ ],
  sources: [{ label: "..." }],
};
```

Register it in `src/content/reference/index.ts`, then link it from any content
string with `[[ref:niraya]]`. The chip previews the `summary` on hover and
opens the whole topic in an overlay on click, so the reader never loses their
place; the topic's own page is still there behind a link in the overlay's
foot.

Several related topics may share one file — the four lower realms do. The
validator collects every exported topic per file.

> **The one rule that matters:** if a lesson links a topic, that topic must
> actually contain what the lesson says it contains. A pointer to detail that
> is not there is worse than no pointer at all.

Reference topics carry no progress, no prerequisites and no lesson number, and
render in jade rather than cobalt, so a learner always knows they have stepped
off the course.

---

## Language

The site is authored in **Sinhala**; Pāli stays in Latin script with diacritics.

- Lesson content is written directly in Sinhala.
- **Interface** text is never written in a lesson or a component — it lives in
  `src/lib/strings.ts`.
- Do not put `uppercase` or wide `tracking-[…]` on Sinhala. Use `si-heading`,
  `si-tight` and `eyebrow-si`.
