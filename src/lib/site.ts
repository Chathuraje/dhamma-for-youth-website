import { t } from "./strings";

/**
 * BRAND + SITE CONFIG
 * Everything user-facing about the project's identity lives here so it can be
 * renamed in one edit. Nothing else should hardcode the site name.
 */

export const site = {
  name: "අභිධර්ම මාවත",
  shortName: "මාවත",
  tagline: "සිතේ සිතියම, පාඩමෙන් පාඩම.",
  description:
    "අභිධර්මය පිළිබඳ අන්තර්ක්‍රියාකාරී පාඨමාලාවක්. පරමාර්ථ ධර්ම, ශුද්ධාෂ්ටකය සහ විශ්ව සත්‍යතාව සජීවී රූප සටහන් හා අත්හදා බැලීම් හරහා ඉගෙන ගන්න.",
  /** Set to your production origin before launch - used for metadata + OG. */
  url: "https://abhidhamma-atlas.example",
  locale: "si",

  /** Where a learner lands when they open the app. */
  appHome: "/dashboard",

  /**
   * Reach the maintainers. There is no contact form on purpose — a form posts
   * a visitor's words to somebody's server, and this site's whole claim is
   * that it sends nothing anywhere. Change the address, not the mechanism.
   */
  contactEmail: "hello@abhidhamma-atlas.example",

  /**
   * THE PUBLIC SITE.
   * What someone who has not started the course needs: what this is, who made
   * it, how to reach them, and anything written outside the course.
   */
  nav: [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/blog", label: t.nav.blog },
    { href: "/contact", label: t.nav.contact },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  The learning app's rail                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Icon names are strings rather than components so this module stays free of
 * JSX and can be imported by server components, metadata and the validator.
 * `Sidebar` maps a name to its lucide icon; adding a name that is not in that
 * map is a type error, not a blank square.
 */
export type RailIcon =
  | "home"
  | "chapters"
  | "practice"
  | "progress"
  | "notes"
  | "bookmarks"
  | "reference"
  | "glossary"
  | "resources"
  | "community"
  | "settings";

export interface RailItem {
  href: string;
  label: string;
  icon: RailIcon;
  /** Marked in the rail and honest about it on the page itself. */
  soon?: boolean;
}

export interface RailGroup {
  label: string;
  items: readonly RailItem[];
}

/**
 * Lessons are still reached through their chapter — the rail names chapters,
 * never a flat list of every lesson. Two tables of contents read as two
 * different courses.
 */
export const railGroups: readonly RailGroup[] = [
  {
    label: t.app.groupCourse,
    items: [
      { href: "/dashboard", label: t.nav.home, icon: "home" },
      {
        href: "/chapters",
        label: t.nav.chapters,
        icon: "chapters",
      },
      {
        href: "/practice",
        label: t.app.practice,
        icon: "practice",
      },
    ],
  },
  {
    label: t.app.groupMine,
    items: [
      {
        href: "/my-learning",
        label: t.app.myLearning,
        icon: "progress",
      },
      { href: "/notes", label: t.app.notes, icon: "notes" },
      {
        href: "/bookmarks",
        label: t.app.bookmarks,
        icon: "bookmarks",
      },
    ],
  },
  {
    label: t.app.groupLibrary,
    items: [
      {
        href: "/reference",
        label: t.nav.reference,
        icon: "reference",
      },
      {
        href: "/glossary",
        label: t.nav.glossary,
        icon: "glossary",
      },
      {
        href: "/resources",
        label: t.app.resources,
        icon: "resources",
        soon: true,
      },
      {
        href: "/community",
        label: t.app.community,
        icon: "community",
        soon: true,
      },
    ],
  },
] as const;

/** Sits below the groups, separated — it configures the app rather than teaching. */
export const railFooterItem: RailItem = {
  href: "/settings",
  label: t.app.settings,
  icon: "settings",
};

/** Every rail destination, flattened — used by search and the active-route test. */
export const railItems: readonly RailItem[] = [
  ...railGroups.flatMap((g) => g.items),
  railFooterItem,
];

/* -------------------------------------------------------------------------- */

/** Human labels for difficulty tiers. */
export const difficultyMeta = {
  foundation: {
    label: t.difficulty.foundation,
    hint: t.difficulty.foundationHint,
    accent: "jade",
  },
  intermediate: {
    label: t.difficulty.intermediate,
    hint: t.difficulty.intermediateHint,
    accent: "cobalt",
  },
  deep: {
    label: t.difficulty.deep,
    hint: t.difficulty.deepHint,
    accent: "lotus",
  },
} as const;
