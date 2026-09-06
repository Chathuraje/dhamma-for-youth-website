"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Layers,
  type LucideIcon,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { type SearchKind, type SearchRow, runSearch } from "@/lib/search";
import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";

const kindIcon: Record<SearchKind, LucideIcon> = {
  chapter: BookOpen,
  lesson: BookOpen,
  term: Sparkles,
  reference: Layers,
};

const kindLabel: Record<SearchKind, string> = {
  chapter: t.nav.chapters,
  lesson: t.nav.lessons,
  term: t.nav.glossary,
  reference: t.nav.reference,
};

/**
 * Site search.
 *
 * The index arrives as props from the server layout, so the whole content
 * registry stays out of the client bundle and matching costs one pass over a
 * few hundred short strings — no debounce, no request, no spinner.
 *
 * Keyboard is the point: ⌘K / Ctrl+K opens it, arrows move, Enter goes,
 * Escape closes. Everything reachable by mouse is reachable by Tab.
 */
export function SearchDialog({
  index,
  open,
  onClose,
}: {
  index: SearchRow[];
  open: boolean;
  onClose: () => void;
}) {
  /**
   * Mounted only while open, so each opening starts with an empty field and a
   * cursor at the top — state reset by unmounting rather than by an effect
   * that fires setState on every change of `open`.
   */
  if (!open) return null;
  return <SearchPanel index={index} onClose={onClose} />;
}

function SearchPanel({
  index,
  onClose,
}: {
  index: SearchRow[];
  onClose: () => void;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => runSearch(index, query), [index, query]);

  /** Focus and scroll-lock are DOM effects, not state synchronisation. */
  useEffect(() => {
    inputRef.current?.focus();

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const go = (row: SearchRow) => {
    onClose();
    router.push(row.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return onClose();
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (c + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (c - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[cursor]);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-70 flex items-start justify-center px-4 pt-[12vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.16 }}
      >
        <button
          type="button"
          aria-label={t.app.close}
          onClick={onClose}
          className="absolute inset-0 bg-ink/25 backdrop-blur-sm"
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t.app.searchLabel}
          onKeyDown={onKeyDown}
          initial={{ opacity: 0, y: reduce ? 0 : -8, scale: reduce ? 1 : 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reduce ? 0 : -8 }}
          transition={{ duration: reduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-surface shadow-lift ring-1 ring-line"
        >
          <div className="flex items-center gap-3 border-b border-line px-4 transition-colors focus-within:border-cobalt-500">
            <Search size={17} className="shrink-0 text-ink-faint" aria-hidden />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCursor(0);
              }}
              placeholder={t.app.search}
              aria-label={t.app.searchLabel}
              data-no-ring
              className="si-heading h-14 w-full bg-transparent text-[0.95rem] text-ink outline-none placeholder:text-ink-mute"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label={t.app.close}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-faint hover:bg-surface-2 hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-[52vh] overflow-y-auto p-2">
            {query.trim().length < 2 ? (
              <p className="si-heading px-3 py-8 text-center text-sm text-ink-faint">
                {t.app.searchHint}
              </p>
            ) : results.length === 0 ? (
              <p className="si-heading px-3 py-8 text-center text-sm text-ink-faint">
                {t.app.searchEmpty}
              </p>
            ) : (
              <ul>
                {results.map((row, i) => {
                  const Icon = kindIcon[row.kind];
                  return (
                    <li key={`${row.kind}-${row.href}`}>
                      <button
                        type="button"
                        onClick={() => go(row)}
                        onMouseEnter={() => setCursor(i)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                          i === cursor ? "bg-cobalt-100" : "hover:bg-surface-2",
                        )}
                      >
                        <Icon
                          size={16}
                          aria-hidden
                          className="mt-0.5 shrink-0 text-cobalt-600"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="si-heading block truncate text-sm font-medium text-ink">
                            {row.title}
                          </span>
                          {row.detail ? (
                            <span className="si-heading mt-0.5 block truncate text-xs text-ink-faint">
                              {row.detail}
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-0.5 shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-ink-faint">
                          {kindLabel[row.kind]}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Owns the shortcut and the open state so both the desktop search field and
 * the mobile icon button can trigger the same dialog.
 */
export function useSearchDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return { open, setOpen };
}
