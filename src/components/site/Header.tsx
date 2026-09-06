"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { site } from "@/lib/site";
import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./Theme";

/**
 * The public site's header.
 *
 * Its job is to get someone to the one place that matters. The nav is the
 * short list of pages about the project; the solid button is the door into the
 * course, and it is the only filled element in the bar for exactly that reason.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  /**
   * The mobile menu stores the path it was opened on rather than a boolean,
   * so navigating anywhere closes it for free - no effect syncing state to
   * the router.
   */
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const setOpen = (next: boolean) => setOpenedAt(next ? pathname : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-line bg-canvas/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label={`${site.name} — ${t.nav.home}`}
        >
          <Mark />
          <span className="si-heading font-display text-[1.05rem] font-semibold leading-tight text-ink">
            {site.name}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label={t.nav.mainNav}
        >
          {site.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 transition-colors",
                  active ? "text-ink" : "text-ink-dim hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-surface-2"
                    transition={{
                      duration: reduce ? 0 : 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                )}
                <span className="si-heading block relative text-sm leading-none">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <span className="mx-2 h-5 w-px bg-line" />
          <ThemeToggle />

          <Link
            href={site.appHome}
            className="ml-2 inline-flex items-center gap-2 rounded-full bg-cobalt-500 px-4 py-2 text-on-brand transition-all duration-200 hover:bg-cobalt-600 hover:shadow-glow-cobalt active:scale-[0.98]"
          >
            <span className="si-heading block text-sm font-medium leading-none">
              {t.nav.openDashboard}
            </span>
            <ArrowRight size={15} aria-hidden />
          </Link>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Link
            href={site.appHome}
            className="si-heading rounded-full bg-cobalt-500 px-3.5 py-2 text-sm font-medium text-on-brand"
          >
            {t.nav.openDashboard}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-dim hover:bg-surface-2 hover:text-ink"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label={t.nav.mainNav}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-line bg-canvas/95 backdrop-blur-xl md:hidden"
          >
            <ul className="px-5 py-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-2.5 text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink"
                  >
                    <span className="si-heading block text-[0.97rem]">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/**
 * The mark: three concentric rings around a still centre - consciousness and
 * its factors arising around a single point of knowing. It breathes slowly on
 * hover and holds still for anyone who has asked for reduced motion.
 */
function Mark() {
  return (
    <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-cobalt-100 ring-1 ring-cobalt-500/20">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <circle
          cx="16"
          cy="16"
          r="13"
          fill="none"
          strokeWidth="1"
          className="stroke-cobalt-500/45 transition-all duration-700 group-hover:stroke-cobalt-500/80"
        />
        <circle
          cx="16"
          cy="16"
          r="8.5"
          fill="none"
          strokeWidth="1"
          className="stroke-jade-500/45 transition-all duration-700 group-hover:stroke-jade-500/85"
        />
        <circle
          cx="16"
          cy="16"
          r="4"
          fill="none"
          strokeWidth="1"
          className="stroke-gold-500/55 transition-all duration-700 group-hover:stroke-gold-500/90"
        />
        <circle cx="16" cy="16" r="1.6" className="fill-cobalt-600" />
      </svg>
    </span>
  );
}
