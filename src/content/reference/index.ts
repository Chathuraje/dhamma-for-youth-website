import type { ReferenceTopic } from "@/lib/types";

import { topic as kamavacharaLoka } from "./kamavachara-loka";
import { topic as sadivyaLoka } from "./sadivya-loka";
import { topic as lokaDhatu } from "./loka-dhatu";
import {
  asuraLoka,
  manushyaLoka,
  thirisanLoka,
  prethaLoka,
  niraya,
} from "./apaya";

/**
 * REFERENCE REGISTRY
 * ==================
 * Background material lessons point at but do not carry.
 *
 * The rule that keeps this useful: **if it is Abhidhamma, it belongs in a
 * lesson; if a lesson merely needs to name it, it belongs here.** Cosmology is
 * the clear case — a lesson can say the Abhidhamma was taught in Tāvatiṃsa
 * without becoming a catalogue of deva realms.
 *
 * Reference topics carry no progress, no prerequisites and no lesson number.
 * They can grow indefinitely without diluting the course.
 *
 * To add one:
 *   1. Create `src/content/reference/<slug>.ts` exporting a `ReferenceTopic`.
 *   2. Import it here and add it to `references`.
 *   3. Link it from content with `[[ref:<slug>]]`.
 */
export const references: ReferenceTopic[] = [
  kamavacharaLoka,
  sadivyaLoka,
  asuraLoka,
  manushyaLoka,
  thirisanLoka,
  prethaLoka,
  niraya,
  lokaDhatu,
];

/* -------------------------------------------------------------------------- */

export function allReferences(): ReferenceTopic[] {
  return [...references].sort((a, b) => a.title.localeCompare(b.title, "si"));
}

export function visibleReferences(): ReferenceTopic[] {
  const isDev = process.env.NODE_ENV === "development";
  return allReferences().filter((r) => isDev || r.status === "published");
}

export function getReference(slug: string): ReferenceTopic | undefined {
  return references.find((r) => r.slug === slug);
}

/** Topics grouped by category, for the index page. */
export function referencesByCategory(): Array<{
  category: string;
  topics: ReferenceTopic[];
}> {
  const groups = new Map<string, ReferenceTopic[]>();
  for (const topic of visibleReferences()) {
    const list = groups.get(topic.category) ?? [];
    list.push(topic);
    groups.set(topic.category, list);
  }
  return [...groups.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "si"))
    .map(([category, topics]) => ({ category, topics }));
}
