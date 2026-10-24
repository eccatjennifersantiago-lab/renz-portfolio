import type { CSSProperties } from "react";
import { CalendarRange } from "lucide-react";
import { caseStudy } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";
import { AnalyticsLightbox } from "./AnalyticsLightbox";
import { AnalyticsPanel } from "./AnalyticsPanel";

export function CaseStudy() {
  return (
    <section
      id="results"
      aria-labelledby="results-heading"
      data-spotlight="strong"
      className="relative overflow-hidden rounded-[28px] bg-night p-5 text-white ring-1 ring-white/5 sm:p-8 xl:p-10"
    >
      {/* Soft warm light in the corner, echoing the portrait backdrop. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 size-80 rounded-full bg-brand/30 blur-3xl motion-safe:animate-pulse"
      />

      <div className="relative">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-white/85">
              <span aria-hidden="true" className="relative flex size-1.5">
                <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping" />
                <span className="relative size-1.5 rounded-full bg-accent" />
              </span>
              {caseStudy.eyebrow}
            </p>
            <Reveal
              as="h2"
              id="results-heading"
              className="mt-5 max-w-[20ch] text-3xl leading-[1.08] font-bold tracking-[-0.035em] text-balance sm:text-4xl xl:text-[2.6rem]"
            >
              {caseStudy.title}
            </Reveal>
          </div>
          <div>
            <Reveal as="p" className="max-w-[60ch] text-[15px] leading-relaxed text-pretty text-white/70 sm:text-base">
              {caseStudy.description}
            </Reveal>
            <Reveal as="ul" stagger className="mt-4 flex flex-wrap gap-2" aria-label="What I handled">
              {caseStudy.responsibilities.map((item, i) => (
                <li
                  key={item}
                  style={{ "--i": i } as CSSProperties}
                  className="rounded-full border border-white/12 px-3 py-1 text-xs font-medium text-white/80 transition-colors duration-300 hover:border-brand hover:bg-brand/15 hover:text-white"
                >
                  {item}
                </li>
              ))}
            </Reveal>
          </div>
        </div>

        <div className="mt-8">
          <AnalyticsPanel />
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="flex items-start gap-2 text-[15px] font-semibold text-white">
              <CalendarRange className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              {caseStudy.disclosure}
            </p>
            <p className="mt-1.5 pl-6 text-[13px] leading-relaxed text-white/60">
              {caseStudy.note} {caseStudy.chartNote}
            </p>
          </div>
          <div className="shrink-0 pl-6 sm:pl-0">
            <AnalyticsLightbox />
          </div>
        </div>
      </div>
    </section>
  );
}
