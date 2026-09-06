"use client";

import { motion, useReducedMotion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { MomentRatioBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pali } from "@/components/ui";

const PHASE_ACCENT = [
  { dot: "bg-jade-500", text: "text-jade-ink", ring: "ring-jade-500/40", soft: "bg-jade-500/12" },
  { dot: "bg-cobalt-500", text: "text-cobalt-ink", ring: "ring-cobalt-500/40", soft: "bg-cobalt-500/12" },
  { dot: "bg-rose-500", text: "text-rose-ink", ring: "ring-rose-500/40", soft: "bg-rose-500/12" },
] as const;

/**
 * One mind-moment, its three sub-moments, and the 17:1 ratio to a materiality.
 *
 * "A rūpa lasts seventeen citta-moments" is unfeelable as a sentence. Running
 * seventeen mind-moments against a single materiality — and letting the learner
 * step through them one at a time or watch them run — turns the ratio into
 * something observed rather than memorised.
 */
export function MomentRatio({ block }: { block: MomentRatioBlock }) {
  const reduce = useReducedMotion();
  const total = block.rupaLifespan;
  const [moment, setMoment] = useState(1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || moment >= total) return;
    const id = setTimeout(() => {
      const next = Math.min(moment + 1, total);
      setMoment(next);
      if (next >= total) setPlaying(false);
    }, 260);
    return () => clearTimeout(id);
  }, [playing, moment, total]);

  /** Which sub-moment of the current citta is showing. */
  const phaseIndex = (moment - 1) % block.phases.length;
  const phase = block.phases[phaseIndex];
  const a = PHASE_ACCENT[phaseIndex % PHASE_ACCENT.length];

  /** The rūpa's own arc across its 17-moment life. */
  const rupaStage =
    moment === 1 ? "uppada" : moment >= total ? "bhanga" : "thiti";

  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h4 className="si-heading text-sm font-semibold text-ink-dim">
          {block.title ?? t.moment.heading}
        </h4>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (moment >= total) setMoment(1);
              setPlaying((p) => !p);
            }}
            className="si-heading flex h-8 items-center gap-1.5 rounded-full bg-surface-2 px-3 text-xs font-medium text-ink-dim ring-1 ring-line transition hover:text-ink"
          >
            {playing ? <Pause size={12} /> : <Play size={12} />}
            {playing ? t.flow.pause : t.flow.play}
          </button>
          <button
            type="button"
            onClick={() => {
              setMoment(1);
              setPlaying(false);
            }}
            aria-label={t.flow.restart}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-ink-faint ring-1 ring-line transition hover:text-ink"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* the two lifespans, side by side */}
      <div className="px-5 py-6">
        {/* citta track — one cell per mind-moment */}
        <p className="si-heading mb-2 text-xs font-semibold text-ink-faint">
          {t.moment.cittaTrack}
        </p>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {Array.from({ length: total }, (_, i) => {
            const n = i + 1;
            const done = n < moment;
            const now = n === moment;
            return (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setMoment(n);
                  setPlaying(false);
                }}
                aria-label={`${t.moment.momentLabel} ${n}`}
                aria-current={now ? "step" : undefined}
                className={cn(
                  "h-9 min-w-6 flex-1 rounded transition-all duration-200",
                  now && "bg-cobalt-500 ring-2 ring-cobalt-300",
                  done && "bg-cobalt-500/35",
                  !now && !done && "bg-surface-3 hover:bg-surface-3/70",
                )}
              />
            );
          })}
        </div>
        <p className="mt-1.5 font-mono text-[0.68rem] text-ink-faint">
          {t.moment.momentLabel} {moment} / {total}
        </p>

        {/* rupa track — one bar spanning all of them */}
        <p className="si-heading mb-2 mt-6 text-xs font-semibold text-ink-faint">
          {t.moment.rupaTrack}
        </p>
        <div className="relative h-9 overflow-hidden rounded bg-surface-3 ring-1 ring-line">
          <motion.div
            className={cn(
              "h-full",
              rupaStage === "uppada" && "bg-jade-500/50",
              rupaStage === "thiti" && "bg-jade-500/35",
              rupaStage === "bhanga" && "bg-rose-500/45",
            )}
            animate={{ width: `${(moment / total) * 100}%` }}
            transition={{ duration: reduce ? 0 : 0.22 }}
          />
          <span className="si-tight absolute inset-0 flex items-center justify-center text-[0.7rem] font-medium text-ink">
            {rupaStage === "uppada" && t.moment.rupaUppada}
            {rupaStage === "thiti" && t.moment.rupaThiti}
            {rupaStage === "bhanga" && t.moment.rupaBhanga}
          </span>
        </div>
        <p className="mt-1.5 font-mono text-[0.68rem] text-ink-faint">
          1 : {total}
        </p>
      </div>

      {/* the sub-moment now showing */}
      <div className={cn("border-t border-line px-5 py-5 transition-colors", a.soft)}>
        <div className="flex flex-wrap items-baseline gap-x-3">
          <span className={cn("h-2 w-2 rounded-full", a.dot)} />
          <h5 className={cn("si-heading text-lg font-semibold", a.text)}>
            {phase.label}
          </h5>
          <Pali className="text-sm text-ink-faint">{phase.pali}</Pali>
        </div>
        <p className="prose-dhamma mt-1.5 text-[0.95rem]">{rich(phase.note)}</p>
      </div>

      {/* the counts */}
      {(block.cittaCount || block.rupaCount) && (
        <div className="grid gap-px border-t border-line bg-line sm:grid-cols-2">
          {block.cittaCount && (
            <div className="bg-surface px-5 py-4 text-center">
              <p className="font-mono text-2xl font-semibold text-cobalt-ink">
                {block.cittaCount}
              </p>
              <p className="si-tight mt-1 text-xs text-ink-faint">
                {t.moment.cittaPerUnit}
                {block.perUnitLabel ? ` ${block.perUnitLabel}` : ""}
              </p>
            </div>
          )}
          {block.rupaCount && (
            <div className="bg-surface px-5 py-4 text-center">
              <p className="font-mono text-2xl font-semibold text-jade-ink">
                {block.rupaCount}
              </p>
              <p className="si-tight mt-1 text-xs text-ink-faint">
                {t.moment.rupaPerUnit}
                {block.perUnitLabel ? ` ${block.perUnitLabel}` : ""}
              </p>
            </div>
          )}
        </div>
      )}

      {block.note && (
        <p className="prose-dhamma border-t border-line px-5 py-4 text-[0.95rem]">
          {rich(block.note)}
        </p>
      )}
    </figure>
  );
}
