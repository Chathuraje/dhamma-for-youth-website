"use client";

import Link from "next/link";
import { BookMarked, BookOpen, Layers } from "lucide-react";

import { ProgressRing } from "@/components/ui";
import {
  type ProgressLesson,
  useCourseProgress,
  useProgress,
} from "@/lib/progress";
import { t } from "@/lib/strings";
import { formatNumber, formatPercent } from "@/lib/utils";

/**
 * The learner's own figures.
 *
 * Every number here is read from the browser's own store, so before hydration
 * it renders honest zeroes rather than a flash of somebody else's progress.
 *
 * The three tiles count what is actually recorded: lessons finished, sections
 * read, things bookmarked. They deliberately do **not** show study time or a
 * day streak. Time estimates were removed from the interface, and a streak
 * would mean storing which days somebody opened the site and then using it to
 * make them feel bad for missing one — `CLAUDE.md` rules out scores, streaks
 * and penalties, and this is the same idea wearing a different hat.
 */
export function ProgressPanel({ lessons }: { lessons: ProgressLesson[] }) {
  const progress = useCourseProgress(lessons);
  const bookmarks = useProgress((s) => s.bookmark);
  const saved = useProgress((s) => s.saved);

  const bookmarkCount = progress.hydrated
    ? new Set([
        ...Object.keys(bookmarks),
        ...saved.map((k) => k.slice(k.indexOf(":") + 1)),
      ]).size
    : 0;

  const remaining = Math.max(progress.lessonCount - progress.lessonsDone, 0);

  return (
    <section className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line">
      <header className="flex items-start justify-between gap-4">
        <h2 className="si-heading font-display text-base font-semibold text-ink">
          {t.dashboard.yourProgress}
        </h2>
        <Link
          href="/my-learning"
          className="shrink-0 whitespace-nowrap pt-0.5 text-xs font-medium text-ink-dim transition-colors hover:text-cobalt-600"
        >
          {t.dashboard.viewDetails}
          <span aria-hidden> &rarr;</span>
        </Link>
      </header>

      <div className="mt-5 flex items-center gap-5">
        <div className="relative shrink-0">
          <ProgressRing ratio={progress.ratio} size={84} stroke={7} />
          <span className="absolute inset-0 flex items-center justify-center font-display text-base font-semibold text-ink">
            {formatPercent(progress.ratio)}
          </span>
        </div>

        <div className="min-w-0">
          <p className="si-heading text-[0.95rem] font-semibold text-ink">
            {formatNumber(progress.lessonsDone)} /{" "}
            {formatNumber(progress.lessonCount)} {t.course.lessons}{" "}
            {t.dashboard.lessonsCompleted}
          </p>
          <p className="si-heading mt-1 text-xs text-ink-faint">
            {remaining > 0
              ? t.dashboard.lessonsRemaining.replace(
                  "{n}",
                  formatNumber(remaining),
                )
              : t.dashboard.allDone}
          </p>
        </div>
      </div>

      <ul className="mt-5 grid grid-cols-3 gap-2.5">
        <Tile
          icon={<BookOpen size={15} aria-hidden />}
          value={formatNumber(progress.lessonsDone)}
          label={t.dashboard.lessonsCompleted}
        />
        <Tile
          icon={<Layers size={15} aria-hidden />}
          value={formatNumber(progress.done)}
          label={t.dashboard.sectionsRead}
        />
        <Tile
          icon={<BookMarked size={15} aria-hidden />}
          value={formatNumber(bookmarkCount)}
          label={t.app.bookmarks}
        />
      </ul>
    </section>
  );
}

function Tile({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <li className="rounded-xl bg-surface-2 px-3 py-3">
      <span className="flex items-center gap-1.5 text-cobalt-ink">
        {icon}
        <span className="font-display text-base font-semibold leading-none text-ink">
          {value}
        </span>
      </span>
      <span className="si-heading mt-1.5 block text-[0.65rem] leading-tight text-ink-faint">
        {label}
      </span>
    </li>
  );
}
