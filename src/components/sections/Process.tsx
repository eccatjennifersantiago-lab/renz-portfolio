import { processSteps } from "@/data/site";
import { SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";

export function Process() {
  return (
    <section id="process" aria-labelledby="process-heading" className="py-14 sm:py-16">
      <SectionHeading
        id="process-heading"
        index="03"
        eyebrow="Process"
        title="From research to release."
        description="Research → Plan → Produce → Review → Publish"
      />
      <Reveal as="ol" stagger className="relative grid gap-0 rounded-[28px] border border-line bg-surface p-6 shadow-card sm:p-8 lg:grid-cols-5 lg:gap-6">
        {processSteps.map((step, i) => (
          <li key={step.title} style={{ "--i": i } as React.CSSProperties} className="group relative flex gap-5 pb-8 last:pb-0 lg:flex-col lg:gap-4 lg:pb-0">
            {/* Connector: vertical on small screens, horizontal on large. */}
            {i < processSteps.length - 1 ? (
              <span
                aria-hidden="true"
                className="connector absolute top-11 bottom-0 left-[21px] w-px origin-top bg-gradient-to-b from-brand/60 to-line-strong lg:top-[21px] lg:right-[-1.5rem] lg:bottom-auto lg:left-12 lg:h-px lg:w-auto lg:origin-left lg:bg-gradient-to-r"
              />
            ) : null}
            <span
              className={`relative grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold tabular-nums transition-[transform,background-color,color,border-color] duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:scale-110 ${
                i === processSteps.length - 1 ? "bg-brand text-white" : "border border-line-strong bg-surface text-fg group-hover:border-brand group-hover:bg-brand group-hover:text-white"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="pt-1.5 lg:pt-0">
              <h3 className="text-lg font-bold tracking-tight">{step.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-pretty text-muted lg:text-sm lg:leading-relaxed">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
