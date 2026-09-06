"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowUpRight, BookMarked, X } from "lucide-react";

import { BlockRenderer } from "@/components/lesson/BlockRenderer";
import { ReferenceLink } from "@/components/lesson/ReferenceLink";
import { SectionHeading } from "@/components/lesson/SectionHeading";
import { Sources } from "@/components/lesson/Sources";
import { Pali } from "@/components/ui";
import { getReference } from "@/content/reference";
import { useReferenceView } from "@/lib/reference-view";
import { t } from "@/lib/strings";

/**
 * A reference topic, read without leaving the page that named it.
 *
 * Everything the topic page renders renders here — the same sections, the same
 * blocks, the same citations — because background material earns the same
 * treatment as a lesson. What it drops is the page furniture: no breadcrumb, no
 * section rail, no route change. A reader closes it and is still in the
 * sentence they left.
 *
 * Progress keys match the page exactly (`__ref:<slug>`), so a quiz answered in
 * the overlay is answered on the page too.
 *
 * Loaded on demand — see `ReferenceViewer`. The whole block library sits behind
 * this import, and most readers never open a reference at all.
 */
export function ReferenceDialog() {
  const reduce = useReducedMotion();
  const stack = useReferenceView((s) => s.stack);
  const back = useReferenceView((s) => s.back);
  const close = useReferenceView((s) => s.close);

  const slug = stack[stack.length - 1];
  const topic = slug ? getReference(slug) : undefined;
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /** Escape unwinds one topic at a time, then closes. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      if (stack.length > 1) back();
      else close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stack.length, back, close]);

  /** Scroll lock, and focus moves in so Tab stays where the reader is looking. */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const restoreFocus = document.activeElement as HTMLElement | null;

    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previous;
      restoreFocus?.focus?.();
    };
  }, []);

  /** A pushed topic starts at its own beginning, not halfway down the last one. */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [slug]);

  if (!topic) return null;

  const related = (topic.see ?? [])
    .map((s) => getReference(s))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <div className="fixed inset-0 z-70 flex items-end justify-center sm:items-center sm:p-6">
      <motion.button
        type="button"
        aria-label={t.app.close}
        onClick={close}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.16 }}
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reference-dialog-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-canvas shadow-lift outline-none ring-1 ring-line sm:max-h-[86dvh] sm:max-w-3xl sm:rounded-2xl"
      >
        {/* -- header ----------------------------------------------------- */}
        <div className="flex shrink-0 items-start gap-3 border-b border-line bg-surface/60 px-5 py-4 sm:px-7">
          {stack.length > 1 && (
            <button
              type="button"
              onClick={back}
              aria-label={t.reference.back}
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <ArrowLeft size={16} />
            </button>
          )}

          <div className="min-w-0 flex-1">
            <span className="si-heading flex items-center gap-1.5 text-[0.68rem] font-semibold text-jade-ink">
              <BookMarked size={11} aria-hidden />
              {topic.category}
            </span>
            <h2
              id="reference-dialog-title"
              className="si-heading mt-1 font-display text-xl font-semibold leading-snug text-ink sm:text-2xl"
            >
              {topic.title}
            </h2>
            {topic.pali && (
              <Pali className="mt-0.5 block text-sm text-jade-ink/85">
                {topic.pali}
              </Pali>
            )}
          </div>

          <button
            type="button"
            onClick={close}
            aria-label={t.app.close}
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        {/* -- the topic -------------------------------------------------- */}
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7"
        >
          <p className="prose-dhamma text-[1.02rem]">{topic.summary}</p>

          <p className="si-heading mt-4 inline-flex items-center gap-2 rounded-full bg-jade-500/10 px-3 py-1.5 text-xs text-jade-ink ring-1 ring-jade-500/25">
            {t.reference.notRequired}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={topic.slug}
              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reduce ? 0 : 0.24,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-8"
            >
              {topic.sections.map((section, si) => (
                <section
                  key={section.id}
                  className="pb-12"
                  aria-labelledby={`heading-${section.id}`}
                >
                  <SectionHeading
                    id={section.id}
                    index={si + 1}
                    title={section.title}
                    pali={section.pali}
                    brief={section.brief}
                    accent="jade"
                  />

                  {section.blocks.map((block, bi) => (
                    <BlockRenderer
                      key={bi}
                      block={block}
                      lessonSlug={`__ref:${topic.slug}`}
                      sectionId={section.id}
                      index={bi}
                    />
                  ))}
                </section>
              ))}

              {related.length > 0 && (
                <section className="rounded-2xl bg-surface p-5 ring-1 ring-jade-500/25">
                  <h3 className="si-heading text-xs font-semibold text-jade-ink">
                    {t.reference.related}
                  </h3>
                  <ul className="mt-3 space-y-1">
                    {related.map((r) => (
                      <li key={r.slug}>
                        {/* Pushes onto the stack — the header keeps the way back. */}
                        <ReferenceLink
                          slug={r.slug}
                          className="si-heading block rounded-lg px-2 py-1.5 text-sm text-ink-dim transition-colors hover:bg-surface-2 hover:text-jade-ink"
                        >
                          {r.title}
                          <span className="ml-2 text-xs text-ink-faint">
                            {r.summary}
                          </span>
                        </ReferenceLink>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <Sources sources={topic.sources} accent="jade" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* -- foot: the one door out ------------------------------------- */}
        <div className="flex shrink-0 items-center justify-end border-t border-line bg-surface/60 px-5 py-3 sm:px-7">
          <Link
            href={`/reference/${topic.slug}`}
            onClick={close}
            className="si-heading inline-flex items-center gap-1.5 text-xs font-medium text-ink-dim transition-colors hover:text-jade-ink"
          >
            {t.reference.fullPage}
            <ArrowUpRight size={13} aria-hidden />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
