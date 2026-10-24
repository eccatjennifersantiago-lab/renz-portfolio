"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

// Contour lines of a slowly morphing field. A calm "hole" (where the lines
// part) follows the pointer; a few bands are drawn in the red and orange accents.
const FRAG = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 res;
uniform float t;
uniform vec2 hole;
uniform float scroll;
uniform vec3 ink;
uniform float baseA;

float field(vec2 q) {
  float f = sin(q.x * 1.6 + sin(q.y * 1.3 + t * 0.18) * 1.3) * 0.55
          + sin(q.y * 1.9 + sin(q.x * 1.1 - t * 0.14) * 1.6) * 0.45
          + sin((q.x + q.y) * 0.9 + t * 0.1) * 0.35;
  vec2 d = (q - hole) * vec2(1.0, 1.25);
  return f * 0.9 + exp(-dot(d, d) * 1.8) * 2.6 + q.x * 0.35 - q.y * 0.25;
}

float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

void main() {
  float aspect = res.x / res.y;
  vec2 uv = gl_FragCoord.xy / res;
  vec2 q = (uv - 0.5) * vec2(aspect, 1.0) * 3.2;
  q.y -= scroll;
  float v = field(q) * 3.5; // line density: lower = fewer lines
  float w = fwidth(v);
  // Hairline width (~1px): raise these two numbers for thicker lines.
  float a = 1.0 - smoothstep(w * 0.2, w * 0.85, abs(fract(v) - 0.5));
  vec2 d = (q - hole) * vec2(1.0, 1.25);
  a *= 1.0 - exp(-dot(d, d) * 2.4) * 0.9;

  float r = hash(floor(v));
  float isRed = step(r, 0.06);
  float isOrange = step(0.06, r) * step(r, 0.11);
  vec3 c = mix(ink, vec3(0.863, 0.149, 0.149), isRed);
  c = mix(c, vec3(0.976, 0.451, 0.086), isOrange);
  float alpha = a * mix(baseA, 0.55, isRed + isOrange);
  gl_FragColor = vec4(c * alpha, alpha);
}`;

/** Opacity of the whole line layer, the same in every section. */
const OPACITY = 0.35;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

/**
 * Page-wide animated contour lines behind every section (content column only,
 * not the sidebar), at a constant 35% opacity.
 * Starts after load, pauses in background tabs, draws a single still frame
 * for reduced motion, and renders at reduced resolution on small screens.
 */
export function ContourBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl || !gl.getExtension("OES_standard_derivatives")) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("res"), uT = u("t"), uHole = u("hole"), uScroll = u("scroll"), uInk = u("ink"), uBase = u("baseA");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;

    // Pointer target in 0..1 of the canvas; eased every frame.
    const aim = { x: 0.62, y: 0.42 };
    const cur = { ...aim };
    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      aim.x = (e.clientX - r.left) / r.width;
      aim.y = (e.clientY - r.top) / r.height;
    };
    if (fine && !reduced) window.addEventListener("pointermove", onPointer, { passive: true });

    let opacity = 0;
    let frame = 0;
    let running = false;
    let skip = false;
    const t0 = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, small ? 2 : 1.5) * (small ? 0.6 : 1);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const render = (now: number) => {
      resize();
      const time = reduced ? 8 : (now - t0) / 1000;
      if (!fine && !reduced) {
        // No pointer: let the calm area wander slowly on its own.
        aim.x = 0.5 + Math.sin(time * 0.13) * 0.28;
        aim.y = 0.45 + Math.cos(time * 0.1) * 0.22;
      }
      cur.x += (aim.x - cur.x) * (reduced ? 1 : 0.035);
      cur.y += (aim.y - cur.y) * (reduced ? 1 : 0.035);
      const aspect = canvas.width / canvas.height;
      const scroll = (window.scrollY / window.innerHeight) * 0.6;
      const dark = document.documentElement.dataset.theme === "dark";

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, time);
      gl.uniform2f(uHole, (cur.x - 0.5) * aspect * 3.2, (0.5 - cur.y) * 3.2 - scroll);
      gl.uniform1f(uScroll, scroll);
      gl.uniform3f(uInk, dark ? 1 : 0.08, dark ? 1 : 0.08, dark ? 1 : 0.08);
      gl.uniform1f(uBase, dark ? 0.16 : 0.2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // Fades in to a constant 35% across every section.
      opacity += (OPACITY - opacity) * (reduced ? 1 : 0.05);
      canvas.style.opacity = opacity.toFixed(3);
    };

    const loop = (now: number) => {
      // Phones draw every other frame (the motion is slow, 30 fps is plenty).
      if (!(small && (skip = !skip))) render(now);
      if (running) frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduced) {
        render(performance.now());
        return;
      }
      if (running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onResize = () => reduced && render(performance.now());

    // Start once the page has loaded and gone idle, so first paint stays fast.
    let idle = 0;
    const begin = () => {
      start();
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("resize", onResize);
      if (reduced) window.addEventListener("scroll", onResize, { passive: true });
    };
    const schedule = () => {
      idle =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(begin, { timeout: 1500 })
          : window.setTimeout(begin, 300);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      stop();
      window.removeEventListener("load", schedule);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 right-0 left-0 z-[-1] h-dvh w-auto opacity-0 lg:left-(--sidebar-w)"
    />
  );
}
