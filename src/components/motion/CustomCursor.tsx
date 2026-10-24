"use client";

import { useEffect } from "react";

const WORD = "YOUTUBE";
const FONT = '800 26px "Plus Jakarta Sans", system-ui, sans-serif';
const STEP = 2; // sampling grid in px: smaller = more particles
const OFFSET = { x: 14, y: 22 }; // word's top-left relative to the cursor tip

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number; // home position inside the word
  ty: number;
  k: number; // spring stiffness: varied so the swarm trails and swirls
  hue: 0 | 1 | 2; // 0 ink, 1 red, 2 orange
};

/** Pixel positions that make up the word, sampled from an offscreen canvas. */
function sampleWord(): { points: { x: number; y: number }[]; width: number } {
  const c = document.createElement("canvas");
  const g = c.getContext("2d")!;
  g.font = FONT;
  const width = Math.ceil(g.measureText(WORD).width);
  c.width = width + 4;
  c.height = 34;
  g.font = FONT;
  g.textBaseline = "top";
  g.fillStyle = "#000";
  g.fillText(WORD, 2, 2);
  const { data } = g.getImageData(0, 0, c.width, c.height);
  const points = [];
  for (let y = 0; y < c.height; y += STEP) {
    for (let x = 0; x < c.width; x += STEP) {
      if (data[(y * c.width + x) * 4 + 3] > 128) points.push({ x, y });
    }
  }
  return { points, width: c.width };
}

/**
 * Particle-text cursor: the native arrow stays, and a swarm of particles
 * trails it while it moves, then settles into the word "YOUTUBE" beside it.
 * Fine pointers only; off for reduced motion and touch. Hidden while a modal
 * is open or the pointer leaves the window. Keyboard focus is untouched.
 */
export function CustomCursor() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let teardown: (() => void) | null = null;

    const setup = () => {
      // Two layers: white "ink" particles blended with difference, so they show
      // as white on dark areas and black on light ones; accents drawn normally.
      const makeLayer = (cls: string) => {
        const c = document.createElement("canvas");
        c.className = cls;
        c.setAttribute("aria-hidden", "true");
        document.body.append(c);
        return { c, g: c.getContext("2d")! };
      };
      const inkLayer = makeLayer("cursor-text cursor-text-ink");
      const accentLayer = makeLayer("cursor-text");
      const layers = [inkLayer, accentLayer];

      let particles: Particle[] = [];
      let wordWidth = 0;
      const build = () => {
        const { points, width } = sampleWord();
        wordWidth = width;
        particles = points.map((p) => {
          const r = Math.random();
          return {
            x: mouse.x,
            y: mouse.y,
            vx: 0,
            vy: 0,
            tx: p.x,
            ty: p.y,
            k: 0.025 + Math.random() * 0.075,
            hue: r < 0.07 ? 1 : r < 0.12 ? 2 : 0,
          };
        });
      };

      const mouse = { x: -200, y: -200 };
      let visible = false;
      let started = false;
      let frame = 0;
      let running = false;
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        for (const { c, g } of layers) {
          c.width = Math.round(window.innerWidth * dpr);
          c.height = Math.round(window.innerHeight * dpr);
          g.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      };
      resize();

      const tick = () => {
        for (const { g } of layers) g.clearRect(0, 0, window.innerWidth, window.innerHeight);
        inkLayer.g.fillStyle = "rgba(255,255,255,0.9)";
        const modalOpen = !!document.querySelector("dialog[open]");
        const show = visible && !modalOpen;
        // Keep the word on screen near the right edge.
        const flip = mouse.x + OFFSET.x + wordWidth > window.innerWidth - 8;
        const ox = flip ? mouse.x - OFFSET.x - wordWidth : mouse.x + OFFSET.x;
        const oy = mouse.y + OFFSET.y;
        let energy = 0;
        for (const p of particles) {
          const ax = (ox + p.tx - p.x) * p.k;
          const ay = (oy + p.ty - p.y) * p.k;
          p.vx = (p.vx + ax) * 0.84;
          p.vy = (p.vy + ay) * 0.84;
          p.x += p.vx;
          p.y += p.vy;
          energy += Math.abs(p.vx) + Math.abs(p.vy);
          if (!show) continue;
          if (p.hue === 0) {
            inkLayer.g.fillRect(p.x, p.y, 1.6, 1.6);
          } else {
            accentLayer.g.fillStyle = p.hue === 1 ? "rgb(220,38,38)" : "rgb(249,115,22)";
            accentLayer.g.fillRect(p.x, p.y, 1.6, 1.6);
          }
        }
        // Sleep once the word has fully settled; the next move wakes it.
        if (energy < particles.length * 0.01) {
          running = false;
          return;
        }
        frame = requestAnimationFrame(tick);
      };

      const wake = () => {
        if (running) return;
        running = true;
        frame = requestAnimationFrame(tick);
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        if (!started) {
          started = true;
          build();
        }
        visible = true;
        wake();
      };
      const hide = () => {
        visible = false;
        wake();
      };
      const onWindowOut = (e: MouseEvent) => {
        if (!e.relatedTarget) hide();
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("mouseout", onWindowOut);
      window.addEventListener("blur", hide);
      window.addEventListener("resize", resize);
      // Re-sample once the web font is ready so the letters use the site font.
      document.fonts?.ready.then(() => started && build());

      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("mouseout", onWindowOut);
        window.removeEventListener("blur", hide);
        window.removeEventListener("resize", resize);
        layers.forEach(({ c }) => c.remove());
      };
    };

    const sync = () => {
      const want = fine.matches && !reduced.matches;
      if (want && !teardown) teardown = setup();
      if (!want && teardown) {
        teardown();
        teardown = null;
      }
    };

    sync();
    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
      teardown?.();
    };
  }, []);

  return null;
}
