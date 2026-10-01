import type { ParamatthaTableBlock } from "@/lib/types";

/**
 * THE 82 ULTIMATE REALITIES — one definition, read from several places.
 *
 * This lived inline in පාඩම 2.1, which meant the map of the whole course
 * existed only inside one lesson: a learner who wanted to ask "where does
 * ඕජා get taught?" had to remember which lesson carried the table.
 *
 * It is now content in its own right. `/paramattha` renders it as the course's
 * index of ultimate realities, independently of the lesson in which the 82
 * are first introduced.
 *
 * `unlockedBy` is the lesson that opens the cell — it drives both the unlock
 * state and the "taught in" link. `term` is the glossary entry, where one
 * exists. A cell with neither is a placeholder for something not yet written.
 */
export const paramatthaGroups: NonNullable<ParamatthaTableBlock["groups"]> = [
  {
    id: "citta",
    label: "සිත",
    pali: "citta",
    count: 1,
    accent: "cobalt",
    cells: [
      {
        id: "citta-1",
        label: "සිත",
        pali: "citta",
        term: "citta",
        unlockedBy: "sammuti-paramattha",
        note: "අරමුණක් හුදෙක් දැනගැනීම. සිත් 89ක් ලෙස (විස්තරාත්මකව 121ක් ලෙස) වර්ග කළද, පරමාර්ථ ධර්මයක් ලෙස එය එකකි.",
      },
    ],
  },
  {
    id: "cetasika",
    label: "චෛතසික",
    pali: "cetasika",
    count: 52,
    accent: "jade",
    cells: [],
  },
  {
    id: "rupa",
    label: "රූප",
    pali: "rūpa",
    count: 28,
    accent: "lotus",
    cells: [
      {
        id: "pathavi",
        label: "පඨවි",
        pali: "pathavī",
        term: "pathavi",
        unlockedBy: "suddhashtakaya",
        note: "තද හෝ මෘදු ගතිය.",
      },
      {
        id: "apo",
        label: "ආපෝ",
        pali: "āpo",
        term: "apo",
        unlockedBy: "suddhashtakaya",
        note: "ගලන හෝ බැඳ තබන ගතිය.",
      },
      {
        id: "tejo",
        label: "තේජෝ",
        pali: "tejo",
        term: "tejo",
        unlockedBy: "suddhashtakaya",
        note: "උණුසුම් හෝ ශීතල ගතිය.",
      },
      {
        id: "vayo",
        label: "වායෝ",
        pali: "vāyo",
        term: "vayo",
        unlockedBy: "suddhashtakaya",
        note: "සෙලවෙන, තල්ලු කරන ගතිය.",
      },
      {
        id: "vanna",
        label: "වර්ණ",
        pali: "vaṇṇa",
        term: "vanna",
        unlockedBy: "suddhashtakaya",
        note: "ඇසට ගෝචර වන පාට.",
      },
      {
        id: "gandha",
        label: "ගන්ධ",
        pali: "gandha",
        term: "gandha",
        unlockedBy: "suddhashtakaya",
        note: "නාසයට ගෝචර වන සුවඳ.",
      },
      {
        id: "rasa",
        label: "රස",
        pali: "rasa",
        term: "rasa",
        unlockedBy: "suddhashtakaya",
        note: "දිවට ගෝචර වන රසය.",
      },
      {
        id: "oja",
        label: "ඕජා",
        pali: "ojā",
        term: "oja",
        unlockedBy: "suddhashtakaya",
        note: "පෝෂණ ගුණය.",
      },
      {
        id: "akasa",
        label: "අවකාශ",
        pali: "ākāsa",
        term: "parichchheda",
        unlockedBy: "pariccheda-avakasaya",
        note: "පරිච්ඡේද අවකාශය (ශුද්ධාෂ්ටක වෙන් කර තබන හිඩැස).",
      },
    ],
  },
  {
    id: "nibbana",
    label: "නිර්වාණය",
    pali: "nibbāna",
    count: 1,
    accent: "rose",
    cells: [
      {
        id: "nibbana-1",
        label: "නිර්වාණය",
        pali: "nibbāna",
        term: "nibbana",
        unlockedBy: "sammuti-paramattha",
        note: "හේතු ප්‍රත්‍යයෙන් නොහටගන්නා එකම පරමාර්ථ ධර්මය.",
      },
    ],
  },
];

/** Every named cell, flattened — the index page and the validator both walk it. */
export const namedParamatthas = paramatthaGroups.flatMap((group) =>
  group.cells.map((cell) => ({ ...cell, group })),
);

/** 82. Derived, so it cannot drift from the groups above. */
export const paramatthaTotal = paramatthaGroups.reduce(
  (n, g) => n + g.count,
  0,
);
