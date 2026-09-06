import { Layers } from "lucide-react";

import { ChapterArt } from "@/components/chapter/ChapterArt";
import { Pali } from "@/components/ui";
import { t } from "@/lib/strings";
import { formatNumber } from "@/lib/utils";

/**
 * The head of a chapter page: which chapter this is, what it covers, and how
 * much of it there is.
 *
 * The chapter's own artwork is the ground — the same picture the dashboard
 * cards carry, so a chapter looks like itself wherever it is met. It sits
 * under a scrim weighted to the left, which is where the text is: a hero that
 * cannot be read is a decoration with a heading on it. A chapter with no
 * artwork keeps the drawn horizon, a per-chapter hue that costs no request and
 * shifts no layout. A server component throughout.
 *
 * There is no decorative pull-quote here. Lifting a lesson's cited quotation
 * into a banner meant a reader met the same passage twice — once as chrome at
 * the top, once where the author actually put it — and the same line surfaced
 * again on the chapter page and the dashboard. A quotation belongs where it
 * was written into the teaching, exactly once.
 */
export function ChapterHero({
  number,
  title,
  subtitle,
  summary,
  pali,
  lessonCount,
  image,
}: {
  number: number;
  title: string;
  subtitle: string;
  summary: string;
  pali?: string;
  lessonCount: number;
  /** Resolved src — the page passes it through `figureSrc`. */
  image?: string;
}) {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-cobalt-800 shadow-card ring-1 ring-cobalt-900/40">
      {image ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <ChapterArt
            src={image}
            number={number}
            eager
            className="h-full w-full"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-cobalt-900/95 via-cobalt-900/80 to-cobalt-900/35" />
          <span className="absolute inset-0 bg-gradient-to-t from-cobalt-900/70 to-transparent" />
        </div>
      ) : (
        <Horizon number={number} />
      )}

      <div className="relative p-7 sm:p-9">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-cobalt-300">
            {t.course.chapter} {String(number).padStart(2, "0")}
          </p>

          <span className="mt-4 block font-display text-[clamp(2.4rem,5vw,3.4rem)] font-semibold leading-none text-rail-ink/25">
            {String(number).padStart(2, "0")}
          </span>

          <h1 className="si-tight -mt-6 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold text-rail-ink">
            {title}
          </h1>
          <p className="si-heading mt-2 max-w-xl text-[0.95rem] text-cobalt-300">
            {subtitle}
          </p>
          {pali ? (
            <Pali className="mt-1 block text-sm text-cobalt-300/80">{pali}</Pali>
          ) : null}

          <p className="si-heading mt-5 max-w-xl text-[0.95rem] leading-relaxed text-rail-ink-dim">
            {summary}
          </p>

          <dl className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Fact
              icon={<Layers size={15} />}
              value={`${formatNumber(lessonCount)} ${t.course.lessons}`}
            />
          </dl>
        </div>
      </div>
    </header>
  );
}

function Fact({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className="text-cobalt-300">
        {icon}
      </span>
      <span className="si-heading block text-sm font-medium text-rail-ink">
        {value}
      </span>
    </div>
  );
}

/** Four ambient washes, cycled by chapter number, so consecutive chapters
    read as different places without four image requests. */
const washes = [
  "rgba(110,144,240,0.34)",
  "rgba(47,182,162,0.26)",
  "rgba(155,132,238,0.26)",
  "rgba(245,185,63,0.20)",
];

function Horizon({ number }: { number: number }) {
  const wash = washes[(number - 1) % washes.length];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(110% 100% at 86% 12%, ${wash}, transparent 58%)`,
        }}
      />
      <svg
        viewBox="0 0 400 160"
        preserveAspectRatio="xMaxYMax slice"
        className="absolute inset-y-0 right-0 h-full w-3/5 opacity-30"
      >
        <path
          d="M0 132 L58 108 L112 126 L168 94 L232 120 L300 96 L360 118 L400 100 L400 160 L0 160 Z"
          className="fill-cobalt-900/60"
        />
        <circle cx="312" cy="52" r="26" className="fill-cobalt-300/25" />
      </svg>
    </div>
  );
}
