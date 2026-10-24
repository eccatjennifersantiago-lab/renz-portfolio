import Image from "next/image";
import { tools } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";

type Tool = (typeof tools)[number];

function ToolChip({ tool }: { tool: Tool }) {
  return (
    <span className="group/chip inline-flex h-11 shrink-0 items-center gap-2.5 rounded-full border border-line bg-surface pr-4 pl-1.5 text-sm font-medium whitespace-nowrap transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong">
      {/* Logos keep a white plate in both themes so every mark stays legible. */}
      <span className="grid size-8 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-black/5 transition-transform duration-300 group-hover/chip:scale-110 group-hover/chip:-rotate-6">
        <Image
          src={tool.icon}
          alt=""
          width={32}
          height={32}
          className={tool.fit === "cover" ? "size-full object-cover" : "size-[18px] object-contain"}
        />
      </span>
      {tool.name}
    </span>
  );
}

/**
 * Tools strip. Wide screens with motion allowed get a slow, pausable marquee;
 * phones and reduced-motion visitors get a static wrapped list instead.
 */
export function ToolsStrip() {
  return (
    <Reveal
      as="section"
      aria-labelledby="tools-heading"
      className="relative z-10 rounded-[28px] border border-line bg-surface/80 p-4 shadow-card backdrop-blur-sm sm:p-5 md:flex md:items-center md:gap-5 md:py-3 md:pr-3"
    >
      <div className="shrink-0 md:w-40 md:border-r md:border-line md:pr-5">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-brand-ink uppercase">Daily toolkit</p>
        <h2 id="tools-heading" className="mt-0.5 text-base font-bold tracking-tight">
          Tools I work with
        </h2>
      </div>

      {/* Static list: phones, and anyone preferring reduced motion. */}
      <ul className="tools-static mt-4 flex-wrap gap-2 md:mt-0" aria-label="Tools and platforms">
        {tools.map((tool) => (
          <li key={tool.name}>
            <ToolChip tool={tool} />
          </li>
        ))}
      </ul>

      {/* Marquee: the first copy is the readable list, the second is a decorative repeat. */}
      <div className="tools-marquee marquee-mask min-w-0 flex-1 overflow-hidden rounded-full bg-wash/70 py-2">
        <div className="marquee-track flex w-max animate-marquee gap-2 pl-2">
          <ul className="flex gap-2" aria-label="Tools and platforms">
            {tools.map((tool) => (
              <li key={tool.name}>
                <ToolChip tool={tool} />
              </li>
            ))}
          </ul>
          <ul className="flex gap-2" aria-hidden="true">
            {tools.map((tool) => (
              <li key={tool.name}>
                <ToolChip tool={tool} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
