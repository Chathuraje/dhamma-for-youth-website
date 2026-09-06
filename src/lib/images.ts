import { site } from "./site";

/**
 * LESSON IMAGERY
 * ==============
 * One folder per subject, and the language lives in the **file name**:
 *
 *   public/images/lessons/<lesson-slug>/<name>-si.png
 *   public/images/lessons/<lesson-slug>/<name>-en.png
 *
 * The two versions of a picture therefore sit next to each other, and
 * everything a lesson needs is in one place. (It used to be two parallel trees,
 * `images/si/…` and `images/en/…`, which put the same diagram's two files as far
 * apart as the tree allows and made "does the English one exist?" a hunt.)
 *
 * Content names an image **without** the locale suffix, exactly as
 * `strings.ts` is meant to split into `strings.si.ts` / `strings.en.ts` — the
 * call site does not change when a second language arrives.
 *
 * See `public/images/README.md` for the tree and the authoring rules.
 */

/** `"a/b.png"` + `"si"` → `"a/b-si.png"`. The one rule; everything uses it. */
function localised(src: string, locale: string) {
  const clean = src.replace(/^\/+/, "");
  const dot = clean.lastIndexOf(".");
  return dot === -1
    ? `${clean}-${locale}`
    : `${clean.slice(0, dot)}-${locale}${clean.slice(dot)}`;
}

/** `"lessons/pitaka-thuna/x.png"` → `"/images/lessons/pitaka-thuna/x-si.png"`. */
export function figureSrc(src: string, locale: string = site.locale) {
  return `/images/${localised(src, locale)}`;
}

/**
 * Where a figure's file must sit on disk, relative to the repo root.
 *
 * Used by `check:content` so a mistyped path fails the build rather than
 * shipping as a broken image.
 */
export function figureFile(src: string, locale: string = site.locale) {
  return `public${figureSrc(src, locale)}`;
}
