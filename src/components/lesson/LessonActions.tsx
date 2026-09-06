"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Focus } from "lucide-react";

import { useSaved } from "@/lib/progress";
import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";

/**
 * The two controls that sit on the breadcrumb line of a lesson.
 *
 * Bookmark writes to the learner's own store and is read back by /bookmarks.
 * Study mode hides the rails and widens the reading column — the toggle sets a
 * flag on <html> and one rule in globals.css does the work, so the page's
 * server-rendered structure never changes and nothing re-renders to enter it.
 *
 * There is deliberately no "listen" control. There is no audio.
 */
export function LessonActions({ slug }: { slug: string }) {
  const bookmark = useSaved("lesson", slug);
  const [study, setStudy] = useState(false);

  /** Reading a lesson is the only place study mode means anything; leaving one
      must not leave the rest of the app stripped down. */
  useEffect(() => {
    const root = document.documentElement;
    if (study) root.dataset.study = "on";
    else delete root.dataset.study;
    return () => {
      delete root.dataset.study;
    };
  }, [study]);

  return (
    <>
      <button
        type="button"
        onClick={bookmark.toggle}
        aria-pressed={bookmark.saved}
        className={cn(
          "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition-colors",
          bookmark.saved
            ? "bg-cobalt-100 text-cobalt-700 ring-cobalt-500/30"
            : "bg-surface text-ink-dim ring-line hover:text-ink",
        )}
      >
        {bookmark.saved ? (
          <BookmarkCheck size={15} aria-hidden />
        ) : (
          <Bookmark size={15} aria-hidden />
        )}
        <span className="si-heading hidden sm:inline">
          {bookmark.saved ? t.lesson.bookmarked : t.lesson.bookmark}
        </span>
        <span className="sr-only sm:hidden">{t.lesson.bookmark}</span>
      </button>

      <button
        type="button"
        onClick={() => setStudy((s) => !s)}
        aria-pressed={study}
        title={t.lesson.studyModeNote}
        className={cn(
          "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition-colors",
          study
            ? "bg-cobalt-500 text-on-brand ring-cobalt-600"
            : "bg-surface text-ink-dim ring-line hover:text-ink",
        )}
      >
        <Focus size={15} aria-hidden />
        <span className="si-heading hidden sm:inline">{t.lesson.studyMode}</span>
        <span className="sr-only sm:hidden">{t.lesson.studyMode}</span>
      </button>
    </>
  );
}
