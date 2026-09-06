import { ArrowRight } from "lucide-react";

import { rich } from "@/lib/richtext";
import type { DerivationBlock } from "@/lib/types";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

/**
 * An arithmetic derivation, shown whole.
 *
 * The nine-minute figure is the case this exists for: it is a claim a learner
 * can either take on trust or check, and the difference between those two is
 * the whole reason to show the working. Hiding four of five steps behind a
 * "next" button turns a proof back into an assertion — so there is nothing to
 * click here, and there should not be.
 *
 * What carries it instead is the *shape*. Each step is a card that reads left
 * to right as one sentence in arithmetic — sum, arrow, answer — so the eye
 * takes the whole line in one movement rather than reading a list. The figures
 * are set large and in mono because they are the content; the prose is a
 * caption to the arithmetic, not the other way round.
 */
export function Derivation({ block }: { block: DerivationBlock }) {
  return (
    <Reveal>
      <figure className="my-10 overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line">
        {block.title && (
          <figcaption className="si-heading border-b border-line px-5 py-3.5 text-sm font-semibold text-ink-dim">
            {block.title}
          </figcaption>
        )}

        {/* -- what the arithmetic assumes, before it starts --------------- */}
        {block.given && block.given.length > 0 && (
          <dl className="grid gap-px border-b border-line bg-line sm:grid-cols-2">
            {block.given.map((g) => (
              <div key={g.label} className="bg-surface-2/60 px-5 py-3">
                <dt className="si-heading text-[0.7rem] text-ink-faint">
                  {g.label}
                </dt>
                <dd className="mt-0.5 font-mono text-[0.82rem] tabular-nums text-ink-dim">
                  {g.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* -- the working ------------------------------------------------- */}
        <Stagger className="divide-y divide-line-soft" gap={0.07}>
          {block.steps.map((step, i) => (
            <StaggerItem key={i}>
              <div className="relative px-5 py-5">
                {/* the step number, large and ghosted — position, not noise */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-4 top-2 font-display text-4xl font-semibold leading-none text-ink/[0.05]"
                >
                  {i + 1}
                </span>

                <p className="si-heading relative text-[0.78rem] text-ink-faint">
                  {step.label}
                </p>

                {/* sum → answer, one line the eye crosses in one movement */}
                <div className="relative mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                  {step.expression && (
                    <>
                      <span className="rounded-lg bg-surface-2 px-3 py-1.5 font-mono text-[0.95rem] tabular-nums text-ink-dim ring-1 ring-line">
                        {step.expression}
                      </span>
                      <ArrowRight
                        size={15}
                        aria-hidden
                        className="shrink-0 text-ink-mute"
                      />
                    </>
                  )}
                  <span className="si-tight font-display text-xl font-semibold text-cobalt-ink sm:text-2xl">
                    {step.result}
                  </span>
                </div>

                {step.note && (
                  <p className="prose-dhamma relative mt-2 max-w-2xl text-[0.9rem]">
                    {rich(step.note)}
                  </p>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* -- the answer, given the weight of an answer ------------------- */}
        <div className="border-t border-jade-500/30 bg-jade-500/8 px-5 py-6">
          <p className="si-tight font-display text-3xl font-semibold text-jade-ink sm:text-4xl">
            {block.conclusion.value}
          </p>
          <p className="prose-dhamma mt-2 max-w-2xl text-[0.98rem]">
            {rich(block.conclusion.text)}
          </p>
        </div>
      </figure>
    </Reveal>
  );
}
