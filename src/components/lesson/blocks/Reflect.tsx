"use client";

import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { rich } from "@/lib/richtext";
import { t } from "@/lib/strings";
import { useHydrated, useProgress } from "@/lib/progress";
import type { ReflectBlock } from "@/lib/types";

/**
 * An open reflection prompt.
 *
 * Abhidhamma read as pure taxonomy stays inert. These prompts ask the learner
 * to find the category in their own experience, which is the point of the
 * analysis in the first place.
 *
 * Text is written to localStorage and nowhere else. We say so in the UI,
 * because a person will not write honestly into a box they do not trust.
 */
export function Reflect({
  block,
  storageKey,
}: {
  block: ReflectBlock;
  storageKey: string;
}) {
  const hydrated = useHydrated();
  const saved = useProgress((s) => s.reflections[storageKey]);
  const saveReflection = useProgress((s) => s.saveReflection);

  /**
   * `null` means "the learner has not typed yet", so the persisted value shows
   * through. Deriving the displayed value this way avoids an effect that
   * copies store state into local state.
   */
  const [draft, setDraft] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  const value = draft ?? (hydrated ? (saved ?? "") : "");

  // Debounced autosave. Writing to the store is the point of this effect;
  // setStatus runs inside the timer callback, not the effect body.
  useEffect(() => {
    if (!hydrated || draft === null) return;
    if (draft === (saved ?? "")) return;
    const t = setTimeout(() => {
      saveReflection(storageKey, draft);
      setStatus("saved");
    }, 700);
    return () => clearTimeout(t);
  }, [draft, hydrated, saved, saveReflection, storageKey]);

  return (
    <div className="my-10 rounded-2xl bg-lotus-500/6 p-5 ring-1 ring-lotus-500/25 sm:p-6">
      <span className="text-[0.7rem] si-heading font-semibold text-lotus-ink">
        {t.reflect.heading}
      </span>

      <p className="prose-dhamma mt-2 text-[1.02rem] text-ink">
        {rich(block.prompt)}
      </p>

      <textarea
        value={value}
        onChange={(e) => {
          setDraft(e.target.value);
          setStatus("idle");
        }}
        rows={4}
        placeholder={block.placeholder ?? t.reflect.placeholder}
        className="mt-4 w-full resize-y rounded-xl bg-surface/80 px-4 py-3 text-[0.97rem] leading-relaxed text-ink placeholder:text-ink-faint/70 ring-1 ring-line transition focus:ring-lotus-500/50 focus:outline-none"
      />

      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-ink-faint">
        <span className="flex items-center gap-1.5">
          <Lock size={11} />
          {t.reflect.private}
        </span>
        <span
          className={
            status === "saved"
              ? "text-jade-ink transition-opacity"
              : "opacity-0"
          }
        >
          {t.reflect.saved}
        </span>
      </div>
    </div>
  );
}
