import { ArrowUpRight, FileText, FileUser, ImageIcon, LayoutGrid, ShoppingBag } from "lucide-react";
import { profile, projects, type ProjectIcon } from "@/data/site";
import { buttonStyles, ExternalLink, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";

const icons: Record<ProjectIcon, typeof FileText> = {
  script: FileText,
  thumbnail: ImageIcon,
  ecommerce: ShoppingBag,
  portfolio: LayoutGrid,
};

/** Per-card treatment so the four samples read as distinct pieces. */
const variants = [
  { span: "md:col-span-7", panel: "bg-brand-soft text-brand-ink", dark: false },
  { span: "md:col-span-5", panel: "bg-accent-soft text-accent-ink", dark: false },
  { span: "md:col-span-5", panel: "bg-wash text-fg", dark: false },
  { span: "md:col-span-7", panel: "bg-white/10 text-white", dark: true },
];

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-14 sm:py-16">
      <SectionHeading
        id="projects-heading"
        index="01"
        eyebrow="Projects"
        title="Work samples you can open and review."
        description="Each sample opens in a new tab: Google Drive folders, a thumbnail gallery, and an additional portfolio page."
      />

      <Reveal as="ul" stagger className="grid gap-4 md:grid-cols-12">
        {projects.map((project, i) => {
          const Icon = icons[project.icon];
          const v = variants[i % variants.length];
          return (
            <li key={project.title} className={v.span} style={{ "--i": i } as React.CSSProperties}>
              <ExternalLink
                href={project.url}
                data-tilt
                data-spotlight={v.dark ? "strong" : ""}
                className={`group flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[24px] border p-6 transition-[box-shadow,border-color] duration-300 sm:p-7 ${
                  v.dark
                    ? "border-night bg-night text-white ring-1 ring-white/5 hover:shadow-lift"
                    : "border-line bg-surface shadow-card hover:border-line-strong hover:shadow-lift"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`grid size-14 place-items-center rounded-2xl transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:scale-110 group-hover:-rotate-6 ${v.panel}`}
                  >
                    <Icon className="size-6" aria-hidden="true" strokeWidth={1.8} />
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${
                      v.dark ? "border-white/20 text-white/80" : "border-line text-muted"
                    }`}
                  >
                    Work sample
                  </span>
                </div>
                <div>
                  <p className={`text-xs font-semibold tracking-[0.14em] uppercase ${v.dark ? "text-white/60" : "text-brand-ink"}`}>
                    {project.category}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight">{project.title}</h3>
                  <p className={`mt-2 text-[15px] ${v.dark ? "text-white/70" : "text-muted"}`}>
                    {project.description}
                  </p>
                  <div
                    className={`mt-6 flex items-center justify-between gap-3 border-t pt-4 text-sm ${
                      v.dark ? "border-white/15" : "border-line"
                    }`}
                  >
                    <span className={v.dark ? "text-white/60" : "text-muted"}>{project.host}</span>
                    <span className="inline-flex items-center gap-1 font-semibold">
                      {project.cta}
                      <ArrowUpRight
                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </ExternalLink>
            </li>
          );
        })}
      </Reveal>

      {/* Résumé: a document, presented apart from the work samples. */}
      <Reveal as="div" className="mt-4 flex flex-col gap-5 rounded-[24px] border border-dashed border-line-strong bg-surface/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-night text-white">
            <FileUser className="size-5" aria-hidden="true" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Document · Google Drive</p>
            <h3 className="mt-0.5 text-lg font-bold tracking-tight">Résumé</h3>
          </div>
        </div>
        <ExternalLink href={profile.resumeUrl} className={`${buttonStyles.base} ${buttonStyles.outline}`}>
          View Resume
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </ExternalLink>
      </Reveal>
    </section>
  );
}
