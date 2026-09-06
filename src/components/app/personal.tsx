"use client";

import Link from "next/link";
import { BookMarked, BookOpen, Check, FileText, Layers } from "lucide-react";

import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Empty, ProgressRing, Stat } from "@/components/ui";
import type {
  PersonChapter,
  PersonLesson,
  PersonPrompt,
} from "@/lib/course";
import { useCourseProgress, useHydrated, useProgress } from "@/lib/progress";
import { t } from "@/lib/strings";
import { cn, formatNumber, formatPercent } from "@/lib/utils";

/**
 * The three pages built entirely from the learner's own stored state.
 *
 * Their data shapes live in `@/lib/course` next to the server functions that
 * produce them — `import type` is erased, so nothing from the content registry
 * follows these types into the client bundle.
 */
export type {
  PersonChapter,
  PersonLesson,
  PersonPrompt,
} from "@/lib/course";

/* -------------------------------------------------------------------------- */
/*  My learning                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Everything the learner has read, lesson by lesson.
 *
 * This is the one page that shows the whole picture, so it shows sections
 * rather than only whole lessons — a lesson three sections into five is real
 * progress and a page that rounds it to "not done" is discouraging and wrong.
 */
export function MyLearning({ lessons }: { lessons: PersonLesson[] }) {
  const progress = useCourseProgress(lessons);
  const completed = useProgress((s) => s.completed);
  const hydrated = useHydrated();

  const started = lessons.filter(
    (l) => (hydrated ? (completed[l.slug]?.length ?? 0) : 0) > 0,
  );

  return (
    <div>
      <section className="flex flex-wrap items-center gap-x-10 gap-y-5 rounded-2xl bg-surface px-6 py-5 shadow-card ring-1 ring-line">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <ProgressRing ratio={progress.ratio} size={64} stroke={5} />
            <span className="absolute inset-0 flex items-center justify-center font-display text-xs font-semibold text-ink">
              {formatPercent(progress.ratio)}
            </span>
          </div>
          <span className="si-heading block text-sm font-medium text-ink">
            {t.course.progress}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Stat
            icon={<BookOpen size={15} />}
            value={formatNumber(progress.lessonsDone)}
            label={t.course.lessons}
          />
          <Stat
            icon={<Layers size={15} />}
            value={formatNumber(progress.done)}
            label={t.course.sections}
          />
        </div>
      </section>

      {started.length === 0 ? (
        <div className="mt-6">
          <Empty title={t.mine.learningEmpty} body={t.dashboard.startFirst} />
        </div>
      ) : (
        <Stagger className="mt-6 space-y-3" gap={0.05}>
          {started.map((lesson) => {
            const done = Math.min(
              completed[lesson.slug]?.length ?? 0,
              lesson.sectionCount,
            );
            const ratio = lesson.sectionCount ? done / lesson.sectionCount : 0;
            const finished =
              lesson.sectionCount > 0 && done >= lesson.sectionCount;

            return (
              <StaggerItem key={lesson.slug}>
                <Link
                  href={`/lessons/${lesson.slug}`}
                  className="flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:ring-cobalt-500/40"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-semibold",
                      finished
                        ? "bg-cobalt-500 text-on-brand"
                        : "bg-cobalt-100 text-cobalt-600",
                    )}
                  >
                    {finished ? <Check size={17} strokeWidth={2.5} /> : done}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="si-heading block font-display text-[0.98rem] font-semibold text-ink">
                      {lesson.title}
                    </span>
                    <span className="mt-2 block h-1 overflow-hidden rounded-full bg-surface-2">
                      <span
                        className="block h-full rounded-full bg-cobalt-500 transition-[width] duration-700 ease-out"
                        style={{ width: `${Math.round(ratio * 100)}%` }}
                      />
                    </span>
                    <span className="mt-1.5 block text-[0.68rem] text-ink-faint">
                      {done} / {lesson.sectionCount} {t.course.sections}
                      {lesson.chapterTitle ? ` · ${lesson.chapterTitle}` : ""}
                    </span>
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Notes                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Every reflection the learner has written, with the prompt that asked for it.
 *
 * The text is shown but not editable here. It is edited where it was written,
 * next to the teaching that prompted it — a second editor would be a second
 * place for the same record to drift.
 */
export function NotesList({ prompts }: { prompts: PersonPrompt[] }) {
  const reflections = useProgress((s) => s.reflections);
  const hydrated = useHydrated();

  const written = hydrated
    ? prompts.filter((p) => (reflections[p.storeKey] ?? "").trim().length > 0)
    : [];

  if (written.length === 0) {
    return <Empty title={t.mine.notesEmpty} />;
  }

  return (
    <Stagger className="space-y-4" gap={0.05}>
      {written.map((prompt) => (
        <StaggerItem key={prompt.storeKey}>
          <article className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
            <div className="flex items-start gap-3">
              <FileText
                size={16}
                aria-hidden
                className="mt-1 shrink-0 text-ink-faint"
              />
              <div className="min-w-0 flex-1">
                <p className="si-heading text-sm font-medium text-ink">
                  {prompt.prompt}
                </p>
                <p className="prose-dhamma mt-3 whitespace-pre-wrap text-[0.95rem]">
                  {reflections[prompt.storeKey]}
                </p>
                <Link
                  href={`/lessons/${prompt.lessonSlug}#section-${prompt.sectionId}`}
                  className="si-heading mt-4 inline-flex items-center gap-1.5 text-xs text-ink-faint transition-colors hover:text-cobalt-600"
                >
                  {prompt.lessonTitle} — {prompt.sectionTitle}
                  <span aria-hidden>&rarr;</span>
                </Link>
              </div>
            </div>
          </article>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bookmarks                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Two lists, because there are two kinds of bookmark and conflating them makes
 * both useless: the things the learner deliberately saved, and the places the
 * app remembered on their behalf as they read.
 */
export function BookmarksList({
  lessons,
  chapters,
}: {
  lessons: PersonLesson[];
  chapters: PersonChapter[];
}) {
  const saved = useProgress((s) => s.saved);
  const bookmark = useProgress((s) => s.bookmark);
  const toggleSaved = useProgress((s) => s.toggleSaved);
  const hydrated = useHydrated();

  const lessonBySlug = new Map(lessons.map((l) => [l.slug, l]));
  const chapterBySlug = new Map(chapters.map((c) => [c.slug, c]));

  const savedChapters = hydrated
    ? saved
        .filter((k) => k.startsWith("chapter:"))
        .map((k) => chapterBySlug.get(k.slice("chapter:".length)))
        .filter((c): c is PersonChapter => Boolean(c))
    : [];

  const savedLessons = hydrated
    ? saved
        .filter((k) => k.startsWith("lesson:"))
        .map((k) => lessonBySlug.get(k.slice("lesson:".length)))
        .filter((l): l is PersonLesson => Boolean(l))
    : [];

  /** Where reading stopped, most recent first. */
  const places = hydrated
    ? Object.entries(bookmark)
        .reverse()
        .map(([slug, sectionId]) => {
          const lesson = lessonBySlug.get(slug);
          const section = lesson?.sections.find((s) => s.id === sectionId);
          return lesson && section ? { lesson, section } : undefined;
        })
        .filter(
          (
            p,
          ): p is {
            lesson: PersonLesson;
            section: { id: string; title: string };
          } => Boolean(p),
        )
    : [];

  const nothing =
    savedChapters.length === 0 &&
    savedLessons.length === 0 &&
    places.length === 0;

  if (nothing) return <Empty title={t.mine.bookmarksEmpty} />;

  return (
    <div className="space-y-10">
      {savedChapters.length > 0 || savedLessons.length > 0 ? (
        <section>
          <h2 className="si-heading block font-display text-lg font-semibold text-ink">
            {t.app.bookmarks}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {savedChapters.map((chapter) => (
              <li key={`chapter-${chapter.slug}`}>
                <SavedRow
                  href={`/chapters/${chapter.slug}`}
                  kind={t.course.chapter}
                  title={chapter.title}
                  onRemove={() => toggleSaved(`chapter:${chapter.slug}`)}
                />
              </li>
            ))}
            {savedLessons.map((lesson) => (
              <li key={`lesson-${lesson.slug}`}>
                <SavedRow
                  href={`/lessons/${lesson.slug}`}
                  kind={t.course.lesson}
                  title={lesson.title}
                  onRemove={() => toggleSaved(`lesson:${lesson.slug}`)}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {places.length > 0 ? (
        <section>
          <h2 className="si-heading block font-display text-lg font-semibold text-ink">
            {t.mine.continueFrom}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {places.map(({ lesson, section }) => (
              <li key={lesson.slug}>
                <Link
                  href={`/lessons/${lesson.slug}#section-${section.id}`}
                  className="flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:ring-cobalt-500/40"
                >
                  <BookMarked
                    size={17}
                    aria-hidden
                    className="shrink-0 text-cobalt-600"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="si-heading block truncate font-display text-[0.95rem] font-semibold text-ink">
                      {lesson.title}
                    </span>
                    <span className="si-heading mt-1 block truncate text-[0.7rem] text-ink-faint">
                      {t.mine.lastSection}: {section.title}
                    </span>
                  </span>
                  <span aria-hidden className="shrink-0 text-ink-faint">
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function SavedRow({
  href,
  kind,
  title,
  onRemove,
}: {
  href: string;
  kind: string;
  title: string;
  onRemove: () => void;
}) {
  /**
   * The remove control is a sibling of the link, never nested inside it — a
   * button within an anchor is invalid HTML and breaks screen readers.
   */
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line transition-colors hover:ring-cobalt-500/40">
      <Link href={href} className="flex min-w-0 flex-1 items-center gap-4">
        <span className="shrink-0 rounded-full bg-cobalt-100 px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-wide text-cobalt-600">
          {kind}
        </span>
        <span className="si-heading block min-w-0 truncate font-display text-[0.95rem] font-semibold text-ink">
          {title}
        </span>
      </Link>
      <button
        type="button"
        onClick={onRemove}
        className="si-heading shrink-0 rounded-full px-3 py-1.5 text-xs text-ink-faint transition-colors hover:bg-surface-2 hover:text-rose-500"
      >
        {t.sort.remove}
      </button>
    </div>
  );
}
