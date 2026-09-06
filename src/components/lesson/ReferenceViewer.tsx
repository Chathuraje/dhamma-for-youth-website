"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useReferenceView } from "@/lib/reference-view";

/**
 * The single mount point for the reference overlay.
 *
 * It lives in the root layout rather than in either route group, because
 * `[[ref:slug]]` is a rich-text construct and rich text is rendered in both —
 * lessons and chapters in the app, posts on the site.
 *
 * Nothing loads until a chip is clicked: the dialog pulls in the whole block
 * library, and most readers never open a reference at all.
 */
const ReferenceDialog = dynamic(
  () => import("./ReferenceDialog").then((m) => m.ReferenceDialog),
  { ssr: false },
);

export function ReferenceViewer() {
  const pathname = usePathname();
  const openAt = useReferenceView((s) => s.at);
  const depth = useReferenceView((s) => s.stack.length);
  const close = useReferenceView((s) => s.close);

  /**
   * Client navigation does not unmount this store, so a link followed from
   * inside the overlay (a glossary entry, the full topic page) would otherwise
   * leave the popup sitting over its own destination.
   */
  useEffect(() => {
    if (openAt !== null && openAt !== pathname) close();
  }, [openAt, pathname, close]);

  if (depth === 0) return null;
  return <ReferenceDialog />;
}
