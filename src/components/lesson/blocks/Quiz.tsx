"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, RotateCcw, X } from "lucide-react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import { useHydrated, useProgress } from "@/lib/progress";
import type { QuizBlock } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * A single comprehension check.
 *
 * Deliberately low-stakes: there is no score, no streak and no penalty. The
 * explanation is the payload - the question exists to make the learner commit
 * to an answer first, because that is what makes the explanation land.
 *
 * The chosen answer persists per learner so revisiting a lesson shows what
 * they previously thought.
 */
export function Quiz({
  block,
  storageKey,
}: {
  block: QuizBlock;
  storageKey: string;
}) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const chosen = useProgress((s) => s.quizAnswers[storageKey]);
  const answerQuiz = useProgress((s) => s.answerQuiz);

  const answered = hydrated && chosen !== undefined;
  const correctIndex = block.options.findIndex((o) => o.correct);
  const gotIt = answered && chosen === correctIndex;

  return (
    <div className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-lotus-500/25">
      {/* No heading strip. The question is the heading — a label above it
          saying "check yourself" only delayed reading the question. */}
      <div className="px-5 py-5 sm:px-6">
        <p className="font-display text-lg leading-snug text-ink">
          {rich(block.question)}
        </p>

        <div className="mt-5 space-y-2.5">
          {block.options.map((opt, i) => {
            const isChosen = answered && chosen === i;
            const isAnswer = answered && i === correctIndex;

            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => answerQuiz(storageKey, i)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left text-[0.95rem] leading-relaxed ring-1 transition-all duration-200",
                  !answered &&
                    "bg-surface-2 text-ink-dim ring-line hover:bg-surface-3 hover:text-ink hover:ring-lotus-500/40",
                  isAnswer && "bg-jade-500/12 text-ink ring-jade-500/50",
                  isChosen &&
                    !isAnswer &&
                    "bg-rose-500/12 text-ink ring-rose-500/50",
                  answered && !isChosen && !isAnswer && "opacity-45 ring-line",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-semibold ring-1",
                    !answered && "text-ink-faint ring-line",
                    isAnswer && "bg-jade-500 text-on-brand ring-jade-500",
                    isChosen &&
                      !isAnswer &&
                      "bg-rose-500 text-on-brand ring-rose-500",
                    answered && !isChosen && !isAnswer && "text-ink-faint ring-line",
                  )}
                >
                  {isAnswer ? (
                    <Check size={12} strokeWidth={3} />
                  ) : isChosen ? (
                    <X size={12} strokeWidth={3} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className="flex-1">{rich(opt.text)}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 rounded-xl bg-surface-2/70 p-4 ring-1 ring-line">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    gotIt ? "text-jade-ink" : "text-cobalt-ink",
                  )}
                >
                  {gotIt ? t.quiz.correct : t.quiz.incorrect}
                </p>
                <p className="prose-dhamma mt-1.5 text-[0.95rem]">
                  {rich(block.explanation)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {answered && (
        <button
          type="button"
          onClick={() => {
            useProgress.setState((s) => {
              const next = { ...s.quizAnswers };
              delete next[storageKey];
              return { quizAnswers: next };
            });
          }}
          className="flex w-full items-center justify-center gap-1.5 border-t border-line py-2.5 text-xs font-medium text-ink-faint transition hover:bg-surface-2 hover:text-ink-dim"
        >
          <RotateCcw size={11} /> {t.quiz.tryAgain}
        </button>
      )}
    </div>
  );
}
