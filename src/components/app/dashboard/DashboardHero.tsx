"use client";

import Link from "next/link";
import { BookOpen, Play } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { type ProgressLesson, useCourseProgress } from "@/lib/progress";
import { t } from "@/lib/strings";

/**
 * The head of the dashboard: what this is, and the one action that matters.
 *
 * The primary button changes wording once the learner has started — "begin"
 * shown to someone eleven sections in is chrome that has stopped paying
 * attention — and always points at the first lesson with unread sections.
 *
 * There is no decorative pull-quote here. Lifting a lesson's cited quotation
 * into a banner meant a reader met the same passage twice — once as chrome at
 * the top, once where the author actually put it — and the same line surfaced
 * again on the chapter page and the dashboard. A quotation belongs where it
 * was written into the teaching, exactly once.
 */
export function DashboardHero({ lessons }: { lessons: ProgressLesson[] }) {
  const progress = useCourseProgress(lessons);
  const target = progress.next?.slug ?? lessons[0]?.slug;

  return (
    <Reveal>
      <section className="relative isolate overflow-hidden rounded-3xl bg-cobalt-900 shadow-lift ring-1 ring-cobalt-800">
        <NightSky />

        <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Pill>{t.dashboard.heroPillOne}</Pill>
              <Pill>{t.dashboard.heroPillTwo}</Pill>
            </div>

            <h1 className="si-tight mt-4 max-w-xl font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold text-rail-ink">
              {t.dashboard.heroTitle}
            </h1>
            <p className="si-heading mt-4 max-w-lg text-[0.95rem] leading-relaxed text-rail-ink-dim">
              {t.dashboard.heroBody}
            </p>

            {target ? (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={`/lessons/${target}`}
                  className="inline-flex items-center gap-2.5 rounded-full bg-cobalt-500 px-5 py-3 text-on-brand shadow-glow-cobalt transition-all duration-200 hover:bg-cobalt-400 active:scale-[0.98]"
                >
                  <Play size={15} aria-hidden fill="currentColor" />
                  <span className="si-heading block text-sm font-medium leading-none">
                    {progress.started ? t.dashboard.resume : t.dashboard.start}
                  </span>
                </Link>

                <Link
                  href="/chapters"
                  className="inline-flex items-center gap-2.5 rounded-full bg-rail-ink/10 px-5 py-3 text-rail-ink ring-1 ring-rail-ink/20 backdrop-blur-sm transition-colors hover:bg-rail-ink/20"
                >
                  <BookOpen size={15} aria-hidden />
                  <span className="si-heading block text-sm font-medium leading-none">
                    {t.dashboard.explorePath}
                  </span>
                </Link>
              </div>
            ) : null}
          </div>

          {/* The scene needs its own column at wide sizes or the text sits on
              top of the figure. Below `lg` it is background only. */}
          <div aria-hidden className="hidden lg:block" />
        </div>
      </section>
    </Reveal>
  );
}

/**
 * A moon over still water, with a seated figure and a bodhi branch.
 *
 * Drawn rather than photographed: no request, no layout shift, and it tints
 * from the same tokens as everything else. The one moving part is the moon's
 * halo, on the shared `halo` keyframes — which the global reduced-motion rule
 * stops dead, so nobody who asked for stillness gets a pulsing sky.
 */
function NightSky() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {/* Aurora washes. Three overlapping radials read as depth in a way one
          flat gradient never does. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_110%_at_72%_10%,rgba(110,144,240,0.38),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(90%_120%_at_18%_100%,rgba(124,92,231,0.22),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_50%_120%,rgba(15,157,138,0.18),transparent_65%)]" />

      {/* The moon's halo, breathing slowly. */}
      <span className="animate-halo absolute right-[16%] top-6 hidden h-40 w-40 rounded-full bg-cobalt-300/25 blur-3xl sm:block" />

      <svg
        viewBox="0 0 420 240"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full opacity-90"
      >
        <defs>
          <radialGradient id="hero-moon" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#e8f0ff" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#adc3f8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3563e9" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hero-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6e90f0" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0b1220" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* moon */}
        <circle cx="300" cy="72" r="46" fill="url(#hero-moon)" />
        <circle cx="300" cy="72" r="21" fill="#eaf1ff" fillOpacity="0.9" />

        {/* far treeline */}
        <path
          d="M0 176 L44 160 L84 172 L128 152 L176 170 L232 150 L288 168 L340 152 L420 166 L420 240 L0 240 Z"
          fill="#0a1020"
          opacity="0.75"
        />

        {/* water */}
        <rect x="0" y="186" width="420" height="54" fill="url(#hero-water)" />
        <g stroke="#adc3f8" strokeOpacity="0.28" strokeWidth="1">
          <path d="M232 200h136M244 210h112M256 220h88M268 230h64" />
        </g>

        {/* seated figure, in silhouette */}
        <g fill="#070c17">
          <path d="M300 186c-26 0-44-8-44-14 0-7 12-12 20-14 6-14 12-22 24-22s18 8 24 22c8 2 20 7 20 14 0 6-18 14-44 14Z" />
          <circle cx="300" cy="128" r="9" />
          <path d="M291 140q9 -7 18 0 -9 5 -18 0Z" />
        </g>

        {/* bodhi branch, top left */}
        <g className="fill-cobalt-300/25">
          <path d="M18 12c16 4 26 16 26 32 0 18-12 30-28 34C10 62 6 44 8 28c1-8 6-14 10-16Z" />
          <path d="M62 42c12 3 20 12 20 25 0 14-9 23-22 26-4-12-7-26-4-38 1-7 4-11 6-13Z" />
        </g>
        <path
          d="M14 14C40 46 56 82 62 128"
          className="stroke-cobalt-300/40"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * A quiet capsule over the banner. Not `ui`'s `Pill`, which is toned for a
 * page surface — this one sits on the deep banner and takes rail ink.
 */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="si-heading inline-flex items-center rounded-full bg-rail-ink/10 px-3 py-1 text-[0.68rem] font-medium text-rail-ink ring-1 ring-rail-ink/15 backdrop-blur-sm">
      {children}
    </span>
  );
}
