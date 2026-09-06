"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookMarked,
  BookOpen,
  Compass,
  FileText,
  Home,
  Layers,
  type LucideIcon,
  PanelLeftClose,
  PanelLeftOpen,
  PencilLine,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { RailScene } from "@/components/app/RailScene";
import {
  type RailIcon,
  type RailItem,
  railFooterItem,
  railGroups,
  site,
} from "@/lib/site";
import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";

/**
 * Icon names live in `site.ts` as strings so that module stays JSX-free. This
 * map is the one place they become components; the `Record<RailIcon, …>` type
 * means adding a name without an icon is a type error rather than a blank
 * square in the rail.
 */
const icons: Record<RailIcon, LucideIcon> = {
  home: Home,
  chapters: BookOpen,
  practice: PencilLine,
  progress: Compass,
  notes: FileText,
  bookmarks: BookMarked,
  reference: Layers,
  glossary: Sparkles,
  resources: FileText,
  community: Users,
  settings: Settings,
};

/**
 * THE RAIL
 * ========
 * Midnight in both themes — it is the fixed point a learner navigates by,
 * and flipping it with the theme would make the app feel like two products.
 *
 * On desktop it is a fixed column that folds to a strip of icons, and the
 * folded state is the learner's own and is remembered. On small screens
 * `AppShell` renders it inside a slide-over sheet, always expanded, and passes
 * `onNavigate` so choosing a destination closes the sheet.
 *
 * IT DOES NOT SCROLL
 * ------------------
 * A navigation rail that scrolls hides destinations, which is the one thing it
 * exists not to do. Everything is sized so all ten destinations, the settings
 * row and the way back to the site fit at a laptop's height; the scene at the
 * foot is decoration, so it appears only when there is room for it. The nav
 * keeps `overflow-y-auto` as a last resort for very short windows, because a
 * scrollbar is still better than an unreachable link.
 */
