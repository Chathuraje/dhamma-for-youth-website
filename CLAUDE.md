# CLAUDE.md

Operating rules for working on **Abhidhamma Atlas**. Read this before changing anything.

---

## 1. What this project is

An interactive web course teaching Theravāda Abhidhamma, lesson by lesson.

The user supplies the teaching content. Claude builds the machinery that makes
it interactive: components, layout, animation, structure.

**This is not a content website with a nice theme.** The intended experience is
that a learner *does* something in every lesson — opens a classification tree,
steps through a cognitive process, sorts items into categories, commits to an
answer before seeing the explanation. If a lesson could have been a PDF, the
build has failed.

### The division of labour

| The user owns | Claude owns |
| --- | --- |
| What is taught, and how it is framed | How it is presented and interacted with |
| Doctrinal accuracy and interpretation | Structure, components, code quality |
| Which Pāli terms matter | Type safety, accessibility, performance |
| Lesson sequence and pacing | Making the above invisible to the learner |

### Language

**The site is authored in Sinhala.** Pāli terms stay in Latin script with full
diacritics.

- **All interface text lives in `src/lib/strings.ts`.** Never hardcode a
  user-facing string in a component. That file is the whole translation
  surface; when English is added it becomes `strings.si.ts` / `strings.en.ts`
  behind a locale switch and no call site changes.
- **The interface is Sinhala only.** No English glosses, no second lines, no
  Latin transliteration of the site's own name. An earlier build paired every
  label with a smaller English line; it doubled the reading load on the very
  readers this is written for and made the chrome louder than the teaching.
  Pāli in Latin script is not a gloss — that is the language, and it stays.
- Lesson *content* is authored per language in `src/content/`.
- Sinhala typography is not Latin typography — see §6.

---

## 2. Commands

```bash
npm run dev            # dev server (Turbopack)
npm run build          # production build — runs check:content first
npm run check          # content + types + lint. Run this before saying "done"
npm run check:content  # validate lessons & glossary
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
```

`npm run check` is the gate. Do not report work as finished without it passing.

---

## 3. Where things live

The app is split into **two route groups**, and which one a page belongs to is
the first decision when adding a route.

```
src/
  app/
    layout.tsx              html/body, fonts, theme — no chrome of its own
    not-found.tsx           root 404 (carries the site header itself)
    (site)/                 THE PUBLIC SITE — header + footer
      page.tsx              home
      about/  contact/      what this is, how to reach us
      blog/  blog/[slug]/   writing that is not part of the course
    (app)/                  THE LEARNING APP — sidebar rail + topbar
      layout.tsx            AppShell, and builds the search index
      dashboard/            where a learner lands
      chapters/             chapter index
      chapters/[slug]/      chapter page (overview / lessons / key points / …)
      lessons/[slug]/       the lesson player
      books/                the seven treatises, rendered from the glossary
      practice/             every quiz in the course, indexed
      reference/            background topics ([[ref:slug]] links land here)
      glossary/             searchable term reference
      my-learning/ notes/ bookmarks/   built from the learner's own store
      settings/             theme + erase my data
      community/ resources/ named, not yet built — honest empty pages
      lab/                  live gallery of every block type (noindex)
  components/
    app/                    the dashboard shell: rail, topbar, search, panels
    app/dashboard/          the dashboard's own widgets
    chapter/                chapter hero, tabs, rails, index
    lesson/                 lesson banner, outline rail, Pāli chips
    lesson/blocks/          one file per interactive block family
    motion/                 Reveal / Stagger — the shared animation primitives
    site/                   header, footer, theme
    ui/                     buttons, cards, Bilingual, Panel, tokens-as-code
    visuals/                decorative ambient graphics
  content/
    glossary.ts             all Pāli term definitions
    chapters/index.ts       chapter registry
    chapters/NN-slug.ts     one file per chapter
    reference/index.ts      background-topic registry
    reference/<slug>.ts     topics lessons link to but do not carry
    lessons/index.ts        lesson registry
    lessons/NN-slug.ts      one file per lesson
    blog/index.ts           post registry (empty until something is written)
    blog/<slug>.ts          one file per post
  lib/
    types.ts                THE CONTENT MODEL — read this first
    strings.ts              ALL user-facing UI text (`t`) + English gloss (`en`)
    course.ts               read-only derivations over the content registry
    search.ts               the ⌘K index, built on the server
    richtext.tsx            inline markup parser
    progress.ts             learner state (localStorage, zustand)
    site.ts                 brand config + both navs — rename the site here
scripts/check-content.mjs   content validator
docs/                       deeper reference
```

