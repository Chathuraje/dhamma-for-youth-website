"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { seeded } from "@/lib/utils";

/**
 * Ambient background for the landing hero.
 *
 * Concentric rings expanding from a still centre, with a slow drift of motes
 * around them - arising, persisting, passing. It is decorative: it carries no
 * information, sits behind `aria-hidden`, and stops entirely for anyone who
 * has asked for reduced motion.
 *
 * Positions come from a seeded PRNG rather than Math.random so the server and
 * client render identical markup.
 */
export function MindField({ motes = 26 }: { motes?: number }) {
  const reduce = useReducedMotion();

  const points = useMemo(
    () =>
      Array.from({ length: motes }, (_, i) => ({
        x: seeded(i * 3 + 1) * 100,
        y: seeded(i * 3 + 2) * 100,
        size: 1 + seeded(i * 3 + 3) * 2.4,
        delay: seeded(i * 7 + 5) * 6,
        duration: 9 + seeded(i * 11 + 9) * 11,
        hue: i % 3,
      })),
    [motes],
  );

  const hues = [
    "bg-cobalt-500/55",
    "bg-jade-500/45",
    "bg-lotus-500/45",
  ] as const;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* deep colour wash */}
      <div className="absolute left-1/2 top-1/3 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt-500/14 blur-[120px]" />
      <div className="absolute left-1/3 top-2/3 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-lotus-500/12 blur-[110px]" />
      <div className="absolute right-1/4 top-1/4 h-[26rem] w-[26rem] rounded-full bg-jade-500/12 blur-[100px]" />

      {/* expanding rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full border border-cobalt-500/20"
            style={{
              width: `${14 + i * 11}rem`,
              height: `${14 + i * 11}rem`,
              marginLeft: `-${(14 + i * 11) / 2}rem`,
              marginTop: `-${(14 + i * 11) / 2}rem`,
            }}
            animate={
              reduce
                ? undefined
                : { scale: [1, 1.045, 1], opacity: [0.35, 0.7, 0.35] }
            }
            transition={{
              duration: 8,
              delay: i * 0.9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* motes */}
      {points.map((p, i) => (
        <motion.span
          key={i}
          className={`absolute rounded-full ${hues[p.hue]}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={
            reduce
              ? undefined
              : { y: [0, -28, 0], opacity: [0, 0.9, 0], scale: [0.6, 1, 0.6] }
          }
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* vignette so the hero copy always has contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-canvas)_88%)]" />
    </div>
  );
}
