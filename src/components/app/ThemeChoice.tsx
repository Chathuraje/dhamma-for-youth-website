"use client";

import { Moon, Sun } from "lucide-react";

import { useHydrated, useProgress } from "@/lib/progress";
import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";

/**
 * The theme as an explicit choice rather than a toggle, for the settings page.
 *
 * Light is the authored default; dark is a full second palette, not a filter.
 * Before hydration neither option is marked selected, because the stored
 * choice is not knowable on the server and guessing it would flash.
 */
export function ThemeChoice() {
  const theme = useProgress((s) => s.theme);
  const setTheme = useProgress((s) => s.setTheme);
  const hydrated = useHydrated();

  const options = [
    {
      value: "light" as const,
      label: t.settings.themeLight,
      gloss: t.settings.themeLight,
      icon: <Sun size={16} />,
    },
    {
      value: "dark" as const,
      label: t.settings.themeDark,
      gloss: t.settings.themeDark,
      icon: <Moon size={16} />,
    },
  ];

  return (
    <div role="radiogroup" aria-label={t.settings.theme} className="flex gap-3">
      {options.map((option) => {
        const selected = hydrated && theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex flex-1 items-center gap-3 rounded-xl px-4 py-3.5 ring-1 transition-colors",
              selected
                ? "bg-cobalt-100 text-cobalt-700 ring-cobalt-500/40"
                : "bg-surface-2 text-ink-dim ring-line hover:bg-surface-3",
            )}
          >
            <span aria-hidden>{option.icon}</span>
            <span className="si-heading block text-left text-sm font-medium">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
