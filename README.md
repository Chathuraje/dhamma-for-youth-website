# Abhidhamma Atlas

An interactive course in Theravāda Abhidhamma — the Buddhist analysis of mind
and matter, taught lesson by lesson. **Authored in Sinhala**, with Pāli terms
in Latin script.

Most Abhidhamma teaching is delivered as tables and lists, which is why most
people bounce off it. The material is not difficult so much as *structural*,
and structure is far easier to grasp when you can open it, step through it and
take it apart. That is what this site is for.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

The site is two halves. The **public site** says what this is; the **learning
app**, behind *Open Dashboard*, is the course.

| Route | What it is |
| --- | --- |
| `/` | Landing |
| `/about` `/blog` `/contact` | The public site |
| `/dashboard` | Where a learner lands: the path through the course, and their progress |
| `/chapters` | Chapter index |
| `/chapters/[slug]` | A chapter: overview, lessons, key points, practice, sources |
| `/lessons/[slug]` | Lesson player with the simulators |
| `/practice` | Every quiz in the course, indexed |
| `/glossary` `/reference` | Searchable Pāli reference; background topics |
| `/my-learning` `/notes` `/bookmarks` `/settings` | Built from the learner's own store |
| `/lab` | Live gallery of every content block — start here |

---

## Scripts

```bash
npm run dev            # dev server (Turbopack)
npm run build          # production build (validates content first)
npm run start          # serve the production build

npm run check          # content + types + lint — the gate before shipping
npm run check:content  # validate lessons and glossary
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
```

---

## How it works

**Lessons are data, not markup.** Each lesson is a typed object describing a
sequence of blocks — prose, a classification tree, a deconstruction tool, a
time-ratio calculator, a quiz, a reflection prompt. A shared renderer turns
those blocks into the interactive experience.

Lessons are grouped into **chapters**. There is one copy of the teaching — the
lessons — and a chapter page that is entirely *derived* from them: its
objectives, key points, questions and sources are read out of the lessons
themselves, never authored twice.

```ts
{
  slug: "what-is-abhidhamma",
  title: "What is the Abhidhamma?",
  sections: [
    {
      id: "opening",
      title: "Two ways of speaking",
      blocks: [
        { type: "prose", text: "The suttas speak of people..." },
        { type: "comparison", columns: [/* ... */] },
        { type: "quiz", question: "...", options: [/* ... */] },
      ],
    },
  ],
}
```

The payoff: every lesson stays consistent, improving one component improves
every lesson at once, and content can be validated automatically. Broken
glossary links, mis-summed enumerations and quizzes without a correct answer
all fail the build.

Blog posts use the same model, so every interactive block works in a post too.

Writing a lesson: **[`docs/LESSON-AUTHORING.md`](docs/LESSON-AUTHORING.md)**

---

## Documentation

| Doc | Covers |
| --- | --- |
| [`CLAUDE.md`](CLAUDE.md) | Operating rules for AI-assisted work on this repo |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | How the pieces fit and why |
| [`docs/LESSON-AUTHORING.md`](docs/LESSON-AUTHORING.md) | Writing a lesson, block by block |
| [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) | Colour, type, motion, spacing |
| [`docs/CONTENT-INTEGRITY.md`](docs/CONTENT-INTEGRITY.md) | Accuracy, Pāli, citations |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | What is next |
| [`CHANGELOG.md`](CHANGELOG.md) | What changed |

---

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) ·
Tailwind CSS v4 · Motion · Zustand

Every route prerenders statically.

---

## Privacy

There is no account, no server-side storage and no analytics. Progress, quiz
answers, bookmarks and written reflections are kept in the learner's own
browser via `localStorage` and are never transmitted. Clearing browser data
clears progress; progress does not follow a learner to another device.

There is no contact form either, for the same reason — `/contact` is an
address, so nothing a visitor writes passes through anyone else's server.
`/settings` erases everything the site has stored, in one click.

---

## A note on accuracy

This is a study aid, not an authority. Definitions follow standard Theravāda
Abhidhamma usage and lessons cite their sources, but for anything that matters,
check it against the texts and against a teacher.
