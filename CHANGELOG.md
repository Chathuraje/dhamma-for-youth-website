# Changelog

All notable changes to Abhidhamma Atlas.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html),
where a MINOR bump means new lessons or new interactive capability, and a PATCH
bump means fixes and content corrections.

---

## [Unreleased]

### Added

- **පාඩම 1.2 rebuilt from the teacher's master note.** It opens on කාල
  ප්‍රසාරණය (time dilation) and the three questions the lesson answers, draws
  the climb from earth to Tāvatiṃsa as a ladder, gives Cātummahārājika its four
  kings as a table, gives Tāvatiṃsa its etymology (මඝ and the thirty-three) and
  its three sacred places, sets the four reasons out one at a time, and closes
  on a cheat-sheet table. The nine-minute derivation now has the **time
  converter** under it — the block existed and no lesson had used it — and a
  question that makes the learner commit to a figure before the explanation.
- **The three දේශනා ක්‍රම named** in පාඩම 1.3, where transmission lives:
  විස්තාර → නාතිවිත්ථාර නාතිසංඛිත්ත → සංඛිත්ත, as a flow.

- **The lesson outline folds.** It opens closed: while reading, what a learner
  needs is where they are and how much is left, which the heading and the bar
  answer in one line. The full list is for deciding where to jump, so it waits
  to be asked for. The mobile sheet stays open — opening it was the asking.

- **The rail folds.** A control at its foot collapses it to a strip of icons
  and back, and the choice is remembered in the learner's own browser. The page
  reflows with it.

- **`shelf` block** — an ordered set of works drawn as spines you pull volumes
  from, gold-keyed for canon. `ascending: true` ramps the heights so a set that
  really deepens says so at a glance. The block type, the validator rule and the
  seven treatises in *පිටක තුන* already existed; the component did not, which
  broke the build. Now in `/lab`.
- **A reference topic opens where you are.** A `[[ref:slug]]` chip, a card on
  `/reference`, a tile in the dashboard's background strip and a related topic
  inside the overlay all raise the whole topic in an overlay — same sections,
  same blocks, same citations, same progress keys — instead of navigating away
  mid-paragraph. Related topics push with a way back, Escape unwinds one at a
  time, and the foot links to the topic's own page for anyone who wants it.
  Every one of them is still a real link, so ⌘/Ctrl-click opens the page in a
  new tab and the URL is still there to copy. Posts, resources, external links
  and search results still navigate.

- **The term card is the glossary entry.** Hovering or tapping a `[[pali:…]]`
  chip now shows the whole thing — Sinhala, Pāli, pronunciation, literal sense,
  gloss, the fuller explanation and the related terms. The "සම්පූර්ණ විස්තරය"
  link is gone from the card and from the `shelf` block: there is nothing left
  to go and see. `/glossary` remains, for browsing.

- **The site is now two halves: a public site and a learning app.** `(site)`
  keeps the marketing header and footer and holds the home page, `/about`,
  `/blog` and `/contact`. `(app)` is the course, wrapped in a dashboard shell —
  a midnight sidebar, a topbar with ⌘K search, and the learner's own pages. The
  one door between them is the **Open Dashboard** button in the site header.
- **`/dashboard`** — where a learner now lands. A banner with the one action
  that resumes the course, then:
  - **ඉගෙනුම් මාර්ගය** — the chapters as a path. Each stage is a card with a
    full-bleed image header, the chapter numeral over it, a **state** chip
    (සම්පූර්ණයි / දැනට / නව) and its own progress, with Tab-reachable arrows
    to move along the strip.
  - **අභිධර්ම දැනුම් සිතියම** — the course as a chain of concepts. Derived
    from each lesson's *first* `keyTerms` entry in teaching order, so it cannot
    drift from the teaching and names nothing a lesson did not. Change a
    lesson's `keyTerms` to change the chain.
  - **ඉගෙනීම දිගටම කරගෙන යන්න** — the next unread lesson with its chapter's
    artwork and how far through that chapter the learner is. First card in the
    rail: it is the one thing a returning learner came for.
  - **මගේ ඉගෙනීමේ ප්‍රගතිය** — ring, lessons done, lessons remaining, and
    three tiles: lessons, sections read, bookmarks.
  - **අද දින සංකල්පය** — one glossary term a day, picked from the reader's own
    date so it turns over at their midnight rather than at build time. Its
    Sinhala, Pāli, pronunciation, gloss and literal sense are the glossary
    entry; nothing is written for the card.
  - **යොමු මාතෘකා** — background topics, framed as background: no progress,
    no completion mark, and a line saying none of it is required.
- **Chapter artwork.** `Chapter.image` names a file the way `FigureBlock.src`
  does — without its locale segment — and `check:content` fails the build when
  it is missing. `public/images/<locale>/chapters/` currently holds four drawn
  SVG placeholders, one scene each; dropping real files over them is the whole
  swap. A chapter with no image gets a tinted numeral rather than a hole.
- The dashboard banner is a drawn night scene — moon, water, a seated figure,
  a bodhi branch — over three aurora washes, with the moon's halo on the shared
  `halo` keyframes so the global reduced-motion rule stops it dead.
- **`/chapters/[slug]`** — a real chapter page: overview, lessons, key points,
  practice and references as tabs, with progress, resume and the chapter's
  lesson list in a rail. Everything on it is derived from the lessons; nothing
  is authored twice.
- **`/practice`** — every quiz in the course, grouped by chapter, each linking
  to the section that asks it. It shows what has been answered, never whether
  the answer was right; there is no score anywhere in this course.
