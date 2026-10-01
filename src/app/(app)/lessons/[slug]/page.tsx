import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";

import { Breadcrumbs } from "@/components/app/Breadcrumbs";
import { BlockRenderer } from "@/components/lesson/BlockRenderer";
import { LessonActions } from "@/components/lesson/LessonActions";
import { LessonBanner } from "@/components/lesson/LessonBanner";
import { LessonChapterProgress } from "@/components/lesson/LessonChapterProgress";
import { LessonRail } from "@/components/lesson/LessonRail";
import { SectionHeading } from "@/components/lesson/SectionHeading";
import { Sources } from "@/components/lesson/Sources";
import {
  chapterLessons,
  chapterOf,
  visibleChapters,
} from "@/content/chapters";
import { allLessons, getLesson, lessonNeighbours } from "@/content/lessons";
import { figureSrc } from "@/lib/images";
import { t } from "@/lib/strings";
import type { Chapter, Lesson } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

/**
 * The step every column of this page starts on.
 *
 * The hero is a card, so its text sits one padding step in from the column
 * edge. The breadcrumb and the lesson body take the same step, so all three
 * begin on one vertical line instead of three. `LessonBanner` pads itself to
 * the same values.
 */
const LESSON_GUTTER = "px-4 sm:px-8";

export function generateStaticParams() {
  return allLessons().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/lessons/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "පාඩම හමු නොවීය" };

  return {
    title: lesson.title,
    description: lesson.summary,
    openGraph: { title: lesson.title, description: lesson.summary },
  };
}

/**
 * THE LESSON PLAYER
 * =================
 * Three parts: a banner that says where this lesson sits, the teaching in one
 * measured column, and a right rail carrying the learner's place in it — the
 * chapter's progress, this lesson's outline, what it is for, and the way on.
 *
 * The whole page is a server component apart from the rail (which observes the
 * sections rather than owning them), the two controls on the breadcrumb line,
 * and the individual interactive blocks. Lesson content never crosses the
 * client boundary.
 *
 * `data-lesson-grid` / `data-lesson-aside` / `data-lesson-crumbs` are the
 * hooks study mode collapses — see the STUDY MODE block in globals.css.
 */