**The rule for the split:** if the page is *about* the project, it is `(site)`.
If it is the course or the learner's own state, it is `(app)`. The one door
between them is the **Open Dashboard** button in the site header; the rail's
foot has the way back.

`(app)` pages never import the marketing header, and `(site)` pages never
import the shell. Hiding chrome with CSS instead of choosing a group is what
this split exists to prevent.

---

## 4. The rule that matters most: lessons are data

A lesson is a `Lesson` object in `src/content/lessons/`. **Never write JSX in a
lesson file.** Content is a tree of typed blocks; `BlockRenderer` turns blocks
into components.

Why this is non-negotiable:

- Every lesson stays visually consistent without effort.
- Improving a component improves every lesson at once.
- Content is validated, searchable and analysable; JSX is not.
- The user can write and edit lessons without reading React.

**If a lesson needs something the block types cannot express, add a block
type.** Do not escape-hatch into JSX.

### Adding a block type — three steps

1. Add the interface to `Block` in `src/lib/types.ts`.
2. Add the component (`src/components/lesson/blocks/`) and a `case` in
   `BlockRenderer`.
3. Add an example to `src/app/(app)/lab/page.tsx`.

The `default: never` branch in `BlockRenderer` fails the typecheck if you skip
step 2, which is deliberate.

Add validation to `scripts/check-content.mjs` if the block has invariants that
types cannot express (ids matching, counts summing, exactly one correct answer).

Full guide: [`docs/LESSON-AUTHORING.md`](docs/LESSON-AUTHORING.md).

### Chapters

A **chapter** groups the lessons that came out of one body of teaching.

**There is exactly one copy of the teaching.** Reading and doing live together
in the lessons. An earlier version carried a parallel continuous-reading copy
of each chapter; it meant every change had to be made twice and forced learners
to pick a route before they knew what was in it. Do not reintroduce it — the
validator errors if a chapter grows a `reading` field again.

`/chapters/[slug]` **is** a chapter page, and it earns its place: overview,
lessons, key points, practice and references, with progress and the resume
action in the rail. An older note in this file forbade one, because the version
it described listed lessons and nothing else. Everything the page shows is
*derived* from the lessons — objectives, key ideas, questions, sources — so it
is not a second copy of anything. **Keep it that way.** If a chapter page ever
needs prose of its own, that prose belongs in a lesson.

Every lesson should belong to exactly one chapter. The validator warns when one
belongs to none and errors when two claim the same lesson.

### Reference topics — background, not course

`src/content/reference/` holds material a lesson **names but does not carry**.

The rule: **if it is Abhidhamma, it belongs in a lesson; if a lesson merely
needs to name it, it belongs in reference.** Cosmology is the clear case — a
lesson says the Abhidhamma was taught in Tāvatiṃsa and links the name, rather
than becoming a catalogue of deva realms.

- Link from content with `[[ref:slug]]`. It renders as a chip that shows the
  topic's `summary` on hover and **opens the whole topic in an overlay** when
  clicked — a footnote should not cost a reader their place in the lesson.
- **Every route into a reference topic goes through `ReferenceLink`** — the
  chip, the `/reference` cards, the dashboard strip, the overlay's own related
  list. It is a real `<a href>` whose plain left click is intercepted, so
  ⌘-click still opens the page and the URL is still copyable. The topic keeps
  its page; search results and the overlay's foot go there.
