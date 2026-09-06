import type { Lesson } from "@/lib/types";

/**
 * පාඩම 12 — වේගය සහ විශ්වයේ විශාලත්වය
 *
 * Source: the author's notes — study note B sections 5–6.
 *
 * Two `ladder` blocks, and they are doing the same job in two directions:
 * the Dhanuggaha Sutta escalates speed until the learner runs out of scale,
 * then the world-systems escalate size until the same thing happens. The
 * sutta's punchline lands only because the earlier rungs already felt like
 * the limit.
 */
export const lesson: Lesson = {
  slug: "vegaya-saha-vishvaya",
  number: 12,
  title: "වේගය සහ ආයුෂය",
  pali: "dhanuggaha sutta",
  subtitle: "සියල්ලටම වඩා වේගවත් දෙය කුමක්ද?",
  summary:
    "ධනුග්ගහ සූත්‍රයේ වේග අනුපිළිවෙල (ඊතලයේ සිට ආයු සංස්කාර දක්වා).",

  status: "published",
  difficulty: "intermediate",
  durationMin: 12,
  tags: ["විශ්ව විද්‍යාව", "සූත්‍ර"],
  prerequisites: ["ghana-vinivida"],

  objectives: [
    "ධනුග්ගහ සූත්‍රයේ වේග අනුපිළිවෙල කීමට",
    "සූත්‍රයේ අරමුණ තාරකා විද්‍යාව නොව අනිත්‍යතාව බව පැහැදිලි කිරීමට",
  ],

  keyTerms: ["anicca"],

  sections: [
    /* ------------------------------------------------------------------ */
    {
      id: "dhanuggaha",
      title: "ධනුග්ගහ සූත්‍රය",
      brief: "වේග අනුපිළිවෙල",
      blocks: [
        {
          type: "prose",
          variant: "lead",
          text: "බුදුරජාණන් වහන්සේ වේගයන් පිළිබඳව අනුපිළිවෙල සංසන්දනයක් වදාළහ. එක් එක් රුඟ විවෘත කර, අවසානය දක්වා යන්න.",
        },
        {
          type: "ladder",
          title: "වඩාත් වේගවත් දෙය කුමක්ද?",
          rungs: [
            {
              label: "අතිධාවන ශූරයා",
              accent: "jade",
              text: "සිව් දිශාවට එකවර විදින **බලවත් ඊතල 4ක්** පොළොවට පතිත වීමට පෙර අල්ලාගන්නා මිනිසාගේ වේගය.",
            },
            {
              label: "මහ පොළොව",
              accent: "jade",
              text: "ඊට වඩා **මහ පොළොව කැරකෙන / ගමන් කරන වේගය** වැඩිය.",
            },
            {
              label: "හඳ",
              accent: "cobalt",
              text: "ඊට වඩා **හඳ කැරකෙන වේගය** සහ සඳට අධිගෘහිත දෙවියාගේ වේගය වැඩිය.",
            },
            {
              label: "ඉර",
              accent: "cobalt",
              text: "ඊට වඩා **ඉර ගමන් කරන වේගය** සහ ඉරුදෙව් පුතුගේ වේගය වැඩිය.",
            },
            {
              label: "ආයු සංස්කාර",
              accent: "lotus",
              text: "මේ සියල්ලටම වඩා **මිනිසාගේ ආයු සංස්කාර ගෙවී යන වේගය** අතිශයින්ම ශීඝ්‍ර වේ.",
            },
          ],
          conclusion:
            "සූත්‍රයේ අරමුණ තාරකා විද්‍යාව නොවේ. පෙර රුඟ හතර ඇත්තේ අවසාන එක **දැනෙන්නට** සැලැස්වීමටයි (ඔබේ ආයුෂ ගෙවී යන්නේ ඉරටත් වඩා වේගයෙනි).",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "arthaya",
      title: "සූත්‍රයේ අර්ථය",
      brief: "අනිත්‍යතාව",
      blocks: [
        {
          type: "prose",
          text: "පෙර රුඟ හතර ඇත්තේ **පරිමාණය සකස් කිරීමට** පමණි. ඊතල අල්ලන මිනිසාගේ වේගය පුදුමයි; පොළොව ඊට වඩා; හඳ ඊට වඩා; ඉර ඊට වඩා. එවිට අවසාන වාක්‍යය පැමිණේ.",
        },
        {
          type: "keyIdea",
          text: "ඔබේ ආයුෂ ගෙවී යන්නේ **ඉරටත් වඩා වේගයෙනි**. මෙය තාරකා විද්‍යාවක් නොව [[pali:anicca]] පිළිබඳ දේශනාවකි.",
        },
        {
          type: "callout",
          tone: "insight",
          text: "පසුගිය පාඩම්වලින් ඔබ දන්නා දෙයට මෙය ගැළපේ: ඇසිපිය හෙළන මොහොතක සිත් **10¹²** වාරයක් ඉපිද නිරුද්ධ වේ. ආයුෂ ගෙවෙන්නේ එම වේගයෙනි.",
        },
        {
          type: "callout",
          tone: "neutral",
          text: "සූත්‍රයේ එන පොළොව, හඳ සහ ඉර යන ලෝකවල පරිමාණය ගැන දැනගැනීමට [[ref:loka-dhatu]] බලන්න.",
        },
        {
          type: "summary",
          points: [
            "ධනුග්ගහ සූත්‍රය: ඊතල → පොළොව → හඳ → ඉර → **ආයු සංස්කාර**.",
            "පෙර පියවර ඇත්තේ අවසාන එක දැනෙන්නට සැලැස්වීමටයි.",
            "ලෝකවල පරිමාණය: [[ref:loka-dhatu]].",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /* ------------------------------------------------------------------ */
  ],

  sources: [
    { label: "සංයුක්ත නිකාය", ref: "ධනුග්ගහ සූත්‍රය" },
    { label: "අංගුත්තර නිකාය", ref: "චූළනිකා සූත්‍රය" },
    { label: "අධ්‍යයන සටහන", ref: "කොටස් 5–6" },
  ],

  updated: "2026-09-04",
};
