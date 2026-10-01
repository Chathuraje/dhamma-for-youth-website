# Image prompts

Ready-to-paste prompts for every picture the course needs, at the sizes the site
actually renders. Generate, drop the file in `image-inbox/`, and say which
lesson it is for — see `image-inbox/README.md`.

Two roles, two sets of rules. **Getting the role right matters more than the
prompt**, because one of them is cropped and the other is not.

| Role | Size to ask for | Cropped? |
| --- | --- | --- |
| **Chapter cover** (`chapter.image`) | **1600 × 900** | Yes — hard. See below. |
| **Lesson figure** (a `figure` block) | **2048 × 1152** | No. The whole frame shows. |

---

## The crop rule for chapter covers

A chapter's picture is centre-cropped by `object-cover` into four boxes at once:
a **1:1 square** (64 px, dashboard card), a **2.6:1 strip** (learning-path card),
a **2.7:1 band** (chapter hero) and a **3.9:1 band** (lesson hero). Only what
survives *all four* is reliably seen.

The survivor is the **centre**. So every chapter cover prompt below ends with
the same composition clause:

> Single subject centred in the frame, filling the middle 50% both horizontally
> and vertically. The outer quarter on every side is atmosphere only — nothing
> the picture needs. No important element near any edge.

A picture with its meaning at the top and bottom (a Buddha above, a book below)
loses both in the 3.9:1 band. That is the one mistake to avoid.

Lesson figures have no such constraint — compose freely.

---

## The style block

Paste this **before** every prompt below.

```
Theravāda Buddhist devotional art in the Sri Lankan tradition. Painterly,
luminous, reverent. Sinhala visual idiom — Anuradhapura and Kandyan forms,
dagoba silhouettes, lotus, palm-leaf manuscripts, moonstone and makara motifs.
Deep indigo and midnight blue ground with warm gold light. Soft volumetric
glow, fine detail, no harsh contrast. Cinematic, contemplative, still.
```

## The negative block

Paste this as the negative prompt, or append it, every time.

```
No text, no letters, no writing, no script, no calligraphy, no numerals, no
captions, no labels, no watermark, no signature. No East Asian temple
architecture, no Chinese or Japanese or Tibetan iconography. No cartoon, no
anime, no 3D render look, no photo-realistic human faces of identifiable
people. No pure white background. No borders, frames or vignettes. No collage,
no split panels, no grids of separate scenes.
```

**Why no text:** captions and `alt` are authored in the lesson so they translate
with it, and generated script is always gibberish under any real reading. **Why
no pure white:** the site is light by default and flips to dark; a white plate
becomes a glowing hole at night.

---

# Chapter covers — 1600 × 900

### 01 · අභිධර්මයට පිවිසුම

> A single open palm-leaf manuscript resting on a carved wooden stand, lit from
> within by a soft golden radiance that rises from its pages into the dark air.
> Faint terraces of cloud float far behind it, barely suggested. The manuscript
> is the whole subject: centred, dominant, unmistakable at a glance.
> *Single subject centred in the frame, filling the middle 50% both horizontally
> and vertically. The outer quarter on every side is atmosphere only.*

### 02 · පරමාර්ථ ධර්මයට පිවිසුම

> A simple clay water pot dissolving, from its outer edge inward, into a cloud
> of tiny luminous points of light — half of it still solid earthenware, half
> already particles. The dissolution happens at the centre of the frame. Dark
> indigo ground, warm gold particles.
> *Single subject centred in the frame, filling the middle 50% both horizontally
> and vertically. The outer quarter on every side is atmosphere only.*

### 03 · සිත සහ ක්ෂණිකත්වය

> A single bright point of light at the centre of darkness, with a short arc of
> identical points trailing from it and fading — each one separate, none of them
> touching, together suggesting a line that is not really continuous. Cool
> midnight ground, one warm gold thread of moments.
> *Single subject centred in the frame, filling the middle 50% both horizontally
> and vertically. The outer quarter on every side is atmosphere only.*

### 04 · විශ්වයේ යථාර්ථය