- Ordinary links are unchanged: a post, a resource or anything external is a
  destination, and destinations navigate.
- Reference topics carry no progress, no prerequisites, no lesson number, and
  are keyed to jade rather than cobalt so a learner knows they have stepped
  off the course.
- They use the same `Section`/`Block` model, so every block type works there.
- **If a lesson links a topic, that topic must actually contain what the lesson
  says it contains.** A pointer to detail that is not there is worse than no
  pointer.
- Several related topics may live in one file (the four lower realms do); the
  validator collects every exported topic per file.

**There is no standalone lessons index, and there must not be one.** Two
parallel tables of contents read as two different courses. Lessons are reached
only through their chapter:

- `/dashboard` — where a learner lands. Progress, the path, the chapters, what
  they last read. Its one primary action resumes the first lesson with unread
  sections.
- `/chapters` — the chapters as one connected list, each row opening that
  chapter's page.
- `/chapters/[slug]` — the chapter. Its rail resumes the first lesson with
  unread sections, and lists every lesson in the chapter.
- `/lessons/[slug]` — the lesson player.
- `/reference` and `/reference/[slug]` — background topics, outside the course.

A lesson's breadcrumb returns to its owning chapter, never to a lesson list.

---

### Derived pages

`/dashboard`, `/practice` and the chapter page's tabs render content nobody
authored twice: they read the lessons and the glossary through
`src/lib/course.ts` and arrange what is already there. The dashboard's
knowledge map is each lesson's first `keyTerms` entry; its concept of the day
is a glossary entry; its background strip is the reference registry.

Keep it that way. If one of those pages needs a fact, the fact goes into a
lesson or the glossary and the page reads it — never into the page.

**Deriving is not repeating.** An early version lifted a lesson's cited
quotation into the lesson banner, the chapter hero and the dashboard, so a
reader met the same passage four times. Derive *structure* — counts,
objectives, questions, progress, a term's own gloss. Do not re-print prose
somewhere the author did not put it.

### Never dress an empty room

`community` and `resources` are named in the rail and have real pages that say,
plainly, that they are not built yet. That is the pattern for anything not
finished: **name it, and say so.** Placeholder member counts, stock avatars,
sample posts and fake activity feeds are the first untrue things a site grows,
and this one cannot afford any. The topbar carries no notification bell and no
account avatar for the same reason — there are no accounts and nothing to
notify.

---

## 5. Content integrity

This is a religious teaching. Getting it wrong is worse than getting it ugly.

- **Never invent doctrine, term definitions, numbers or citations.** If the
  user's material does not cover something and it is needed, ask — do not fill
  the gap from general knowledge and present it as taught content.
- **Never silently "improve" the user's teaching.** Rephrasing for the web is
  fine; changing what is claimed is not. If something looks like an error, say
  so rather than fixing it quietly.
- Enumerations (89 cittas, 52 cetasikas, 28 rūpas) are load-bearing. The
  validator checks that taxonomy counts sum correctly — do not paper over a
  mismatch by editing the stated total.
- Published lessons must cite sources. The validator enforces this.
- Where teachers read a point differently, say so in the lesson rather than
  picking a side silently.

Details: [`docs/CONTENT-INTEGRITY.md`](docs/CONTENT-INTEGRITY.md).

### Pāli

- Always correctly diacriticked in user-facing text: `paññā`, `bhavaṅga`, `rūpa`.
- Glossary `id`s are plain ASCII (`panna`, `bhavanga`) — that is the lookup key.
- Wrap Pāli in `<Pali>` or the `font-pali` class, and tag `lang="pi"`.
- Every Pāli term a learner meets must be defined. Use `[[pali:id]]` in copy;
  the validator fails the build on an unknown id.

---

## 6. Design

Full reference: [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md). The short
version:

- **Tokens only.** Colours come from `src/app/globals.css` `@theme`. Never
  write a raw hex value in a component; never use Tailwind's stock palette
  (`bg-slate-800`, `text-gray-400`). If you need a colour that does not exist,
  add a token.
