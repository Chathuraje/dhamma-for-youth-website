"use client";

import { motion, useReducedMotion } from "motion/react";
import { createPortal } from "react-dom";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Distance between the trigger and the card. */
const GAP = 10;
/** Keep the card off the very edge of the viewport. */
const EDGE = 8;

/**
 * A card that hangs off an inline trigger without being clipped by it.
 *
 * An absolutely-positioned popover is cut off by any ancestor that scrolls, and
 * this site is full of them — every wide table and process track scrolls inside
 * its own container, which is exactly where a term chip is most likely to be.
 * So the card is rendered into `document.body` and positioned against the
 * trigger's viewport rect instead: it flips above or below depending on the
 * room available, and clamps to the viewport's edges rather than hanging off
 * the side of a phone.
 *
 * It is rendered off-screen for one layout pass and moved into place by a
 * layout effect, which runs before paint — so the first frame the reader sees
 * is already positioned. The card's own height is what decides above-or-below,
 * and there is no way to know that without measuring it.
 *
 * Scrolling anything re-runs the placement (the listener is capturing, so it
 * catches the table's scroll as well as the page's) and the card stays
 * attached to its word.
 */
export function AnchoredCard({
  id,
  anchor,
  className,
  children,
  onPointerEnter,
  onPointerLeave,
  ...rest
}: {
  id: string;
  anchor: React.RefObject<HTMLElement | null>;
  className?: string;
  children: ReactNode;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  role?: string;
  "data-card"?: string;
}) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number }>();

  useLayoutEffect(() => {
    const place = () => {
      const a = anchor.current?.getBoundingClientRect();
      const card = cardRef.current;
      if (!a || !card) return;

      const h = card.offsetHeight;
      const w = card.offsetWidth;
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;

      const above = a.top - GAP - h >= EDGE;
      setPos({
        top: above
          ? a.top - GAP - h
          : Math.min(a.bottom + GAP, Math.max(EDGE, vh - h - EDGE)),
        left: Math.min(
          Math.max(a.left + a.width / 2 - w / 2, EDGE),
          Math.max(EDGE, vw - w - EDGE),
        ),
      });
    };

    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [anchor]);

  return createPortal(
    <motion.div
      ref={cardRef}
      id={id}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      initial={{ opacity: 0, y: reduce ? 0 : 6, scale: reduce ? 1 : 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: reduce ? 0 : 4, scale: reduce ? 1 : 0.98 }}
      transition={{ duration: reduce ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
      style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999 }}
      className={cn(
        "fixed z-80 max-h-[min(60vh,32rem)] overflow-y-auto rounded-xl bg-surface p-4 text-left shadow-lift ring-1 ring-line",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>,
    document.body,
  );
}
