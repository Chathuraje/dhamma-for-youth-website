import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  FileText,
  Key,
  Lightbulb,
  PencilLine,
  Target,
} from "lucide-react";

import { Breadcrumbs } from "@/components/app/Breadcrumbs";
import { ChapterAside } from "@/components/chapter/ChapterAside";
import { ChapterHero } from "@/components/chapter/ChapterHero";
import { ChapterTabs, type TabDef } from "@/components/chapter/ChapterTabs";
import { Reveal } from "@/components/motion/Reveal";
import { Empty } from "@/components/ui";
import { chapterLessons, getChapter, visibleChapters } from "@/content/chapters";
import {
  allKeyIdeas,
  allQuizzes,
  allReflects,
  chapterSources,
  summarise,
} from "@/lib/course";
import { figureSrc } from "@/lib/images";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import { formatNumber } from "@/lib/utils";

export function generateStaticParams() {
  return visibleChapters().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/chapters/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) return { title: t.notFound.title };

  return {
    title: chapter.title,
    description: chapter.summary,
    openGraph: { title: chapter.title, description: chapter.summary },
  };
}

/**
 * THE CHAPTER PAGE
 * ================
 * A chapter used to open straight into its first lesson, on the argument that
 * a page listing lessons tells a learner nothing. That was true of a page that
 * only listed lessons. This one does more: it says what the chapter covers,
 * what a learner will be able to do at the end of it, the points it turns on,
 * the questions it asks, and where the teaching comes from — with progress and
 * the resume action always in view on the right.
 *
 * Everything on it is derived from the lessons themselves. Nothing here is a
 * second, hand-maintained copy of the teaching, which is what made the old
 * per-chapter `reading` field a mistake.
 *
 * A server component. Only the right rail and the tab selection are client
 * code; every panel is rendered here and passed in as `content`.
 */
