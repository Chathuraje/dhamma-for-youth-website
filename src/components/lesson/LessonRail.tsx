"use client";

import { Check, ChevronDown, List as ListIcon, Play, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { useEffect, useId, useState } from "react";

import { useHydrated, useProgress } from "@/lib/progress";
import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";

export interface RailSection {
  id: string;
  title: string;
  brief?: string;
}

const ACCENT = {
  cobalt: {
    text: "text-cobalt-600",
    fill: "bg-cobalt-500",
    tint: "bg-cobalt-100",
    activeText: "text-cobalt-700",
  },
  jade: {
    text: "text-jade-600",
    fill: "bg-jade-500",
    tint: "bg-jade-500/10",
    activeText: "text-jade-600",
  },
} as const;

/**
 * THE LESSON OUTLINE
 * ==================
 * This lesson's sections, where the learner is in them, and which have been
 * read. It sits in the right rail on desktop and behind a button at the foot
 * of the screen on mobile — one body rendered twice, so the two never drift.
 *
 * It observes the section elements the server already rendered rather than
 * owning them, so all lesson content stays a server component and only this
 * thin controller ships to the browser.
 *
 * A section is marked complete when its bottom scrolls above the middle of the
 * viewport — i.e. when the learner has actually read past it. There is no
 * "mark as done" button, because nobody clicks them.
 *
 * The chapter's other lessons are deliberately not here. They live in the
 * chapter rail directly above this one on a lesson page; listing them twice in
 * one column made the two lists compete.
 *
 * The list starts folded. What a reader needs while reading is *where am I and
 * how much is left*, which the heading and the bar answer in one line; the
 * full table of contents is for deciding where to jump, which is a deliberate
 * act. Folded, the panel also stops competing with the lesson for the eye.
 * The mobile sheet is always open — opening it was the deliberate act.
 */
export function LessonRail({
  slug,
  sections,
  accent = "cobalt",
}: {
  slug: string;
  sections: RailSection[];
  accent?: keyof typeof ACCENT;
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const listId = useId();
  const reduce = useReducedMotion();
  const a = ACCENT[accent];

  const hydrated = useHydrated();
  const completed = useProgress((s) => s.completed);
  const markSection = useProgress((s) => s.markSection);
  const setBookmark = useProgress((s) => s.setBookmark);

  const done = new Set(hydrated ? (completed[slug] ?? []) : []);
  const ratio = sections.length ? done.size / sections.length : 0;

  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  /* -- scroll spy + auto-complete ----------------------------------------- */
  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(`section-${s.id}`))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    function onScroll() {
      const mid = window.innerHeight / 2;
      let current = sections[0]?.id ?? "";

      for (const el of elements) {
        const { top, bottom } = el.getBoundingClientRect();
        const id = el.id.replace("section-", "");
        if (top <= mid) current = id;
        // Read past it? Count it.
        if (bottom < mid) markSection(slug, id);
      }

      setActive(current);
      setBookmark(slug, current);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections, slug, markSection, setBookmark]);

  /* -- the last section only completes at the very bottom of the page ----- */
  useEffect(() => {
    function onScroll() {
      const atEnd =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 120;
      const last = sections.at(-1);
      if (atEnd && last) markSection(slug, last.id);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections, slug, markSection]);

  function goTo(id: string) {
    document
      .getElementById(`section-${id}`)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    setMenuOpen(false);
  }

  const heading = (
    <>
      <h2 className="si-heading block font-display text-base font-semibold text-ink">
        {t.lesson.outline}
      </h2>
      <span
        className={cn("shrink-0 font-mono text-xs tabular-nums", a.text)}
      >
        {done.size}/{sections.length}
      </span>
    </>
  );

  const meter = (
    <div aria-hidden className="mt-3 h-1 rounded-full bg-surface-2">
      <motion.span
        className={cn("block h-1 rounded-full", a.fill)}
        initial={false}
        animate={{ width: `${ratio * 100}%` }}
        transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );

  const list = (
    <ol className="mt-4 space-y-0.5">
      {sections.map((s, i) => {
        const isActive = s.id === active;
        const isDone = done.has(s.id);
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => goTo(s.id)}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors",
                isActive ? a.tint : "hover:bg-surface-2",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[0.7rem] font-semibold tabular-nums transition-colors",
                  isDone || isActive
                    ? cn(a.fill, "text-on-brand")
                    : "bg-surface-2 text-ink-faint ring-1 ring-line",
                )}
              >
                {isDone ? <Check size={12} strokeWidth={3} /> : i + 1}
              </span>

              <span
                className={cn(
                  "si-heading min-w-0 flex-1 text-[0.83rem] leading-relaxed transition-colors",
                  isActive
                    ? cn("font-medium", a.activeText)
                    : "text-ink-dim group-hover:text-ink",
                )}
              >
                {s.title}
              </span>

              <span aria-hidden className="shrink-0">
                {isActive && !isDone ? (
                  <Play
                    size={14}
                    fill="currentColor"
                    className={a.text}
                  />
                ) : isDone ? (
                  <Check size={14} className={a.text} />
                ) : (
                  <span className="block h-3.5 w-3.5 rounded-full ring-1 ring-line" />
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      {/* scroll-linked progress bar */}
      <motion.div
        aria-hidden
        style={{ scaleX: bar }}
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-cobalt-500 via-cobalt-400 to-gold-500"
      />

      {/* desktop panel — folded until asked for */}
      <nav
        aria-label={t.lesson.outline}
        className="hidden rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line xl:block"
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={listId}
          className="flex w-full items-center gap-3 text-left"
        >
          {heading}
          <ChevronDown
            size={15}
            aria-hidden
            className={cn(
              "shrink-0 text-ink-faint transition-transform duration-300",
              open && "rotate-180",
            )}
          />
        </button>

        {meter}

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={listId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: reduce ? 0 : 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="overflow-hidden"
            >
              {list}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* mobile trigger */}
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label={t.lesson.outline}
        aria-expanded={menuOpen}
        className="fixed bottom-5 right-5 z-40 flex h-11 items-center gap-2 rounded-full bg-surface px-4 text-sm text-ink shadow-lift ring-1 ring-line xl:hidden"
      >
        <ListIcon size={15} aria-hidden />
        <span className={cn("font-mono text-xs tabular-nums", a.text)}>
          {done.size}/{sections.length}
        </span>
      </button>

      {/* mobile sheet */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            aria-label={t.nav.menuClose}
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ink/35 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: reduce ? 0 : "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: reduce ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 bottom-0 max-h-[78vh] overflow-y-auto rounded-t-3xl border-t border-line bg-surface px-5 pb-8 pt-4"
          >
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={t.nav.menuClose}
                className="text-ink-faint hover:text-ink"
              >
                <X size={17} />
              </button>
            </div>
            <div className="flex items-center gap-3">{heading}</div>
            {meter}
            {list}
          </motion.div>
        </div>
      )}
    </>
  );
}
