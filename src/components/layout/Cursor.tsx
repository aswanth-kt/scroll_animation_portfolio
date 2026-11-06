"use client";

import { useEffect, useRef } from "react";
import { gsap, hasFinePointer } from "@/lib/gsap";

/**
 * Two-part cursor: a precise dot (no lag) and a trailing ring that grows over
 * interactive elements and turns into a label for anything with `data-cursor="Label"`.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!hasFinePointer() || !dot.current || !ring.current || !label.current) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const setDotX = gsap.quickSetter(dot.current, "x", "px");
    const setDotY = gsap.quickSetter(dot.current, "y", "px");
    const ringX = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3.out" });
    let mode = "";
    let visible = false;

    const setMode = (next: string, text = "") => {
      if (next === mode && label.current!.textContent === text) return;
      mode = next;
      label.current!.textContent = text;
      ring.current!.dataset.mode = next;
      dot.current!.dataset.mode = next;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!visible) {
        visible = true;
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
        gsap.set(ring.current, { x: e.clientX, y: e.clientY });
      }
      setDotX(e.clientX);
      setDotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      if (labelled) return setMode("label", labelled.dataset.cursor ?? "");
      if (t.closest("input, textarea, [contenteditable]")) return setMode("text");
      if (t.closest("a, button, [role='button'], label, select, summary")) return setMode("link");
      setMode("");
    };
    const onLeave = () => {
      visible = false;
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
    };
    const onDown = () => gsap.to(ring.current, { scale: 0.8, duration: 0.2 });
    const onUp = () => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div
        ref={ring}
        className="group/c invisible fixed top-0 left-0 grid size-9 -translate-1/2 place-items-center rounded-full border border-fg/40 opacity-0 transition-[width,height,background-color,border-color] duration-500 ease-[var(--ease-expo)] data-[mode=label]:size-24 data-[mode=label]:border-transparent data-[mode=label]:bg-accent data-[mode=link]:size-14 data-[mode=link]:border-accent data-[mode=text]:size-0 data-[mode=text]:border-transparent"
      >
        <span
          ref={label}
          className="font-mono text-[11px] font-medium tracking-wider whitespace-nowrap text-accent-ink uppercase opacity-0 transition-opacity duration-300 group-data-[mode=label]/c:opacity-100"
        />
      </div>
      <div
        ref={dot}
        className="invisible fixed top-0 left-0 size-1.5 -translate-1/2 rounded-full bg-fg opacity-0 mix-blend-difference transition-[width,height,opacity] duration-300 data-[mode=label]:size-0 data-[mode=text]:h-5 data-[mode=text]:w-0.5 data-[mode=text]:rounded-none"
      />
    </div>
  );
}
