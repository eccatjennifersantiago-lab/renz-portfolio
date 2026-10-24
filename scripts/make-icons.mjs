// Generates the favicon set and slims the display images.
// Usage: node scripts/make-icons.mjs
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

// Release file handles straight away so files can be rewritten in place (Windows).
sharp.cache(false);

const AVATAR = "public/images/renz-avatar.webp";
const circle = (size) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`);

// Round avatar icon (192px) with a transparent background (browsers, Android).
const icon192 = await sharp(AVATAR)
  .resize(192, 192)
  .composite([{ input: circle(192), blend: "dest-in" }])
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toBuffer();
await writeFile("src/app/icon.png", icon192);

// Apple touch icon: square, no transparency (iOS rounds it itself).
await sharp(AVATAR).resize(180, 180).flatten({ background: "#151515" }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile("src/app/apple-icon.png");

// favicon.ico holding a 48px PNG (supported by all current browsers).
const png48 = await sharp(icon192).resize(48, 48).png().toBuffer();
const header = Buffer.alloc(6 + 16);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(48, 6); // width
header.writeUInt8(48, 7); // height
header.writeUInt8(0, 8); // palette
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png48.length, 14); // image size
header.writeUInt32LE(22, 18); // image offset
await writeFile("src/app/favicon.ico", Buffer.concat([header, png48]));

// Display copies sized for how large they actually appear on the page.
const portrait = await sharp("public/images/renz-portrait.webp").metadata();
if (portrait.width > 960) {
  const buf = await sharp("public/images/renz-portrait.webp").resize(960).webp({ quality: 84 }).toBuffer();
  await writeFile("public/images/renz-portrait.webp", buf);
}
await sharp("public/images/youtube-analytics.png").webp({ quality: 90 }).toFile("public/images/youtube-analytics.webp");

console.log("Icons and display images written.");
