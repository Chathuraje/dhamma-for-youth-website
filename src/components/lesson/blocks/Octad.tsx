"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { OctadBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pali } from "@/components/ui";

/**
 * The suddhaṭṭhaka — eight material realities that cannot be separated.
 *
 * Laid out as a ring rather than a list, because a list implies an order and
 * the doctrinal point is precisely that there is none: all eight arise in the
 * same moment and cease in the same moment. The "arise together" control makes
 * that visible by pulsing every node at once.
 *
 * The zoom ladder above it walks from the everyday down to this — the scale at
 * which division stops.
 */
export function Octad({ block }: { block: OctadBlock }) {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const [pulsing, setPulsing] = useState(false);
  const [zoom, setZoom] = useState((block.scale?.length ?? 1) - 1);

  const active = block.items.find((i) => i.id === selected);
  const scaleStep = block.scale?.[zoom];
  const atBottom = !block.scale || zoom === block.scale.length - 1;

  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h4 className="si-heading text-sm font-semibold text-ink-dim">
          {block.title ?? t.octad.heading}
        </h4>
        <button
          type="button"
          onClick={() => {
            setPulsing(true);
            window.setTimeout(() => setPulsing(false), 2200);
          }}
          className="si-heading flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-ink-dim ring-1 ring-line transition hover:text-ink hover:ring-cobalt-500/40"
        >
          <Sparkles size={12} />
          {t.octad.showSimultaneity}
        </button>
      </div>

      {/* zoom ladder */}
      {block.scale && block.scale.length > 1 && (
        <div className="border-b border-line px-5 py-4">
          <label
            htmlFor="octad-zoom"
            className="si-heading text-xs font-semibold text-ink-faint"
          >
            {t.octad.zoomIn}
          </label>
          <input
            id="octad-zoom"
            type="range"
            min={0}
            max={block.scale.length - 1}
            step={1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="mt-2 w-full accent-jade-500"
          />
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={cn(
                "si-heading text-base font-semibold",
                atBottom ? "text-jade-ink" : "text-ink",
              )}
            >
              {scaleStep?.label}
            </span>
            <span className="font-mono text-[0.65rem] text-ink-faint">
              {zoom + 1}/{block.scale.length}
            </span>
          </div>
          {scaleStep?.note && (
            <p className="prose-dhamma mt-1 text-sm">{rich(scaleStep.note)}</p>
          )}
        </div>
      )}

      {/* the ring */}
      <div
        className={cn(
          "relative px-5 py-8 transition-opacity duration-500",
          !atBottom && "pointer-events-none opacity-25",
        )}
        aria-hidden={!atBottom}
      >
        <div className="relative mx-auto aspect-square w-full max-w-[22rem]">
          {/* binding ring */}
          <motion.div
            className="absolute inset-[18%] rounded-full border border-cobalt-500/25"
            animate={
              pulsing && !reduce
                ? { scale: [1, 1.06, 1], opacity: [0.4, 1, 0.4] }
                : undefined
            }
            transition={{ duration: 1.1, repeat: pulsing ? 1 : 0 }}
          />

          {/* centre */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <Pali className="block text-sm text-cobalt-ink/70">
              suddhaṭṭhaka
            </Pali>
            <span className="si-tight mt-0.5 block text-xs text-ink-faint">
              {t.octad.tapNode}
            </span>
          </div>

          {block.items.map((item, i) => {
            const angle = (i / block.items.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(angle) * 40;
            const y = 50 + Math.sin(angle) * 40;
            const on = selected === item.id;
            const maha = item.group === "maha";

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setSelected(on ? null : item.id)}
                aria-pressed={on}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                animate={
                  pulsing && !reduce
                    ? { scale: [1, 1.18, 1] }
                    : { scale: on ? 1.1 : 1 }
                }
                transition={{
                  duration: pulsing ? 1.1 : 0.25,
                  repeat: pulsing ? 1 : 0,
                  // Zero stagger: they arise together, not in sequence.
                  delay: 0,
                }}
                className={cn(
                  "absolute flex h-[4.6rem] w-[4.6rem] flex-col items-center justify-center rounded-full px-1 text-center ring-1 transition-colors",
                  maha
                    ? "bg-cobalt-500/12 ring-cobalt-500/35"
                    : "bg-jade-500/12 ring-jade-500/35",
                  on &&
                    (maha
                      ? "bg-cobalt-500 ring-cobalt-500"
                      : "bg-jade-500 ring-jade-500"),
                )}
              >
                <span
                  className={cn(
                    "si-tight text-[0.7rem] font-semibold",
                    on ? "text-on-brand" : maha ? "text-cobalt-ink" : "text-jade-ink",
                  )}
                >
                  {item.label}
                </span>
                <Pali
                  className={cn(
                    "text-[0.6rem]",
                    on ? "text-on-brand/70" : "text-ink-faint",
                  )}
                >
                  {item.pali}
                </Pali>
              </motion.button>
            );
          })}
        </div>

        {/* legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-cobalt-ink">
            <span className="h-2 w-2 rounded-full bg-cobalt-500" />
            {t.octad.mahaBhuta}
          </span>
          <span className="flex items-center gap-1.5 text-jade-ink">
            <span className="h-2 w-2 rounded-full bg-jade-500" />
            {t.octad.upadaRupa}
          </span>
        </div>
      </div>

      {/* detail */}
      <AnimatePresence mode="wait">
        {active && atBottom && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduce ? 0 : 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-surface-2/50"
          >
            <div className="px-5 py-5">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h5
                  className={cn(
                    "si-heading text-lg font-semibold",
                    active.group === "maha" ? "text-cobalt-ink" : "text-jade-ink",
                  )}
                >
                  {active.label}
                </h5>
                <Pali className="text-sm text-ink-faint">{active.pali}</Pali>
              </div>
              <p className="prose-dhamma mt-2 text-[0.97rem]">
                {rich(active.short)}
              </p>
              {active.detail && (
                <p className="prose-dhamma mt-2 text-[0.95rem]">
                  {rich(active.detail)}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {block.simultaneityNote && (
        <div className="border-t border-line px-5 py-4">
          <p className="prose-dhamma text-[0.95rem]">
            {rich(block.simultaneityNote)}
          </p>
        </div>
      )}
    </figure>
  );
}
