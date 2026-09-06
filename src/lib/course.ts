import {
  chapterDuration,
  chapterLessons,
  visibleChapters,
} from "@/content/chapters";
import { glossary } from "@/content/glossary";
import { visibleLessons } from "@/content/lessons";
import { visibleReferences } from "@/content/reference";
import { figureSrc } from "@/lib/images";
import { plain } from "@/lib/richtext";
import type { Block, Chapter, Difficulty, Lesson, Source } from "@/lib/types";

/**
 * COURSE DERIVATIONS
 * ==================
 * Read-only views over the content registry, computed on the server.
 *
 * Everything here is *derived* — it reads what the lessons already say and
 * arranges it. Nothing in this file introduces a fact that is not in
 * `src/content/`, which is what lets pages like the dashboard and the Seven
 * Books index exist without anyone authoring a second copy of the teaching.
 */

/* -------------------------------------------------------------------------- */
/*  Walking the block tree                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Every block in a lesson, with the section it came from and its index within
 * that section's block list.
 *
 * The index is not incidental: `Quiz` and `Reflect` key the learner's stored
 * answer on `lessonSlug:sectionId:blockIndex`, so anything that wants to read
 * those answers back — the practice index, the notes page — needs the same
 * index the renderer used.
 */
function* blocksOf(lesson: Lesson) {
  for (const section of lesson.sections) {
    for (const [blockIndex, block] of section.blocks.entries()) {
      yield { block, blockIndex, section, lesson };
    }
  }
}

type Located<T extends Block["type"]> = {
  block: Extract<Block, { type: T }>;
  lessonSlug: string;
  lessonTitle: string;
  lessonNumber: number;
  sectionId: string;
  sectionTitle: string;
  blockIndex: number;
  /** The key this block's stored answer lives under, if it stores one. */
  storeKey: string;
};

function collect<T extends Block["type"]>(
  type: T,
  lessons: Lesson[],
): Array<Located<T>> {
  const out: Array<Located<T>> = [];
  for (const lesson of lessons) {
    for (const { block, blockIndex, section } of blocksOf(lesson)) {
      if (block.type === type) {
        out.push({
          block: block as Extract<Block, { type: T }>,
          lessonSlug: lesson.slug,
          lessonTitle: lesson.title,
          lessonNumber: lesson.number,
          sectionId: section.id,
          sectionTitle: section.title,
          blockIndex,
          storeKey: `${lesson.slug}:${section.id}:${blockIndex}`,
        });
      }
    }
  }
  return out;
}

/** Every "key idea" the lessons single out. Used by a chapter's Key Points tab. */
export function allKeyIdeas(lessons: Lesson[] = visibleLessons()) {
  return collect("keyIdea", lessons);
}

/** Every multiple-choice check. Used by the practice index. */
export function allQuizzes(lessons: Lesson[] = visibleLessons()) {
  return collect("quiz", lessons);
}

/** Every open reflection prompt. Used by a chapter's "think about this" card. */
export function allReflects(lessons: Lesson[] = visibleLessons()) {
  return collect("reflect", lessons);
}

/* -------------------------------------------------------------------------- */
/*  Chapters                                                                  */
/* -------------------------------------------------------------------------- */

export interface ChapterSummary {
  slug: string;
  number: number;
  title: string;
  pali?: string;
  subtitle: string;
  summary: string;
  /** Already resolved to a public path — client components cannot call `figureSrc`. */
  image?: string;
  durationMin: number;
  /** The gentlest tier in the chapter through to the hardest. */
  difficulty: Difficulty;
  lessons: Array<{
    slug: string;
    number: number;
    title: string;
    subtitle: string;
    durationMin: number;
    difficulty: Difficulty;
    sectionCount: number;
    isDraft: boolean;
  }>;
}

const difficultyRank: Record<Difficulty, number> = {
  foundation: 0,
  intermediate: 1,
  deep: 2,
};

/**
 * A chapter reduced to exactly what a card, a rail row or the learning path
 * needs — plain data, so client components can take it as props without the
 * content registry following them into the bundle.
 */
export function summarise(chapter: Chapter): ChapterSummary {
  const lessons = chapterLessons(chapter);

  /** A chapter is as hard as its hardest lesson; claiming otherwise undersells
      the work a learner is about to start. */
  const difficulty = lessons.reduce<Difficulty>(
    (hardest, l) =>
      difficultyRank[l.difficulty] > difficultyRank[hardest]
        ? l.difficulty
        : hardest,
    "foundation",
  );

  return {
    slug: chapter.slug,
    number: chapter.number,
    title: chapter.title,
    pali: chapter.pali,
    subtitle: chapter.subtitle,
    summary: chapter.summary,
    image: chapter.image ? figureSrc(chapter.image) : undefined,
    durationMin: chapterDuration(chapter),
    difficulty,
    lessons: lessons.map((l) => ({
      slug: l.slug,
      number: l.number,
      title: l.title,
      subtitle: l.subtitle,
      durationMin: l.durationMin,
      difficulty: l.difficulty,
      sectionCount: l.sections.length,
      isDraft: l.status === "draft",
    })),
  };
}

/** Every visible chapter, summarised, in teaching order. */
export function courseOutline(): ChapterSummary[] {
  return visibleChapters().map(summarise);
}

/** Sources across a chapter's lessons, de-duplicated by label + ref. */
export function chapterSources(chapter: Chapter): Source[] {
  const seen = new Map<string, Source>();
  for (const source of chapter.sources ?? []) {
    seen.set(`${source.label}|${source.ref ?? ""}`, source);
  }
  for (const lesson of chapterLessons(chapter)) {
    for (const source of lesson.sources ?? []) {
      seen.set(`${source.label}|${source.ref ?? ""}`, source);
    }
  }
  return [...seen.values()];
}