- **`/my-learning`, `/notes`, `/bookmarks`, `/settings`** — built from the
  learner's own stored state. Bookmarks separates what was deliberately saved
  from where reading stopped. Settings holds the theme and the one-click erase.
- **Study mode** on a lesson: hides both rails and widens the reading column.
- **Blog.** A `Post` model using the same `Section`/`Block` tree as lessons, so
  every interactive block works in a post, plus `/blog`, `/blog/[slug]` and
  validator coverage. No posts are published yet and the index says so.
- **Site search** (⌘K) over chapters, lessons, glossary terms and reference
  topics. The index is built on the server, so the content registry never
  reaches the browser.
- `src/lib/course.ts` — read-only derivations over the content registry, which
  is how the new pages exist without a second copy of the teaching.

### Changed

- **The image tree is one folder per subject, with the language in the file
  name.** `images/lessons/<slug>/x-si.png` sits beside `x-en.png`, instead of
  two parallel `images/si/…` and `images/en/…` trees that put the same diagram's
  two files as far apart as a tree allows. Content still names an image without
  the suffix; `figureSrc()` adds it, and `check:content` uses the same rule.
- **`image-inbox/` at the repo root** — drop artwork there under any name and
  ask for it to be placed. It is outside `public/`, so nothing unplaced ships.
- **The derivation block was redrawn.** Each step is now a card that reads left
  to right as one sentence in arithmetic — sum, arrow, answer — with the step
  number ghosted large behind it and the conclusion on its own jade band. Still
  nothing to click: hiding four of five steps behind a "next" button would turn
  a proof back into an assertion.
- **A quiz no longer carries a heading strip.** The question is the heading; a
  label above it saying "check yourself" only delayed reading the question.
- **Section headings no longer carry a Pāli subtitle.** The italic Latin line
  under a section's Sinhala title is gone from every lesson — nine of them. The
  Pāli is still the lookup key, still on the term card, still in the glossary
  and still in search; it is not a second title. Reference topics keep theirs.
- **A chapter's picture is the ground under both its heroes.** The artwork the
  dashboard cards carry now sits behind the chapter hero and behind every
  lesson hero in that chapter, under a scrim weighted to the side the text is
  on. A chapter with no artwork keeps its drawn horizon.
- **The lesson hero drops its "පාඩම 1 න් 3" counter.** The breadcrumb says 1.1
  and the heading repeats it; a third copy on one screen was noise. The
  progress strip, which answers the same question with more in it, moves left
  to sit under the rest of the hero's text rather than out on its own.
- **The lesson body is as wide as its hero.** It was capped at `max-w-3xl`
  inside a full-width column, so it had the hero's gap on the left and a much
  larger one on the right. Both sides now match the hero.
- **The lesson's hero, breadcrumb and body start on one line.** The hero is a
  card, so its text sat a padding step in from everything below it — three
  different left edges down one page. All three now take the same gutter, and
  the hero's own content fills the card instead of stopping at `max-w-3xl`, so
  the progress strip stays on the card's right edge when the rail folds and the
  column grows.
- **The rail fits without scrolling.** Spacing throughout it was tightened so
  all ten destinations, settings and the way back are reachable at a laptop's
  height; the scene at its foot is decoration and now appears only when the
  window is tall enough for it. A navigation rail that scrolls hides the thing
  it exists to show.
- **A lesson's hero carries its progress; the rail drops its objectives.**
  Chapter progress moved out of the side rail and into the lesson banner, next
  to "lesson 1 of 3" — the same fact at a coarser grain, and no longer stacked
  above the outline, which counts something else. "ඉගෙනුම් අරමුණු" is gone from
  the lesson; the chapter page still derives objectives from its lessons.
- **The lesson banner carries one description, not three.** It repeated the
  chapter's blurb under the chapter's name and the lesson's Pāli title under
  the subtitle — three lines of description above a heading nobody had read
  yet. Chapter name, lesson title, lesson subtitle; the chapter link now goes
  white on hover instead of dimming into the banner. Section headings keep
  their Pāli, and `lesson.pali` now feeds ⌘K search.
- **New palette: cool white, graphite, and one decisive blue.** Light is now
  the authored default and dark is a complete second palette rather than a
  filter. `sage` became `cobalt` (`#3563E9`); `jade`, `lotus`, `gold` and
  `rose` kept their names and were retuned to `#0F9D8A`, `#7C5CE7`, `#D18B0C`
  and `#DC4C4C`. Text runs `#111827` / `#374151` / `#64748B` / `#94A3B8`.
  80–90% of the interface is neutral: blue is for buttons, active navigation,
  links, selected states, progress and diagram emphasis, and nothing else.
- **Accent-ink tokens.** An accent used as *text* now takes `text-cobalt-ink`,
  `text-jade-ink` and so on, which flip with the theme. No single ramp step
  reads on both cool white and midnight, so the old `text-jade-300` on a card
  was invisible in one theme or the other.
- **The interface is Sinhala only.** The English gloss line under every label
  is gone, along with the `en` string layer, the `Bilingual` component and the
  Latin transliteration of the site's own name. It doubled the reading load on
  the readers this is written for. Pāli in Latin script stays — that is the
  language, not a gloss. `aria-label`s are Sinhala too.
- **A chapter page exists again, and the rule changed with it.** The old note
  forbidding one described a page that listed lessons and nothing else. This
  one carries the chapter's objectives, key points, questions and sources —
  all derived — so it is not a second copy of anything.
