import type { Chapter } from "@/lib/types";

/**
 * පරිච්ඡේදය 01 — අභිධර්මයට පිවිසුම
 *
 * The orientation chapter: where the Abhidhamma was taught, why it had to be
 * taught there, and how it reached a book on a shelf. It answers the sceptical
 * questions before the analysis begins in chapter 2.
 *
 * Source: the teacher's Modules 2, 3 and 4.
 */
export const chapter: Chapter = {
  slug: "abhidharmayata-pivisuma",
  number: 1,
  title: "අභිධර්මයට පිවිසුම",
  pali: "abhidhamma",
  subtitle:
    "අභිධර්මය යනු කුමක්ද, දේශනා වූයේ කොහේද, ඇයි එහිද, සහ එය අප අතට පත් වූයේ කෙසේද.",
  summary:
    "ත්‍රිපිටකය සහ අභිධර්මයේ ස්ථානය, පළමු දිව්‍ය ලෝක දෙක සහ කාල අනුපාතය, සහ මාස තුනක දේශනාවක් පොතක් බවට පත් වූ ගමන.",
  status: "published",
  image: "chapters/01-abhidharmayata-pivisuma.svg",

  lessons: ["pitaka-thuna", "devlova-kalaya", "abhidharma-gamana"],

  sources: [
    {
      label: "අභිධර්ම දේශනාව (මොඩියුල 02, 03 සහ 04)",
      ref: "විශ්ව න්‍යාය, කාල ගණනය සහ දේශනා සම්ප්‍රේෂණය",
    },
    { label: "අභිධම්මත්ථසංගහ", ref: "පරිච්ඡේද 5 (විථිමුත්ත සංගහ)" },
    { label: "අට්ඨසාලිනී", ref: "ධම්මසංගණී අටුවාව" },
  ],

  updated: "2026-09-04",
};