/* -------------------------------------------------------------------------- */
/*  Course-wide figures                                                       */
/* -------------------------------------------------------------------------- */

export function courseTotals() {
  const chapters = visibleChapters();
  const lessons = visibleLessons();
  return {
    chapters: chapters.length,
    lessons: lessons.length,
    sections: lessons.reduce((n, l) => n + l.sections.length, 0),
    minutes: lessons.reduce((n, l) => n + l.durationMin, 0),
    terms: glossary.length,
  };
}

/* -------------------------------------------------------------------------- */
/*  The learner's own pages                                                   */
/* -------------------------------------------------------------------------- */

/**
 * My Learning, Notes and Bookmarks all need the same thing: enough of every
 * lesson to render a row, resolved on the server so the client components can
 * match stored keys against real content without importing the registry.
 *
 * Stored records outlive the content they point at — a slug can sit in
 * somebody's browser after its lesson has been renamed or removed. These
 * lists are what the client filters against, which is how those orphans get
 * dropped instead of rendering as blank rows.
 */
export interface PersonLesson {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  sectionCount: number;
  sections: Array<{ id: string; title: string }>;
  chapterSlug?: string;
  chapterNumber?: number;
  chapterTitle?: string;
}

export interface PersonChapter {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
}

export interface PersonPrompt {
  storeKey: string;
  prompt: string;
  lessonSlug: string;
  lessonTitle: string;
  sectionId: string;
  sectionTitle: string;
}

export function personLessons(): PersonLesson[] {
  const chapters = visibleChapters();

  return visibleLessons().map((lesson) => {
    const chapter = chapters.find((c) => c.lessons.includes(lesson.slug));
    return {
      slug: lesson.slug,
      number: lesson.number,
      title: lesson.title,
      subtitle: lesson.subtitle,
      sectionCount: lesson.sections.length,
      sections: lesson.sections.map((s) => ({ id: s.id, title: s.title })),
      chapterSlug: chapter?.slug,
      chapterNumber: chapter?.number,
      chapterTitle: chapter?.title,
    };
  });
}

export function personChapters(): PersonChapter[] {
  return visibleChapters().map((c) => ({
    slug: c.slug,
    number: c.number,
    title: c.title,
    subtitle: c.subtitle,
  }));
}

/** Every reflection prompt in the course, keyed as the block stores its answer. */
export function personPrompts(): PersonPrompt[] {
  return allReflects().map((r) => ({
    storeKey: r.storeKey,
    prompt: plain(r.block.prompt),
    lessonSlug: r.lessonSlug,
    lessonTitle: r.lessonTitle,
    sectionId: r.sectionId,
    sectionTitle: r.sectionTitle,
  }));
}

/* -------------------------------------------------------------------------- */
/*  The knowledge map                                                         */
/* -------------------------------------------------------------------------- */

export interface MapNode {
  /** Glossary id — the node links to its full entry. */
  id: string;
  si: string;
  pali: string;
  short: string;
  /** The lesson that introduces it, so progress can mark the node. */
  lessonSlug: string;
  lessonTitle: string;
}

/**
 * The course as a chain of concepts rather than a chain of lessons.
 *
 * Derived, not authored: it takes the **first** entry of each lesson's
 * `keyTerms` in teaching order and drops repeats, so the chain is exactly the
 * sequence the lessons already claim. Nobody has to keep a second ordering in
 * step with the first, and no concept appears here that a lesson did not name.
 *
 * To change what the map shows, change a lesson's `keyTerms`.
 */
export function knowledgeMap(limit = 8): MapNode[] {
  const seen = new Set<string>();
  const nodes: MapNode[] = [];

  for (const lesson of visibleLessons()) {
    const id = lesson.keyTerms?.[0];
    if (!id || seen.has(id)) continue;

    const term = glossary.find((g) => g.id === id);
    if (!term) continue;

    seen.add(id);
    nodes.push({
      id: term.id,
      si: term.si,
      pali: term.pali,
      short: term.short,
      lessonSlug: lesson.slug,
      lessonTitle: lesson.title,
    });
    if (nodes.length >= limit) break;
  }

  return nodes;
}

/* -------------------------------------------------------------------------- */
/*  Concept of the day                                                        */
/* -------------------------------------------------------------------------- */

export interface DailyConcept {
  id: string;
  si: string;
  pali: string;
  say?: string;
  short: string;
  literal?: string;
  lessonSlug?: string;
}

/**
 * Every term that could be the concept of the day, in a stable order.
 *
 * The *pick* happens in the browser, from the reader's own date, so it turns
 * over at their midnight rather than at build time. This function only decides
 * what is eligible: a term with a one-line gloss, which is all the card shows.
 */
export function conceptPool(): DailyConcept[] {
  return glossary
    .filter((term) => Boolean(term.short))
    .map((term) => ({
      id: term.id,
      si: term.si,
      pali: term.pali,
      say: term.say,
      short: term.short,
      literal: term.literal,
      lessonSlug: term.introducedIn,
    }));
}

/* -------------------------------------------------------------------------- */
/*  Reference topics, flattened for a card                                    */
/* -------------------------------------------------------------------------- */

export interface ReferenceCard {
  slug: string;
  title: string;
  pali?: string;
  summary: string;
  category: string;
}

export function referenceCards(limit = 6): ReferenceCard[] {
  return visibleReferences()
    .slice(0, limit)
    .map((topic) => ({
      slug: topic.slug,
      title: topic.title,
      pali: topic.pali,
      summary: topic.summary,
      category: topic.category,
    }));
}
