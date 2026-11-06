/**
 * Prepares the hero's scroll-scrubbed frame sequence.
 *
 *   public/frames/desktop/0001.jpg …  every source frame, copied as-is
 *                                    (the source JPGs are already tightly compressed)
 *   public/frames/mobile/0001.webp …  every 2nd frame, 854px wide, WebP
 *
 * Usage:  npm run frames -- <folder-with-source-jpgs>
 * Source files are sorted by name, e.g. ezgif-frame-001.jpg … ezgif-frame-270.jpg.
 * After running, update FRAME_COUNT in src/components/hero/frames.ts if the count changed.
 */
import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const src = process.argv[2];
if (!src) {
  console.error("Pass the folder containing the source JPG frames.");
  process.exit(1);
}

const root = path.resolve(import.meta.dirname, "..");
const out = {
  desktop: path.join(root, "public/frames/desktop"),
  mobile: path.join(root, "public/frames/mobile"),
};
for (const dir of Object.values(out)) {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
}

const files = (await readdir(src)).filter((f) => /\.jpe?g$/i.test(f)).sort();
for (const [index, file] of files.entries()) {
  const i = index + 1;
  const input = path.join(src, file);
  await copyFile(input, path.join(out.desktop, `${String(i).padStart(4, "0")}.jpg`));
  if (i % 2 === 1) {
    const m = String((i + 1) / 2).padStart(4, "0");
    await sharp(input).resize({ width: 854 }).webp({ quality: 50, effort: 6 }).toFile(path.join(out.mobile, `${m}.webp`));
  }
}
console.log(`Prepared ${files.length} desktop frames and ${Math.ceil(files.length / 2)} mobile frames.`);
