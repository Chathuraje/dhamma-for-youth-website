"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * LEARNER STATE
 * =============
 * Everything here lives in the learner's own browser (localStorage) and is
 * never sent anywhere. There is no account, no tracking and no server copy.
 * That is a deliberate product decision - see /docs/ARCHITECTURE.md.
 */

export type ThemeMode = "dark" | "light";

interface ProgressState {
  /** lessonSlug -> set of completed section ids */
  completed: Record<string, string[]>;
  /** lessonSlug -> last section id the learner was on */
  bookmark: Record<string, string>;
  /** `${lessonSlug}:${sectionId}:${blockIndex}` -> chosen option index */
  quizAnswers: Record<string, number>;
  /** same key shape -> the learner's written reflection */
  reflections: Record<string, string>;
  /**
   * Things the learner deliberately saved, as `"chapter:<slug>"` or
   * `"lesson:<slug>"`. Distinct from `bookmark`, which is written automatically
   * as they read — one is "take me back here", the other is "I chose this".
   */
  saved: string[];
  theme: ThemeMode;
  /**
   * Whether the rail is folded to icons. A view preference rather than
   * learning, but it lives here for the same reason the theme does: it is the
   * learner's own setting and it belongs in their own browser.
   */
  railCollapsed: boolean;

  markSection: (lesson: string, section: string) => void;
  unmarkSection: (lesson: string, section: string) => void;
  setBookmark: (lesson: string, section: string) => void;
  answerQuiz: (key: string, option: number) => void;
  saveReflection: (key: string, text: string) => void;
  toggleSaved: (key: string) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleRail: () => void;
  resetLesson: (lesson: string) => void;
  resetAll: () => void;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      completed: {},
      bookmark: {},
      quizAnswers: {},
      reflections: {},
      saved: [],
      theme: "light",
      railCollapsed: false,

      markSection: (lesson, section) =>
        set((s) => {
          const current = s.completed[lesson] ?? [];
          if (current.includes(section)) return s;
          return {
            completed: { ...s.completed, [lesson]: [...current, section] },
          };
        }),

      unmarkSection: (lesson, section) =>
        set((s) => ({
          completed: {
            ...s.completed,
            [lesson]: (s.completed[lesson] ?? []).filter((id) => id !== section),
          },
        })),

      setBookmark: (lesson, section) =>
        set((s) => ({ bookmark: { ...s.bookmark, [lesson]: section } })),

      answerQuiz: (key, option) =>
        set((s) => ({ quizAnswers: { ...s.quizAnswers, [key]: option } })),

      saveReflection: (key, text) =>
        set((s) => ({ reflections: { ...s.reflections, [key]: text } })),

      toggleSaved: (key) =>
        set((s) => ({
          saved: s.saved.includes(key)
            ? s.saved.filter((k) => k !== key)
            : [...s.saved, key],
        })),

      setTheme: (theme) => set({ theme }),

      toggleRail: () => set((s) => ({ railCollapsed: !s.railCollapsed })),

      resetLesson: (lesson) =>
        set((s) => {
          const completed = { ...s.completed };
          const bookmark = { ...s.bookmark };
          delete completed[lesson];
          delete bookmark[lesson];
          const strip = (rec: Record<string, unknown>) =>
            Object.fromEntries(
              Object.entries(rec).filter(([k]) => !k.startsWith(`${lesson}:`)),
            );
          return {
            completed,
            bookmark,
            quizAnswers: strip(s.quizAnswers) as Record<string, number>,
            reflections: strip(s.reflections) as Record<string, string>,
            saved: s.saved.filter((k) => k !== `lesson:${lesson}`),
          };
        }),

      resetAll: () =>
        set({
          completed: {},
          bookmark: {},
          quizAnswers: {},
          reflections: {},
          saved: [],
        }),
    }),
    {
      name: "abhidhamma-atlas.progress.v1",
      version: 1,
    },
  ),
);

/* -------------------------------------------------------------------------- */
/*  Hydration-safe helpers                                                    */
/* -------------------------------------------------------------------------- */

