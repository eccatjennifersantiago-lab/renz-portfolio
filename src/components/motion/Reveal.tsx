"use client";

import { useEffect, useRef, useState, type HTMLAttributes } from "react";

type RevealState = "static" | "pending" | "in";

type RevealProps = HTMLAttributes<HTMLElement> & {
  /** Element to render (div, ul, section, h2...). */
  as?: "div" | "ul" | "ol" | "dl" | "p" | "h2" | "section";
  /** Animate the children one after another (each child sets --i) instead of the element itself. */
  stagger?: boolean;
};

/**
 * Scroll reveal that keeps its state in React, so hydration never sees
 * outside edits. States:
 *  - "static": server render, reduced motion, or already on screen at load (fully visible)
 *  - "pending": below the fold at load; hidden until it scrolls in
 *  - "in": scrolled into view; CSS plays the entrance
 */
export function Reveal({ as = "div", stagger = false, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let first = true;
    const io = new IntersectionObserver(([entry]) => {
      if (first) {
        first = false;
        if (entry.isIntersecting) io.disconnect();
        else setState("pending");
        return;
      }
      if (entry.isIntersecting) {
        setState("in");
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Every allowed tag shares HTMLElement props; typing as "div" keeps JSX simple.
  const Tag = as as "div";
  const stateAttr = stagger ? { "data-stagger": state } : { "data-reveal": state };
  return <Tag ref={ref} {...rest} {...stateAttr} />;
}
