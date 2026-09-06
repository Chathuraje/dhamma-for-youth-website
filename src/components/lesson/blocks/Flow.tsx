"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { FlowBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pali } from "@/components/ui";

const ACCENT = {
  cobalt: {
    ring: "ring-cobalt-500",
    bg: "bg-cobalt-500",
    text: "text-cobalt-ink",
    soft: "bg-cobalt-500/12",
    glow: "shadow-[0_0_24px_-4px_rgb(242_169_75_/_0.7)]",
  },
  jade: {
    ring: "ring-jade-500",
    bg: "bg-jade-500",
    text: "text-jade-ink",
    soft: "bg-jade-500/12",
    glow: "shadow-[0_0_24px_-4px_rgb(63_208_176_/_0.7)]",
  },
  lotus: {
    ring: "ring-lotus-500",
    bg: "bg-lotus-500",
    text: "text-lotus-ink",
    soft: "bg-lotus-500/12",
    glow: "shadow-[0_0_24px_-4px_rgb(155_140_250_/_0.7)]",
  },
} as const;

/**
 * A sequence the learner walks through one stage at a time.
 *
 * Built for the citta-vīthi: a cognitive process is not a blur but an ordered
 * series of distinct moments, and seeing them advance one at a time is the
 * whole pedagogical point. Autoplay exists so the learner can also watch the
 * series run at speed and feel it as a single movement.
 */
export function Flow({ block }: { block: FlowBlock }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();
  const last = block.steps.length - 1;

  const step = block.steps[active];
  const accent = ACCENT[step.accent ?? "cobalt"];

  const next = useCallback(
    () => setActive((i) => Math.min(i + 1, last)),
    [last],
  );

  // Autoplay advances from a timer callback, never from the effect body, so
  // reaching the end stops playback without triggering a cascading render.
  useEffect(() => {
    if (!playing || active >= last) return;
    const t = setTimeout(() => {
      const nextIndex = Math.min(active + 1, last);
      setActive(nextIndex);
      if (nextIndex >= last) setPlaying(false);
    }, 1500);
    return () => clearTimeout(t);
  }, [playing, active, last]);

  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h4 className="text-sm si-heading font-semibold text-ink-dim">
          {block.title ?? t.flow.heading}
        </h4>

        <div className="flex items-center gap-1.5">
          {block.autoplayable !== false && (
            <button
              type="button"
              onClick={() => {
                if (active >= last) setActive(0);
                setPlaying((p) => !p);
              }}
              className="flex h-8 items-center gap-1.5 rounded-full bg-surface-2 px-3 text-xs font-medium text-ink-dim ring-1 ring-line transition hover:text-ink hover:ring-cobalt-500/40"
            >
              {playing ? <Pause size={13} /> : <Play size={13} />}
              {playing ? t.flow.pause : t.flow.play}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setActive(0);
              setPlaying(false);
            }}
            aria-label={t.flow.restart}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-ink-dim ring-1 ring-line transition hover:text-ink hover:ring-cobalt-500/40"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* track */}
      <div className="overflow-x-auto px-5 py-6">
        <ol className="flex min-w-max items-center gap-1.5">
          {block.steps.map((s, i) => {
            const a = ACCENT[s.accent ?? "cobalt"];
            const isActive = i === active;
            const isPast = i < active;
            return (
              <li key={i} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setPlaying(false);
                  }}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "group relative flex flex-col items-center gap-2 rounded-xl px-3 py-2 transition-all duration-300",
                    isActive ? a.soft : "hover:bg-surface-2",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ring-1 transition-all duration-300",
                      isActive &&
                        cn(a.bg, a.ring, a.glow, "text-on-brand scale-110"),
                      isPast && cn("ring-line text-ink-dim", a.soft),
                      !isActive &&
                        !isPast &&
                        "bg-surface-2 text-ink-faint ring-line",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={cn(
                      "max-w-26 text-center text-[0.7rem] font-medium leading-tight transition-colors",
                      isActive ? a.text : "text-ink-faint",
                    )}
                  >
                    {s.label}
                  </span>
                </button>

                {i < last && (
                  <span
                    aria-hidden
                    className={cn(
                      "h-px w-6 shrink-0 transition-colors duration-500",
                      i < active ? a.bg : "bg-line",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* detail */}
      <div className="border-t border-line bg-surface-2/40 px-5 py-5 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h5 className={cn("font-display text-lg font-semibold", accent.text)}>
                {step.label}
              </h5>
              {step.pali && (
                <Pali className="text-sm text-ink-faint">{step.pali}</Pali>
              )}
            </div>
            <p className="prose-dhamma mt-2 text-[0.97rem]">
              {rich(step.text)}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setActive((i) => Math.max(i - 1, 0));
              setPlaying(false);
            }}
            disabled={active === 0}
            className="text-sm font-medium text-ink-dim transition hover:text-ink disabled:pointer-events-none disabled:opacity-30"
          >
            &larr; {t.course.previous}
          </button>

          <span className="font-mono text-xs text-ink-faint">
            {active + 1} / {block.steps.length}
          </span>

          <button
            type="button"
            onClick={() => {
              next();
              setPlaying(false);
            }}
            disabled={active === last}
            className="text-sm font-medium text-cobalt-ink transition hover:text-cobalt-ink disabled:pointer-events-none disabled:opacity-30"
          >
            {t.course.next} &rarr;
          </button>
        </div>
      </div>
    </figure>
  );
}
