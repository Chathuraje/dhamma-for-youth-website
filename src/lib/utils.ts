import { t } from "./strings";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Minutes as a readable duration, in the site's language.
 *
 * Units come from `strings.ts` like every other piece of user-facing text —
 * this used to emit "min" and "hr" on a Sinhala site.
 */
export function formatDuration(min: number) {
  if (min < 60) return `${min} ${t.course.minutes}`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m
    ? `${h} ${t.course.hours} ${m} ${t.course.minutes}`
    : `${h} ${t.course.hours}`;
}

/** Clamp a number into a range. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Deterministic pseudo-random in [0,1) from an integer seed. */
export function seeded(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Fisher-Yates using a seeded PRNG so SSR and client agree. */
export function seededShuffle<T>(items: T[], seed = 1): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(seeded(seed + i) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * A number as the site's readers expect to see it.
 *
 * Sinhala uses the same digits as Latin here, but grouping and any future
 * locale switch belong in one place rather than at every call site.
 */
export function formatNumber(value: number, locale = "si-LK") {
  return new Intl.NumberFormat(locale).format(value);
}

/** A percentage, rounded, for progress readouts. */
export function formatPercent(ratio: number, locale = "si-LK") {
  return `${formatNumber(Math.round(clamp(ratio, 0, 1) * 100), locale)}%`;
}

/**
 * An ISO date as a readable Sinhala date. Returns the raw string if it will
 * not parse, so a typo in content shows up rather than silently becoming
 * "Invalid Date".
 */
export function formatDate(iso: string, locale = "si-LK") {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
