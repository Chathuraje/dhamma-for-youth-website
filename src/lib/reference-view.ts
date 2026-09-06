"use client";

import { create } from "zustand";

/**
 * THE REFERENCE OVERLAY
 * =====================
 * Where a `[[ref:slug]]` chip goes when you click it.
 *
 * A reference topic is background the lesson deliberately does not carry, so
 * sending a reader to a full page to read one costs them their place in the
 * lesson — the paragraph they were mid-way through, the section they had open,
 * the scroll position. The overlay hands the same content back without moving
 * anyone. Blog posts, resources and every other link still navigate; those are
 * destinations, not footnotes.
 *
 * `stack` rather than a single slug, because a reference topic can name
 * another one. Following that link pushes; the header offers the way back.
 *
 * `at` is the pathname the overlay was opened on. Client navigation keeps this
 * store alive, so without it a popup raised on a lesson would still be sitting
 * there over the glossary page the reader had just clicked through to.
 *
 * Nothing here is persisted. This is where the reader is looking, not what
 * they have learnt — that lives in `progress.ts`.
 */
interface ReferenceViewState {
  /** Oldest first. The last entry is what is on screen. */
  stack: string[];
  at: string | null;
  open: (slug: string, at: string) => void;
  back: () => void;
  close: () => void;
}

export const useReferenceView = create<ReferenceViewState>()((set) => ({
  stack: [],
  at: null,

  open: (slug, at) =>
    set((s) =>
      s.stack[s.stack.length - 1] === slug
        ? s
        : { stack: [...s.stack, slug], at },
    ),

  back: () =>
    set((s) => {
      const stack = s.stack.slice(0, -1);
      return { stack, at: stack.length ? s.at : null };
    }),

  close: () => set({ stack: [], at: null }),
}));
