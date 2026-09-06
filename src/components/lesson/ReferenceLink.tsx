"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useReferenceView } from "@/lib/reference-view";

/**
 * The one way a reference topic is opened.
 *
 * A real `<a href="/reference/…">` whose plain left click is intercepted: the
 * topic rises in the overlay instead of taking the reader off the page they
 * were on. Background material is a footnote, and a footnote should not cost
 * anyone their place.
 *
 * It stays an anchor rather than becoming a button for three reasons that all
 * matter: ⌘/Ctrl/middle click still opens the real page in a new tab, the URL
 * is still there to copy, and with JavaScript off the link simply navigates.
 * Modified clicks are handed straight back to the browser.
 *
 * This is for reference topics only. Posts, resources and external links are
 * destinations, and destinations navigate.
 */
export function ReferenceLink({
  slug,
  className,
  children,
  ...rest
}: {
  slug: string;
  className?: string;
  children: ReactNode;
  "aria-describedby"?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const pathname = usePathname();
  const openReference = useReferenceView((s) => s.open);

  return (
    <Link
      href={`/reference/${slug}`}
      // Most of these never navigate, so there is nothing worth prefetching.
      prefetch={false}
      aria-haspopup="dialog"
      className={className}
      onClick={(e) => {
        // A modified click is a deliberate "open this somewhere else".
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        openReference(slug, pathname);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
