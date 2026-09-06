import Link from "next/link";
import { Home } from "lucide-react";

import { site } from "@/lib/site";
import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * The trail above a chapter or lesson, and the strip that carries the page's
 * own actions (bookmark, study mode) on the right.
 *
 * A crumb without an `href` is the current page and renders as text with
 * `aria-current`, not as a link back to where the reader already is.
 */
export function Breadcrumbs({
  crumbs,
  actions,
  className,
}: {
  crumbs: Crumb[];
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-2",
        className,
      )}
    >
      <nav aria-label={t.nav.breadcrumb} className="min-w-0">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <li className="flex items-center">
            <Link
              href={site.appHome}
              aria-label={t.nav.home}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <Home size={15} aria-hidden />
            </Link>
          </li>
          {crumbs.map((crumb, i) => (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
              <span aria-hidden className="text-ink-faint/60">
                /
              </span>
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="si-heading truncate text-ink-dim transition-colors hover:text-cobalt-600"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current="page"
                  className="si-heading truncate font-medium text-ink"
                >
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