- `/chapters` rows now open the chapter rather than jumping straight into its
  first unread lesson, so the index can be used to see what is in the course.
- The lesson page moved its outline from a left rail to a right one, alongside
  chapter progress, objectives, a summary and the next lesson. `LessonRail` is
  now the outline alone; the chapter's other lessons live in the rail above it
  rather than being listed twice in one column.
- The 404 carries the public site's header and footer, which route-group
  layouts do not give it.
- **No decorative pull-quotes.** Lifting a lesson's cited quotation into a
  banner meant a reader met the same passage twice — once as chrome, once
  where the author put it — and the same line surfaced again on the chapter
  page and the dashboard. A quotation now appears where it was written into
  the teaching, exactly once.
- **Reading-time estimates are gone from the interface.** `durationMin` and
  `readingMin` stay in the content model; nothing renders them.
- **The learning path no longer scrolls by itself.** `scroll-snap-type: x
  mandatory` re-snapped whenever the container's layout settled, which the
  panel's entrance animation did on every load, so the strip slid forward with
  nobody touching it. It also fought keyboard scrolling. Two Tab-reachable
  arrow buttons replace it.
- **The search field's focus ring** was an offset rectangle floating over the
  dialog's rounded corner: Tailwind's `outline-none` sits in a cascade layer
  and could not beat the unlayered global `:focus-visible`. A `data-no-ring`
  opt-out moves the affordance to the field's row, where a reader perceives it.
- The progress card is four bands of equal padding separated by hairlines
  rather than four blocks with their own margins, which is why it collected a
  dead gap at the foot when a line of text was removed.

### Removed

- `LessonHero`, `LessonFooter`, `LessonCard`, `CourseHero`, `ChapterSpine` and
  `ReadState` — superseded by the banner, the breadcrumb trail and the rails.
- The English gloss layer (`en` in `strings.ts`), `Bilingual`, and the `.gloss`
  type style.
- **`/books` and the seven-treatises strip.** The treatises are taught inside
  lesson 01 and defined in the glossary; a third surface repeating them was a
  top-level destination for something that is a part of one lesson.
- **Featured chapters** on the dashboard — the learning path already is the
  chapters, in order, with progress on each.
- **The daily reflection card** and **recent lessons** on the dashboard.
- All reading-time readouts, and the `formatDuration`/`dayIndex` helpers and
  `allQuotes` collector that only they used.
- **මෙම පාඩමේ ප්‍රධාන යෙදුම්** from the foot of a lesson. Every one of those
  terms is already a chip in the prose above it, where it is met in context.
  `Lesson.keyTerms` stays in the model — the knowledge map is built from it.
- **Difficulty labels** (මූලික / මධ්‍යම / ගැඹුරු) from every surface: the path
  cards, the chapter index, the chapter hero, the lesson banner and the
  chapter's lesson list. `Lesson.difficulty` stays in the content model —
  nothing renders it. A tier told a learner how hard somebody else found the
  material, which is not something they can act on; the path cards now show
  **state** instead, which is.

### Fixed

- **The three දේශනා ක්‍රම were the wrong way round in පාඩම 1.3.** The Buddha
  gave සාරිපුත්ත the teaching **සංඛිත්ත** (by outline), and සාරිපුත්ත taught
  the 500 **නාතිවිත්ථාර නාතිසංඛිත්ත** (neither too brief nor too extensive) —
  which is the recension that came down to us. The flow had those two swapped;
  the lesson's own prose beside it had them right.
- **චාතුම්මහාරාජික පරමායුෂ was ten times too large.** 500 divine years is
  **9,000,000** human years (500 × 360 × 50), not 90 million — as `sadivya-loka`
  already published, and as the Tāvatiṃsa figure in the same table requires.
- **"විනාඩි 9" now says what unit it is in.** Nine *vinādikā* of the 60-horā
  reckoning is **3.6 modern minutes** — the figure the commentaries give, and
  the figure a 24-hour deva day arrives at independently. Same length of time,
  different units; the lesson now shows both rather than leaving a reader to
  meet "9" here and "3.6" elsewhere.
- **Term and reference cards are no longer clipped by tables.** They render in
  a portal and are positioned against the trigger's viewport rect, flipping
  above or below and clamping to the screen edge, so a chip inside a scrolling
  table or near the edge of a phone shows its whole card. Scrolling anything
  keeps the card attached to its word.

- **The glossary chip's card could not be reached.** It sat 10px above the
  chip with nothing bridging the gap, and the handlers were on the chip
  itself — so heading for "සම්පූර්ණ විස්තරය" crossed unowned space, fired
  `mouseleave`, and dismissed the card. The offset is now padding on a
  positioned sleeve inside the hover area, the handlers moved to the wrapper,
  closing is deferred a beat, and blur only closes when focus has actually
  left, so Tab reaches the link too. Escape closes it.
- `මබගේ ඉදිරි ගමන` → `මගේ ඉගෙනීමේ ප්‍රගතිය`. The heading was transcribed from
  a mockup with a typo in it.

### Note

- `community` and `resources` are named in the rail and ship as pages that say
  plainly they are not built. Nothing invents activity to fill a gap: no
  placeholder member counts, no stock avatars, no sample posts, and no
  notification bell or account avatar in the topbar, because there are no
  accounts and nothing to notify.
- No lesson currently uses a `reflect` block, so `/notes` and the chapter
  page's "think about this" card show their empty states until one does.
- The progress panel deliberately shows no **study-time** tile and no **day
  streak**, though both appear in the reference design. Time estimates were
  removed from the interface; a streak would mean recording which days someone
  opened the site in order to make them feel bad for missing one, and
  `CLAUDE.md` rules out scores, streaks and penalties.
