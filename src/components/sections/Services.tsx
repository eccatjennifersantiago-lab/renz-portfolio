import { Clapperboard, ImageIcon, Megaphone, PenLine, ShoppingBag, Workflow } from "lucide-react";
import { services, type ServiceIcon } from "@/data/site";
import { SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";

const icons: Record<ServiceIcon, typeof Workflow> = {
  automation: Workflow,
  editing: Clapperboard,
  script: PenLine,
  thumbnail: ImageIcon,
  shopify: ShoppingBag,
  marketing: Megaphone,
};

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="py-14 sm:py-16">
      <SectionHeading
        id="services-heading"
        index="02"
        eyebrow="Services"
        title="Where I can help."
        description="YouTube production, editing, Shopify support, and the marketing and operations work around them."
      />
      <Reveal as="ul" stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service, i) => {
          const Icon = icons[service.icon];
          return (
            <li
              key={service.title}
              data-spotlight
              style={{ "--i": i } as React.CSSProperties}
              className="group relative flex flex-col rounded-[24px] border border-line bg-surface p-6 shadow-card transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand-ink transition-[background-color,color,transform] duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-rotate-8 group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
                  <Icon className="size-[22px]" aria-hidden="true" strokeWidth={1.8} />
                </span>
                <span aria-hidden="true" className="text-sm font-semibold text-line-strong tabular-nums transition-colors duration-300 group-hover:text-brand-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-bold tracking-tight">{service.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-pretty text-muted">{service.description}</p>
            </li>
          );
        })}
      </Reveal>
    </section>
  );
}
