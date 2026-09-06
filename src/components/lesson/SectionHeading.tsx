import { Link2 } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Pali } from "@/components/ui";
import { cn } from "@/lib/utils";

const ACCENT = {
  cobalt: {
    badge: "bg-cobalt-500/12 text-cobalt-ink ring-cobalt-500/30",
    rule: "from-cobalt-500/40",
    pali: "text-cobalt-ink/80",
  },
  jade: {
    badge: "bg-jade-500/12 text-jade-ink ring-jade-500/30",
    rule: "from-jade-500/40",
    pali: "text-jade-ink/80",
  },
} as const;

/**
 * The heading that opens a section of a lesson or a reference topic.
 *
 * Shared rather than duplicated: lessons and reference topics render the same
 * shape, differing only in accent.
 *
 * Three things the previous inline version did not do — a numbered rule that
 * gives the page a visible rhythm between sections, the section's `brief`
 * (which was carried in the data and shown only in the side rail), and a
 * hover anchor, since the deep links already existed with no way to copy one.
 */
export function SectionHeading({
  id,
  index,
  title,
  pali,
  brief,
  accent = "cobalt",
}: {
  id: string;
  /** 1-based. */
  index: number;
  title: string;
  pali?: string;
  brief?: string;
  accent?: keyof typeof ACCENT;
}) {
  const a = ACCENT[accent];

  return (
    <Reveal>
      <header className="group/heading mb-7">
        {/* numbered rule */}
        <div className="flex items-center gap-3" aria-hidden>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-mono text-[0.68rem] font-semibold tabular-nums ring-1",
              a.badge,
            )}
          >
            {String(index).padStart(2, "0")}
          </span>
          <span
            className={cn("h-px flex-1 bg-gradient-to-r to-transparent", a.rule)}
          />
        </div>

        <h2
          id={`heading-${id}`}
          className="si-heading mt-4 scroll-mt-24 font-display text-[1.75rem] font-semibold leading-snug text-ink sm:text-3xl"
        >
          {title}
          {/* deep links exist; this is how you get one */}
          <a
            href={`#section-${id}`}
            aria-label={title}
            className="ml-2 inline-block align-middle text-ink-faint opacity-0 transition-opacity focus-visible:opacity-100 group-hover/heading:opacity-100"
          >
            <Link2 size={15} />
          </a>
        </h2>

        {pali && (
          <Pali className={cn("mt-1 block text-base", a.pali)}>{pali}</Pali>
        )}

        {brief && (
          <p className="si-heading mt-2 text-sm text-ink-faint">{brief}</p>
        )}
      </header>
    </Reveal>
  );
}
