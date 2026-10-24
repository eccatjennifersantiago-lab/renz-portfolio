"use client";

import { useEffect } from "react";

const INTERACTIVE = "a, button, [data-cursor], summary, label, [role='button']";
const TEXT_INPUT =
  "input:not([type='button'],[type='submit'],[type='checkbox'],[type='radio']), textarea, select, [contenteditable='true']";

/**
 * Dot + ring cursor in plain DOM and requestAnimationFrame (no libraries).
 * - Fine pointers only; touch devices keep their normal behaviour.
 * - The dot follows the pointer directly; the ring trails on a spring.
 * - Reduced motion: the ring snaps to the pointer with no easing.
 * - Keyboard focus outlines are untouched; native cursor returns in text inputs.
 */
export function CustomCursor() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let teardown: (() => void) | null = null;

    const setup = () => {
      const root = document.documentElement;
      const dot = document.createElement("div");
      const ring = document.createElement("div");
      dot.className = "cursor-dot";
      ring.className = "cursor-ring";
      dot.setAttribute("aria-hidden", "true");
      ring.setAttribute("aria-hidden", "true");
      document.body.append(dot, ring);
      root.classList.add("has-custom-cursor");

      const pointer = { x: 0, y: 0 };
      const pos = { x: 0, y: 0 };
      const vel = { x: 0, y: 0 };
      let scale = 1;
      let target = 1;
      let started = false;
      let frame = 0;

      const show = (visible: boolean) => {
        dot.classList.toggle("is-visible", visible);
        ring.classList.toggle("is-visible", visible);
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        // The dot sits exactly on the pointer, with no easing.
        dot.style.transform = `translate(${pointer.x - 4}px, ${pointer.y - 4}px)`;
        if (!started) {
          started = true;
          pos.x = pointer.x;
          pos.y = pointer.y;
        }
        const overText = (e.target as Element | null)?.closest?.(TEXT_INPUT);
        show(!overText);
      };

      const onOver = (e: PointerEvent) => {
        const hit = (e.target as Element | null)?.closest?.(INTERACTIVE);
        target = hit ? 1.7 : 1;
        ring.classList.toggle("is-active", Boolean(hit));
      };

      const onLeave = () => show(false);
      const onWindowOut = (e: MouseEvent) => {
        if (!e.relatedTarget) show(false);
      };

      const tick = () => {
        if (started) {
          if (reduced.matches) {
            pos.x = pointer.x;
            pos.y = pointer.y;
            scale = target;
          } else {
            vel.x += (pointer.x - pos.x) * 0.1;
            vel.y += (pointer.y - pos.y) * 0.1;
            vel.x *= 0.78;
            vel.y *= 0.78;
            pos.x += vel.x;
            pos.y += vel.y;
            scale += (target - scale) * 0.18;
          }
          ring.style.transform = `translate(${pos.x - 19}px, ${pos.y - 19}px) scale(${scale})`;
        }
        frame = requestAnimationFrame(tick);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      window.addEventListener("mouseout", onWindowOut);
      window.addEventListener("blur", onLeave);
      frame = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("mouseout", onWindowOut);
        window.removeEventListener("blur", onLeave);
        dot.remove();
        ring.remove();
        root.classList.remove("has-custom-cursor");
      };
    };

    const sync = () => {
      if (fine.matches && !teardown) teardown = setup();
      if (!fine.matches && teardown) {
        teardown();
        teardown = null;
      }
    };

    sync();
    fine.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      teardown?.();
    };
  }, []);

  return null;
}
