"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useHydrated, useProgress } from "@/lib/progress";
import { Button } from "@/components/ui";

/** Lets a learner wipe everything this site has stored about them. */
export function ResetProgress() {
  const hydrated = useHydrated();
  const resetAll = useProgress((s) => s.resetAll);
  const completed = useProgress((s) => s.completed);
  const reflections = useProgress((s) => s.reflections);

  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);

  const sectionCount = hydrated
    ? Object.values(completed).reduce((n, ids) => n + ids.length, 0)
    : 0;
  const reflectionCount = hydrated ? Object.keys(reflections).length : 0;
  const hasData = sectionCount > 0 || reflectionCount > 0;

  return (
    <div className="mt-6 rounded-xl bg-surface-2/50 p-5 ring-1 ring-line">
      {cleared ? (
        <p className="si-heading text-sm text-jade-600">සියල්ල මකා දැමිණි.</p>
      ) : !hasData ? (
        <p className="prose-dhamma text-sm">
          තවම කිසිවක් ගබඩා කර නැත. පාඩමක් පටන් ගත් විට ඔබේ ප්‍රගතිය මෙහි
          පෙනෙනු ඇත.
        </p>
      ) : (
        <>
          <p className="si-heading text-sm text-ink-dim">
            මෙම උපකරණයේ දැනට ගබඩා වී ඇත:{" "}
            <span className="font-medium text-ink">
              කියවූ කොටස් {sectionCount}ක්
            </span>
            {reflectionCount > 0 && (
              <>
                {" සහ "}
                <span className="font-medium text-ink">
                  ලියූ අදහස් {reflectionCount}ක්
                </span>
              </>
            )}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {confirming ? (
              <>
                <Button
                  size="sm"
                  className="si-heading bg-rose-500 hover:bg-rose-400"
                  onClick={() => {
                    resetAll();
                    setCleared(true);
                  }}
                >
                  <Trash2 size={13} />
                  ඔව්, සියල්ල මකන්න
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setConfirming(false)}
                >
                  අවලංගු කරන්න
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setConfirming(true)}
              >
                <Trash2 size={13} />
                මගේ ප්‍රගතිය මකන්න
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
