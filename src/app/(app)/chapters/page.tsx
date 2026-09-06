import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/app/Breadcrumbs";
import { ChapterIndex } from "@/components/chapter/ChapterIndex";
import { Reveal } from "@/components/motion/Reveal";
import { courseOutline, courseTotals } from "@/lib/course";
import { t } from "@/lib/strings";

export const metadata: Metadata = {
  title: t.nav.chapters,
  description:
    "අභිධර්ම පාඨමාලාවේ පරිච්ඡේද. සෑම පාඩමකම කියවීම සහ අත්හදා බැලීම එකවර.",
};

/**
 * The chapter index.
 *
 * One row per chapter, opening that chapter's page — not, as it used to, the
 * chapter's first unread lesson. Jumping a learner straight into a lesson made
 * the index unusable for the thing an index is for: seeing what is in the
 * course before committing to a place in it.
 */
export default function ChaptersPage() {
  const chapters = courseOutline();
  const totals = courseTotals();

  return (
    <div className="mx-auto w-full max-w-[92rem] px-4 py-5 sm:px-6 sm:py-6">
      <Breadcrumbs crumbs={[{ label: t.nav.chapters }]} className="mb-6" />

      <Reveal>
        <header className="max-w-2xl">
          <p className="si-heading text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cobalt-600">
            {t.spine.eyebrow}
          </p>
          <h1 className="si-heading block si-tight mt-3 font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold text-ink">
            {t.spine.headline}
          </h1>
          <p className="prose-dhamma mt-4 text-[1rem]">{t.spine.blurb}</p>
        </header>
      </Reveal>

      <ChapterIndex chapters={chapters} totals={totals} className="mt-10" />
    </div>
  );
}
