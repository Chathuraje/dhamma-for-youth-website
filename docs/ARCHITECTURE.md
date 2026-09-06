# Architecture

Why the pieces are shaped the way they are.

---

## The central decision: content as data

A lesson is a `Lesson` object — a tree of typed blocks — not a React component.
`BlockRenderer` maps each block to a component.

```
lesson file (data)  →  BlockRenderer (switch)  →  block components  →  DOM
```

This costs some expressiveness. What it buys:

- **Consistency by construction.** Two lessons cannot drift apart visually
  because neither controls its own presentation.
- **Leverage.** Improving `Taxonomy` improves every lesson that uses one.
- **Validation.** Data can be checked; JSX cannot. `check-content.mjs` catches
  broken glossary references, mis-summed enumerations, quizzes with no correct
  answer.
- **A lower authoring bar.** Writing a lesson requires no React.

The escape hatch is deliberately closed: if a lesson needs something the block
types cannot express, the fix is a new block type, not inline JSX.

### Exhaustiveness

`Block` is a discriminated union and `BlockRenderer`'s default branch assigns to
`never`. Add a union member without a matching `case` and the typecheck fails.
That is the mechanism that makes adding block types safe.

---

## Rendering strategy

Every route prerenders statically. Lessons are compiled into the bundle, so
there is no database, no CMS and no request-time work.

The client boundary is kept deliberately low:

- Lesson **content** renders on the server, including the static blocks.
- Only genuinely interactive pieces are client components — `Flow`, `Taxonomy`,
  `Quiz`, `SortGame`, `Reflect`, `PaliChip`, and the shells that need browser
  APIs.

`LessonRail` is the pattern worth copying. The lesson page renders its sections
as server components with `id="section-<id>"`. The rail is a thin client
controller that *observes* those elements — scroll spy, progress, navigation —
without owning them. A long lesson therefore ships almost no JavaScript for its
prose.

```
LessonPage (server)
├── LessonBanner (server)
├── sections (server)
│   └── BlockRenderer (server)
│       ├── Prose, Quote, Table… (server)
│       └── Flow, Quiz, SortGame… (client islands)
└── aside
    ├── LessonChapterProgress (client)  ← reads the learner's store
    └── LessonRail (client)             ← observes the DOM above, owns none of it
```

`AppShell` applies the same idea one level up. It is a client component — the
rail highlights the current route, the topbar owns the search dialog — but it
takes `children` as a prop, so every page inside it stays a server component
and the content registry never crosses the boundary.

The same discipline governs the data those client components need. Anything
derived from content is resolved on the server in `src/lib/course.ts` and
handed down as plain data: `ChapterSummary` for a card, `PersonLesson` for the
learner's pages, `SearchRow[]` for ⌘K. A client component that imported
`@/content/lessons` directly would pull all thirteen lessons into the browser
to render four titles.

---

## Two route groups

`src/app` splits in two, and which group a route belongs to is the first
decision when adding one.

```
app/
  layout.tsx     html, fonts, theme script — no chrome of its own
  (site)/        header + footer     — home, about, blog, contact
  (app)/         AppShell            — the course and the learner's own pages
```

**The rule:** a page *about* the project is `(site)`. The course, or anything
built from the learner's stored state, is `(app)`. The one door between them is
the **Open Dashboard** button in the site header; the foot of the rail has the
way back.

This is a structural split, not a styling one. `(app)` pages never import the
marketing header and `(site)` pages never import the shell — hiding chrome with
CSS instead of choosing a group is exactly what the split prevents.

