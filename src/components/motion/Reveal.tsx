"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
};

interface RevealProps {
  children: ReactNode;
  /** Seconds. */
  delay?: number;
  from?: Direction;
  /** Fire once when scrolled into view (default) or every time. */
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}

/**
 * The project's single scroll-entrance animation.
 *
 * Using one primitive everywhere is what makes the site feel composed rather
 * than busy. Reach for a bespoke animation only when the motion carries
 * meaning that this cannot.
 *
 * Respects `prefers-reduced-motion`: content still appears, it just does not
 * travel.
 */
export function Reveal({
  children,
  delay = 0,
  from = "up",
  once = true,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const offset = reduce ? OFFSET.none : OFFSET[from];
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-80px 0px -80px 0px" }}
      transition={{
        duration: reduce ? 0.15 : 0.62,
        delay: reduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Reveals children one after another. Wrap each child in `<StaggerItem>`.
 */
export function Stagger({
  children,
  className,
  gap = 0.07,
  once = true,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  once?: boolean;
  as?: "div" | "ul" | "ol";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once, margin: "-60px 0px" }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: reduce ? 0 : gap } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 14 },
        shown: { opacity: 1, y: 0 },
      }}
      transition={{ duration: reduce ? 0.15 : 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
