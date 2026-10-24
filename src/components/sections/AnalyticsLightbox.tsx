"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { caseStudy } from "@/data/site";

const shot = caseStudy.screenshot;

/**
 * Button + modal for the original analytics screenshot (the evidence behind
 * the animated chart). Uses the native <dialog>,
 * which makes the rest of the page inert, traps Tab focus and closes on
 * Escape. Focus returns to the button when the dialog closes.
 */
export function AnalyticsLightbox() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const show = useCallback(() => {
    dialogRef.current?.showModal();
    setOpen(true);
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setOpen(false);
      triggerRef.current?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  // Stop the page behind the modal from scrolling.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition-colors duration-300 hover:border-white/40 hover:bg-white/10 focus-visible:outline-white"
      >
        <Maximize2 className="size-4 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
        View original screenshot
      </button>

      <dialog
        ref={dialogRef}
        aria-label="YouTube analytics screenshot"
        onClick={(e) => {
          // A click on the backdrop lands on the dialog element itself.
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          // The close button is the only control: keep Tab focus on it.
          if (e.key === "Tab") {
            e.preventDefault();
            closeRef.current?.focus();
          }
        }}
        className="lightbox m-auto max-h-none max-w-none bg-transparent p-0"
      >
        <div className="flex w-[min(92vw,1200px)] flex-col items-end gap-3">
          <button
            type="button"
            ref={closeRef}
            onClick={close}
            autoFocus
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-night shadow-lift focus-visible:outline-white"
          >
            <X className="size-4" aria-hidden="true" />
            Close
            <span className="sr-only">analytics screenshot</span>
          </button>
          <figure className="w-full">
            {/* Only fetched once the dialog opens. */}
            {open ? (
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                sizes="92vw"
                className="mx-auto h-auto max-h-[78dvh] w-full rounded-xl object-contain"
              />
            ) : null}
            <figcaption className="mt-3 text-center text-sm text-white/80">{caseStudy.disclosure}</figcaption>
          </figure>
        </div>
      </dialog>
    </>
  );
}
