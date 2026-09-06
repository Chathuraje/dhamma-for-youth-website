"use client";

import { motion, useReducedMotion } from "motion/react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { SpeechSpeedBlock } from "@/lib/types";
import { cn } from "@/lib/utils";

const ACCENT = {
  cobalt: { bar: "bg-cobalt-500", text: "text-cobalt-ink" },
  jade: { bar: "bg-jade-500", text: "text-jade-ink" },
  lotus: { bar: "bg-lotus-500", text: "text-lotus-ink" },
} as const;

/**
 * Relative speech-rate comparison.
 *
 * The phrase is fixed rather than typed. An empty text box asks the learner to
 * invent an input before they are told what the comparison is for, and the
 * measured phrase is itself part of the teaching — a line every learner here
 * already knows, so the times below are anchored to something familiar rather
 * than to whatever happened to be typed.
 */
export function SpeechSpeed({ block }: { block: SpeechSpeedBlock }) {
  const reduce = useReducedMotion();
  const phrase = block.sample ?? "";
  const wordCount = Math.max(phrase.trim().split(/\s+/).filter(Boolean).length, 1);
  const fastest = Math.max(...block.speakers.map((s) => s.multiplier));

  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <div className="border-b border-line px-5 py-3.5">
        <h4 className="si-heading text-sm font-semibold text-ink-dim">
          {block.title ?? t.speech.heading}
        </h4>
      </div>

      {/* the measured phrase, stated once and kept on screen */}
      <div className="border-b border-line bg-surface-2/40 px-5 py-5">
        <p className="si-heading text-xs font-semibold text-ink-faint">
          {t.speech.timeToSay}
        </p>
        <p
          lang="pi"
          className="mt-2 font-pali text-xl italic text-cobalt-ink sm:text-2xl"
        >
          {phrase}
        </p>
        <p className="mt-1.5 font-mono text-[0.7rem] tabular-nums text-ink-faint">
          {wordCount} {t.speech.words}
        </p>
      </div>

      <div className="space-y-5 px-5 py-6">
        {block.speakers.map((sp) => {
          const a = ACCENT[sp.accent ?? "cobalt"];
          const seconds =
            wordCount / (block.baselineWordsPerSecond * sp.multiplier);
          // Bar length tracks rate: the fastest speaker fills the row.
          const width = (sp.multiplier / fastest) * 100;

          return (
            <div key={sp.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="si-heading text-sm font-medium text-ink">
                  {sp.label}
                </span>
                <span className="font-mono text-xs tabular-nums text-ink-faint">
                  {(block.baselineWordsPerSecond * sp.multiplier).toLocaleString(
                    "si-LK",
                  )}{" "}
                  {t.speech.wordsPerSecond}
                  <span className="mx-1.5 text-line">|</span>
                  <span className={a.text}>
                    {seconds < 0.01
                      ? seconds.toFixed(4)
                      : seconds < 1
                        ? seconds.toFixed(3)
                        : seconds.toFixed(2)}
                    s
                  </span>
                </span>
              </div>

              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-2 ring-1 ring-line">
                <motion.div
                  className={cn("h-full rounded-full", a.bar)}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${width}%` }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: reduce ? 0 : 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </div>

              <p className="mt-1.5 font-mono text-[0.68rem] text-ink-faint">
                &times;{sp.multiplier.toLocaleString("si-LK")}
              </p>

              {sp.note && (
                <p className="prose-dhamma mt-1 text-xs">{rich(sp.note)}</p>
              )}
            </div>
          );
        })}
      </div>
    </figure>
  );
}