export default async function LessonPage({
  params,
}: PageProps<"/lessons/[slug]">) {
  const { slug } = await params;

  // Lesson 2.2 was consolidated into 2.1. Keep old bookmarks and shared links
  // useful by taking readers directly to the first formerly-2.2 section.
  if (slug === "paramarthaya-handunaganima") {
    redirect("/lessons/sammuti-paramattha#section-niti-dekak");
  }

  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const chapter = chapterOf(slug);

  /**
   * The chapter's lessons, resolved here so the rail ships data rather than
   * the whole content registry.
   *
   * `chapterLessons` drops drafts in production, but `generateStaticParams`
   * builds a page for every lesson including drafts — so a draft would arrive
   * at a spine with no place to open its sections. Put it back in its chapter
   * position when that happens; it is the page being read either way.
   */
  const siblings = chapterSiblings(lesson, chapter);
  const indexInChapter = siblings.findIndex((l) => l.slug === slug);

  const { prev, next } = lessonNeighbours(slug);

  /**
   * The chapter after this one, offered only on a chapter's last lesson. Mid
   * chapter it would be an invitation to leave something unfinished; at the
   * end it is the one thing the reader is likely to want.
   */
  const chapters = visibleChapters();
  const here = chapter ? chapters.findIndex((c) => c.slug === chapter.slug) : -1;
  const onLastLesson =
    siblings.length > 0 && indexInChapter === siblings.length - 1;
  const nextChapter =
    onLastLesson && here >= 0 ? chapters[here + 1] : undefined;

  return (
    <div className="mx-auto w-full max-w-[92rem] px-4 py-5 sm:px-6 sm:py-6">
      <div data-lesson-crumbs className={LESSON_GUTTER}>
        <Breadcrumbs
          crumbs={[
            { label: t.nav.chapters, href: "/chapters" },
            ...(chapter
              ? [
                  {
                    label: String(chapter.number).padStart(2, "0"),
                    href: `/chapters/${chapter.slug}`,
                  },
                ]
              : []),
            {
              label: chapter
                ? `${formatNumber(chapter.number)}.${formatNumber(indexInChapter + 1)}`
                : formatNumber(lesson.number),
            },
          ]}
          actions={<LessonActions slug={lesson.slug} />}
          className="mb-5"
        />
      </div>

      <div
        data-lesson-grid
        className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]"
      >
        {/* -- the lesson --------------------------------------------------- */}
        <div className="min-w-0">
          <LessonBanner
            chapter={
              chapter
                ? {
                    slug: chapter.slug,
                    number: chapter.number,
                    title: chapter.title,
                  }
                : undefined
            }
            position={
              indexInChapter >= 0
                ? { index: indexInChapter + 1, total: siblings.length }
                : undefined
            }
            number={lesson.number}
            title={lesson.title}
            subtitle={lesson.subtitle}
            progress={
              siblings.length > 0 ? (
                <LessonChapterProgress
                  lessons={siblings.map((l) => ({
                    slug: l.slug,
                    sectionCount: l.sections.length,
                  }))}
                />
              ) : undefined
            }
            image={chapter?.image ? figureSrc(chapter.image) : undefined}
            isDraft={lesson.status === "draft"}
          />

          <div className={cn("mt-8", LESSON_GUTTER)}>
            {lesson.sections.map((section, si) => (
              <section
                key={section.id}
                id={`section-${section.id}`}
                className="scroll-mt-24 pb-16"
                aria-labelledby={`heading-${section.id}`}
              >
                <SectionHeading
                  id={section.id}
                  index={si + 1}
                  title={section.title}
                  pali={section.pali}
                  brief={section.brief}
                />

                {section.blocks.map((block, bi) => (
                  <BlockRenderer
                    key={bi}
                    block={block}
                    lessonSlug={lesson.slug}
                    sectionId={section.id}
                    index={bi}
                  />
                ))}
              </section>
            ))}

            <Sources sources={lesson.sources} />

            {nextChapter ? (
              <Link
                href={`/chapters/${nextChapter.slug}`}
                className="group mt-10 flex items-center gap-4 overflow-hidden rounded-2xl bg-cobalt-800 p-6 text-rail-ink shadow-card ring-1 ring-cobalt-900/40 transition-colors hover:bg-cobalt-700"
              >
                <span className="min-w-0 flex-1">
                  <span className="si-heading block text-[0.68rem] font-medium uppercase tracking-[0.12em] text-cobalt-300">
                    {t.course.chapterDone} &middot; {t.course.nextChapter}
                  </span>
                  <span className="si-heading mt-2 flex flex-wrap items-baseline gap-x-3">
                    <span className="font-mono text-sm text-cobalt-300">
                      {String(nextChapter.number).padStart(2, "0")}
                    </span>
                    <span className="si-tight font-display text-lg font-semibold sm:text-xl">
                      {nextChapter.title}
                    </span>
                  </span>
                  <span className="si-heading mt-1.5 block max-w-xl text-[0.83rem] text-cobalt-300">
                    {nextChapter.subtitle}
                  </span>
                </span>
                <ArrowRight
                  size={20}
                  aria-hidden
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            ) : null}
          </div>
        </div>

        {/* -- the learner's place ------------------------------------------ */}
        <aside
          data-lesson-aside
          className="space-y-5 xl:sticky xl:top-24 xl:max-h-[calc(100dvh-7rem)] xl:self-start xl:overflow-y-auto xl:pb-4"
        >
          <LessonRail
            slug={lesson.slug}
            sections={lesson.sections.map((s) => ({
              id: s.id,
              title: s.title,
              brief: s.brief,
            }))}
          />

          <section className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line">
            <div className="flex items-start gap-2.5">
              <FileText
                size={16}
                aria-hidden
                className="mt-0.5 shrink-0 text-ink-faint"
              />
              <h2 className="si-heading block font-display text-base font-semibold text-ink">
                {t.lesson.summary}
              </h2>
            </div>
            <p className="si-heading mt-3 text-[0.83rem] leading-relaxed text-ink-dim">
              {lesson.summary}
            </p>
          </section>

          {/*
            Forward and back live here now, not at the foot of the reading
            column. A learner who wants the next lesson wants it from wherever
            they stopped, and the rail is in reach the whole way down; the pair
            of buttons under the sources was reachable only by finishing the
            scroll. Next is the filled card because it is the one action the
            page is for; previous is quiet, because going back is a correction
            rather than a step.
          */}
          {next ? (
            <Link
              href={`/lessons/${next.slug}`}
              className="flex items-center gap-3 rounded-2xl bg-cobalt-800 p-5 text-rail-ink shadow-card transition-colors hover:bg-cobalt-700"
            >
              <span className="min-w-0 flex-1">
                <span className="si-heading block text-[0.7rem] font-medium uppercase tracking-[0.1em] text-cobalt-ink">
                  {t.course.nextLesson}
                </span>
                <span className="si-heading block mt-1.5 truncate font-display text-sm font-semibold">
                  {next.title}
                </span>
              </span>
              <ArrowRight size={17} aria-hidden className="shrink-0" />
            </Link>
          ) : null}

          {prev ? (
            <Link
              href={`/lessons/${prev.slug}`}
              className="group flex items-center gap-3 rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line transition-colors hover:ring-cobalt-500/40"
            >
              <ArrowLeft
                size={17}
                aria-hidden
                className="shrink-0 text-ink-faint transition-colors group-hover:text-cobalt-600"
              />
              <span className="min-w-0 flex-1">
                <span className="si-heading block text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink-faint">
                  {t.course.previousLesson}
                </span>
                <span className="si-heading mt-1.5 block truncate font-display text-sm font-semibold text-ink">
                  {prev.title}
                </span>
              </span>
            </Link>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** Every lesson on this lesson's chapter spine, in teaching order. */
function chapterSiblings(lesson: Lesson, chapter: Chapter | undefined): Lesson[] {
  if (!chapter) return [];

  const visible = chapterLessons(chapter);
  if (visible.some((l) => l.slug === lesson.slug)) return visible;

  return [...visible, lesson].sort(
    (a, b) => chapter.lessons.indexOf(a.slug) - chapter.lessons.indexOf(b.slug),
  );
}
