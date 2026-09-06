import { visibleChapters } from "@/content/chapters";
import { glossary } from "@/content/glossary";
import { visibleLessons } from "@/content/lessons";
import { visibleReferences } from "@/content/reference";

/**
 * SEARCH INDEX
 * ============
 * Built on the server and handed to the topbar as plain data, so the search
 * dialog never pulls the content registry into the client bundle. It is small
 * — a few hundred rows of title and slug — and everything in it is already
 * public, so there is nothing to fetch and nothing to leak.
 *
 * Matching is a substring test over `haystack`, which carries the Sinhala
 * title, the Pāli in Latin script and the glossary id. That is what lets
 * someone type "citta", "චිත්ත" or "සිත" and land on the same row.
 */

export type SearchKind = "chapter" | "lesson" | "term" | "reference";

export interface SearchRow {
  kind: SearchKind;
  href: string;
  title: string;
  /** The line under the title: a chapter name, a one-line definition. */
  detail?: string;
  /** Lowercased, everything worth matching against, joined by spaces. */
  haystack: string;
}

export function searchIndex(): SearchRow[] {
  const rows: SearchRow[] = [];

  for (const chapter of visibleChapters()) {
    rows.push({
      kind: "chapter",
      href: `/chapters/${chapter.slug}`,
      title: chapter.title,
      detail: chapter.summary,
      haystack: lower(chapter.title, chapter.pali, chapter.slug, chapter.summary),
    });
  }

  for (const lesson of visibleLessons()) {
    rows.push({
      kind: "lesson",
      href: `/lessons/${lesson.slug}`,
      title: lesson.title,
      detail: lesson.subtitle,
      haystack: lower(
        lesson.title,
        lesson.subtitle,
        lesson.pali,
        lesson.slug,
        ...lesson.tags,
      ),
    });
  }

  for (const term of glossary) {
    rows.push({
      kind: "term",
      href: `/glossary#${term.id}`,
      title: term.si,
      detail: term.short,
      haystack: lower(term.si, term.pali, term.id, term.short),
    });
  }

  for (const topic of visibleReferences()) {
    rows.push({
      kind: "reference",
      href: `/reference/${topic.slug}`,
      title: topic.title,
      detail: topic.summary,
      haystack: lower(topic.title, topic.pali, topic.slug, topic.summary),
    });
  }

  return rows;
}

function lower(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

/**
 * Rank matters more than recall here: the list is short and the learner is
 * looking at it, so a title hit must beat a body hit or the right row hides
 * under four glossary definitions that happen to mention the word.
 */
export function runSearch(rows: SearchRow[], query: string, limit = 8) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const scored: Array<{ row: SearchRow; score: number }> = [];
  for (const row of rows) {
    const title = row.title.toLowerCase();
    let score = 0;
    if (title.startsWith(q)) score = 3;
    else if (title.includes(q)) score = 2;
    else if (row.haystack.includes(q)) score = 1;
    if (score) scored.push({ row, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.row.title.localeCompare(b.row.title, "si"))
    .slice(0, limit)
    .map((s) => s.row);
}
