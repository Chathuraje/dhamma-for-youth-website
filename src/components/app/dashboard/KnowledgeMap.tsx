"use client";

import Link from "next/link";
import {
  Blend,
  Box,
  Brain,
  Check,
  CircleDot,
  Hexagon,
  type LucideIcon,
  Network,
  Sprout,
  Waves,
} from "lucide-react";

import { Pali, Panel, PanelAction } from "@/components/ui";
import type { MapNode } from "@/lib/course";
import { useHydrated, useProgress } from "@/lib/progress";
import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";

/**
 * THE KNOWLEDGE MAP
 * =================
 * The course as a chain of concepts rather than a chain of lessons: what you
 * have to hold in your head, in the order the lessons hand it to you.
 *
 * The chain is derived in `knowledgeMap()` from each lesson's first key term,
 * so it cannot drift from the teaching — and no concept appears here that a
 * lesson did not name. To change the chain, change a lesson's `keyTerms`.
 *
 * A node fills in once its lesson has been opened. That is the only thing on
 * the strip that needs the browser, which is why this is a client component
 * taking the nodes as plain props.
 */
export function KnowledgeMap({ nodes }: { nodes: MapNode[] }) {
  const completed = useProgress((s) => s.completed);
  const hydrated = useHydrated();

  if (nodes.length === 0) return null;

  return (
    <Panel
      title={t.dashboard.knowledgeMap}
      action={<PanelAction href="/glossary">{t.dashboard.fullMap}</PanelAction>}
      bodyClassName="px-0 sm:px-0"
    >
      <ol className="flex items-start gap-0 overflow-x-auto px-5 pb-2 sm:px-6">
        {nodes.map((node, i) => {
          const read = hydrated && (completed[node.lessonSlug]?.length ?? 0) > 0;
          const Icon = ICONS[i % ICONS.length];
          const tone = TONES[i % TONES.length];

          return (
            <li key={node.id} className="flex shrink-0 items-start">
              <Link
                href={`/glossary#${node.id}`}
                title={node.short}
                className="group flex w-23 flex-col items-center gap-2 rounded-xl px-1 py-2 text-center transition-colors hover:bg-surface-2"
              >
                <span className="relative">
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full ring-1 transition-all duration-300 group-hover:scale-105",
                      read
                        ? cn(tone.solid, "text-on-brand ring-transparent")
                        : cn(tone.tint, tone.ink, tone.ring),
                    )}
                  >
                    <Icon size={20} strokeWidth={1.8} aria-hidden />
                  </span>

                  {read ? (
                    <span
                      aria-hidden
                      className="absolute -bottom-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-jade-500 text-on-brand ring-2 ring-surface"
                    >
                      <Check size={10} strokeWidth={3.5} />
                    </span>
                  ) : null}
                </span>

                <span className="si-heading block text-[0.72rem] font-medium leading-tight text-ink">
                  {node.si}
                </span>
                <Pali className="block text-[0.6rem] not-italic leading-none text-ink-mute">
                  {node.pali}
                </Pali>
              </Link>

              {i < nodes.length - 1 ? (
                <span
                  aria-hidden
                  className="mt-[1.65rem] h-px w-5 shrink-0 bg-line"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}

/**
 * A different icon per position. These are visual markers, not claims about
 * what each concept *is* — a chain of eight identical circles reads as one
 * blur, and a reader navigating back to a term remembers "the cube one".
 */
const ICONS: LucideIcon[] = [
  Sprout,
  Brain,
  Network,
  Box,
  Blend,
  Hexagon,
  Waves,
  CircleDot,
];

/** Cycled with the icons so consecutive nodes never share a colour. */
const TONES = [
  {
    solid: "bg-jade-500",
    tint: "bg-jade-500/10",
    ink: "text-jade-ink",
    ring: "ring-jade-500/25",
  },
  {
    solid: "bg-cobalt-500",
    tint: "bg-cobalt-500/10",
    ink: "text-cobalt-ink",
    ring: "ring-cobalt-500/25",
  },
  {
    solid: "bg-lotus-500",
    tint: "bg-lotus-500/10",
    ink: "text-lotus-ink",
    ring: "ring-lotus-500/25",
  },
  {
    solid: "bg-gold-500",
    tint: "bg-gold-500/10",
    ink: "text-gold-ink",
    ring: "ring-gold-500/25",
  },
];
