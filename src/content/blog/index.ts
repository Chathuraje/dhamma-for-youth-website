import type { Post } from "@/lib/types";

/**
 * BLOG REGISTRY
 * =============
 * Writing that is not part of the course: notes on the project, on studying
 * the Abhidhamma, on why something is built the way it is.
 *
 * A post is data, exactly as a lesson is — the same `Section`/`Block` tree,
 * rendered by the same `BlockRenderer`. Never write JSX in a post file.
 *
 * To add one:
 *   1. Create `src/content/blog/<slug>.ts` exporting a `Post`.
 *   2. Import it here and add it to `posts`.
 *   3. Run `npm run check:content` to validate it.
 *
 * The array is empty on purpose. Nothing is published yet, and the index says
 * so plainly rather than showing filler.
 */
export const posts: Post[] = [];

/* -------------------------------------------------------------------------- */

/** Newest first — the order the index reads in. */
export function allPosts(): Post[] {
  return [...posts].sort((a, b) => b.published.localeCompare(a.published));
}

/** Only posts ready for readers. Drafts stay visible in development. */
export function visiblePosts(): Post[] {
  const isDev = process.env.NODE_ENV === "development";
  return allPosts().filter((p) => isDev || p.status === "published");
}

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Every distinct tag across visible posts, most used first. */
export function postTags(): string[] {
  const counts = new Map<string, number>();
  for (const post of visiblePosts())
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "si"))
    .map(([tag]) => tag);
}
