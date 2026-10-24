"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { mailtoHref, navItems, profile, type NavId } from "@/data/site";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { NavIcon } from "./NavIcon";
import { ThemeToggle } from "./ThemeToggle";
import { useActiveSection } from "./useActiveSection";

const sectionIds = navItems.map((item) => item.id);

/** Desktop sidebar (lg and up) and compact mobile header, sharing one scrollspy. */
export function SiteNav() {
  const active = useActiveSection(sectionIds) as NavId;
  return (
    <>
      <Sidebar active={active} />
      <MobileHeader active={active} />
    </>
  );
}

function Sidebar({ active }: { active: NavId }) {
  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ top: number; height: number } | null>(null);

  // Slide the highlight to the active link.
  useEffect(() => {
    const measure = () => {
      const nav = navRef.current;
      const link = nav?.querySelector<HTMLElement>(`[data-nav="${active}"]`);
      if (!nav || !link) return;
      const a = link.getBoundingClientRect();
      setPill({ top: a.top - nav.getBoundingClientRect().top, height: a.height });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <aside
      aria-label="Profile and site navigation"
      className="fixed inset-y-0 left-0 z-30 hidden w-(--sidebar-w) border-r border-line bg-surface/70 backdrop-blur-sm lg:block"
    >
      <div className="flex h-full flex-col overflow-y-auto px-6 pt-9 pb-6">
        <div className="flex flex-col items-center text-center">
          <a href="#home" className="group relative rounded-full" aria-label="Back to top">
            <span
              aria-hidden="true"
              className="absolute inset-2 rounded-full bg-brand/40 blur-2xl transition-transform duration-500 group-hover:scale-125"
            />
            <Image
              src={profile.avatar.src}
              alt={profile.avatar.alt}
              width={112}
              height={112}
              priority
              className="relative size-28 rounded-full object-cover shadow-card ring-4 ring-surface transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:scale-105 group-hover:-rotate-3"
            />
          </a>
          <p className="mt-5 text-lg leading-tight font-bold tracking-tight">{profile.name}</p>
          <p className="mt-1 text-sm text-muted">{profile.title}</p>
          <div className="mt-4">
            <AvailabilityBadge />
          </div>
        </div>

        <hr className="my-6 border-line" />

        <nav ref={navRef} aria-label="Sections" className="relative">
          {/* Sliding highlight behind the active link. */}
          <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 block rounded-xl bg-wash transition-[transform,height,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
              style={{
                transform: `translateY(${pill?.top ?? 0}px)`,
                height: pill?.height ?? 0,
                opacity: pill ? 1 : 0,
              }}
            >
              <span className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-full bg-brand" />
          </span>
          <ul className="relative space-y-1">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    data-nav={item.id}
                    aria-current={isActive ? "location" : undefined}
                    className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition-colors duration-300 ${
                      isActive ? "text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    <NavIcon
                      id={item.id}
                      className={`size-[19px] transition-[transform,color] duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-translate-y-0.5 group-hover:scale-115 ${
                        isActive ? "text-brand-ink" : "text-muted group-hover:text-brand-ink"
                      }`}
                    />
                    <span className="transition-transform duration-300 group-hover:translate-x-1">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto space-y-3 pt-8">
          <ThemeToggle />
          <a
            href={mailtoHref}
            data-magnetic
            className="flex items-center justify-center gap-1.5 rounded-xl bg-night px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/10 transition-[background-color,transform] duration-300 hover:bg-brand"
          >
            Email me
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </aside>
  );
}

function MobileHeader({ active }: { active: NavId }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  // Close the menu if the viewport grows into the desktop layout.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const activeLabel = navItems.find((n) => n.id === active)?.label;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md lg:hidden">
      <div className="flex h-16 items-center gap-2 px-4 sm:px-6">
        <a href="#home" className="flex min-w-0 items-center gap-3 rounded-lg">
          <Image
            src={profile.avatar.src}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full object-cover ring-2 ring-surface"
          />
          <span className="min-w-0">
            <span className="block truncate text-[15px] leading-tight font-bold">{profile.name}</span>
            <span className="block truncate text-xs text-muted">{profile.title}</span>
          </span>
        </a>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ThemeToggle variant="icon" />
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-semibold shadow-card"
          >
            <span className="relative grid size-4 place-items-center" aria-hidden="true">
              <Menu className={`absolute size-4 transition-all duration-300 ${open ? "scale-50 rotate-90 opacity-0" : ""}`} />
              <X className={`absolute size-4 transition-all duration-300 ${open ? "" : "scale-50 -rotate-90 opacity-0"}`} />
            </span>
            <span>{open ? "Close" : "Menu"}</span>
            <span className="sr-only">
              navigation{activeLabel ? `, current section ${activeLabel}` : ""}
            </span>
          </button>
        </div>
      </div>

      {/* Floats over the page (no layout shift, so anchor jumps land correctly).
          Height animates via grid rows; `inert` removes it from tab order while closed. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        inert={!open}
        className={`absolute inset-x-0 top-full grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="border-b border-line bg-paper/95 px-4 pt-3 pb-5 shadow-lift backdrop-blur-md sm:px-6">
            <nav aria-label="Sections">
              <ul className="grid grid-cols-2 gap-2">
                {navItems.map((item, i) => {
                  const isActive = active === item.id;
                  return (
                    <li
                      key={item.id}
                      className={`transition-[opacity,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
                      style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
                    >
                      <a
                        href={`#${item.id}`}
                        onClick={() => setOpen(false)}
                        aria-current={isActive ? "location" : undefined}
                        className={`flex min-h-12 items-center gap-2.5 rounded-xl border px-3.5 text-[15px] font-medium transition-colors ${
                          isActive ? "border-brand bg-brand text-white" : "border-line bg-surface text-fg"
                        }`}
                      >
                        <NavIcon id={item.id} className={`size-[18px] ${isActive ? "text-white" : "text-brand-ink"}`} />
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="mt-4 flex items-center justify-between gap-3">
              <AvailabilityBadge />
              <a
                href={mailtoHref}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-semibold text-white"
              >
                Email me
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
