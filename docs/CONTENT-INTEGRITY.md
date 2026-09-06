# Content integrity

This site teaches a religious tradition. A confident, well-designed error is
worse than an ugly page — it will be believed.

---

## The first rule

**Never invent doctrine.**

Not a definition, not a count, not a citation, not a category, not a
"traditional" reading. If the material to hand does not cover something and the
lesson needs it, ask. Do not fill the gap from general knowledge and present it
in the same voice as taught content.

This applies with particular force to anything that looks authoritative:

- Numbers (89, 121, 52, 28, 24, 7…)
- Pāli terms and their literal senses
- Text references
- "The commentaries say…"

Filling any of these in from memory produces something that *reads* correct and
is not checkable by the reader. That is the failure mode to design against.

---

## Do not silently improve the teaching

Rephrasing for the web is fine and expected: tightening a sentence, splitting a
paragraph, choosing a clearer verb.

Changing what is *claimed* is not. If something in the source material looks
like an error, an inconsistency or an omission, **say so** rather than fixing it
quietly. The person supplying the content owns the teaching.

---

## Citations

Published lessons must carry `sources`. The validator enforces this.

Cite precisely enough to be checked:

- Good: `Aṅguttara Nikāya 1.49`, `Abhidhammattha Saṅgaha, ch. 1`,
  `Dhammasaṅgaṇī §1`
- Not good: "the suttas", "the Abhidhamma", "traditional teaching"

Distinguish registers, because readers will:

| Register | Say it as |
| --- | --- |
| Canonical text | quote with a precise reference |
| Commentary (Aṭṭhakathā, Visuddhimagga) | name it as commentarial |
| A particular teacher's reading | attribute it |
| Modern illustration or analogy | mark it as such |

An analogy invented to make a point clear is legitimate teaching. Presenting it
as canonical is not. Where teachers read a point differently, the lesson says so
rather than picking a side silently — a `callout` with `tone: "tradition"`
exists for exactly this.

---

## Enumerations

Abhidhamma is built from counted lists, and the counts are load-bearing: a
category dropped from a list of 52 is a substantive error, not a typo.

The `taxonomy` block sums leaf `count` values up the tree and compares against
the declared `total`. A mismatch **fails the build**.

When that happens, find the missing item. Do not adjust the stated total to
make the error go away.

Counts also differ legitimately between reckonings — 89 cittas or 121, 24
conditions in the Paṭṭhāna. When a lesson uses one, say which and why.

---

## Pāli

- **User-facing text is always correctly diacriticked**: `paññā`, `bhavaṅga`,
  `rūpa`, `saṅkhāra`, `viññāṇa`, `voṭṭhabbana`.
- **Glossary ids are plain ASCII**: `panna`, `bhavanga`, `rupa`. The id is a
  lookup key, never displayed as the term itself.
- Every Pāli term a learner meets must be defined in `src/content/glossary.ts`.
  Referencing an undefined term with `[[pali:id]]` fails the build.
- Give the literal sense where it teaches something. `bhavaṅga` as "factor of
  existence" and `javana` as "running swiftly" both do real work; forcing an
  etymology onto a term where it does not illuminate anything does not.
- Translations are choices. `dukkha` as "suffering" loses more than it keeps;
  `saṅkhāra` has no single English equivalent. Where a rendering is contested,
  give the Pāli first and gloss it, rather than letting the English quietly
  become the term.

---

## Writing about experience

The Abhidhamma describes what can be observed. Lessons should keep pointing
back at that, and `reflect` prompts should ask for something a learner can
actually notice — a moment where feeling-tone is distinguishable from the
liking that follows it, say.

Avoid:

- Promising attainments or results from reading a lesson.
- Turning analysis into therapy language.
- Treating the model as a scientific claim about neurology. It is a
  phenomenological analysis; comparisons to neuroscience are speculation and
  should be labelled as such if made at all.

---

## Tone

Respectful without being reverent. Clear without being flippant. The reader is
assumed to be intelligent and new to the material — neither an initiate nor a
child.

The site is a study aid, not an authority, and says so on the About page. For
anything that matters, learners should check the texts and a teacher.
