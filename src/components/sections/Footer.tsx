"use client";

import { useSyncExternalStore } from "react";
import { ArrowUp } from "lucide-react";
import { profile } from "@/data/site";

const subscribe = () => () => {};

/** Year from the visitor's system clock, read on the client so it never goes stale. */
function useCurrentYear() {
  return useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  );
}

export function Footer() {
  const year = useCurrentYear();
  return (
    <footer className="mt-4 border-t border-line py-8">
      <div className="flex flex-col gap-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-fg">{profile.name}</p>
          <p className="mt-0.5">
            {profile.title} · {profile.specialties.join(" · ")}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <p>
            © <span suppressHydrationWarning>{year ?? ""}</span> {profile.name}
          </p>
          <a
            href="#home"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-surface px-4 font-semibold text-fg transition-colors hover:border-fg"
          >
            <ArrowUp className="size-4" aria-hidden="true" />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