/** Nothing to subscribe to - hydration happens exactly once. */
const noopSubscribe = () => () => {};

/**
 * `false` while rendering on the server and during the hydration pass,
 * `true` afterwards.
 *
 * Any component that renders persisted state must gate on this, or the
 * server's empty markup will not match the client's stored values.
 *
 * Implemented with `useSyncExternalStore` rather than an effect: React reads
 * the server snapshot during SSR and the client snapshot after, so there is no
 * extra render pass and no setState-in-effect.
 */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Completion ratio 0-1 for one lesson. */
export function useLessonProgress(slug: string, totalSections: number) {
  const completed = useProgress((s) => s.completed[slug]);
  const hydrated = useHydrated();
  const done = hydrated ? (completed?.length ?? 0) : 0;
  return {
    done,
    total: totalSections,
    ratio: totalSections ? done / totalSections : 0,
    complete: totalSections > 0 && done >= totalSections,
    hydrated,
  };
}

/* -------------------------------------------------------------------------- */
/*  Course-wide views                                                         */
/* -------------------------------------------------------------------------- */

/** The shape every progress-aware surface needs from a lesson. */
export interface ProgressLesson {
  slug: string;
  sectionCount: number;
}

export interface CourseProgress {
  /** Sections read across the whole course, capped per lesson. */
  done: number;
  total: number;
  ratio: number;
  /** Lessons with every section read. */
  lessonsDone: number;
  lessonCount: number;
  started: boolean;
  finished: boolean;
  /** First lesson with unread sections — where "continue" goes. */
  next?: ProgressLesson;
  hydrated: boolean;
}

/**
 * Progress across a set of lessons.
 *
 * Counts are clamped per lesson, because a section id can be removed from a
 * lesson after a learner has already read it — without the clamp that stored
 * id would push a lesson past 100% and the course total past its own maximum.
 */
export function useCourseProgress(lessons: ProgressLesson[]): CourseProgress {
  const completed = useProgress((s) => s.completed);
  const hydrated = useHydrated();

  const readIn = (lesson: ProgressLesson) =>
    hydrated
      ? Math.min(completed[lesson.slug]?.length ?? 0, lesson.sectionCount)
      : 0;

  const total = lessons.reduce((n, l) => n + l.sectionCount, 0);
  const done = lessons.reduce((n, l) => n + readIn(l), 0);
  const lessonsDone = lessons.filter(
    (l) => l.sectionCount > 0 && readIn(l) >= l.sectionCount,
  ).length;

  return {
    done,
    total,
    ratio: total ? done / total : 0,
    lessonsDone,
    lessonCount: lessons.length,
    started: done > 0,
    finished: total > 0 && done >= total,
    next: lessons.find((l) => readIn(l) < l.sectionCount) ?? lessons[0],
    hydrated,
  };
}

/** Sections read in one lesson, clamped. Safe before hydration. */
export function useSectionsRead(slug: string, sectionCount: number) {
  const completed = useProgress((s) => s.completed);
  const hydrated = useHydrated();
  if (!hydrated) return 0;
  return Math.min(completed[slug]?.length ?? 0, sectionCount);
}

/* -------------------------------------------------------------------------- */
/*  Saved items                                                               */
/* -------------------------------------------------------------------------- */

export type SavedKind = "chapter" | "lesson";

export const savedKey = (kind: SavedKind, slug: string) => `${kind}:${slug}`;

/**
 * Whether one thing is saved, plus the toggle for it.
 *
 * Reports `false` until hydrated so the server's markup and the first client
 * render agree — a bookmark button that flips state on hydration is worse than
 * one that fills in a moment later.
 */
export function useSaved(kind: SavedKind, slug: string) {
  const key = savedKey(kind, slug);
  const saved = useProgress((s) => s.saved);
  const toggleSaved = useProgress((s) => s.toggleSaved);
  const hydrated = useHydrated();

  return {
    saved: hydrated && saved.includes(key),
    toggle: () => toggleSaved(key),
    hydrated,
  };
}
