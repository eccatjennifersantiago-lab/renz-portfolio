import { Fragment } from "react";
import { ArrowDown, ArrowUpRight, MapPin, Mail } from "lucide-react";
import { hero, mailtoHref, profile } from "@/data/site";
import { buttonStyles, ExternalLink } from "@/components/ui";

/** Words that get the drawn red underline. */
const HIGHLIGHT = new Set(["publish-ready"]);

export function Hero() {
  // Final period becomes a small red accent.
  const words = hero.headline.replace(/\.$/, "").split(" ");

  return (
    <div className="relative z-10 pt-8 pb-8 sm:pt-12 lg:pt-16 lg:pb-10">
      <div className="hero-halo flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-medium text-muted motion-safe:animate-rise">
        <span className="rounded-full bg-night px-3 py-1 text-white ring-1 ring-white/10 [text-shadow:none]">{profile.title}</span>
        <span>{profile.specialties.join(" · ")}</span>
        <span className="hidden items-center gap-1 sm:inline-flex">
          <MapPin className="size-3.5" aria-hidden="true" />
          {profile.location}
        </span>
      </div>

      <h1
        id="home-heading"
        className="hero-halo mt-6 max-w-[10.5em] text-[2.6rem] leading-[1.06] font-extrabold tracking-[-0.045em] text-balance sm:text-6xl lg:text-[4.5rem] xl:text-[5rem]"
      >
        {words.map((word, i) => (
          <Fragment key={i}>
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span
                className={`inline-block motion-safe:animate-word-up ${HIGHLIGHT.has(word) ? "hero-underline" : ""}`}
                style={{
                  animationDelay: HIGHLIGHT.has(word)
                    ? `${120 + i * 70}ms, ${900 + i * 70}ms`
                    : `${120 + i * 70}ms`,
                }}
              >
                {word}
                {i === words.length - 1 ? <span className="text-brand">.</span> : null}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </h1>

      <p
        className="hero-halo mt-6 max-w-[39.5em] text-lg leading-relaxed text-pretty text-muted motion-safe:animate-rise sm:text-xl sm:leading-relaxed"
        style={{ animationDelay: "520ms" }}
      >
        {hero.intro}
      </p>

      <div
        className="mt-8 flex flex-col gap-3 motion-safe:animate-rise sm:flex-row sm:flex-wrap"
        style={{ animationDelay: "650ms" }}
      >
        <a href="#projects" data-magnetic className={`group ${buttonStyles.base} ${buttonStyles.primary}`}>
          View My Work
          <ArrowDown
            className="size-4 transition-transform duration-300 group-hover:translate-y-0.5 motion-safe:group-hover:animate-bounce"
            aria-hidden="true"
          />
        </a>
        <a href={mailtoHref} data-magnetic className={`group ${buttonStyles.base} ${buttonStyles.dark}`}>
          <Mail className="size-4 transition-transform duration-300 group-hover:-rotate-12" aria-hidden="true" />
          Let’s Work Together
        </a>
        <ExternalLink
          href={profile.resumeUrl}
          data-magnetic
          className={`group ${buttonStyles.base} ${buttonStyles.outline}`}
        >
          View Resume
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </ExternalLink>
      </div>
    </div>
  );
}
