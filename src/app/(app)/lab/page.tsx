import type { Metadata } from "next";
import { BlockRenderer } from "@/components/lesson/BlockRenderer";
import { Sources } from "@/components/lesson/Sources";
import { Reveal } from "@/components/motion/Reveal";
import { Container, Eyebrow, Pill } from "@/components/ui";
import type { Block } from "@/lib/types";

export const metadata: Metadata = {
  title: "Component lab",
  description: "Every lesson block type, rendered live.",
  robots: { index: false, follow: false },
};

/**
 * COMPONENT LAB
 * =============
 * Every block type rendered with representative content, so you can see what
 * a block looks like before writing a lesson with it, and so visual
 * regressions are obvious in one scroll.
 *
 * This is NOT a lesson. The content here is illustrative - standard, textbook
 * Abhidhamma used only to make the components legible.
 *
 * When you add a block type, add an example here too.
 */
const DEMOS: Array<{ type: string; note: string; blocks: Block[] }> = [
  {
    type: "prose",
    note: "Body copy. Supports **bold**, *italic*, `code`, links and [[pali:id]] chips.",
    blocks: [
      {
        type: "prose",
        variant: "lead",
        text: "A **lead** paragraph opens a section. Use it once, at the top.",
      },
      {
        type: "prose",
        text: "Default prose carries the argument. Inline terms like [[pali:citta]] and [[pali:cetasika]] become chips — hover one to see the definition without leaving the page. You can also mark a *technical* word or a `literal token`.",
      },
      {
        type: "prose",
        text: "Emphasis nests: **[[pali:rupa]] inside bold** and *[[pali:nibbana]] inside italic* both render as chips, not as literal `[[pali:…]]` text. Same for **a `token`** and *[a link](/glossary)*.",
      },
    ],
  },
  {
    type: "heading",
    note: "Sub-heading inside a section, with optional Pāli.",
    blocks: [{ type: "heading", text: "The four ultimate realities", pali: "cattāro paramatthā" }],
  },
  {
    type: "keyIdea",
    note: "One statement worth remembering. Use sparingly — at most one or two per section.",
    blocks: [
      {
        type: "keyIdea",
        text: "Nothing in the Abhidhamma is a thing. Everything in it is an **event**.",
      },
    ],
  },
  {
    type: "callout",
    note: "Five tones: neutral, insight, caution, tradition, practice.",
    blocks: [
      { type: "callout", tone: "insight", text: "An insight worth pausing on." },
      {
        type: "callout",
        tone: "caution",
        title: "Easy to misread",
        text: "[[pali:vedana]] is *feeling-tone*, not emotion. Emotions are built later, out of many factors.",
      },
      {
        type: "callout",
        tone: "tradition",
        text: "The commentaries add a distinction here that the canonical text leaves implicit.",
      },
      {
        type: "callout",
        tone: "practice",
        text: "Try noticing the pleasant, unpleasant or neutral tone of the very next thing you perceive.",
      },
    ],
  },
  {
    type: "paliTerm",
    note: "Full term card. Pulls everything from the glossary — pass only the id.",
    blocks: [{ type: "paliTerm", term: "suddhatthaka" }],
  },
  {
    type: "quote",
    note: "Canonical or commentarial quotation. Cite precisely.",
    blocks: [
      {
        type: "quote",
        pali: "cittaṃ, bhikkhave, pabhassaraṃ",
        text: "Luminous, monks, is this mind.",
        source: "Aṅguttara Nikāya 1.49",
      },
    ],
  },
  {
    type: "list",
    note: "Three styles: bullet, number, step. Items reveal in sequence.",
    blocks: [
      {
        type: "list",
        style: "number",
        items: [
          { text: "Consciousness", pali: "citta" },
          { text: "Mental factors", pali: "cetasika" },
          { text: "Materiality", pali: "rūpa" },
          { text: "The unconditioned", pali: "nibbāna" },
        ],
      },
    ],
  },
  {
    type: "comparison",
    note: "Two or three columns. Ideal for conventional vs ultimate framings.",
    blocks: [
      {
        type: "comparison",
        columns: [
          {
            title: "Conventional truth",
            pali: "sammuti-sacca",
            tone: "neutral",
            points: [
              "Persons, chariots, countries",
              "True as agreed designation",
              "The language of the suttas",
            ],
          },
          {
            title: "Ultimate truth",
            pali: "paramattha-sacca",
            tone: "insight",
            points: [
              "Cittas, cetasikas, rūpas, nibbāna",
              "True as what is actually found",
              "The language of the Abhidhamma",
            ],
          },
        ],
      },
    ],
  },
  {
    type: "flow",
    note: "Step through an ordered process. Built for the citta-vīthi.",
    blocks: [
      {
        type: "flow",
        title: "A moment of seeing, in outline",
        steps: [
          {
            label: "Life-continuum",
            pali: "bhavaṅga",
            accent: "lotus",
            text: "The mind rests in its passive stream, taking the object it inherited at rebirth.",
          },
          {
            label: "Adverting",
            pali: "āvajjana",
            accent: "cobalt",
            text: "The stream is disturbed and the mind turns toward the new object.",
          },
          {
            label: "Seeing",
            pali: "cakkhu-viññāṇa",
            accent: "cobalt",
            text: "Eye-consciousness arises. Bare seeing — no naming, no judgement yet.",
          },
          {
            label: "Receiving",
            pali: "sampaṭicchana",
            accent: "cobalt",
            text: "The object is received for further processing.",
          },
          {
            label: "Investigating",
            pali: "santīraṇa",
            accent: "cobalt",
            text: "The object is examined.",
          },
          {
            label: "Determining",
            pali: "voṭṭhabbana",
            accent: "cobalt",
            text: "It is determined, and the mind is set for how it will respond.",
          },
          {
            label: "Impulsion",
            pali: "javana",
            accent: "jade",
            text: "Seven moments of full response. **This is the only stage where kamma is made.**",
          },
          {
            label: "Registration",
            pali: "tadārammaṇa",
            accent: "lotus",
            text: "The object registers briefly, then the mind falls back into bhavaṅga.",
          },
        ],
      },
    ],
  },
  {
    type: "taxonomy",
    note: "Expandable classification tree. Counts roll up automatically from the leaves.",
    blocks: [
      {
        type: "taxonomy",
        title: "The seven universal mental factors",
        root: [
          {
            id: "universals",
            label: "Universals",
            pali: "sabbacittasādhāraṇa",
            note: "Present in every single citta without exception.",
            children: [
              { id: "phassa", label: "Contact", pali: "phassa", count: 1 },
              { id: "vedana", label: "Feeling", pali: "vedanā", count: 1 },
              { id: "sanna", label: "Perception", pali: "saññā", count: 1 },
              { id: "cetana", label: "Volition", pali: "cetanā", count: 1 },
              { id: "ekaggata", label: "One-pointedness", pali: "ekaggatā", count: 1 },
              { id: "jivitindriya", label: "Life faculty", pali: "jīvitindriya", count: 1 },
              { id: "manasikara", label: "Attention", pali: "manasikāra", count: 1 },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "quiz",
    note: "Comprehension check. The explanation is the payload.",
    blocks: [
      {
        type: "quiz",
        question: "At which stage of a cognitive process is kamma actually made?",
        options: [
          { text: "Adverting" },
          { text: "Seeing" },
          { text: "Impulsion — javana", correct: true },
          { text: "Registration" },
        ],
        explanation:
          "Only the javana moments are [[pali:kusala]] or [[pali:akusala]]. Every other stage is resultant or merely functional, so no kamma is generated there.",
      },
    ],
  },
  {
    type: "sortGame",
    note: "Tap an item, tap its category. Keyboard and touch friendly.",
    blocks: [
      {
        type: "sortGame",
        prompt: "Which of these are ultimate realities, and which are concepts?",
        buckets: [
          { id: "ultimate", label: "Ultimate", pali: "paramattha" },
          { id: "concept", label: "Concept", pali: "paññatti" },
        ],
        items: [
          { id: "1", label: "Feeling", bucketId: "ultimate" },
          { id: "2", label: "A chariot", bucketId: "concept", hint: "A designation for parts arranged a certain way." },
          { id: "3", label: "Contact", bucketId: "ultimate" },
          { id: "4", label: "Tuesday", bucketId: "concept", hint: "Time as a division is designated, not found." },
          { id: "5", label: "Temperature", bucketId: "ultimate", hint: "The fire element is a primary materiality." },
          { id: "6", label: "A person", bucketId: "concept" },
        ],
      },
    ],
  },
  {
    type: "reflect",
    note: "Open prompt. Saved to the learner's device only.",
    blocks: [
      {
        type: "reflect",
        prompt: "Catch one moment today where you can tell [[pali:vedana]] apart from the liking or disliking that follows it. What did you notice?",
      },
    ],
  },
  {
    type: "table",
    note: "Dense reference data. Scrolls horizontally on small screens.",
    blocks: [
      {
        type: "table",
        caption: "The four ways a citta can relate to kamma.",
        headers: ["Class", "Pāli", "Makes kamma?"],
        rows: [
          ["Wholesome", "kusala", "Yes"],
          ["Unwholesome", "akusala", "Yes"],
          ["Resultant", "vipāka", "No — it *is* the result"],
          ["Functional", "kiriya", "No"],
        ],
      },
    ],
  },
  {
    type: "summary",
    note: "End-of-section recap.",
    blocks: [
      {
        type: "summary",
        points: [
          "Abhidhamma analyses experience into events, not things.",
          "Four ultimate realities: [[pali:citta]], [[pali:cetasika]], [[pali:rupa]], [[pali:nibbana]].",
          "Everything else is [[pali:pannatti]] — useful, but not found.",
        ],
      },
    ],
  },
  {
    type: "figure",
    note: "An authored image. `src` omits the language suffix — `…-si.png` and `…-en.png` sit side by side, see public/images/README.md. `alt`, `width` and `height` are required.",
    blocks: [
      {
        type: "figure",
        src: "lab/figure-sample.svg",
        alt: "A dashed placeholder frame naming the file it was loaded from.",
        width: 800,
        height: 360,
        caption:
          "The caption is authored text and takes **rich markup**. `size: \"wide\"` breaks the figure out of the reading column.",
      },
    ],
  },
  {
    type: "plates",
    note: "A deck of finished plates, stepped one at a time. For illustrations that arrive whole — own title, own labels, own place in a sequence — where the frame's only jobs are keeping the order and keeping one on screen. Portrait plates are the case it was built for: seven 4:5 illustrations as separate figures is a section nobody scrolls to the end of. Framed as paper in both themes, since light-ground artwork would punch a hole in the dark one.",
    blocks: [
      {
        type: "plates",
        title: "ලී මේසය බිඳ බැලීම",
        width: 1122,
        height: 1402,
        plates: [
          {
            src: "lessons/sammuti-paramattha/table/01.png",
            alt: "ලී මේසයක් ඔහුගේ කොටස් දක්වේ සටහනක්.",
            caption: "The plate carries its own title; the caption is for what it cannot say.",
          },
          {
            src: "lessons/sammuti-paramattha/table/02.png",
            alt: "මේස මතුපිට කොටස් දක්වේ සටහනක්.",
          },
        ],
      },
    ],
  },
  {
    type: "structure",
    note: "How a whole divides. Static partition diagram — nothing opens. Use `taxonomy` instead when counts have to add up.",
    blocks: [
      {
        type: "structure",
        title: "How experience divides",
        root: {
          id: "experience",
          label: "Experience",
          accent: "neutral",
          note: "Everything there is to analyse.",
          children: [
            {
              id: "nama",
              label: "Mind",
              pali: "nāma",
              accent: "jade",
              note: "Divides again.",
              children: [
                { id: "citta", label: "Consciousness", pali: "citta", accent: "jade" },
                { id: "cetasika", label: "Mental factors", pali: "cetasika", accent: "lotus" },
              ],
            },
            {
              id: "rupa",
              label: "Matter",
              pali: "rūpa",
              accent: "cobalt",
              note: "Twenty-eight, and it does not divide further here.",
            },
          ],
        },
        caption: "The caption carries what the diagram cannot say in a label.",
      },
    ],
  },
  {
    type: "derivation",
    note: "Arithmetic shown whole, so a learner can check a figure rather than accept it. Every step on screen at once.",
    blocks: [
      {
        type: "derivation",
        title: "How the figure is reached",
        given: [
          { label: "Moments per flash", value: "17" },
          { label: "Flashes counted", value: "1,000" },
        ],
        steps: [
          {
            label: "Total moments",
            expression: "17 × 1,000",
            result: "17,000",
            note: "The note explains what the number **means**, not what it is.",
          },
          { label: "Halved", expression: "17,000 ÷ 2", result: "8,500" },
        ],
        conclusion: {
          value: "8,500",
          text: "The conclusion gets the weight of an answer, because it is one.",
        },
      },
    ],
  },
  {
    type: "timeline",
    note: "A history, read as one line. Use `flow` instead when stepping through the sequence is itself the teaching.",
    blocks: [
      {
        type: "timeline",
        title: "A transmission",
        events: [
          {
            label: "Spoken",
            when: "year 7",
            accent: "lotus",
            milestone: true,
            text: "A `milestone` event gets a heavier node and a coloured heading.",
          },
          {
            label: "Memorised",
            pali: "mukha-pāṭha",
            accent: "cobalt",
            text: "An ordinary event. `when` is optional.",
          },
          {
            label: "Written",
            when: "1st c. BCE",
            accent: "jade",
            milestone: true,
            text: "The rule behind the nodes runs the full height, so the distance is visible before anything is read.",
          },
        ],
      },
    ],
  },
  {
    type: "deconstruct",
    note: "Break a conventional object down until it stops. The chapter's central interaction. `shape` picks the silhouette that fractures.",
    blocks: [
      {
        type: "deconstruct",
        conclusion: "කුමන වස්තුවක් තෝරාගත්තද අවසානය එකමයි.",
        objects: [
          {
            id: "pot",
            label: "මැටි කළය",
            glyph: "🏺",
            dominant: "පඨවි ධාතුව",
            separation: "පරිච්ඡේද අවකාශයෙන් වෙන් වේ.",
            stages: [
              { label: "මැටි කළය", text: "සම්මුති වස්තුවක්." },
              { label: "මැටි කැබලි", text: "නම මැකී ගියේය." },
              { label: "පරමාණු", text: "විද්‍යාව මෙතැනට යයි." },
              { label: "රූප අටක්", text: "තවදුරටත් බෙදිය නොහැක." },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "octad",
    note: "The eight inseparable material realities. Ring layout with zero animation stagger — they arise together.",
    blocks: [
      {
        type: "octad",
        scale: [
          { label: "පරමාණුව", note: "බෙදිය හැකි විය." },
          { label: "ශුද්ධාෂ්ටකය", note: "මෙතැනින් එහාට නැත." },
        ],
        simultaneityNote: "අට එකම ක්ෂණයක ඉපිද එකටම නිරුද්ධ වේ.",
        items: [
          { id: "p", label: "පඨවි", pali: "pathavī", group: "maha", short: "තද හෝ මෘදු ගතිය." },
          { id: "a", label: "ආපෝ", pali: "āpo", group: "maha", short: "ගලන හෝ බන්ධන ගතිය." },
          { id: "t", label: "තේජෝ", pali: "tejo", group: "maha", short: "උණුසුම් හෝ ශීතල ගතිය." },
          { id: "v", label: "වායෝ", pali: "vāyo", group: "maha", short: "චලන ගතිය." },
          { id: "va", label: "වර්ණ", pali: "vaṇṇa", group: "upada", short: "පාට." },
          { id: "g", label: "ගන්ධ", pali: "gandha", group: "upada", short: "සුවඳ." },
          { id: "r", label: "රස", pali: "rasa", group: "upada", short: "රසය." },
          { id: "o", label: "ඕජා", pali: "ojā", group: "upada", short: "පෝෂණය." },
        ],
      },
    ],
  },
  {
    type: "timeConverter",
    note: "Two-realm time ratio. `minutesPerRealmDay` is explicit so a teaching's own day-length is honoured.",
    blocks: [
      {
        type: "timeConverter",
        realms: [
          {
            id: "tav",
            label: "තාවතිංසය",
            pali: "tāvatiṃsa",
            humanDaysPerRealmDay: 36000,
            minutesPerRealmDay: 3600,
            accent: "lotus",
          },
        ],
        presets: [
          { label: "වස් කාලය", humanDays: 90, note: "විනාඩි 9ක් පමණි." },
        ],
      },
    ],
  },
  {
    type: "elementMixer",
    note: "Shares are normalised to 100 — raising one lowers the others, which is the teaching.",
    blocks: [
      {
        type: "elementMixer",
        elements: [
          { id: "p", label: "පඨවි", pali: "pathavī", start: 25 },
          { id: "a", label: "ආපෝ", pali: "āpo", start: 25 },
          { id: "t", label: "තේජෝ", pali: "tejo", start: 25 },
          { id: "v", label: "වායෝ", pali: "vāyo", start: 25 },
        ],
        outcomes: [
          { when: "p", atLeast: 40, label: "ගල්", glyph: "🪨", text: "තද ද්‍රව්‍ය." },
          { when: "a", atLeast: 40, label: "ජලය", glyph: "💧", text: "ගලන ද්‍රව්‍ය." },
          { when: "t", atLeast: 40, label: "ගින්න", glyph: "🔥", text: "උණුසුම." },
          { when: "v", atLeast: 40, label: "සුළඟ", glyph: "🌪️", text: "චලනය." },
        ],
        puzzles: [
          { question: "සුනාමියට හෝටල් කඩන්න පුළුවන් ඇයි?", answer: "පඨවි බලයෙනි." },
        ],
      },
    ],
  },
  {
    type: "slicer",
    note: "Never divides a node — the animation IS the argument. Density drives how far the octads part.",
    blocks: [
      {
        type: "slicer",
        explanation: "කැපුම් තලය ශුද්ධාෂ්ටක වලට නොගැටේ.",
        materials: [
          { id: "leaf", label: "පළා කොළය", density: 0.2, tool: "පිහිය", note: "ලිහිල් බැඳීමකි." },
          { id: "iron", label: "යකඩ", density: 0.85, tool: "ලේසර්", note: "තද බැඳීමකි." },
        ],
      },
    ],
  },
  {
    type: "speechSpeed",
    note: "Ratios too large to feel as numerals. The phrase is authored, not typed — it is part of the teaching.",
    blocks: [
      {
        type: "speechSpeed",
        baselineWordsPerSecond: 1,
        sample: "බුද්ධං සරණං ගච්ඡාමි",
        speakers: [
          { id: "h", label: "සාමාන්‍ය මනුෂ්‍යයෙක්", multiplier: 1, accent: "lotus" },
          { id: "a", label: "ආනන්ද හිමි", multiplier: 8, accent: "jade" },
          { id: "b", label: "බුදුරජාණන් වහන්සේ", multiplier: 128, accent: "cobalt" },
        ],
      },
    ],
  },
  {
    type: "hierarchy",
    note: "Who sits where, with a detail card per tier. Use `taxonomy` instead when you are counting things.",
    blocks: [
      {
        type: "hierarchy",
        root: [
          {
            id: "sakra",
            label: "ශක්‍ර දේවේන්ද්‍රයා",
            pali: "sakka",
            tier: "අධිපති",
            accent: "lotus",
            summary: "දෙදෙව්ලොවටම අධිපතියා.",
            details: [{ label: "සුජම්පති", value: "සුජාතාගේ ස්වාමියා" }],
            children: [
              {
                id: "four",
                label: "සතරවරම් රජවරු",
                tier: "දිශා හතර",
                accent: "cobalt",
                summary: "දිශා හතරක් පාලනය කරති.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "paramatthaTable",
    note: "Cells unlock from real reading progress. Locked cells stay visible — the shape of what is ahead is informative.",
    blocks: [
      {
        type: "paramatthaTable",
        groups: [
          {
            id: "citta",
            label: "සිත",
            pali: "citta",
            count: 1,
            accent: "lotus",
            cells: [{ id: "lab-c", label: "සිත", pali: "citta" }],
          },
          {
            id: "rupa",
            label: "රූප",
            pali: "rūpa",
            count: 6,
            accent: "jade",
            cells: [
              { id: "lab-p", label: "පඨවි", pali: "pathavī" },
              { id: "lab-a", label: "ආපෝ", pali: "āpo" },
              { id: "lab-locked", label: "තේජෝ", unlockedBy: "suddhashtakaya" },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "ladder",
    note: "Escalating comparison, revealed one rung at a time. The last rung only lands once the earlier ones have used up the learner's sense of scale.",
    blocks: [
      {
        type: "ladder",
        title: "වඩාත් වේගවත් දෙය කුමක්ද?",
        rungs: [
          { label: "මහ පොළොව", accent: "jade", text: "පොළොව කැරකෙන වේගය." },
          { label: "හඳ", accent: "cobalt", text: "ඒට වඩා වැඩිය." },
          { label: "ආයු සංස්කාර", accent: "lotus", text: "සියල්ලටම වඩා ශීඝ්‍රයි." },
        ],
        conclusion: "අවසාන රුඟ දැනේ පෙර ඒවා නිසාය.",
      },
    ],
  },
  {
    type: "momentRatio",
    note: "One mind-moment, its three sub-moments, and the 17:1 ratio to a materiality. Step it or play it.",
    blocks: [
      {
        type: "momentRatio",
        rupaLifespan: 17,
        perUnitLabel: "ඇසිපිය හෙළන මොහොතක",
        cittaCount: "10¹²",
        rupaCount: "5.8 × 10¹⁰",
        phases: [
          { label: "උප්පාද", pali: "uppāda", note: "සිත ඉපදෙන අවස්ථාව." },
          { label: "ඔති", pali: "ṭhiti", note: "සිත පවතින අවස්ථාව." },
          { label: "භංග", pali: "bhaṅga", note: "සිත නිරුද්ධ වන අවස්ථාව." },
        ],
      },
    ],
  },
  {
    type: "spinWheel",
    note: "The firebrand, in its two readings. `mode: \"brand\"` (the default) spins ONE brand for paññatti; `mode: \"points\"` spins a fixed ring of momentary points for santati-ghana. Neither ever changes its count with the speed — only the smear grows — and both print the count on screen, because a widget that multiplied its objects would teach that speed creates things. Falls back to a static illustration under reduced motion.",
    blocks: [
      {
        type: "spinWheel",
        title: "mode: \"brand\" — one firebrand",
        slowLabel: "ගිනි පෙණෙල්ලක් පමණි",
        slowText: "සෙමින් යන විට එක් ගිනි පෙණෙල්ලක් පෙනේ.",
        fastLabel: "නොකැඩුණු වළල්ල",
        fastText: "වේගයෙන් යන විට එකම වළල්ලක් පෙනේ. ගණන තවමත් එකයි.",
        conclusion: "වෙනස් වූයේ වේගය පමණි.",
      },
      {
        type: "spinWheel",
        mode: "points",
        title: "mode: \"points\" — momentary dhammas",
        slowLabel: "වෙන් වෙන් ලප",
        slowText: "සෙමින් යන විට වෙන් වෙන් ලප පෙනේ.",
        fastLabel: "නොකැඩුණු වළල්ල",
        fastText: "වේගයෙන් යන විට එකම වළල්ලක් පෙනේ. ලප ගණන වෙනස් වූයේ නැත.",
        conclusion: "වෙනස් වූයේ වේගය පමණි.",
      },
    ],
  },
  {
    type: "shelf",
    note: "An ordered set of works as spines you pull from. `ascending: true` ramps the heights — only where the set really deepens, since a ramp is a claim.",
    blocks: [
      {
        type: "shelf",
        ascending: true,
        volumes: [
          {
            id: "lab-dhammasangani",
            label: "ධම්මසංගණී",
            pali: "dhammasaṅgaṇī",
            term: "dhammasangani",
            text: "ධර්මයන් එකින් එක වර්ග කිරීම.",
          },
          {
            id: "lab-vibhanga",
            label: "විභංග",
            pali: "vibhaṅga",
            term: "vibhanga",
            text: "පෙර වර්ග කළ ධර්ම විභජනය කිරීම.",
          },
          {
            id: "lab-patthana",
            label: "පට්ඨාන",
            pali: "paṭṭhāna",
            term: "patthana",
            text: "සැම ධර්මයක්ම අනෙක් ධර්ම සමඟ සම්බන්ධ වන ආකාරය.",
          },
        ],
      },
    ],
  },
  {
    type: "divider",
    note: "Breathing room. Set `ornament: true` for the decorated version.",
    blocks: [{ type: "divider", ornament: true }, { type: "divider" }],
  },
];

export default function LabPage() {
  return (
    <Container className="py-16" width="default">
      <Reveal>
        <Eyebrow>Internal</Eyebrow>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          Component lab
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-ink-dim">
          Every lesson block type rendered live. Not a lesson &mdash; the
          content here is textbook filler chosen only to make the components
          legible. Add an example whenever you add a block type.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Pill tone="caution">Not indexed</Pill>
          <Pill tone="neutral">{DEMOS.length} block types</Pill>
        </div>
      </Reveal>

      <div className="mt-16 space-y-20">
        {/*
          Lesson chrome that is not a block. The hero, the rail and the footer
          need a real lesson around them to mean anything, so they are reviewed
          on a lesson page; `Sources` is self-contained and belongs here.
        */}
        <section id="sources" className="scroll-mt-24">
          <div className="mb-6 border-l-2 border-cobalt-500/40 pl-4">
            <code className="font-mono text-sm font-semibold text-cobalt-ink">
              sources
            </code>
            <p className="mt-1 text-sm leading-relaxed text-ink-faint">
              Closes a lesson or a reference topic. Fed from the content
              model&rsquo;s `sources`, which the validator requires on anything
              published. Pass `accent=&quot;jade&quot;` on a reference topic.
            </p>
          </div>
          <Sources
            sources={[
              {
                label: "Abhidhammattha Sangaha",
                ref: "ch. 1, §2",
              },
              {
                label: "Aṭṭhasālinī",
                ref: "PTS 21",
                url: "https://example.org/atthasalini",
              },
            ]}
          />
        </section>

        {DEMOS.map((demo) => (
          <section key={demo.type} id={demo.type} className="scroll-mt-24">
            <div className="mb-6 border-l-2 border-cobalt-500/40 pl-4">
              <code className="font-mono text-sm font-semibold text-cobalt-ink">
                {demo.type}
              </code>
              <p className="mt-1 text-sm leading-relaxed text-ink-faint">
                {demo.note}
              </p>
            </div>

            {demo.blocks.map((block, i) => (
              <BlockRenderer
                key={i}
                block={block}
                lessonSlug="__lab"
                sectionId={demo.type}
                index={i}
              />
            ))}
          </section>
        ))}
      </div>
    </Container>
  );
}
