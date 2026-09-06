"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { GlossaryTerm } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Searchable glossary.
 *
 * Search matches the Pāli (with or without diacritics), the id and the gloss,
 * so a learner who half-remembers a word and cannot type ṅ still finds it.
 */
function normalise(s: string) {
  // NFD decomposes every Pāli letter into base + combining mark
  // (ṃ -> m + U+0323, ā -> a + U+0304), so stripping the combining range
  // U+0300-U+036F leaves plain ASCII to match against.
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function GlossaryBrowser({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");
  const reduce = useReducedMotion();

  const results = useMemo(() => {
    const q = normalise(query.trim());
    if (!q) return terms;
    return terms.filter((t) =>
      [t.si, t.pali, t.id, t.short, t.literal ?? ""].some((field) =>
        normalise(field).includes(q),
      ),
    );
  }, [terms, query]);

  return (
    <>
      <div className="sticky top-16 z-30 -mx-5 mb-8 bg-canvas/85 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="යෙදුම් සොයන්න ('citta' හෝ 'පඨවි')"
            aria-label={t.glossary.search}
            className="w-full rounded-full bg-surface py-3 pl-11 pr-11 text-[0.97rem] text-ink placeholder:text-ink-faint/80 ring-1 ring-line transition focus:ring-cobalt-500/50 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t.glossary.clear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <p className="mt-2 px-1 text-xs text-ink-faint">
          {results.length} {t.glossary.of} {terms.length} {t.glossary.terms}
        </p>
      </div>

      {results.length === 0 ? (
        <p className="py-16 text-center text-ink-faint">
          {t.glossary.noResults}: &ldquo;{query}&rdquo;
        </p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
            {results.map((term) => (
              <motion.li
                key={term.id}
                layout={!reduce}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: reduce ? 0 : 0.22 }}
              >
                <TermEntry term={term} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </>
  );
}

function TermEntry({ term }: { term: GlossaryTerm }) {
  return (
    <article
      id={term.id}
      className="scroll-mt-32 rounded-2xl bg-surface p-6 ring-1 ring-line transition-colors target:ring-cobalt-500/50"
    >
      <h2 className="si-tight font-display text-2xl font-semibold text-ink">
        {term.si}
      </h2>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span
          lang="pi"
          className="font-pali text-lg italic text-cobalt-ink"
        >
          {term.pali}
        </span>
        {term.say && (
          <span className="font-mono text-xs tracking-wider text-ink-faint">
            {term.say}
          </span>
        )}
        {term.literal && (
          <span className="text-sm italic text-ink-faint">
            {t.block.literally}: {term.literal}
          </span>
        )}
      </div>

      <p className="mt-3 text-[1.02rem] font-medium leading-relaxed text-ink">
        {term.short}
      </p>

      {term.long && (
        <p className="prose-dhamma mt-3 text-[0.97rem]">{rich(term.long)}</p>
      )}

      {(term.see?.length || term.introducedIn) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line-soft pt-4">
          {term.see?.length ? (
            <>
              <span className="si-heading text-xs text-ink-faint">
                {t.glossary.seeAlso}
              </span>
              {term.see.map((id) => (
                <Link
                  key={id}
                  href={`#${id}`}
                  className={cn(
                    "rounded-full bg-surface-2 px-2.5 py-1 font-pali text-xs italic text-jade-ink",
                    "transition-colors hover:bg-surface-3 hover:text-jade-ink",
                  )}
                >
                  {id}
                </Link>
              ))}
            </>
          ) : null}

          {term.introducedIn && (
            <Link
              href={`/lessons/${term.introducedIn}`}
              className="ml-auto text-xs font-medium text-cobalt-ink hover:text-cobalt-ink"
            >
              {t.glossary.introducedIn} &rarr;
            </Link>
          )}
        </div>
      )}
    </article>
  );
}