- Semantic ground: `bg-canvas` (the page), `bg-surface` / `-2` / `-3` (cards),
  `text-ink` / `-dim` / `-faint` / `-mute`, `ring-line` / `border-line-soft`.
- Brand accents: **`cobalt`** (primary blue), `jade` (insight/correct, a teal),
  `lotus` (practice/interaction, a violet), `gold` (tradition — quotation,
  canon, commentary), `rose` (caution/wrong).
- **Blue is not a decoration.** 80–90% of the interface is graphite and slate.
  `cobalt` is for buttons, active navigation, links, selected states, progress,
  and emphasis inside a diagram — and nothing else. A heading is `text-ink`,
  body copy is `text-ink-dim`, a caption is `text-ink-faint`. If you find
  yourself colouring a label blue, it is a label; leave it graphite.
- Diagram registers, fixed: **citta → cobalt, cetasika → jade, rūpa → lotus.**
  That is what the `accent` field on `FlowBlock` and friends selects.
- **Light is the authored default**; `:root[data-theme="dark"]` flips the
  semantic tokens *and* re-declares every brand ramp. Any new token must be
  defined for both.
- **An accent used as text takes the `-ink` token, not a ramp step.**
  `text-cobalt-ink`, `text-jade-ink`, `text-gold-ink`, `text-lotus-ink`,
  `text-rose-ink` flip with the theme, because no single ramp step reads on
  both cool white and midnight. Use a ramp step (`bg-cobalt-500`, `ring-jade-500/30`)
  only where the element sets its own background — and pair a filled brand
  surface with `text-on-brand`.
- The sidebar is midnight in **both** themes and has its own ink tokens
  (`bg-rail`, `text-rail-ink`, `border-rail-line`). It is the fixed point a
  learner navigates by; flipping it with the theme makes the app feel like two
  products.
- **The rail never scrolls to reach a destination.** It folds to a strip of
  icons (`railCollapsed` in the progress store, remembered), and everything in
  it is sized so all ten destinations, settings and the way back fit at a
  laptop's height. Anything decorative at its foot appears only when there is
  room. Adding a rail item means checking it still fits.
- Cards sit on cool white, so they take `shadow-card` and a real
  `ring-1 ring-line` edge. The heavy glows that read as depth on black read as
  dirt on paper.
- **Ramp names never collide with Tailwind's stock palette**, on purpose. If
  the primary were `blue-500`, a typo like `bg-blue-50` would silently resolve
  to Tailwind's own blue and pass review. Keep it that way when adding a ramp.
- Type stacks put the Latin face first and the Sinhala face second. Browsers
  resolve per glyph, so each script gets the face made for it with no markup:
  `font-display` = Fraunces → Noto Serif Sinhala, `font-sans` = Inter → Noto
  Sans Sinhala, `font-pali` = Noto Serif (Latin Extended Additional coverage).

### Sinhala typography — not the same rules as Latin

- **Never use `uppercase` or wide `tracking-[…]` on Sinhala.** The script has
  no letter case, and widened tracking breaks its conjuncts. Use `si-heading`
  for labels and headings, `si-tight` for large display text, and
  `eyebrow-si` on `<Eyebrow>`.
- Body copy needs ~2.0 line-height — Sinhala stacks vowel signs above *and*
  below the baseline and collides at Latin leading. `prose-dhamma` already
  does this; use it rather than restyling.
- Numerals are formatted with the `si-LK` locale.

---

## 7. Motion

Animation is the point of this site, and also the fastest way to ruin it.

- **Use `Reveal` and `Stagger`** (`src/components/motion/`) for entrances.
  Reach for a bespoke animation only when the motion carries meaning the
  primitives cannot.
- **Motion must mean something.** A step advancing, a category opening, a
  correct answer landing. Decoration that moves for its own sake is noise.
- **`prefers-reduced-motion` is honoured everywhere.** Every animated component
  calls `useReducedMotion()` and degrades to an instant state change. The global
  CSS also kills animation durations. Content must never depend on motion to be
  readable or usable.
