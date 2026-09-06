"use client";

import Link from "next/link";
import { Lightbulb } from "lucide-react";

import { Pali } from "@/components/ui";
import type { DailyConcept } from "@/lib/course";
import { useHydrated } from "@/lib/progress";
import { t } from "@/lib/strings";

/**
 * ONE TERM A DAY
 * ==============
 * Every word on this card comes from the glossary — the Sinhala name, the
 * Pāli, the pronunciation, the one-line gloss and the literal sense are the
 * same entry a learner meets inline in a lesson. Nothing is written for it.
 *
 * Which term shows is picked from the reader's own date, so it turns over at
 * their midnight rather than at build time. Before hydration the first of the
 * pool renders: same shape, same height, no shift when the day's pick lands.
 */
export function ConceptOfDay({ pool }: { pool: DailyConcept[] }) {
  const hydrated = useHydrated();
  if (pool.length === 0) return null;

  const concept = hydrated ? pool[dayIndex() % pool.length] : pool[0];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line">
      <div className="flex items-start justify-between gap-3">
        <h2 className="si-heading inline-flex items-center gap-2 font-display text-base font-semibold text-ink">
          <Lightbulb size={16} aria-hidden className="text-gold-ink" />
          {t.dashboard.conceptOfDay}
        </h2>
        <Link
          href="/glossary"
          className="shrink-0 whitespace-nowrap pt-1 text-xs font-medium text-ink-dim transition-colors hover:text-cobalt-600"
        >
          {t.dashboard.allConcepts}
          <span aria-hidden> &rarr;</span>
        </Link>
      </div>

      <Link
        href={`/glossary#${concept.id}`}
        className="mt-4 block rounded-xl bg-surface-2 px-4 py-4 transition-colors hover:bg-surface-3"
      >
        <p className="si-heading font-display text-lg font-semibold text-ink">
          {concept.si}
        </p>
        <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2.5">
          <Pali className="text-sm text-cobalt-ink">{concept.pali}</Pali>
          {concept.say ? (
            <span className="si-heading text-[0.68rem] text-ink-mute">
              {concept.say}
            </span>
          ) : null}
        </p>

        <p className="si-heading mt-3 text-[0.85rem] leading-relaxed text-ink-dim">
          {concept.short}
        </p>

        {concept.literal ? (
          <p className="si-heading mt-2 border-t border-line-soft pt-2 text-[0.72rem] text-ink-faint">
            {t.block.literally}: {concept.literal}
          </p>
        ) : null}
      </Link>
    </section>
  );
}

/**
 * Days since the epoch, from the reader's local calendar date. A stable seed
 * that changes exactly once per day and needs no storage.
 */
function dayIndex(date = new Date()) {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
}
