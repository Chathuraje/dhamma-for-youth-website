"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { ElementMixerBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pali } from "@/components/ui";

/**
 * Element-dominance mixer.
 *
 * All four great elements are present in every octad — what changes between a
 * stone and a river is proportion, not membership. Sliders make that claim
 * testable: the learner pushes one element up and watches the material change
 * while none of them ever reaches zero.
 *
 * Shares are normalised so the four always total 100. Raising one necessarily
 * lowers the others, which is itself part of the teaching.
 */
export function ElementMixer({ block }: { block: ElementMixerBlock }) {
  const reduce = useReducedMotion();

  const initial = useMemo(
    () => Object.fromEntries(block.elements.map((e) => [e.id, e.start])),
    [block.elements],
  );
  const [shares, setShares] = useState<Record<string, number>>(initial);
  const [openPuzzle, setOpenPuzzle] = useState<number | null>(null);

  /**
   * Set one element's share and redistribute the remainder across the others
   * in proportion to what they currently hold, so the total stays at 100.
   */
  function setShare(id: string, next: number) {
    setShares((prev) => {
      const clamped = Math.min(Math.max(next, 0), 100);
      const others = block.elements.filter((e) => e.id !== id);
      const otherTotal = others.reduce((n, e) => n + prev[e.id], 0);
      const remaining = 100 - clamped;

      const out: Record<string, number> = { [id]: clamped };
      if (otherTotal === 0) {
        for (const e of others) out[e.id] = remaining / others.length;
      } else {
        for (const e of others)
          out[e.id] = (prev[e.id] / otherTotal) * remaining;
      }
      return out;
    });
  }

  const dominant = block.elements.reduce((a, b) =>
    shares[a.id] >= shares[b.id] ? a : b,
  );
  const outcome = block.outcomes.find(
    (o) => o.when === dominant.id && shares[dominant.id] >= o.atLeast,
  );

  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h4 className="si-heading text-sm font-semibold text-ink-dim">
          {block.title ?? t.mixer.heading}
        </h4>
        <button
          type="button"
          onClick={() => setShares(initial)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-ink-faint ring-1 ring-line transition hover:text-ink"
          aria-label={t.mixer.reset}
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {/* live result */}
      <div className="border-b border-line bg-surface-2/40 px-5 py-7 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={outcome?.label ?? "balanced"}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block text-5xl leading-none" aria-hidden>
              {outcome?.glyph ?? "⚖️"}
            </span>
            <p className="si-heading mt-3 text-xl font-semibold text-ink">
              {outcome?.label ?? t.mixer.balanced}
            </p>
            <p className="prose-dhamma mx-auto mt-2 max-w-md text-[0.95rem]">
              {outcome ? rich(outcome.text) : t.mixer.balancedNote}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* proportion bar */}
      <div className="px-5 pt-5">
        <div className="flex h-3 overflow-hidden rounded-full ring-1 ring-line">
          {block.elements.map((e, i) => (
            <motion.div
              key={e.id}
              className={cn(
                i === 0 && "bg-cobalt-500",
                i === 1 && "bg-jade-500",
                i === 2 && "bg-rose-500",
                i === 3 && "bg-lotus-500",
              )}
              animate={{ width: `${shares[e.id]}%` }}
              transition={{ duration: reduce ? 0 : 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* sliders */}
      <div className="space-y-4 px-5 py-5">
        {block.elements.map((e, i) => (
          <div key={e.id}>
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor={`mix-${e.id}`}
                className="si-heading flex items-baseline gap-2 text-sm"
              >
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 translate-y-[-1px] rounded-full",
                    i === 0 && "bg-cobalt-500",
                    i === 1 && "bg-jade-500",
                    i === 2 && "bg-rose-500",
                    i === 3 && "bg-lotus-500",
                  )}
                />
                <span
                  className={cn(
                    "font-medium",
                    dominant.id === e.id ? "text-ink" : "text-ink-dim",
                  )}
                >
                  {e.label}
                </span>
                <Pali className="text-xs text-ink-faint">{e.pali}</Pali>
              </label>
              <span className="font-mono text-xs tabular-nums text-ink-faint">
                {shares[e.id].toFixed(0)}%
              </span>
            </div>

            <input
              id={`mix-${e.id}`}
              type="range"
              min={0}
              max={100}
              value={Math.round(shares[e.id])}
              onChange={(ev) => setShare(e.id, Number(ev.target.value))}
              className={cn(
                "mt-2 w-full",
                i === 0 && "accent-cobalt-500",
                i === 1 && "accent-jade-500",
                i === 2 && "accent-rose-500",
                i === 3 && "accent-lotus-500",
              )}
            />

            {e.hint && dominant.id === e.id && (
              <p className="prose-dhamma mt-1 text-xs">{rich(e.hint)}</p>
            )}
          </div>
        ))}
      </div>

      {/* puzzles */}
      {block.puzzles && block.puzzles.length > 0 && (
        <div className="border-t border-line px-5 py-4">
          <p className="si-heading text-xs font-semibold text-ink-faint">
            {t.mixer.puzzles}
          </p>
          <div className="mt-3 space-y-2">
            {block.puzzles.map((p, i) => {
              const open = openPuzzle === i;
              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl bg-surface-2/60 ring-1 ring-line"
                >
                  <button
                    type="button"
                    onClick={() => setOpenPuzzle(open ? null : i)}
                    aria-expanded={open}
                    className="si-heading flex w-full items-start gap-2.5 px-4 py-3 text-left text-sm text-ink-dim transition hover:text-ink"
                  >
                    <span className="mt-0.5 text-cobalt-ink">?</span>
                    <span className="flex-1">{p.question}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="prose-dhamma border-t border-line-soft px-4 py-3 text-[0.93rem]">
                          {rich(p.answer)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </figure>
  );
}