export default async function ChapterPage({
  params,
}: PageProps<"/chapters/[slug]">) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const summary = summarise(chapter);
  const lessons = chapterLessons(chapter);

  const keyIdeas = allKeyIdeas(lessons);
  const quizzes = allQuizzes(lessons);
  const reflects = allReflects(lessons);
  const sources = chapterSources(chapter);

  const tabs: TabDef[] = [
    {
      id: "overview",
      label: t.chapter.overview,
      icon: <Lightbulb size={15} />,
      content: (
        <Overview
          summary={chapter.summary}
          objectives={lessons.map((l) => ({
            lessonTitle: l.title,
            lessonSubtitle: l.subtitle,
            text: l.objectives[0],
          }))}
        />
      ),
    },
    {
      id: "lessons",
      label: t.nav.lessons,
      icon: <BookOpen size={15} />,
      count: summary.lessons.length,
      content: <LessonList chapter={summary} />,
    },
    {
      id: "key-points",
      label: t.chapter.keyPoints,
      icon: <Key size={15} />,
      count: keyIdeas.length,
      content:
        keyIdeas.length === 0 ? (
          <Empty title={t.chapter.noKeyPoints} />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {keyIdeas.map((idea, i) => (
              <li
                key={`${idea.lessonSlug}-${idea.sectionId}-${i}`}
                className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line"
              >
                <p className="si-heading font-display text-[0.98rem] leading-relaxed text-ink">
                  {rich(idea.block.text)}
                </p>
                <Link
                  href={`/lessons/${idea.lessonSlug}#section-${idea.sectionId}`}
                  className="si-heading mt-3 inline-flex items-center gap-1.5 text-xs text-ink-faint transition-colors hover:text-cobalt-600"
                >
                  {t.chapter.fromLesson} {formatNumber(idea.lessonNumber)} —{" "}
                  {idea.sectionTitle}
                  <span aria-hidden>&rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        ),
    },
    {
      id: "practice",
      label: t.chapter.practice,
      icon: <PencilLine size={15} />,
      count: quizzes.length,
      content:
        quizzes.length === 0 ? (
          <Empty title={t.chapter.noPractice} />
        ) : (
          <ul className="space-y-3">
            {quizzes.map((quiz, i) => (
              <li
                key={`${quiz.lessonSlug}-${quiz.sectionId}-${i}`}
                className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line"
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cobalt-100 font-mono text-xs font-semibold text-cobalt-600"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="si-heading text-[0.95rem] leading-relaxed text-ink">
                      {rich(quiz.block.question)}
                    </p>
                    <Link
                      href={`/lessons/${quiz.lessonSlug}#section-${quiz.sectionId}`}
                      className="si-heading mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-cobalt-600 hover:text-cobalt-700"
                    >
                      {t.practice.openLesson}
                      <span aria-hidden>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ),
    },
    {
      id: "references",
      label: t.chapter.references,
      icon: <FileText size={15} />,
      count: sources.length,
      content:
        sources.length === 0 ? (
          <Empty title={t.chapter.noSources} />
        ) : (
          <ul className="space-y-2.5">
            {sources.map((source, i) => (
              <li
                key={`${source.label}-${i}`}
                className="flex items-start gap-3 rounded-xl bg-surface p-4 shadow-card ring-1 ring-line"
              >
                <FileText
                  size={15}
                  aria-hidden
                  className="mt-0.5 shrink-0 text-gold-500"
                />
                <span className="min-w-0">
                  <span className="si-heading block text-sm font-medium text-ink">
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-line underline-offset-4 hover:text-cobalt-600"
                      >
                        {source.label}
                      </a>
                    ) : (
                      source.label
                    )}
                  </span>
                  {source.ref ? (
                    <span className="si-heading mt-0.5 block text-xs text-ink-faint">
                      {source.ref}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[92rem] px-4 py-5 sm:px-6 sm:py-6">
      <Breadcrumbs
        crumbs={[
          { label: t.nav.chapters, href: "/chapters" },
          { label: String(chapter.number).padStart(2, "0") },
        ]}
        className="mb-5"
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <Reveal>
            <ChapterHero
              number={chapter.number}
              title={chapter.title}
              subtitle={chapter.subtitle}
              summary={chapter.summary}
              pali={chapter.pali}
              image={chapter.image ? figureSrc(chapter.image) : undefined}
              lessonCount={summary.lessons.length}
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-6 rounded-2xl bg-surface px-5 pb-7 shadow-card ring-1 ring-line sm:px-7">
              <ChapterTabs tabs={tabs} />
            </div>
          </Reveal>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:max-h-[calc(100dvh-7rem)] xl:self-start xl:overflow-y-auto xl:pb-4">
          <ChapterAside chapter={summary} />
          {reflects[0] ? (
            <ThinkAbout
              prompt={reflects[0].block.prompt}
              href={`/lessons/${reflects[0].lessonSlug}#section-${reflects[0].sectionId}`}
            />
          ) : null}
        </aside>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Overview({
  summary,
  objectives,
}: {
  summary: string;
  objectives: Array<{
    lessonTitle: string;
    lessonSubtitle: string;
    text?: string;
  }>;
}) {
  /**
   * A chapter has no objectives of its own — it is a grouping, not a lesson.
   * These are the first objective of each lesson in it, which is the honest
   * answer to "what will I be able to do at the end of this chapter".
   */
  const shown = objectives.filter((o) => Boolean(o.text));

  return (
    <div>
      <h2 className="si-heading block font-display text-xl font-semibold text-ink">
        {t.chapter.about}
      </h2>
      <p className="prose-dhamma mt-3 max-w-3xl text-[1rem]">{summary}</p>

      {shown.length > 0 ? (
        <>
          <h2 className="si-heading block mt-10 font-display text-xl font-semibold text-ink">
            {t.chapter.objectives}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {shown.map((objective) => (
              <li
                key={objective.lessonTitle}
                className="rounded-xl bg-surface-2 p-4 ring-1 ring-line"
              >
                <Target size={17} className="text-cobalt-600" aria-hidden />
                <p className="si-heading mt-3 text-[0.85rem] font-medium leading-relaxed text-ink">
                  {objective.text}
                </p>
                <p className="mt-2 text-[0.65rem] text-ink-faint">
                  {objective.lessonSubtitle}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

    </div>
  );
}

function LessonList({
  chapter,
}: {
  chapter: ReturnType<typeof summarise>;
}) {
  if (chapter.lessons.length === 0) {
    return <Empty title={t.empty.noLessons} body={t.empty.noLessonsBody} />;
  }

  return (
    <ol className="space-y-3">
      {chapter.lessons.map((lesson, i) => {
        return (
          <li key={lesson.slug}>
            <Link
              href={`/lessons/${lesson.slug}`}
              className="group flex items-start gap-4 rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:ring-cobalt-500/40"
            >
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cobalt-100 font-display text-sm font-semibold text-cobalt-600"
              >
                {formatNumber(chapter.number)}.{formatNumber(i + 1)}
              </span>

              <span className="min-w-0 flex-1">
                <span className="si-heading block font-display text-[1rem] font-semibold text-ink">
                  {lesson.title}
                </span>
                <span className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.68rem] text-ink-faint">
                  <span>
                    {formatNumber(lesson.sectionCount)} {t.course.sections}
                  </span>
                  {lesson.isDraft ? (
                    <span className="rounded-full bg-gold-500/12 px-2 py-0.5 text-gold-600">
                      {t.course.draft}
                    </span>
                  ) : null}
                </span>
              </span>

              <span
                aria-hidden
                className="mt-1 shrink-0 text-ink-faint transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-cobalt-600"
              >
                &rarr;
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * A question from one of the chapter's reflection blocks. It is a pointer at
 * the lesson that asks it, not a second place to answer it — the answer is
 * stored against the block it belongs to.
 */
function ThinkAbout({ prompt, href }: { prompt: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-2xl bg-gold-500/8 p-5 ring-1 ring-gold-500/25 transition-colors hover:bg-gold-500/12"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-600">
        <Lightbulb size={17} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="si-heading block font-display text-sm font-semibold text-ink">
          {t.chapter.thinkAbout}
        </span>
        <span className="si-heading mt-2 block text-xs leading-relaxed text-ink-dim">
          {rich(prompt)}
        </span>
      </span>
      <span aria-hidden className="mt-1 shrink-0 text-gold-600">
        &rarr;
      </span>
    </Link>
  );
}
