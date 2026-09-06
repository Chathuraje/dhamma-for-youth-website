"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useHydrated, useProgress } from "@/lib/progress";

/**
 * Runs before first paint to stamp the saved theme onto <html>, so a learner
 * who chose dark mode never sees a flash of the light palette.
 *
 * It reads the same localStorage key the zustand store persists to. If that
 * key name ever changes in `src/lib/progress.ts`, change it here too.
 */
export const themeInitScript = `
(function(){
  try {
    var raw = localStorage.getItem('abhidhamma-atlas.progress.v1');
    var theme = raw ? (JSON.parse(raw).state || {}).theme : null;
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch (e) {}
})();
`;

/** Keeps <html data-theme> in sync with the store after hydration. */
export function ThemeSync() {
  const theme = useProgress((s) => s.theme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return null;
}

export function ThemeToggle() {
  const theme = useProgress((s) => s.theme);
  const setTheme = useProgress((s) => s.setTheme);
  const hydrated = useHydrated();

  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="flex h-9 w-9 items-center justify-center rounded-full text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink"
    >
      {/* Render the light-mode icon until hydrated so SSR and client agree. */}
      {hydrated && theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
