"use client";

import { useEffect, useRef, useState } from "react";

/** Splits "$13,849.21" into prefix "$", number 13849.21, suffix "", 2 decimals, grouped. */
function parse(value: string) {
  const match = value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  if (!match) return null;
  const [, prefix, num, suffix] = match;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return { prefix, suffix, target: Number(num.replace(/,/g, "")), decimals, grouped: num.includes(",") };
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Counts a figure up from zero each time it scrolls into view, then lands on
 * the exact original string. The server renders the final value, screen
 * readers always get it, and an invisible copy reserves the width so nothing
 * shifts while digits grow.
 */
export function CountUp({ value, duration = 2000, delay = 0 }: { value: string; duration?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const parts = parse(value);
    const el = ref.current;
    if (!parts || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const format = (n: number) =>
      parts.prefix +
      n.toLocaleString("en-US", {
        minimumFractionDigits: parts.decimals,
        maximumFractionDigits: parts.decimals,
        useGrouping: parts.grouped,
      }) +
      parts.suffix;

    let frame = 0;
    let timer = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        if (t >= 1) {
          setDisplay(value);
          return;
        }
        setDisplay(format(parts.target * easeOutExpo(t)));
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    // Counts as soon as a fifth of the figure is visible; resets only once it
    // is fully off screen, so a partly visible figure never sits at zero.
    let counted = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.2 && !counted) {
          counted = true;
          setDisplay(format(0));
          timer = window.setTimeout(run, delay);
        } else if (!entry.isIntersecting) {
          counted = false;
          window.clearTimeout(timer);
          cancelAnimationFrame(frame);
          setDisplay(format(0));
        }
      },
      { threshold: [0, 0.2] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [value, duration, delay]);

  return (
    <span ref={ref} className="relative inline-block tabular-nums">
      <span className="invisible" aria-hidden="true">
        {value}
      </span>
      <span className="absolute inset-0" aria-hidden="true">
        {display}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
