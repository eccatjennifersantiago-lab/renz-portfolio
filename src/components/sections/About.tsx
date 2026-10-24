import type { CSSProperties } from "react";
import { MapPin } from "lucide-react";
import { about, profile } from "@/data/site";
import { SectionHeading } from "@/components/ui";
import { AvailabilityBadge } from "@/components/nav/AvailabilityBadge";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-14 sm:py-16">
      <SectionHeading id="about-heading" index="04" eyebrow="About" title="Hands-on in production. Clear with people." />

      <div className="grid gap-4 lg:grid-cols-12">
        <aside className="flex flex-col gap-4 lg:col-span-4" aria-label="Quick facts">
          <Reveal as="dl" stagger className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            {about.facts.map((fact, i) => (
              <div
                key={fact.value}
                data-spotlight
                style={{ "--i": i } as CSSProperties}
                className="group flex flex-col rounded-[24px] border border-line bg-surface p-6 shadow-card transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-line-strong"
              >
                <dt className="text-sm leading-snug text-muted">{fact.label}</dt>
                <dd className="order-first mb-2 text-4xl font-extrabold tracking-tight text-fg">
                  <CountUp value={fact.value} duration={1400} delay={i * 150} />
                </dd>
                <span
                  aria-hidden="true"
                  className="mt-4 h-0.5 w-10 origin-left rounded-full bg-gradient-to-r from-brand to-accent transition-transform duration-500 group-hover:scale-x-[2.2]"
                />
              </div>
            ))}
          </Reveal>
          <Reveal as="div" className="rounded-[24px] border border-line bg-surface p-6 shadow-card">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <MapPin className="size-4 text-brand-ink" aria-hidden="true" />
              {profile.location}
            </p>
            <div className="mt-3">
              <AvailabilityBadge />
            </div>
          </Reveal>
        </aside>

        <Reveal as="div" className="rounded-[28px] border border-line bg-surface p-6 shadow-card sm:p-9 lg:col-span-8">
          <p className="max-w-[62ch] text-xl leading-relaxed font-semibold tracking-tight text-pretty sm:text-[1.35rem]">
            {about.intro}
          </p>
          <Reveal as="div" stagger className="mt-8 space-y-6">
            {about.blocks.map((block, i) => (
              <div
                key={block.label}
                style={{ "--i": i + 1 } as CSSProperties}
                className="group grid gap-2 border-t border-line pt-6 sm:grid-cols-[150px_1fr] sm:gap-6"
              >
                <h3 className="flex items-start gap-2 text-xs font-semibold tracking-[0.16em] text-brand-ink uppercase sm:pt-1">
                  <span
                    aria-hidden="true"
                    className="mt-[5px] size-1.5 shrink-0 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150"
                  />
                  {block.label}
                </h3>
                <p className="max-w-[62ch] text-base leading-relaxed text-pretty text-muted transition-colors duration-300 group-hover:text-fg">
                  {block.text}
                </p>
              </div>
            ))}
          </Reveal>
        </Reveal>
      </div>
    </section>
  );
}
