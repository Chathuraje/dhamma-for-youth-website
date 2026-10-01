"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { SpinWheelBlock } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

/** Above this the smear has closed and the eye reads one continuous ring. */
const BLUR_THRESHOLD = 55;

/** How many momentary points `mode: "points"` draws. Fixed, at every speed. */
const POINTS = 12;

/** Geometry of the SVG viewBox, in its own units. */
const R = 40;
const CIRCUMFERENCE = 2 * Math.PI * R;

/**
 * The firebrand circle (alāta-cakka).
 *
 * There is exactly ONE firebrand, at every speed. What changes with the slider
 * is how long its afterimage is — at rest a spark, at speed a smear, and past
 * the threshold a closed ring that was never there.
 *
 * An earlier version added more dots as the speed rose, which taught the
 * opposite of the simile: a learner watching objects multiply concludes that
 * speed creates things, when the whole point is that speed creates the
 * *appearance* of a thing out of one that keeps moving. The count is now drawn
 * on screen and stays at one, so the eye can check itself.
 *
 * The trail is a tapering stroked arc rather than a row of dots for the same
 * reason: discrete dots read as separate brands, a smear reads as one brand
 * seen badly. Three nested arcs give the taper without ever looking countable.
 *
 * Under `prefers-reduced-motion` nothing spins; the brand sits still with the
 * invented ring drawn faintly behind it, and the two descriptions still switch
 * with the slider, so the teaching lands without motion.
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

  /**
   * How much of the circle the afterimage covers. Closes to a full 360° right
   * at the threshold, so "it looks like a ring" and "the copy says ring" are
   * the same moment rather than two nearby ones.
   */
  const count = block.mode === "points" ? POINTS : 1;

  /**
   * Each emitter only ever has to smear as far as the next one to close the
   * ring, so both modes reach "unbroken" at the same point on the slider.
   */
  const maxSweep = 360 / count;
  const sweep = reduce
    ? maxSweep
    : Math.min(maxSweep, (speed / BLUR_THRESHOLD) * maxSweep);

  /** Longest and faintest first, so the head sits on top of its own smear. */
  const tail = [
    { span: 1, opacity: 0.18, width: 5.5, blur: 2.6 },
    { span: 0.62, opacity: 0.3, width: 6, blur: 1.8 },
    { span: 0.28, opacity: 0.5, width: 6.5, blur: 1.1 },
  ];

  const headAngle = reduce ? 0 : sweep;

  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <div className="border-b border-line px-5 py-3.5">
        <h4 className="si-heading text-sm font-semibold text-ink-dim">
          {block.title ?? t.spin.heading}
        </h4>
      </div>

      <div className="px-5 py-8">
        <div className="relative mx-auto aspect-square w-full max-w-[18rem]">
          {/* the ring only the eye invents */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[10%] rounded-full border-2 border-gold-500 transition-opacity duration-500"
            style={{ opacity: fast ? 0.4 : 0 }}
          />

          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              <radialGradient id="spin-ember">
                <stop offset="0%" stopColor="rgb(255 244 214)" />
                <stop offset="45%" stopColor="rgb(245 185 63)" />
                <stop offset="100%" stopColor="rgb(217 91 32 / 0)" />
              </radialGradient>
            </defs>

            {/*
              Rotated so the arc *ends* where the brand is: the smear is what
              the brand has already passed through, never where it is going.
            */}
            {Array.from({ length: count }, (_, i) => (
            <g
              key={i}
              transform={`rotate(${angle - sweep + i * (360 / count)} 50 50)`}
            >
              {tail.map((layer) => {
                const arc = (CIRCUMFERENCE * sweep * layer.span) / 360;
                return (
                  <circle
                    key={layer.span}
                    cx={50}
                    cy={50}
                    r={R}
                    fill="none"
                    stroke="rgb(245 185 63)"
                    strokeWidth={layer.width}
                    strokeLinecap="round"
                    strokeDasharray={`${arc} ${CIRCUMFERENCE}`}
                    strokeDashoffset={-(CIRCUMFERENCE * (sweep - sweep * layer.span)) / 360}
                    opacity={layer.opacity}
                    style={{ filter: `blur(${layer.blur}px)` }}
                    transform="rotate(-90 50 50)"
                  />
                );
              })}

              {/* THE firebrand — one, always one */}
              <g
                transform={`rotate(${headAngle} 50 50)`}
                style={{ transformOrigin: "50px 50px" }}
              >
                <circle cx={50} cy={50 - R} r={9} fill="url(#spin-ember)" opacity={0.75} />
                <circle cx={50} cy={50 - R} r={3.4} fill="rgb(255 250 235)" />
              </g>
            </g>
            ))}
          </svg>

          {/* the count, so the eye can check itself */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="si-heading text-[0.7rem] text-ink-faint">
              {block.mode === "points" ? t.spin.pointCount : t.spin.brandCount}
            </span>
            <span className="font-display text-3xl font-semibold tabular-nums text-ink">
              {formatNumber(count)}
            </span>
          </div>
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
            fast ? "bg-gold-500/8" : "bg-jade-500/8",
          )}
        >
          <h5
            className={cn(
              "si-heading text-lg font-semibold",
              fast ? "text-gold-ink" : "text-jade-ink",
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
