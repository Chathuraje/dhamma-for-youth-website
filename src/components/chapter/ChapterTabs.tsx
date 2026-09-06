"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";

export interface TabDef {
  id: string;
  label: string;
  icon?: React.ReactNode;
  /** Rendered on the server and passed in — the panels are not client code. */
  content: React.ReactNode;
  /** Shown as a count next to the label. Omit for none. */
  count?: number;
}

/**
 * The chapter's views.
 *
 * Every panel is rendered on the server and handed in as `content`, so
 * switching tabs costs nothing and no lesson content crosses into the client
 * bundle. Only the selection lives here.
 *
 * Real tab semantics: arrow keys move between tabs, each panel is labelled by
 * its tab, and the inactive panels are removed rather than hidden so a screen
 * reader is not walking four chapters' worth of content it cannot see.
 */
export function ChapterTabs({ tabs }: { tabs: TabDef[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const reduce = useReducedMotion();
  const uid = useId();

  if (tabs.length === 0) return null;
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  const move = (delta: number) => {
    const i = tabs.findIndex((t) => t.id === current.id);
    const next = tabs[(i + delta + tabs.length) % tabs.length];
    setActive(next.id);
    document.getElementById(`${uid}-tab-${next.id}`)?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={t.chapter.views}
        className="flex gap-1 overflow-x-auto border-b border-line px-1"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            move(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            move(-1);
          }
        }}
      >
        {tabs.map((tab) => {
          const selected = tab.id === current.id;
          return (
            <button
              key={tab.id}
              id={`${uid}-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${uid}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={cn(
                "relative shrink-0 px-4 py-3.5 transition-colors",
                selected ? "text-ink" : "text-ink-faint hover:text-ink-dim",
              )}
            >
              <span className="flex items-center gap-2">
                {tab.icon ? (
                  <span
                    aria-hidden
                    className={selected ? "text-cobalt-600" : "text-current"}
                  >
                    {tab.icon}
                  </span>
                ) : null}
                <span className="si-heading block text-left text-sm font-medium leading-none">
                  {tab.label}
                </span>
                {typeof tab.count === "number" && tab.count > 0 ? (
                  <span className="rounded-full bg-surface-2 px-1.5 py-0.5 font-mono text-[0.6rem] text-ink-faint">
                    {tab.count}
                  </span>
                ) : null}
              </span>

              {selected && (
                <motion.span
                  layoutId="chapter-tab"
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-cobalt-500"
                  transition={{
                    duration: reduce ? 0 : 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${uid}-panel-${current.id}`}
        aria-labelledby={`${uid}-tab-${current.id}`}
        tabIndex={0}
        className="pt-7 focus-visible:outline-none"
      >
        {current.content}
      </div>
    </div>
  );
}
