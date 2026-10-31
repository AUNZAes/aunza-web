// The site is plain files with no image server, so every size next/image can ask for is made here, before the build.
// Output: public/images/w/<folder>/<name>-<width>.webp. Not committed; rebuilt on deploy, and skipped when up to date.

import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { extname, join, parse } from "node:path";
import sharp from "sharp";
import { DEVICE_SIZES, IMAGE_SIZES } from "./image-widths.mjs";

const ROOT = "public/images";
const FOLDERS = ["final", "temp"];
const QUALITY = 92; // These images are the product: far above the usual 75.
const WIDTHS = [...IMAGE_SIZES, ...DEVICE_SIZES];

let made = 0;
for (const folder of FOLDERS) {
  const dir = join(ROOT, folder);
  if (!existsSync(dir)) continue;
  const out = join(ROOT, "w", folder);
  mkdirSync(out, { recursive: true });
  for (const file of readdirSync(dir)) {
    if (![".webp", ".png", ".jpg", ".jpeg"].includes(extname(file).toLowerCase())) continue;
    const src = join(dir, file);
    const { width } = await sharp(src).metadata();
    for (const w of WIDTHS) {
      const dest = join(out, `${parse(file).name}-${w}.webp`);
      if (existsSync(dest) && statSync(dest).mtimeMs >= statSync(src).mtimeMs) continue;
      // Asked for the full size or more: keep the original rather than compress it a second time.
      if (w >= width && extname(file).toLowerCase() === ".webp") copyFileSync(src, dest);
      else await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(dest);
      made++;
    }
  }
}
console.log(`[images] ${made} sizes made.`);
