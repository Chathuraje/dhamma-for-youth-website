import type { ReferenceTopic } from "@/lib/types";

/**
 * REFERENCE — කාමාවචර ලෝක සහ භවචක්‍රය
 *
 * The umbrella topic. Lessons link here when they need "the realms" as a
 * whole; the individual realms have their own topics so a lesson can link
 * precisely without dragging in the rest.
 */
export const topic: ReferenceTopic = {
  slug: "kamavachara-loka",
  title: "කාමාවචර ලෝක සහ භවචක්‍රය",
  pali: "kāmāvacara",
  summary:
    "පංච කාම ගුණය මූලික කරගත් ලෝක, ඒවා බෙදෙන ප්‍රධාන භූමි දෙක, සහ භවචක්‍රය.",
  category: "විශ්ව විද්‍යාව",
  status: "published",
  see: ["sadivya-loka", "asura-loka", "manushya-loka", "thirisan-loka", "pretha-loka", "niraya"],

  sections: [
    {
      id: "handunveema",
      title: "කාමාවචර ලෝක යනු කුමක්ද?",
      blocks: [
        {
          type: "prose",
          variant: "lead",
          text: "පංච කාම ගුණයන් (**රූප, ශබ්ද, ගන්ධ, රස, ස්පර්ශ**) මූලික කරගත්, සත්ත්වයන් කුසල් හා අකුසල් කර්ම රැස් කරමින් නැවත නැවතත් උත්පත්තිය ලබන ලෝක **කාමාවචර ලෝක** ලෙස හැඳින්වේ.",
        },
        {
          type: "comparison",
          columns: [
            {
              title: "කාම සුගති භූමි",
              tone: "insight",
              points: [
                "කුසල කර්මවල විපාක වශයෙන් සැප සම්පත් විඳීමට ලැබෙන උසස් ස්ථාන",
                "මනුෂ්‍ය ලෝකය සහ සදිව්‍ය ලෝකය",
              ],
            },
            {
              title: "කාම දුගති භූමි (සතර අපාය)",
              tone: "caution",
              points: [
                "අකුසල කර්මවල විපාක වශයෙන් අධික දුක් වේදනා විඳීමට සිදුවන පහත් ස්ථාන",
                "නිරය, තිරිසන්, ප්‍රේත, අසුර",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "sampradaya",
      title: "සම්ප්‍රදායික වෙනස්කම්",
      blocks: [
        {
          type: "comparison",
          columns: [
            {
              title: "ටිබෙට් සහ මහායාන",
              tone: "neutral",
              points: [
                "ප්‍රධාන භව හෝ ලෝක **6**ක් පිළිගනී",
                "දේව, අසුර, මනුෂ්‍ය, තිරිසන්, ප්‍රේත, නිරය",
              ],
            },
            {
              title: "ථේරවාද",
              tone: "tradition",
              points: [
                "අසුරයන් වෙනම ලෝකයක් ලෙස නොසලකයි",
                "සතර අපායට අයත් කොටසක් ලෙස හෝ වෙනත් භවයන් හා සම්බන්ධ කොට සලකයි",
                "එබැවින් ප්‍රධාන ලෝක / ගති **5**ක් ලෙස වර්ගීකරණය කෙරේ",
              ],
            },
          ],
        },
        {
          type: "callout",
          tone: "tradition",
          text: "මෙම පාඨමාලාව ථේරවාද වර්ගීකරණය අනුව යයි. එහෙත් භවචක්‍ර චිත්‍රවල මහායාන ක්‍රමය බහුලව දක්නට ලැබෙන බැවින් වෙනස දැනගැනීම ප්‍රයෝජනවත් වේ.",
        },
      ],
    },

    {
      id: "bhavachakraya",
      title: "භවචක්‍රය",
      blocks: [
        {
          type: "prose",
          text: "කෙළවරක් නොමැති දීර්ඝ සංසාර ගමන සහ සත්ත්වයා විවිධ භවයන්හි සැරිසරන ආකාරය පැහැදිලි කරන **චිත්‍රමය ඉගැන්වීම් මෙවලමකි**.",
        },
        {
          type: "list",
          style: "bullet",
          items: [
            {
              text: "ඉහළින්ම **දේව ලෝකය**; දක්ෂිණාවර්තව පිළිවෙළින් **අසුර, ප්‍රේත, නිරය, තිරිසන් සහ මනුෂ්‍ය** ලෝක සිතුවම් කර ඇත.",
            },
            {
              text: "සෑම භවයකම **බුදුරජාණන් වහන්සේ වැඩ සිටිනු** නිරූපණය කර ඇත්තේ සෑම භවයකදීම ධර්මයේ පිහිට සෙවීමේ හැකියාව සංකේතවත් කිරීමටයි.",
            },
          ],
        },
      ],
    },
  ],

  sources: [
    { label: "අධ්‍යයන සටහන (කාමාවචර ලෝක සහ භව)", ref: "කොටස 1" },
    { label: "අභිධම්මත්ථසංගහ", ref: "පරිච්ඡේද 5 (විථිමුත්ත සංගහ)" },
  ],

  updated: "2026-09-04",
};
