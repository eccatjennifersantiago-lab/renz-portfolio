"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowUp } from "lucide-react";
import { caseStudy } from "@/data/site";
import { viewsSeries } from "@/data/views-series";
import { CountUp } from "@/components/motion/CountUp";

const values = viewsSeries.values;
const LAST = values.length - 1;
const Y_MAX = 9_000_000;

// SVG paths in a 364 x 900 box (one unit per day, 10k views per unit),
// stretched to fit; the stroke stays crisp via non-scaling-stroke.
const toY = (v: number) => (900 - v / 10_000).toFixed(1);
const linePath = values.map((v, i) => `${i ? "L" : "M"}${i},${toY(v)}`).join("");
const areaPath = `${linePath}L${LAST},900L0,900Z`;

/** Studio's x-axis ticks: day index from Oct 16, 2025 and its label. */
const ticks = [
  { day: 0, label: "Oct 16, 2025", always: true },
  { day: 61, label: "Dec 16, 2025" },
  { day: 121, label: "Feb 14, 2026" },
  { day: 182, label: "Apr 16, 2026", always: true },
  { day: 243, label: "Jun 16, 2026" },
  { day: 303, label: "Aug 15, 2026" },
  { day: 364, label: "Oct 15, 2026", always: true },
];

const [startY, startM, startD] = viewsSeries.start.split("-").map(Number);
const dayLabel = (i: number) =>
  new Date(Date.UTC(startY, startM - 1, startD + i)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

const compact = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${Math.round(v / 1_000)}K` : String(v);

/** KPI tiles in YouTube Studio's order. Figures come from site content. */
const metric = (label: string) => caseStudy.metrics.find((m) => m.label === label)!.value;
const kpis = [
  { title: "Views", value: metric("views"), label: "views" },
  { title: "Watch time (hours)", value: metric("watch hours"), label: "watch hours", growth: true },
  { title: "Subscribers", value: metric("subscribers gained"), label: "subscribers gained", growth: true },
  { title: "Estimated revenue", value: metric("estimated revenue"), label: "estimated revenue" },
];

type DrawState = "static" | "pending" | "in";

/**
 * YouTube Studio overview rebuilt as live HTML/SVG: figures count up, the
 * daily-views line draws in when scrolled into view, and hovering (or arrow
 * keys) reads out the date and approximate views for each day.
 */
export function AnalyticsPanel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [draw, setDraw] = useState<DrawState>("static");
  const [active, setActive] = useState<number | null>(null);
  const [fromKeyboard, setFromKeyboard] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let first = true;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          setDraw("pending");
          if (entry.isIntersecting) frame = requestAnimationFrame(() => setDraw("in"));
          return;
        }
        if (entry.isIntersecting) {
          setDraw("in");
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const pick = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setFromKeyboard(false);
    setActive(Math.round(t * LAST));
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 7 : 1;
    const current = active ?? LAST;
    let next: number | null = null;
    if (e.key === "ArrowLeft") next = current - step;
    if (e.key === "ArrowRight") next = current + step;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = LAST;
    if (next === null) return;
    e.preventDefault();
    setFromKeyboard(true);
    setActive(Math.min(LAST, Math.max(0, next)));
  };

  const readout = active === null ? "" : `${dayLabel(active)} · ≈ ${compact(values[active])} views`;
  const activeLeft = active === null ? 0 : (active / LAST) * 100;
  const activeTop = active === null ? 0 : (1 - values[active] / Y_MAX) * 100;

  return (
    <div ref={rootRef} data-draw={draw} className="overflow-hidden rounded-2xl border border-white/10 bg-black/45">
      <h3 className="px-5 pt-6 text-center text-lg font-bold tracking-tight text-balance sm:text-2xl">
        My channel got <CountUp value={metric("views")} duration={2200} /> views in the last 365 days
      </h3>

      <dl className="mt-6 grid grid-cols-2 border-y border-white/10 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.title}
            className={`group relative flex flex-col items-center px-3 py-4 text-center transition-colors duration-300 sm:py-5 ${
              i === 0 ? "bg-transparent" : "bg-white/[0.05] hover:bg-white/[0.08]"
            } ${i % 2 === 1 ? "border-l border-white/10" : ""} ${i >= 2 ? "border-t border-white/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
          >
            <dt className="text-[13px] font-medium text-white/65">
              {kpi.title}
              <span className="sr-only"> ({kpi.label})</span>
            </dt>
            <dd className="mt-1.5 flex items-center gap-1.5 text-[clamp(1.25rem,2.4vw,1.9rem)] leading-none font-bold tracking-tight">
              <CountUp value={kpi.value} delay={150 + i * 120} />
              {kpi.growth ? (
                <span className="grid size-5 place-items-center rounded-full bg-emerald-600 text-white" aria-hidden="true">
                  <ArrowUp className="size-3.5" strokeWidth={3} />
                </span>
              ) : null}
            </dd>
            {kpi.growth ? (
              <dd className="mt-2 text-[11px] text-white/55 italic sm:text-xs">&gt;999% more than previous 365 days</dd>
            ) : null}
            {i === 0 ? (
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand to-accent" />
            ) : null}
          </div>
        ))}
      </dl>

      {/* Chart */}
      <div className="px-4 pt-6 pb-4 sm:px-6">
        <div className="flex gap-3">
          <div
            className="relative h-48 flex-1 cursor-crosshair touch-pan-y outline-offset-4 sm:h-60"
            role="group"
            tabIndex={0}
            data-cursor
            aria-label="Daily views over the last 365 days, traced from my YouTube Studio chart. Use the left and right arrow keys to read approximate daily views."
            onPointerDown={pick}
            onPointerMove={pick}
            onPointerLeave={() => setActive(null)}
            onKeyDown={onKey}
            onBlur={() => setActive(null)}
          >
            {/* Gridlines at 0, 3M, 6M, 9M */}
            {[0, 1, 2, 3].map((g) => (
              <span
                key={g}
                aria-hidden="true"
                className={`absolute inset-x-0 h-px ${g === 0 ? "bg-white/30" : "bg-white/10"}`}
                style={{ bottom: `${(g / 3) * 100}%` }}
              />
            ))}

            <div className="chart-clip absolute inset-0">
              <svg viewBox={`0 0 ${LAST} 900`} preserveAspectRatio="none" className="size-full overflow-visible" aria-hidden="true">
                <defs>
                  <linearGradient id="views-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#41b6e6" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#41b6e6" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#views-fill)" />
                <path
                  d={linePath}
                  fill="none"
                  stroke="#41b6e6"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            {/* Hover / keyboard readout */}
            {active !== null ? (
              <>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 bottom-0 w-px bg-white/40"
                  style={{ left: `${activeLeft}%` }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#41b6e6] shadow-[0_0_0_4px_rgb(65_182_230/0.25)]"
                  style={{ left: `${activeLeft}%`, top: `${activeTop}%` }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1 z-10 rounded-lg border border-white/15 bg-night px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-white shadow-lift"
                  style={{
                    left: `${activeLeft}%`,
                    transform: `translateX(${activeLeft > 70 ? "-100%" : activeLeft < 30 ? "0" : "-50%"})`,
                  }}
                >
                  {readout}
                </span>
              </>
            ) : null}
          </div>

          {/* Y-axis labels */}
          <div className="relative w-8 shrink-0 text-xs text-white/60 tabular-nums" aria-hidden="true">
            {["0", "3M", "6M", "9M"].map((label, g) => (
              <span key={label} className="absolute right-0 translate-y-1/2" style={{ bottom: `${(g / 3) * 100}%` }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="relative mt-3 mr-11 h-5 text-[11px] text-white/60 sm:text-xs" aria-hidden="true">
          {ticks.map((t) => (
            <span
              key={t.day}
              className={`absolute whitespace-nowrap ${t.always ? "" : "hidden md:inline"}`}
              style={{
                left: `${(t.day / LAST) * 100}%`,
                transform: `translateX(${t.day === 0 ? "0" : t.day === LAST ? "-100%" : "-50%"})`,
              }}
            >
              {t.label}
            </span>
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          {fromKeyboard ? readout : ""}
        </p>
      </div>
    </div>
  );
}
