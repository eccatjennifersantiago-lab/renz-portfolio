import type { ComponentProps, ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

/** Shared button styles for anchor elements. */
export const buttonStyles = {
  base: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-[background-color,color,border-color,transform,box-shadow] duration-200 motion-safe:active:scale-[0.98]",
  primary: "bg-brand text-white shadow-[0_10px_24px_-12px_rgb(220_38_38/0.7)] hover:bg-brand-strong",
  dark: "bg-night text-white ring-1 ring-white/10 hover:bg-night-soft",
  outline: "border border-line-strong bg-surface text-fg hover:border-fg",
  ghostDark: "border border-white/20 text-white hover:border-white/60 hover:bg-white/5",
};

/** External link that opens in a new tab safely and announces it. */
export function ExternalLink({
  children,
  ...props
}: Omit<ComponentProps<"a">, "target" | "rel"> & { href: string; children: ReactNode }) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  id,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  id: string;
}) {
  return (
    <Reveal as="div" className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-brand-ink uppercase">
          <span className="tabular-nums">{index}</span>
          <span aria-hidden="true" className="h-px w-6 bg-accent" />
          {eyebrow}
        </p>
        <h2
          id={id}
          className="mt-3 text-3xl font-bold tracking-[-0.03em] text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]"
        >
          {title}
        </h2>
      </div>
      {description ? (
        <p className="max-w-sm text-[15px] leading-relaxed text-pretty text-muted">{description}</p>
      ) : null}
    </Reveal>
  );
}
