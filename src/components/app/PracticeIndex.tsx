"use client";

import Link from "next/link";
import { Check, CircleDashed } from "lucide-react";

import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Empty } from "@/components/ui";
import { useHydrated, useProgress } from "@/lib/progress";
import { t } from "@/lib/strings";
import { cn, formatNumber } from "@/lib/utils";

export interface PracticeQuestion {
  storeKey: string;
  question: string;
  lessonSlug: string;
  lessonTitle: string;
  sectionId: string;
  sectionTitle: string;
  ordinal: number;
}

export interface PracticeGroup {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  questions: PracticeQuestion[];
}

/**
 * The practice index, grouped by chapter.
 *
 * Whether a question has been answered is read from the same store the lesson
 * writes to, so the two can never disagree. What is *not* shown is whether the
 * answer was right — there is no score anywhere in this course, and turning
 * this page into a report card would make one.
 */
export function PracticeIndex({ groups }: { groups: PracticeGroup[] }) {
  const answers = useProgress((s) => s.quizAnswers);
  const hydrated = useHydrated();

  if (groups.length === 0) {
    return <Empty title={t.practice.empty} />;
  }

  const all = groups.flatMap((g) => g.questions);
  const answered = hydrated
    ? all.filter((q) => answers[q.storeKey] !== undefined).length
    : 0;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl bg-surface px-5 py-4 shadow-card ring-1 ring-line">
        <p className="si-heading text-sm text-ink">
          <span className="font-display text-lg font-semibold text-cobalt-600">
            {formatNumber(answered)}
          </span>{" "}
          / {formatNumber(all.length)} {t.practice.answered}
        </p>
      </div>

      <Stagger className="space-y-6" gap={0.06}>
        {groups.map((group) => (
          <StaggerItem key={group.slug}>
            <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
              <Link href={`/chapters/${group.slug}`} className="group inline-block">
                <span className="font-mono text-xs text-cobalt-600">
                  {t.course.chapter} {String(group.number).padStart(2, "0")}
                </span>
                <span className="si-heading block mt-1 font-display text-lg font-semibold text-ink transition-colors group-hover:text-cobalt-600">
                  {group.title}
                </span>
              </Link>

              <ol className="mt-5 space-y-2">
                {group.questions.map((q) => {
                  const done = hydrated && answers[q.storeKey] !== undefined;
                  return (
                    <li key={q.storeKey}>
                      <Link
                        href={`/lessons/${q.lessonSlug}#section-${q.sectionId}`}
                        className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-surface-2"
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                            done
                              ? "bg-cobalt-500 text-on-brand"
                              : "bg-surface-2 text-ink-faint ring-1 ring-line",
                          )}
                        >
                          {done ? (
                            <Check size={12} strokeWidth={3} />
                          ) : (
                            <CircleDashed size={12} />
                          )}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="si-heading block text-[0.9rem] leading-relaxed text-ink">
                            {q.question}
                          </span>
                          <span className="si-heading mt-1 block truncate text-[0.68rem] text-ink-faint">
                            {q.lessonTitle} — {q.sectionTitle}
                          </span>
                        </span>

                        <span
                          aria-hidden
                          className="mt-1 shrink-0 text-ink-faint"
                        >
                          &rarr;
                        </span>
                        <span className="sr-only">{t.practice.openLesson}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
