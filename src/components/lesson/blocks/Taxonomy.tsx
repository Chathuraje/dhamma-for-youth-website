"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { TaxonomyBlock, TaxonomyNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pali } from "@/components/ui";

/**
 * An expandable classification tree.
 *
 * Abhidhamma is, structurally, a set of nested enumerations - 89 cittas split
 * by plane, then by root, then by feeling. A flat list hides that shape. This
 * block lets the learner open one branch at a time and watch the counts add up,
 * which is how the categories are actually memorised.
 */

/** Sum of leaf counts under a node (or its own count if it is a leaf). */
function subtotal(node: TaxonomyNode): number {
  if (!node.children?.length) return node.count ?? 0;
  return node.children.reduce((n, c) => n + subtotal(c), 0);
}

function Node({
  node,
  depth,
  defaultOpen,
}: {
  node: TaxonomyNode;
  depth: number;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const reduce = useReducedMotion();
  const hasChildren = Boolean(node.children?.length);
  const total = subtotal(node);

  return (
    <li>
      <div
        className={cn(
          "group relative flex items-start gap-2 rounded-lg py-1.5 pr-2 transition-colors",
          hasChildren && "cursor-pointer hover:bg-surface-2/70",
        )}
        style={{ paddingLeft: `${depth * 1.15 + 0.5}rem` }}
        onClick={hasChildren ? () => setOpen((v) => !v) : undefined}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-expanded={open}
            aria-label={`${open ? t.taxonomy.collapse : t.taxonomy.expand}: ${node.label}`}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-ink-faint transition-colors group-hover:text-cobalt-ink"
          >
            <motion.span
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: reduce ? 0 : 0.2 }}
              className="flex"
            >
              <ChevronRight size={14} />
            </motion.span>
          </button>
        ) : (
          <span
            aria-hidden
            className="mt-2.5 ml-1.5 h-1 w-1 shrink-0 rounded-full bg-cobalt-500/50"
          />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
            <span
              className={cn(
                "font-medium leading-snug",
                depth === 0 ? "text-ink" : "text-ink-dim",
                depth === 0 && "text-[1.02rem]",
              )}
            >
              {node.label}
            </span>
            {node.pali && (
              <Pali className="text-sm text-cobalt-ink/75">{node.pali}</Pali>
            )}
            {total > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-mono text-[0.65rem] font-semibold tabular-nums",
                  depth === 0
                    ? "bg-cobalt-500/15 text-cobalt-ink"
                    : "bg-surface-2 text-ink-faint",
                )}
              >
                {total}
              </span>
            )}
          </div>

          {node.note && (
            <p className="mt-0.5 text-sm leading-relaxed text-ink-faint">
              {rich(node.note)}
            </p>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: reduce ? 0 : 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="overflow-hidden"
          >
            <div
              className="border-l border-line-soft"
              style={{ marginLeft: `${depth * 1.15 + 1.05}rem` }}
            >
              <div style={{ marginLeft: `-${depth * 1.15 + 1.05}rem` }}>
                {node.children!.map((child) => (
                  <Node
                    key={child.id}
                    node={child}
                    depth={depth + 1}
                    defaultOpen={false}
                  />
                ))}
              </div>
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Taxonomy({ block }: { block: TaxonomyBlock }) {
  const computed = useMemo(
    () => block.root.reduce((n, r) => n + subtotal(r), 0),
    [block.root],
  );
  const total = block.total ?? computed;

  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3.5">
        <h4 className="text-sm si-heading font-semibold text-ink-dim">
          {block.title ?? t.taxonomy.heading}
        </h4>
        {total > 0 && (
          <span className="font-mono text-xs text-ink-faint">
            <span className="text-cobalt-ink">{total}</span> {t.taxonomy.total}
          </span>
        )}
      </div>

      <ul className="px-3 py-4">
        {block.root.map((node) => (
          <Node key={node.id} node={node} depth={0} defaultOpen />
        ))}
      </ul>

      {block.total !== undefined && block.total !== computed && (
        <p className="border-t border-line px-5 py-2 text-xs text-rose-ink">
          {t.taxonomy.countMismatch}: {computed} / {block.total}
        </p>
      )}
    </figure>
  );
}
