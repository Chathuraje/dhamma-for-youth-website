import Link from "next/link";
import type { ReactNode } from "react";

import { ChapterArt } from "@/components/chapter/ChapterArt";
import { t } from "@/lib/strings";
import { formatNumber } from "@/lib/utils";

/**
 * The head of a lesson: which lesson this is, inside which chapter, and what
 * it will cost to read.
 *
 * The chapter line is a link — a learner who has landed here from search needs
 * a way up, and the breadcrumb above is a trail rather than a description.
 *
 * It carries the chapter's *name* and nothing else. It used to repeat the
 * chapter's blurb underneath, and the lesson's Pāli title under that, which
 * put three descriptions in a row above a heading that had not been read yet.
 * The blurb belongs on the chapter page and the Pāli belongs where the term is
 * taught.
 *
 * The ground is the chapter's own artwork — a lesson is a part of a chapter,
 * and looking like one is most of what a reader needs to know. The drawn
 * canopy stays as the fallback for a chapter with no picture.
 *
 * It carries no "lesson 1 of 3" counter. The breadcrumb says 1.1 and the
 * heading repeats it, so a third copy on the same screen was noise; the
 * progress strip beneath answers the same question with more in it.
 *
 * There is no decorative pull-quote here. Lifting a lesson's cited quotation
 * into a banner meant a reader met the same passage twice — once as chrome at
 * the top, once where the author actually put it — and the same line surfaced
 * again on the chapter page and the dashboard. A quotation belongs where it
 * was written into the teaching, exactly once.
 *
 * A server component. Nothing here depends on the learner.
 */
export function LessonBanner({
  chapter,
  position,
  number,
  title,
  subtitle,
  progress,
  image,
  isDraft,
}: {
  chapter?: { slug: string; number: number; title: string };
  /** 1-based position within the chapter. */
  position?: { index: number; total: number };
  number: number;
  title: string;
  subtitle: string;
  /** Chapter progress. A node, so the banner stays a server component. */
  progress?: ReactNode;
  /** The chapter's artwork, resolved. */
  image?: string;
  isDraft: boolean;
}) {
  /** "1.3" when the lesson sits in a chapter, the plain number when it does not. */
  const label = chapter
    ? `${formatNumber(chapter.number)}.${formatNumber(position?.index ?? number)}`
    : formatNumber(number);

  return (
    <header className="relative overflow-hidden rounded-3xl bg-cobalt-800 shadow-card ring-1 ring-cobalt-900/40">
      {image ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <ChapterArt
            src={image}
            number={chapter?.number ?? number}
            eager
            className="h-full w-full"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-cobalt-900/95 via-cobalt-900/80 to-cobalt-900/35" />
          <span className="absolute inset-0 bg-gradient-to-t from-cobalt-900/70 to-transparent" />
        </div>
      ) : (
        <Canopy number={chapter?.number ?? number} />
      )}

      {/*
        The horizontal padding here is the page's gutter: `LESSON_GUTTER` gives
        the breadcrumb and the lesson body the same step, so the chapter line,
        the heading and the first paragraph of the lesson all begin on one
        vertical. A hero whose text starts further in than the text below it
        reads as a second, narrower page.
      */}
      <div className="relative px-4 py-6 sm:px-8 sm:py-8">
        <div className="w-full">
          {chapter ? (
            <Link
              href={`/chapters/${chapter.slug}`}
              className="si-heading inline-block text-sm font-medium text-cobalt-300 underline decoration-cobalt-300/0 underline-offset-4 transition-colors hover:text-rail-ink hover:decoration-rail-ink/60"
            >
              {String(chapter.number).padStart(2, "0")}. {chapter.title}
            </Link>
          ) : null}

          <h1 className="si-tight mt-4 max-w-3xl font-display text-[clamp(1.5rem,3vw,2.25rem)] font-semibold text-rail-ink">
            <span className="mr-2.5 font-mono text-cobalt-300">{label}</span>
            {title}
          </h1>
          <p className="si-heading mt-2 max-w-xl text-[0.9rem] text-cobalt-300">
            {subtitle}
          </p>

          {isDraft ? (
            <p className="mt-5">
              <span className="rounded-full bg-gold-500/20 px-2.5 py-1 text-[0.68rem] font-medium text-gold-300">
                {t.course.draft}
              </span>
            </p>
          ) : null}

          {/* Left, with everything else. Nothing sits out on the right now
              that the counter it was balancing is gone. */}
          {progress ? <div className="mt-6">{progress}</div> : null}
        </div>
      </div>
    </header>
  );
}

/** Leaves and light, cycled by chapter so consecutive lessons stay distinct. */
const washes = [
  "rgba(110,144,240,0.32)",
  "rgba(47,182,162,0.24)",
  "rgba(155,132,238,0.24)",
  "rgba(245,185,63,0.18)",
];

function Canopy({ number }: { number: number }) {
  const wash = washes[(number - 1) % washes.length];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(100% 100% at 90% 10%, ${wash}, transparent 55%)`,
        }}
      />
      <svg
        viewBox="0 0 320 140"
        preserveAspectRatio="xMinYMin slice"
        className="absolute inset-y-0 left-0 h-full w-1/3 opacity-25"
      >
        <g className="fill-cobalt-300/50">
          <path d="M14 8c18 4 30 18 30 36 0 20-14 34-32 38C10 66 4 46 8 26 10 16 12 10 14 8Z" />
          <path d="M62 34c14 3 24 14 24 29 0 16-11 27-26 30-2-14-6-30-3-45 1-8 3-12 5-14Z" />
        </g>
        <path
          d="M12 10C34 44 48 78 54 118"
          className="stroke-cobalt-300/50"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