- Standard easing is `[0.16, 1, 0.3, 1]`. Entrances ~0.5–0.6s, interactions
  ~0.2s.
- Decorative visuals get `aria-hidden` and must not affect layout.

---

## 8. Interaction & accessibility

Non-negotiable, because a learner who cannot use it learns nothing:

- **No drag-and-drop.** Tap-to-select, tap-to-place. Drag is hostile on touch
  and unusable by keyboard.
- Everything interactive is a real `<button>` or `<a>` and reachable by Tab.
- Never nest interactive elements (a `<button>` inside a `<button>` is invalid
  HTML and breaks screen readers). Use an absolutely-positioned overlay button
  when a large region needs to be clickable — see `SortGame`.
- Provide `aria-label` on icon-only controls, `aria-expanded` on disclosures,
  `aria-current` on the active step or nav item.
- Wide content (tables, process tracks) scrolls inside its own container. The
  page body never scrolls horizontally.
- Quizzes and exercises have no score, no streak, no penalty. The explanation is
  the payload; the question exists to make the learner commit first.

---

## 9. Learner data

Progress, quiz answers and reflections live in `localStorage` via
`src/lib/progress.ts`. **Nothing is uploaded. There is no account, no
analytics, no third-party script.** This is a product decision, stated to the
learner in the UI and the footer — do not add tracking, and do not weaken the
claim.

Anything rendering persisted state must gate on `useHydrated()`, or the
server's empty markup will not match the client's stored values.

---

## 10. Code conventions

- TypeScript strict. No `any`. Discriminated unions over optional-field soup.
- Server Components by default. `"use client"` only where interaction, browser
  APIs or hooks demand it — keep the client boundary as low in the tree as
  possible. `LessonRail` is the pattern: a thin client controller observing
  server-rendered content.
- Imports use the `@/` alias.
- **Content files (`src/content/**`) may only import from `@/` as
  `import type`.** Runtime imports must be relative. The validator runs on
  Node's native type-stripping and cannot resolve the alias.
- `cn()` from `@/lib/utils` for conditional classes.
- Comments explain *why*, not *what*. Do not narrate the obvious.

---

## 11. Changelog

Every change that affects what a user sees or how an author works goes in
`CHANGELOG.md`, newest first, under `## [Unreleased]`. Keep entries short and
concrete. Group under Added / Changed / Fixed / Removed.

Do not log internal refactors nobody will notice.

---

## 12. Working agreements

- **Run `npm run check` before reporting completion.** Report failures with
  their output rather than describing them.
- When the user provides lesson content, ask about anything genuinely ambiguous
  *before* building, then build the whole lesson — do not deliver half of it.
- Prefer improving an existing block type over adding a near-duplicate one.
- When adding a component, add it to `/lab`.
- Keep `docs/` current when the architecture changes. A stale doc is worse than
  no doc.
- Adding an app page? Give it `AppPage` + `PageHeader` from
  `@/components/app/PageHeader` so it reads as part of one app, and add it to
  `railGroups` in `src/lib/site.ts` if it deserves a place in the rail.
- Artwork lives in `public/images/<subject>/…` with the **language as a file-name
  suffix** (`x-si.png` beside `x-en.png`), and is named in content **without**
  that suffix. `figureSrc()` adds it. Never hotlink a stock-photo host: a remote
  image is a third-party request, and the footer promises there are none.
- **`image-inbox/` is where the user drops new artwork**, under any name at all.
  It sits outside `public/`, so nothing there is shipped. When asked to place a
  file from it: rename it to the convention, move it to `public/images/…`, wire
  it into the content (a `figure` block, or a chapter's `image`), read the file's
  **real pixel size** into `width`/`height`, write the `alt` in the content, and
  delete the original from the inbox. If it is not clear where a file belongs,
  ask — do not guess. `image-inbox/README.md` has the checklist.
- Never hardcode user-facing text. It goes in `src/lib/strings.ts`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
