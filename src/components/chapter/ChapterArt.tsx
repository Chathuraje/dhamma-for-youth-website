import { cn } from "@/lib/utils";

/**
 * A chapter's artwork, with a drawn fallback for a chapter that has none.
 *
 * Used by the dashboard cards and, at `eager`, behind the chapter and lesson
 * heroes — one picture per chapter, wherever that chapter is shown.
 *
 * A plain `<img>` rather than `next/image`, for now. The files are small SVG
 * placeholders, and Next's image optimiser refuses SVG unless
 * `dangerouslyAllowSVG` is turned on — config worth adding for real artwork
 * and not worth adding for stand-ins. The box is a fixed square in every use
 * and the dimensions are explicit, so nothing shifts while it loads.
 *
 * When the real images land, swap this for `next/image` and drop the
 * eslint-disable below.
 *
 * `alt=""` throughout — the artwork is decorative. Every place it appears, the
 * chapter is named in text beside it, and a screen reader announcing "chapter
 * two artwork" adds nothing a reader can use.
 */
export function ChapterArt({
  src,
  number,
  className,
  eager = false,
}: {
  src?: string;
  number: number;
  className?: string;
  /** Set where the art is above the fold — a hero should not fade in late. */
  eager?: boolean;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- see the note above
      <img
        src={src}
        alt=""
        // The convention is 1600 x 900 — see public/images/README.md. Every use
        // sizes the box with CSS, so these only fix the ratio reserved before
        // the file lands; a 4:3 guess here made the hero panel jump to 16:9.
        width={1600}
        height={900}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        decoding="async"
        className={cn("object-cover", className)}
      />
    );
  }

  /** The four accent registers, cycled, so an art-less chapter still reads
      as a distinct place rather than a grey hole. */
  const tints = [
    "from-cobalt-500/30 to-cobalt-500/5",
    "from-jade-500/30 to-jade-500/5",
    "from-lotus-500/30 to-lotus-500/5",
    "from-gold-500/30 to-gold-500/5",
  ];

  return (
    <span
      aria-hidden
      className={cn(
        "flex items-center justify-center bg-gradient-to-br font-display text-sm font-semibold text-ink-faint",
        tints[(number - 1) % tints.length],
        className,
      )}
    >
      {String(number).padStart(2, "0")}
    </span>
  );
}
