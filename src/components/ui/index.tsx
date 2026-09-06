import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/strings";
import type { Tone } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/*  Tone palette - shared by callouts, pills, comparison columns              */
/* -------------------------------------------------------------------------- */

export const toneStyles: Record<
  Tone,
  { ring: string; text: string; bg: string; dot: string; label: string }
> = {
  neutral: {
    ring: "ring-line",
    text: "text-ink-dim",
    bg: "bg-surface-2",
    dot: "bg-ink-faint",
    label: t.block.note,
  },
  insight: {
    ring: "ring-jade-500/30",
    text: "text-jade-600",
    bg: "bg-jade-500/8",
    dot: "bg-jade-500",
    label: t.block.insight,
  },
  caution: {
    ring: "ring-rose-500/30",
    text: "text-rose-500",
    bg: "bg-rose-500/8",
    dot: "bg-rose-500",
    label: t.block.caution,
  },
  tradition: {
    ring: "ring-gold-500/30",
    text: "text-gold-600",
    bg: "bg-gold-500/8",
    dot: "bg-gold-500",
    label: t.block.tradition,
  },
  practice: {
    ring: "ring-lotus-500/30",
    text: "text-lotus-600",
    bg: "bg-lotus-500/8",
    dot: "bg-lotus-500",
    label: t.block.practice,
  },
};

/* -------------------------------------------------------------------------- */
/*  Button                                                                    */
/* -------------------------------------------------------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-40";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-cobalt-500 text-on-brand hover:bg-cobalt-400 hover:shadow-[0_8px_30px_-8px] hover:shadow-cobalt-500/60 active:scale-[0.98]",
  secondary:
    "bg-surface-2 text-ink ring-1 ring-line hover:bg-surface-3 hover:ring-cobalt-500/40 active:scale-[0.98]",
  ghost: "text-ink-dim hover:text-ink hover:bg-surface-2",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3.5 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

/* -------------------------------------------------------------------------- */
/*  Surfaces                                                                  */
/* -------------------------------------------------------------------------- */

export function Card({
  className,
  children,
  interactive = false,
}: {
  className?: string;
  children: ReactNode;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface shadow-card ring-1 ring-line",
        interactive &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift hover:ring-cobalt-500/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Pill({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
}) {
  const t = toneStyles[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        t.bg,
        t.text,
        t.ring,
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Small uppercase label used above headings. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs si-heading font-semibold text-cobalt-500",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Pāli set in the dedicated serif, with correct language tagging. */
export function Pali({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span lang="pi" className={cn("font-pali italic", className)}>
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Progress ring                                                             */
/* -------------------------------------------------------------------------- */

export function ProgressRing({
  ratio,
  size = 36,
  stroke = 3,
  className,
}: {
  ratio: number;
  size?: number;
  stroke?: number;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("-rotate-90", className)}
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        className="stroke-surface-3"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.min(Math.max(ratio, 0), 1))}
        className="stroke-cobalt-500 transition-[stroke-dashoffset] duration-700 ease-out"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section shell                                                             */
/* -------------------------------------------------------------------------- */

export function Container({
  children,
  className,
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  width?: "narrow" | "default" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        width === "narrow" && "max-w-2xl",
        width === "default" && "max-w-5xl",
        width === "wide" && "max-w-7xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dashboard furniture                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A titled panel: heading on the left, one optional action on the right. Used
 * by every card in the app so the dashboard reads as one grid rather than a
 * pile of bespoke boxes.
 */
export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl bg-surface shadow-card ring-1 ring-line",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
        <h2 className="si-heading block font-display text-lg font-semibold text-ink">
          {title}
        </h2>
        {action}
      </header>
      <div className={cn("px-5 pb-5 pt-4 sm:px-6 sm:pb-6", bodyClassName)}>
        {children}
      </div>
    </section>
  );
}

/** The "View All →" link that sits in a Panel header. */
export function PanelAction({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap pt-1 text-xs font-medium text-ink-dim transition-colors hover:text-cobalt-600"
    >
      {children}
      <span aria-hidden>&rarr;</span>
    </Link>
  );
}

/**
 * A figure with a label under it. Numbers use the si-LK locale, as everywhere
 * else in the app.
 */
export function Stat({
  value,
  label,
  icon,
}: {
  value: ReactNode;
  label: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {icon ? <span className="text-ink-faint">{icon}</span> : null}
      <div className="min-w-0">
        <p className="font-display text-lg font-semibold leading-none text-ink">
          {value}
        </p>
        <span className="si-heading block mt-1 text-[0.7rem] leading-tight text-ink-dim">
          {label}
        </span>
      </div>
    </div>
  );
}

/**
 * What a section says when it has nothing in it yet. Naming the absence beats
 * an empty grid that looks broken, and beats inventing filler to fill it.
 */
export function Empty({
  title,
  body,
  action,
}: {
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-line px-5 py-8 text-center">
      <p className="si-heading text-sm font-medium text-ink-dim">{title}</p>
      {body ? (
        <p className="si-heading mx-auto mt-1.5 max-w-sm text-xs text-ink-faint">
          {body}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
