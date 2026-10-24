"use client";

import { useEffect } from "react";

/**
 * Pointer effects driven by data attributes, so section components stay
 * server-rendered. Styles are only written in response to pointer movement,
 * never during hydration.
 *  - [data-spotlight]  soft glow that follows the pointer inside the element
 *  - [data-tilt]       subtle 3D tilt toward the pointer
 *  - [data-magnetic]   pulls slightly toward the pointer
 * Runs only for fine pointers without reduced motion. Scroll reveals live in
 * the Reveal component.
 */
export function Interactions() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !fine) return;

    let tilted: HTMLElement | null = null;
    let magnet: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      const t = e.target as Element | null;

      const spot = t?.closest<HTMLElement>("[data-spotlight]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }

      const tilt = t?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (tilted && tilted !== tilt) tilted.style.transform = "";
      tilted = tilt;
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-3px)`;
      }

      const mag = t?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (magnet && magnet !== mag) magnet.style.transform = "";
      magnet = mag;
      if (mag) {
        const r = mag.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        mag.style.transform = `translate(${(dx * 0.22).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px)`;
      }
    };

    const reset = () => {
      if (tilted) tilted.style.transform = "";
      if (magnet) magnet.style.transform = "";
      tilted = magnet = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", reset);
    };
  }, []);

  return null;
}
