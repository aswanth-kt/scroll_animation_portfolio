"use client";

import { loadProgress } from "@/lib/bus";

export const FRAME_COUNT = 270;
const MOBILE_COUNT = Math.ceil(FRAME_COUNT / 2);

/** Story beats (0-based frame index into the full desktop sequence). */
export const BEATS = { trackEnd: 124, switchEnd: 194, last: FRAME_COUNT - 1 };

export type FrameSet = {
  count: number;
  /** Start streaming the frames beyond the first coarse pass. Safe to call repeatedly. */
  resume: () => void;
  /** Returns the closest loaded image to a 0..FRAME_COUNT-1 frame index. */
  get: (frame: number) => HTMLImageElement | null;
  destroy: () => void;
};

/**
 * Loads the frame sequence coarse-to-fine (every 16th frame, then 8th, 4th…),
 * so scrubbing quickly always has a nearby frame to show while the rest stream in.
 * Small screens get the lighter half-rate WebP set.
 */
export function loadFrames(): FrameSet {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const mobile = window.matchMedia("(max-width: 767px)").matches || conn?.saveData === true;
  const count = mobile ? MOBILE_COUNT : FRAME_COUNT;
  const src = (i: number) =>
    mobile ? `/frames/mobile/${String(i + 1).padStart(4, "0")}.webp` : `/frames/desktop/${String(i + 1).padStart(4, "0")}.jpg`;

  const order: number[] = [];
  const seen = new Set<number>();
  for (const step of [16, 8, 4, 2, 1]) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  if (!seen.has(count - 1)) order.splice(1, 0, count - 1);

  const priority = Math.ceil(count / 16) + 1;
  const images: (HTMLImageElement | null)[] = new Array(count).fill(null);
  const loaded = new Uint8Array(count);
  let priorityDone = 0;
  let cancelled = false;

  // Load in small parallel batches to keep the coarse-to-fine order. Only the first
  // coarse pass loads up front; the rest waits for resume() to save data on quick visits.
  let cursor = 0;
  let resumed = false;
  let inFlight = 0;
  const PARALLEL = 6;
  const next = () => {
    if (cancelled || cursor >= order.length) return;
    if (!resumed && cursor >= priority) return;
    inFlight += 1;
    const position = cursor;
    const i = order[cursor++];
    const img = new Image();
    img.decoding = "async";
    const done = (ok: boolean) => {
      if (cancelled) return;
      if (ok) {
        loaded[i] = 1;
        images[i] = img;
      }
      inFlight -= 1;
      if (position < priority) {
        priorityDone += 1;
        loadProgress.set(Math.min(1, priorityDone / priority));
      }
      next();
    };
    img.onload = () => {
      // decode() keeps the first draw of each frame off the scroll path
      if (img.decode) img.decode().then(() => done(true), () => done(true));
      else done(true);
    };
    img.onerror = () => done(false);
    img.src = src(i);
  };
  for (let k = 0; k < PARALLEL; k++) next();

  return {
    count,
    resume() {
      if (resumed) return;
      resumed = true;
      for (let k = inFlight; k < PARALLEL; k++) next();
    },
    get(frame) {
      const i = Math.max(0, Math.min(count - 1, Math.round((frame / (FRAME_COUNT - 1)) * (count - 1))));
      if (loaded[i]) return images[i];
      for (let d = 1; d < count; d++) {
        if (i - d >= 0 && loaded[i - d]) return images[i - d];
        if (i + d < count && loaded[i + d]) return images[i + d];
      }
      return null;
    },
    destroy() {
      cancelled = true;
    },
  };
}

/** Draws `img` like `object-fit: cover`, with a horizontal focal point. */
export function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, focusX = 0.5) {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = w / h;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;
  let sx = 0;
  let sy = 0;
  if (ir > cr) {
    sw = sh * cr;
    sx = (img.naturalWidth - sw) * focusX;
  } else {
    sh = sw / cr;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
}
