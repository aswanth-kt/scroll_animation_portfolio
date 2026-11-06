"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

let instance: Lenis | null = null;

/** Smooth-scrolls to a selector / element, falling back to native scrolling. */
export function scrollToTarget(target: string | HTMLElement | number) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView();
}

const locks = new Set<string>();

/** Keyed scroll lock, so the preloader, menu and palette can't unlock each other. */
export function setScrollLocked(locked: boolean, key: string) {
  if (locked) locks.add(key);
  else locks.delete(key);
  applyLock();
}

function applyLock() {
  const any = locks.size > 0;
  if (instance) {
    if (any) instance.stop();
    else instance.start();
  }
  document.documentElement.style.overflow = any ? "hidden" : "";
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    // Nested scrollers (elements with `data-scroll-nested`, e.g. the terminal output) scroll
    // natively while they still have room in the wheel's direction; at their top/bottom edge
    // Lenis takes over and the page keeps moving — no scroll traps.
    let wheelDelta = 0;
    const trackWheel = (e: WheelEvent) => {
      wheelDelta = e.deltaY;
    };
    window.addEventListener("wheel", trackWheel, { capture: true, passive: true });
    const canScrollNested = (node: HTMLElement) => {
      if (!node.hasAttribute("data-scroll-nested")) return false;
      const max = node.scrollHeight - node.clientHeight;
      if (max <= 1) return false;
      if (wheelDelta > 0) return node.scrollTop < max - 1;
      if (wheelDelta < 0) return node.scrollTop > 1;
      return false;
    };

    const l = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, prevent: canScrollNested });
    instance = l;
    applyLock();
    l.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(l);

    // Same-page anchor links go through Lenis.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const hash = a.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      l.scrollTo(el as HTMLElement, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("wheel", trackWheel, { capture: true });
      gsap.ticker.remove(tick);
      l.destroy();
      instance = null;
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
