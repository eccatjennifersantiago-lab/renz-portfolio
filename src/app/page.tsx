import type { CSSProperties } from "react";
import { Interactions } from "@/components/motion/Interactions";
import { Intro } from "@/components/motion/Intro";
import { profile, services, siteUrl } from "@/data/site";
import { PlayButtonsBackground } from "@/components/motion/PlayButtonsBackground";
import { SiteNav } from "@/components/nav/SiteNav";
import { Hero } from "@/components/sections/Hero";
import { ToolsStrip } from "@/components/sections/ToolsStrip";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { ProfileCard } from "@/components/sections/ProfileCard";
import { HireCard } from "@/components/sections/HireCard";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Reveal } from "@/components/motion/Reveal";

/** Structured data so search engines understand who the page is about. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: siteUrl,
  image: `${siteUrl}${profile.portrait.src}`,
  email: `mailto:${profile.email}`,
  telephone: profile.phoneHref.replace("tel:", ""),
  address: { "@type": "PostalAddress", addressRegion: "Bulacan", addressCountry: "PH" },
  knowsAbout: services.map((s) => s.title),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-night px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <SiteNav />

      {/* overflow-x-clip: lets the hero animation reach the window edge without sideways scroll. */}
      <div className="overflow-x-clip lg:pl-(--sidebar-w)">
        <main id="main" className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 xl:px-14">
          <section id="home" aria-labelledby="home-heading" className="relative isolate">
            <PlayButtonsBackground />
            <Hero />
            <ToolsStrip />
          </section>

          {/* Bento: featured results, then the profile and hiring cards. */}
          <div className="relative z-10 mt-6 rounded-[36px] border border-line bg-wash/60 p-2 backdrop-blur-sm sm:p-3">
            <Reveal as="div" stagger className="grid gap-2 sm:gap-3 xl:grid-cols-12">
              <div className="min-w-0 xl:col-span-12" style={{ "--i": 0 } as CSSProperties}>
                <CaseStudy />
              </div>
              <div className="min-w-0 xl:col-span-8" style={{ "--i": 1 } as CSSProperties}>
                <ProfileCard />
              </div>
              <div className="flex min-w-0 xl:col-span-4" style={{ "--i": 2 } as CSSProperties}>
                <HireCard />
              </div>
            </Reveal>
          </div>

          <Projects />
          <Services />
          <Process />
          <About />
          <Contact />
          <Footer />
        </main>
      </div>
      {/* Last, so it runs after the page above has hydrated. */}
      <Interactions />
      <Intro />
    </>
  );
}
