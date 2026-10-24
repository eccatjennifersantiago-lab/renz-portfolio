import type { CSSProperties } from "react";
import { ArrowUpRight, BriefcaseBusiness, FileUser, Mail, MapPin, Phone } from "lucide-react";
import { contact, mailtoHref, profile } from "@/data/site";
import { buttonStyles, ExternalLink } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";

const rowClass =
  "group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-[transform,border-color,background-color] duration-300";
/** Extra hover motion for the rows that are links. */
const linkRow = "hover:translate-x-1 hover:border-white/30 hover:bg-white/[0.07]";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-14 sm:py-16">
      <div
        data-spotlight="strong"
        className="relative overflow-hidden rounded-[32px] bg-night p-6 text-white ring-1 ring-white/5 sm:p-10 lg:p-12"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-24 size-96 rounded-full bg-brand/25 blur-3xl motion-safe:animate-pulse"
        />
        <div className="relative grid gap-10 xl:grid-cols-[1.1fr_1fr] xl:items-center">
          <Reveal as="div">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">
              <span className="tabular-nums">05</span>
              <span aria-hidden="true" className="h-px w-6 bg-accent" />
              Contact
            </p>
            <h2
              id="contact-heading"
              className="mt-4 max-w-[14ch] text-4xl leading-[1.04] font-extrabold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl"
            >
              {contact.heading}
            </h2>
            <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-pretty text-white/70 sm:text-lg">
              {contact.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={mailtoHref} data-magnetic className={`group ${buttonStyles.base} ${buttonStyles.primary}`}>
                <Mail className="size-4 transition-transform duration-300 group-hover:-rotate-12" aria-hidden="true" />
                Email me
              </a>
              <ExternalLink href={profile.resumeUrl} className={`${buttonStyles.base} ${buttonStyles.ghostDark}`}>
                View Resume
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </ExternalLink>
            </div>
          </Reveal>

          <Reveal as="ul" stagger className="grid min-w-0 gap-3" aria-label="Contact details">
            <li style={{ "--i": 0 } as CSSProperties}>
              <a href={mailtoHref} className={`${rowClass} ${linkRow}`}>
                <RowIcon icon={Mail} />
                <RowText label="Email" value={profile.email} />
              </a>
            </li>
            <li style={{ "--i": 1 } as CSSProperties}>
              <a href={profile.phoneHref} className={`${rowClass} ${linkRow}`}>
                <RowIcon icon={Phone} />
                <RowText label="Phone" value={profile.phoneDisplay} />
              </a>
            </li>
            <li style={{ "--i": 2 } as CSSProperties}>
              <ExternalLink href={profile.resumeUrl} className={`${rowClass} ${linkRow}`}>
                <RowIcon icon={FileUser} />
                <RowText label="Résumé" value="View Resume" />
                <ArrowUpRight className="ml-auto size-4 shrink-0 text-white/60" aria-hidden="true" />
              </ExternalLink>
            </li>
            <li style={{ "--i": 3 } as CSSProperties} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className={rowClass}>
                <RowIcon icon={MapPin} />
                <RowText label="Location" value={profile.location} />
              </div>
              <div className={rowClass}>
                <RowIcon icon={BriefcaseBusiness} />
                <RowText label="Availability" value="Open to remote roles" />
              </div>
            </li>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function RowIcon({ icon: Icon }: { icon: typeof Mail }) {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-white transition-[background-color,transform] duration-300 group-hover:scale-105 group-hover:bg-brand">
      <Icon className="size-[18px]" aria-hidden="true" strokeWidth={1.8} />
    </span>
  );
}

function RowText({ label, value }: { label: string; value: string }) {
  return (
    <span className="min-w-0">
      <span className="block text-xs font-medium text-white/60">{label}</span>
      <span className="block text-[15px] font-semibold [overflow-wrap:anywhere]">{value}</span>
    </span>
  );
}