export function Sidebar({
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: {
  onNavigate?: () => void;
  /** Icons only. The desktop rail's state; the mobile sheet is never folded. */
  collapsed?: boolean;
  /** Omitted in the mobile sheet, where there is nothing to fold into. */
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="rail-surface relative flex h-full flex-col overflow-hidden">
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {/* -- wordmark ------------------------------------------------- */}
        <Link
          href={site.appHome}
          onClick={onNavigate}
          title={collapsed ? site.name : undefined}
          className={cn(
            "group flex shrink-0 items-center border-b border-rail-line py-4",
            collapsed ? "justify-center px-2" : "gap-2.5 px-5",
          )}
        >
          <Mark />
          <span
            className={cn(
              "si-heading font-display text-lg font-semibold leading-tight text-rail-ink",
              collapsed && "sr-only",
            )}
          >
            {site.name}
          </span>
        </Link>

        {/* -- nav ------------------------------------------------------- */}
        <nav
          aria-label={t.nav.dashboard}
          className={cn(
            "min-h-0 flex-1 overflow-y-auto py-3",
            collapsed ? "px-2" : "px-3",
          )}
        >
          {railGroups.map((group, i) => (
            <div key={group.label} className="mb-3.5 last:mb-0">
              {collapsed ? (
                /* Folded, a group name has nowhere to sit. A rule keeps the
                   grouping visible without pretending a label fits. */
                i > 0 ? (
                  <span
                    aria-hidden
                    className="mx-2 mb-2.5 block h-px bg-rail-line"
                  />
                ) : null
              ) : (
                <p className="si-heading px-3 pb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-rail-ink-faint">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <RailLink
                      item={item}
                      pathname={pathname}
                      collapsed={collapsed}
                      onNavigate={onNavigate}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* -- settings + back to the public site ------------------------ */}
        <div
          className={cn(
            "shrink-0 border-t border-rail-line py-2.5",
            collapsed ? "px-2" : "px-3",
          )}
        >
          <RailLink
            item={railFooterItem}
            pathname={pathname}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />

          <Link
            href="/"
            onClick={onNavigate}
            title={collapsed ? t.nav.backToSite : undefined}
            className={cn(
              "mt-0.5 flex items-center rounded-xl py-1.5 text-rail-ink-faint transition-colors hover:bg-rail-2 hover:text-rail-ink",
              collapsed ? "justify-center px-0" : "gap-3 px-3",
            )}
          >
            <span className="flex w-5 justify-center" aria-hidden>
              &larr;
            </span>
            <span
              className={cn(
                "si-heading block text-[0.82rem] font-medium",
                collapsed && "sr-only",
              )}
            >
              {t.nav.backToSite}
            </span>
          </Link>

          {onToggleCollapse ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapsed ? t.app.railExpand : t.app.railCollapse}
              title={collapsed ? t.app.railExpand : t.app.railCollapse}
              className={cn(
                "mt-0.5 flex w-full items-center rounded-xl py-1.5 text-rail-ink-faint transition-colors hover:bg-rail-2 hover:text-rail-ink",
                collapsed ? "justify-center px-0" : "gap-3 px-3",
              )}
            >
              <span className="flex w-5 justify-center" aria-hidden>
                {collapsed ? (
                  <PanelLeftOpen size={17} strokeWidth={1.9} />
                ) : (
                  <PanelLeftClose size={17} strokeWidth={1.9} />
                )}
              </span>
              {collapsed ? null : (
                <span className="si-heading block text-[0.82rem] font-medium">
                  {t.app.railCollapse}
                </span>
              )}
            </button>
          ) : null}
        </div>

        {/* -- the scene + its line: decoration, so it yields first ------- */}
        <div
          className={cn(
            "relative h-40 shrink-0",
            collapsed ? "hidden" : "hidden [@media(min-height:56rem)]:block",
          )}
        >
          <RailScene className="absolute inset-0 h-full w-full" />
          <figure className="absolute inset-x-0 bottom-0 px-5 pb-5">
            <blockquote className="si-heading font-display text-[0.85rem] leading-relaxed text-rail-ink">
              &ldquo;ධර්මයෙන් විමසීම මනස පහන් කරයි.&rdquo;
            </blockquote>
          </figure>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function RailLink({
  item,
  pathname,
  collapsed = false,
  onNavigate,
}: {
  item: RailItem;
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const reduce = useReducedMotion();
  const Icon = icons[item.icon];

  /**
   * `/dashboard` is the rail's home and must not light up for every route
   * beneath it; every other item owns its subtree, so a lesson keeps Chapters
   * marked while it is being read.
   */
  const active =
    item.href === site.appHome
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex items-center rounded-xl py-1.5 transition-colors",
        collapsed ? "justify-center px-0" : "gap-3 px-3",
        active
          ? "text-rail-ink"
          : "text-rail-ink-dim hover:bg-rail-2 hover:text-rail-ink",
      )}
    >
      {active && (
        <motion.span
          layoutId="rail-active"
          className="absolute inset-0 rounded-xl bg-rail-2 ring-1 ring-rail-line"
          transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
      <span
        aria-hidden
        className={cn(
          "relative flex w-5 justify-center",
          active ? "text-cobalt-400" : "text-current",
        )}
      >
        <Icon size={17} strokeWidth={1.9} />
      </span>
      <span
        className={cn(
          "si-heading relative block min-w-0 text-[0.82rem] font-medium",
          collapsed && "sr-only",
        )}
      >
        {item.label}
      </span>
      {item.soon ? (
        collapsed ? (
          /* The label carries "coming soon" when folded; a dot says the same
             thing in the space a pill cannot fit. */
          <span
            aria-hidden
            className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-rail-ink-faint"
          />
        ) : (
          <span className="relative ml-auto rounded-full bg-rail-line px-1.5 py-0.5 text-[0.55rem] font-medium uppercase tracking-wide text-rail-ink-faint">
            {t.app.comingSoon}
          </span>
        )
      ) : null}
    </Link>
  );
}

/**
 * The mark, shared with the public site's header: three concentric rings
 * around a still centre — consciousness and its factors arising around a
 * single point of knowing.
 */
function Mark() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rail-2 ring-1 ring-rail-line transition-colors group-hover:ring-cobalt-600">
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden focusable="false">
        <circle
          cx="16"
          cy="16"
          r="13"
          fill="none"
          strokeWidth="1"
          className="stroke-cobalt-400/60 transition-all duration-700 group-hover:stroke-cobalt-400"
        />
        <circle
          cx="16"
          cy="16"
          r="8.5"
          fill="none"
          strokeWidth="1"
          className="stroke-jade-400/60 transition-all duration-700 group-hover:stroke-jade-400"
        />
        <circle
          cx="16"
          cy="16"
          r="4"
          fill="none"
          strokeWidth="1"
          className="stroke-lotus-400/70 transition-all duration-700 group-hover:stroke-lotus-400"
        />
        <circle cx="16" cy="16" r="1.6" className="fill-cobalt-300" />
      </svg>
    </span>
  );
}
