# Design system

Source of truth: `src/app/globals.css`. Everything below describes what is
defined there.

The look: modern research software. A cool-white ground, graphite text, a
single decisive blue, and photography-free artwork drawn from the same tokens
as everything else. Not a meditation-app cliché of beige and lotus stock
photos, and not a startup-bright dashboard. Serious about the subject, quiet
in execution.

**Light is the authored theme.** Dark is a complete second palette, not a
filter — every semantic token *and* every brand ramp is re-declared under
`:root[data-theme="dark"]`.

---

## Colour

### Brand ramps

| Token | Hex (light) | Meaning |
| --- | --- | --- |
| `cobalt-100…900` | `#3563E9` at 500 | **Primary.** Actions only — see the rule below. |
| `jade-300…600` | `#0F9D8A` at 500 | Insight, correctness, completion. |
| `lotus-300…600` | `#7C5CE7` at 500 | Practice, interaction, the reflective register. |
| `gold-300…600` | `#D18B0C` at 500 | Tradition. Quotation, canon, commentary, sources. |
| `rose-400…500` | `#DC4C4C` at 500 | Caution and wrong answers. Used sparingly. |

**The rule that keeps this calm: 80–90% of the interface is neutral.** Blue is
reserved for buttons, active navigation, links, selected states, progress, and
emphasis inside a diagram. A heading is `ink`, body copy is `ink-dim`, a
caption is `ink-faint`. Colouring an ordinary label blue is the single fastest
way to make this look like every other product.

Fixed diagram registers, because a learner reads them as a code:
**citta → cobalt, cetasika → jade, rūpa → lotus.** The `accent` field on
`FlowBlock`, `HierarchyBlock` and `LadderBlock` selects between them.

**Names never collide with Tailwind's stock palette**, and that is deliberate.
If the primary were `blue-500`, a typo like `bg-blue-50` would silently resolve
to Tailwind's own blue and survive review. `cobalt`, `jade`, `lotus`, `gold`
and `rose` have no stock equivalents, so a mistyped step simply produces
nothing and gets noticed.

Every ramp is re-declared for dark: the same hue at the lightness that ground
needs. So `bg-cobalt-500` is a mid blue on cool white and a lighter blue on midnight,
and both read as "the primary".

### Accent ink — the token an accent takes when it is *text*

| Token | Light | Dark |
| --- | --- | --- |
| `cobalt-ink` `jade-ink` `lotus-ink` `gold-ink` `rose-ink` | dark enough for cool white | light enough for midnight |

No single ramp step reads on both grounds, so these five carry the reading
weight while the ramps stay fixed for fills and rings.

- `text-cobalt-ink` on a page surface. ✅
- `text-cobalt-400` on a page surface. ❌ — invisible in one theme or the other.
- `bg-cobalt-500 text-on-brand` for a filled brand surface. ✅

### Semantic tokens — these flip with the theme

| Token | Light | Use |
| --- | --- | --- |
| `ground` | `#EEF2F8` | Deepest plane; the html element |
| `canvas` | `#F7F9FC` | Page background |
| `surface` | `#FFFFFF` | Cards |
| `surface-2` | `#EEF4FF` | Soft blue fill — hovers, quiet panels |
| `surface-3` | `#DCE3ED` | The step below a card |
| `ink` | `#111827` | Headings |
| `ink-dim` | `#374151` | Body copy |
| `ink-faint` | `#64748B` | Captions and metadata |
| `ink-mute` | `#94A3B8` | Placeholders, empty markers, disabled |
| `line`, `line-soft` | `#DCE3ED` | Borders and rules |
| `on-brand` | `#FFFFFF` | Label colour on a filled brand surface |

### The rail — midnight in both themes

| Token | Use |
| --- | --- |
| `rail` `#0B1220`, `rail-2` | The sidebar's own ground |
| `rail-ink`, `rail-ink-dim`, `rail-ink-faint` | Text on it |
| `rail-line` | Its borders |

The sidebar does not flip with the theme. It is the fixed point a learner
navigates by, and flipping it makes the app feel like two different products.
Anything drawn on it — or on a `cobalt-800` banner — uses these tokens or a
light ramp step, never `ink`.

### Elevation

`shadow-card` for a resting card, `shadow-lift` for one raised on hover or for
an overlay, `shadow-glow-cobalt` for the primary action. On cool white, shadows
are wide and low-opacity; the heavy drops that read as depth on black read as
dirt on paper.

### Rules

- **Never write a raw hex value in a component.**
- **Never use Tailwind's stock palette** (`bg-slate-800`, `text-gray-400`). It
  is not theme-aware and will break one of the themes.
- Need a colour that does not exist? Add a token, define it for both themes.
- Opacity modifiers on tokens are fine and encouraged: `bg-cobalt-500/12`,
  `ring-jade-500/30`.

### Meaning is carried by colour *and* something else

A learner who cannot distinguish jade from rose must still be able to tell a
correct answer from a wrong one. Every state that uses colour also uses an icon,
a label or a position. Check this whenever you add a state.

---

## Type

