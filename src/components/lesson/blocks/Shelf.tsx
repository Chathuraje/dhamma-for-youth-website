"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { TermPopover } from "@/components/lesson/TermPopover";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { ShelfBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pali } from "@/components/ui";

/** Unselected spines sit level; the ramp is what `ascending` buys you. */
const BASE_HEIGHT = 8.5;
const RAMP = 5.5;
const LEVEL_HEIGHT = 11;

/**
 * An ordered set of works, drawn as a shelf you pull volumes from.
 *
 * A list would render the same data and lose the one thing that matters: a
 * canon is a *sequence*, and the seven treatises deepen as they go. Spines
 * standing side by side say that at a glance, and `ascending` says it twice by
 * drawing each volume taller than the last.
 *
 * Gold, not cobalt — this is the register the design system reserves for
 * canon, quotation and commentary.
 *
 * One volume is open from the start. A shelf with nothing pulled out is a row
 * of unreadable rectangles, and a reader who never taps still gets content.
 */
export function Shelf({ block }: { block: ShelfBlock }) {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState(block.volumes[0]?.id ?? "");
  const uid = useId();

  const total = block.volumes.length;
  const open =
    block.volumes.find((v) => v.id === openId) ?? block.volumes[0];

  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h4 className="si-heading text-sm font-semibold text-ink-dim">
          {block.title ?? t.shelf.heading}
        </h4>
        <span className="si-heading text-xs text-ink-faint">
          <span className="font-mono tabular-nums">{total}</span>{" "}
          {t.shelf.volumes}
        </span>
      </div>

      {/* -- the shelf ------------------------------------------------------ */}
      <div className="overflow-x-auto px-5 pt-8">
        <div className="mx-auto w-fit min-w-full">
          <div className="flex items-end justify-center gap-1.5 sm:gap-2">
            {block.volumes.map((volume, i) => {
              const isOpen = volume.id === open?.id;
              const height = block.ascending
                ? BASE_HEIGHT + (i / Math.max(total - 1, 1)) * RAMP
                : LEVEL_HEIGHT;

              return (
                <motion.button
                  key={volume.id}
                  type="button"
                  id={`${uid}-spine-${volume.id}`}
                  aria-pressed={isOpen}
                  aria-controls={`${uid}-panel`}
                  onClick={() => setOpenId(volume.id)}
                  animate={{ y: isOpen && !reduce ? -10 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: `${height}rem` }}
                  className={cn(
                    "group relative flex w-11 shrink-0 flex-col items-center justify-between rounded-t-md px-1 pb-2 pt-3 ring-1 transition-colors sm:w-12",
                    isOpen
                      ? "bg-gold-500/12 text-gold-ink ring-gold-500/45"
                      : "bg-surface-2 text-ink-dim ring-line hover:bg-surface-3 hover:text-ink",
                  )}
                >
                  {/* the two bands a bound spine carries */}
                  <span
                    aria-hidden
                    className={cn(
                      "h-2 w-full shrink-0 border-y",
                      isOpen ? "border-gold-500/35" : "border-line",
                    )}
                  />

                  <span
                    className="si-heading min-h-0 flex-1 overflow-hidden whitespace-nowrap py-2 text-[0.8rem] font-medium [text-orientation:sideways] [writing-mode:vertical-rl]"
                  >
                    {volume.label}
                  </span>

                  <span
                    aria-hidden
                    className={cn(
                      "shrink-0 font-mono text-[0.6rem] tabular-nums",
                      isOpen ? "text-gold-ink/70" : "text-ink-mute",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* the board they stand on */}
          <div aria-hidden className="mt-0 h-2 rounded-sm bg-gold-500/25" />
          <div
            aria-hidden
            className="mx-2 h-4 rounded-b-xl bg-gradient-to-b from-ink/8 to-transparent"
          />
        </div>
      </div>

      <p className="si-heading px-5 pb-5 text-center text-xs text-ink-faint">
        {t.shelf.open}
      </p>

      {/* -- the volume that is out -------------------------------------- */}
      {open && (
        <div
          id={`${uid}-panel`}
          aria-labelledby={`${uid}-spine-${open.id}`}
          className="border-t border-line bg-surface-2/50 px-5 py-5"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={open.id}
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h5 className="si-heading font-display text-lg font-semibold text-ink">
                  {open.label}
                </h5>
                {open.pali ? (
                  /*
                    The volume's own name is where its glossary entry belongs:
                    the whole entry opens on hover, so there is nothing to go
                    to a glossary page for.
                  */
                  open.term ? (
                    <TermPopover
                      id={open.term}
                      className="text-sm underline decoration-gold-500/50 decoration-dotted underline-offset-4 transition-colors hover:decoration-gold-500"
                    >
                      <Pali className="text-gold-ink">{open.pali}</Pali>
                    </TermPopover>
                  ) : (
                    <Pali className="text-sm text-gold-ink">{open.pali}</Pali>
                  )
                ) : null}
              </div>

              <p className="prose-dhamma mt-2 text-[0.95rem]">
                {rich(open.text)}
              </p>

            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </figure>
  );
}
