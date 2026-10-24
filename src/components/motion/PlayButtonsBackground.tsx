"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/media/playbuttons-packed.mp4"; // 1600 x 900
const VIDEO_SMALL_SRC = "/media/playbuttons-packed-small.mp4"; // 960 x 540, for phones
const POSTER_SRC = "/media/playbuttons-poster.webp";
const W = 1600;
const H = 900;

const VERT = `
attribute vec2 p;
varying vec2 uv;
void main() {
  uv = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5);
  gl_Position = vec4(p, 0.0, 1.0);
}`;

// The video holds colour in its top half and the alpha matte in its bottom half.
const FRAG = `
precision mediump float;
varying vec2 uv;
uniform sampler2D tex;
void main() {
  vec3 color = texture2D(tex, vec2(uv.x, uv.y * 0.5)).rgb;
  float alpha = texture2D(tex, vec2(uv.x, 0.5 + uv.y * 0.5)).r;
  alpha = smoothstep(0.04, 0.96, alpha);
  gl_FragColor = vec4(color * alpha, alpha);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

/**
 * Home background: gold and silver awards rotating on a transparent layer.
 * The keyed animation is drawn with WebGL from a packed-alpha MP4 (works in
 * every modern browser), drifts with the pointer, scales with the scroll and
 * pauses when off screen. It starts once the page has loaded and gone idle,
 * so it never competes with the first paint. Reduced motion or no WebGL
 * shows a still frame instead.
 *
 * placement="intro" fills the welcome screen instead: it starts at once,
 * ignores scrolling, and only runs while the welcome screen is showing.
 */
export function PlayButtonsBackground({ placement = "hero" }: { placement?: "hero" | "intro" }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // CSS shows the still frame
    const isIntro = placement === "intro";
    const introShowing = document.documentElement.dataset.intro === "show";
    if (isIntro && !introShowing) return; // welcome screen skipped this visit

    let cancelled = false;
    let teardown: (() => void) | undefined;

    const setup = (): (() => void) | undefined => {
      const canvas = canvasRef.current;
      const layer = layerRef.current;
      const video = videoRef.current;
      if (!canvas || !layer || !video) return;

      const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
      if (!gl || gl.isContextLost()) {
        setFallback(true);
        return;
      }

      const program = gl.createProgram()!;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        setFallback(true);
        return;
      }
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.clearColor(0, 0, 0, 0);

      // Phones get the lighter 960px version; the canvas matches the video size.
      const small = window.matchMedia("(max-width: 767px)").matches;
      canvas.width = small ? 960 : W;
      canvas.height = small ? 540 : H;
      gl.viewport(0, 0, canvas.width, canvas.height);
      // Source is attached here, so reduced-motion visitors never download it.
      video.src = small ? VIDEO_SMALL_SRC : VIDEO_SRC;

      let visible = true;
      let frame = 0;
      let shown = false;
      const startedAt = performance.now();

      // Pointer parallax, eased toward its target every frame.
      const fine = window.matchMedia("(pointer: fine)").matches;
      const aim = { x: 0, y: 0 };
      const cur = { x: 0, y: 0 };
      const onPointer = (e: PointerEvent) => {
        aim.x = e.clientX / window.innerWidth - 0.5;
        aim.y = e.clientY / window.innerHeight - 0.5;
      };
      if (fine) window.addEventListener("pointermove", onPointer, { passive: true });

      const draw = () => {
        if (video.readyState >= 2) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          if (!shown) {
            shown = true;
            setLive(true);
          }
        }
        cur.x += (aim.x - cur.x) * 0.06;
        cur.y += (aim.y - cur.y) * 0.06;
        const scroll = isIntro ? 0 : Math.min(window.scrollY, 900);
        // Scale: grows in over the first 1.6 s, then zooms gently as you scroll.
        const grow = Math.min(1, (performance.now() - startedAt) / 1600);
        const scale = 0.82 + 0.18 * (1 - Math.pow(1 - grow, 3)) + (scroll / 900) * 0.22;
        layer.style.transform =
          `translate3d(${(-cur.x * 48).toFixed(2)}px, ${(-cur.y * 32 + scroll * 0.18).toFixed(2)}px, 0) scale(${scale.toFixed(4)}) ` +
          `rotateY(${(cur.x * 6).toFixed(2)}deg) rotateX(${(-cur.y * 4).toFixed(2)}deg)`;
        if (visible) frame = requestAnimationFrame(draw);
      };

      const start = () => {
        visible = true;
        video.play().catch(() => {});
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(draw);
      };
      const stop = () => {
        visible = false;
        video.pause();
        cancelAnimationFrame(frame);
      };

      const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
      io.observe(layer);
      const onVisibility = () => (document.hidden ? stop() : start());
      document.addEventListener("visibilitychange", onVisibility);

      return () => {
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pointermove", onPointer);
        stop();
        video.removeAttribute("src");
        video.load();
        // No forced context loss: React may re-run this effect on the same
        // canvas (Strict Mode), and getContext would hand back a dead context.
        gl.deleteTexture(texture);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
      };
    };

    let idle = 0;
    let introFrame = 0;
    const begin = () => {
      if (!cancelled) teardown = setup();
    };
    // Hero: wait for the page to finish loading, then for an idle moment.
    const schedule = () => {
      idle =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(begin, { timeout: 2000 })
          : window.setTimeout(begin, 500);
    };
    const whenLoaded = () => {
      if (document.readyState === "complete") schedule();
      else window.addEventListener("load", schedule, { once: true });
    };
    if (isIntro) {
      // Welcome screen: start at the first idle moment (within 0.4 s), after hydration.
      introFrame =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(begin, { timeout: 400 })
          : requestAnimationFrame(begin);
    }
    else if (introShowing) window.addEventListener("introdone", whenLoaded, { once: true }); // one video at a time
    else whenLoaded();

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(introFrame);
      cancelAnimationFrame(introFrame);
      window.removeEventListener("introdone", whenLoaded);
      window.removeEventListener("load", schedule);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
      teardown?.();
    };
  }, [placement]);

  const frameClass =
    placement === "intro"
      ? "absolute top-1/2 left-1/2 w-[max(160vw,200vh)] -translate-x-1/2 -translate-y-1/2 [perspective:1200px] md:w-[max(110vw,200vh)]"
      : "absolute top-[2%] right-[-55%] w-[175%] [perspective:1200px] sm:right-[-24%] sm:w-[128%] lg:top-[-6%] lg:right-[-16%] lg:w-[100%]";
  const maskClass =
    placement === "intro"
      ? "[mask-image:radial-gradient(ellipse_at_center,#000_62%,transparent_96%)]"
      : "[mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent),linear-gradient(to_bottom,transparent,#000_6%,#000_92%,transparent)] [mask-composite:intersect]";

  return (
    // Not clipped here: the page column clips it at the window edge instead,
    // so the awards are never cut off at the section border.
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-0 ${placement === "intro" ? "overflow-hidden" : ""}`}>
      <div className={frameClass}>
        <div
          ref={layerRef}
          className={`relative aspect-video will-change-transform ${maskClass}`}
        >
          {/* Decoder source for the canvas: 1px and invisible (WebGL still reads full
              frames). Kept in the page because Chrome pauses detached muted video. */}
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            className="absolute top-0 left-0 size-px opacity-0"
          />
          {/* Still frame: only for reduced motion or when WebGL is unavailable. */}
          <Image
            src={POSTER_SRC}
            alt=""
            width={1280}
            height={720}
            loading="lazy"
            className={`absolute inset-0 size-full object-contain motion-reduce:block ${fallback ? "block" : "hidden"}`}
          />
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className={`absolute inset-0 size-full transition-opacity duration-1000 ${live ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      </div>
    </div>
  );
}
