import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { t } from "@/lib/strings";
import type { Source } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Where the teaching on this page comes from.
 *
 * The content model has carried `sources` from the start and the validator
 * fails a published lesson without them — but the lesson player had only a
 * `{/* Sources *\/}` comment where they should have rendered, so a learner
 * could not see a single citation. This is that gap closed.
 *
 * Set in the same hairline-and-text register as the rest of the page: a
 * citation is a reference, not a call to action.
 */
export function Sources({
  sources,
  accent = "cobalt",
}: {
  sources?: Source[];
  accent?: "cobalt" | "jade";
}) {
  if (!sources?.length) return null;

  return (
    <Reveal>
      <section
        aria-labelledby="sources-heading"
        className="mt-6 border-t border-line-soft pt-6"
      >
        <h2
          id="sources-heading"
          className="si-heading text-xs font-semibold text-ink-faint"
        >
          {t.course.sources}
        </h2>

        <ol className="mt-4 space-y-2.5">
          {sources.map((source, i) => (
            <li key={i} className="flex gap-3">
              <span
                aria-hidden
                className={cn(
                  "mt-[0.6rem] h-1 w-1 shrink-0 rounded-full",
                  accent === "jade" ? "bg-jade-500" : "bg-cobalt-500",
                )}
              />
              <p className="si-heading text-sm text-ink-dim">
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-ink-dim underline decoration-line underline-offset-4 transition-colors hover:text-ink"
                  >
                    {source.label}
                    <ArrowUpRight size={12} className="shrink-0" />
                  </a>
                ) : (
                  source.label
                )}
                {source.ref && (
                  <span className="ml-2 text-ink-faint">{source.ref}</span>
                )}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </Reveal>
  );
}
