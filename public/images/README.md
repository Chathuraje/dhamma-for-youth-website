# Images

One folder per subject. **The language is a suffix on the file name**, so a
picture's two versions sit next to each other and everything one lesson needs is
in one place.

```
image-inbox/                              ← drop new files here, any name
                                            (outside public/ — never shipped)

public/images/
  chapters/<nn>-<chapter-slug>-si.svg     ← chapter artwork
  chapters/<nn>-<chapter-slug>-en.svg
  lessons/<lesson-slug>/<name>-si.png     ← figures inside a lesson
  lessons/<lesson-slug>/<name>-en.png
  reference/<topic-slug>/<name>-si.png    ← figures inside a reference topic
  lab/<name>-si.svg                       ← the component lab's stand-ins
```

## How content refers to one

A `figure` block names the path **without** the locale suffix:

```ts
{
  type: "figure",
  src: "lessons/pitaka-thuna/tripitaka-vyuhaya.png",   // no -si / -en
  alt: "බුද්ධ දේශනාව විනය සහ ධර්මය ලෙස බෙදී, ධර්මය නැවත සූත්‍ර සහ අභිධර්ම ලෙස බෙදෙන අයුරු.",
  width: 1600,
  height: 900,
  caption: "පිටක තුනේ ව්‍යුහය.",
}
```

`figureSrc()` in `src/lib/images.ts` inserts the current locale before the
extension, so the same lesson data serves `…-si.png` today and `…-en.png` the
moment an English build exists. **Call sites never change** — this mirrors how
`src/lib/strings.ts` is meant to split into `strings.si.ts` / `strings.en.ts`.
A chapter's `image` field works the same way.

Ready-to-paste generation prompts for every picture the course needs, with the
sizes and the crop-safe composition rule, are in
[`docs/IMAGE-PROMPTS.md`](../../docs/IMAGE-PROMPTS.md).

## Rules

- **Same base name for both languages.** `x-si.png` without `x-en.png` is what
  the missing-translation warning is for.
- **Same pixel size for both languages.** One `width`/`height` in the content
  serves both files.
- **`alt` is required and lives in the content, not the file.** It is authored
  text like any other, so it translates with the lesson rather than the image.
- **State `width` and `height`** as the file's real pixel size. The page
  reserves the space before the image loads; a wrong number shows as a jump.
- `check:content` fails the build if a referenced file is not on disk in the
  authored locale, so a typo can never ship as a broken image.
- Prefer SVG for diagrams and PNG for anything with photographic detail. Export
  raster diagrams at 2× — they are read on phones.
- Diagrams must survive **both themes**. The site is light by default and flips
  to dark; artwork with a baked-in white background will look like a hole in the
  page. Transparent background, mid-tone strokes.
- Figures run the full width of the reading column. `size: "wide"` takes one
  past the column on large screens.
