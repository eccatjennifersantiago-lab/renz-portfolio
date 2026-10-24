"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const readTheme = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

/** Applies a theme, revealing it as a circle grown from the button when supported. */
function applyTheme(next: Theme, origin: HTMLElement) {
  const commit = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable: the choice still applies for this visit */
    }
    window.dispatchEvent(new Event("themechange"));
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !document.startViewTransition) {
    commit();
    return;
  }
  const r = origin.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const transition = document.startViewTransition(commit);
  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}

export function ThemeToggle({ variant = "full" }: { variant?: "full" | "icon" }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const sync = () => setTheme(readTheme());
    sync();
    window.addEventListener("themechange", sync);
    return () => window.removeEventListener("themechange", sync);
  }, []);

  const isDark = theme === "dark";
  const icons = (
    <span className="relative grid size-5 place-items-center" aria-hidden="true">
      <Sun
        className={`absolute size-[18px] transition-all duration-500 ${isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`}
      />
      <Moon
        className={`absolute size-[18px] transition-all duration-500 ${isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"}`}
      />
    </span>
  );

  if (variant === "icon") {
    return (
      <button
        type="button"
        aria-pressed={isDark}
        aria-label="Night mode"
        onClick={(e) => applyTheme(isDark ? "light" : "dark", e.currentTarget)}
        className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-fg shadow-card"
      >
        {icons}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={isDark}
      onClick={(e) => applyTheme(isDark ? "light" : "dark", e.currentTarget)}
      className="group flex w-full items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm font-medium transition-colors hover:border-line-strong"
    >
      <span className="text-brand-ink">{icons}</span>
      Night mode
      {/* Visual switch; state is announced by aria-pressed. */}
      <span
        aria-hidden="true"
        className={`ml-auto flex h-5 w-9 items-center rounded-full p-0.5 transition-colors duration-300 ${isDark ? "bg-brand" : "bg-line-strong"}`}
      >
        <span
          className={`size-4 rounded-full bg-white shadow transition-transform duration-300 ${isDark ? "translate-x-4" : "translate-x-0"}`}
        />
      </span>
    </button>
  );
}
