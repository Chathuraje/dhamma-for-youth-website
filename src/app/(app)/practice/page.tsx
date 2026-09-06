import type { Metadata } from "next";

import { AppPage, PageHeader } from "@/components/app/PageHeader";
import { PracticeIndex } from "@/components/app/PracticeIndex";
import { visibleChapters } from "@/content/chapters";
import { allQuizzes, summarise } from "@/lib/course";
import { plain } from "@/lib/richtext";
import { t } from "@/lib/strings";

export const metadata: Metadata = {
  title: t.practice.heading,
  description:
    "පාඩම් හරහා විසිර ඇති ප්‍රශ්න එකට. ලකුණු නැත — ප්‍රශ්නය ඇත්තේ ඔබ පිළිතුරක් තෝරන තුරු පැහැදිලි කිරීම නොපෙන්වීමටයි.",
};

/**
 * PRACTICE
 * ========
 * Every check in the course, gathered by chapter, each linking back to the
 * section that asks it.
 *
 * It deliberately does not re-implement the quiz. A question answered here and
 * the same question answered in its lesson would be two records of one answer,
 * and the explanation only means anything next to the teaching it follows.
 * This page indexes what there is to practise and what has been answered.
 */
export default function PracticePage() {
  const quizzes = allQuizzes();

  const groups = visibleChapters()
    .map((chapter) => {
      const summary = summarise(chapter);
      const slugs = new Set(summary.lessons.map((l) => l.slug));

      return {
        slug: chapter.slug,
        number: chapter.number,
        title: chapter.title,
        subtitle: chapter.subtitle,
        questions: quizzes
          .filter((q) => slugs.has(q.lessonSlug))
          .map((q, i) => ({
            /** The exact key the lesson's quiz block stores its answer under. */
            storeKey: q.storeKey,
            question: plain(q.block.question),
            lessonSlug: q.lessonSlug,
            lessonTitle: q.lessonTitle,
            sectionId: q.sectionId,
            sectionTitle: q.sectionTitle,
            ordinal: i + 1,
          })),
      };
    })
    .filter((g) => g.questions.length > 0);

  return (
    <AppPage>
      <PageHeader
        crumbs={[{ label: t.practice.heading }]}
        title={t.practice.heading}
        intro={t.practice.intro}
      />

      <PracticeIndex groups={groups} />
    </AppPage>
  );
}