- Chapter artwork is served from `public/`, not hotlinked from a stock-photo
  host. A remote image is a third-party request, and the footer promises there
  are none.

### Changed

- **The lesson page is rebuilt on one grid.** The header and the body now share
  the same two columns: the lesson number and its facts sit in the left column
  above the rail, the title and subtitle in the right column above the
  teaching. The title therefore begins on exactly the same vertical as the
  first sentence of the lesson. Previously the hero was left-aligned against
  the container while the body was indented past the rail, which put the title
  250px left of the text it introduced and made the page look assembled from
  two different layouts.
- **The header says what a lesson is without shouting.** The watermark numeral,
  the three coloured pills and the metadata chip row are gone. The number is
  now the one large element, the facts read as a spec list one per line, and
  difficulty is three ticks plus its name rather than a pill that told you
  nothing about relative depth. Objectives moved from a gradient panel into a
  plain surface card with jade checks.
- **The rail is two lists in the order they are wanted.** This lesson's
  sections come first, at a size Sinhala can actually be read at, with the
  active one on a filled pill. The rest of the chapter sits below it, quieter
  and more compact, so you can move lesson to lesson without going back out to
  `/chapters` — three navigations before this. The chapter is named there and
  `සියලු පරිච්ඡේද` closes it out.
- **The end of a lesson is hairlines and text.** Two ringed cards gave a
  backwards step the same weight as the next lesson; prev/next now carry their
  lesson numbers, and a neighbour in a different chapter says which.
- The lesson body sits in the `default` container rather than `wide`, so the
  measure no longer floats against 80rem of empty page.

### Added

- **Sources finally render.** The content model has carried `sources` from the
  start and the validator fails a published lesson without them, but the lesson
  player had only a comment where they should have been — no learner could see
  a citation. Lessons and reference topics both close with them now, and the
  block is demoed in `/lab`.
- **Lesson 01 rewritten** from the author's full study note, 3 sections to 8:
  the piṭaka structure, the sutta/abhidhamma contrast as a four-row table
  (pariyāya vs nippariyāya, sammuti vs paramattha, content, simile), the
  prescription simile with the Aṭṭhasālinī passage, the **four ultimate
  realities**, all **seven books** with what each one does, the śāsanic
  background, and why any of it is studied — the vipassanā/anattā payoff.
  Title is now ත්‍රිපිටකය සහ අභිධර්මයේ ස්ථානය; 16 → 24 minutes. The note's
  ශාසනික පසුබිම section is **not** here — where and when the Abhidhamma was
  taught is lesson 02, and Sāriputta passing it on is lesson 03. Lesson 01
  points forward instead of telling the same story twice; the one detail those
  lessons lacked (Sāriputta's exposition was *medium-length* — neither the
  summary he received nor the full deva-realm delivery) moved into lesson 03.
- **§1 බුද්ධ දේශනාවේ ව්‍යුහය is now an illustrated plate** rather than a
  generated partition diagram, in Sinhala and English. The `structure` block
  type stays available and demoed in `/lab`.
- **Chapter 01 de-duplicated.** Three things were being taught twice:
  - The **seven books** are now taught once, in lesson 01, with what each one
    does. Lesson 03's thinner one-line list is gone — its timeline still names
    them as a step in the transmission, which is that lesson's actual subject.
  - The **counts** of the four ultimate realities (52, 28, 89/121) left lesson
    01, which now only names the four. Lesson 04 owns the arithmetic — it has
    the 1 + 52 + 28 + 1 = 82 sum and the interactive table — and gained the
    "89, or 121 in the detailed classification" detail it was missing. This
    also removes a learner meeting 89 in lesson 01 and 82 in lesson 04 with
    nothing connecting them.
  - The **ශාසනික පසුබිම** section, as above.
- **12 glossary terms** the new lesson introduces: `vinaya`, `sutta`,
  `pariyaya`, `nippariyaya`, `paccaya`, and the seven books
  (`dhammasangani` … `patthana`). Definitions come from the author's note.
- **`figure`** — an authored image, with artwork **mirrored per language**.
  `public/images/si/…` and `public/images/en/…` hold the same file names;
  content names the path without the locale and `figureSrc()` resolves it, so
  call sites do not change when English arrives. `alt` is authored in the
  lesson, not baked into the file. `check:content` errors on a file missing
  from the authored locale and warns on a missing translation.
  Conventions in `public/images/README.md`.
- **Terms now read in Sinhala.** Every glossary entry carries a `si` form, and
  `[[pali:id]]` renders it — a learner meets **ත්‍රිපිටකය** in the prose and
  finds `tipiṭaka` on the term card. The Pāli remains the lookup key, and now
  sits under the Sinhala on the hover card, the `paliTerm` block and the
  glossary entry. The validator fails a term without a Sinhala form.
- **`structure`** — how a whole divides, as a static partition diagram.
  Nothing opens. Use `taxonomy` instead when counts have to add up.
- **`derivation`** — arithmetic shown whole, every step on screen at once, so
  a figure can be checked rather than accepted.
- **`timeline`** — a history read as one continuous line. Use `flow` instead
  when stepping through a sequence is itself the teaching.
- `Stagger` and `StaggerItem` accept `as`, so a staggered list can be a real
  `<ol>`/`<li>`.

### Changed

