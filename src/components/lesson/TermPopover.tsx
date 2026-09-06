"use client";

import { AnimatePresence } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { AnchoredCard } from "@/components/lesson/AnchoredCard";
import { getTerm } from "@/content/glossary";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { GlossaryTerm } from "@/lib/types";

/**
 * A glossary term and everything the glossary knows about it, on hover or tap.
 *
 * THE CARD IS THE ENTRY
 * ---------------------
 * It used to show a one-line gloss and a "full entry" link into `/glossary`.
 * That was the wrong trade: it asked a reader to leave the sentence they were
 * in to find three more lines of text. The card now carries the whole entry —
 * pronunciation, literal sense, gloss, the fuller explanation and the related
 * terms — so there is nothing left to go and see. `/glossary` is still there
 * for browsing, which is a different job.
 *
 * The card has no links or chips inside it, deliberately: a chip inside a chip
 * is a trap the pointer cannot get out of. `[[pali:…]]` inside a term's own
 * explanation renders as that term's Sinhala name instead.
 *
 * Placement — and the reason the card is not clipped by a scrolling table —
 * lives in `AnchoredCard`.
 */
export function TermPopover({
  id,
  children,
  className,
}: {
  id: string;
  /** Defaults to the term's Sinhala form. */
  children?: ReactNode;
  className?: string;
}) {
  const term = getTerm(id);
  const [open, setOpen] = useState(false);
  const cardId = useId();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  /**
   * A beat of grace before closing, so the pointer can cross the gap to the
   * card. The card is in a portal, so it is not a descendant of the trigger and
   * cannot rely on `mouseleave` ignoring children.
   */
  const closeSoon = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  /** Tapping elsewhere dismisses it — the touch equivalent of mouseleave. */
  useEffect(() => {
    if (!open) return;

    const onDown = (e: PointerEvent) => {
      const node = e.target as Element | null;
      if (anchorRef.current?.contains(node as Node)) return;
      if (node?.closest?.(`[data-card="${cardId}"]`)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, cardId]);

  if (!term) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[glossary] unknown term id "${id}" referenced in a lesson`);
    }
    return <span>{children ?? id}</span>;
  }

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-expanded={open}
        aria-describedby={open ? cardId : undefined}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => {
          cancelClose();
          setOpen(true);
        }}
        onMouseLeave={closeSoon}
        onFocus={() => {
          cancelClose();
          setOpen(true);
        }}
        onBlur={() => setOpen(false)}
        className={className}
      >
        {children ?? term.si}
      </button>

      <AnimatePresence>
        {open && (
          <AnchoredCard
            id={cardId}
            data-card={cardId}
            role="tooltip"
            anchor={anchorRef}
            className="w-[min(23rem,calc(100vw-1rem))]"
            onPointerEnter={cancelClose}
            onPointerLeave={closeSoon}
          >
            <TermEntry term={term} />
          </AnchoredCard>
        )}
      </AnimatePresence>
    </>
  );
}

/** The whole glossary entry, minus the parts that would be links. */
function TermEntry({ term }: { term: GlossaryTerm }) {
  const related = (term.see ?? [])
    .map((id) => getTerm(id))
    .filter((s): s is GlossaryTerm => Boolean(s));

  return (
    <>
      <p className="si-heading text-lg font-semibold leading-snug text-ink">
        {term.si}
      </p>

      <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span lang="pi" className="font-pali italic text-cobalt-ink">
          {term.pali}
        </span>
        {term.say && (
          <span className="font-mono text-[0.7rem] tracking-wide text-ink-faint">
            {term.say}
          </span>
        )}
      </p>

      {term.literal && (
        <p className="si-heading mt-1 text-xs italic text-ink-faint">
          {t.block.literally}: {term.literal}
        </p>
      )}

      <p className="si-heading mt-2.5 text-sm font-medium leading-relaxed text-ink">
        {term.short}
      </p>

      {term.long && (
        <p className="si-heading mt-2 text-sm leading-relaxed text-ink-dim">
          {/* Chips off: a chip inside a chip's own card cannot be escaped. */}
          {rich(term.long, { chips: false })}
        </p>
      )}

      {related.length > 0 && (
        <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1.5 border-t border-line-soft pt-2.5">
          <span className="si-heading text-[0.68rem] text-ink-faint">
            {t.glossary.seeAlso}
          </span>
          {related.map((r) => (
            <span
              key={r.id}
              className="si-heading rounded-full bg-surface-2 px-2 py-0.5 text-[0.7rem] text-ink-dim"
            >
              {r.si}
            </span>
          ))}
        </p>
      )}
    </>
  );
}
