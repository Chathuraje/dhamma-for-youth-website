"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { SpinWheelBlock } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Above this the points stop resolving and read as one ring. */
const BLUR_THRESHOLD = 55;
const POINTS = 26;

/**
 * The firebrand circle (alāta-cakka).
 *
 * At low speed the learner sees separate points arising and passing. At high
 * speed the identical points read as one unbroken ring. Nothing about the
 * points changed — only the speed. That is santati-ghana, and a slider the
 * learner moves themselves argues it far better than a paragraph can.
 *
 * Under `prefers-reduced-motion` the wheel does not spin; the two states are
 * shown as static illustrations instead, so the teaching still lands.
 */
export function SpinWheel({ block }: { block: SpinWheelBlock }) {
  const reduce = useReducedMotion();
  const [speed, setSpeed] = useState(8);
  const [angle, setAngle] = useState(0);
  const frame = useRef<number | undefined>(undefined);
  const last = useRef<number | undefined>(undefined);

  const fast = speed >= BLUR_THRESHOLD;

  /**
   * Hand-rolled rAF loop rather than a motion animation: the rotation speed
   * changes continuously with the slider, and restarting a keyframe animation
   * on every input event would stutter.
   */
  useEffect(() => {
    if (reduce) return;
    function tick(now: number) {
      if (last.current !== undefined) {
        const dt = (now - last.current) / 1000;
        setAngle((a) => (a + dt * speed * 12) % 360);
      }
      last.current = now;
      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
      last.current = undefined;
    };
  }, [speed, reduce]);

  /** Longer trails at speed — each point smears into the next. */
  const trail = Math.min(Math.round((speed / 100) * POINTS), POINTS - 1);

  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <div className="border-b border-line px-5 py-3.5">
        <h4 className="si-heading text-sm font-semibold text-ink-dim">
          {block.title ?? t.spin.heading}
        </h4>
      </div>

      <div className="px-5 py-8">
        <div className="relative mx-auto aspect-square w-full max-w-[18rem]">
          <div
            className="absolute inset-0"
            style={reduce ? undefined : { transform: `rotate(${angle}deg)` }}
          >
            {Array.from({ length: POINTS }, (_, i) => {
              // Only the leading point is "now"; the rest are its afterimage.
              const withinTrail = i <= trail;
              if (!withinTrail && !reduce) return null;
              const a = (i / POINTS) * Math.PI * 2 - Math.PI / 2;
              const fade = 1 - i / Math.max(trail, 1);
              return (
                <span
                  key={i}
                  className={cn(
                    "absolute h-3.5 w-3.5 rounded-full",
                    i === 0 ? "bg-cobalt-300" : "bg-cobalt-500",
                  )}
                  style={{
                    left: `${50 + Math.cos(a) * 40}%`,
                    top: `${50 + Math.sin(a) * 40}%`,
                    transform: "translate(-50%, -50%)",
                    opacity: reduce ? 1 : 0.25 + fade * 0.75,
                    filter: fast ? "blur(2.5px)" : undefined,
                    boxShadow:
                      i === 0
                        ? "0 0 18px 4px rgb(242 169 75 / 0.6)"
                        : undefined,
                  }}
                />
              );
            })}
          </div>

          {/* the ring only the eye invents */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[10%] rounded-full border-2 border-cobalt-500 transition-opacity duration-500"
            style={{ opacity: fast && !reduce ? 0.55 : 0 }}
          />
        </div>

        {/* speed */}
        <div className="mx-auto mt-8 max-w-md">
          <div className="flex items-baseline justify-between gap-3">
            <label
              htmlFor="spin-speed"
              className="si-heading text-sm text-ink-dim"
            >
              {t.spin.speed}
            </label>
            <span className="font-mono text-xs tabular-nums text-ink-faint">
              {speed}
            </span>
          </div>
          <input
            id="spin-speed"
            type="range"
            min={1}
            max={100}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="mt-2 w-full accent-cobalt-500"
          />
          <div className="mt-1 flex justify-between font-mono text-[0.65rem] text-ink-faint">
            <span>{t.spin.slow}</span>
            <span>{t.spin.fast}</span>
          </div>
        </div>

        {reduce && (
          <p className="si-tight mx-auto mt-4 max-w-md text-center text-xs text-ink-faint">
            {t.spin.reducedMotionNote}
          </p>
        )}
      </div>

      {/* what the learner is looking at */}
      <AnimatePresence mode="wait">
        <motion.div
          key={fast ? "fast" : "slow"}
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : -6 }}
          transition={{ duration: 0.24 }}
          className={cn(
            "border-t border-line px-5 py-5",
            fast ? "bg-rose-500/8" : "bg-jade-500/8",
          )}
        >
          <h5
            className={cn(
              "si-heading text-lg font-semibold",
              fast ? "text-rose-ink" : "text-jade-ink",
            )}
          >
            {fast ? block.fastLabel : block.slowLabel}
          </h5>
          <p className="prose-dhamma mt-1.5 text-[0.96rem]">
            {rich(fast ? block.fastText : block.slowText)}
          </p>
        </motion.div>
      </AnimatePresence>

      {block.conclusion && (
        <p className="prose-dhamma border-t border-line px-5 py-4 text-[0.95rem]">
          {rich(block.conclusion)}
        </p>
      )}
    </figure>
  );
}
