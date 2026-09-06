"use client";

import { motion, useReducedMotion } from "motion/react";
import { RotateCcw, Scissors } from "lucide-react";
import { useMemo, useState } from "react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { SlicerBlock } from "@/lib/types";
import { cn, seeded } from "@/lib/utils";

const COLS = 11;
const ROWS = 6;
/** The blade passes down this column gap. Odd count keeps it centred. */
const CUT_AT = Math.floor(COLS / 2);

/**
 * Cutting simulator for pariccheda ākāsa.
 *
 * The claim being demonstrated: nothing you cut ever divides an octad. The
 * blade travels through the space *between* octads, pushing them apart. So the
 * magnified view deliberately never splits a node — the nodes separate, intact,
 * and the gap they were already holding becomes visible.
 *
 * Denser materials hold their octads closer together, which is why a knife
 * parts a leaf and only a laser parts steel. Same mechanism, different gap.
 */
export function Slicer({ block }: { block: SlicerBlock }) {
  const reduce = useReducedMotion();
  const [materialId, setMaterialId] = useState(block.materials[0]?.id ?? "");
  const [cut, setCut] = useState(false);

  const material =
    block.materials.find((m) => m.id === materialId) ?? block.materials[0];

  // Jitter so the lattice reads as matter rather than graph paper. Seeded so
  // server and client agree.
  const nodes = useMemo(
    () =>
      Array.from({ length: ROWS * COLS }, (_, i) => ({
        col: i % COLS,
        row: Math.floor(i / COLS),
        dx: (seeded(i * 2 + 1) - 0.5) * 5,
        dy: (seeded(i * 2 + 2) - 0.5) * 5,
      })),
    [],
  );

  /** Tighter lattice for denser material — the gap is smaller, not absent. */
  const spread = 1 - material.density * 0.45;
  const partBy = cut ? 13 : 0;

  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h4 className="si-heading text-sm font-semibold text-ink-dim">
          {block.title ?? t.slicer.heading}
        </h4>
        <button
          type="button"
          onClick={() => setCut(false)}
          disabled={!cut}
          aria-label={t.slicer.reset}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-ink-faint ring-1 ring-line transition hover:text-ink disabled:opacity-30"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {/* material picker */}
      <div className="flex flex-wrap gap-2 border-b border-line px-5 py-3">
        {block.materials.map((m) => {
          const on = m.id === material.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMaterialId(m.id);
                setCut(false);
              }}
              aria-pressed={on}
              className={cn(
                "si-heading rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition-all",
                on
                  ? "bg-jade-500/12 text-jade-ink ring-jade-500/40"
                  : "bg-surface-2 text-ink-faint ring-line hover:text-ink",
              )}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* magnified lattice */}
      <div className="px-5 py-6">
        <p className="si-heading mb-3 text-center text-xs text-ink-faint">
          {t.slicer.magnified}
        </p>

        <div className="relative mx-auto aspect-[16/9] w-full max-w-lg overflow-hidden rounded-xl bg-ground/60 ring-1 ring-line">
          {nodes.map((n, i) => {
            const left = n.col;
            const side = left < CUT_AT ? -1 : left > CUT_AT ? 1 : 0;
            // The centre column is the gap itself — no octad sits in it.
            if (side === 0) return null;

            const baseX = 6 + (left / (COLS - 1)) * 88 * spread + (1 - spread) * 44;
            const baseY = 10 + (n.row / (ROWS - 1)) * 80;

            return (
              <motion.span
                key={i}
                className="absolute h-2.5 w-2.5 rounded-full bg-cobalt-400/70 ring-1 ring-cobalt-300/30"
                style={{ left: `${baseX + n.dx}%`, top: `${baseY + n.dy}%` }}
                animate={{ x: side * partBy }}
                transition={{
                  duration: reduce ? 0 : 0.9,
                  delay: reduce ? 0 : Math.abs(n.row - ROWS / 2) * 0.03,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            );
          })}

          {/* the gap that was always there */}
          <motion.div
            aria-hidden
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-x border-dashed border-jade-500/40 bg-jade-500/5"
            animate={{ width: cut ? 54 : 10, opacity: cut ? 1 : 0.35 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* blade */}
          <motion.div
            aria-hidden
            className="absolute left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-ink to-transparent"
            initial={false}
            animate={
              cut
                ? { top: "0%", height: "100%", opacity: [0, 1, 0] }
                : { top: "-10%", height: "0%", opacity: 0 }
            }
            transition={{ duration: reduce ? 0 : 0.7 }}
          />

          {cut && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduce ? 0 : 0.8 }}
              className="si-tight absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-surface px-2.5 py-1 text-[0.65rem] text-jade-ink ring-1 ring-jade-500/40"
            >
              පරිච්ඡේද අවකාශය
            </motion.span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setCut(true)}
            disabled={cut}
            className="si-heading flex items-center gap-2 rounded-full bg-cobalt-500 px-5 py-2 text-sm font-semibold text-on-brand transition hover:bg-cobalt-400 disabled:opacity-30"
          >
            <Scissors size={14} />
            {material.tool}
          </button>
        </div>

        <p className="prose-dhamma mt-5 text-center text-[0.95rem]">
          {rich(material.note)}
        </p>
      </div>

      <div className="border-t border-line bg-surface-2/40 px-5 py-4">
        <p className="prose-dhamma text-[0.95rem]">{rich(block.explanation)}</p>
      </div>
    </figure>
  );
}
