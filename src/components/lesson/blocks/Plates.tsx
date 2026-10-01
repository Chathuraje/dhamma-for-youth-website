"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { figureSrc } from "@/lib/images";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { PlatesBlock } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

/**
 * A deck of authored plates, one at a time.
 *
 * These illustrations arrive finished: each carries its own title, its own
 * labels and its own position in the sequence. So the frame stays quiet — no
 * heading competing with the plate's, no caption repeating what is drawn — and
 * does the two things the artwork cannot do for itself: keep the order, and
 * keep only one plate on screen.
 *
 * Portrait plates are why it exists. Seven 4:5 illustrations rendered as
 * separate figures is a section nobody reaches the end of; the height cap plus
 * one-at-a-time keeps the deck the size of a paragraph.
 *
 * The plates are light-ground artwork in a theme that flips, so the frame is a
 * deliberate paper card in both themes rather than a panel that becomes a
 * glowing hole at night.
 *
 * Every plate is in the DOM from the start, hidden with `hidden` rather than
 * unmounted, so stepping never waits on a fetch; only the first is `priority`.
 */
export function Plates({ block }: { block: PlatesBlock }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  const total = block.plates.length;
  const plate = block.plates[index];
  const landscape = block.width >= block.height;

  const go = (delta: number) =>
    setIndex((i) => Math.min(Math.max(i + delta, 0), total - 1));

  return (
    <Reveal>
      <figure className="my-10 overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line">
        {block.title && (
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
            <h4 className="si-heading text-sm font-semibold text-ink-dim">
              {block.title}
            </h4>
            <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[0.7rem] text-ink-faint ring-1 ring-line">
              {formatNumber(index + 1)} / {formatNumber(total)}
            </span>
          </div>
        )}

        {/*
          A fixed paper ground in both themes. The plates are drawn on near-white
          and would read as a hole punched in the dark theme otherwise; framed as
          paper, they read as a printed card someone laid on the page.
        */}
        <div className="bg-[#f4f3ef] p-3 sm:p-5">
          <div
            className={cn(
              "relative mx-auto",
              landscape ? "max-w-[58rem]" : "max-w-[26rem]",
            )}
          >
            {block.plates.map((p, i) => (
              <div key={p.src} hidden={i !== index}>
                <Image
                  src={figureSrc(p.src)}
                  alt={p.alt}
                  width={block.width}
                  height={block.height}
                  priority={i === 0}
                  className={cn(
                    "h-auto w-full rounded-lg",
                    landscape && "shadow-lift ring-1 ring-black/5",
                  )}
                  sizes={
                    landscape
                      ? "(min-width: 1280px) 58rem, (min-width: 1024px) calc(100vw - 28rem), calc(100vw - 2rem)"
                      : "(min-width: 640px) 26rem, 100vw"
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* position and the way through */}
        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label={t.plates.previous}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-line transition-colors enabled:hover:bg-surface-2 disabled:opacity-30"
          >
            <ChevronLeft size={17} />
          </button>

          <div
            className="flex flex-wrap items-center justify-center gap-1.5"
            role="tablist"
            aria-label={t.plates.heading}
          >
            {block.plates.map((p, i) => (
              <button
                key={p.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${t.plates.plate} ${formatNumber(i + 1)}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index
                    ? "w-6 bg-cobalt-500"
                    : "w-2 bg-line hover:bg-ink-faint",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            disabled={index === total - 1}
            aria-label={t.plates.next}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-line transition-colors enabled:hover:bg-surface-2 disabled:opacity-30"
          >
            <ChevronRight size={17} />
          </button>
        </div>

        {plate.caption && (
          <AnimatePresence mode="wait">
            <motion.figcaption
              key={index}
              initial={{ opacity: 0, y: reduce ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.2 }}
              className="prose-dhamma border-t border-line px-5 py-4 text-sm"
            >
              {rich(plate.caption)}
            </motion.figcaption>
          </AnimatePresence>
        )}
      </figure>
    </Reveal>
  );
}
