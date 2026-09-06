"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useState } from "react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { HierarchyBlock, HierarchyNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pali } from "@/components/ui";

const ACCENT = {
  cobalt: {
    ring: "ring-cobalt-500/35",
    bg: "bg-cobalt-500/10",
    text: "text-cobalt-ink",
    dot: "bg-cobalt-500",
  },
  jade: {
    ring: "ring-jade-500/35",
    bg: "bg-jade-500/10",
    text: "text-jade-ink",
    dot: "bg-jade-500",
  },
  lotus: {
    ring: "ring-lotus-500/35",
    bg: "bg-lotus-500/10",
    text: "text-lotus-ink",
    dot: "bg-lotus-500",
  },
} as const;

/** Depth-first flatten so the tiers render as a single vertical column. */
function flatten(nodes: HierarchyNode[], depth = 0): Array<{ node: HierarchyNode; depth: number }> {
  return nodes.flatMap((node) => [
    { node, depth },
    ...flatten(node.children ?? [], depth + 1),
  ]);
}

/**
 * Realm / office hierarchy with an inspectable card per tier.
 *
 * Distinct from `taxonomy`, which counts things. This one answers "who sits
 * where and what are they responsible for", so each node carries a detail card
 * rather than a number.
 */
export function Hierarchy({ block }: { block: HierarchyBlock }) {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = flatten(block.root);
  const open = rows.find((r) => r.node.id === openId)?.node;

  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3.5">
        <h4 className="si-heading text-sm font-semibold text-ink-dim">
          {block.title ?? t.hierarchy.heading}
        </h4>
        <span className="si-tight text-xs text-ink-faint">
          {t.hierarchy.tapToInspect}
        </span>
      </div>

      <ol className="px-5 py-6">
        {rows.map(({ node, depth }, i) => {
          const a = ACCENT[node.accent ?? "cobalt"];
          const isOpen = node.id === openId;
          const last = i === rows.length - 1;

          return (
            <li
              key={node.id}
              className="relative"
              style={{ paddingLeft: `${depth * 1.25}rem` }}
            >
              {/* connector */}
              {!last && (
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 top-8 w-px bg-line"
                  style={{ left: `${depth * 1.25 + 0.75}rem` }}
                />
              )}

              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : node.id)}
                aria-expanded={isOpen}
                className={cn(
                  "relative mb-2 flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left ring-1 transition-all",
                  isOpen
                    ? cn(a.bg, a.ring)
                    : "bg-surface-2/50 ring-line hover:bg-surface-2 hover:ring-line",
                )}
              >
                <span
                  className={cn(
                    "mt-1 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-surface",
                    a.dot,
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2.5">
                    <span
                      className={cn(
                        "si-heading font-semibold",
                        isOpen ? a.text : "text-ink",
                      )}
                    >
                      {node.label}
                    </span>
                    {node.pali && (
                      <Pali className="text-xs text-ink-faint">{node.pali}</Pali>
                    )}
                  </span>
                  <span className="si-tight mt-0.5 block text-xs text-ink-faint">
                    {node.tier}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* detail card */}
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key={open.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-surface-2/50"
          >
            <div className="px-5 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h5
                    className={cn(
                      "si-heading text-lg font-semibold",
                      ACCENT[open.accent ?? "cobalt"].text,
                    )}
                  >
                    {open.label}
                  </h5>
                  {open.pali && (
                    <Pali className="text-sm text-ink-faint">{open.pali}</Pali>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(null)}
                  aria-label={t.nav.menuClose}
                  className="text-ink-faint transition hover:text-ink"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="prose-dhamma mt-3 text-[0.96rem]">
                {rich(open.summary)}
              </p>

              {open.details && open.details.length > 0 && (
                <dl className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {open.details.map((d, i) => (
                    <div key={i} className="border-t border-line-soft pt-2.5">
                      <dt className="si-tight text-xs text-ink-faint">
                        {d.label}
                      </dt>
                      <dd className="si-heading mt-0.5 text-sm text-ink-dim">
                        {rich(d.value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </figure>
  );
}
