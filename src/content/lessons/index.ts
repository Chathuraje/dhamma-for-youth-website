import type { Lesson } from "@/lib/types";

import { lesson as lesson01 } from "./01-pitaka-thuna";
import { lesson as lesson02 } from "./02-devlova-kalaya";
import { lesson as lesson03 } from "./03-abhidharma-gamana";
import { lesson as lesson04 } from "./04-sammuti-paramattha";
import { lesson as lesson06 } from "./06-suddhashtakaya";
import { lesson as lesson07 } from "./07-pariccheda-avakasaya";
import { lesson as lesson08 } from "./08-sitha-yanu-kumakda";
import { lesson as lesson09 } from "./09-chittakshanaya";
import { lesson as lesson10 } from "./10-sithe-balaya";
import { lesson as lesson11 } from "./11-ghana-vinivida";
import { lesson as lesson12 } from "./12-vegaya-saha-vishvaya";
import { lesson as lesson13 } from "./13-lokaye-kelavara";

/**
 * LESSON REGISTRY
 * ===============
 * To add a lesson:
 *   1. Create `src/content/lessons/<nn>-<slug>.ts` exporting a `Lesson`.
 *   2. Import it here and add it to `lessons` below.
 *   3. Add its slug to the owning chapter in `src/content/chapters/`.
 *   4. Run `npm run check:content` to validate it.
 *
 * Order in this array does not matter - lessons sort by `number`.
 *
 * There is no standalone lessons index in the UI: learners reach a lesson
 * through its chapter. These accessors exist for the chapter pages and the
 * lesson player, not for a top-level listing.
 *
 * Full guide: /docs/LESSON-AUTHORING.md
 */
export const lessons: Lesson[] = [
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson06,
  lesson07,
  lesson08,
  lesson09,
  lesson10,
  lesson11,
  lesson12,
  lesson13,
];

/* -------------------------------------------------------------------------- */
/*  Derived accessors                                                         */
/* -------------------------------------------------------------------------- */

/** Every lesson in teaching order. */
export function allLessons(): Lesson[] {
  return [...lessons].sort((a, b) => a.number - b.number);
}

/** Only lessons ready for learners. Drafts stay visible in development. */
export function visibleLessons(): Lesson[] {
  const isDev = process.env.NODE_ENV === "development";
  return allLessons().filter((l) => isDev || l.status === "published");
}

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}

/** The lesson before and after `slug`, across the whole course. */
export function lessonNeighbours(slug: string) {
  const list = visibleLessons();
  const i = list.findIndex((l) => l.slug === slug);
  return {
    prev: i > 0 ? list[i - 1] : undefined,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined,
  };
}

/** Total sections across all visible lessons. */
export function totalSectionCount(): number {
  return visibleLessons().reduce((n, l) => n + l.sections.length, 0);
}

/** Every distinct tag, most used first. */
export function allTags(): string[] {
  const counts = new Map<string, number>();
  for (const l of visibleLessons())
    for (const t of l.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([t]) => t);
}
