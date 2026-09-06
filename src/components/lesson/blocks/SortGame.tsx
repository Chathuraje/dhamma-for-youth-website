"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { SortGameBlock } from "@/lib/types";
import { cn, seededShuffle } from "@/lib/utils";
import { Pali } from "@/components/ui";

/**
 * Categorisation practice: pick an item, then pick the category it belongs to.
 *
 * Tap-to-place rather than drag-and-drop, on purpose - drag is hostile on
 * touch, unusable with a keyboard, and adds nothing pedagogically. Every
 * interaction here works with a mouse, a finger or Tab + Enter.
 */
export function SortGame({ block }: { block: SortGameBlock }) {
  const reduce = useReducedMotion();
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  // Shuffle once with a stable seed so server and client markup agree.
  const items = useMemo(() => seededShuffle(block.items, 7), [block.items]);
  const remaining = items.filter((i) => !placed[i.id]);
  const allPlaced = remaining.length === 0;
  const score = items.filter((i) => placed[i.id] === i.bucketId).length;

  function place(bucketId: string) {
    if (!selected || checked) return;
    setPlaced((p) => ({ ...p, [selected]: bucketId }));
    setSelected(null);
  }

  function restart() {
    setPlaced({});
    setSelected(null);
    setChecked(false);
  }

  return (
    <div className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-jade-500/25">
      <div className="border-b border-line bg-gradient-to-r from-jade-500/10 to-transparent px-5 py-3.5">
        <span className="text-[0.7rem] si-heading font-semibold text-jade-ink">
          {t.sort.heading}
        </span>
        <p className="mt-1 text-[0.97rem] text-ink">{block.prompt}</p>
      </div>

      {/* pool */}
      <div className="min-h-[4.5rem] border-b border-line px-5 py-4">
        {remaining.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {remaining.map((item) => (
                <motion.li
                  key={item.id}
                  layout={!reduce}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSelected((s) => (s === item.id ? null : item.id))
                    }
                    aria-pressed={selected === item.id}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition-all duration-200",
                      selected === item.id
                        ? "bg-jade-500 text-on-brand ring-jade-500 shadow-[0_0_20px_-4px_rgb(63_208_176_/_0.8)] scale-105"
                        : "bg-surface-2 text-ink-dim ring-line hover:text-ink hover:ring-jade-500/40",
                    )}
                  >
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <p className="py-2 text-center text-sm text-ink-faint">
            {checked ? t.sort.allSorted : t.sort.allPlaced}
          </p>
        )}
      </div>

      {/* buckets */}
      <div
        className={cn(
          "grid gap-px bg-line",
          block.buckets.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3",
        )}
      >
        {block.buckets.map((bucket) => {
          const inBucket = items.filter((i) => placed[i.id] === bucket.id);
          return (
            <div
              key={bucket.id}
              className={cn(
                "relative bg-surface px-5 py-4 transition-colors",
                selected && !checked && "bg-jade-500/8",
              )}
            >
              <div className="flex items-baseline gap-2">
                <span className="font-display text-base font-semibold text-ink">
                  {bucket.label}
                </span>
                {bucket.pali && (
                  <Pali className="text-sm text-ink-faint">{bucket.pali}</Pali>
                )}
              </div>

              <ul className="mt-3 flex min-h-8 flex-wrap gap-1.5">
                {inBucket.map((item) => {
                  const right = item.bucketId === bucket.id;
                  return (
                    <motion.li
                      key={item.id}
                      layout={!reduce}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.22 }}
                      /* sits above the drop overlay so chips stay removable */
                      className="relative z-20"
                    >
                      <button
                        type="button"
                        disabled={checked}
                        aria-label={
                          checked ? undefined : `${t.sort.remove}: ${item.label}`
                        }
                        onClick={() =>
                          setPlaced((p) => {
                            const next = { ...p };
                            delete next[item.id];
                            return next;
                          })
                        }
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                          !checked &&
                            "cursor-pointer bg-surface-2 text-ink-dim ring-line hover:ring-rose-500/40",
                          checked &&
                            right &&
                            "bg-jade-500/15 text-jade-ink ring-jade-500/40",
                          checked &&
                            !right &&
                            "bg-rose-500/15 text-rose-ink ring-rose-500/40",
                        )}
                      >
                        {checked &&
                          (right ? (
                            <Check size={10} strokeWidth={3} />
                          ) : (
                            <X size={10} strokeWidth={3} />
                          ))}
                        {item.label}
                      </button>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Whole bucket becomes the drop target once an item is picked. */}
              {selected && !checked && (
                <button
                  type="button"
                  onClick={() => place(bucket.id)}
                  aria-label={`${t.sort.placeIn}: ${bucket.label}`}
                  className="absolute inset-0 z-10 transition-colors hover:bg-jade-500/10"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* footer */}
      <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
        {checked ? (
          <>
            <span className="text-sm">
              <span
                className={cn(
                  "font-semibold",
                  score === items.length ? "text-jade-ink" : "text-cobalt-ink",
                )}
              >
                {score} {t.sort.of} {items.length}
              </span>
              <span className="text-ink-faint"> {t.sort.placedCorrectly}</span>
            </span>
            <button
              type="button"
              onClick={restart}
              className="flex items-center gap-1.5 text-xs font-medium text-ink-faint transition hover:text-ink"
            >
              <RotateCcw size={11} /> {t.sort.reset}
            </button>
          </>
        ) : (
          <>
            <span className="text-xs text-ink-faint">
              {selected
                ? t.sort.pickBucket
                : t.sort.pickItem}
            </span>
            <button
              type="button"
              disabled={!allPlaced}
              onClick={() => setChecked(true)}
              className="rounded-full bg-jade-500 px-4 py-1.5 text-xs font-semibold text-on-brand transition hover:bg-jade-400 disabled:pointer-events-none disabled:opacity-30"
            >
              {t.sort.check}
            </button>
          </>
        )}
      </div>

      {/* hints for wrong placements */}
      <AnimatePresence>
        {checked && score < items.length && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            className="overflow-hidden border-t border-line bg-surface-2/50"
          >
            <ul className="space-y-2 px-5 py-4">
              {items
                .filter((i) => placed[i.id] !== i.bucketId)
                .map((item) => {
                  const target = block.buckets.find(
                    (b) => b.id === item.bucketId,
                  );
                  return (
                    <li key={item.id} className="text-sm leading-relaxed">
                      <span className="font-medium text-ink">{item.label}</span>
                      <span className="text-ink-faint">
                        {" "}
                        {t.sort.belongsIn}{" "}
                        <span className="text-jade-ink">{target?.label}</span>
                        {item.hint && (
                          <span className="text-ink-dim">
                            {" "}
                            ({rich(item.hint)})
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
