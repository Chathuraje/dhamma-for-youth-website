import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";

import { ConceptOfDay } from "@/components/app/dashboard/ConceptOfDay";
import { ContinueCard } from "@/components/app/dashboard/ContinueCard";
import { DashboardHero } from "@/components/app/dashboard/DashboardHero";
import { KnowledgeMap } from "@/components/app/dashboard/KnowledgeMap";
import { LearningPath } from "@/components/app/dashboard/LearningPath";
import { ProgressPanel } from "@/components/app/dashboard/ProgressPanel";
import { ReferenceStrip } from "@/components/app/dashboard/ReferenceStrip";
import { Reveal } from "@/components/motion/Reveal";
import {
  conceptPool,
  courseOutline,
  knowledgeMap,
  referenceCards,
} from "@/lib/course";
import { t } from "@/lib/strings";

export const metadata: Metadata = {
  title: t.nav.dashboard,
  description: "ඔබේ ඉගෙනුම් පුවරුව — ප්‍රගතිය සහ ඉගෙනුම් මාර්ගය.",
  robots: { index: false, follow: true },
};

/**
 * THE DASHBOARD
 * =============
 * Where a learner lands. The banner spans the page; below it, the course on
 * the left and the learner on the right.
 *
 * Everything on it is *derived* from `src/content/`: the path from the
 * chapters, the knowledge map from each lesson's first key term, the concept
 * of the day from the glossary, the background strip from the reference
 * topics. Nothing here is a second, hand-maintained copy of anything, and no
 * card invents a fact to fill itself.
 *
 * The page is a server component. Everything is resolved here and handed down
 * as plain data; only the panels that read the browser's stored progress are
 * client components, and they receive that data as props rather than importing
 * the registry themselves.
 */
export default function DashboardPage() {
  const chapters = courseOutline();

  /** Flat lesson list, in teaching order — what every progress reading needs. */
  const lessons = chapters.flatMap((c) => c.lessons);

  return (
    <div className="relative">
      {/*
        A wash behind the whole board. Cards on a flat field read as a
        spreadsheet; a single soft gradient behind them gives the page a top
        and a bottom without adding a single element anyone has to look at.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(80%_100%_at_50%_0%,var(--color-surface-2),transparent_70%)]"
      />

      <div className="mx-auto w-full max-w-[92rem] space-y-5 px-4 py-6 sm:px-6 sm:py-8">
        <DashboardHero lessons={lessons} />

        {chapters.length === 0 ? (
          <p className="si-heading rounded-2xl bg-surface p-8 text-center text-sm text-ink-dim ring-1 ring-line">
            {t.empty.noLessons}
          </p>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
            {/* -- the course ----------------------------------------------- */}
            <div className="space-y-5">
              <Reveal delay={0.06}>
                <LearningPath chapters={chapters} />
              </Reveal>
              <Reveal delay={0.1}>
                <KnowledgeMap nodes={knowledgeMap()} />
              </Reveal>
              <Reveal delay={0.14}>
                <ReferenceStrip topics={referenceCards()} />
              </Reveal>
            </div>

            {/* -- the learner ---------------------------------------------- */}
            <aside className="space-y-5">
              <Reveal delay={0.04}>
                <ContinueCard chapters={chapters} />
              </Reveal>
              <Reveal delay={0.08}>
                <ProgressPanel lessons={lessons} />
              </Reveal>
              <Reveal delay={0.12}>
                <ConceptOfDay pool={conceptPool()} />
              </Reveal>
              <Reveal delay={0.16}>
                <CommunityCard />
              </Reveal>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Community is not built. The card says so rather than showing a fake member
 * count and an avatar row — the mockup's "+1.2K learners" would be the first
 * untrue thing on the site.
 */
function CommunityCard() {
  return (
    <section className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line">
      <div className="flex items-start justify-between gap-3">
        <h2 className="si-heading font-display text-base font-semibold text-ink">
          {t.app.community}
        </h2>
        <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-ink-faint">
          {t.app.comingSoon}
        </span>
      </div>

      <div className="mt-4 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cobalt-100 text-cobalt-ink">
          <Users size={18} aria-hidden />
        </span>
        <p className="si-heading text-xs leading-relaxed text-ink-dim">
          {t.app.comingSoonNote}
        </p>
      </div>

      <Link
        href="/community"
        className="si-heading mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-surface-2 px-4 py-2.5 text-sm font-medium text-ink ring-1 ring-line transition-colors hover:bg-surface-3"
      >
        {t.app.comingSoon}
        <span aria-hidden>&rarr;</span>
      </Link>
    </section>
  );
}
