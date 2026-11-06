"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { introDone } from "@/lib/bus";

/** Scroll progress bar, layout refreshes and a hello for curious devs. */
export default function Effects() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3, refreshPriority: -2 },
    });
  });

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    const unsub = introDone.subscribe((done) => done && requestAnimationFrame(refresh));
    window.addEventListener("load", refresh);

    console.log(
      "%cAKT%c  Hey, fellow developer 👋  Reading the source? I'd love to talk: aswanthkt.official@gmail.com",
      "background:#d9bb84;color:#0b0a09;font-weight:700;padding:4px 8px;border-radius:4px",
      "color:inherit",
    );
    return () => {
      unsub();
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[85] h-[2px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
    </div>
  );
}
