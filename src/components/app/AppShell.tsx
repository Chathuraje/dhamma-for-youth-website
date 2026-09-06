"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookMarked, Compass, Menu, Search, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { SearchDialog, useSearchDialog } from "@/components/app/SearchDialog";
import { Sidebar } from "@/components/app/Sidebar";
import { ThemeToggle } from "@/components/site/Theme";
import { useHydrated, useProgress } from "@/lib/progress";
import type { SearchRow } from "@/lib/search";
import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";

/**
 * THE LEARNING APP SHELL
 * ======================
 * A fixed rail on the left, a topbar above the scroll area, and the page
 * itself. Everything a learner does lives inside this; the marketing site
 * keeps its own header and footer and never renders the shell.
 *
 * This is a client component because the rail highlights the current route and
 * the topbar owns the search dialog. It takes `children` as a prop, so
 * everything inside stays a server component — the content registry never
 * crosses the boundary.
 *
 * The topbar deliberately carries no notification bell and no account avatar.
 * There are no accounts and nothing to notify about; chrome that implies
 * otherwise is a lie told in pixels. The slot holds the theme toggle instead.
 */
export function AppShell({
  children,
  searchIndex,
}: {
  children: React.ReactNode;
  searchIndex: SearchRow[];
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { open: searchOpen, setOpen: setSearchOpen } = useSearchDialog();

  /**
   * The rail's width is a learner preference, so it is read from their own
   * store — and gated on hydration, because the server has no way to know it
   * and rendering the folded rail first would shift the whole page.
   */
  const hydrated = useHydrated();
  const toggleRail = useProgress((s) => s.toggleRail);
  const collapsed = useProgress((s) => s.railCollapsed) && hydrated;

  /**
   * The mobile rail stores the path it was opened on rather than a boolean, so
   * navigating anywhere closes it for free — no effect syncing state to the
   * router.
   */
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const railOpen = openedAt === pathname;

  useEffect(() => {
    if (!railOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenedAt(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [railOpen]);

  return (
    <div
      data-app-main
      className={cn(
        "min-h-dvh transition-[padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        collapsed ? "lg:pl-[4.5rem]" : "lg:pl-[16rem]",
      )}
    >
      {/* -- rail: fixed on desktop --------------------------------------- */}
      <div
        data-app-rail
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block",
          collapsed ? "w-[4.5rem]" : "w-[16rem]",
        )}
      >
        <Sidebar collapsed={collapsed} onToggleCollapse={toggleRail} />
      </div>

      {/* -- rail: slide-over on small screens ---------------------------- */}
      <AnimatePresence>
        {railOpen && (
          <div className="fixed inset-0 z-70 lg:hidden">
            <motion.button
              type="button"
              aria-label={t.app.railClose}
              onClick={() => setOpenedAt(null)}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.2 }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] shadow-lift"
              initial={{ x: reduce ? 0 : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: reduce ? 0 : "-100%" }}
              transition={{
                duration: reduce ? 0 : 0.28,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Sidebar onNavigate={() => setOpenedAt(null)} />
              <button
                type="button"
                onClick={() => setOpenedAt(null)}
                aria-label={t.app.railClose}
                className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-full text-rail-ink-dim hover:bg-rail-2 hover:text-rail-ink"
              >
                <X size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -- topbar ------------------------------------------------------- */}
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setOpenedAt(pathname)}
            aria-label={t.app.railOpen}
            aria-expanded={railOpen}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink lg:hidden"
          >
            <Menu size={18} />
          </button>

          {/* Desktop: a button styled as a field. It opens the dialog rather
              than accepting input inline, so there is one search UI, not two. */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="mx-auto hidden h-10 w-full max-w-lg items-center gap-2.5 rounded-full bg-surface px-4 text-left ring-1 ring-line transition-colors hover:ring-cobalt-500/40 sm:flex"
          >
            <Search size={15} className="shrink-0 text-ink-faint" aria-hidden />
            <span className="si-heading flex-1 truncate text-sm text-ink-faint">
              {t.app.search}
            </span>
            <kbd className="hidden shrink-0 rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[0.65rem] text-ink-faint md:block">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={t.app.searchLabel}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink sm:hidden"
          >
            <Search size={18} />
          </button>

          <nav
            aria-label={t.app.groupMine}
            className="ml-auto hidden items-center gap-1 sm:flex"
          >
            <TopLink
              href="/my-learning"
              icon={<Compass size={15} />}
              label={t.app.myLearning}
            />
            <TopLink
              href="/bookmarks"
              icon={<BookMarked size={15} />}
              label={t.app.bookmarks}
            />
            <span className="mx-1 h-5 w-px bg-line" />
            <ThemeToggle />
          </nav>

          <span className="sm:hidden">
            <ThemeToggle />
          </span>
        </div>
      </header>

      <main id="main">{children}</main>

      <SearchDialog
        index={searchIndex}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}

/**
 * A topbar shortcut. The Sinhala label is hidden below `xl` because the bar
 * has to hold the search field too; the icon and its accessible name survive
 * at every width.
 */
function TopLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-full px-3 py-2 text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink"
    >
      <span aria-hidden>{icon}</span>
      <span className="si-heading hidden text-sm xl:block">{label}</span>
      <span className="sr-only xl:hidden">{label}</span>
    </Link>
  );
}
