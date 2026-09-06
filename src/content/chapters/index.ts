import type { Chapter, Lesson } from "@/lib/types";
import { getLesson, visibleLessons } from "../lessons";

import { chapter as chapter01 } from "./01-abhidharmayata-pivisuma";
import { chapter as chapter02 } from "./02-paramattha-pivisuma";
import { chapter as chapter03 } from "./03-sitha-saha-kshanikathvaya";
import { chapter as chapter04 } from "./04-vishvaye-yatharthaya";

/**
 * CHAPTER REGISTRY
 * ================
 * A chapter groups the lessons that came out of one body of teaching, and
 * carries the continuous-reading version of that teaching.
 *
 * To add a chapter:
 *   1. Create `src/content/chapters/<nn>-<slug>.ts` exporting a `Chapter`.
 *   2. Import it here and add it to `chapters`.
 *   3. Make sure every slug in its `lessons` array exists in the lesson
 *      registry — `npm run check:content` will tell you if it does not.
 */
export const chapters: Chapter[] = [
  chapter01,
  chapter02,
  chapter03,
  chapter04,
];

/* -------------------------------------------------------------------------- */

export function allChapters(): Chapter[] {
  return [...chapters].sort((a, b) => a.number - b.number);
}

export function visibleChapters(): Chapter[] {
  const isDev = process.env.NODE_ENV === "development";
  return allChapters().filter((c) => isDev || c.status === "published");
}

export function getChapter(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
}

/** Resolve a chapter's lesson slugs to lessons, dropping any that are hidden. */
export function chapterLessons(chapter: Chapter): Lesson[] {
  const visible = new Set(visibleLessons().map((l) => l.slug));
  return chapter.lessons
    .filter((slug) => visible.has(slug))
    .map((slug) => getLesson(slug))
    .filter((l): l is Lesson => Boolean(l));
}

/** The chapter a lesson belongs to, if any. */
export function chapterOf(lessonSlug: string): Chapter | undefined {
  return chapters.find((c) => c.lessons.includes(lessonSlug));
}

/** Every section across a chapter's lessons — the interactive path's length. */
export function chapterSectionCount(chapter: Chapter): number {
  return chapterLessons(chapter).reduce((n, l) => n + l.sections.length, 0);
}

export function chapterDuration(chapter: Chapter): number {
  return chapterLessons(chapter).reduce((n, l) => n + l.durationMin, 0);
}
