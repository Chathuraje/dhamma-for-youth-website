"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Lock } from "lucide-react";
import { useState } from "react";
import { rich } from "@/lib/richtext";
import { useHydrated, useProgress } from "@/lib/progress";
import { t } from "@/lib/strings";
import type { ParamatthaTableBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pali } from "@/components/ui";

const ACCENT = {
  cobalt: {
    cell: "bg-cobalt-500/15 ring-cobalt-500/35 text-cobalt-200 hover:bg-cobalt-500/25",
    dot: "bg-cobalt-500",
    text: "text-cobalt-ink",
  },
  jade: {
    cell: "bg-jade-500/15 ring-jade-500/35 text-jade-200 hover:bg-jade-500/25",
    dot: "bg-jade-500",
    text: "text-jade-ink",
  },
  lotus: {
    cell: "bg-lotus-500/15 ring-lotus-500/35 text-lotus-200 hover:bg-lotus-500/25",
    dot: "bg-lotus-500",
    text: "text-lotus-ink",
  },
  rose: {
    cell: "bg-rose-500/15 ring-rose-500/35 text-rose-200 hover:bg-rose-500/25",
    dot: "bg-rose-500",
    text: "text-rose-ink",
  },
} as const;

/**
 * The 82 ultimate realities as a periodic-table-style grid.
 *
 * Cells unlock as their lesson is completed, so the learner watches the map of
 * the universe fill in over the course. Locked cells stay in place, sized and
 * positioned — the shape of what is still ahead is itself information, and it
 * gives the course a visible destination from lesson one.
 *
 * Unlock state is read from the learner's completed sections, so it reflects
 * actual reading rather than a click.
 */
export function ParamatthaTable({ block }: { block: ParamatthaTableBlock }) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const completed = useProgress((s) => s.completed);
  const [openId, setOpenId] = useState<string | null>(null);

  /** A lesson counts as done once any of its sections has been read. */
  const startedLessons = new Set(
    hydrated
      ? Object.entries(completed)
          .filter(([, ids]) => ids.length > 0)
          .map(([slug]) => slug)
      : [],
  );

  const isUnlocked = (unlockedBy?: string) =>
    !unlockedBy || startedLessons.has(unlockedBy);

  const allCells = block.groups.flatMap((g) => g.cells);
  const unlockedCount = allCells.filter((c) => isUnlocked(c.unlockedBy)).length;
  const totalCount = block.groups.reduce((n, g) => n + g.count, 0);

  const open = allCells.find((c) => c.id === openId);
  const openGroup = block.groups.find((g) =>
    g.cells.some((c) => c.id === openId),
  );

  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3.5">
        <h4 className="si-heading text-sm font-semibold text-ink-dim">
          {block.title ?? t.paramattha.heading}
        </h4>
        <span className="font-mono text-xs tabular-nums text-ink-faint">
          <span className="text-cobalt-ink">{unlockedCount}</span> / {totalCount}
        </span>
      </div>

      <div className="space-y-6 px-5 py-6">
        {block.groups.map((group) => {
          const a = ACCENT[group.accent];
          const named = group.cells.length;
          const anonymous = Math.max(group.count - named, 0);

          return (
            <div key={group.id}>
              <div className="mb-3 flex flex-wrap items-baseline gap-x-2.5">
                <span className={cn("h-2 w-2 rounded-full", a.dot)} />
                <span className={cn("si-heading text-sm font-semibold", a.text)}>
                  {group.label}
                </span>
                <Pali className="text-xs text-ink-faint">{group.pali}</Pali>
                <span className="font-mono text-xs text-ink-faint">
                  {group.count}
                </span>
              </div>

              <div className="grid grid-cols-[repeat(auto-fill,minmax(3.6rem,1fr))] gap-1.5">
                {group.cells.map((cell) => {
                  const unlocked = isUnlocked(cell.unlockedBy);
                  return (
                    <button
                      key={cell.id}
                      type="button"
                      disabled={!unlocked}
                      onClick={() => setOpenId(openId === cell.id ? null : cell.id)}
                      aria-label={unlocked ? cell.label : t.paramattha.locked}
                      className={cn(
                        "flex aspect-square flex-col items-center justify-center rounded-lg px-1 text-center ring-1 transition-all",
                        unlocked
                          ? cn(a.cell, "cursor-pointer")
                          : "cursor-not-allowed bg-surface-2/40 text-ink-faint/40 ring-line-soft",
                        openId === cell.id && "scale-105 ring-2",
                      )}
                    >
                      {unlocked ? (
                        <>
                          <span className="si-tight text-[0.62rem] font-semibold leading-tight">
                            {cell.label}
                          </span>
                          {cell.pali && (
                            <Pali className="mt-0.5 text-[0.55rem] opacity-70">
                              {cell.pali}
                            </Pali>
                          )}
                        </>
                      ) : (
                        <Lock size={11} />
                      )}
                    </button>
                  );
                })}

                {/* placeholders for the not-yet-named members of the group */}
                {Array.from({ length: anonymous }, (_, i) => (
                  <span
                    key={`ghost-${i}`}
                    aria-hidden
                    className="flex aspect-square items-center justify-center rounded-lg bg-surface-2/25 ring-1 ring-line-soft"
                  >
                    <Lock size={10} className="text-ink-faint/25" />
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key={open.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduce ? 0 : 0.26 }}
            className="overflow-hidden border-t border-line bg-surface-2/50"
          >
            <div className="px-5 py-4">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h5
                  className={cn(
                    "si-heading text-base font-semibold",
                    ACCENT[openGroup?.accent ?? "cobalt"].text,
                  )}
                >
                  {open.label}
                </h5>
                {open.pali && (
                  <Pali className="text-sm text-ink-faint">{open.pali}</Pali>
                )}
              </div>
              {open.note && (
                <p className="prose-dhamma mt-1.5 text-[0.94rem]">
                  {rich(open.note)}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="si-tight border-t border-line px-5 py-3 text-xs text-ink-faint">
        {t.paramattha.progressNote}
      </p>
    </figure>
  );
}
