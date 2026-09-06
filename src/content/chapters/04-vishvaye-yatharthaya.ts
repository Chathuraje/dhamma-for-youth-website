import type { Chapter } from "@/lib/types";

/**
 * පරිච්ඡේදය 04 — විශ්වයේ යථාර්ථය
 *
 * The course's closing movement. It expands outward — speeds, planes, a
 * billion world-systems — and then collapses the whole search back into a
 * fathom-long body. The reversal is the teaching, and it only works if the
 * expansion is felt first, which is why Rohitassa comes last.
 *
 * Source: the author's study note B, sections 5–7.
 */
export const chapter: Chapter = {
  slug: "vishvaye-yatharthaya",
  number: 4,
  title: "විශ්වයේ යථාර්ථය",
  pali: "lokadhātu",
  subtitle:
    "සියල්ලටම වඩා වේගවත් දෙය, විශ්වයේ විශාලත්වය, සහ අවසානයේ ලෝකයේ කෙළවර හමු වන තැන.",
  summary:
    "ධනුග්ගහ සූත්‍රයේ වේග අනුපිළිවෙල, තල 31 සහ ලෝක ධාතු තුන, සහ රෝහිතස්ස සූත්‍රයෙන් ලෝකයේ කෙළවර පනවන ස්ථානය.",
  status: "published",
  image: "chapters/04-vishvaye-yatharthaya.svg",

  lessons: ["vegaya-saha-vishvaya", "lokaye-kelavara"],

  sources: [
    { label: "සංයුක්ත නිකාය", ref: "ධනුග්ගහ සූත්‍රය" },
    { label: "අංගුත්තර නිකාය", ref: "රෝහිතස්ස සූත්‍රය සහ චූළනිකා සූත්‍රය" },
    { label: "අධ්‍යයන සටහන", ref: "කොටස් 5–7" },
  ],

  updated: "2026-09-04",
};