- **`speechSpeed` no longer asks the learner to type.** The phrase is authored
  (`sample`, now required) and stays on screen. An empty text box asked for an
  input before saying what the comparison was for, and the measured phrase is
  itself part of the teaching.
- **`deconstruct` breaks a recognisable object.** The viewport draws an actual
  silhouette — pot, leaf, water, body, picked with the new `shape` field — and
  fractures *that*, cutting finer at each stage, instead of scattering generic
  squares. The final stage still abandons the shape for the eight nodes and
  their gap, which is the point.
- **`summary` rebuilt**: numbered, on hairlines, with a jade edge, instead of a
  boxed run of bullets. A recap is returned to, so its points want to be
  findable as "the third one".
- **Lesson 01** uses `structure` for බුද්ධ දේශනාවේ ව්‍යුහය, and its recap is
  written as explained sentences rather than telegraphic fragments.
- **Lesson 02** derives the nine-minute figure with `derivation` — the
  assumptions are stated and the whole chain is visible.
- **Lesson 03** uses `timeline` for ඓතිහාසික ගලායාම, opens the නිර්මිත බුදුරුව
  section with plainer sentences, and adds explanation of the speech-rate
  arithmetic and how to read the pitaka table.
- **`/chapters` rebuilt top to bottom.** `CourseSpine` is replaced by
  `CourseHero` (what the course is, one action, the figures) and
  `ChapterSpine` (the chapters as one connected list).
  - **Chapter cards are now rows**, separated by hairlines. The whole row is
    the link, so the per-card saffron button is gone — the resume button in
    the hero is the only solid element on the page.
  - **Per-chapter progress moved into the chapter rows**, where the chapter is
    already named. The hero listing every chapter *and* the cards listing them
    again read as two tables of contents.
  - **A chapter row opens the first lesson in it that still has unread
    sections**, not always its first lesson.

### Removed

- **Lesson 01** — the සම්ප්‍රදායේ callout after the seven books. Its useful
  half (these are not to be memorised now) moved into the recap.
- **Lesson 03** — the rhetorical opening of නිර්මිත බුදුරුව, and the term
  නය මුඛය in both places it appeared. The section now says what was given
  rather than naming the method.
- **Lesson 04** — the සම්මුතිද, පරමාර්ථද sort exercise.
- **The Pāli name from the lesson header.** The title already names the lesson
  in Sinhala; a Latin-script line beneath it was a second name for the same
  thing. `lesson.pali` stays in the content model — it is simply not rendered
  there. The header is otherwise unchanged.
- `t.speech.typePhrase`, with the text input it labelled.

### Fixed

- **`rich()` now recurses into `**bold**` and `*italic*`.** A chip inside
  emphasis — `**[[pali:vinaya]]**` — rendered as the literal marker text
  instead of a chip, because the emphasis branches pushed their raw contents
  through unparsed. The same bug hit `` ` `` and links inside emphasis. The
  recursion terminates after one level: neither pattern allows `*` inside.
  A `/lab` case covers it now.
- **A `size: "wide"` figure no longer lands on the lesson rail.** It used
  negative margins on both sides; the lesson body sits beside a sticky rail, so
  the left one had nothing to take. Wide figures now grow to the right only,
  and only from `xl` up, where the grid actually has slack.
- Two garbled sentences in **lesson 04**: the මේසය key idea now says what
  Abhidhamma studies rather than trailing off, and "ඇදහීම විශ්වාසයෙන්" (which
  used two words for the same thing) is now "ඇදහීමේ සිට අවබෝධය දක්වා".
- **The dev server no longer serves a stale lesson after an edit.** Lesson and
  reference routes are statically generated, so the browser's client Router
  Cache reused prefetched payloads for up to five minutes — edit a lesson,
  navigate to it by link, see the copy from before the edit. Client-cache
  lifetimes are now zero in development. Production is unchanged.

### Added

- `npm run dev:fresh` — deletes `.next` and starts the dev server cold, for the
  rarer case where Turbopack's on-disk dev cache is the stale one.

---

## [0.6.2] — 2026-09-05

### Changed

- **Section headings rebuilt** and extracted into a shared `SectionHeading`
  component — lessons and reference topics were rendering the same markup
  twice, differing only in accent.
  - A **numbered rule** opens each section, so the page has a visible rhythm
    instead of headings floating in the column.
  - The section's **`brief`** now shows as a subtitle. It was carried in every
    section's data and used only in the side rail.
  - A **hover anchor** on each heading. Deep links (`#section-id`) already
    worked; there was no way to get one.
  - Section spacing loosened from `pb-16` to `pb-20`.
- Reference topics render the same heading in jade rather than saffron, so the
  off-course signal holds all the way down the page.

---

## [0.6.1] — 2026-09-05

### Changed

- **The lesson header reworked.** Beyond looking like something, it now does
  three jobs the old one left undone:
  - **Where you are** — the owning chapter as a breadcrumb, plus position dots
    showing this lesson's place within it.
  - **How far you have read** — a `4/6` badge and a progress hairline along the
    bottom edge, both from real reading progress.
  - **Key terms** — `keyTerms` was carried in every lesson's data and shown
    only on a card the learner may never have seen. It is in the header now.

  Also: an oversized ghost numeral behind the title, meta as chips rather than
  a plain row, and the objectives card given a gradient and check bullets.

---

## [0.6.0] — 2026-09-05

### Removed

- **The chapter landing page.** `/chapters/[slug]` only ever listed the
  chapter's lessons — a hop that told a learner nothing they could not get by
  starting. A chapter card now opens its **first lesson** directly, and the
  lesson rail plus prev/next carry them through.
