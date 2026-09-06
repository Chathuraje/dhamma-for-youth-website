import Image from "next/image";
import { rich } from "@/lib/richtext";
import { figureSrc } from "@/lib/images";
import type { FigureBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

/**
 * An authored image.
 *
 * The locale segment is resolved here rather than written into the lesson, so
 * the same content serves Sinhala artwork today and English artwork the moment
 * an English build exists — see `src/lib/images.ts`.
 *
 * `width`/`height` are the file's real pixel size and are required: the box is
 * reserved before the image arrives, so a diagram loading does not shove the
 * paragraph the learner is reading down the page. Give the real numbers — a
 * 16:9 box declared for a 9:16 picture reserves a short strip and then jumps to
 * twice the height of the screen when the file lands, which reads as breakage.
 *
 * Every figure runs the full width of the reading column, portrait ones
 * included — a diagram is there to be read, and a tall one capped to half the
 * column is a thumbnail of itself. `size: "wide"` takes it past the column on
 * large screens when even that is not enough.
 */
export function Figure({ block }: { block: FigureBlock }) {
  const wide = block.size === "wide";

  return (
    <Reveal>
      <figure
        className={cn(
          "my-10",
          // A wide figure grows to the RIGHT only. The lesson body sits beside
          // a sticky rail, so a negative left margin does not gain room — it
          // lands on top of the rail. Nothing widens below `xl`, where the
          // grid has no slack to give.
          wide && "xl:w-[calc(100%+8rem)] xl:max-w-none 2xl:w-[calc(100%+12rem)]",
        )}
      >
        <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
          <Image
            src={figureSrc(block.src)}
            alt={block.alt}
            width={block.width}
            height={block.height}
            className="h-auto w-full"
            sizes={
              wide
                ? "(min-width: 1536px) 54rem, (min-width: 1280px) 50rem, (min-width: 1024px) 42rem, 100vw"
                : "(min-width: 1280px) 62rem, (min-width: 1024px) 48rem, 100vw"
            }
          />
        </div>

        {block.caption && (
          <figcaption className="prose-dhamma mt-3 text-sm">
            {rich(block.caption)}
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}
