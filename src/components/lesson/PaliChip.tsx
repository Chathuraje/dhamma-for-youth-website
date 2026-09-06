"use client";

import { TermPopover } from "@/components/lesson/TermPopover";

/**
 * An inline glossary term. Hover (or tap) reveals the entry.
 *
 * The chip reads in **Sinhala**, not Pāli. The site is authored in Sinhala, so
 * a sentence should not break into Latin script to name its own subject — the
 * learner meets "සිත" in the prose and finds `citta` on the card, where the
 * Pāli belongs. The Pāli is still the lookup key (`[[pali:citta]]`) and still
 * leads the glossary entry.
 *
 * The card is `TermPopover`, which carries the whole entry and no longer sends
 * anyone to `/glossary` to finish reading. This file is only the inline
 * styling — the dotted cobalt underline that marks a word as a defined term.
 */
export function PaliChip({ id }: { id: string }) {
  return (
    <TermPopover
      id={id}
      className="si-heading text-cobalt-ink underline decoration-cobalt-500/40 decoration-dotted underline-offset-4 transition-colors hover:text-cobalt-600 hover:decoration-cobalt-500"
    />
  );
}