The rail folds. `railCollapsed` lives in the progress store, so the learner's
choice is remembered and both `AppShell` (which owns the page's left padding)
and `Sidebar` read the same value; it is gated on hydration, since the server
cannot know it and rendering the folded rail first would shift the page. Folded
it is a 4.5rem strip of icons with their labels as tooltips. Expanded, it is
sized to fit every destination without scrolling — a navigation rail that
scrolls hides the thing it exists to show.

The root `not-found.tsx` sits outside both, so it renders the site header and
footer itself. Route-group layouts do not wrap it.

---

## Learner state

`src/lib/progress.ts` — a Zustand store persisted to `localStorage`.

Stored: section completion, per-lesson bookmark, quiz answers, reflections,
theme. Keys for per-block state are `${lessonSlug}:${sectionId}:${blockIndex}`.

**Nothing is transmitted.** No account, no server persistence, no analytics.
This is a product decision, not an unfinished feature: a reflection box people
do not trust is a reflection box people do not use. The trade-off — progress is
per-device and dies with browser data — is stated plainly on the About page.

### Hydration

Anything rendering persisted state must gate on `useHydrated()`, which is built
on `useSyncExternalStore` (server snapshot `false`, client snapshot `true`).
Without the gate, the server renders "0 of 8 complete" and the client renders
"5 of 8", and React throws a hydration mismatch.

### Section completion

Sections complete automatically when their bottom scrolls above the middle of
the viewport — the learner has demonstrably read past them. The last section
completes at the bottom of the page, since nothing follows it to scroll past.
There is no "mark as done" button because nobody presses them.

---

## Theming

Semantic tokens in `globals.css` `@theme` describe the **light** theme, which
is the authored default. `:root[data-theme="dark"]` redefines the semantic
layer *and* every brand ramp — no single lightness reads on both cool white and
midnight, so dark is a complete second palette rather than a filter.

Accents used as text take their own `-ink` tokens (`text-cobalt-ink`,
`text-jade-ink`, …), which flip with the theme; the ramps stay put for fills
and rings. The sidebar has its own `rail-*` tokens and stays midnight in both
themes.

The palette is deliberately restrained: graphite and slate carry the text, and
`cobalt` appears only where the learner can act — buttons, active navigation,
links, selected states, progress, diagram emphasis. See DESIGN-SYSTEM.md.

An inline script in `<head>` (`themeInitScript`) reads the persisted theme and
stamps `data-theme` before first paint, so there is no flash. `ThemeSync` keeps
the attribute in step with the store afterwards.

The script parses the same `localStorage` key the store persists to. **If that
key changes in `progress.ts`, change it in `Theme.tsx` too** — they are coupled
by necessity, and the coupling is commented in both places.

---

## Pāli typography

Three faces, and the third one earns its place:

- **Fraunces** — display
- **Inter** — UI and body
- **Noto Serif** — Pāli only

Pāli needs Latin Extended Additional (ṃ ṭ ḍ ṇ ḷ at U+1E00–U+1EFF). A face
missing those falls back per-glyph, so a single word renders in two fonts.
Noto Serif covers the range completely. Pāli is also tagged `lang="pi"` for
screen readers and hyphenation.

Glossary search normalises with NFD and strips combining marks, so `panna`
finds `paññā`.

---

## Validation

`scripts/check-content.mjs` runs on Node's native TypeScript stripping — no
build step, no extra dependency. This is why **content files may only import
`@/…` as `import type`**: type imports are erased, but Node cannot resolve the
path alias at runtime.

It runs as `prebuild`, so invalid content cannot ship.

---

## Directory map

```
src/
  app/
    (site)/               public site; header + footer
    (app)/                learning app; the dashboard shell
                          page-specific client components live beside their
                          page (e.g. glossary/GlossaryBrowser.tsx)
  components/
    app/                  the shell: rail, topbar, search, page furniture
    app/dashboard/        the dashboard's own widgets
    chapter/              chapter hero, tabs, rails, index
    lesson/               lesson banner, outline rail, Pāli chips
    lesson/blocks/        one file per interactive block family
    motion/               Reveal / Stagger
    site/                 header, footer, theme
    ui/                   design-system components
    visuals/              decorative graphics (always aria-hidden)
  content/                lessons, chapters, reference, blog, glossary — the data
  lib/
    course.ts             read-only derivations over the content registry
    search.ts             the ⌘K index, built on the server
    …                     types, richtext, progress, utils, site config
scripts/                  validator
docs/                     this
```

Rule of thumb: a component used by one page lives beside that page; a component
used by two lives in `src/components/`.

---

## Derived pages

`/dashboard`, `/practice` and the chapter page's tabs render content nobody
authored twice. `src/lib/course.ts` walks the lessons and arranges what is
already there: the practice index comes from every `quiz` block, a chapter's
key points from its `keyIdea` blocks, its objectives from its lessons'.

The invariant: **a derived page never introduces a fact.** If one needs
something, the something goes into a lesson or the glossary and the page reads
it. That is what keeps a second surface from drifting away from the first —
the failure that killed the per-chapter `reading` array.

The corollary, learned the hard way: **deriving is not the same as repeating.**
An early version lifted a lesson's cited quotation into the lesson banner, the
chapter hero and the dashboard, so a reader met the same passage four times.
A quotation belongs where the author wrote it, once. Derive structure —
counts, objectives, questions, progress — not prose.

---

## Sections that are not built

`community` and `resources` are in the rail and have real pages saying plainly
that they are not finished. Nothing on this site invents activity to fill a
gap: no placeholder member counts, no stock avatars, no sample posts. The
topbar carries no notification bell and no account avatar for the same reason —
there are no accounts and nothing to notify about.

The blog ships the same way: the model, the routes and the validation exist;
the registry is empty and the index says so.

---

## Reference topics

`src/content/reference/` holds background a lesson names but does not carry —
cosmology, most obviously. It exists so a lesson can say "this was taught in
Tāvatiṃsa" without turning into a catalogue of deva realms, and so that
background can grow indefinitely without diluting the course.

Reference topics reuse the `Section`/`Block` model, so every block type works
there. What they deliberately lack is course machinery: no lesson number, no
prerequisites, no progress claim. They render in jade rather than cobalt so a
learner knows they have stepped off the path.

Content links them with `[[ref:slug]]`, parsed by the same tiny inline parser
that handles `[[pali:id]]`. The validator resolves both, so a renamed topic
fails the build rather than silently degrading to plain text.

Clicking one opens the topic in an overlay rather than navigating
(`ReferenceViewer` in the root layout, driven by the `reference-view` store).
Every route into a topic goes through `ReferenceLink`, which renders a real
`<a href="/reference/…">` and intercepts only the plain left click — so a
modified click still opens the page in a new tab and the URL stays copyable.
Sending a reader to a full page for a footnote costs them the paragraph they
were mid-way through; the overlay renders the same sections, the same blocks
and the same citations, keyed to the same `__ref:<slug>` progress ids as the
page, and closing puts them back in the sentence they left. The page still
exists and the overlay's foot links to it. The dialog is loaded on demand — it
pulls in the whole block library, and most readers never open a reference.

### One view, not two

An earlier version gave each chapter a parallel `reading` array: the same
teaching as continuous prose at `/chapters/[slug]/read`. It was removed.

Two surfaces meant every correction had to be made twice — and they did drift,
which is exactly the failure a course about precision cannot afford. It also
asked learners to choose a route before they knew what was in it. Lessons now
carry the reading and the interaction together, and the validator errors if a
chapter grows a `reading` field again.