| Token | Face | Use |
| --- | --- | --- |
| `font-display` | Fraunces | Headings, key ideas, pull quotes |
| `font-sans` | Inter | Everything else |
| `font-pali` | Noto Serif | Pāli only |
| `font-mono` | system mono | Counts, numbers, technical tokens |

Pāli gets its own face for a functional reason — see
[`ARCHITECTURE.md`](ARCHITECTURE.md#pāli-typography). Always wrap it in `<Pali>`
or apply `font-pali` with `lang="pi"`.

### Scale

- Hero: `clamp(2.5rem, 7vw, 4.75rem)`, `leading-[1.03]`
- Page title: `text-4xl sm:text-5xl`
- Section heading: `text-3xl`
- Block heading: `text-2xl sm:text-3xl`
- Body: `1.0625rem`, `leading-[1.85]` — long-form reading, not UI density
- Meta: `text-xs`, often uppercase with `tracking-[0.16em]`

Body copy lives in `.prose-dhamma`, which also styles `strong`, `em`, links and
inline `code`. Lesson prose should use it rather than restyling.

### Measure

Lesson body is capped at `max-w-2xl` (~65 characters). Do not widen it. Tables,
process tracks and taxonomies may exceed it inside their own scroll containers.

---

## Motion

Two primitives, in `src/components/motion/Reveal.tsx`:

- `<Reveal>` — the site's single scroll entrance. `delay`, `from`, `once`.
- `<Stagger>` / `<StaggerItem>` — sequenced entrance for lists and grids.

Using one primitive everywhere is what keeps the site feeling composed rather
than busy. Write a bespoke animation only when the motion carries meaning the
primitives cannot — a step advancing, a branch opening, an answer landing.

| Purpose | Duration |
| --- | --- |
| Micro-interaction (hover, press) | 180–220ms |
| Entrance, expand, transition | 300–620ms |
| Ambient / breathing | 5–22s |

Standard easing `[0.16, 1, 0.3, 1]` (`--ease-out-soft`) — fast out, soft
landing.

### Reduced motion

Every animated component calls `useReducedMotion()` and degrades to an instant
state change; global CSS additionally collapses durations. Nothing may depend on
motion to be readable, and nothing may loop indefinitely in a way that draws the
eye during reading.

Decorative visuals (`MindField`, ornamental dividers, glows) are `aria-hidden`
and must not affect layout.

---

## Space and shape

- Spacing follows Tailwind's scale. Prefer 4 / 5 / 6 / 8 / 10 / 12 / 16.
- Radii: `rounded-full` for controls and pills, `rounded-xl` for inner surfaces,
  `rounded-2xl` for cards and blocks, `rounded-3xl` for large feature panels.
- Elevation is expressed with `ring-1 ring-line` plus a soft shadow, not heavy
  borders.
- Section rhythm: `py-16` mobile, `py-24` desktop. Blocks inside a lesson use
  `my-6` to `my-10` depending on weight.

Layout widths (`<Container width>`): `narrow` 2xl (prose pages) · `default` 5xl
· `wide` 7xl (lesson player, grids).

---

## Components

`src/components/ui/index.tsx` holds `Button`, `ButtonLink`, `Card`, `Pill`,
`Eyebrow`, `Pali`, `ProgressRing`, `Container`, `Panel`, `PanelAction`,
`Stat`, `Empty`, and the shared `toneStyles` map.

Use them. A one-off button styled inline is a design-system bug.

### Panels

`Panel` is the titled card every dashboard and app section uses: bilingual
heading left, one optional `PanelAction` right. It is what makes a page of
different widgets read as one grid.

### Empty states

`Empty` names what is missing and, where useful, what to do instead. Reach for
it rather than rendering an empty list — and never fill a gap with invented
sample content.

### Tones

`toneStyles` maps `neutral` · `insight` · `caution` · `tradition` · `practice`
to a consistent ring / background / text / dot set, shared by callouts, pills
and comparison columns. Adding a tone means adding it in one place.

---

## Accessibility

Not a section to skim:

- Focus is always visible — a `cobalt-500` ring at 3px offset, defined globally.
- The interface is Sinhala. `aria-label`s are Sinhala too — the document is
  `lang="si"`, and an English label read aloud by a Sinhala screen reader is
  worse than none.
  Never remove it.
- Icon-only controls need `aria-label`. Disclosures need `aria-expanded`.
  Steps need `aria-current`.
- Never nest interactive elements. To make a large region clickable, overlay an
  absolutely-positioned button (see `SortGame`).
- Text contrast: `ink` and `ink-dim` on `surface` are the safe pairs.
  `ink-faint` is for incidental metadata only, never for content. An accent as
  text is always an `-ink` token.
- Wide content scrolls in its own container; the page body never scrolls
  horizontally.
- A skip link is the first focusable element on every page.

---

## Adding to the system

1. Does an existing token or component do it? Use that.
2. Can it be expressed as a variant of one? Add the variant.
3. Only then add something new — define its tokens for **both** themes, add it
   to `/lab`, and note it in `CHANGELOG.md`.
