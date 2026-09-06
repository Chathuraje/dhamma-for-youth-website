import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { PaliChip } from "@/components/lesson/PaliChip";
import { RefChip } from "@/components/lesson/RefChip";
import { getTerm } from "@/content/glossary";
import { getReference } from "@/content/reference";
import type { RichText } from "@/lib/types";

/**
 * Inline markup parser for lesson copy.
 *
 * Deliberately tiny and deliberately NOT markdown: authors get exactly six
 * constructs, which keeps lessons visually consistent and makes it impossible
 * to inject raw HTML into a lesson.
 *
 *   **bold**  *italic*  `code`  [label](href)  [[pali:id]]  [[ref:slug]]
 *
 * Order matters: both `[[…]]` forms must be tried before the plain
 * `[label](href)` link, or the link pattern swallows their opening bracket.
 *
 * `**bold**` and `*italic*` re-parse their contents, so `**[[pali:citta]]**`
 * is an emphasised chip rather than the literal text `[[pali:citta]]`. The
 * recursion terminates after one level: both patterns forbid `*` inside, so
 * the inner text can never match an emphasis token again.
 *
 * `chips: false` renders both `[[…]]` forms as their own names in plain text.
 * That is for copy shown *inside* a chip's card, where a chip within a chip is
 * a trap the pointer cannot get out of.
 */

export interface RichOptions {
  chips?: boolean;
}

const TOKEN =
  /(\*\*[^*]+\*\*)|(\[\[pali:[a-z0-9-]+\]\])|(\[\[ref:[a-z0-9-]+\]\])|(\[[^\]]+\]\([^)]+\))|(`[^`]+`)|(\*[^*]+\*)/g;

export function rich(text: RichText, opts: RichOptions = {}): ReactNode {
  if (!text) return null;
  const chips = opts.chips ?? true;

  const nodes: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;

    if (index > cursor) nodes.push(text.slice(cursor, index));
    cursor = index + match[0].length;

    const [raw] = match;

    if (raw.startsWith("**")) {
      nodes.push(<strong key={key++}>{rich(raw.slice(2, -2), opts)}</strong>);
    } else if (raw.startsWith("[[pali:")) {
      const id = raw.slice(7, -2);
      nodes.push(
        chips ? (
          <PaliChip key={key++} id={id} />
        ) : (
          <span key={key++} className="font-medium text-ink">
            {getTerm(id)?.si ?? id}
          </span>
        ),
      );
    } else if (raw.startsWith("[[ref:")) {
      const slug = raw.slice(6, -2);
      nodes.push(
        chips ? (
          <RefChip key={key++} slug={slug} />
        ) : (
          <span key={key++} className="font-medium text-ink">
            {getReference(slug)?.title ?? slug}
          </span>
        ),
      );
    } else if (raw.startsWith("[")) {
      const label = raw.slice(1, raw.indexOf("]"));
      const href = raw.slice(raw.indexOf("](") + 2, -1);
      const external = /^https?:/.test(href);
      nodes.push(
        external ? (
          <a key={key++} href={href} target="_blank" rel="noreferrer noopener">
            {label}
          </a>
        ) : (
          <Link key={key++} href={href}>
            {label}
          </Link>
        ),
      );
    } else if (raw.startsWith("`")) {
      nodes.push(
        <code
          key={key++}
          className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em] text-jade-300"
        >
          {raw.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(<em key={key++}>{rich(raw.slice(1, -1), opts)}</em>);
    }
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));

  return (
    <>
      {nodes.map((n, i) => (
        <Fragment key={i}>{n}</Fragment>
      ))}
    </>
  );
}

/** Strip all markup - for meta descriptions, aria-labels and search indexes. */
export function plain(text: RichText): string {
  return text
    .replace(/\[\[pali:([a-z0-9-]+)\]\]/g, "$1")
    .replace(/\[\[ref:([a-z0-9-]+)\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}
