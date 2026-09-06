"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";

import { ChapterArt } from "@/components/chapter/ChapterArt";
import { Panel, PanelAction } from "@/components/ui";
import type { ChapterSummary } from "@/lib/course";
import { useCourseProgress } from "@/lib/progress";
import { t } from "@/lib/strings";
import { cn, formatNumber } from "@/lib/utils";

/**
 * The course as a path: each chapter a stage, in teaching order.
 *
 * It scrolls inside its own container rather than wrapping, so the sequence
 * stays legible as a sequence — a path that reflows into a grid stops reading
 * as one thing after another.
 *
 * There is deliberately **no scroll snapping**. `scroll-snap-type: x mandatory`
 * made the strip slide forward on its own with nobody touching it: the browser
 * re-snaps whenever the container's layout settles, and the panel's entrance
 * animation settles it on every load. It fought keyboard scrolling too. Two
 * buttons do the job snapping was there for, and they are reachable by Tab.
 */
export function LearningPath({ chapters }: { chapters: ChapterSummary[] }) {
  const track = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const [at, setAt] = useState({ start: true, end: true });

  /** Which arrows are usable. Both true means nothing overflows. */
  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAt({
      start: el.scrollLeft <= 1,
      // 1px of slack: sub-pixel widths never let scrollLeft reach max exactly.
      end: el.scrollLeft >= max - 1,
    });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;

    measure();
    el.addEventListener("scroll", measure, { passive: true });

    /** Card widths change with the viewport, so remeasure when the box does. */
    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure, chapters.length]);

  const nudge = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({
      left: direction * Math.max(el.clientWidth * 0.8, 260),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  /** Nothing overflows, so the controls would be two dead buttons. */
  const scrollable = !(at.start && at.end);

  return (
    <Panel
      title={t.dashboard.learningPath}
      action={
        <div className="flex items-center gap-1">
          {scrollable ? (
            <>
              <Nudge
                direction="prev"
                disabled={at.start}
                onClick={() => nudge(-1)}
              />
              <Nudge
                direction="next"
                disabled={at.end}
                onClick={() => nudge(1)}
              />
              <span aria-hidden className="mx-1 h-4 w-px bg-line" />
            </>
          ) : null}
          <PanelAction href="/chapters">{t.dashboard.viewFullPath}</PanelAction>
        </div>
      }
      bodyClassName="px-0 sm:px-0"
    >
      <ol
        ref={track}
        tabIndex={0}
        aria-label={t.dashboard.learningPath}
        className="flex gap-3 overflow-x-auto px-5 pb-2 sm:px-6"
      >
        {chapters.map((chapter, i) => (
          <li key={chapter.slug} className="flex shrink-0 items-center gap-3">
            <Stage chapter={chapter} />
            {i < chapters.length - 1 ? (
              <ChevronRight
                size={16}
                aria-hidden
                className="shrink-0 text-ink-mute"
              />
            ) : null}
          </li>
        ))}
      </ol>
    </Panel>
  );
}

function Nudge({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "next" ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "next" ? t.course.next : t.course.previous}
      className="flex h-7 w-7 items-center justify-center rounded-full text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink disabled:pointer-events-none disabled:text-ink-mute/50"
    >
      <Icon size={16} aria-hidden />
    </button>
  );
}

/**
 * One chapter as a card: its artwork, where the learner stands in it, and how
 * much of it is read.
 *
 * The chip says **state**, not difficulty. "මූලික / මධ්‍යම / ගැඹුරු" told a
 * learner how hard someone else found the material, which is not information
 * they can act on; "සම්පූර්ණයි / දැනට / නව" tells them where they are. The
 * `difficulty` field stays in the content model — nothing renders it.
 */
function Stage({ chapter }: { chapter: ChapterSummary }) {
  const progress = useCourseProgress(chapter.lessons);

  /** The stage a learner is actually on: started but not finished. */
  const current = progress.started && !progress.finished;

  const state = progress.finished
    ? { label: t.dashboard.stateDone, tone: "bg-cobalt-500 text-on-brand" }
    : current
      ? { label: t.dashboard.stateCurrent, tone: "bg-jade-500 text-on-brand" }
      : { label: t.dashboard.stateNew, tone: "bg-rail-ink/15 text-rail-ink" };

  const pct = Math.round(progress.ratio * 100);

  return (
    <Link
      href={`/chapters/${chapter.slug}`}
      className={cn(
        "group flex h-full w-[15.5rem] flex-col overflow-hidden rounded-2xl ring-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift",
        progress.finished
          ? "bg-surface ring-cobalt-500/30"
          : current
            ? "bg-surface ring-cobalt-500/50"
            : "bg-surface ring-line hover:ring-cobalt-500/30",
      )}
    >
      {/* -- artwork ---------------------------------------------------- */}
      <div className="relative h-24 overflow-hidden">
        <ChapterArt
          src={chapter.image}
          number={chapter.number}
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {/* Scrim: the numeral and the chip have to stay legible over whatever
            photograph replaces the placeholder. */}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-rail/85 via-rail/25 to-rail/40"
        />

        <span
          aria-hidden
          className="absolute bottom-2 left-3 font-display text-xl font-semibold leading-none text-rail-ink drop-shadow"
        >
          {String(chapter.number).padStart(2, "0")}
        </span>

        <span
          className={cn(
            "si-heading absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 text-[0.62rem] font-medium backdrop-blur-sm",
            state.tone,
          )}
        >
          {state.label}
        </span>
      </div>

      {/* -- the chapter ------------------------------------------------ */}
      <div className="flex flex-1 flex-col p-4">
        <span className="si-heading block font-display text-[0.95rem] font-semibold text-ink transition-colors group-hover:text-cobalt-ink">
          {chapter.title}
        </span>

        <p className="si-heading mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-faint">
          {chapter.summary}
        </p>

        <div className="mt-auto pt-4">
          <div
            className="h-1.5 overflow-hidden rounded-full bg-surface-3"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${chapter.title} — ${t.course.progress}`}
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-700 ease-out",
                progress.finished ? "bg-jade-500" : "bg-cobalt-500",
              )}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="si-heading text-[0.65rem] text-ink-faint">
              {formatNumber(progress.done)} / {formatNumber(progress.total)}{" "}
              {t.course.sections}
            </span>
            <span className="font-mono text-[0.65rem] font-semibold text-ink-dim">
              {pct}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
