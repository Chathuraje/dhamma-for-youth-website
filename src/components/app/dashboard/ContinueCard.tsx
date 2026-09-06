"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { ChapterArt } from "@/components/chapter/ChapterArt";
import type { ChapterSummary } from "@/lib/course";
import { useCourseProgress } from "@/lib/progress";
import { t } from "@/lib/strings";
import { formatNumber, formatPercent } from "@/lib/utils";

/**
 * Where to pick back up.
 *
 * It names one lesson — the first with unread sections — and shows how far
 * through that lesson's *chapter* the learner is. Chapter-level, because "you
 * are 60% through this chapter" is a reason to keep going and "you are 0%
 * through this lesson" is not.
 *
 * Before hydration it renders the first lesson of the course at zero, which is
 * exactly right for someone who has never been here.
 */
export function ContinueCard({ chapters }: { chapters: ChapterSummary[] }) {
  const all = chapters.flatMap((c) => c.lessons);
  const overall = useCourseProgress(all);

  /** The chapter that owns the lesson we are sending them to. */
  const chapter =
    chapters.find((c) =>
      c.lessons.some((l) => l.slug === overall.next?.slug),
    ) ?? chapters[0];

  const inChapter = useCourseProgress(chapter?.lessons ?? []);
  const lesson =
    chapter?.lessons.find((l) => l.slug === overall.next?.slug) ??
    chapter?.lessons[0];

  if (!chapter || !lesson) return null;

  const remaining = Math.max(inChapter.lessonCount - inChapter.lessonsDone, 0);
  const index = chapter.lessons.findIndex((l) => l.slug === lesson.slug) + 1;

  return (
    <section className="overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line">
      <header className="px-5 pt-5">
        <h2 className="si-heading font-display text-base font-semibold text-ink">
          {t.dashboard.continueHeading}
        </h2>
      </header>

      <div className="mt-4 flex items-start gap-4 px-5">
        <ChapterArt
          src={chapter.image}
          number={chapter.number}
          className="h-16 w-16 shrink-0 rounded-xl"
        />

        <div className="min-w-0 flex-1">
          <span className="si-heading inline-block rounded-full bg-cobalt-100 px-2 py-0.5 text-[0.62rem] font-medium text-cobalt-ink">
            {t.dashboard.currentLesson}
          </span>

          <p className="si-heading mt-2 font-display text-[0.98rem] font-semibold text-ink">
            <span className="font-mono text-cobalt-ink">
              {formatNumber(chapter.number)}.{formatNumber(index)}
            </span>{" "}
            {lesson.title}
          </p>
          <p className="si-heading mt-1 line-clamp-2 text-xs leading-relaxed text-ink-faint">
            {lesson.subtitle}
          </p>
        </div>
      </div>

      <div className="mt-4 px-5">
        <div className="flex items-center justify-between gap-3">
          <span className="si-heading inline-flex items-center gap-1.5 text-[0.7rem] text-ink-faint">
            <BookOpen size={12} aria-hidden />
            {remaining > 0
              ? `${formatNumber(remaining)} ${t.dashboard.lessonsLeft}`
              : t.dashboard.allDone}
          </span>
          <span className="font-mono text-xs font-semibold text-cobalt-ink">
            {formatPercent(inChapter.ratio)}
          </span>
        </div>

        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3"
          role="progressbar"
          aria-valuenow={Math.round(inChapter.ratio * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${chapter.title} — ${t.course.progress}`}
        >
          <div
            className="h-full rounded-full bg-cobalt-500 transition-[width] duration-700 ease-out"
            style={{ width: `${Math.round(inChapter.ratio * 100)}%` }}
          />
        </div>
      </div>

      <div className="p-5">
        <Link
          href={`/lessons/${lesson.slug}`}
          className="si-heading flex w-full items-center justify-center gap-2 rounded-full bg-cobalt-500 px-4 py-3 text-sm font-medium text-on-brand transition-colors hover:bg-cobalt-600"
        >
          {t.dashboard.continueCta}
          <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
