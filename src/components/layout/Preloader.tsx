"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { introDone, loadProgress } from "@/lib/bus";
import { setScrollLocked } from "./SmoothScroll";
import RollingNumber from "@/components/ui/RollingNumber";
import { pad } from "@/lib/utils";

const STATUS = ["Surveying the line", "Laying track", "Loading frames", "Compiling", "All clear"];

/**
 * Departure-board style intro. The counter follows the real load progress of
 * the hero's first frames (with a short minimum so it never just flashes) and
 * gives up waiting after a few seconds — the hero keeps streaming frames anyway.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const repeat = sessionStorage.getItem("akt:intro") === "1";
    const MIN = reduce ? 300 : repeat ? 500 : 1500;
    const MAX = repeat ? 2500 : 5500;

    if (!location.hash) {
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
    setScrollLocked(true, "preloader");

    const start = performance.now();
    let shown = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      sessionStorage.setItem("akt:intro", "1");
      const el = root.current!;
      const tl = gsap.timeline({
        delay: reduce ? 0 : 0.45,
        onComplete: () => {
          setGone(true);
        },
      });
      if (reduce) {
        tl.to(el, { autoAlpha: 0, duration: 0.3 }).add(() => {
          setScrollLocked(false, "preloader");
          introDone.set(true);
        }, 0);
        return;
      }
      tl.to(el.querySelectorAll("[data-out]"), { yPercent: -110, duration: 0.7, ease: "expo.in", stagger: 0.04 })
        .add(() => {
          setScrollLocked(false, "preloader");
          introDone.set(true);
        }, "+=0.05")
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.2, ease: "expo.inOut" }, "<");
    };

    const id = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const real = loadProgress.get() * 100;
      const timeCap = Math.min(100, (elapsed / MIN) * 100);
      const target = elapsed > MAX ? 100 : Math.min(real, timeCap);
      if (target > shown) {
        const jump = reduce || repeat ? 100 : 7 + Math.random() * 21;
        shown = Math.min(Math.round(target), Math.round(shown + jump));
        setValue(shown);
      }
      if (shown >= 100) {
        window.clearInterval(id);
        finish();
      }
    }, 240);

    return () => {
      window.clearInterval(id);
      setScrollLocked(false, "preloader");
    };
  }, []);

  if (gone) return null;

  const status = STATUS[Math.min(STATUS.length - 1, Math.floor((value / 100) * (STATUS.length - 1)))];

  return (
    <div
      ref={root}
      aria-hidden="true"
      data-preloader
      className="fixed inset-0 z-[120] flex flex-col justify-between bg-bg p-5 [clip-path:inset(0%_0%_0%_0%)] sm:p-8 lg:p-12"
    >
      <div className="flex items-start justify-between overflow-hidden font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
        <span data-out className="block">
          Aswanth K.T <span className="text-accent" suppressHydrationWarning>©{new Date().getFullYear()}</span>
        </span>
        <span data-out className="hidden sm:block">Portfolio — Vol. 02</span>
        <span data-out className="block text-right">
          Kannur <span className="text-accent">→</span> Production
        </span>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="overflow-hidden">
          <div data-out className="flex items-start pr-[0.2em] text-[clamp(6rem,24vw,22rem)] leading-[0.8] font-medium tracking-[-0.06em]">
            <RollingNumber value={pad(value, 3)} duration={0.9} stagger={0.05} />
            <span className="mt-[0.2em] ml-[0.04em] text-[0.22em] tracking-normal text-accent">%</span>
          </div>
        </div>
        <div className="w-full max-w-xs overflow-hidden pb-2 sm:pb-6">
          <div data-out>
            <div className="mb-3 flex items-center justify-between font-mono text-[11px] tracking-[0.18em] uppercase">
              <span className="flex items-center gap-2">
                <span className="size-1.5 animate-pulse-dot rounded-full bg-accent" />
                {status}
              </span>
              <span className="text-muted">CH {(value * 0.045).toFixed(3).replace(".", "+")}</span>
            </div>
            <div className="h-px w-full bg-line">
              <div className="h-full origin-left bg-accent transition-transform duration-700 ease-[var(--ease-expo)]" style={{ transform: `scaleX(${value / 100})` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
