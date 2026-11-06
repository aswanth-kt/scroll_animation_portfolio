"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const RAMP = " .:-=+*#%@";

type Props = {
  src: string;
  alt: string;
  columns?: number;
  contrast?: number;
  focusY?: number;
  ink?: string;
  className?: string;
};

/**
 * Renders a photo as ASCII on a canvas. Hovering paints the real photo back in
 * through a soft, trailing brush; on touch screens a tap toggles the photo.
 * The animation loop only runs while the brush is moving.
 */
export default function AsciiPortrait({ src, alt, columns = 120, contrast = 115, focusY = 28, ink = "#efe9df", className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const ascii = document.createElement("canvas");
    const photo = document.createElement("canvas");
    const mask = document.createElement("canvas");
    const sampler = document.createElement("canvas");
    const img = new Image();
    let cover = { dx: 0, dy: 0, dw: 0, dh: 0 };
    let dpr = 1;
    let raf = 0;
    let alive = true;
    const pointer = { x: 0, y: 0, inside: false };
    const blobs = Array.from({ length: 6 }, () => ({ x: 0, y: 0 }));
    let strength = 0; // 0..1 fade of the reveal brush

    const build = () => {
      if (!img.naturalWidth) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      for (const c of [canvas, ascii, photo, mask]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      cover = { dx: (canvas.width - dw) / 2, dy: (canvas.height - dh) * (focusY / 100), dw, dh };

      const cellW = canvas.width / columns;
      const cellH = cellW * 1.65;
      const rows = Math.floor(canvas.height / cellH);
      sampler.width = columns;
      sampler.height = rows;
      const s = sampler.getContext("2d", { willReadFrequently: true })!;
      s.drawImage(img, cover.dx / cellW, cover.dy / cellH, cover.dw / cellW, cover.dh / cellH);
      const data = s.getImageData(0, 0, columns, rows).data;

      const a = ascii.getContext("2d")!;
      a.clearRect(0, 0, ascii.width, ascii.height);
      a.font = `${(cellH * 0.98).toFixed(2)}px ui-monospace, monospace`;
      a.textBaseline = "top";
      a.fillStyle = ink;
      const punch = 0.5 + (contrast / 100) * 1.5;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          const i = (r * columns + c) * 4;
          let lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          lum = Math.min(1, Math.max(0, (lum - 0.5) * punch + 0.5));
          const ch = RAMP[Math.round(lum * (RAMP.length - 1))];
          if (ch !== " ") a.fillText(ch, c * cellW, r * cellH);
        }
      }

      const p = photo.getContext("2d")!;
      p.drawImage(img, cover.dx, cover.dy, cover.dw, cover.dh);
      paint();
    };

    const paint = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(ascii, 0, 0);
      if (strength <= 0.001) return;
      const m = mask.getContext("2d")!;
      m.clearRect(0, 0, mask.width, mask.height);
      m.save();
      m.filter = `blur(${18 * dpr}px)`;
      m.fillStyle = `rgba(255,255,255,${strength})`;
      blobs.forEach((b, i) => {
        m.beginPath();
        m.arc(b.x, b.y, 90 * dpr * (1 - (i / blobs.length) * 0.55), 0, Math.PI * 2);
        m.fill();
      });
      m.restore();
      m.globalCompositeOperation = "source-in";
      m.drawImage(photo, 0, 0);
      m.globalCompositeOperation = "source-over";
      ctx.drawImage(mask, 0, 0);
    };

    const loop = () => {
      if (!alive) return;
      const tx = pointer.x * dpr;
      const ty = pointer.y * dpr;
      blobs[0].x += (tx - blobs[0].x) * 0.3;
      blobs[0].y += (ty - blobs[0].y) * 0.3;
      for (let i = 1; i < blobs.length; i++) {
        blobs[i].x += (blobs[i - 1].x - blobs[i].x) * 0.32;
        blobs[i].y += (blobs[i - 1].y - blobs[i].y) * 0.32;
      }
      strength += ((pointer.inside ? 1 : 0) - strength) * 0.12;
      paint();
      const settled = !pointer.inside && strength < 0.005;
      raf = settled ? 0 : requestAnimationFrame(loop);
      if (settled) {
        strength = 0;
        paint();
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      if (!pointer.inside) blobs.forEach((b) => ((b.x = pointer.x * dpr), (b.y = pointer.y * dpr)));
      pointer.inside = true;
      kick();
    };
    const onLeave = () => {
      pointer.inside = false;
      kick();
    };

    img.onload = () => alive && build();
    img.src = src;
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [src, columns, contrast, focusY, ink]);

  return (
    <div className={cn("relative overflow-hidden", className)} data-cursor="Reveal">
      <canvas ref={canvasRef} role="img" aria-label={alt} className="block size-full" />
      {/* Tap-to-reveal for touch screens */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className={cn(
          "pointer-events-none absolute inset-0 size-full object-cover transition-opacity duration-700",
          revealed ? "opacity-100" : "opacity-0",
        )}
        style={{ objectPosition: `50% ${focusY}%` }}
      />
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        className="absolute right-3 bottom-3 rounded-full border border-line-strong bg-bg/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] uppercase backdrop-blur [@media(hover:hover)]:hidden"
      >
        {revealed ? "Show ASCII" : "Tap to reveal"}
      </button>
    </div>
  );
}
