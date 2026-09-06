"use client";

import { t } from "@/lib/strings";
import { type ProgressLesson, useCourseProgress } from "@/lib/progress";
import { formatNumber, formatPercent } from "@/lib/utils";

/**
 * How far through the chapter the learner is, shown in the lesson's hero.
 *
 * It used to be the first card in the side rail, where it competed with the
 * outline directly beneath it — two progress readings, one above the other,
 * counting different things. In the hero it sits next to "lesson 1 of 3",
 * which is the same fact at a coarser grain, and the rail is left to do the
 * one job it is good at.
 *
 * Chapter-level rather than lesson-level on purpose: the lesson's own progress
 * is the outline, counted section by section.
 *
 * Toned for the banner, not for a card — the ground here is cobalt, so the
 * track and the fill are drawn against it rather than against paper.
 */
export function LessonChapterProgress({
  lessons,
}: {
  lessons: ProgressLesson[];
}) {
  const progress = useCourseProgress(lessons);
  const percent = Math.round(progress.ratio * 100);

  return (
    <div className="w-full min-w-0 sm:max-w-xs">
      <div className="flex items-baseline justify-between gap-3">
        <span className="si-heading text-[0.78rem] font-medium text-cobalt-300">
          {t.course.progress}
        </span>
        <span className="si-heading text-[0.78rem] text-rail-ink">
          {formatNumber(progress.lessonsDone)} /{" "}
          {formatNumber(progress.lessonCount)} {t.course.lessons}
          <span className="ml-2 font-mono text-[0.72rem] tabular-nums text-cobalt-300">
            {formatPercent(progress.ratio)}
          </span>
        </span>
      </div>

      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-cobalt-900/60"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t.course.progress}
      >
        <div
          className="h-full rounded-full bg-cobalt-400 transition-[width] duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