- **The මූලාශ්‍ර sections** at the foot of every lesson and reference topic.
  The `sources` data stays in the content files as provenance — nothing is
  lost, it is simply not rendered.

### Added

- **A course spine on `/chapters`.** The four chapters as one connected path,
  filled by real reading progress, with a single button that **resumes where
  you left off** — which also puts back the one useful thing the chapter
  landing page did. Shows chapters, lessons and total study time.

### Fixed

- `formatDuration` emitted English **"min"** and **"hr"** on a Sinhala site.
  Units now come from `strings.ts` like every other piece of user-facing text.

---

## [0.5.1] — 2026-09-05

### Removed

- **All 12 quiz blocks** (ඔබම පරීක්ෂා කර බලන්න) — one from nearly every
  lesson. The `quiz` block type, its component and its `/lab` demo stay as
  available inventory, so any of them can be dropped back in one line.

### Changed

- **Five quiz explanations became callouts.** Seven only restated their
  surroundings and went with the quiz; five carried a clarification stated
  nowhere else in their lesson, and removing the quiz must not remove the
  teaching:
  - දෙව්ලොව සහ කාලය — it was not a question of capacity; humans simply
    cannot sit for ninety days, and the same teaching reached them later.
  - සම්මුතිය සහ පරමාර්ථය — the criterion is "can it be divided?", not
    "was it made by people". A stone is a convention too.
  - පරමාර්ථය හඳුනාගැනීම — a substance *is*; an action *happens*.
  - සිත යනු කුමක්ද — the sense faculties are doors, not roots.
  - චිත්තක්ෂණය — why matter *seems* stable: it changes slowly only
    relative to mind.
- වේගය සහ ආයුෂය split into two sections. Losing the planes, the world-system
  scales and then the quiz had left it as a single section, which made its
  progress rail degenerate.

---

## [0.5.0] — 2026-09-04

One view instead of two, and a place for background that is not Abhidhamma.

### Removed

- **The continuous-reading view.** `/chapters/[slug]/read` and every chapter's
  `reading` array are gone; the 15 reading sections all mirrored lessons, so
  nothing was lost. Two surfaces meant every correction had to be made twice,
  and asked learners to choose a route before they knew what was in it.
  Reading and doing now live together in the lessons. The validator errors if
  a chapter grows a `reading` field again.
- Chapter cards therefore carry **one** button, not two.

### Added

- **`/reference` — background topics.** Material a lesson names but does not
  carry. Reference topics reuse the `Section`/`Block` model so every block type
  works there, but carry no progress, no prerequisites and no lesson number,
  and render in jade rather than saffron so a learner knows they have stepped
  off the course.
- **`[[ref:slug]]` inline markup**, alongside `[[pali:id]]`. Renders a chip
  showing the topic's one-line summary on hover.
- **Eight reference topics** from the new cosmology notes: කාමාවචර ලෝක සහ
  භවචක්‍රය · සදිව්‍ය ලෝක 6 · අසුර · මනුෂ්‍ය · තිරිසන් · ප්‍රේත · නිරය ·
  තල 31 සහ ලෝක ධාතු. Includes the six deva realms with rulers, features
  and full lifespans, the four peta classes, and the eight great hells.

### Changed

- **Lessons slimmed to Abhidhamma.** Cosmology detail moved out and is now
  linked by name:
  - දෙව්ලොව සහ කාලය lost the realm-administration tree and the Tāvatiṃsa
    amenities table → [[ref:sadivya-loka]]. The time ratio and the reason the
    Abhidhamma was taught there stay.
  - වේගය සහ විශ්වයේ විශාලත්වය lost the 31 planes and the three world-system
    scales → [[ref:loka-dhatu]], and is now **වේගය සහ ආයුෂය** — the Dhanuggaha
    Sutta teaches anicca, and the catalogue was crowding it out.
- Navigation gains **යොමු**.
- Validator checks reference topics: unknown `[[ref:]]` targets, duplicate
  slugs, missing summary or category, `see` pointing at unknown topics,
  unregistered files, and summaries too long for the inline chip.

### Fixed

- `[[ref:]]` was parsed by the branch but missing from the tokeniser regex, so
  it rendered as raw text. Both `[[…]]` forms must precede the plain
  `[label](href)` alternative or the link pattern swallows their bracket.
- The realm detail a lesson pointed at was not actually in the reference topic
  it pointed to. A pointer to detail that is not there is worse than no
  pointer — the topic now carries what the lesson promises.

---

## [0.4.0] — 2026-09-04

Three new bodies of study notes folded in. The course doubles: two chapters
become four, five lessons become thirteen.

### Added

**Two new chapters**

- **03 — සිත සහ ක්ෂණිකත්වය** (4 lessons). Chapter 2 took matter apart;
  this takes apart the thing that did the taking-apart. Citta and citta-santati
  · the citta-kkhaṇa and the 17:1 ratio · the mind's variety, power and why it
  cannot see itself · santati-ghana.
- **04 — විශ්වයේ යථාර්ථය** (2 lessons). The Dhanuggaha Sutta's chain of
  speeds and the three world-system scales, then Rohitassa collapsing the whole
  search back into a fathom-long body.

**Two new lessons in the existing chapters**

- **පිටක තුන සහ අභිධර්මයේ තැන** now opens the course — the Vinaya/Dhamma
  split, the prescription-slip vs medical-science simile, the Aṭṭhasālinī on
  the ābhidhammika, and the seven books.
