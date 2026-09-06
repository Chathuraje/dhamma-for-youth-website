"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronUp, RotateCcw } from "lucide-react";
import { useState } from "react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { LadderBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pali } from "@/components/ui";

const ACCENT = {
  cobalt: { bar: "bg-cobalt-500", text: "text-cobalt-ink", soft: "bg-cobalt-500/10", ring: "ring-cobalt-500/35" },
  jade: { bar: "bg-jade-500", text: "text-jade-ink", soft: "bg-jade-500/10", ring: "ring-jade-500/35" },
  lotus: { bar: "bg-lotus-500", text: "text-lotus-ink", soft: "bg-lotus-500/10", ring: "ring-lotus-500/35" },
} as const;

/**
 * An escalating comparison revealed one rung at a time.
 *
 * The teaching shape here is "…and faster still than that". Showing every rung
 * at once destroys it: the final rung only lands once the earlier ones have
 * already used up the learner's sense of scale. So rungs open in order, and
 * the conclusion waits until the top.
 */
export function Ladder({ block }: { block: LadderBlock }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(1);
  const total = block.rungs.length;
  const atTop = open >= total;

  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h4 className="si-heading text-sm font-semibold text-ink-dim">
          {block.title ?? t.ladder.heading}
        </h4>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tabular-nums text-ink-faint">
            {open}/{total}
          </span>
          <button
            type="button"
            onClick={() => setOpen(1)}
            disabled={open === 1}
            aria-label={t.ladder.reset}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-ink-faint ring-1 ring-line transition hover:text-ink disabled:opacity-30"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* rungs stack upward: the newest reveal sits on top */}
      <ol className="flex flex-col-reverse gap-2 px-5 py-6">
        {block.rungs.slice(0, open).map((rung, i) => {
          const a = ACCENT[rung.accent ?? "cobalt"];
          const isTop = i === open - 1;
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "rounded-xl px-4 py-3.5 ring-1 transition-colors",
                isTop ? cn(a.soft, a.ring) : "bg-surface-2/40 ring-line",
              )}
            >
              <div className="flex items-start gap-3">
                {/* rung height grows with position — the escalation, drawn */}
                <span
                  aria-hidden
                  className="mt-1 flex w-8 shrink-0 items-end justify-center"
                  style={{ height: 20 }}
                >
                  <span
                    className={cn("w-1.5 rounded-full", isTop ? a.bar : "bg-line")}
                    style={{ height: `${25 + (i / Math.max(total - 1, 1)) * 75}%` }}
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2.5">
                    <span
                      className={cn(
                        "si-heading font-medium",
                        isTop ? a.text : "text-ink-dim",
                      )}
                    >
                      {rung.label}
                    </span>
                    {rung.pali && (
                      <Pali className="text-xs text-ink-faint">{rung.pali}</Pali>
                    )}
                    {rung.figure && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-mono text-[0.68rem] font-semibold tabular-nums",
                          isTop ? cn(a.soft, a.text) : "bg-surface-2 text-ink-faint",
                        )}
                      >
                        {rung.figure}
                      </span>
                    )}
                  </div>
                  <p className="prose-dhamma mt-1 text-[0.94rem]">
                    {rich(rung.text)}
                  </p>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>

      {!atTop && (
        <button
          type="button"
          onClick={() => setOpen((n) => Math.min(n + 1, total))}
          className="si-heading flex w-full items-center justify-center gap-2 border-t border-line py-3 text-sm font-medium text-cobalt-ink transition hover:bg-surface-2 hover:text-cobalt-ink"
        >
          <ChevronUp size={15} />
          {t.ladder.next}
        </button>
      )}

      <AnimatePresence>
        {atTop && block.conclusion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: reduce ? 0 : 0.35 }}
            className="overflow-hidden border-t border-line bg-surface-2/50"
          >
            <p className="prose-dhamma px-5 py-4 text-[0.96rem]">
              {rich(block.conclusion)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </figure>
  );
}
