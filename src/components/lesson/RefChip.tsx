"use client";

import { AnimatePresence } from "motion/react";
import { useId, useRef, useState } from "react";
import { BookMarked } from "lucide-react";

import { AnchoredCard } from "@/components/lesson/AnchoredCard";
import { ReferenceLink } from "@/components/lesson/ReferenceLink";
import { getReference } from "@/content/reference";
import { t } from "@/lib/strings";

/**
 * An inline link to a background reference topic.
 *
 * Rendered from `[[ref:slug]]`. Visually distinct from a Pāli glossary chip —
 * that one defines a term the lesson is teaching, this one points away from
 * the lesson to material the lesson deliberately does not carry.
 *
 * Clicking opens the topic in an overlay rather than navigating. A reference is
 * a footnote, and a footnote should not cost a reader their place: the lesson
 * stays underneath, and closing puts them back in the sentence they left. The
 * topic still has a real page — the overlay's foot links to it, and search and
 * the reference index go there directly. Ordinary links are untouched: a post,
 * a resource or anything external is a destination, and destinations navigate.
 *
 * Hover previews the summary, so a reader can decide whether the detour is
 * worth even an overlay. Unlike the term card this one stays a *preview* — a
 * reference topic is a page of sections, not four lines.
 *
 * If the slug is unknown the chip degrades to plain text and warns in
 * development, so a typo can never break a lesson in production.
 */
export function RefChip({ slug }: { slug: string }) {
  const topic = getReference(slug);
  const [hovered, setHovered] = useState(false);
  const cardId = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);

  if (!topic) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[reference] unknown topic "${slug}" referenced in content`);
    }
    return <span>{slug}</span>;
  }

  return (
    <span ref={anchorRef} className="inline-block">
      <ReferenceLink
        slug={topic.slug}
        aria-describedby={hovered ? cardId : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="si-heading inline-flex items-baseline gap-1 rounded border-b border-dashed border-jade-500/50 text-jade-ink transition-colors hover:border-jade-400 hover:text-jade-ink"
      >
        {topic.title}
      </ReferenceLink>

      <AnimatePresence>
        {hovered && (
          /* Portalled, so a chip inside a scrolling table is not clipped. */
          <AnchoredCard
            id={cardId}
            role="tooltip"
            anchor={anchorRef}
            className="pointer-events-none w-[min(20rem,calc(100vw-1rem))]"
          >
            <span className="si-heading flex items-center gap-1.5 text-[0.7rem] font-semibold text-jade-ink">
              <BookMarked size={11} aria-hidden />
              {t.reference.label}
            </span>
            <span className="si-heading mt-1.5 block font-semibold text-ink">
              {topic.title}
            </span>
            <span className="si-heading mt-1 block text-sm leading-relaxed text-ink-dim">
              {topic.summary}
            </span>
            <span className="si-heading mt-2 block text-[0.7rem] text-ink-faint">
              {t.reference.openHere}
            </span>
          </AnchoredCard>
        )}
      </AnimatePresence>
    </span>
  );
}
