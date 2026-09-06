# Roadmap

Where this is going. Not a commitment — a record of what has been considered,
so the same decisions are not re-litigated.

---

## Now

- [ ] **Chapter 05.** Content pending. Chapters 01–04 are live with thirteen
      lessons between them.
- [ ] Point `site.url` at the real domain before launch — it drives metadata
      and OG tags.
- [ ] Add an OG image (`/opengraph-image.tsx`) so shared links do not render
      bare.
- [ ] Review Chapter 01's Sinhala prose with a native reader. It was drafted
      from the teacher's own wording, but it has not been proofread aloud.
- [ ] Light-mode audit now that there is real content to look at.

---

## Next — likely wanted once lessons exist

**Course-level progress.** A "continue where you left off" entry point and an
overall completion view. The store already records bookmarks per lesson; the
surface does not exist yet.

**Cross-lesson term index.** `GlossaryTerm.introducedIn` is in the model and
unused. Once several lessons exist, the glossary can show where each term is
taught and lessons can list terms assumed from earlier ones.

**Search.** Across lesson text and glossary. Content is already structured
data, so an index can be generated at build time — no runtime service needed.

---

## Block types worth adding when content calls for them

Add these when a lesson actually needs one, not speculatively.

- **`hotspot`** — a labelled diagram with clickable points. For the sense bases
  and their objects.
- **`matrix`** — an interactive grid for two crossed dimensions. The natural
  shape for cittas by plane × root, or feeling × knowledge.
- **`conditionMap`** — a relational graph. The Paṭṭhāna's 24 conditions are a
  graph, and a tree cannot show them honestly.
- **`audio`** — Pāli pronunciation. `GlossaryTerm.say` is a phonetic
  approximation in Sinhala script; a recording would be better.
- **`timeline`** — for the history of the Abhidhamma literature.

## Known follow-ups from Chapter 01

- The glossary lost `bhavanga`, `javana`, `vithi`, `phassa` and the other
  cetasika terms when it was rewritten in Sinhala — they were English-only
  entries for content that does not exist yet. Re-add them **in Sinhala** as
  the chapters that teach them are written.
- `GlossaryTerm.introducedIn` is still unset everywhere. Populate it once the
  lesson set is stable, then the glossary can link each term to its lesson.
- English alongside Sinhala. `src/lib/strings.ts` is the whole UI surface, so
  the interface is a file swap; lesson content would need real translation.

---

## Considered and deliberately not doing

**Accounts and cloud sync.** Would let progress follow a learner across
devices. Rejected: it means a backend, auth, a privacy policy and a database of
people's private reflections. The current promise — nothing leaves your browser
— is worth more than cross-device progress. Revisit only if learners actually
ask.

**Analytics.** Same reasoning. The footer and About page both promise no
tracking; adding any would make the site dishonest.

**A CMS.** Lessons are typed data validated at build time. A CMS would trade
that for a database and lose the guarantees that catch real errors.

**Gamification** — scores, streaks, badges. Actively harmful here. Exercises
exist to make a learner commit before reading an explanation, not to be won.

**Drag-and-drop exercises.** Hostile on touch, unusable by keyboard, no
pedagogical gain over tap-to-place.

---

## Known limitations

- Progress is per-device and dies with browser data. Stated on the About page.
- No i18n. Sinhala or Burmese would matter for the likely audience, but it is a
  large change and should wait until the lesson set is stable.
- `/lab` is `noindex` but publicly reachable. Fine — it contains nothing
  sensitive.
- Light mode exists but has had far less design attention than dark. Worth an
  audit pass once there is real lesson content to look at.
