import { rich } from "@/lib/richtext";
import type { StructureBlock, StructureNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pali } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";

const ACCENT = {
  cobalt: {
    tile: "bg-cobalt-500/10 ring-cobalt-500/30",
    text: "text-cobalt-200",
    rule: "bg-cobalt-500/40",
  },
  jade: {
    tile: "bg-jade-500/10 ring-jade-500/30",
    text: "text-jade-200",
    rule: "bg-jade-500/40",
  },
  lotus: {
    tile: "bg-lotus-500/10 ring-lotus-500/30",
    text: "text-lotus-200",
    rule: "bg-lotus-500/40",
  },
  neutral: {
    tile: "bg-surface-2 ring-line",
    text: "text-ink",
    rule: "bg-line",
  },
} as const;

/** Leaves under a node — the horizontal share its band takes. */
function span(node: StructureNode): number {
  if (!node.children?.length) return 1;
  return node.children.reduce((n, c) => n + span(c), 0);
}

/**
 * How a whole divides, drawn as a partition rather than a tree.
 *
 * Nothing here opens or closes. A learner meeting "the teaching divides in two,
 * and one half divides again" should see that shape before reading a word of
 * it, which a diagram does and a list of expandable rows does not.
 *
 * Below `sm` the bands stack into a nested cascade rather than shrinking into
 * unreadable columns — Sinhala does not survive a three-column split on a
 * phone.
 */
export function Structure({ block }: { block: StructureBlock }) {
  return (
    <Reveal>
      <figure className="my-10">
        {block.title && (
          <figcaption className="si-heading mb-5 text-xs font-semibold text-ink-faint">
            {block.title}
          </figcaption>
        )}

        <div className="rounded-2xl bg-surface p-4 ring-1 ring-line sm:p-6">
          <Node node={block.root} depth={0} />
        </div>

        {block.caption && (
          <p className="prose-dhamma mt-4 text-sm">{rich(block.caption)}</p>
        )}
      </figure>
    </Reveal>
  );
}

function Node({ node, depth }: { node: StructureNode; depth: number }) {
  const a = ACCENT[node.accent ?? (depth === 0 ? "neutral" : "cobalt")];
  const kids = node.children ?? [];

  return (
    <div
      className="flex min-w-0 flex-col"
      style={{ flexGrow: span(node), flexBasis: 0 }}
    >
      {/* the band for this node */}
      <div
        className={cn(
          "rounded-xl px-4 py-3 ring-1",
          a.tile,
          // A leaf stretches to the foot of the diagram, so the partition
          // closes flush instead of leaving ragged columns.
          kids.length === 0 && "flex-1",
        )}
      >
        <p className={cn("si-tight text-sm font-semibold", a.text)}>
          {node.label}
        </p>
        {node.pali && (
          <Pali className="mt-0.5 block text-xs text-ink-faint">
            {node.pali}
          </Pali>
        )}
        {node.note && (
          <p className="prose-dhamma mt-1.5 text-xs leading-relaxed">
            {rich(node.note)}
          </p>
        )}
      </div>

      {kids.length > 0 && (
        <>
          {/* the split: a rule the children hang from */}
          <div
            aria-hidden
            className="ml-4 h-4 w-px shrink-0 sm:mx-auto sm:ml-auto"
          >
            <span className={cn("block h-full w-px", a.rule)} />
          </div>

          <div className="ml-4 flex min-w-0 flex-col gap-3 sm:ml-0 sm:flex-row">
            {kids.map((child) => (
              <Node key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
