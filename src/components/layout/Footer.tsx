"use client";

import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/gsap";
import { nav, site } from "@/data/content";
import { paletteOpen } from "@/lib/bus";
import { scrollToTarget } from "./SmoothScroll";
import Magnetic from "@/components/ui/Magnetic";
import RollText from "@/components/ui/RollText";
import { ArrowUp } from "@/components/ui/Icons";

const WORD = "ASWANTH K.T";

export default function Footer() {
  const wordRef = useRef<HTMLDivElement>(null);

  // Letters swell towards the pointer (variable font weight).
  useEffect(() => {
    const el = wordRef.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    const letters = Array.from(el.querySelectorAll<HTMLElement>("[data-l]"));
    const weights = letters.map(() => 300);
    let target = letters.map(() => 300);
    let raf = 0;
    let running = false;

    const loop = () => {
      let moving = false;
      letters.forEach((l, i) => {
        weights[i] += (target[i] - weights[i]) * 0.14;
        if (Math.abs(target[i] - weights[i]) > 0.5) moving = true;
        l.style.fontWeight = String(Math.round(weights[i]));
      });
      running = moving;
      raf = moving ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    const onMove = (e: PointerEvent) => {
      target = letters.map((l) => {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        return 300 + 600 * Math.max(0, 1 - d / (window.innerWidth * 0.22));
      });
      start();
    };
    const onLeave = () => {
      target = letters.map(() => 300);
      start();
    };
    const zone = el.parentElement!;
    zone.addEventListener("pointermove", onMove);
    zone.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-line pt-14">
      <div className="container-x flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <p className="eyebrow mb-3">Shortcut</p>
          <p className="text-fg/80">
            Press{" "}
            <button type="button" onClick={() => paletteOpen.set(true)} className="rounded-md border border-line px-1.5 py-0.5 font-mono text-xs text-fg hover:border-accent hover:text-accent">
              ⌘K
            </button>{" "}
            anywhere to jump around, copy my email or open a project.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm sm:grid-cols-3">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="group text-fg/70 hover:text-fg">
              <RollText text={n.label} />
            </a>
          ))}
          <a href={site.links.resume} target="_blank" rel="noopener noreferrer" className="group text-fg/70 hover:text-fg">
            <RollText text="Résumé ↗" />
          </a>
        </nav>
        <Magnetic>
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="group grid size-20 place-items-center rounded-full border border-line-strong transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
            aria-label="Back to top"
          >
            <ArrowUp size={22} className="transition-transform duration-500 group-hover:-translate-y-1" />
          </button>
        </Magnetic>
      </div>

      <div className="mt-16 select-none md:mt-20">
        <div
          ref={wordRef}
          aria-hidden="true"
          className="flex justify-center text-[clamp(3.2rem,15.4vw,19rem)] leading-[0.8] font-light tracking-[-0.05em] whitespace-nowrap text-fg"
        >
          {Array.from(WORD).map((c, i) => (
            <span key={i} data-l className="inline-block">
              {c === " " ? " " : c}
            </span>
          ))}
        </div>
      </div>

      <div className="container-x flex flex-col gap-3 border-t border-line py-6 eyebrow sm:flex-row sm:items-center sm:justify-between">
        <span suppressHydrationWarning>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <span>Designed & built in Kannur, Kerala</span>
        <span>Next.js · GSAP · Lenis</span>
      </div>
    </footer>
  );
}
