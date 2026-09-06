import type { ReferenceTopic } from "@/lib/types";

/**
 * REFERENCE — තල 31 සහ ලෝක ධාතු
 *
 * Moved out of the Dhanuggaha lesson. That lesson's teaching is anicca — the
 * speed at which a life is spent — and the catalogue of planes was crowding
 * it out. The lesson now names this topic and moves on.
 */
export const topic: ReferenceTopic = {
  slug: "loka-dhatu",
  title: "තල 31 සහ ලෝක ධාතු",
  pali: "lokadhātu",
  summary:
    "එක් ලෝක ධාතුවක තල 31, සහ සහස්සී–ද්විසහස්සී–තිසහස්සී යන පරිමාණ තුන.",
  category: "විශ්ව විද්‍යාව",
  status: "published",
  see: ["kamavachara-loka", "sadivya-loka"],

  sections: [
    {
      id: "thala-31",
      title: "තල 31",
      blocks: [
        {
          type: "prose",
          variant: "lead",
          text: "**ලෝක ධාතුවක්** යනු තල 31කින් සමන්විත පරිසරයකි.",
        },
        {
          type: "taxonomy",
          title: "තල 31",
          total: 31,
          root: [
            {
              id: "apaya",
              label: "සතර අපාය",
              count: 4,
              note: "නිරය, තිරිසන්, ප්‍රේත, අසුර.",
            },
            { id: "manussa", label: "මනුෂ්‍ය ලෝකය", count: 1 },
            {
              id: "kama-deva",
              label: "කාම දිව්‍ය ලෝක",
              count: 6,
              note: "චාතුම්මහාරාජික, තාවතිංස, යාම, තුසිත, නිම්මානරතී, පරනිම්මිතවසවර්තී.",
            },
            { id: "rupa", label: "රූපාවචර බ්‍රහ්ම ලෝක", count: 16 },
            {
              id: "arupa",
              label: "අරූපාවචර බ්‍රහ්ම ලෝක",
              count: 4,
              note: "රූපයක් නැති තල.",
            },
          ],
        },
      ],
    },

    {
      id: "parimana",
      title: "විශ්වයේ පරිමාණ තුන",
      blocks: [
        {
          type: "ladder",
          title: "සහස්සී සිට තිසහස්සී දක්වා",
          rungs: [
            {
              label: "සහස්සී චූළනිකා ලෝක ධාතුව",
              figure: "1,000",
              accent: "jade",
              text: "සූර්යයන්, චන්ද්‍රයන් සහ මනුෂ්‍ය ලෝක **1,000**කින් සමන්විත ක්ෂේත්‍රය.",
            },
            {
              label: "ද්විසහස්සී මජ්ඣිමා ලෝක ධාතුව",
              figure: "10⁶",
              accent: "cobalt",
              text: "සහස්සී ලෝක ධාතු **1,000**ක එකතුව (මනුෂ්‍ය ලෝක **දස ලක්ෂයකි**).",
            },
            {
              label: "තිසහස්සී මහා සහස්සී ලෝක ධාතුව",
              figure: "10⁹",
              accent: "lotus",
              text: "ද්විසහස්සී ලෝක ධාතු **1,000**ක එකතුව (මනුෂ්‍ය ලෝක **කෝටි 100**කි).",
            },
          ],
          conclusion:
            "බුදුරජාණන් වහන්සේ නමකට තමන් වහන්සේගේ ආලෝකය සහ ධර්ම ශබ්දය මෙම **තිසහස්සී මහා සහස්සී** ලෝක ධාතුව පුරාම **එක මොහොතකින්** විහිදුවිය හැක.",
        },
        {
          type: "callout",
          tone: "neutral",
          text: "'සක්වළක්' යනුවෙන් හැඳින්වෙන්නේ මෙයින් එකකි. අභිධර්ම දේශනාවට **දසදහසක් සක්වළින්** දෙවි-බඹුන් රැස් වූ බව කියන්නේ එබැවිනි.",
        },
      ],
    },
  ],

  sources: [
    { label: "අංගුත්තර නිකාය", ref: "චූළනිකා සූත්‍රය" },
    { label: "අධ්‍යයන සටහන", ref: "කොටස 6" },
  ],

  updated: "2026-09-04",
};
