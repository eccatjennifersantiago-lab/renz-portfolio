import { ArrowUpRight, Mail } from "lucide-react";
import { mailtoHref, profile } from "@/data/site";
import { buttonStyles, ExternalLink } from "@/components/ui";

/** Small bento card under the profile: the two actions recruiters need most. */
export function HireCard() {
  return (
    <aside
      aria-labelledby="hire-heading"
      className="flex flex-1 flex-col justify-between gap-5 rounded-[28px] border border-brand-line bg-brand-soft p-6"
    >
      <div>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-brand-deep uppercase">For recruiters & clients</p>
        <h2 id="hire-heading" className="mt-1.5 text-xl font-bold tracking-tight">
          Hiring for a remote role?
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Review my résumé or reach out directly by email.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row xl:flex-col 2xl:flex-row">
        <a href={mailtoHref} className={`${buttonStyles.base} ${buttonStyles.primary} min-h-11 flex-1 px-5 text-sm`}>
          <Mail className="size-4" aria-hidden="true" />
          Email me
        </a>
        <ExternalLink
          href={profile.resumeUrl}
          className={`${buttonStyles.base} ${buttonStyles.outline} min-h-11 flex-1 px-5 text-sm`}
        >
          View Resume
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </ExternalLink>
      </div>
    </aside>
  );
}
