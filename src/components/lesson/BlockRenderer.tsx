import type { Block } from "@/lib/types";
import {
  Callout,
  Comparison,
  Divider,
  Heading,
  KeyIdea,
  List,
  PaliTermCard,
  Prose,
  Quote,
  Summary,
  Table,
} from "./blocks/StaticBlocks";
import { Derivation } from "./blocks/Derivation";
import { Figure } from "./blocks/Figure";
import { Flow } from "./blocks/Flow";
import { Structure } from "./blocks/Structure";
import { Timeline } from "./blocks/Timeline";
import { Quiz } from "./blocks/Quiz";
import { Reflect } from "./blocks/Reflect";
import { SortGame } from "./blocks/SortGame";
import { Taxonomy } from "./blocks/Taxonomy";
import { Deconstruct } from "./blocks/Deconstruct";
import { Ladder } from "./blocks/Ladder";
import { MomentRatio } from "./blocks/MomentRatio";
import { SpinWheel } from "./blocks/SpinWheel";
import { ElementMixer } from "./blocks/ElementMixer";
import { Hierarchy } from "./blocks/Hierarchy";
import { Octad } from "./blocks/Octad";
import { ParamatthaTable } from "./blocks/ParamatthaTable";
import { Shelf } from "./blocks/Shelf";
import { Slicer } from "./blocks/Slicer";
import { SpeechSpeed } from "./blocks/SpeechSpeed";
import { TimeConverter } from "./blocks/TimeConverter";

/**
 * Maps one content block to its component.
 *
 * The switch is exhaustive by construction: `Block` is a discriminated union,
 * so if you add a member to it and forget a case here, `never` in the default
 * branch fails the type check. That is the safety net that lets us add block
 * types confidently.
 */
export function BlockRenderer({
  block,
  lessonSlug,
  sectionId,
  index,
}: {
  block: Block;
  lessonSlug: string;
  sectionId: string;
  index: number;
}) {
  /** Stable per-block key for persisted learner state. */
  const storageKey = `${lessonSlug}:${sectionId}:${index}`;

  switch (block.type) {
    case "prose":
      return <Prose block={block} />;
    case "heading":
      return <Heading block={block} />;
    case "keyIdea":
      return <KeyIdea block={block} />;
    case "callout":
      return <Callout block={block} />;
    case "paliTerm":
      return <PaliTermCard block={block} />;
    case "quote":
      return <Quote block={block} />;
    case "list":
      return <List block={block} />;
    case "comparison":
      return <Comparison block={block} />;
    case "table":
      return <Table block={block} />;
    case "summary":
      return <Summary block={block} />;
    case "figure":
      return <Figure block={block} />;
    case "structure":
      return <Structure block={block} />;
    case "derivation":
      return <Derivation block={block} />;
    case "timeline":
      return <Timeline block={block} />;
    case "divider":
      return <Divider block={block} />;
    case "flow":
      return <Flow block={block} />;
    case "taxonomy":
      return <Taxonomy block={block} />;
    case "quiz":
      return <Quiz block={block} storageKey={storageKey} />;
    case "sortGame":
      return <SortGame block={block} />;
    case "reflect":
      return <Reflect block={block} storageKey={storageKey} />;

    /* -- simulators ------------------------------------------------------ */
    case "timeConverter":
      return <TimeConverter block={block} />;
    case "octad":
      return <Octad block={block} />;
    case "elementMixer":
      return <ElementMixer block={block} />;
    case "slicer":
      return <Slicer block={block} />;
    case "speechSpeed":
      return <SpeechSpeed block={block} />;
    case "hierarchy":
      return <Hierarchy block={block} />;
    case "deconstruct":
      return <Deconstruct block={block} />;
    case "paramatthaTable":
      return <ParamatthaTable block={block} />;
    case "ladder":
      return <Ladder block={block} />;
    case "momentRatio":
      return <MomentRatio block={block} />;
    case "shelf":
      return <Shelf block={block} />;

    case "spinWheel":
      return <SpinWheel block={block} />;

    default: {
      const exhaustive: never = block;
      void exhaustive;
      return null;
    }
  }
}
