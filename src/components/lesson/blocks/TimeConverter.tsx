"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import type { TimeConverterBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pali } from "@/components/ui";

const ACCENT = {
  cobalt: { text: "text-cobalt-ink", bg: "bg-cobalt-500", ring: "ring-cobalt-500/40", soft: "bg-cobalt-500/10" },
  jade: { text: "text-jade-ink", bg: "bg-jade-500", ring: "ring-jade-500/40", soft: "bg-jade-500/10" },
  lotus: { text: "text-lotus-ink", bg: "bg-lotus-500", ring: "ring-lotus-500/40", soft: "bg-lotus-500/10" },
} as const;

/** Sinhala digits read more naturally here than Latin ones for large counts. */
function num(n: number, digits = 0) {
  return n.toLocaleString("si-LK", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

/**
 * Breaks a realm-minute count into that realm's own days / hours / minutes,
 * using the realm's declared day length rather than assuming 24 hours.
 */
function breakdown(totalMinutes: number, minutesPerDay: number) {
  const minutesPerHour = 60;
  const days = Math.floor(totalMinutes / minutesPerDay);
  const rest = totalMinutes - days * minutesPerDay;
  const hours = Math.floor(rest / minutesPerHour);
  const minutes = rest - hours * minutesPerHour;
  return { days, hours, minutes };
}

/**
 * Two-realm time converter.
 *
 * The teaching point is not the formula but the *size* of the ratio: three
 * months of human rains-retreat is nine minutes upstairs. A slider makes that
 * felt in a way a sentence cannot.
 */
export function TimeConverter({ block }: { block: TimeConverterBlock }) {
  const reduce = useReducedMotion();
  const [realmId, setRealmId] = useState(block.realms[0]?.id ?? "");
  const [humanDays, setHumanDays] = useState(
    block.presets[0]?.humanDays ?? 90,
  );
  const [activePreset, setActivePreset] = useState<number | null>(0);

  const realm = block.realms.find((r) => r.id === realmId) ?? block.realms[0];
  const accent = ACCENT[realm.accent ?? "cobalt"];

  const result = useMemo(() => {
    // How many of the realm's own minutes pass while `humanDays` pass here.
    const realmDays = humanDays / realm.humanDaysPerRealmDay;
    const realmMinutes = realmDays * realm.minutesPerRealmDay;
    return {
      realmMinutes,
      ...breakdown(realmMinutes, realm.minutesPerRealmDay),
      humanDaysPerRealmMinute:
        realm.humanDaysPerRealmDay / realm.minutesPerRealmDay,
    };
  }, [humanDays, realm]);

  // Clock hands. The realm hand turns at 1/ratio the speed of the human hand,
  // which is the whole visual argument.
  const humanTurns = humanDays / 30;
  const realmTurns = result.realmMinutes / 60;

  function setDays(days: number) {
    setHumanDays(days);
    setActivePreset(null);
  }

  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <div className="border-b border-line px-5 py-3.5">
        <h4 className="si-heading text-sm font-semibold text-ink-dim">
          {block.title ?? t.timeConverter.heading}
        </h4>
      </div>

      {/* realm picker */}
      <div className="flex flex-wrap gap-2 border-b border-line px-5 py-3">
        {block.realms.map((r) => {
          const a = ACCENT[r.accent ?? "cobalt"];
          const on = r.id === realm.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setRealmId(r.id)}
              aria-pressed={on}
              className={cn(
                "si-heading rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition-all",
                on
                  ? cn(a.soft, a.text, a.ring)
                  : "bg-surface-2 text-ink-faint ring-line hover:text-ink",
              )}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {/* the two clocks */}
      <div className="grid gap-px bg-line sm:grid-cols-2">
        <ClockPanel
          label={t.timeConverter.humanRealm}
          turns={humanTurns}
          accentBg="bg-ink-faint"
          accentText="text-ink"
          value={`${num(humanDays)} ${t.timeConverter.days}`}
          sub={
            humanDays >= 365
              ? `≈ ${num(humanDays / 365, 1)} ${t.timeConverter.years}`
              : undefined
          }
          fast
          reduce={reduce}
        />
        <ClockPanel
          label={realm.label}
          pali={realm.pali}
          turns={realmTurns}
          accentBg={accent.bg}
          accentText={accent.text}
          value={formatRealm(result)}
          sub={`${num(result.realmMinutes, 2)} ${t.timeConverter.minutes}`}
          reduce={reduce}
        />
      </div>

      {/* slider */}
      <div className="border-t border-line px-5 py-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label
            htmlFor="human-days"
            className="si-heading text-sm text-ink-dim"
          >
            {t.timeConverter.humanTime}
          </label>
          <span className="font-mono text-xs tabular-nums text-ink-faint">
            {num(humanDays)} {t.timeConverter.days}
          </span>
        </div>

        <input
          id="human-days"
          type="range"
          min={1}
          max={36500}
          step={1}
          value={humanDays}
          onChange={(e) => setDays(Number(e.target.value))}
          className="mt-3 w-full accent-cobalt-500"
        />

        <div className="mt-1 flex justify-between font-mono text-[0.65rem] text-ink-faint">
          <span>1</span>
          <span>36,500</span>
        </div>
      </div>

      {/* presets */}
      <div className="border-t border-line px-5 py-4">
        <p className="si-heading text-xs font-semibold text-ink-faint">
          {t.timeConverter.tryThese}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {block.presets.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setHumanDays(p.humanDays);
                setActivePreset(i);
              }}
              className={cn(
                "si-heading rounded-full px-3.5 py-1.5 text-sm ring-1 transition-all",
                activePreset === i
                  ? "bg-cobalt-500 text-on-brand ring-cobalt-500"
                  : "bg-surface-2 text-ink-dim ring-line hover:text-ink hover:ring-cobalt-500/40",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {activePreset !== null && block.presets[activePreset]?.note && (
          <motion.p
            key={activePreset}
            initial={{ opacity: 0, y: reduce ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose-dhamma mt-4 text-[0.95rem]"
          >
            {rich(block.presets[activePreset].note)}
          </motion.p>
        )}
      </div>

      {/* the arithmetic, shown openly */}
      <div className="border-t border-line bg-surface-2/40 px-5 py-4">
        <p className="font-mono text-xs leading-relaxed text-ink-faint">
          {realm.label}: 1 {t.timeConverter.days} ={" "}
          <span className="text-cobalt-ink">
            {num(realm.humanDaysPerRealmDay)}
          </span>{" "}
          {t.timeConverter.humanRealm} {t.timeConverter.days}
          <br />1 {t.timeConverter.days} = {num(realm.minutesPerRealmDay)}{" "}
          {t.timeConverter.minutes} &rarr; 1 {t.timeConverter.minutes} ={" "}
          <span className="text-jade-ink">
            {num(result.humanDaysPerRealmMinute, 2)}
          </span>{" "}
          {t.timeConverter.humanRealm} {t.timeConverter.days}
        </p>
      </div>
    </figure>
  );
}

function formatRealm({
  days,
  hours,
  minutes,
}: {
  days: number;
  hours: number;
  minutes: number;
}) {
  const parts: string[] = [];
  if (days) parts.push(`${num(days)} ${t.timeConverter.days}`);
  if (hours) parts.push(`${num(hours)} ${t.timeConverter.hours}`);
  if (minutes || parts.length === 0)
    parts.push(`${num(minutes, 1)} ${t.timeConverter.minutes}`);
  return parts.join(" ");
}

function ClockPanel({
  label,
  pali,
  turns,
  accentBg,
  accentText,
  value,
  sub,
  fast,
  reduce,
}: {
  label: string;
  pali?: string;
  turns: number;
  accentBg: string;
  accentText: string;
  value: string;
  sub?: string;
  fast?: boolean;
  reduce: boolean | null;
}) {
  return (
    <div className="bg-surface px-5 py-6 text-center">
      <p className="si-heading text-xs font-semibold text-ink-faint">{label}</p>
      {pali && <Pali className="mt-0.5 block text-xs text-ink-faint">{pali}</Pali>}

      <div className="relative mx-auto mt-4 h-24 w-24">
        <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            strokeWidth="2"
            className="stroke-line"
          />
          {[0, 3, 6, 9].map((h) => (
            <line
              key={h}
              x1="50"
              y1="8"
              x2="50"
              y2="14"
              strokeWidth="2"
              className="stroke-line"
              transform={`rotate(${h * 30} 50 50)`}
            />
          ))}
        </svg>

        {/* hand */}
        <motion.span
          aria-hidden
          className={cn(
            "absolute left-1/2 top-1/2 h-[34px] w-[2px] origin-bottom rounded-full",
            accentBg,
          )}
          style={{ translateX: "-50%", translateY: "-100%" }}
          animate={reduce ? undefined : { rotate: turns * 360 }}
          transition={{
            duration: fast ? 1.1 : 1.4,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
        <span
          className={cn(
            "absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full",
            accentBg,
          )}
        />
      </div>

      <p className={cn("si-heading mt-4 text-lg font-semibold", accentText)}>
        {value}
      </p>
      {sub && (
        <p className="mt-0.5 font-mono text-[0.7rem] text-ink-faint">{sub}</p>
      )}
    </div>
  );
}
