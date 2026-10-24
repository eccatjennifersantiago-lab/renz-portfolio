"use client";

import Image from "next/image";
import { useEffect, useState, type AnimationEvent, type CSSProperties } from "react";
import { profile } from "@/data/site";
import { PlayButtonsBackground } from "./PlayButtonsBackground";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * Welcome screen shown once per visit (sessionStorage), styled like the share
 * card: name, role, status and portrait over the floating awards, with the
 * accent bar filling up like a loading bar.
 *
 * Timing and exit are pure CSS (it fades out by itself after ~2.5 s, even
 * without JavaScript). JavaScript only skips it early on any click, key, scroll
 * or touch, and removes it from the page once it has faded. Reduced-motion
 * visitors and repeat views in the same session never see it (see the
 * pre-paint script in layout.tsx and the .intro rules in globals.css).
 */
export function Intro() {
  const [skipped, setSkipped] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro !== "show") {
      const id = requestAnimationFrame(() => setGone(true));
      return () => cancelAnimationFrame(id);
    }
    const skip = () => {
      // Start the hero entrance now instead of after the full welcome delay.
      root.style.setProperty("--intro-delay", `${Math.round(performance.now()) + 150}ms`);
      setSkipped(true);
    };
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, skip, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, skip));
  }, []);

  const onAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || !e.animationName.startsWith("intro-out")) return;
    document.documentElement.dataset.intro = "done";
    window.dispatchEvent(new Event("introdone"));
    setGone(true);
  };

  if (gone) return null;

  return (
    <div
      className="intro fixed inset-0 z-[90] overflow-hidden bg-[#0d0909] text-white"
      data-skip={skipped || undefined}
      aria-hidden="true"
      onAnimationEnd={onAnimationEnd}
    >
      {/* Slow red glows, as on the share card. */}
      <div className="intro-glow pointer-events-none absolute inset-0" />
      <PlayButtonsBackground placement="intro" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1200px] flex-col-reverse items-start justify-center gap-8 px-6 sm:px-10 md:flex-row md:items-center md:justify-between md:gap-14 md:px-16">
        <div className="w-full max-w-xl [text-shadow:0_2px_18px_rgb(0_0_0/0.75),0_0_42px_rgb(0_0_0/0.55)]">
          <span
            className="intro-in inline-block rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold text-white/85 sm:text-base"
            style={delay(150)}
          >
            {profile.title}
          </span>
          <p className="mt-5 text-[2.75rem] leading-[1.02] font-extrabold tracking-[-0.04em] sm:text-6xl md:text-7xl">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="intro-word" style={delay(300)}>
                Renz Russel
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="intro-word" style={delay(420)}>
                Santiago<span className="text-brand">.</span>
              </span>
            </span>
          </p>
          <p className="intro-in mt-4 text-lg text-white/75 sm:text-2xl" style={delay(600)}>
            {profile.specialties.join(" · ")}
          </p>
          <p className="intro-in mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/70 sm:text-base" style={delay(720)}>
            <span className="inline-flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              {profile.availability}
            </span>
            <span className="text-white/40">·</span>
            <span>{profile.location}</span>
          </p>
          {/* The accent bar doubles as the loading bar. */}
          <div className="intro-in mt-7 h-1.5 w-40 overflow-hidden rounded-full bg-white/10" style={delay(800)}>
            <div className="intro-bar h-full w-full rounded-full bg-gradient-to-r from-brand to-accent" />
          </div>
        </div>

        <div
          className="intro-card relative aspect-square w-44 shrink-0 overflow-hidden rounded-[28px] border border-white/12 shadow-[0_30px_80px_rgb(0_0_0/0.6)] sm:w-64 md:w-[380px] md:rounded-[36px]"
          style={delay(250)}
        >
          <Image
            src={profile.portrait.src}
            alt=""
            width={profile.portrait.width}
            height={profile.portrait.height}
            priority
            sizes="(min-width: 768px) 380px, 256px"
            className="size-full object-cover"
          />
        </div>
      </div>

      <p className="intro-in absolute inset-x-0 bottom-6 text-center text-xs text-white/60" style={delay(1200)}>
        Click anywhere to skip
      </p>
    </div>
  );
}
