// Builds the Home background animation from green-screen footage.
//
// Usage: node scripts/prepare-playbuttons.mjs <video.mp4 | frames-dir>
//
// A video file is preferred: it is far cleaner than exported JPEG frames.
// 1. Keys out the green screen with a soft, anti-aliased matte and removes
//    green spill from the edges.
// 2. Crossfades the tail into the head so the clip loops without a jump.
// 3. Packs colour (top half) and alpha (bottom half) into one H.264 MP4, which
//    plays everywhere; a small WebGL shader recombines them in the browser.
// 4. Writes a transparent WebP poster for reduced motion / no-WebGL fallback.
// Needs ffmpeg on PATH.
import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import { spawn, execFileSync } from "node:child_process";
import path from "node:path";

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/prepare-playbuttons.mjs <video.mp4 | frames-dir>");
  process.exit(1);
}

const W = 1600;
const H = 900;
const OVERLAP_SECONDS = 1;
const OUT_DIR = "public/media";
const FRAME_BYTES = W * H * 3;

const isDir = (await stat(input)).isDirectory();

/** Frame rate and count of the source. */
function probe() {
  if (isDir) return null;
  const out = execFileSync("ffprobe", [
    "-v", "error", "-select_streams", "v:0", "-count_packets",
    "-show_entries", "stream=r_frame_rate,nb_read_packets", "-of", "csv=p=0", input,
  ]).toString().trim();
  const [rate, count] = out.split(",");
  const [num, den] = rate.split("/").map(Number);
  return { fps: num / den, total: Number(count) };
}

/** Yields raw RGB24 frames (W x H) in order. */
async function* frames() {
  if (isDir) {
    const files = (await readdir(input)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
    for (const f of files) {
      yield await sharp(path.join(input, f)).resize(W, H).removeAlpha().raw().toBuffer();
    }
    return;
  }
  const dec = spawn("ffmpeg", [
    "-loglevel", "error", "-i", input,
    "-vf", `scale=${W}:${H}:flags=lanczos`, "-f", "rawvideo", "-pix_fmt", "rgb24", "-",
  ]);
  let pending = Buffer.alloc(0);
  for await (const chunk of dec.stdout) {
    pending = Buffer.concat([pending, chunk]);
    while (pending.length >= FRAME_BYTES) {
      yield pending.subarray(0, FRAME_BYTES);
      pending = pending.subarray(FRAME_BYTES);
    }
  }
}

/** Soft chroma key: straight-alpha RGBA with green removed and edges smoothed. */
function key(rgb) {
  const n = W * H;
  const alpha = new Float32Array(n);
  const out = Buffer.alloc(n * 4);
  for (let i = 0, p = 0; i < n; i++, p += 3) {
    const r = rgb[p];
    const g = rgb[p + 1];
    const b = rgb[p + 2];
    const spill = g - Math.max(r, b);
    // Spill above 64 is screen; below 16 is subject; smooth ramp in between.
    const t = Math.min(1, Math.max(0, (64 - spill) / 48));
    alpha[i] = t * t * (3 - 2 * t);
    out[i * 4] = r;
    out[i * 4 + 1] = Math.min(g, Math.max(r, b)); // despill
    out[i * 4 + 2] = b;
  }
  // 3x3 blur on the matte only, to anti-alias the cut edge.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const a = alpha[i];
      if (a === 0 || a === 1) {
        // Fast path for pixels away from an edge.
        const l = alpha[i - 1] ?? a, rr = alpha[i + 1] ?? a, u = alpha[i - W] ?? a, d = alpha[i + W] ?? a;
        if (l === a && rr === a && u === a && d === a) {
          out[i * 4 + 3] = a * 255;
          continue;
        }
      }
      let sum = 0;
      let cnt = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= H) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= W) continue;
          sum += alpha[yy * W + xx];
          cnt++;
        }
      }
      out[i * 4 + 3] = Math.round((sum / cnt) * 255);
    }
  }
  return out;
}

/** Premultiplied crossfade of two straight-alpha frames. */
function mix(from, to, t) {
  const out = Buffer.alloc(from.length);
  for (let i = 0; i < from.length; i += 4) {
    const a1 = (from[i + 3] / 255) * (1 - t);
    const a2 = (to[i + 3] / 255) * t;
    const a = a1 + a2;
    if (a > 0) {
      out[i] = Math.round((from[i] * a1 + to[i] * a2) / a);
      out[i + 1] = Math.round((from[i + 1] * a1 + to[i + 1] * a2) / a);
      out[i + 2] = Math.round((from[i + 2] * a1 + to[i + 2] * a2) / a);
    }
    out[i + 3] = Math.round(a * 255);
  }
  return out;
}

/** Colour on top, alpha matte underneath, RGB24. */
function pack(rgba) {
  const out = Buffer.alloc(W * H * 2 * 3);
  const half = W * H * 3;
  for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
    const a = rgba[i + 3];
    out[j] = a ? rgba[i] : 0;
    out[j + 1] = a ? rgba[i + 1] : 0;
    out[j + 2] = a ? rgba[i + 2] : 0;
    out[half + j] = a;
    out[half + j + 1] = a;
    out[half + j + 2] = a;
  }
  return out;
}

const info = probe();
const fps = info?.fps ?? 26;
const total = info?.total ?? (await readdir(input)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).length;
const overlap = Math.round(fps * OVERLAP_SECONDS);
const length = total - overlap;
const posterAt = Math.round(length * 0.45);

await mkdir(OUT_DIR, { recursive: true });
const enc = spawn(
  "ffmpeg",
  [
    "-y", "-loglevel", "error",
    "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${W}x${H * 2}`, "-r", String(fps), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", "-an",
    path.join(OUT_DIR, "playbuttons-packed.mp4"),
  ],
  { stdio: ["pipe", "inherit", "inherit"] },
);
const done = new Promise((resolve, reject) =>
  enc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)))),
);
const write = async (rgba) => {
  if (!enc.stdin.write(pack(rgba))) await new Promise((r) => enc.stdin.once("drain", r));
};

// The loop starts at frame `overlap`, so frames stream straight through; the
// head is held back and crossfaded with the tail at the end. Rotating the
// start point keeps the loop seamless.
const head = [];
let index = 0;
for await (const rgb of frames()) {
  const frame = key(rgb);
  if (index < overlap) {
    head.push(frame);
  } else if (index < length) {
    await write(frame);
    if (index === posterAt) {
      await sharp(frame, { raw: { width: W, height: H, channels: 4 } })
        .resize(1280)
        .webp({ quality: 82, alphaQuality: 95 })
        .toFile(path.join(OUT_DIR, "playbuttons-poster.webp"));
    }
  } else {
    const k = index - length; // tail frame k blends into head frame k
    await write(mix(frame, head[k], k / overlap));
  }
  if (index % 40 === 0) console.log(`frame ${index + 1}/${total}`);
  index++;
}
enc.stdin.end();
await done;

// Lighter copy for phones (both halves scale together, so the alpha stays aligned).
execFileSync("ffmpeg", [
  "-y", "-loglevel", "error", "-i", path.join(OUT_DIR, "playbuttons-packed.mp4"),
  "-vf", "scale=960:1080:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "22",
  "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", path.join(OUT_DIR, "playbuttons-packed-small.mp4"),
]);
console.log(`Wrote ${length} frames at ${fps} fps (${W}x${H}) to ${OUT_DIR}/`);
