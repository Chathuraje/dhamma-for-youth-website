"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Hammer, RotateCcw } from "lucide-react";
import { useId, useState } from "react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { DeconstructBlock } from "@/lib/types";
import { cn, seeded } from "@/lib/utils";

/**
 * Step-by-step deconstruction of a conventional object.
 *
 * This is the single most important interaction in the course: the Abhidhamma
 * method carried out rather than explained. The learner picks something
 * ordinary, breaks it repeatedly, and finds that the breaking stops — and what
 * it stops at is the same for every object they try.
 *
 * That last part is why the object picker matters. A pot, a leaf and a human
 * body all bottom out at the same eight realities, and the learner has to run
 * it twice to notice.
 */
export function Deconstruct({ block }: { block: DeconstructBlock }) {
  const reduce = useReducedMotion();
  const [objectId, setObjectId] = useState(block.objects[0]?.id ?? "");
  const [stage, setStage] = useState(0);

  const object =
    block.objects.find((o) => o.id === objectId) ?? block.objects[0];
  const last = object.stages.length - 1;
  const atEnd = stage >= last;
  const current = object.stages[stage];

  function pick(id: string) {
    setObjectId(id);
    setStage(0);
  }

  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-cobalt-500/25">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-gradient-to-r from-cobalt-500/10 to-transparent px-5 py-3.5">
        <h4 className="si-heading text-sm font-semibold text-cobalt-ink">
          {block.title ?? t.deconstruct.heading}
        </h4>
        <button
          type="button"
          onClick={() => setStage(0)}
          disabled={stage === 0}
          aria-label={t.deconstruct.again}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-ink-faint ring-1 ring-line transition hover:text-ink disabled:opacity-30"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {/* object picker */}
      <div className="border-b border-line px-5 py-4">
        <p className="si-heading text-xs font-semibold text-ink-faint">
          {t.deconstruct.chooseObject}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {block.objects.map((o) => {
            const on = o.id === object.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => pick(o.id)}
                aria-pressed={on}
                className={cn(
                  "si-heading flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition-all",
                  on
                    ? "bg-cobalt-500 text-on-brand ring-cobalt-500"
                    : "bg-surface-2 text-ink-dim ring-line hover:text-ink hover:ring-cobalt-500/40",
                )}
              >
                {o.glyph && <span aria-hidden>{o.glyph}</span>}
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* stage rail */}
      <div className="border-b border-line px-5 py-3">
        <div className="flex items-center gap-1.5">
          {object.stages.map((s, i) => (
            <div key={i} className="flex flex-1 items-center gap-1.5">
              <motion.div
                className={cn(
                  "h-1 flex-1 rounded-full",
                  i <= stage ? "bg-cobalt-500" : "bg-surface-3",
                )}
                animate={{ opacity: i <= stage ? 1 : 0.5 }}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 font-mono text-[0.68rem] text-ink-faint">
          {t.deconstruct.stage} {stage + 1} / {object.stages.length}
        </p>
      </div>

      {/* the breaking */}
      <div className="px-5 py-6">
        <ShatterView
          shape={object.shape ?? "vessel"}
          stage={stage}
          last={last}
          reduce={reduce}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={`${object.id}-${stage}`}
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-center"
          >
            <h5
              className={cn(
                "si-heading text-lg font-semibold",
                atEnd ? "text-jade-ink" : "text-ink",
              )}
            >
              {current.label}
            </h5>
            <p className="prose-dhamma mx-auto mt-2 max-w-md text-[0.95rem]">
              {rich(current.text)}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setStage((s) => Math.min(s + 1, last))}
            disabled={atEnd}
            className={cn(
              "si-heading flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
              atEnd
                ? "cursor-default bg-jade-500/15 text-jade-ink ring-1 ring-jade-500/40"
                : "bg-cobalt-500 text-on-brand hover:bg-cobalt-400",
            )}
          >
            {!atEnd && <Hammer size={14} />}
            {atEnd ? t.deconstruct.reachedEnd : t.deconstruct.breakItDown}
          </button>
        </div>
      </div>

      {/* verdict */}
      <AnimatePresence>
        {atEnd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduce ? 0 : 0.35 }}
            className="overflow-hidden border-t border-line bg-surface-2/50"
          >
            <div className="px-5 py-5">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="si-tight text-xs text-ink-faint">
                    {t.deconstruct.dominant}
                  </dt>
                  <dd className="si-heading mt-1 text-sm font-medium text-cobalt-ink">
                    {object.dominant}
                  </dd>
                </div>
                <div>
                  <dt className="si-tight text-xs text-ink-faint">
                    {t.deconstruct.separation}
                  </dt>
                  <dd className="prose-dhamma mt-1 text-sm">
                    {rich(object.separation)}
                  </dd>
                </div>
              </dl>

              <p className="prose-dhamma mt-5 border-t border-line-soft pt-4 text-[0.95rem]">
                {rich(block.conclusion)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </figure>
  );
}


/* -------------------------------------------------------------------------- */
/*  The viewport                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Silhouettes in a 100x100 box.
 *
 * Deliberately drawn objects rather than generic tiles: the first stage of the
 * exercise is still the everyday thing, and asking a learner to break a scatter
 * of squares is asking them to break something they were never shown. The
 * shapes stay flat and diagrammatic — they are what is being analysed, not
 * illustration for its own sake.
 */
const SHAPE: Record<NonNullable<DeconstructObject["shape"]>, string> = {
  // clay pot: narrow neck, bulbous body
  vessel:
    "M50 12c-7 0-12 2-12 5 0 2 2 3 5 4-14 6-23 18-23 31 0 18 13 32 30 32s30-14 30-32c0-13-9-25-23-31 3-1 5-2 5-4 0-3-5-5-12-5z",
  // leaf: pointed ellipse
  leaf: "M50 8c24 16 34 42 0 84C16 50 26 24 50 8z",
  // water: a body of liquid under a wave
  liquid:
    "M10 44c8-8 16-8 24 0s16 8 24 0 16-8 24 0v34c0 6-5 10-11 10H21c-6 0-11-4-11-10z",
  // human figure: head plus torso and limbs
  body: "M50 6a10 10 0 110 20 10 10 0 010-20zM50 29c-11 0-17 6-17 15v20c0 3 2 5 5 5v22c0 3 2 6 5 6s5-3 5-6V75h4v16c0 3 2 6 5 6s5-3 5-6V69c3 0 5-2 5-5V44c0-9-6-15-17-15z",
};

type DeconstructObject = DeconstructBlock["objects"][number];

/** Cells per side at each stage — how finely the silhouette is cut. */
function gridFor(stage: number) {
  return Math.min(1 + stage, 7);
}

/**
 * The object fragmenting.
 *
 * The same silhouette is drawn once per cell of a jittered grid and clipped to
 * that cell, so what separates is genuinely the object breaking along fracture
 * lines rather than an unrelated scatter appearing in its place. Each stage
 * cuts finer and pushes the pieces further apart.
 *
 * The final stage abandons the silhouette entirely, and that is the point: the
 * eight remain, ringed by their own space, and they no longer have the shape of
 * anything. The count is the message.
 */
function ShatterView({
  shape,
  stage,
  last,
  reduce,
}: {
  shape: NonNullable<DeconstructObject["shape"]>;
  stage: number;
  last: number;
  reduce: boolean | null;
}) {
  const uid = useId().replace(/:/g, "");
  const atEnd = stage >= last;
  const grid = gridFor(stage);
  const cell = 100 / grid;
  const path = SHAPE[shape];

  return (
    <div className="relative mx-auto flex aspect-[2/1] w-full max-w-md items-center justify-center overflow-hidden rounded-xl bg-ground/50 ring-1 ring-line">
      {atEnd ? (
        <OctadRing reduce={reduce} />
      ) : (
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            {Array.from({ length: grid * grid }, (_, i) => {
              const col = i % grid;
              const row = Math.floor(i / grid);
              // Jitter the cut lines so the breaks look like fractures
              // rather than a printed grid.
              const jx = (seeded(i * 5 + 1) - 0.5) * cell * 0.45;
              const jy = (seeded(i * 5 + 2) - 0.5) * cell * 0.45;
              return (
                <clipPath key={i} id={`${uid}-${stage}-${i}`}>
                  <rect
                    x={col * cell + jx}
                    y={row * cell + jy}
                    width={cell + 0.4}
                    height={cell + 0.4}
                  />
                </clipPath>
              );
            })}
          </defs>

          {Array.from({ length: grid * grid }, (_, i) => {
            const col = i % grid;
            const row = Math.floor(i / grid);
            const cx = col * cell + cell / 2;
            const cy = row * cell + cell / 2;
            // Push each piece away from the centre of the object.
            const dx = cx - 50;
            const dy = cy - 50;
            const len = Math.hypot(dx, dy) || 1;
            const push = stage * 3.2;
            const spin = (seeded(i * 7 + stage) - 0.5) * stage * 9;

            return (
              <motion.g
                key={`${stage}-${i}`}
                clipPath={`url(#${uid}-${stage}-${i})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: reduce ? 0 : 0.4,
                  delay: reduce ? 0 : (i % 9) * 0.02,
                }}
                style={{
                  transform: `translate(${(dx / len) * push}px, ${
                    (dy / len) * push
                  }px) rotate(${spin}deg)`,
                  transformOrigin: `${cx}px ${cy}px`,
                }}
              >
                <path d={path} className="fill-cobalt-400/85" />
              </motion.g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

/** Eight realities in a ring, each held apart by its own space. */
function OctadRing({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="relative h-32 w-32">
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
        return (
          <motion.span
            key={i}
            className={cn(
              "absolute h-4 w-4 rounded-full ring-2 ring-jade-500/30",
              i < 4 ? "bg-cobalt-400" : "bg-jade-400",
            )}
            style={{
              left: `${50 + Math.cos(angle) * 38}%`,
              top: `${50 + Math.sin(angle) * 38}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            // No stagger: they arise together.
            transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.1 }}
          />
        );
      })}
      <motion.span
        className="absolute inset-[26%] rounded-full border border-dashed border-jade-500/40"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: reduce ? 0 : 0.3 }}
      />
    </div>
  );
}