- **පරමාර්ථය හඳුනාගැනීම** — the hīnattha/paramattha test, the two rules,
  `parama + attha`, the corrected reading of `aviparīta`, paramatthas as
  actions rather than substances, and why one dhamma needs a hundred words.

**Three new block types**

- `ladder` — escalating comparison revealed one rung at a time. Built for the
  Dhanuggaha Sutta, where the final rung only lands once the earlier ones have
  exhausted the learner's sense of scale.
- `momentRatio` — one mind-moment, its three sub-moments, and seventeen of
  them running against a single materiality. The ratio is unfeelable as a
  numeral, so the learner steps or plays it.
- `spinWheel` — the firebrand (alāta-cakka). The learner moves the speed and
  watches separate points become one unbroken ring. Santati-ghana demonstrated
  rather than asserted; falls back to a static illustration under reduced
  motion.

**Glossary** grew from 36 to 54 terms — cittakkhaṇa, uppāda, ṭhiti, bhaṅga,
santati, santati-ghana, bhavaṅga, hadaya-vatthu, viññāṇa, hīnattha,
aviparīta, avinibbhoga, lokadhātu, vipassanā, and lobha/dosa/moha/phassa back
in Sinhala.

### Changed

- Lessons renumbered 1–13 across four chapters; files renamed to match. Slugs
  are unchanged, so existing progress is kept.
- Chapter 01 and 02 readings extended with the new material, and Chapter 01's
  transmission section corrected to match its lesson (Sāriputta, Anotatta, the
  500 monks at Jetavana, Mahāmāyā, ten thousand world-systems).

---

## [0.3.0] — 2026-09-04

Restructured into two chapters and simplified the navigation, on the author's
direction.

### Changed

- **Two chapters instead of one.** A new orientation chapter comes first:
  - **01 — අභිධර්මයට පිවිසුම**: දෙව්ලොව සහ කාලයේ සාපේක්ෂතාවය · අභිධර්මය
    ලොවට පැමිණි ගමන
  - **02 — පරමාර්ථ ධර්මයට පිවිසුම**: සම්මුතිය සහ පරමාර්ථය · ශුද්ධාෂ්ටකය ·
    පරිච්ඡේද අවකාශය

  Lessons renumbered accordingly; slugs unchanged, so existing progress is kept.

- **No standalone lessons index.** Two parallel tables of contents read as two
  different courses. `/lessons` is gone from the navigation and as a page;
  lessons are reached through their chapter, and a lesson's back-link now
  returns to the chapter that owns it.

- **Each chapter card offers exactly two ways in** — අන්තර්ක්‍රියාකාරී
  පාඩම් and පරිච්ඡේදය එකදිගට කියවන්න. The lesson list moved off the
  index and onto the chapter page, where the choice has already been made.

### Removed

- **ඉර සහ සඩ උපමාව** — from the lesson and from the chapter reading.
- **මෙනෙහි කරන්න** reflection prompts — from every lesson.
- **කාල ගණකය** — the interactive time calculator. The step-by-step
  derivation of the nine minutes stays; the section is now කාල අනුපාතය.
- **කැපුම් අනුකරණය** — the slicing simulator. The teaching it carried
  stays as prose, a key idea and a quiz; the section is now කැපෙන්නේ කුමක්ද?

  The `reflect`, `timeConverter` and `slicer` **block types remain available**
  and are still demonstrated in `/lab`. They were removed from this content,
  not deleted from the system, so any of them can be dropped back into a lesson
  in one line.

### Added — from the author's study notes

- Where and when it was taught: **7 වන වර්ෂයේ වස් කාලය**, **පාරිජාතක
  රුක් මුල**, **පාණ්ඩුකම්බල ශිලාසනය**.
- The mother-deva identified as **මහාමායා දේවිය**, and the audience as
  **දසදහසක් සක්වළින්** come.
- The missing transmission link: **සාරිපුත්ත හිමි → ජේතවනාරාමයේ
  භික්ෂූන් 500**, plus නය මුඛය and අනෝතත්ත විල.
- **ලක්ෂණය and ක්‍රියාව** given separately for each of the four great
  elements, rather than a single blurred description.
- **අවිනිබ්භෝග උපාදාය රූප** as the technical name for the four inseparable
  derived materialities, and **ආකාශ ධාතුව** for pariccheda-ākāsa.
- A modern-science comparison table: smallest unit, time dilation, and the
  scale of the universe.
- Richer dominance examples (ගල්, පස්, ලී, යකඩ, දියමන්ති · ජලය, තෙල්, යුෂ ·
  හිරු එළිය · කුණාටු).

---

## [0.2.0] — 2026-09-04

The site becomes Sinhala, gains a chapter layer, and ships its first real
teaching content.

### Added

**Chapter 01 — පරමාර්ථ ධර්මයට පිවිසුම**

Five lessons, from the teacher's seven modules:

1. `sammuti-paramattha` — conventional vs ultimate truth, the 82 paramatthas
2. `devlova-kalaya` — the first two deva realms and the time ratio
3. `abhidharma-gamana` — transmission, from Tāvatiṃsa to the printed book
4. `suddhashtakaya` — the eight inseparable material realities
5. `pariccheda-avakasaya` — the gap between octads, and elemental dominance

**Chapters**

- `Chapter` type grouping lessons that came from one body of teaching.
- `/chapters` index and per-chapter landing page.
- **Continuous-reading mode** (`/chapters/[slug]/read`) — the whole talk end to
  end for readers who do not want to stop at every simulator. Same renderer,
  different content.

**Eight interactive block types**