> A lone seated monk in silhouette at the exact centre of a vast field of stars,
> the galaxy wheeling around him, and a single point of warm light at his heart
> brighter than anything in the sky. Immense scale, absolute stillness.
> *Single subject centred in the frame, filling the middle 50% both horizontally
> and vertically. The outer quarter on every side is atmosphere only.*

---

# Lesson figures — 2048 × 1152

★ = worth making. The rest are optional: the lesson already teaches that point
through an interactive block, and a picture beside it would decorate rather than
explain.

### ★ 1.3 · රතනඝරය (අභිධර්මය මනුලොවට පැමිණි ගමන)

The lesson's opening section describes this and has no picture.

> A jewelled pavilion of light standing north-west of a great bodhi tree in the
> fourth week after the awakening. The seated Buddha within it, absorbed in
> contemplation, and from his body six bands of coloured radiance — blue, gold,
> crimson, white, deep rose, and a clear brilliance — spreading outward through
> the night in wide arcs. Dawn has not come; the light is entirely his.

### ★ 2.1 · සම්මුතිය සහ පරමාර්ථය (04-sammuti-paramattha)

> One bullock cart on a village road at dusk, painted twice in the same frame:
> the left half an ordinary solid cart with its driver, the right half the same
> cart resolved into a drift of separate luminous particles with no cart and no
> driver left in it. The change happens gradually across the middle. Same light,
> same scene, two ways of seeing it.

### ★ 2.3 · ශුද්ධාෂ්ටකය (06-suddhashtakaya)

> Eight tiny spheres of light — four large and heavy at the core, four smaller
> orbiting close — bound together inside a single translucent orb no bigger than
> a dewdrop, floating in dark space. The orb cannot be opened; the eight are one
> thing. Extreme close focus, deep indigo around it.

### ★ 2.4 · පරිච්ඡේද අවකාශය (07-pariccheda-avakasaya)

> A blade of light passing cleanly *between* two luminous dewdrop-orbs without
> touching either one — the gap it travels through lit faintly, the orbs
> themselves untouched and whole. Seen at enormous magnification, dark field,
> the blade thin and precise.

### ★ 3.2 · චිත්තක්ෂණය (09-chittakshanaya)

> Seventeen tiny sparks arcing past in a swift line at the top, and beneath them
> a single slower flash of pale material light beginning and ending in the time
> the seventeen take to pass. The contrast in rhythm is the whole picture. Dark
> ground, gold above, cool silver below.

### ★ 4.2 · ලෝකයේ කෙළවර (13-lokaye-kelavara)

> A lone traveller striding across a boundless plain under a sky of countless
> worlds, his stride impossibly long, receding toward a horizon that never
> arrives — and, faintly overlaid on the same frame, the outline of a single
> human body within which that same horizon quietly sits. Vast, weary, and then
> suddenly intimate.

### Optional — already carried by an interactive block

| Lesson | Already has |
| --- | --- |
| 1.1 ත්‍රිපිටකය | `figure` (tripitaka-vyuhaya) + the `shelf` of seven treatises |
| 1.2 දෙව්ලොව | `figure` (devlova-thala) + the time converter |
| 2.2 පරමාර්ථය හඳුනාගැනීම | the sorting exercise |
| 3.1 සිත යනු කුමක්ද | the flow and hierarchy blocks |
| 3.3 සිතේ බලය | the comparison blocks |
| 3.4 ඝන විනිවිද | the spin-wheel — a *moving* firebrand beats a painted one |
| 4.1 වේගය | the ladder |

If you want pictures for these anyway, the pattern is the same: one scene, one
idea, no text, 2048 × 1152.

---

## After you generate

1. Save to `image-inbox/` under any name.
2. Say which lesson or chapter it is for, and what it shows.
3. Claude renames it, files it under `public/images/…-si.png`, reads the real
   pixel size into `width`/`height`, writes the `alt`, and clears the inbox.

Both language versions must be the **same pixel size** — one `width`/`height` in
the content serves both. A picture with no text in it can use the same plate for
both languages.
