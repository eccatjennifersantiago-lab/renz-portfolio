// Prepares the supplied photos for the site.
// Usage: node scripts/prepare-images.mjs <portrait> <analytics>
// The silver plaque in the portrait carries the channel name; that one line
// is blurred so the channel stays private. Nothing else in the photo changes.
import sharp from "sharp";
import { copyFile } from "node:fs/promises";

const [portraitSrc, analyticsSrc] = process.argv.slice(2);
if (!portraitSrc || !analyticsSrc) {
  console.error("Usage: node scripts/prepare-images.mjs <portrait> <analytics>");
  process.exit(1);
}

const { width, height } = await sharp(portraitSrc).metadata();

// Tilted polygon around the plaque's name line (1254x1254 source).
const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <filter id="f"><feGaussianBlur stdDeviation="3"/></filter>
  <polygon points="1072,803 1072,776 1254,728 1254,775" fill="#fff" filter="url(#f)"/>
</svg>`);

const blurred = await sharp(portraitSrc)
  .blur(9)
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();

const redacted = await sharp(portraitSrc)
  .composite([{ input: blurred }])
  .png()
  .toBuffer();

await sharp(redacted).webp({ quality: 86 }).toFile("public/images/renz-portrait.webp");

// Face-focused square crop for the sidebar avatar.
await sharp(redacted)
  .extract({ left: 300, top: 120, width: 520, height: 520 })
  .resize(320, 320)
  .webp({ quality: 88 })
  .toFile("public/images/renz-avatar.webp");

await copyFile(analyticsSrc, "public/images/youtube-analytics.png");
console.log("Images written to public/images/");