- `deconstruct` — break a conventional object down stage by stage until it
  stops. Four objects all bottom out in the same place, which is the point.
- `octad` — the suddhaṭṭhaka as a ring of eight with a zoom ladder from the
  universe down. Zero animation stagger, because they arise simultaneously.
- `timeConverter` — two-realm time ratio with twin clocks; `minutesPerRealmDay`
  is explicit so a teaching's own day-length is honoured rather than assumed.
- `elementMixer` — four sliders normalised to 100; raising one lowers the
  others, and the material changes as dominance shifts.
- `slicer` — cutting simulator that never divides a node. The blade travels
  the gap; the animation is the argument.
- `speechSpeed` — relative speech rates, typed phrase, live comparison.
- `hierarchy` — realm/office tree with an inspectable card per tier.
- `paramatthaTable` — the 82 as a periodic table, unlocking from real reading
  progress. Locked cells stay visible.

**Sinhala**

- All interface text moved to `src/lib/strings.ts` — one file to translate.
- Noto Sans Sinhala (body) and Noto Serif Sinhala (display) added behind the
  Latin faces, so each script resolves per glyph to the face made for it.
- `prose-dhamma` leading raised to 2.0; Sinhala stacks marks above and below
  the baseline and collides at Latin leading.
- `si-heading` / `si-tight` utilities replace uppercase + wide tracking, which
  do nothing for a script with no letter case.
- Glossary rewritten in Sinhala and extended to 36 terms.

**Validation**

- Chapter checks: unknown lesson slugs, a lesson claimed by two chapters, a
  lesson in none (warning), duplicate reading-section ids.
- Per-block invariants for all eight new types — octad must have exactly 4+4,
  mixer shares must total 100, `paramatthaTable` cells cannot exceed the group
  count or reference an unknown unlocking lesson, and so on.
- Content files are now discovered from disk, so a lesson file that exists but
  is not registered in `index.ts` fails the check.
- The component lab is scanned for stale glossary references.

### Fixed

- Time ratios now follow the talk's own arithmetic — a **360-day year**
  (100 years = 36,000 days) and a **60-hour** Tāvatiṃsa day. Using 365-day
  years gave 8.88 minutes for the rains retreat instead of the taught **9**.
  The derivation is shown in the widget so it can be checked.

---

## [0.1.0] — 2026-09-04

First working foundation. No lesson content yet — the machinery that will
present it.

### Added

**Content system**

- Typed lesson content model (`src/lib/types.ts`). A lesson is data, never JSX:
  a tree of discriminated-union blocks rendered by a shared component set.
- 16 block types: `prose`, `heading`, `keyIdea`, `callout`, `paliTerm`,
  `quote`, `list`, `comparison`, `table`, `summary`, `divider`, `flow`,
  `taxonomy`, `quiz`, `sortGame`, `reflect`.
- Inline markup parser (`src/lib/richtext.tsx`) supporting `**bold**`,
  `*italic*`, `` `code` ``, `[label](href)` and `[[pali:id]]` glossary chips.
  Deliberately not markdown — five constructs, no raw HTML.
- Lesson registry with ordering, draft/published status, prerequisites and
  neighbour navigation.
- Content validator (`npm run check:content`): catches broken glossary
  references, duplicate ids, taxonomy counts that do not sum, quizzes without
  exactly one correct answer, published lessons missing sources, and malformed
  tables. Runs automatically before every build.

**Interactive blocks**

- `taxonomy` — expandable classification tree with counts that roll up from the
  leaves, built for the enumerations Abhidhamma is made of.
- `flow` — step-through process walkthrough with optional autoplay, built for
  the citta-vīthi.
- `quiz` — commit-then-explain comprehension check. No score, no streak.
- `sortGame` — tap-to-place categorisation exercise with per-item hints on
  wrong answers.
- `reflect` — open reflection prompt with debounced autosave to the learner's
  own device.

**Course surfaces**

- Landing page with an ambient generative hero.
- Lesson index with per-lesson progress state.
- Lesson player: scroll-spy rail, scroll-linked progress bar, automatic section
  completion, mobile section sheet, objectives panel, source citations, and
  previous/next navigation.
- Searchable glossary, diacritic-insensitive — typing `panna` finds `paññā`.
  Seeded with 31 core Theravāda Abhidhamma terms.
- `/lab` — live gallery of every block type, doubling as authoring reference.
  Not indexed.
- About page including a one-click wipe of all stored learner data.
- 404 page.

**Design system**

- Token-driven theme in `globals.css`: semantic surfaces and ink, plus saffron /
  jade / lotus / rose brand ramps.
- Light and dark themes, applied before first paint so there is no colour flash.
- Three-face type system — Fraunces (display), Inter (UI/body), Noto Serif
  (Pāli only, chosen for guaranteed Latin Extended Additional coverage so
  diacritics never fall back mid-word).
- `Reveal` / `Stagger` motion primitives; every animated component honours
  `prefers-reduced-motion`.

**Learner state**

- Zustand store persisted to `localStorage`: section completion, bookmarks,
  quiz answers, reflections, theme. Nothing is uploaded; there is no account
  and no analytics.
- `useHydrated()` via `useSyncExternalStore` so persisted state never causes a
  hydration mismatch.

**Project**

- Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind v4.
- `CLAUDE.md` operating rules; `docs/` covering architecture, design system,
  lesson authoring and content integrity.
- `npm run check` gate: content validation, typecheck and lint.

### Notes

- All routes prerender statically.
- No lessons are published yet, so the lesson index and landing page render
  their empty states by design.
