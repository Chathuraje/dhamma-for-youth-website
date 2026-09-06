import { getTerm } from "@/content/glossary";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type {
  CalloutBlock,
  ComparisonBlock,
  DividerBlock,
  HeadingBlock,
  KeyIdeaBlock,
  ListBlock,
  PaliTermBlock,
  ProseBlock,
  QuoteBlock,
  SummaryBlock,
  TableBlock,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pali, toneStyles } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

/* -------------------------------------------------------------------------- */

export function Prose({ block }: { block: ProseBlock }) {
  return (
    <Reveal>
      <p
        className={cn(
          "prose-dhamma",
          block.variant === "lead" && "text-xl leading-[1.7] text-ink",
        )}
      >
        {rich(block.text)}
      </p>
    </Reveal>
  );
}

export function Heading({ block }: { block: HeadingBlock }) {
  return (
    <Reveal>
      <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {block.text}
        {block.pali && (
          <Pali className="ml-3 text-lg font-normal text-cobalt-ink/80">
            {block.pali}
          </Pali>
        )}
      </h3>
    </Reveal>
  );
}

export function KeyIdea({ block }: { block: KeyIdeaBlock }) {
  return (
    <Reveal from="left">
      <figure className="relative my-8 overflow-hidden rounded-2xl bg-gradient-to-br from-cobalt-500/12 via-surface to-lotus-500/8 p-px">
        <div className="rounded-2xl bg-surface/80 px-6 py-7 backdrop-blur-sm sm:px-8">
          <span className="text-[0.7rem] si-heading font-semibold text-cobalt-500">
            {block.label ?? t.block.keyIdea}
          </span>
          <p className="mt-3 font-display text-xl leading-snug text-ink sm:text-2xl">
            {rich(block.text)}
          </p>
        </div>
        {/* soft halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cobalt-500/18 blur-3xl animate-halo"
        />
      </figure>
    </Reveal>
  );
}

export function Callout({ block }: { block: CalloutBlock }) {
  const t = toneStyles[block.tone];
  return (
    <Reveal>
      <aside
        className={cn(
          "my-6 rounded-xl px-5 py-4 ring-1 backdrop-blur-sm",
          t.bg,
          t.ring,
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn("h-1.5 w-1.5 rounded-full", t.dot)} />
          <span
            className={cn(
              "text-[0.7rem] si-heading font-semibold",
              t.text,
            )}
          >
            {block.title ?? t.label}
          </span>
        </div>
        <p className="prose-dhamma mt-2 text-[0.97rem]">{rich(block.text)}</p>
      </aside>
    </Reveal>
  );
}

export function PaliTermCard({ block }: { block: PaliTermBlock }) {
  const term = getTerm(block.term);
  if (!term) return null;

  return (
    <Reveal>
      <div className="my-8 overflow-hidden rounded-2xl bg-surface ring-1 ring-cobalt-500/25">
        <div className="border-b border-line bg-gradient-to-r from-cobalt-500/10 to-transparent px-6 py-5">
          {/* Sinhala leads; the Pāli sits under it as the reference form. */}
          <h4 className="si-tight font-display text-3xl font-semibold text-ink">
            {term.si}
          </h4>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <Pali className="text-lg text-cobalt-ink">{term.pali}</Pali>
            {term.say && (
              <span className="font-mono text-xs tracking-wider text-ink-faint">
                {term.say}
              </span>
            )}
          </div>
          {term.literal && (
            <p className="mt-1 text-sm italic text-ink-faint">
              {t.block.literally}: {term.literal}
            </p>
          )}
        </div>

        <div className="px-6 py-5">
          <p className="text-base font-medium text-ink">{term.short}</p>
          {term.long && (
            <p className="prose-dhamma mt-3 text-[0.97rem]">
              {rich(term.long)}
            </p>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export function Quote({ block }: { block: QuoteBlock }) {
  return (
    <Reveal>
      <blockquote className="my-8 border-l-2 border-cobalt-500/50 py-1 pl-6">
        {block.pali && (
          <p
            lang="pi"
            className="font-pali text-lg italic leading-relaxed text-cobalt-ink/90"
          >
            {block.pali}
          </p>
        )}
        <p
          className={cn(
            "font-display text-lg leading-relaxed text-ink",
            block.pali && "mt-3",
          )}
        >
          {rich(block.text)}
        </p>
        {(block.source || block.translator) && (
          <footer className="mt-3 text-sm text-ink-faint">
            {block.source}
            {block.translator && (
              <span className="italic"> &middot; tr. {block.translator}</span>
            )}
          </footer>
        )}
      </blockquote>
    </Reveal>
  );
}

export function List({ block }: { block: ListBlock }) {
  const ordered = block.style !== "bullet";
  const Tag = ordered ? "ol" : "ul";

  return (
    <Stagger className="my-6">
      <Tag className="space-y-3">
        {block.items.map((item, i) => (
          <StaggerItem key={i}>
            <li className="flex gap-4">
              <span
                className={cn(
                  "mt-0.5 flex shrink-0 items-center justify-center",
                  block.style === "bullet"
                    ? "h-6 w-6"
                    : "h-6 w-6 rounded-full text-xs font-semibold",
                  block.style === "number" &&
                    "bg-cobalt-500/15 text-cobalt-ink ring-1 ring-cobalt-500/30",
                  block.style === "step" &&
                    "bg-jade-500/15 text-jade-ink ring-1 ring-jade-500/30",
                )}
                aria-hidden
              >
                {block.style === "bullet" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-cobalt-500" />
                ) : (
                  i + 1
                )}
              </span>
              <span className="prose-dhamma flex-1">
                {rich(item.text)}
                {item.pali && (
                  <Pali className="ml-2 text-cobalt-ink/80">{item.pali}</Pali>
                )}
              </span>
            </li>
          </StaggerItem>
        ))}
      </Tag>
    </Stagger>
  );
}

export function Comparison({ block }: { block: ComparisonBlock }) {
  return (
    <Stagger
      className={cn(
        "my-8 grid gap-4",
        block.columns.length === 2 && "sm:grid-cols-2",
        block.columns.length >= 3 && "sm:grid-cols-2 lg:grid-cols-3",
      )}
      gap={0.1}
    >
      {block.columns.map((col, i) => {
        const t = toneStyles[col.tone ?? "neutral"];
        return (
          <StaggerItem key={i} className="h-full">
            <div
              className={cn(
                "flex h-full flex-col rounded-2xl p-5 ring-1",
                t.bg,
                t.ring,
              )}
            >
              <h4 className={cn("font-display text-lg font-semibold", t.text)}>
                {col.title}
              </h4>
              {col.pali && (
                <Pali className="mt-0.5 text-sm text-ink-faint">{col.pali}</Pali>
              )}
              <ul className="mt-4 space-y-2.5">
                {col.points.map((p, j) => (
                  <li
                    key={j}
                    className="flex gap-2.5 text-sm leading-relaxed text-ink-dim"
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-1 w-1 shrink-0 rounded-full",
                        t.dot,
                      )}
                    />
                    <span>{rich(p)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

export function Table({ block }: { block: TableBlock }) {
  return (
    <Reveal>
      <figure className="my-8">
        <div className="overflow-x-auto rounded-xl ring-1 ring-line">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <thead>
              <tr className="bg-surface-2">
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-cobalt-ink"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-line-soft transition-colors hover:bg-surface-2/60"
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={cn(
                        "px-4 py-3 align-top leading-relaxed",
                        j === 0 ? "font-medium text-ink" : "text-ink-dim",
                      )}
                    >
                      {rich(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {block.caption && (
          <figcaption className="mt-2 text-xs text-ink-faint">
            {block.caption}
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}

/**
 * The recap at the end of a section.
 *
 * Numbered and set on hairlines rather than boxed and bulleted: a summary is
 * the one place a learner returns to, so each point wants to be findable as
 * "the third one" rather than another item in a run of dots. The jade edge is
 * all that remains of the card — enough to mark it as a recap without walling
 * it off from the section it belongs to.
 */
export function Summary({ block }: { block: SummaryBlock }) {
  return (
    <Reveal>
      <div className="my-10 border-l-2 border-jade-500/40 pl-5 sm:pl-7">
        <h4 className="si-heading flex items-center gap-3 text-xs font-semibold text-jade-ink">
          {block.title ?? t.block.inShort}
          <span aria-hidden className="h-px flex-1 bg-jade-500/20" />
        </h4>

        <ol className="mt-1">
          {block.points.map((p, i) => (
            <li
              key={i}
              className="flex gap-4 border-b border-line-soft py-4 last:border-b-0 sm:gap-6"
            >
              <span
                aria-hidden
                className="si-tight shrink-0 font-mono text-lg tabular-nums text-jade-500/45"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="prose-dhamma text-[0.98rem]">{rich(p)}</span>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}

export function Divider({ block }: { block: DividerBlock }) {
  if (!block.ornament) {
    return <hr className="my-10 border-line-soft" />;
  }
  return (
    <div className="my-12 flex items-center justify-center gap-3" aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-line" />
      <span className="h-1.5 w-1.5 rotate-45 bg-cobalt-500/60" />
      <span className="h-1 w-1 rotate-45 bg-cobalt-500/30" />
      <span className="h-1.5 w-1.5 rotate-45 bg-cobalt-500/60" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-line" />
    </div>
  );
}
