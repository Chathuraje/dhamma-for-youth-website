"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, Check, Play } from "lucide-react";

import { ProgressRing } from "@/components/ui";
import type { ChapterSummary } from "@/lib/course";
import { useCourseProgress, useProgress, useSaved } from "@/lib/progress";
import { t } from "@/lib/strings";
import { cn, formatNumber, formatPercent } from "@/lib/utils";

/**
 * The right rail of a chapter page: how far through it the learner is, the one
 * action that continues it, and every lesson in the chapter with its state.
 *
 * All of it reads the browser's own store, so this is the page's only client
 * component. Before hydration it renders zeroes and an unfilled bookmark —
 * honest defaults rather than a flash of somebody else's progress.
 */
export function ChapterAside({
  chapter,
  currentLessonSlug,
}: {
  chapter: ChapterSummary;
  /** Highlights the lesson being read, when the rail is used on a lesson page. */
  currentLessonSlug?: string;
}) {
  const progress = useCourseProgress(chapter.lessons);
  const completed = useProgress((s) => s.completed);
  const bookmark = useSaved("chapter", chapter.slug);

  const target = progress.next?.slug ?? chapter.lessons[0]?.slug;

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line">
        <h2 className="si-heading block font-display text-base font-semibold text-ink">
          {t.course.progress}
        </h2>

        <div className="mt-4 flex items-center gap-4">
          <div className="relative shrink-0">
            <ProgressRing ratio={progress.ratio} size={64} stroke={5} />
            <span className="absolute inset-0 flex items-center justify-center font-display text-xs font-semibold text-ink">
              {formatPercent(progress.ratio)}
            </span>
          </div>
          <p className="si-heading min-w-0 text-sm text-ink-dim">
            {formatNumber(progress.lessonsDone)} /{" "}
            {formatNumber(progress.lessonCount)} {t.course.lessons}
          </p>
        </div>

        {target ? (
          <Link
            href={`/lessons/${target}`}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-cobalt-500 px-4 py-3 text-on-brand transition-colors hover:bg-cobalt-600"
          >
            <Play size={14} fill="currentColor" aria-hidden />
            <span className="si-heading block text-sm font-medium leading-none">
              {progress.started ? t.chapter.continue : t.course.begin}
            </span>
          </Link>
        ) : null}

        <button
          type="button"
          onClick={bookmark.toggle}
          aria-pressed={bookmark.saved}
          className={cn(
            "mt-2 flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium ring-1 transition-colors",
            bookmark.saved
              ? "bg-cobalt-100 text-cobalt-700 ring-cobalt-500/30"
              : "bg-surface-2 text-ink ring-line hover:bg-surface-3",
          )}
        >
          {bookmark.saved ? (
            <BookmarkCheck size={14} aria-hidden />
          ) : (
            <Bookmark size={14} aria-hidden />
          )}
          <span className="si-heading">
            {bookmark.saved ? t.chapter.bookmarked : t.chapter.bookmark}
          </span>
        </button>
      </section>

      <section className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line">
        <h2 className="si-heading block font-display text-base font-semibold text-ink">
          {t.chapter.lessonsIn}
        </h2>

        <ol className="mt-4 space-y-0.5">
          {chapter.lessons.map((lesson, i) => {
            const done = Math.min(
              progress.hydrated ? (completed[lesson.slug]?.length ?? 0) : 0,
              lesson.sectionCount,
            );
            const finished = lesson.sectionCount > 0 && done >= lesson.sectionCount;
            const current = lesson.slug === currentLessonSlug;

            return (
              <li key={lesson.slug}>
                <Link
                  href={`/lessons/${lesson.slug}`}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors",
                    current ? "bg-cobalt-100" : "hover:bg-surface-2",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[0.65rem] font-semibold",
                      finished || current
                        ? "bg-cobalt-500 text-on-brand"
                        : "bg-surface-2 text-ink-faint ring-1 ring-line",
                    )}
                  >
                    {i + 1}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className={cn("si-heading block", cn(
                        "truncate text-[0.82rem] font-medium",
                        current ? "text-cobalt-700" : "text-ink",
                      ))}>
                      {`${formatNumber(chapter.number)}.${formatNumber(i + 1)} ${lesson.title}`}
                    </span>
                  </span>

                  {finished ? (
                    <Check
                      size={15}
                      className="shrink-0 text-cobalt-600"
                      aria-label={t.course.read}
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="h-4 w-4 shrink-0 rounded-full ring-1 ring-line"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
