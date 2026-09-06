import { rich } from "@/lib/richtext";
import type { TimelineBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pali } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

const ACCENT = {
  cobalt: { node: "bg-cobalt-500", halo: "ring-cobalt-500/20", text: "text-cobalt-ink" },
  jade: { node: "bg-jade-500", halo: "ring-jade-500/20", text: "text-jade-ink" },
  lotus: { node: "bg-lotus-500", halo: "ring-lotus-500/20", text: "text-lotus-ink" },
} as const;

/**
 * A history, drawn as one continuous line.
 *
 * `flow` is for a process the learner steps through, because with a cognitive
 * series the stepping *is* the teaching. A transmission history is not that:
 * it is read, and the thing worth feeling is its length — a line running from
 * a deva realm to a printed book, unbroken. A slideshow hides exactly that.
 *
 * The rule behind the nodes carries a gradient across the whole span, so the
 * distance travelled is visible before any of it is read.
 */
export function Timeline({ block }: { block: TimelineBlock }) {
  return (
    <Reveal>
      <figure className="my-10">
        {block.title && (
          <figcaption className="si-heading mb-6 text-xs font-semibold text-ink-faint">
            {block.title}
          </figcaption>
        )}

        <div className="relative">
          {/* the line itself, running the full height behind every node */}
          <span
            aria-hidden
            className="absolute bottom-2 left-1.75 top-2 w-px bg-gradient-to-b from-lotus-500/50 via-cobalt-500/50 to-jade-500/50"
          />

          <Stagger as="ol" className="space-y-7" gap={0.07}>
            {block.events.map((event, i) => {
              const a = ACCENT[event.accent ?? "cobalt"];
              return (
                <StaggerItem
                  key={i}
                  as="li"
                  className="relative flex gap-5"
                >
                  {/* fixed-width gutter so both node sizes sit on one axis */}
                  <span
                    aria-hidden
                    className="mt-1.5 flex w-3.5 shrink-0 justify-center"
                  >
                    <span
                      className={cn(
                        "relative z-10 rounded-full ring-4",
                        a.node,
                        a.halo,
                        event.milestone ? "h-3.5 w-3.5" : "h-2 w-2",
                      )}
                    />
                  </span>

                  <div className="min-w-0 flex-1 pb-1">
                    {event.when && (
                      <p className="si-heading font-mono text-[0.7rem] tabular-nums text-ink-faint">
                        {event.when}
                      </p>
                    )}
                    <h5
                      className={cn(
                        "si-tight font-display font-semibold",
                        event.milestone
                          ? cn("text-lg", a.text)
                          : "text-base text-ink",
                      )}
                    >
                      {event.label}
                      {event.pali && (
                        <Pali className="ml-2.5 text-sm font-normal text-cobalt-ink/75">
                          {event.pali}
                        </Pali>
                      )}
                    </h5>
                    <p className="prose-dhamma mt-1.5 text-[0.95rem]">
                      {rich(event.text)}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </figure>
    </Reveal>
  );
}
