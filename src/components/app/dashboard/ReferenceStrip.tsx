import { Layers } from "lucide-react";

import { ReferenceLink } from "@/components/lesson/ReferenceLink";
import { Pali, Panel, PanelAction } from "@/components/ui";
import type { ReferenceCard } from "@/lib/course";
import { t } from "@/lib/strings";

/**
 * Background topics, on the dashboard.
 *
 * Framed as *background* rather than as more course: no progress ring, no
 * completion mark, and the line under the heading says outright that none of
 * it is required reading. A learner should be able to tell at a glance that
 * they have stepped off the path.
 *
 * A server component — nothing here depends on the learner.
 */
export function ReferenceStrip({ topics }: { topics: ReferenceCard[] }) {
  if (topics.length === 0) return null;

  return (
    <Panel
      title={t.dashboard.reference}
      action={<PanelAction href="/reference">{t.dashboard.viewAll}</PanelAction>}
    >
      <p className="si-heading -mt-1 mb-4 text-xs text-ink-faint">
        {t.dashboard.referenceNote}
      </p>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <li key={topic.slug}>
            <ReferenceLink
              slug={topic.slug}
              className="group flex h-full flex-col rounded-xl bg-surface-2 p-4 ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface hover:shadow-card hover:ring-jade-500/40"
            >
              <span className="si-heading inline-flex items-center gap-1.5 text-[0.62rem] font-medium text-jade-ink">
                <Layers size={11} aria-hidden />
                {topic.category}
              </span>

              <span className="si-heading mt-2 block font-display text-[0.95rem] font-semibold text-ink transition-colors group-hover:text-jade-ink">
                {topic.title}
              </span>
              {topic.pali ? (
                <Pali className="mt-0.5 block text-[0.68rem] not-italic text-ink-mute">
                  {topic.pali}
                </Pali>
              ) : null}

              <span className="si-heading mt-2 line-clamp-2 text-xs leading-relaxed text-ink-faint">
                {topic.summary}
              </span>
            </ReferenceLink>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
