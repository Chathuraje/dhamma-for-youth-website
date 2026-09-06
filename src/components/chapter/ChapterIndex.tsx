"use client";

import Link from "next/link";
import { ArrowRight, Check, Layers, RotateCcw } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ProgressRing, Stat } from "@/components/ui";
import type { ChapterSummary } from "@/lib/course";
import { useCourseProgress, useProgress } from "@/lib/progress";
import { t } from "@/lib/strings";
import { cn, formatNumber, formatPercent } from "@/lib/utils";

interface Totals {
  chapters: number;
  lessons: number;
  sections: number;
  minutes: number;
  terms: number;
}

/**
 * The course as a list of chapters, with the learner's progress through each.
 *
 * Client-side because every row reads the browser's own store. The chapter
 * data itself arrives as props from the server, so the content registry stays
 * out of the bundle.
 */
export function ChapterIndex({
  chapters,
  totals,
  className,
}: {
  chapters: ChapterSummary[];
  totals: Totals;
  className?: string;
}) {
  const lessons = chapters.flatMap((c) => c.lessons);
  const progress = useCourseProgress(lessons);
  const resetAll = useProgress((s) => s.resetAll);

  const target = progress.next?.slug ?? lessons[0]?.slug;

  return (
    <div className={className}>
      {/* -- the course's own figures ------------------------------------- */}
      <Reveal>
        <section className="flex flex-wrap items-center gap-x-10 gap-y-5 rounded-2xl bg-surface px-6 py-5 shadow-card ring-1 ring-line">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <ProgressRing ratio={progress.ratio} size={56} stroke={5} />
              <span className="absolute inset-0 flex items-center justify-center font-display text-[0.7rem] font-semibold text-ink">
                {formatPercent(progress.ratio)}
              </span>
            </div>
            <span className="si-heading block text-sm font-medium text-ink">
              {t.course.progress}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Stat
              icon={<Layers size={15} />}
              value={formatNumber(totals.chapters)}
              label={t.nav.chapters}
            />
            <Stat
              icon={<Layers size={15} />}
              value={formatNumber(totals.lessons)}
              label={t.course.lessons}
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {target ? (
              <Link
                href={`/lessons/${target}`}
                className="inline-flex items-center gap-2 rounded-full bg-cobalt-500 px-4 py-2.5 text-on-brand transition-colors hover:bg-cobalt-600"
              >
                <span className="si-heading block text-sm font-medium leading-none">
                  {progress.started ? t.course.resume : t.course.begin}
                </span>
                <ArrowRight size={15} aria-hidden />
              </Link>
            ) : null}

            {progress.started ? (
              <button
                type="button"
                onClick={resetAll}
                className="si-heading inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <RotateCcw size={12} aria-hidden />
                {t.spine.clear}
              </button>
            ) : null}
          </div>
        </section>
      </Reveal>

      {/* -- the chapters --------------------------------------------------- */}
      <Stagger className="mt-5 space-y-4" gap={0.07}>
        {chapters.map((chapter) => (
          <StaggerItem key={chapter.slug}>
            <ChapterRow chapter={chapter} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

function ChapterRow({ chapter }: { chapter: ChapterSummary }) {
  const progress = useCourseProgress(chapter.lessons);

  return (
    <Link
      href={`/chapters/${chapter.slug}`}
      className="group grid gap-5 rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:ring-cobalt-500/40 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start"
    >
      <span
        aria-hidden
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-lg font-semibold",
          progress.finished
            ? "bg-cobalt-500 text-on-brand"
            : "bg-cobalt-100 text-cobalt-600",
        )}
      >
        {progress.finished ? (
          <Check size={20} strokeWidth={2.5} />
        ) : (
          String(chapter.number).padStart(2, "0")
        )}
      </span>

      <span className="min-w-0">
        <span className="si-heading block font-display text-xl font-semibold text-ink">
          {chapter.title}
        </span>
        <span className="prose-dhamma mt-2.5 block max-w-2xl text-[0.95rem]">
          {chapter.summary}
        </span>

        <span className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.7rem] text-ink-faint">
          <span className="inline-flex items-center gap-1">
            <Layers size={11} aria-hidden />
            {formatNumber(chapter.lessons.length)} {t.course.lessons}
          </span>
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end">
        <span className="relative">
          <ProgressRing ratio={progress.ratio} size={44} stroke={4} />
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[0.6rem] font-semibold text-ink">
            {Math.round(progress.ratio * 100)}
          </span>
        </span>
        <span className="si-heading inline-flex items-center gap-1 text-xs font-medium text-cobalt-600">
          {progress.started ? t.course.resume : t.course.begin}
          <ArrowRight
            size={13}
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </span>
      </span>
    </Link>
  );
}
